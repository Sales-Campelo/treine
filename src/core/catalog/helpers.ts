import { ExerciseMuscle, MuscleId } from '../domain/types';

/** Músculo primário (ativação padrão 1). */
export const p = (muscle: MuscleId, activation = 1): ExerciseMuscle => ({ muscle, role: 'primary', activation });
/** Músculo secundário (ativação padrão 0,6). */
export const s = (muscle: MuscleId, activation = 0.6): ExerciseMuscle => ({ muscle, role: 'secondary', activation });
/** Estabilizador (ativação padrão 0,4). */
export const st = (muscle: MuscleId, activation = 0.4): ExerciseMuscle => ({ muscle, role: 'stabilizer', activation });
