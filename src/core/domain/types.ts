// Modelo de domínio polimórfico — espelha supabase/migrations/0001_init.sql.
// As colunas JSONB (prescription / result / summary) são validadas por Zod.
import { z } from 'zod';

export type Modality = 'strength' | 'martial' | 'calisthenics';
export type Level = 'beginner' | 'intermediate' | 'advanced';
export type Goal = 'hypertrophy' | 'strength' | 'endurance' | 'skill' | 'conditioning' | 'fat_loss';
export type TrackingMode = 'reps' | 'hold' | 'round' | 'reps_or_hold';
export type BodyView = 'front' | 'back';

export const MODALITY_LABEL: Record<Modality, string> = {
  strength: 'Musculação',
  martial: 'Artes Marciais',
  calisthenics: 'Calistenia',
};
export const LEVEL_LABEL: Record<Level, string> = {
  beginner: 'Iniciante',
  intermediate: 'Intermediário',
  advanced: 'Avançado',
};
export const GOAL_LABEL: Record<Goal, string> = {
  hypertrophy: 'Hipertrofia',
  strength: 'Força',
  endurance: 'Resistência',
  skill: 'Habilidade',
  conditioning: 'Condicionamento',
  fat_loss: 'Emagrecimento',
};

// ---------------------------------------------------------------- catálogo
export interface MuscleGroup {
  id: MuscleId;
  name: string;
  region: 'upper' | 'core' | 'lower';
  views: BodyView[];
  /** Tempo (h) para recuperar de 100% → 30% de fadiga. */
  recoveryHours: 24 | 48 | 72;
  /** >1 = músculo grande (dilui estímulo). */
  sizeFactor: number;
}

export type MuscleId =
  | 'chest' | 'front_delts' | 'side_delts' | 'rear_delts' | 'biceps' | 'triceps' | 'forearms'
  | 'abs' | 'obliques' | 'traps' | 'lats' | 'upper_back' | 'lower_back'
  | 'glutes' | 'quads' | 'hamstrings' | 'calves' | 'adductors';

/** Grupos de organização do catálogo (musculação e calistenia). */
export type CatalogGroup = 'chest' | 'back' | 'shoulders' | 'legs' | 'calves' | 'biceps' | 'triceps' | 'core' | 'plyo' | 'mobility';
/** @deprecated use CatalogGroup */
export type StrengthGroup = CatalogGroup;
export const STRENGTH_GROUP_LABEL: Record<CatalogGroup, string> = {
  chest: 'Peitoral',
  back: 'Costas / Dorsais',
  shoulders: 'Ombros / Trapézio',
  legs: 'Pernas & Glúteos',
  calves: 'Panturrilhas',
  biceps: 'Bíceps / Antebraços',
  triceps: 'Tríceps',
  core: 'Abdômen / Core',
  plyo: 'Pliometria',
  mobility: 'Mobilidade',
};
export const CATALOG_GROUP_LABEL = STRENGTH_GROUP_LABEL;
export const CATALOG_GROUPS = Object.keys(STRENGTH_GROUP_LABEL) as CatalogGroup[];
export const STRENGTH_GROUPS = CATALOG_GROUPS;

export interface ExerciseMuscle {
  muscle: MuscleId;
  role: 'primary' | 'secondary' | 'stabilizer';
  activation: number; // 0..1
}

export interface Exercise {
  id: string;
  name: string;
  modality: Modality;
  tracking: TrackingMode;
  level: Level;
  goals: Goal[];
  equipment: string[];
  muscles: ExerciseMuscle[];
  tip?: string;
  /** Musculação: grupo(s) do catálogo (um exercício pode aparecer em mais de um). */
  groups?: StrengthGroup[];
  /** Número(s) na lista oficial do catálogo — define a ordem de exibição. */
  catalogNo?: number;
  /** Passo a passo de execução ("Como fazer"). */
  steps?: string[];
  /** Id na base de origem (free-exercise-db) — calistenia. */
  sourceId?: string;
  /** Frames da animação (require de imagens): posição inicial e final. */
  media?: number[];
  /** strength: descanso padrão; calisthenics: árvore/nível; martial: estilo */
  attributes: {
    defaultRestS?: number;
    progressionTree?: string;
    progressionLevel?: number;
    maxLevel?: number;
    style?: MartialStyle;
  };
}

export type MartialStyle = 'boxing' | 'muay_thai' | 'kickboxing';
export interface Combo {
  id: string;
  style: MartialStyle;
  name: string;
  strikes: string[];
  callout: string; // texto lido pelo TTS
  difficulty: 1 | 2 | 3 | 4 | 5;
}

// ------------------------------------------------------- prescrição (JSONB)
export const StrengthSetRx = z.object({
  reps: z.number().int().min(0),
  repsMax: z.number().int().optional(),
  kg: z.number().min(0),
  restS: z.number().int().min(0),
  rpe: z.number().min(1).max(10).optional(),
  toFailure: z.boolean().optional(),
});
export const CaliSetRx = z.object({
  mode: z.enum(['reps', 'hold']),
  reps: z.number().int().optional(),
  targetS: z.number().int().optional(),
  restS: z.number().int().min(0),
  level: z.number().int().min(1).max(10),
  loadKg: z.number(), // + lastro / − assistência
  toFailure: z.boolean().optional(),
});
export const StrengthRx = z.object({ kind: z.literal('strength'), sets: z.array(StrengthSetRx).min(1) });
export const CaliRx = z.object({
  kind: z.literal('calisthenics'),
  sets: z.array(CaliSetRx).min(1),
  timed: z.object({ kind: z.enum(['emom', 'amrap']), minutes: z.number().int().min(1) }).optional(),
});
export const MartialRx = z.object({
  kind: z.literal('martial'),
  rounds: z.number().int().min(1),
  workS: z.number().int().min(5),
  restS: z.number().int().min(0),
  prepareS: z.number().int().min(0),
  comboIds: z.array(z.string()),
  calloutEveryS: z.number().int().min(3),
  randomize: z.boolean(),
  freestyle: z.boolean().optional(),
});
export const Prescription = z.discriminatedUnion('kind', [StrengthRx, CaliRx, MartialRx]);
export type StrengthSetRx = z.infer<typeof StrengthSetRx>;
export type CaliSetRx = z.infer<typeof CaliSetRx>;
export type Prescription = z.infer<typeof Prescription>;
export type MartialRx = z.infer<typeof MartialRx>;

// ---------------------------------------------------------- planejamento
/** Itens consecutivos com o mesmo `circuit.id` formam um ciclo (super-set / circuito). */
export interface CircuitGroup {
  id: string;
  rounds: number; // voltas
  restS: number; // descanso só ao fim de cada volta
}
export interface RoutineItem {
  id: string;
  exerciseId: string | null; // null = round freestyle
  prescription: Prescription;
  circuit?: CircuitGroup;
  notes?: string;
}
export interface RoutineDay {
  id: string;
  name: string;
  estMinutes: number;
  items: RoutineItem[];
}
export interface Routine {
  id: string;
  name: string;
  modality: Modality;
  goal: Goal;
  tag: string;
  description: string;
  days: RoutineDay[];
  /** Itens de mais de uma modalidade; `modality` = modalidade do primeiro item. */
  isHybrid?: boolean;
}

/** Treino agendado para uma data (início do dia, epoch ms). */
export interface ScheduledWorkout {
  id: string;
  date: number;
  routineId: string;
  dayId: string;
}

// ---------------------------------------------------------- execução (JSONB)
export const StrengthResult = z.object({
  kind: z.literal('strength'),
  reps: z.number().int().min(0),
  kg: z.number().min(0),
  rpe: z.number().optional(),
});
export const MartialResult = z.object({
  kind: z.literal('martial'),
  workS: z.number().int().min(1),
  comboIds: z.array(z.string()),
  freestyle: z.boolean(),
  intensity: z.number().min(0).max(1),
});
export const CaliResult = z.object({
  kind: z.literal('calisthenics'),
  mode: z.enum(['reps', 'hold']),
  reps: z.number().int().optional(),
  holdS: z.number().int().optional(),
  targetS: z.number().int().optional(),
  level: z.number().int(),
  loadKg: z.number(),
});
export const EntryResult = z.discriminatedUnion('kind', [StrengthResult, MartialResult, CaliResult]);
export type EntryResult = z.infer<typeof EntryResult>;

export interface SessionEntry {
  id: string;
  exerciseId: string | null;
  blockIndex: number;
  entryIndex: number;
  completedAt: number; // epoch ms
  result: EntryResult;
}

export interface SessionSummary {
  tonnageKg?: number;
  sets?: number;
  reps?: number;
  rounds?: number;
  workS?: number;
  holdS?: number;
  maxLevel?: number;
  calories?: number;
}

export interface Session {
  id: string;
  modality: Modality;
  title: string;
  routineId?: string;
  routineDayId?: string;
  status: 'in_progress' | 'completed' | 'abandoned';
  startedAt: number;
  endedAt?: number;
  activeSeconds: number;
  entries: SessionEntry[];
  summary: SessionSummary;
  rpe?: number;
  isHybrid?: boolean;
  photoUri?: string;
  notes?: string;
}

export interface BodyMeasurement {
  id: string;
  measuredAt: number;
  weightKg: number;
  bodyFatPct?: number;
  muscleMassKg?: number;
  circumferences: Partial<Record<CircumferenceKey, number>>;
}
export type CircumferenceKey = 'chest' | 'arm_r' | 'arm_l' | 'waist' | 'abdomen' | 'hip' | 'thigh_r' | 'calf_r';
export const CIRCUMFERENCE_LABEL: Record<CircumferenceKey, string> = {
  chest: 'Tórax / Peitoral',
  arm_r: 'Braço D. (contraído)',
  arm_l: 'Braço E. (contraído)',
  waist: 'Cintura umbilical',
  abdomen: 'Abdômen infra',
  hip: 'Quadril / Glúteo',
  thigh_r: 'Coxa direita',
  calf_r: 'Panturrilha D.',
};

export interface Profile {
  name: string;
  heightCm: number;
  birthYear: number;
  sex: 'male' | 'female' | 'other';
  goal: Goal;
  level: Level;
  weeklyTarget: number;
  targetWeightKg: number;
  modalities: Modality[];
  prefs: { tts: boolean; ttsRate: number; haptics: boolean; sounds: boolean; defaultRestS: number; reminders: boolean };
}
