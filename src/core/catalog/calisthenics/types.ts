import { CatalogGroup } from '../../domain/types';

/** Conteúdo em português de um exercício de calistenia (o resto vem de calisthenics.generated.ts). */
export interface CaliPt {
  id: string;
  name: string;
  groups: CatalogGroup[];
  equipment: string[];
  tip: string;
  steps: string[];
  /** Isometria (prancha, ponte lateral…) → cronômetro de hold. */
  hold?: boolean;
}

export const c = (id: string, name: string, groups: CatalogGroup[], equipment: string[], tip: string, steps: string[], hold = false): CaliPt => ({
  id, name, groups, equipment, tip, steps, hold,
});

// Vocabulário de equipamentos
export const PC = 'Peso corporal';
export const BARRA = 'Barra fixa';
export const PARALELAS = 'Paralelas';
export const BANCO = 'Banco';
export const CAIXA = 'Caixa / plataforma';
export const ARGOLAS = 'Argolas / suspensão';
export const RODA = 'Roda abdominal';
export const ELASTICO = 'Elástico';
export const CORDA = 'Corda';
export const CONES = 'Cones / barreiras';
