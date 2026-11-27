/**
 * Histórico de demonstração gerado no primeiro uso (para a fadiga, calendário e gráficos terem dados).
 * Pode ser apagado em Perfil → "Limpar dados".
 */
import { SEED_ROUTINES } from '../catalog/seedRoutines';
import { BodyMeasurement, EntryResult, RoutineDay, ScheduledWorkout, Session, SessionEntry } from '../domain/types';
import { summarize } from '../../features/report/summary';
import { uuid } from '../utils/id';

const H = 3_600_000;
const D = 24 * H;

function entriesFor(day: RoutineDay, at: number, progress: number): SessionEntry[] {
  const out: SessionEntry[] = [];
  day.items.forEach((item, b) => {
    const rx = item.prescription;
    const push = (j: number, result: EntryResult) =>
      out.push({ id: uuid(), exerciseId: item.exerciseId, blockIndex: b, entryIndex: j, completedAt: at + (b * 10 + j) * 60_000, result });
    if (rx.kind === 'strength') rx.sets.forEach((s, j) => push(j, { kind: 'strength', reps: s.reps, kg: Math.round(s.kg * progress), rpe: 8 }));
    else if (rx.kind === 'martial') for (let j = 0; j < rx.rounds; j++) push(j, { kind: 'martial', workS: rx.workS, comboIds: rx.comboIds.slice(0, 1), freestyle: false, intensity: 0.8 });
    else if (rx.timed?.kind === 'emom') for (let j = 0; j < rx.timed.minutes; j++) push(j, { kind: 'calisthenics', mode: 'reps', reps: rx.sets[0].reps ?? 10, level: rx.sets[0].level, loadKg: 0 });
    else if (item.circuit) for (let j = 0; j < item.circuit.rounds; j++) push(j, rx.sets[0].mode === 'hold'
      ? { kind: 'calisthenics', mode: 'hold', holdS: rx.sets[0].targetS ?? 20, targetS: rx.sets[0].targetS, level: rx.sets[0].level, loadKg: 0 }
      : { kind: 'calisthenics', mode: 'reps', reps: rx.sets[0].reps ?? 8, level: rx.sets[0].level, loadKg: rx.sets[0].loadKg });
    else rx.sets.forEach((s, j) => push(j, s.mode === 'hold'
      ? { kind: 'calisthenics', mode: 'hold', holdS: Math.round((s.targetS ?? 20) * (0.8 + 0.2 * progress)), targetS: s.targetS, level: s.level, loadKg: s.loadKg }
      : { kind: 'calisthenics', mode: 'reps', reps: s.reps ?? 8, level: s.level, loadKg: s.loadKg }));
  });
  return out;
}

// Padrão semanal (seg→sáb): Peito, Boxe, Costas, Cali, Pernas, Muay Thai
const WEEK_PLAN: [string, string][] = [
  ['r_hipertrofia', 'd_ppt'], ['r_boxe', 'd_boxe'], ['r_hipertrofia', 'd_dba'],
  ['r_cali', 'd_cali_pull'], ['r_hipertrofia', 'd_legs'], ['r_boxe', 'd_muay'],
];

/** Próximos 7 dias agendados seguindo o padrão semanal (domingo livre). */
export function buildDemoSchedule(now: number): ScheduledWorkout[] {
  const out: ScheduledWorkout[] = [];
  const d0 = new Date(now);
  d0.setHours(0, 0, 0, 0);
  for (let i = 0; i < 7; i++) {
    const t = d0.getTime() + i * D;
    const dow = new Date(t).getDay();
    if (dow === 0) continue;
    const [routineId, dayId] = WEEK_PLAN[(dow - 1) % WEEK_PLAN.length];
    out.push({ id: uuid(), date: t, routineId, dayId });
  }
  return out;
}

export function buildDemoHistory(now: number): Session[] {
  const plan = WEEK_PLAN;
  const sessions: Session[] = [];
  const today = new Date(now);
  today.setHours(18, 30, 0, 0);
  for (let daysAgo = 34; daysAgo >= 1; daysAgo--) {
    const start = today.getTime() - daysAgo * D;
    const dow = new Date(start).getDay(); // 0 dom
    if (dow === 0 || (daysAgo % 9 === 0)) continue; // domingo + algumas faltas
    const [rid, did] = plan[(dow - 1) % plan.length];
    const routine = SEED_ROUTINES.find((r) => r.id === rid)!;
    const day = routine.days.find((d) => d.id === did)!;
    const progress = 0.9 + 0.1 * (1 - daysAgo / 34);
    const entries = entriesFor(day, start, progress);
    const activeSeconds = day.estMinutes * 60;
    sessions.push({
      id: uuid(),
      modality: routine.modality,
      title: day.name,
      routineId: rid,
      routineDayId: did,
      status: 'completed',
      startedAt: start,
      endedAt: start + activeSeconds * 1000,
      activeSeconds,
      entries,
      summary: summarize(entries, routine.modality, activeSeconds, 82),
      rpe: 8,
    });
  }
  return sessions.reverse();
}

export function buildDemoMeasurements(now: number): BodyMeasurement[] {
  return Array.from({ length: 9 }, (_, i) => {
    const w = 8 - i; // semanas atrás
    return {
      id: uuid(),
      measuredAt: now - w * 7 * D,
      weightKg: +(81.2 + i * 0.15 + (i % 2 ? 0.1 : 0)).toFixed(1),
      bodyFatPct: +(13.6 - i * 0.1).toFixed(1),
      muscleMassKg: +(40.8 + i * 0.1).toFixed(1),
      circumferences: { chest: 107 + i * 0.2, arm_r: 40.6 + i * 0.07, arm_l: 40.3 + i * 0.06, waist: 80 - i * 0.12, abdomen: 82.7 - i * 0.15, hip: 99, thigh_r: 60.7 + i * 0.1, calf_r: 38.8 + i * 0.03 },
    };
  });
}
