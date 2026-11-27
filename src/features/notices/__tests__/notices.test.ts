import { QUOTES, quoteOfDay } from '../../../core/catalog/quotes';
import { SEED_ROUTINES } from '../../../core/catalog/seedRoutines';
import { startOfDay } from '../../../core/utils/format';
import { buildNotices, hasUnread } from '../notices';

const NOW = new Date(2026, 10, 26, 10, 0, 0).getTime();
const D = 86_400_000;

describe('frase do dia', () => {
  it('é determinística no mesmo dia e muda no dia seguinte', () => {
    expect(quoteOfDay(NOW)).toBe(quoteOfDay(NOW + 3 * 3_600_000));
    expect(quoteOfDay(NOW + D)).not.toBe(quoteOfDay(NOW));
    expect(QUOTES).toContain(quoteOfDay(NOW));
  });
});

describe('central de avisos', () => {
  const base = { now: NOW, routines: SEED_ROUTINES, sessions: [], measurements: [], activeSession: null };

  it('avisa treino agendado hoje e pede avaliação física quando não há medidas', () => {
    const n = buildNotices({ ...base, schedule: [{ id: 's1', date: startOfDay(NOW), routineId: 'r_hipertrofia', dayId: 'd_ppt' }] });
    expect(n.map((x) => x.kind)).toEqual(expect.arrayContaining(['schedule', 'weight']));
    expect(n.find((x) => x.kind === 'schedule')!.href?.params).toEqual({ routineId: 'r_hipertrofia', day: 'd_ppt' });
  });

  it('agendado já concluído hoje não gera aviso', () => {
    const n = buildNotices({
      ...base,
      schedule: [{ id: 's1', date: startOfDay(NOW), routineId: 'r_hipertrofia', dayId: 'd_ppt' }],
      sessions: [{ id: 'x', modality: 'strength', title: 't', routineDayId: 'd_ppt', status: 'completed', startedAt: NOW - 3_600_000, activeSeconds: 0, entries: [], summary: {} }],
    });
    expect(n.some((x) => x.kind === 'schedule')).toBe(false);
  });

  it('ponto no sino: só avisos vigentes e mais novos que a última visita', () => {
    const n = buildNotices({ ...base, schedule: [{ id: 's2', date: startOfDay(NOW) + D, routineId: 'r_boxe', dayId: 'd_boxe' }], measurements: [{ id: 'm', measuredAt: NOW, weightKg: 80, circumferences: {} }] });
    // lembrete de amanhã só vira "novo" às 18h de hoje
    expect(hasUnread(n, 0, NOW)).toBe(false);
    expect(hasUnread(n, 0, startOfDay(NOW) + 19 * 3_600_000)).toBe(true);
    expect(hasUnread(n, startOfDay(NOW) + 19 * 3_600_000, startOfDay(NOW) + 20 * 3_600_000)).toBe(false);
  });
});
