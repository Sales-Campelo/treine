import { RoutineItem } from '../../core/domain/types';

/** Resumo textual de uma prescrição ("4 séries • 6 reps • 60 kg"). */
export function describeRx(item: RoutineItem): string {
  const rx = item.prescription;
  if (rx.kind === 'strength') {
    const reps = [...new Set(rx.sets.map((s) => s.reps))];
    const kgs = [...new Set(rx.sets.map((s) => s.kg))];
    return `${rx.sets.length} séries • ${reps.length > 1 ? `${Math.min(...reps)}–${Math.max(...reps)}` : reps[0]} reps • ${kgs.length > 1 ? `${Math.min(...kgs)}–${Math.max(...kgs)}` : kgs[0]} kg`;
  }
  if (rx.kind === 'martial') return `${rx.rounds} rounds • ${rx.workS / 60} min / ${rx.restS}s descanso${rx.randomize ? ' • combos aleatórios' : ''}`;
  if (rx.timed) return `${rx.timed.kind.toUpperCase()} ${rx.timed.minutes} min • ${rx.sets[0].reps} reps/min`;
  const s = rx.sets[0];
  return `${rx.sets.length} séries • ${s.mode === 'hold' ? `${s.targetS}s hold` : `${s.reps} reps`} • nível ${s.level}${s.loadKg ? ` • ${s.loadKg > 0 ? '+' : ''}${s.loadKg} kg` : ''}`;
}
