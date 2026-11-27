import { computeFatigue, entryStimulus, fatigueState, hoursToRecover, sessionMuscleLoad, tauHours } from '../fatigue';
import { Session, SessionEntry } from '../../../core/domain/types';

const H = 3_600_000;
const NOW = 1_800_000_000_000;

const benchSets = (n: number, kg = 80, reps = 8, rpe = 9): SessionEntry[] =>
  Array.from({ length: n }, (_, i) => ({ id: `e${i}`, exerciseId: 'supino_reto_smith', blockIndex: 0, entryIndex: i, completedAt: NOW, result: { kind: 'strength', kg, reps, rpe } }));

const session = (entries: SessionEntry[], hoursAgo: number): Session => ({
  id: 's', modality: 'strength', title: 't', status: 'completed', startedAt: NOW - hoursAgo * H, endedAt: NOW - hoursAgo * H,
  activeSeconds: 0, entries, summary: {},
});

describe('fadiga muscular', () => {
  it('τ faz 100% → 30% levar exatamente recoveryHours', () => {
    expect(hoursToRecover(100, 'chest')).toBeCloseTo(48, 5);
    expect(hoursToRecover(100, 'quads')).toBeCloseTo(72, 5);
    expect(hoursToRecover(100, 'forearms')).toBeCloseTo(24, 5);
    expect(tauHours('chest')).toBeCloseTo(48 / Math.log(100 / 30), 6);
  });

  it('estados nas faixas certas', () => {
    expect(fatigueState(10)).toBe('recovered');
    expect(fatigueState(40)).toBe('recovering');
    expect(fatigueState(70)).toBe('weakened');
    expect(fatigueState(92)).toBe('fatigued');
  });

  it('8 séries pesadas de supino fadigam o peitoral acima de 80% e o tríceps menos', () => {
    const load = sessionMuscleLoad(benchSets(8), 80);
    expect(load.chest!).toBeGreaterThan(80);
    expect(load.triceps!).toBeLessThan(load.chest!);
    expect(load.quads).toBeUndefined();
  });

  it('decai exponencialmente e volta a "recuperado" após ~48h', () => {
    const f0 = computeFatigue([session(benchSets(8), 0)], 80, NOW).chest;
    const f24 = computeFatigue([session(benchSets(8), 24)], 80, NOW).chest;
    const f50 = computeFatigue([session(benchSets(8), 50)], 80, NOW).chest;
    expect(f0.state).toBe('fatigued');
    expect(f24.pct).toBeCloseTo(f0.pct * Math.exp(-24 / tauHours('chest')), 5);
    expect(f50.state).toBe('recovered');
  });

  it('sessões somam mas saturam em 100%', () => {
    const f = computeFatigue([session(benchSets(10), 1), session(benchSets(10), 2)], 80, NOW).chest;
    expect(f.pct).toBe(100);
  });

  it('modalidades: rounds de luta e hold de calistenia geram estímulo', () => {
    expect(entryStimulus({ kind: 'martial', workS: 180, comboIds: [], freestyle: false, intensity: 0.8 }, 80)).toBeCloseTo(9.6);
    const hold = entryStimulus({ kind: 'calisthenics', mode: 'hold', holdS: 20, level: 4, loadKg: 0 }, 80);
    const weighted = entryStimulus({ kind: 'calisthenics', mode: 'hold', holdS: 20, level: 4, loadKg: 10 }, 80);
    const assisted = entryStimulus({ kind: 'calisthenics', mode: 'hold', holdS: 20, level: 4, loadKg: -20 }, 80);
    expect(weighted).toBeGreaterThan(hold);
    expect(assisted).toBeLessThan(hold);
  });

  it('ignora sessões não concluídas e com mais de 7 dias', () => {
    const s1 = { ...session(benchSets(8), 1), status: 'abandoned' as const };
    const s2 = session(benchSets(8), 24 * 8);
    expect(computeFatigue([s1, s2], 80, NOW).chest.pct).toBe(0);
  });
});
