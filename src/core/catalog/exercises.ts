/**
 * Catálogo agregado. Cada modalidade vive no seu arquivo:
 *  - strength.ts      — Musculação (fase 1: 150 exercícios em máquinas, Smith e polias)
 *  - calisthenics.ts  — Calistenia (fase 2)
 *  - martial.ts       — Artes marciais + combos (fase 3)
 */
import { Exercise } from '../domain/types';
import { CALISTHENICS } from './calisthenics';
import { COMBOS, MARTIAL } from './martial';
import { STRENGTH } from './strength';

export { COMBOS };
export { STRENGTH, STRENGTH_SHARED_NUMBERS } from './strength';

export const EXERCISES: Exercise[] = [...STRENGTH, ...CALISTHENICS, ...MARTIAL];
export const EXERCISE_BY_ID: Record<string, Exercise> = Object.fromEntries(EXERCISES.map((e) => [e.id, e]));

/**
 * IDs do catálogo antigo (peso livre, v1) → exercício equivalente do catálogo novo.
 * Mantém sessões, fichas e treinos salvos no aparelho funcionando após a troca do catálogo.
 */
export const LEGACY_EXERCISE_IDS: Record<string, string> = {
  bench_press: 'supino_reto_smith',
  incline_db_press: 'supino_inclinado_articulado',
  overhead_press: 'desenvolvimento_militar_smith',
  lateral_raise: 'elevacao_lateral_maquina',
  triceps_rope: 'triceps_pulley_corda',
  lat_pulldown: 'puxada_frontal_aberta',
  barbell_row: 'remada_curvada_smith_pronada',
  seated_row: 'remada_baixa_triangulo',
  barbell_curl: 'rosca_direta_polia_barra',
  hammer_curl: 'rosca_martelo_polia_corda',
  wrist_curl: 'rosca_punho_polia',
  back_squat: 'agachamento_smith',
  deadlift: 'terra_romeno_smith',
  romanian_dl: 'stiff_smith',
  leg_press: 'leg_press_45',
  calf_raise: 'panturrilha_em_pe_maquina',
  cable_crunch: 'abdominal_polia_ajoelhado',
  face_pull: 'face_pull_polia',
  // v2 → catálogo de calistenia da free-exercise-db (fase 2)
  push_up: 'pushups',
  pull_up: 'pullups',
  dips: 'dips_triceps_version',
  bulgarian_split: 'suspended_split_squat',
  front_lever: 'hanging_pike',
  planche: 'push_ups_with_feet_elevated',
  l_sit: 'knee_hip_raise_on_parallel_bars',
  handstand: 'handstand_push_ups',
  hollow_hold: 'plank',
  pistol_squat: 'single_leg_high_box_squat',
  burpee: 'mountain_climbers',
};

/** Resolve um id (inclusive legado) para o id atual. */
export const resolveExerciseId = <T extends string | null | undefined>(id: T): T =>
  (id && !EXERCISE_BY_ID[id] && LEGACY_EXERCISE_IDS[id] ? LEGACY_EXERCISE_IDS[id] : id) as T;

export const getExercise = (id: string | null | undefined) => (id ? EXERCISE_BY_ID[resolveExerciseId(id)] : undefined);

export const COMBO_BY_ID = Object.fromEntries(COMBOS.map((c) => [c.id, c]));
