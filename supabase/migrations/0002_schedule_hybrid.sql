-- =====================================================================
-- Treine — 0002: agendamento por data, rotinas híbridas e ciclos (circuitos)
-- =====================================================================

-- ---------------------------------------------------------------------
-- Treinos agendados (calendário): uma ficha (routine_day) numa data
-- ---------------------------------------------------------------------
create table scheduled_workouts (
  id              uuid primary key,                       -- gerado no device
  user_id         uuid not null references auth.users(id) on delete cascade,
  scheduled_for   date not null,
  routine_id      uuid not null references routines(id) on delete cascade,
  routine_day_id  uuid not null references routine_days(id) on delete cascade,
  remind_at       timestamptz,                            -- lembrete opcional (push/local)
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  deleted_at      timestamptz
);
create index scheduled_workouts_user_date_idx on scheduled_workouts (user_id, scheduled_for) where deleted_at is null;
create index scheduled_workouts_user_updated_idx on scheduled_workouts (user_id, updated_at);
create trigger trg_scheduled_workouts_updated before update on scheduled_workouts
  for each row execute function set_updated_at();

alter table scheduled_workouts enable row level security;
create policy "own schedule" on scheduled_workouts for all
  using (user_id = auth.uid()) with check (user_id = auth.uid());

-- Status derivado: concluído se existe sessão concluída da mesma ficha no mesmo dia.
create or replace view scheduled_workouts_status
with (security_invoker = true) as
select w.*,
       exists (
         select 1 from sessions s
         where s.user_id = w.user_id
           and s.routine_day_id = w.routine_day_id
           and s.status = 'completed'
           and s.started_at::date = w.scheduled_for
       ) as completed
from scheduled_workouts w
where w.deleted_at is null;

-- ---------------------------------------------------------------------
-- Rotinas e sessões híbridas (itens de mais de uma modalidade)
-- `modality` continua = modalidade do primeiro item (compatibilidade).
-- ---------------------------------------------------------------------
alter table routines add column is_hybrid boolean not null default false;
alter table sessions add column is_hybrid boolean not null default false;

-- ---------------------------------------------------------------------
-- Ciclos (circuitos): itens consecutivos com o mesmo block_key e
-- block_kind = 'circuit' são executados em sequência, sem descanso entre
-- eles; o descanso (circuit_rest_s) acontece só ao fim de cada volta.
-- ---------------------------------------------------------------------
alter table routine_items
  add column circuit_rounds smallint check (circuit_rounds between 1 and 50),
  add column circuit_rest_s smallint check (circuit_rest_s between 0 and 900);

alter table routine_items add constraint routine_items_circuit_fields check (
  (block_kind = 'circuit') = (circuit_rounds is not null and circuit_rest_s is not null)
);

-- No circuito, entry_index de session_entries = volta - 1 (uma entrada por exercício por volta).

-- Pull incremental inclui os agendamentos
create or replace function pull_changes(since timestamptz)
returns jsonb
language sql stable security invoker as $$
  select jsonb_build_object(
    'routines',           coalesce((select jsonb_agg(r) from routines r           where r.updated_at > since), '[]'),
    'routine_days',       coalesce((select jsonb_agg(d) from routine_days d       where d.updated_at > since), '[]'),
    'routine_items',      coalesce((select jsonb_agg(i) from routine_items i      where i.updated_at > since), '[]'),
    'sessions',           coalesce((select jsonb_agg(s) from sessions s           where s.updated_at > since), '[]'),
    'session_entries',    coalesce((select jsonb_agg(e) from session_entries e    where e.updated_at > since), '[]'),
    'body_measurements',  coalesce((select jsonb_agg(b) from body_measurements b  where b.updated_at > since), '[]'),
    'scheduled_workouts', coalesce((select jsonb_agg(w) from scheduled_workouts w where w.updated_at > since), '[]'),
    'server_time',        to_jsonb(now())
  );
$$;
