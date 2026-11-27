import { getExercise } from '../../core/catalog/exercises';
import { Modality, Session, SessionEntry, SessionSummary } from '../../core/domain/types';

/** MET médio por modalidade (Compendium of Physical Activities, aproximado). */
const MET: Record<Modality, number> = { strength: 5.0, martial: 9.0, calisthenics: 6.0 };

export function summarize(entries: SessionEntry[], modality: Modality, activeSeconds: number, weightKg: number): SessionSummary {
  const s: SessionSummary = { tonnageKg: 0, sets: 0, reps: 0, rounds: 0, workS: 0, holdS: 0, maxLevel: 0 };
  for (const e of entries) {
    const r = e.result;
    if (r.kind === 'strength') {
      s.tonnageKg! += r.kg * r.reps;
      s.sets!++;
      s.reps! += r.reps;
    } else if (r.kind === 'martial') {
      s.rounds!++;
      s.workS! += r.workS;
    } else {
      s.sets!++;
      if (r.mode === 'hold') s.holdS! += r.holdS ?? 0;
      else s.reps! += r.reps ?? 0;
      s.maxLevel = Math.max(s.maxLevel ?? 0, r.level);
      if (r.loadKg > 0 && r.mode === 'reps') s.tonnageKg! += r.loadKg * (r.reps ?? 0);
    }
  }
  // MET ponderado pela fração de registros de cada modalidade (sessões híbridas).
  const counts: Partial<Record<Modality, number>> = {};
  for (const e of entries) counts[e.result.kind] = (counts[e.result.kind] ?? 0) + 1;
  const total = entries.length;
  const met = total ? (Object.keys(counts) as Modality[]).reduce((a, k) => a + MET[k] * (counts[k]! / total), 0) : MET[modality];
  s.calories = Math.round(met * weightKg * (activeSeconds / 3600));
  return s;
}

export const tonnage = (ss: Session[]) => ss.reduce((a, s) => a + (s.summary.tonnageKg ?? 0), 0);

/** Agrupa registros por bloco (exercício) para listas e checklist. */
export function entriesByBlock(entries: SessionEntry[]) {
  const map = new Map<number, SessionEntry[]>();
  for (const e of entries) map.set(e.blockIndex, [...(map.get(e.blockIndex) ?? []), e]);
  return [...map.entries()]
    .sort(([a], [b]) => a - b)
    .map(([block, list]) => ({ block, exercise: getExercise(list[0].exerciseId), entries: list.sort((a, b) => a.entryIndex - b.entryIndex) }));
}

export function describeEntries(list: SessionEntry[]): string {
  const r0 = list[0]?.result;
  if (!r0) return '';
  if (r0.kind === 'strength') {
    const reps = [...new Set(list.map((e) => (e.result.kind === 'strength' ? e.result.reps : 0)))];
    const kg = Math.max(...list.map((e) => (e.result.kind === 'strength' ? e.result.kg : 0)));
    return `${list.length} séries • ${reps.length > 1 ? `${Math.min(...reps)}–${Math.max(...reps)}` : reps[0]} reps • ${kg} kg`;
  }
  if (r0.kind === 'martial') {
    const mins = list.reduce((a, e) => a + (e.result.kind === 'martial' ? e.result.workS : 0), 0) / 60;
    return `${list.length} rounds • ${Math.round(mins)} min de trabalho`;
  }
  if (r0.mode === 'hold') {
    const tot = list.reduce((a, e) => a + (e.result.kind === 'calisthenics' ? e.result.holdS ?? 0 : 0), 0);
    return `${list.length} séries • ${tot}s sustentados • nível ${r0.level}`;
  }
  const reps = list.reduce((a, e) => a + (e.result.kind === 'calisthenics' ? e.result.reps ?? 0 : 0), 0);
  return `${list.length} séries • ${reps} reps • ${r0.loadKg >= 0 ? '+' : ''}${r0.loadKg} kg`;
}
