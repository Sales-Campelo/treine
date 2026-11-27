/**
 * Catálogo de calistenia — 150 exercícios de peso corporal da free-exercise-db (domínio público).
 *  - calisthenics.generated.ts: nível, músculos e id de origem (gerado por scripts/cali/build-media.mjs)
 *  - calisthenicsMedia.ts:      frames da animação (posição inicial e final, WebP)
 *  - calisthenics/part*.ts:     conteúdo em português (nome, grupos, equipamento, dica e passo a passo)
 */
import { Exercise, Goal, Level } from '../domain/types';
import { CALI_SOURCE } from './calisthenics.generated';
import { CALI_MEDIA } from './calisthenicsMedia';
import { PART1 } from './calisthenics/part1';
import { PART2 } from './calisthenics/part2';
import { PART3 } from './calisthenics/part3';
import { PART4 } from './calisthenics/part4';
import { CaliPt } from './calisthenics/types';
import { p, s } from './helpers';

const PT: Record<string, CaliPt> = Object.fromEntries([...PART1, ...PART2, ...PART3, ...PART4].map((x) => [x.id, x]));
const PROGRESSION: Record<Level, number> = { beginner: 1, intermediate: 3, advanced: 5 };

function goalsFor(pt: CaliPt): Goal[] {
  if (pt.groups.includes('plyo')) return ['conditioning', 'strength'];
  if (pt.groups.includes('mobility')) return ['endurance', 'skill'];
  if (pt.hold) return ['skill', 'endurance'];
  return ['strength', 'hypertrophy'];
}

export const CALISTHENICS: Exercise[] = CALI_SOURCE.map((src, i) => {
  const pt = PT[src.id];
  if (!pt) throw new Error(`Calistenia sem conteúdo PT: ${src.id}`);
  return {
    id: src.id,
    name: pt.name,
    modality: 'calisthenics',
    tracking: pt.hold ? 'hold' : 'reps',
    level: src.level,
    goals: goalsFor(pt),
    equipment: pt.equipment,
    muscles: [...src.primary.map((m) => p(m)), ...src.secondary.map((m) => s(m, 0.5))],
    tip: pt.tip,
    steps: pt.steps,
    groups: pt.groups,
    catalogNo: i + 1,
    sourceId: src.sourceId,
    media: CALI_MEDIA[src.id],
    attributes: { progressionTree: src.id, progressionLevel: PROGRESSION[src.level], maxLevel: 5 },
  };
});
