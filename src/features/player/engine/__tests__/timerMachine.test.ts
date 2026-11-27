import { clock, createTimer, PhaseSpec, transition, TimerState, TimerEvent, Effect } from '../timerMachine';
import { buildMartialPlan, buildStrengthPlan, buildCalisthenicsPlan, buildPlan, PREPARE_S } from '../plans';
import { SEED_ROUTINES } from '../../../../core/catalog/seedRoutines';

const run = (s: TimerState, ...events: TimerEvent[]) => {
  const effects: Effect[] = [];
  for (const e of events) {
    const t = transition(s, e);
    s = t.state;
    effects.push(...t.effects);
  }
  return { s, effects };
};
const T0 = 1_000_000;

const martialItem = SEED_ROUTINES[1].days[0].items[0];
const strengthItems = SEED_ROUTINES[0].days[0].items;
const caliItems = SEED_ROUTINES[2].days[0].items;

describe('timerMachine — artes marciais (ciclo automático)', () => {
  const plan = buildPlan([martialItem], 42);

  it('gera PREPARE + 10 rounds + 9 descansos', () => {
    expect(plan[0].kind).toBe('PREPARE');
    expect(plan.filter((p) => p.kind === 'ACTIVE_WORK')).toHaveLength(10);
    expect(plan.filter((p) => p.kind === 'REST')).toHaveLength(9);
  });

  it('IDLE → PREPARE → ACTIVE_WORK → REST automaticamente com gongo e TTS', () => {
    let { s, effects } = run(createTimer(plan), { type: 'START', now: T0 });
    expect(s.status).toBe('PREPARE');
    expect(effects.some((e) => e.type === 'speak' && e.text.startsWith('Prepare-se!'))).toBe(true);

    ({ s, effects } = run(s, { type: 'TICK', now: T0 + 10_000 }));
    expect(s.status).toBe('ACTIVE_WORK');
    expect(effects).toContainEqual({ type: 'sound', sound: 'gong' });
    expect(effects.some((e) => e.type === 'speak' && e.text.startsWith('Round 1.'))).toBe(true);

    ({ s, effects } = run(s, { type: 'TICK', now: T0 + 10_000 + 170_000 }));
    expect(effects).toContainEqual({ type: 'sound', sound: 'warning' }); // aviso de 10 s finais

    ({ s, effects } = run(s, { type: 'TICK', now: T0 + 10_000 + 180_000 }));
    expect(s.status).toBe('REST');
    expect(s.completed).toEqual([expect.objectContaining({ kind: 'ACTIVE_WORK', reason: 'timeout', elapsedMs: 180_000 })]);
  });

  it('narra o combo durante o round a cada calloutEveryS', () => {
    let { s } = run(createTimer(plan), { type: 'START', now: T0 }, { type: 'TICK', now: T0 + 10_000 });
    const { effects } = run(s, { type: 'TICK', now: T0 + 10_000 + 12_000 });
    expect(effects.filter((e) => e.type === 'speak')).toHaveLength(1);
  });

  it('PAUSE congela o relógio e RESUME desloca endsAt', () => {
    let { s } = run(createTimer(plan), { type: 'START', now: T0 }, { type: 'PAUSE', now: T0 + 4_000 });
    expect(s.status).toBe('PAUSED');
    expect(clock(s, T0 + 60_000).remainingMs).toBe(6_000);
    ({ s } = run(s, { type: 'RESUME', now: T0 + 60_000 }, { type: 'TICK', now: T0 + 65_000 }));
    expect(s.status).toBe('PREPARE');
    expect(clock(s, T0 + 65_000).remainingMs).toBe(1_000);
    expect(clock(s, T0 + 65_000).sessionMs).toBe(9_000);
  });

  it('volta do background: alcança várias fases sem tocar áudio atrasado', () => {
    let { s } = run(createTimer(plan), { type: 'START', now: T0 });
    // 10 s prepare + 180 round + 60 rest + 30 s no round 2
    const { s: s2, effects } = run(s, { type: 'TICK', now: T0 + 10_000 + 180_000 + 60_000 + 30_000 });
    expect(s2.status).toBe('ACTIVE_WORK');
    expect(s2.plan[s2.index].ref?.round).toBe(2);
    expect(effects.some((e) => e.type === 'sound' && e.sound === 'gong')).toBe(false);
    expect(s2.completed.map((c) => c.kind)).toEqual(['PREPARE', 'ACTIVE_WORK', 'REST']);
  });

  it('termina em COMPLETED após o último round', () => {
    const total = plan.reduce((a, p) => a + (p.durationMs ?? 0), 0);
    const { s } = run(createTimer(plan), { type: 'START', now: T0 }, { type: 'TICK', now: T0 + total + 5 });
    expect(s.status).toBe('COMPLETED');
  });
});

describe('timerMachine — musculação (trabalho manual + descanso regressivo)', () => {
  const plan = buildStrengthPlan(strengthItems);

  it('não tem descanso após a última série', () => {
    expect(plan.at(-1)!.kind).toBe('ACTIVE_WORK');
    expect(plan.filter((p) => p.kind === 'ACTIVE_WORK')).toHaveLength(19);
  });

  it('ACTIVE_WORK não expira; SET_DONE dispara REST de 90 s que volta sozinho', () => {
    let { s } = run(createTimer(plan), { type: 'START', now: T0 }, { type: 'TICK', now: T0 + 600_000 });
    expect(s.status).toBe('ACTIVE_WORK');
    ({ s } = run(s, { type: 'SET_DONE', now: T0 + 600_000 }));
    expect(s.status).toBe('REST');
    expect(s.completed[0]).toMatchObject({ reason: 'done', elapsedMs: 600_000 });
    expect(clock(s, T0 + 630_000).remainingMs).toBe(60_000);
    const { s: s2, effects } = run(s, { type: 'TICK', now: T0 + 690_000 });
    expect(s2.status).toBe('ACTIVE_WORK');
    expect(effects).toContainEqual({ type: 'sound', sound: 'bell' });
  });

  it('ADJUST +15 s estende o descanso e SKIP pula', () => {
    let { s } = run(createTimer(plan), { type: 'START', now: T0 }, { type: 'SET_DONE', now: T0 + 1 }, { type: 'ADJUST', deltaMs: 15_000, now: T0 + 2 });
    expect(clock(s, T0 + 1).remainingMs).toBe(105_000);
    ({ s } = run(s, { type: 'SKIP', now: T0 + 5_000 }));
    expect(s.status).toBe('ACTIVE_WORK');
    expect(s.completed[0]).toMatchObject({ kind: 'REST', reason: 'skip' });
  });
});

describe('timerMachine — calistenia (hold com meta)', () => {
  const plan = buildCalisthenicsPlan(caliItems);

  it('hold conta para cima e toca sino ao atingir a meta, sem auto-avançar', () => {
    const fl = plan.findIndex((p) => p.ref?.exerciseId === 'plank' && p.kind === 'ACTIVE_WORK');
    const sub: PhaseSpec[] = plan.slice(fl, fl + 2);
    let { s } = run(createTimer(sub), { type: 'START', now: T0 });
    expect(s.targetMs).toBe(30_000);
    const { s: s2, effects } = run(s, { type: 'TICK', now: T0 + 30_100 });
    expect(effects).toContainEqual({ type: 'sound', sound: 'bell' });
    expect(s2.status).toBe('ACTIVE_WORK');
    expect(clock(s2, T0 + 30_100).progress).toBe(1);
    ({ s } = run(s2, { type: 'ADJUST', deltaMs: 5000, now: T0 + 31_000 }));
    expect(s.targetMs).toBe(35_000);
    expect(s.firedCues).not.toContain('target'); // rearmado
  });

  it('EMOM gera 10 fases de 60 s automáticas', () => {
    const emom = buildCalisthenicsPlan(SEED_ROUTINES[2].days.find((d) => d.id === 'd_cali_emom')!.items);
    expect(emom.filter((p) => p.kind === 'ACTIVE_WORK' && p.durationMs === 60_000 && p.autoAdvance)).toHaveLength(10);
  });
});

describe('buildPlan', () => {
  it('insere descanso entre blocos e mantém índices de bloco', () => {
    const plan = buildPlan(strengthItems.slice(0, 2));
    const blocks = [...new Set(plan.filter((p) => p.kind === 'ACTIVE_WORK').map((p) => p.ref!.blockIndex))];
    expect(blocks).toEqual([0, 1]);
  });
});

describe('ajustes v1.1 — PREPARE global, circuitos, híbrido, pausa', () => {
  const routines = SEED_ROUTINES;
  const day = (rid: string, did: string) => routines.find((r) => r.id === rid)!.days.find((d) => d.id === did)!;

  it('todo plano começa com UM PREPARE de 10 s, em qualquer modalidade', () => {
    for (const items of [strengthItems, [martialItem], caliItems, day('r_cali', 'd_cali_emom').items]) {
      const plan = buildPlan(items, 1);
      expect(plan[0]).toMatchObject({ kind: 'PREPARE', durationMs: PREPARE_S * 1000, autoAdvance: true });
      expect(plan.filter((p) => p.kind === 'PREPARE')).toHaveLength(1);
      expect(plan[1].kind).toBe('ACTIVE_WORK');
    }
    expect(buildMartialPlan(martialItem, 1)[0].kind).toBe('ACTIVE_WORK');
  });

  it('musculação: após 10 s de preparação entra na 1ª série (aberta)', () => {
    const { s } = run(createTimer(buildPlan(strengthItems, 1)), { type: 'START', now: T0 }, { type: 'TICK', now: T0 + 10_000 });
    expect(s.status).toBe('ACTIVE_WORK');
    expect(s.endsAt).toBeNull();
  });

  it('ciclo: 3 voltas × 4 exercícios = 12 trabalhos, sem descanso entre exercícios e 2 descansos de ciclo', () => {
    const plan = buildPlan(day('r_cali', 'd_cali_ciclo').items, 1);
    const work = plan.filter((p) => p.kind === 'ACTIVE_WORK');
    expect(work).toHaveLength(12);
    const rests = plan.filter((p) => p.kind === 'REST');
    expect(rests).toHaveLength(2);
    expect(rests.every((r) => r.durationMs === 120_000)).toBe(true);
    // ordem: volta 1 = blocos 0,1,2,3 consecutivos
    expect(plan.slice(1, 5).map((p) => [p.kind, p.ref?.blockIndex, p.ref?.circuitRound])).toEqual([
      ['ACTIVE_WORK', 0, 1], ['ACTIVE_WORK', 1, 1], ['ACTIVE_WORK', 2, 1], ['ACTIVE_WORK', 3, 1],
    ]);
    expect(plan[5].kind).toBe('REST');
    expect(work[11].ref).toMatchObject({ blockIndex: 3, entryIndex: 2, circuitRound: 3, circuitPos: 3, circuitSize: 4 });
    // hold do hollow mantém a meta
    expect(work[3].targetMs).toBe(30_000);
  });

  it('ciclo: SET_DONE em um exercício vai direto ao próximo (sem REST)', () => {
    const plan = buildPlan(day('r_cali', 'd_cali_ciclo').items, 1);
    let { s } = run(createTimer(plan), { type: 'START', now: T0 }, { type: 'TICK', now: T0 + 10_000 });
    ({ s } = run(s, { type: 'SET_DONE', now: T0 + 20_000 }));
    expect(s.status).toBe('ACTIVE_WORK');
    expect(s.plan[s.index].ref?.circuitPos).toBe(1);
  });

  it('híbrido: o plano alterna o tipo de bloco (supino → barra fixa → boxe)', () => {
    const items = [
      strengthItems[0],
      { id: 'h2', exerciseId: 'pullups', prescription: { kind: 'calisthenics' as const, sets: [{ mode: 'reps' as const, reps: 8, restS: 60, level: 3, loadKg: 0 }] } },
      { ...martialItem, prescription: { ...martialItem.prescription, rounds: 2 } as typeof martialItem.prescription },
    ];
    const plan = buildPlan(items, 1);
    const blocks = plan.filter((p) => p.kind === 'ACTIVE_WORK').map((p) => p.ref!.blockIndex);
    expect([...new Set(blocks)]).toEqual([0, 1, 2]);
    expect(plan.filter((p) => p.kind === 'ACTIVE_WORK' && p.ref?.blockIndex === 2).every((p) => p.durationMs === 180_000)).toBe(true);
  });

  it('PAUSE numa série aberta congela o cronômetro da série e o relógio total', () => {
    let { s } = run(createTimer(buildPlan(strengthItems, 1)), { type: 'START', now: T0 }, { type: 'TICK', now: T0 + 10_000 });
    ({ s } = run(s, { type: 'PAUSE', now: T0 + 25_000 }));
    expect(clock(s, T0 + 200_000).elapsedMs).toBe(15_000);
    expect(clock(s, T0 + 200_000).sessionMs).toBe(25_000);
    ({ s } = run(s, { type: 'RESUME', now: T0 + 200_000 }));
    expect(clock(s, T0 + 205_000).elapsedMs).toBe(20_000);
  });
});
