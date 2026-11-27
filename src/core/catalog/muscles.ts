import { MuscleGroup, MuscleId } from '../domain/types';

export const MUSCLES: Record<MuscleId, MuscleGroup> = {
  chest:       { id: 'chest',       name: 'Peitoral',          region: 'upper', views: ['front'], recoveryHours: 48, sizeFactor: 1.1 },
  front_delts: { id: 'front_delts', name: 'Deltoide anterior', region: 'upper', views: ['front'], recoveryHours: 48, sizeFactor: 0.8 },
  side_delts:  { id: 'side_delts',  name: 'Deltoide lateral',  region: 'upper', views: ['front', 'back'], recoveryHours: 48, sizeFactor: 0.7 },
  rear_delts:  { id: 'rear_delts',  name: 'Deltoide posterior', region: 'upper', views: ['back'], recoveryHours: 48, sizeFactor: 0.7 },
  biceps:      { id: 'biceps',      name: 'Bíceps',            region: 'upper', views: ['front'], recoveryHours: 48, sizeFactor: 0.7 },
  triceps:     { id: 'triceps',     name: 'Tríceps',           region: 'upper', views: ['back'], recoveryHours: 48, sizeFactor: 0.8 },
  forearms:    { id: 'forearms',    name: 'Antebraços',        region: 'upper', views: ['front', 'back'], recoveryHours: 24, sizeFactor: 0.6 },
  abs:         { id: 'abs',         name: 'Abdômen',           region: 'core',  views: ['front'], recoveryHours: 24, sizeFactor: 0.8 },
  obliques:    { id: 'obliques',    name: 'Oblíquos',          region: 'core',  views: ['front'], recoveryHours: 24, sizeFactor: 0.7 },
  traps:       { id: 'traps',       name: 'Trapézio',          region: 'upper', views: ['back', 'front'], recoveryHours: 48, sizeFactor: 0.9 },
  lats:        { id: 'lats',        name: 'Grande dorsal',     region: 'upper', views: ['back'], recoveryHours: 72, sizeFactor: 1.3 },
  upper_back:  { id: 'upper_back',  name: 'Romboides / Costas', region: 'upper', views: ['back'], recoveryHours: 48, sizeFactor: 1.0 },
  lower_back:  { id: 'lower_back',  name: 'Lombar',            region: 'core',  views: ['back'], recoveryHours: 72, sizeFactor: 1.0 },
  glutes:      { id: 'glutes',      name: 'Glúteos',           region: 'lower', views: ['back'], recoveryHours: 72, sizeFactor: 1.3 },
  quads:       { id: 'quads',       name: 'Quadríceps',        region: 'lower', views: ['front'], recoveryHours: 72, sizeFactor: 1.5 },
  hamstrings:  { id: 'hamstrings',  name: 'Posteriores de coxa', region: 'lower', views: ['back'], recoveryHours: 72, sizeFactor: 1.2 },
  calves:      { id: 'calves',      name: 'Panturrilhas',      region: 'lower', views: ['front', 'back'], recoveryHours: 24, sizeFactor: 0.7 },
  adductors:   { id: 'adductors',   name: 'Adutores',          region: 'lower', views: ['front'], recoveryHours: 48, sizeFactor: 0.9 },
};

export const MUSCLE_IDS = Object.keys(MUSCLES) as MuscleId[];

/** Grupos amigáveis usados em filtros/gráficos. */
export const MUSCLE_FAMILIES: { id: string; name: string; muscles: MuscleId[] }[] = [
  { id: 'chest', name: 'Peito', muscles: ['chest'] },
  { id: 'back', name: 'Costas', muscles: ['lats', 'upper_back', 'traps', 'lower_back'] },
  { id: 'shoulders', name: 'Ombros', muscles: ['front_delts', 'side_delts', 'rear_delts'] },
  { id: 'arms', name: 'Braços', muscles: ['biceps', 'triceps', 'forearms'] },
  { id: 'legs', name: 'Pernas', muscles: ['quads', 'hamstrings', 'glutes', 'calves', 'adductors'] },
  { id: 'core', name: 'Core', muscles: ['abs', 'obliques'] },
];
