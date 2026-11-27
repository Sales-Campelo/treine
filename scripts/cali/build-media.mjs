/**
 * Pipeline do catálogo de calistenia (fonte: free-exercise-db, domínio público).
 *
 *   node scripts/cali/build-media.mjs [--dump caminho.json]
 *
 * Para cada id de scripts/cali/selection.json:
 *  1. converte exercises/<Id>/0.jpg e 1.jpg em assets/exercises/cali/<slug>-0.webp / -1.webp (480 px, q72);
 *  2. gera src/core/catalog/calisthenicsMedia.ts  → { slug: [require(frame0), require(frame1)] };
 *  3. gera src/core/catalog/calisthenics.generated.ts → dados mecânicos (nível, músculos, fonte).
 * Idempotente: pode rodar de novo a qualquer momento.
 */
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const DB_DIR = join(ROOT, 'exerciciosGifs', 'calisteniaGifs', 'free-exercise-db');
const OUT_DIR = join(ROOT, 'assets', 'exercises', 'cali');
const selection = JSON.parse(readFileSync(join(ROOT, 'scripts', 'cali', 'selection.json'), 'utf8'));
const db = JSON.parse(readFileSync(join(DB_DIR, 'dist', 'exercises.json'), 'utf8'));
const byId = Object.fromEntries(db.map((e) => [e.id, e]));

export const slug = (id) => id.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');

/** Músculos da base → MuscleId do app (mapa de fadiga). */
const MUSCLE_MAP = {
  abdominals: ['abs'],
  quadriceps: ['quads'],
  'middle back': ['upper_back'],
  'lower back': ['lower_back'],
  shoulders: ['front_delts', 'side_delts'],
  abductors: ['glutes'],
  neck: ['traps'],
  lats: ['lats'],
  chest: ['chest'],
  triceps: ['triceps'],
  biceps: ['biceps'],
  glutes: ['glutes'],
  hamstrings: ['hamstrings'],
  calves: ['calves'],
  adductors: ['adductors'],
  traps: ['traps'],
  forearms: ['forearms'],
};
const LEVEL = { beginner: 'beginner', intermediate: 'intermediate', expert: 'advanced' };
const mapMuscles = (list) => [...new Set(list.flatMap((m) => MUSCLE_MAP[m] ?? []))];

mkdirSync(OUT_DIR, { recursive: true });
copyFileSync(join(DB_DIR, 'LICENSE.md'), join(OUT_DIR, 'LICENSE.txt'));

const generated = [];
const media = [];
let bytes = 0;
for (const sourceId of selection) {
  const e = byId[sourceId];
  if (!e) throw new Error(`id inexistente na base: ${sourceId}`);
  const id = slug(sourceId);
  for (const f of [0, 1]) {
    const src = join(DB_DIR, 'exercises', e.images[f]);
    const dst = join(OUT_DIR, `${id}-${f}.webp`);
    if (!existsSync(dst)) await sharp(src).resize({ width: 480 }).webp({ quality: 72 }).toFile(dst);
    bytes += readFileSync(dst).length;
  }
  const primary = mapMuscles(e.primaryMuscles);
  const secondary = mapMuscles(e.secondaryMuscles).filter((m) => !primary.includes(m));
  generated.push({ id, sourceId, level: LEVEL[e.level] ?? 'beginner', category: e.category, primary, secondary });
  media.push(`  '${id}': [require('../../../assets/exercises/cali/${id}-0.webp'), require('../../../assets/exercises/cali/${id}-1.webp')],`);
}

const header = '// ARQUIVO GERADO por scripts/cali/build-media.mjs — não editar à mão.\n';
writeFileSync(
  join(ROOT, 'src', 'core', 'catalog', 'calisthenicsMedia.ts'),
  `${header}/** Frames (posição inicial/final) de cada exercício de calistenia, para a animação. */\nexport const CALI_MEDIA: Record<string, number[]> = {\n${media.join('\n')}\n};\n`,
);
writeFileSync(
  join(ROOT, 'src', 'core', 'catalog', 'calisthenics.generated.ts'),
  `${header}import { Level, MuscleId } from '../domain/types';\n\nexport interface CaliSource {\n  id: string;\n  sourceId: string;\n  level: Level;\n  category: 'strength' | 'plyometrics' | 'stretching';\n  primary: MuscleId[];\n  secondary: MuscleId[];\n}\n\n/** Dados mecânicos dos 150 exercícios (free-exercise-db, domínio público). */\nexport const CALI_SOURCE: CaliSource[] = ${JSON.stringify(generated, null, 2).replace(/"(\w+)":/g, '$1:').replace(/"/g, "'")};\n`,
);

const dump = process.argv.indexOf('--dump');
if (dump > 0) {
  writeFileSync(process.argv[dump + 1], JSON.stringify(selection.map((s) => ({ id: slug(s), name: byId[s].name, primary: byId[s].primaryMuscles, steps: byId[s].instructions })), null, 1));
}
console.log(`${generated.length} exercícios • ${generated.length * 2} imagens • ${(bytes / 1024 / 1024).toFixed(2)} MB`);
