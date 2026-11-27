/** Catálogo de artes marciais (rounds e combos) — será expandido na fase 3. */
import { Combo, Exercise } from '../domain/types';
import { p, s, st } from './helpers';

export const MARTIAL: Exercise[] = [
  { id: 'boxing_rounds', name: 'Rounds de Boxe (saco)', modality: 'martial', tracking: 'round', level: 'intermediate', goals: ['conditioning'], equipment: ['Saco de pancada', 'Luvas'], muscles: [p('front_delts', 0.8), p('side_delts', 0.6), s('triceps', 0.5), s('obliques', 0.6), s('calves', 0.5), st('abs')], attributes: { style: 'boxing' } },
  { id: 'muay_thai_rounds', name: 'Rounds de Muay Thai', modality: 'martial', tracking: 'round', level: 'intermediate', goals: ['conditioning'], equipment: ['Saco de pancada', 'Caneleiras'], muscles: [p('front_delts', 0.7), p('obliques', 0.7), s('quads', 0.6), s('glutes', 0.6), s('calves', 0.6), s('abs', 0.5)], attributes: { style: 'muay_thai' } },
  { id: 'kickboxing_rounds', name: 'Rounds de Kickboxing', modality: 'martial', tracking: 'round', level: 'beginner', goals: ['conditioning', 'fat_loss'], equipment: ['Saco de pancada', 'Luvas'], muscles: [p('front_delts', 0.7), p('quads', 0.6), s('obliques', 0.6), s('glutes', 0.5), s('calves', 0.5)], attributes: { style: 'kickboxing' } },
  { id: 'shadow_boxing', name: 'Shadow Boxing', modality: 'martial', tracking: 'round', level: 'beginner', goals: ['conditioning', 'skill'], equipment: ['Nenhum'], muscles: [p('front_delts', 0.6), s('side_delts', 0.4), s('calves', 0.5), s('obliques', 0.4)], attributes: { style: 'boxing' } },
  { id: 'jump_rope', name: 'Pular Corda', modality: 'martial', tracking: 'round', level: 'beginner', goals: ['conditioning'], equipment: ['Corda'], muscles: [p('calves'), s('forearms', 0.4), s('front_delts', 0.3)], attributes: { style: 'boxing' } },
];

export const COMBOS: Combo[] = [
  { id: 'c_11_2', style: 'boxing', name: 'Jab Duplo, Direto', strikes: ['Jab', 'Jab', 'Direto'], callout: 'Um, um, dois', difficulty: 1 },
  { id: 'c_1_2', style: 'boxing', name: 'Jab, Direto', strikes: ['Jab', 'Direto'], callout: 'Um, dois', difficulty: 1 },
  { id: 'c_1_2_3', style: 'boxing', name: 'Jab, Direto, Cruzado', strikes: ['Jab', 'Direto', 'Cruzado'], callout: 'Um, dois, três', difficulty: 2 },
  { id: 'c_1_2_3_2', style: 'boxing', name: 'Jab, Direto, Cruzado, Direto', strikes: ['Jab', 'Direto', 'Cruzado', 'Direto'], callout: 'Um, dois, três, dois', difficulty: 3 },
  { id: 'c_1_6_3_2', style: 'boxing', name: 'Jab, Upper, Cruzado, Direto', strikes: ['Jab', 'Upper', 'Cruzado', 'Direto'], callout: 'Um, seis, três, dois', difficulty: 4 },
  { id: 'c_slip_2_3', style: 'boxing', name: 'Esquiva, Direto, Cruzado', strikes: ['Esquiva', 'Direto', 'Cruzado'], callout: 'Esquiva, dois, três', difficulty: 3 },
  { id: 'm_1_2_kick', style: 'muay_thai', name: 'Jab, Direto, Chute Lateral', strikes: ['Jab', 'Direto', 'Chute'], callout: 'Um, dois, chute', difficulty: 2 },
  { id: 'm_teep_2', style: 'muay_thai', name: 'Teep, Direto', strikes: ['Teep', 'Direto'], callout: 'Teep, dois', difficulty: 1 },
  { id: 'm_knee_elbow', style: 'muay_thai', name: 'Joelhada, Cotovelada', strikes: ['Joelho', 'Cotovelo'], callout: 'Joelho, cotovelo', difficulty: 3 },
  { id: 'm_1_2_3_kick', style: 'muay_thai', name: 'Jab, Direto, Cruzado, Chute', strikes: ['Jab', 'Direto', 'Cruzado', 'Chute'], callout: 'Um, dois, três, chute', difficulty: 3 },
  { id: 'k_1_2_low', style: 'kickboxing', name: 'Jab, Direto, Low Kick', strikes: ['Jab', 'Direto', 'Low kick'], callout: 'Um, dois, low', difficulty: 2 },
  { id: 'k_switch', style: 'kickboxing', name: 'Jab, Switch Kick', strikes: ['Jab', 'Switch kick'], callout: 'Um, troca, chute', difficulty: 3 },
];
