-- =====================================================================
-- Treine — schema inicial (Supabase / PostgreSQL 15+)
-- Modelagem polimórfica: tabelas relacionais comuns às 3 modalidades +
-- colunas JSONB tipadas (validadas por CHECK aqui e por Zod no app).
-- Todas as tabelas de usuário têm (id uuid gerado no cliente, updated_at,
-- deleted_at) para suportar sync offline-first por "last-write-wins".
-- =====================================================================

create extension if not exists "pgcrypto";
create extension if not exists "pg_trgm";

-- ---------------------------------------------------------------------
-- Tipos
-- ---------------------------------------------------------------------
create type modality        as enum ('strength', 'martial', 'calisthenics');
create type tracking_mode   as enum ('reps', 'hold', 'round', 'reps_or_hold');
create type experience_lvl  as enum ('beginner', 'intermediate', 'advanced');
create type goal_kind       as enum ('hypertrophy', 'strength', 'endurance', 'skill', 'conditioning', 'fat_loss');
create type session_status  as enum ('planned', 'in_progress', 'completed', 'abandoned');
create type circuit_kind    as enum ('straight', 'superset', 'circuit', 'emom', 'amrap', 'rounds');
create type body_view       as enum ('front', 'back');
create type sex_kind        as enum ('male', 'female', 'other');

-- ---------------------------------------------------------------------
-- Função utilitária: updated_at automático
-- ---------------------------------------------------------------------
create or replace function set_updated_at() returns trigger
language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end $$;

-- ---------------------------------------------------------------------
-- Perfil
-- ---------------------------------------------------------------------
create table profiles (
  id               uuid primary key references auth.users(id) on delete cascade,
  display_name     text not null check (char_length(display_name) between 1 and 60),
  avatar_url       text,
  birth_date       date,
  sex              sex_kind,
  height_cm        numeric(5,1) check (height_cm between 80 and 260),
  goal             goal_kind default 'hypertrophy',
  level            experience_lvl default 'intermediate',
  weekly_target    smallint not null default 4 check (weekly_target between 1 and 14),
  preferences      jsonb not null default '{}'::jsonb
                   check (jsonb_typeof(preferences) = 'object'),
  -- ex.: {"units":"kg","tts":true,"tts_rate":1.0,"default_rest_s":90,"haptics":true}
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);
create trigger trg_profiles_updated before update on profiles
  for each row execute function set_updated_at();

-- ---------------------------------------------------------------------
-- Catálogo anatômico (dados globais, só leitura para usuários)
-- ---------------------------------------------------------------------
create table muscle_groups (
  id              text primary key,                -- 'chest', 'lats', 'quads'...
  name_pt         text not null,
  region          text not null check (region in ('upper','core','lower','full')),
  views           body_view[] not null,            -- onde aparece na silhueta
  svg_path_ids    text[] not null default '{}',    -- ids dos paths no SVG anatômico
  recovery_tau_h  numeric(5,1) not null check (recovery_tau_h between 6 and 72),
  -- constante de tempo da recuperação exponencial (ver algoritmo de fadiga)
  size_factor     numeric(3,2) not null default 1.0 check (size_factor between 0.3 and 2.0)
);

create table exercises (
  id               uuid primary key default gen_random_uuid(),
  owner_id         uuid references auth.users(id) on delete cascade, -- null = catálogo global
  slug             text not null,
  name_pt          text not null,
  modality         modality not null,
  tracking         tracking_mode not null,
  level            experience_lvl not null default 'beginner',
  goals            goal_kind[] not null default '{}',
  equipment        text[] not null default '{}',
  media_url        text,
  instructions     text,
  -- Atributos específicos da modalidade, validados por CHECK abaixo.
  -- strength:     {"default_rest_s":90,"is_compound":true,"bw_factor":0}
  -- martial:      {"style":"boxing","strikes":["jab","cross"],"stance":"orthodox"}
  -- calisthenics: {"progression_tree":"front_lever","progression_level":4,"max_level":5}
  attributes       jsonb not null default '{}'::jsonb,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  deleted_at       timestamptz,
  unique (owner_id, slug),
  constraint exercises_attributes_shape check (
    jsonb_typeof(attributes) = 'object' and
    case modality
      when 'martial' then attributes ? 'style'
      when 'calisthenics' then (not attributes ? 'progression_level')
                               or (attributes->>'progression_level')::int between 1 and 10
      else true
    end
  )
);
create index exercises_modality_idx on exercises (modality) where deleted_at is null;
create index exercises_name_trgm_idx on exercises using gin (name_pt gin_trgm_ops);
create index exercises_goals_idx on exercises using gin (goals);
create trigger trg_exercises_updated before update on exercises
  for each row execute function set_updated_at();

-- Relação N:N exercício ↔ músculo com papel e peso de ativação.
create table exercise_muscles (
  exercise_id   uuid not null references exercises(id) on delete cascade,
  muscle_id     text not null references muscle_groups(id),
  role          text not null check (role in ('primary','secondary','stabilizer')),
  activation    numeric(3,2) not null check (activation between 0 and 1),
  primary key (exercise_id, muscle_id)
);
create index exercise_muscles_muscle_idx on exercise_muscles (muscle_id);

-- Progressões de calistenia (árvore: cada nível aponta para o próximo).
create table progression_steps (
  tree_id        text not null,                       -- 'front_lever'
  level          smallint not null check (level between 1 and 10),
  exercise_id    uuid not null references exercises(id) on delete cascade,
  unlock_rule    jsonb not null default '{}'::jsonb,   -- {"hold_s":20,"sets":3}
  primary key (tree_id, level)
);

-- Combos técnicos de artes marciais (globais ou do usuário).
create table combos (
  id            uuid primary key default gen_random_uuid(),
  owner_id      uuid references auth.users(id) on delete cascade,
  style         text not null check (style in ('boxing','muay_thai','kickboxing','mma')),
  name_pt       text not null,
  strikes       text[] not null check (cardinality(strikes) between 1 and 12),
  callout       text not null,          -- texto falado pelo TTS: "Um, um, dois"
  difficulty    smallint not null default 1 check (difficulty between 1 and 5),
  created_at    timestamptz not null default now()
);
create index combos_style_idx on combos (style, difficulty);

-- ---------------------------------------------------------------------
-- Planejamento: Rotina > Dia > Bloco (circuito) > Item
-- ---------------------------------------------------------------------
create table routines (
  id            uuid primary key,
  user_id       uuid not null references auth.users(id) on delete cascade,
  name          text not null,
  modality      modality not null,
  goal          goal_kind,
  description   text,
  is_active     boolean not null default true,
  cycle_week    smallint,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  deleted_at    timestamptz
);
create index routines_user_idx on routines (user_id) where deleted_at is null;
create trigger trg_routines_updated before update on routines
  for each row execute function set_updated_at();

create table routine_days (
  id            uuid primary key,
  routine_id    uuid not null references routines(id) on delete cascade,
  position      smallint not null,
  name          text not null,                 -- "02 – Dorsais, Bíceps & Antebraço"
  weekday       smallint check (weekday between 0 and 6),
  est_minutes   smallint,
  updated_at    timestamptz not null default now(),
  deleted_at    timestamptz,
  unique (routine_id, position)
);
create trigger trg_routine_days_updated before update on routine_days
  for each row execute function set_updated_at();

create table routine_items (
  id            uuid primary key,
  day_id        uuid not null references routine_days(id) on delete cascade,
  position      smallint not null,
  block_key     smallint not null default 0,     -- itens com mesmo block_key formam um circuito
  block_kind    circuit_kind not null default 'straight',
  exercise_id   uuid references exercises(id),   -- null para round "freestyle"
  modality      modality not null,
  -- Prescrição polimórfica (a "receita" das séries/rounds). Ver CHECK.
  -- strength:     {"sets":[{"reps":10,"kg":60,"rest_s":90,"rpe":8}]}
  -- martial:      {"rounds":10,"work_s":180,"rest_s":60,"prepare_s":10,
  --                "combo_ids":["..."],"callout_every_s":15,"randomize":false}
  -- calisthenics: {"sets":[{"mode":"hold","target_s":30,"rest_s":120,"level":4,"load_kg":0}],
  --                "circuit":{"kind":"emom","minutes":10}}
  prescription  jsonb not null,
  notes         text,
  updated_at    timestamptz not null default now(),
  deleted_at    timestamptz,
  unique (day_id, position),
  constraint routine_items_prescription_shape check (
    jsonb_typeof(prescription) = 'object' and
    case modality
      when 'strength'     then jsonb_typeof(prescription->'sets') = 'array'
      when 'martial'      then (prescription->>'rounds')::int > 0
                               and (prescription->>'work_s')::int > 0
      when 'calisthenics' then jsonb_typeof(prescription->'sets') = 'array'
    end
  )
);
create index routine_items_day_idx on routine_items (day_id, position);
create trigger trg_routine_items_updated before update on routine_items
  for each row execute function set_updated_at();

-- ---------------------------------------------------------------------
-- Execução: Sessão > Bloco > Entrada (série / round / hold)
-- ---------------------------------------------------------------------
create table sessions (
  id              uuid primary key,              -- gerado offline no device
  user_id         uuid not null references auth.users(id) on delete cascade,
  routine_day_id  uuid references routine_days(id) on delete set null,
  modality        modality not null,
  title           text not null,
  status          session_status not null default 'in_progress',
  started_at      timestamptz not null,
  ended_at        timestamptz,
  active_seconds  integer not null default 0 check (active_seconds >= 0),
  rest_seconds    integer not null default 0 check (rest_seconds >= 0),
  perceived_rpe   numeric(3,1) check (perceived_rpe between 1 and 10),
  photo_url       text,
  notes           text,
  -- Métricas consolidadas calculadas no fim (desnormalizadas p/ listas rápidas):
  -- strength: {"tonnage_kg":12450,"sets":18,"reps":152,"prs":2}
  -- martial:  {"rounds":10,"work_s":1800,"combos_called":140,"avg_hr":154}
  -- cali:     {"total_hold_s":240,"total_reps":85,"max_level":4,"load_kg":10}
  summary         jsonb not null default '{}'::jsonb check (jsonb_typeof(summary) = 'object'),
  client_rev      bigint not null default 0,      -- contador monotônico do device (sync)
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  deleted_at      timestamptz,
  constraint sessions_time_order check (ended_at is null or ended_at >= started_at)
);
create index sessions_user_started_idx on sessions (user_id, started_at desc) where deleted_at is null;
create index sessions_user_updated_idx on sessions (user_id, updated_at);   -- pull incremental
create index sessions_summary_gin on sessions using gin (summary jsonb_path_ops);
create trigger trg_sessions_updated before update on sessions
  for each row execute function set_updated_at();

create table session_entries (
  id              uuid primary key,
  session_id      uuid not null references sessions(id) on delete cascade,
  user_id         uuid not null references auth.users(id) on delete cascade,
  exercise_id     uuid references exercises(id),
  routine_item_id uuid references routine_items(id) on delete set null,
  modality        modality not null,
  block_index     smallint not null,
  entry_index     smallint not null,          -- nº da série / round
  kind            tracking_mode not null,
  completed_at    timestamptz,
  -- Resultado polimórfico (o que foi executado):
  -- strength:     {"reps":8,"kg":80,"rpe":8.5,"is_warmup":false,"substituted_from":null}
  -- martial:      {"work_s":180,"rest_s":60,"combo_ids":["..."],"freestyle":false,"intensity":0.8}
  -- calisthenics: {"mode":"hold","hold_s":28,"target_s":30,"reps":null,"level":4,"load_kg":-10}
  result          jsonb not null,
  -- Estímulo muscular calculado para este registro (cache do algoritmo de fadiga)
  stimulus        numeric(6,2) not null default 0 check (stimulus >= 0),
  updated_at      timestamptz not null default now(),
  deleted_at      timestamptz,
  unique (session_id, block_index, entry_index),
  constraint session_entries_result_shape check (
    jsonb_typeof(result) = 'object' and
    case modality
      when 'strength' then
        (result->>'reps')::int >= 0 and (result->>'kg')::numeric >= 0
      when 'martial' then
        (result->>'work_s')::int > 0
      when 'calisthenics' then
        (result->>'mode') in ('reps','hold')
        and ((result->>'mode') <> 'hold' or (result->>'hold_s')::int >= 0)
        and ((result->>'mode') <> 'reps' or (result->>'reps')::int >= 0)
    end
  )
);
create index session_entries_session_idx on session_entries (session_id, block_index, entry_index);
create index session_entries_user_exercise_idx on session_entries (user_id, exercise_id, completed_at desc);
create trigger trg_session_entries_updated before update on session_entries
  for each row execute function set_updated_at();

-- ---------------------------------------------------------------------
-- Fadiga muscular: eventos de estímulo (append-only) + view do estado atual
-- ---------------------------------------------------------------------
create table muscle_stimuli (
  id            bigint generated always as identity primary key,
  user_id       uuid not null references auth.users(id) on delete cascade,
  session_id    uuid not null references sessions(id) on delete cascade,
  muscle_id     text not null references muscle_groups(id),
  occurred_at   timestamptz not null,
  load          numeric(6,2) not null check (load >= 0),   -- pontos de fadiga (0–100+)
  unique (session_id, muscle_id)
);
create index muscle_stimuli_user_time_idx on muscle_stimuli (user_id, occurred_at desc);

-- Fadiga atual = min(100, Σ load · e^(−Δt/τ)), apenas últimos 7 dias.
create or replace view muscle_fatigue_now
with (security_invoker = true) as
select s.user_id,
       s.muscle_id,
       least(100, sum(s.load * exp(-extract(epoch from (now() - s.occurred_at)) / 3600.0
                                   / m.recovery_tau_h)))::numeric(5,1) as fatigue_pct,
       max(s.occurred_at) as last_trained_at
from muscle_stimuli s
join muscle_groups m on m.id = s.muscle_id
where s.occurred_at > now() - interval '7 days'
group by s.user_id, s.muscle_id;

-- ---------------------------------------------------------------------
-- Biometria
-- ---------------------------------------------------------------------
create table body_measurements (
  id              uuid primary key,
  user_id         uuid not null references auth.users(id) on delete cascade,
  measured_at     timestamptz not null,
  weight_kg       numeric(5,2) check (weight_kg between 20 and 400),
  body_fat_pct    numeric(4,1) check (body_fat_pct between 2 and 70),
  muscle_mass_kg  numeric(5,2),
  -- {"chest_cm":102,"waist_cm":82,"hip_cm":98,"arm_r_cm":38,"thigh_r_cm":58,...}
  circumferences  jsonb not null default '{}'::jsonb check (jsonb_typeof(circumferences) = 'object'),
  source          text not null default 'manual' check (source in ('manual','bioimpedance','scale','health_kit')),
  updated_at      timestamptz not null default now(),
  deleted_at      timestamptz
);
create index body_measurements_user_idx on body_measurements (user_id, measured_at desc);
create trigger trg_body_measurements_updated before update on body_measurements
  for each row execute function set_updated_at();

create table body_goals (
  user_id          uuid primary key references auth.users(id) on delete cascade,
  target_weight_kg numeric(5,2),
  target_fat_pct   numeric(4,1),
  updated_at       timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------
alter table profiles          enable row level security;
alter table exercises         enable row level security;
alter table exercise_muscles  enable row level security;
alter table muscle_groups     enable row level security;
alter table progression_steps enable row level security;
alter table combos            enable row level security;
alter table routines          enable row level security;
alter table routine_days      enable row level security;
alter table routine_items     enable row level security;
alter table sessions          enable row level security;
alter table session_entries   enable row level security;
alter table muscle_stimuli    enable row level security;
alter table body_measurements enable row level security;
alter table body_goals        enable row level security;

create policy "own profile" on profiles for all using (id = auth.uid()) with check (id = auth.uid());

-- Catálogo: leitura de globais + próprios; escrita só dos próprios.
create policy "read catalog"  on exercises for select using (owner_id is null or owner_id = auth.uid());
create policy "write own ex"  on exercises for all    using (owner_id = auth.uid()) with check (owner_id = auth.uid());
create policy "read ex musc"  on exercise_muscles  for select using (true);
create policy "read muscles"  on muscle_groups     for select using (true);
create policy "read progr"    on progression_steps for select using (true);
create policy "read combos"   on combos for select using (owner_id is null or owner_id = auth.uid());
create policy "write combos"  on combos for all    using (owner_id = auth.uid()) with check (owner_id = auth.uid());

create policy "own routines" on routines for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "own days" on routine_days for all
  using (exists (select 1 from routines r where r.id = routine_id and r.user_id = auth.uid()))
  with check (exists (select 1 from routines r where r.id = routine_id and r.user_id = auth.uid()));
create policy "own items" on routine_items for all
  using (exists (select 1 from routine_days d join routines r on r.id = d.routine_id
                 where d.id = day_id and r.user_id = auth.uid()))
  with check (exists (select 1 from routine_days d join routines r on r.id = d.routine_id
                      where d.id = day_id and r.user_id = auth.uid()));

create policy "own sessions" on sessions          for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "own entries"  on session_entries   for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "own stimuli"  on muscle_stimuli    for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "own body"     on body_measurements for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "own goals"    on body_goals        for all using (user_id = auth.uid()) with check (user_id = auth.uid());

-- ---------------------------------------------------------------------
-- Sync: pull incremental por tabela (o cliente envia o último cursor)
-- ---------------------------------------------------------------------
create or replace function pull_changes(since timestamptz)
returns jsonb
language sql stable security invoker as $$
  select jsonb_build_object(
    'routines',          coalesce((select jsonb_agg(r) from routines r          where r.updated_at > since), '[]'),
    'routine_days',      coalesce((select jsonb_agg(d) from routine_days d      where d.updated_at > since), '[]'),
    'routine_items',     coalesce((select jsonb_agg(i) from routine_items i     where i.updated_at > since), '[]'),
    'sessions',          coalesce((select jsonb_agg(s) from sessions s          where s.updated_at > since), '[]'),
    'session_entries',   coalesce((select jsonb_agg(e) from session_entries e   where e.updated_at > since), '[]'),
    'body_measurements', coalesce((select jsonb_agg(b) from body_measurements b where b.updated_at > since), '[]'),
    'server_time',       to_jsonb(now())
  );
$$;
