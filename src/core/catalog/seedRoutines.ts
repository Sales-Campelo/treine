import { CaliSetRx, Routine, RoutineItem, StrengthSetRx } from '../domain/types';

const sets = (n: number, reps: number, kg: number, restS: number, extra: Partial<StrengthSetRx> = {}): StrengthSetRx[] =>
  Array.from({ length: n }, (_, i) => ({ reps, kg, restS, ...(i === n - 1 ? extra : {}) }));

const str = (id: string, exerciseId: string, s: StrengthSetRx[]): RoutineItem => ({
  id,
  exerciseId,
  prescription: { kind: 'strength', sets: s },
});

const holds = (n: number, targetS: number, restS: number, level: number, loadKg = 0): CaliSetRx[] =>
  Array.from({ length: n }, () => ({ mode: 'hold', targetS, restS, level, loadKg }));
const reps = (n: number, r: number, restS: number, level: number, loadKg = 0): CaliSetRx[] =>
  Array.from({ length: n }, () => ({ mode: 'reps', reps: r, restS, level, loadKg }));

const FULL_BODY = { id: 'c_fullbody', rounds: 3, restS: 120 };

export const SEED_ROUTINES: Routine[] = [
  {
    id: 'r_hipertrofia',
    name: 'Rotina A — Hipertrofia & Força',
    modality: 'strength',
    goal: 'hypertrophy',
    tag: 'Hipertrofia',
    description: 'Máquinas, Smith e polias com sobrecarga progressiva.',
    days: [
      {
        id: 'd_ppt',
        name: '01 — Peito, Ombro e Tríceps',
        estMinutes: 85,
        items: [
          str('i1', 'supino_reto_smith', sets(4, 6, 60, 90, { toFailure: true })),
          str('i2', 'supino_inclinado_articulado', sets(4, 10, 24, 90)),
          str('i3', 'desenvolvimento_articulado_pronado', sets(3, 8, 40, 120)),
          str('i4', 'elevacao_lateral_maquina', sets(4, 15, 12, 60)),
          str('i5', 'triceps_pulley_corda', sets(4, 12, 35, 60)),
        ],
      },
      {
        id: 'd_dba',
        name: '02 — Dorsais, Bíceps & Antebraço',
        estMinutes: 60,
        items: [
          str('i6', 'puxada_frontal_aberta', sets(4, 10, 55, 90)),
          str('i7', 'remada_baixa_triangulo', sets(4, 8, 60, 120)),
          str('i8', 'face_pull_polia', sets(3, 15, 20, 60)),
          str('i9', 'rosca_direta_polia_barra', sets(3, 10, 30, 60)),
          str('i10', 'rosca_punho_polia', sets(3, 15, 20, 45)),
        ],
      },
      {
        id: 'd_legs',
        name: '03 — Pernas Completo',
        estMinutes: 75,
        items: [
          str('i11', 'hack_squat', sets(4, 6, 90, 150)),
          str('i12', 'stiff_smith', sets(3, 10, 70, 120)),
          str('i13', 'leg_press_45', sets(4, 12, 180, 120)),
          str('i14', 'panturrilha_em_pe_maquina', sets(4, 15, 60, 45)),
          str('i15', 'abdominal_polia_ajoelhado', sets(3, 15, 30, 45)),
        ],
      },
      {
        id: 'd_arms',
        name: '04 — Braços',
        estMinutes: 50,
        items: [
          str('i16', 'rosca_direta_polia_w', sets(4, 10, 30, 60)),
          str('i17', 'triceps_pulley_corda', sets(4, 12, 35, 60)),
          str('i18', 'rosca_martelo_polia_corda', sets(3, 12, 14, 60)),
          str('i19', 'mergulho_maquina', sets(3, 10, 40, 90, { toFailure: true })),
          str('i20', 'rosca_punho_polia', sets(3, 15, 20, 45)),
        ],
      },
    ],
  },
  {
    id: 'r_boxe',
    name: 'Boxe — Rounds Técnicos',
    modality: 'martial',
    goal: 'conditioning',
    tag: 'Combate',
    description: '10 rounds de 3 min com combos narrados por voz.',
    days: [
      {
        id: 'd_boxe',
        name: 'Boxe — Velocidade & Rotação',
        estMinutes: 45,
        items: [
          {
            id: 'i_b1',
            exerciseId: 'boxing_rounds',
            prescription: {
              kind: 'martial',
              rounds: 10,
              workS: 180,
              restS: 60,
              prepareS: 10,
              comboIds: ['c_11_2', 'c_1_2_3', 'c_1_2_3_2', 'c_slip_2_3', 'c_1_6_3_2'],
              calloutEveryS: 12,
              randomize: false,
            },
          },
        ],
      },
      {
        id: 'd_muay',
        name: 'Muay Thai — Clinch & Chutes',
        estMinutes: 30,
        items: [
          {
            id: 'i_m1',
            exerciseId: 'muay_thai_rounds',
            prescription: {
              kind: 'martial',
              rounds: 6,
              workS: 180,
              restS: 60,
              prepareS: 10,
              comboIds: ['m_1_2_kick', 'm_teep_2', 'm_knee_elbow', 'm_1_2_3_kick'],
              calloutEveryS: 10,
              randomize: true,
            },
          },
        ],
      },
    ],
  },
  {
    id: 'r_cali',
    name: 'Calistenia Pro',
    modality: 'calisthenics',
    goal: 'skill',
    tag: 'Peso corporal',
    description: 'Barras, paralelas, core e ciclos com peso corporal.',
    days: [
      {
        id: 'd_cali_pull',
        name: 'Barras & Core',
        estMinutes: 45,
        items: [
          { id: 'i_c0', exerciseId: 'pullups', prescription: { kind: 'calisthenics', sets: reps(4, 8, 120, 3) } },
          { id: 'i_c1', exerciseId: 'chin_up', prescription: { kind: 'calisthenics', sets: reps(3, 8, 120, 1) } },
          { id: 'i_c2', exerciseId: 'dips_triceps_version', prescription: { kind: 'calisthenics', sets: reps(3, 10, 90, 1) } },
          { id: 'i_c3', exerciseId: 'hanging_leg_raise', prescription: { kind: 'calisthenics', sets: reps(3, 12, 60, 5) } },
          { id: 'i_c4', exerciseId: 'plank', prescription: { kind: 'calisthenics', sets: holds(3, 30, 60, 1) } },
          { id: 'i_c5', exerciseId: 'side_bridge', prescription: { kind: 'calisthenics', sets: holds(2, 30, 45, 1) } },
        ],
      },
      {
        id: 'd_cali_ciclo',
        name: 'Ciclo Full Body — 3 voltas',
        estMinutes: 25,
        items: [
          { id: 'i_k1', exerciseId: 'pullups', circuit: FULL_BODY, prescription: { kind: 'calisthenics', sets: reps(1, 6, 0, 3) } },
          { id: 'i_k2', exerciseId: 'dips_triceps_version', circuit: FULL_BODY, prescription: { kind: 'calisthenics', sets: reps(1, 8, 0, 1) } },
          { id: 'i_k3', exerciseId: 'bodyweight_squat', circuit: FULL_BODY, prescription: { kind: 'calisthenics', sets: reps(1, 15, 0, 1) } },
          { id: 'i_k4', exerciseId: 'plank', circuit: FULL_BODY, prescription: { kind: 'calisthenics', sets: holds(1, 30, 0, 1) } },
        ],
      },
      {
        id: 'd_cali_emom',
        name: 'EMOM — Condicionamento 10 min',
        estMinutes: 15,
        items: [
          {
            id: 'i_e1',
            exerciseId: 'mountain_climbers',
            prescription: { kind: 'calisthenics', sets: reps(1, 20, 0, 1), timed: { kind: 'emom', minutes: 10 } },
          },
        ],
      },
    ],
  },
];
