import { StrengthGroup } from '../../domain/types';
import { EXERCISES, getExercise, LEGACY_EXERCISE_IDS, STRENGTH, STRENGTH_SHARED_NUMBERS } from '../exercises';
import { CALISTHENICS } from '../calisthenics';
import { readFileSync } from 'fs';
import { join } from 'path';
import { MUSCLES } from '../muscles';
import { SEED_ROUTINES } from '../seedRoutines';
import { quickItems } from '../../../features/player/engine/plans';

describe('catálogo de musculação (fase 1)', () => {
  it('tem 149 cadastros cobrindo os 150 números da lista', () => {
    expect(STRENGTH).toHaveLength(149);
    const nums = new Set(STRENGTH.map((e) => e.catalogNo));
    for (const [n, id] of Object.entries(STRENGTH_SHARED_NUMBERS)) {
      expect(getExercise(id)).toBeDefined();
      nums.add(Number(n));
    }
    expect([...nums].sort((a, b) => a! - b!)).toEqual(Array.from({ length: 150 }, (_, i) => i + 1));
  });

  it('ids únicos em todo o catálogo', () => {
    const ids = EXERCISES.map((e) => e.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('contagem por grupo bate com a lista oficial', () => {
    const count = (g: StrengthGroup) => STRENGTH.filter((e) => e.groups?.includes(g)).length;
    expect({
      chest: count('chest'), back: count('back'), shoulders: count('shoulders'), legs: count('legs'),
      calves: count('calves'), biceps: count('biceps'), triceps: count('triceps'), core: count('core'),
    }).toEqual({ chest: 20, back: 25, shoulders: 22, legs: 35, calves: 8, biceps: 16, triceps: 14, core: 10 });
  });

  it('supino fechado no Smith aparece em Peitoral e Tríceps', () => {
    expect(getExercise('supino_fechado_smith')?.groups).toEqual(['chest', 'triceps']);
  });

  it.each(STRENGTH.map((e) => [e.catalogNo, e]))('nº %s tem dados completos', (_n, e) => {
    expect(e.modality).toBe('strength');
    expect(e.name.length).toBeGreaterThan(5);
    expect(e.tip && e.tip.length).toBeGreaterThan(20);
    expect(e.equipment.length).toBeGreaterThan(0);
    expect(e.attributes.defaultRestS).toBeGreaterThan(0);
    expect(e.muscles.some((m) => m.role === 'primary')).toBe(true);
    for (const m of e.muscles) {
      expect(MUSCLES[m.muscle]).toBeDefined();
      expect(m.activation).toBeGreaterThan(0);
      expect(m.activation).toBeLessThanOrEqual(1);
    }
  });

  it('adutores existem no mapa e são treinados pela cadeira adutora', () => {
    expect(MUSCLES.adductors.name).toBe('Adutores');
    expect(getExercise('cadeira_adutora')?.muscles[0]).toMatchObject({ muscle: 'adductors', role: 'primary' });
  });

  it('todas as fichas seed e o treino livre usam exercícios existentes', () => {
    const ids = [
      ...SEED_ROUTINES.flatMap((r) => r.days.flatMap((d) => d.items.map((i) => i.exerciseId))),
      ...(['strength', 'martial', 'calisthenics'] as const).flatMap((m) => quickItems(m).map((i) => i.exerciseId)),
    ].filter(Boolean);
    for (const id of ids) expect(getExercise(id)).toBeDefined();
    // as fichas de musculação usam só o catálogo novo
    const strengthIds = SEED_ROUTINES.filter((r) => r.modality === 'strength').flatMap((r) => r.days.flatMap((d) => d.items.map((i) => i.exerciseId!)));
    for (const id of strengthIds) expect(STRENGTH.some((e) => e.id === id)).toBe(true);
  });

  it('ids legados resolvem para o catálogo novo', () => {
    for (const [old, now] of Object.entries(LEGACY_EXERCISE_IDS)) {
      expect(getExercise(old)?.id).toBe(now);
    }
  });
});

describe('catálogo de calistenia (fase 2 — free-exercise-db)', () => {
  const db: { id: string }[] = JSON.parse(readFileSync(join(__dirname, '../../../../exerciciosGifs/calisteniaGifs/free-exercise-db/dist/exercises.json'), 'utf8'));
  const dbIds = new Set(db.map((e) => e.id));

  it('tem exatamente 150 exercícios', () => {
    expect(CALISTHENICS).toHaveLength(150);
    expect(EXERCISES.filter((e) => e.modality === 'calisthenics')).toHaveLength(150);
  });

  it.each(CALISTHENICS.map((e) => [e.id, e]))('%s tem animação, conteúdo PT e origem válida', (_id, e) => {
    expect(e.media).toHaveLength(2);
    expect(e.sourceId && dbIds.has(e.sourceId)).toBe(true);
    expect(e.name).not.toEqual(e.sourceId);
    expect(e.tip && e.tip.length).toBeGreaterThan(15);
    expect(e.steps!.length).toBeGreaterThanOrEqual(2);
    expect(e.groups!.length).toBeGreaterThan(0);
    expect(e.muscles.some((m) => m.role === 'primary')).toBe(true);
    for (const m of e.muscles) expect(MUSCLES[m.muscle]).toBeDefined();
  });

  it('cobre todas as partes do corpo', () => {
    const n = (g: string) => CALISTHENICS.filter((e) => e.groups?.includes(g as never)).length;
    for (const g of ['chest', 'back', 'shoulders', 'core', 'legs', 'triceps', 'plyo', 'mobility']) expect(n(g)).toBeGreaterThanOrEqual(3);
    expect(CALISTHENICS.some((e) => e.muscles.some((m) => m.muscle === 'calves'))).toBe(true);
  });

  it('isometrias usam cronômetro de hold', () => {
    expect(getExercise('plank')?.tracking).toBe('hold');
    expect(getExercise('side_bridge')?.tracking).toBe('hold');
    expect(getExercise('pullups')?.tracking).toBe('reps');
  });

  it('as fichas de calistenia usam só o catálogo novo', () => {
    const ids = SEED_ROUTINES.filter((r) => r.modality === 'calisthenics').flatMap((r) => r.days.flatMap((d) => d.items.map((i) => i.exerciseId!)));
    for (const id of ids) expect(CALISTHENICS.some((e) => e.id === id)).toBe(true);
  });
});
