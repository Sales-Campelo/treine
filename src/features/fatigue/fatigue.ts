/**
 * Algoritmo de fadiga muscular (ver docs/ARQUITETURA.md §4).
 *
 *  1. Estímulo bruto por registro (série/round/hold) — E_entry, específico da modalidade.
 *  2. Distribuição por músculo: E_m = E_entry · w_role · activation
 *       w_role: primário 1.0 · secundário 0.5 · estabilizador 0.25
 *  3. Carga da sessão por músculo: L_m = min(100, Σ E_m / sizeFactor_m)
 *  4. Fadiga no instante t: F_m(t) = min(100, Σ_sessões L_m · e^(−(t − t_sessão)/τ_m))
 *       τ_m = recoveryHours_m / ln(100/30)  → de 100% a 30% leva exatamente recoveryHours (24/48/72h)
 *  5. Estado: <30 Recuperado · 30–55 Em recuperação · 55–80 Enfraquecido · ≥80 Fadigado
 */
import { MUSCLES, MUSCLE_IDS } from '../../core/catalog/muscles';
import { getExercise } from '../../core/catalog/exercises';
import { EntryResult, MuscleId, Session, SessionEntry } from '../../core/domain/types';

export type FatigueState = 'recovered' | 'recovering' | 'weakened' | 'fatigued';
export const FATIGUE_STATE_LABEL: Record<FatigueState, string> = {
  recovered: 'Recuperado',
  recovering: 'Em recuperação',
  weakened: 'Enfraquecido',
  fatigued: 'Fadigado',
};

export const RECOVERED_THRESHOLD = 30;
const LN_100_30 = Math.log(100 / 30);
const HOUR = 3_600_000;
const ROLE_WEIGHT = { primary: 1, secondary: 0.5, stabilizer: 0.25 } as const;

/** Pontos de estímulo de uma série "dura" típica para o músculo primário. */
const BASE_SET = 12;
/** Pontos por minuto de round de luta a intensidade 1. */
const BASE_ROUND_MIN = 4;

export const tauHours = (m: MuscleId) => MUSCLES[m].recoveryHours / LN_100_30;

export const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

/** Estímulo bruto de um registro, antes da distribuição por músculo. */
export function entryStimulus(r: EntryResult, bodyWeightKg: number): number {
  switch (r.kind) {
    case 'strength': {
      // Intensidade pelo RPE (padrão 8): RPE 10 → 1.2, RPE 8 → 0.92, RPE 5 → 0.6
      const rpe = r.rpe ?? 8;
      const intensity = clamp(0.6 + 0.6 * ((rpe - 5) / 5), 0.4, 1.2);
      // Volume relativo ao peso corporal: kg·reps / (BW·8); séries muito leves contam menos.
      const relVolume = bodyWeightKg > 0 ? (r.kg * r.reps) / (bodyWeightKg * 8) : 1;
      const volume = clamp(0.5 + 0.5 * relVolume, 0.5, 1.4);
      if (r.reps === 0) return 0;
      return BASE_SET * intensity * volume;
    }
    case 'martial': {
      return (r.workS / 60) * BASE_ROUND_MIN * clamp(r.intensity, 0.2, 1);
    }
    case 'calisthenics': {
      const levelF = 0.6 + 0.1 * clamp(r.level, 1, 10); // nível 1 → 0.7 · nível 5 → 1.1
      const loadF = clamp(1 + r.loadKg / Math.max(bodyWeightKg, 30), 0.4, 1.8); // lastro + / assistência −
      const work =
        r.mode === 'hold'
          ? clamp((r.holdS ?? 0) / 20, 0, 1.5) // 20 s de hold ≈ uma série dura
          : clamp(Math.sqrt((r.reps ?? 0) / 8), 0, 1.4);
      return BASE_SET * levelF * loadF * work;
    }
  }
}

export type MuscleLoad = Partial<Record<MuscleId, number>>;

/** Carga (0–100) que uma sessão impõe a cada músculo. */
export function sessionMuscleLoad(entries: SessionEntry[], bodyWeightKg: number): MuscleLoad {
  const raw: MuscleLoad = {};
  for (const e of entries) {
    const ex = getExercise(e.exerciseId);
    if (!ex) continue;
    const E = entryStimulus(e.result, bodyWeightKg);
    for (const m of ex.muscles) {
      raw[m.muscle] = (raw[m.muscle] ?? 0) + E * ROLE_WEIGHT[m.role] * m.activation;
    }
  }
  const out: MuscleLoad = {};
  for (const id of Object.keys(raw) as MuscleId[]) {
    out[id] = Math.min(100, raw[id]! / MUSCLES[id].sizeFactor);
  }
  return out;
}

export interface MuscleFatigue {
  muscle: MuscleId;
  pct: number;
  state: FatigueState;
  /** Horas até voltar a < 30%. 0 se já recuperado. */
  hoursToRecover: number;
  lastTrainedAt?: number;
}

export function fatigueState(pct: number): FatigueState {
  if (pct >= 80) return 'fatigued';
  if (pct >= 55) return 'weakened';
  if (pct >= RECOVERED_THRESHOLD) return 'recovering';
  return 'recovered';
}

export function hoursToRecover(pct: number, m: MuscleId): number {
  return pct <= RECOVERED_THRESHOLD ? 0 : tauHours(m) * Math.log(pct / RECOVERED_THRESHOLD);
}

/** Fadiga atual de todos os músculos a partir do histórico (só olha 7 dias). */
export function computeFatigue(
  sessions: Pick<Session, 'endedAt' | 'startedAt' | 'entries' | 'status'>[],
  bodyWeightKg: number,
  now = Date.now(),
): Record<MuscleId, MuscleFatigue> {
  const acc = Object.fromEntries(MUSCLE_IDS.map((m) => [m, { sum: 0, last: undefined as number | undefined }])) as Record<
    MuscleId,
    { sum: number; last?: number }
  >;
  for (const s of sessions) {
    if (s.status !== 'completed') continue;
    const t = s.endedAt ?? s.startedAt;
    const dtH = (now - t) / HOUR;
    if (dtH < 0 || dtH > 24 * 7) continue;
    const load = sessionMuscleLoad(s.entries, bodyWeightKg);
    for (const id of Object.keys(load) as MuscleId[]) {
      acc[id].sum += load[id]! * Math.exp(-dtH / tauHours(id));
      acc[id].last = Math.max(acc[id].last ?? 0, t);
    }
  }
  const out = {} as Record<MuscleId, MuscleFatigue>;
  for (const id of MUSCLE_IDS) {
    const pct = Math.min(100, acc[id].sum);
    out[id] = { muscle: id, pct, state: fatigueState(pct), hoursToRecover: hoursToRecover(pct, id), lastTrainedAt: acc[id].last };
  }
  return out;
}
