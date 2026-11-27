/**
 * Motores de execução polimórficos: cada modalidade vira uma lista linear de PhaseSpec
 * consumida pela mesma FSM (timerMachine.ts).
 */
import { COMBO_BY_ID, COMBOS, getExercise } from '../../../core/catalog/exercises';
import { CircuitGroup, Combo, MartialRx, MartialStyle, Modality, RoutineItem } from '../../../core/domain/types';
import { Cue, PhaseSpec } from './timerMachine';

const sec = (s: number) => s * 1000;

// ------------------------------------------------------------------ Musculação
/** Trabalho aberto (sem contagem) → SET_DONE → descanso regressivo automático. */
export function buildStrengthPlan(items: RoutineItem[], blockOffset = 0): PhaseSpec[] {
  const plan: PhaseSpec[] = [];
  items.forEach((item, b) => {
    if (item.prescription.kind !== 'strength') return;
    const ex = getExercise(item.exerciseId);
    const sets = item.prescription.sets;
    sets.forEach((set, j) => {
      plan.push({
        kind: 'ACTIVE_WORK',
        durationMs: null,
        autoAdvance: false,
        label: `${ex?.name ?? 'Exercício'} — série ${j + 1}/${sets.length}`,
        ref: { blockIndex: blockOffset + b, entryIndex: j, itemId: item.id, exerciseId: item.exerciseId },
        onEnter: j === 0 ? [{ type: 'speak', text: ex?.name ?? '' }] : [],
      });
      plan.push({
        kind: 'REST',
        durationMs: sec(set.restS),
        autoAdvance: true,
        countdownBeeps: true,
        label: 'Descanso',
        ref: { blockIndex: blockOffset + b, entryIndex: j, itemId: item.id, exerciseId: item.exerciseId },
        onEnter: [{ type: 'haptic', style: 'medium' }],
      });
    });
  });
  if (plan.at(-1)?.kind === 'REST') plan.pop(); // sem descanso após a última série
  // Fim do descanso = "Vamos lá" para a próxima série
  plan.forEach((p, i) => {
    if (p.kind === 'ACTIVE_WORK' && i > 0) p.onEnter = [...(p.onEnter ?? []), { type: 'sound', sound: 'bell' }, { type: 'haptic', style: 'heavy' }];
  });
  return plan;
}

// ------------------------------------------------------------- Artes marciais
/** PRNG determinístico (mulberry32) — plano reprodutível após restaurar o app. */
export function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function randomCombos(style: MartialStyle | 'any', n: number, seed: number, maxDifficulty = 5): Combo[] {
  const pool = COMBOS.filter((c) => (style === 'any' || c.style === style) && c.difficulty <= maxDifficulty);
  const r = rng(seed);
  return Array.from({ length: n }, () => pool[Math.floor(r() * pool.length)]);
}

export function buildMartialPlan(item: RoutineItem, seed = Date.now(), blockOffset = 0): PhaseSpec[] {
  const rx = item.prescription as MartialRx;
  const style = getExercise(item.exerciseId)?.attributes.style ?? 'boxing';
  const listed = rx.comboIds.map((id) => COMBO_BY_ID[id]).filter(Boolean);
  const r = rng(seed);
  const pickCombo = (round: number): Combo | undefined => {
    if (rx.freestyle) return undefined;
    if (rx.randomize || listed.length === 0) {
      const pool = listed.length ? listed : COMBOS.filter((c) => c.style === style);
      return pool[Math.floor(r() * pool.length)];
    }
    return listed[(round - 1) % listed.length];
  };

  const plan: PhaseSpec[] = [];
  for (let round = 1; round <= rx.rounds; round++) {
    const combo = pickCombo(round);
    const cues: Cue[] = [];
    if (combo) {
      // Narra o combo periodicamente durante o round (TTS) — sem tocar no celular.
      for (let t = rx.calloutEveryS; t < rx.workS - 5; t += rx.calloutEveryS) {
        cues.push({ id: `call${t}`, ref: 'elapsed', at: sec(t), effects: [{ type: 'speak', text: combo.callout }] });
      }
    }
    plan.push({
      kind: 'ACTIVE_WORK',
      durationMs: sec(rx.workS),
      autoAdvance: true,
      countdownBeeps: true,
      label: combo ? `R${round} — ${combo.name}` : `R${round} — Round livre`,
      ref: { blockIndex: blockOffset, entryIndex: round - 1, itemId: item.id, exerciseId: item.exerciseId, comboId: combo?.id, round },
      onEnter: [
        { type: 'sound', sound: 'gong' },
        { type: 'haptic', style: 'heavy' },
        { type: 'speak', text: combo ? `Round ${round}. ${combo.callout}` : `Round ${round}. Livre!` },
      ],
      cues,
    });
    if (round < rx.rounds && rx.restS > 0) {
      const next = `Fim do round ${round}. Descanse.`;
      plan.push({
        kind: 'REST',
        durationMs: sec(rx.restS),
        autoAdvance: true,
        countdownBeeps: true,
        label: 'Descanso',
        ref: { blockIndex: blockOffset, entryIndex: round - 1, itemId: item.id, exerciseId: item.exerciseId, round },
        onEnter: [{ type: 'sound', sound: 'bell' }, { type: 'haptic', style: 'medium' }, { type: 'speak', text: next }],
      });
    }
  }
  return plan;
}

// ----------------------------------------------------------------- Calistenia
export function buildCalisthenicsPlan(items: RoutineItem[], blockOffset = 0): PhaseSpec[] {
  const plan: PhaseSpec[] = [];
  items.forEach((item, b) => {
    if (item.prescription.kind !== 'calisthenics') return;
    const ex = getExercise(item.exerciseId);
    const name = ex?.name ?? 'Exercício';
    const { sets, timed: circuit } = item.prescription;
    const ref = (j: number) => ({ blockIndex: blockOffset + b, entryIndex: j, itemId: item.id, exerciseId: item.exerciseId });

    if (circuit?.kind === 'emom') {
      const s0 = sets[0];
      for (let m = 0; m < circuit.minutes; m++) {
        plan.push({
          kind: 'ACTIVE_WORK', durationMs: sec(60), autoAdvance: true, countdownBeeps: true,
          label: `EMOM ${m + 1}/${circuit.minutes} — ${s0.reps ?? ''} ${name}`,
          ref: ref(m),
          onEnter: [{ type: 'sound', sound: 'gong' }, { type: 'speak', text: `Minuto ${m + 1}. ${s0.reps ?? ''} ${name}` }],
        });
      }
      return;
    }
    if (circuit?.kind === 'amrap') {
      plan.push({
        kind: 'ACTIVE_WORK', durationMs: sec(circuit.minutes * 60), autoAdvance: true, countdownBeeps: true,
        label: `AMRAP ${circuit.minutes} min — ${name}`, ref: ref(0),
        onEnter: [{ type: 'sound', sound: 'gong' }, { type: 'speak', text: 'Vai! Máximo de rounds.' }],
        cues: Array.from({ length: circuit.minutes - 1 }, (_, k) => ({ id: `min${k + 1}`, ref: 'elapsed' as const, at: sec(60 * (k + 1)), effects: [{ type: 'speak' as const, text: `${k + 1} minuto${k ? 's' : ''}` }] })),
      });
      return;
    }
    sets.forEach((set, j) => {
      const isHold = set.mode === 'hold';
      plan.push({
        kind: 'ACTIVE_WORK',
        durationMs: null, // hold = progressivo com meta; reps = aberto
        targetMs: isHold && set.targetS ? sec(set.targetS) : undefined,
        autoAdvance: false,
        label: `${name} — série ${j + 1}/${sets.length}`,
        ref: ref(j),
        onEnter: [
          ...(j === 0 ? [{ type: 'speak' as const, text: name }] : [{ type: 'sound' as const, sound: 'bell' as const }]),
          { type: 'haptic', style: 'heavy' },
        ],
      });
      plan.push({
        kind: 'REST', durationMs: sec(set.restS), autoAdvance: true, countdownBeeps: true, label: 'Descanso', ref: ref(j),
        onEnter: [{ type: 'haptic', style: 'medium' }],
      });
    });
  });
  if (plan.at(-1)?.kind === 'REST') plan.pop();
  return plan.filter((p) => !(p.kind === 'REST' && p.durationMs === 0));
}

/** Duração da contagem "Prepare-se!" antes do 1º exercício/round. */
export const PREPARE_S = 10;

/**
 * Ciclo (circuito): todos os exercícios do grupo em sequência, SEM descanso entre eles;
 * o descanso só acontece ao fim de cada volta.
 */
export function buildCircuitPlan(items: RoutineItem[], indices: number[], group: CircuitGroup): PhaseSpec[] {
  const plan: PhaseSpec[] = [];
  for (let r = 0; r < group.rounds; r++) {
    indices.forEach((b, pos) => {
      const item = items[b];
      const rx = item.prescription;
      if (rx.kind === 'martial') return;
      const name = getExercise(item.exerciseId)?.name ?? 'Exercício';
      const set = rx.sets[Math.min(r, rx.sets.length - 1)];
      const hold = 'mode' in set && set.mode === 'hold';
      plan.push({
        kind: 'ACTIVE_WORK',
        durationMs: null,
        targetMs: hold && set.targetS ? sec(set.targetS) : undefined,
        autoAdvance: false,
        label: `${name} — volta ${r + 1}/${group.rounds}`,
        ref: {
          blockIndex: b, entryIndex: r, itemId: item.id, exerciseId: item.exerciseId,
          circuitId: group.id, circuitRound: r + 1, circuitRounds: group.rounds, circuitPos: pos, circuitSize: indices.length,
        },
        onEnter: [
          ...(pos === 0 && r === 0 ? [] : [{ type: 'sound' as const, sound: 'bell' as const }]),
          { type: 'haptic', style: 'heavy' },
          { type: 'speak', text: pos === 0 ? `Volta ${r + 1}. ${name}` : name },
        ],
      });
    });
    if (r < group.rounds - 1 && group.restS > 0) {
      const last = plan.at(-1)!;
      plan.push({
        kind: 'REST', durationMs: sec(group.restS), autoAdvance: true, countdownBeeps: true, label: 'Descanso do ciclo',
        ref: last.ref,
        onEnter: [{ type: 'haptic', style: 'medium' }, { type: 'speak', text: `Fim da volta ${r + 1}. Descanse.` }],
      });
    }
  }
  return plan;
}

/** Plano completo de um dia de treino (itens podem misturar modalidades e formar circuitos). */
export function buildPlan(items: RoutineItem[], seed = Date.now(), prepareS = PREPARE_S): PhaseSpec[] {
  const plan: PhaseSpec[] = [];
  let pendingRestS = 0; // descanso a inserir antes do próximo bloco
  for (let b = 0; b < items.length; ) {
    const item = items[b];
    const k = item.prescription.kind;
    let part: PhaseSpec[];
    let next = b + 1;
    let restAfter = 60;
    if (item.circuit && k === 'calisthenics') {
      const indices = [b];
      while (next < items.length && items[next].circuit?.id === item.circuit.id && items[next].prescription.kind === 'calisthenics') indices.push(next++);
      part = buildCircuitPlan(items, indices, item.circuit);
      restAfter = item.circuit.restS;
    } else if (k === 'strength') {
      part = buildStrengthPlan([item], b);
      restAfter = item.prescription.kind === 'strength' ? item.prescription.sets.at(-1)?.restS ?? 60 : 60;
    } else if (k === 'martial') {
      part = buildMartialPlan(item, seed + b, b);
      restAfter = item.prescription.kind === 'martial' ? item.prescription.restS : 60;
    } else {
      part = buildCalisthenicsPlan([item], b);
      restAfter = item.prescription.kind === 'calisthenics' ? item.prescription.sets.at(-1)?.restS ?? 60 : 60;
    }
    if (plan.length && part.length && pendingRestS > 0) {
      plan.push({ kind: 'REST', durationMs: sec(pendingRestS), autoAdvance: true, countdownBeeps: true, label: 'Descanso', ref: plan.at(-1)?.ref, onEnter: [{ type: 'haptic', style: 'medium' }] });
    }
    plan.push(...part);
    pendingRestS = restAfter;
    b = next;
  }
  // Contagem "Prepare-se!" única antes do primeiro exercício/round, em qualquer modalidade.
  const first = plan.find((p) => p.kind === 'ACTIVE_WORK');
  if (first && prepareS > 0) {
    const firstName = getExercise(first.ref?.exerciseId)?.name;
    plan.unshift({
      kind: 'PREPARE',
      durationMs: sec(prepareS),
      autoAdvance: true,
      countdownBeeps: true,
      label: 'Prepare-se!',
      ref: first.ref,
      onEnter: [{ type: 'speak', text: firstName ? `Prepare-se! Primeiro: ${firstName}` : 'Prepare-se!' }],
    });
  }
  return plan;
}

/** Treino imediato (sem rotina) por modalidade. */
export function quickItems(modality: Modality): RoutineItem[] {
  switch (modality) {
    case 'strength':
      return [{ id: 'q1', exerciseId: 'supino_reto_articulado', prescription: { kind: 'strength', sets: Array.from({ length: 4 }, () => ({ reps: 10, kg: 40, restS: 90 })) } }];
    case 'martial':
      return [{ id: 'q1', exerciseId: 'shadow_boxing', prescription: { kind: 'martial', rounds: 3, workS: 180, restS: 60, prepareS: 10, comboIds: [], calloutEveryS: 12, randomize: true } }];
    case 'calisthenics':
      return [{ id: 'q1', exerciseId: 'pushups', prescription: { kind: 'calisthenics', sets: Array.from({ length: 3 }, () => ({ mode: 'reps' as const, reps: 12, restS: 60, level: 2, loadKg: 0 })) } }];
  }
}

/** Treino rápido com um exercício do catálogo (a partir da tela de detalhe). */
export function quickItemsFor(exerciseId: string): RoutineItem[] {
  const ex = getExercise(exerciseId);
  if (!ex) return [];
  if (ex.modality === 'strength') {
    return [{ id: 'q1', exerciseId, prescription: { kind: 'strength', sets: Array.from({ length: 4 }, () => ({ reps: 10, kg: 20, restS: ex.attributes.defaultRestS ?? 90 })) } }];
  }
  if (ex.modality === 'martial') {
    const style = ex.attributes.style ?? 'boxing';
    return [{ id: 'q1', exerciseId, prescription: { kind: 'martial', rounds: 3, workS: 180, restS: 60, prepareS: 10, comboIds: COMBOS.filter((c) => c.style === style).map((c) => c.id), calloutEveryS: 12, randomize: true } }];
  }
  const level = ex.attributes.progressionLevel ?? 1;
  return [{
    id: 'q1', exerciseId,
    prescription: {
      kind: 'calisthenics',
      sets: Array.from({ length: 3 }, () => (ex.tracking === 'hold' ? { mode: 'hold' as const, targetS: 20, restS: 90, level, loadKg: 0 } : { mode: 'reps' as const, reps: 8, restS: 90, level, loadKg: 0 })),
    },
  }];
}
