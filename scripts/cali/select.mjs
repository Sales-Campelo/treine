// Lista candidatos de calistenia (peso corporal) da free-exercise-db.
// Uso: node scripts/cali/select.mjs  → imprime id | categoria | nível | músculos
import { readFileSync } from 'node:fs';
const DB = new URL('../../exerciciosGifs/calisteniaGifs/free-exercise-db/dist/exercises.json', import.meta.url);
const all = JSON.parse(readFileSync(DB, 'utf8'));
const EXCLUDE = /sled|plate|weighted|tire|keg|atlas|yoke|log_lift|farmers|rickshaw|car_deadlift|conans|circus|axle|chain|sandbag|trap_bar|power_stairs|neck|harness|prowler|bicycling|skating|trail|rope_jumping|battling|svend|balance_board|wrist_roller|crucifix|drag|sledgehammer|heavy_bag|exercise_ball|backward_drag|platform/i;
export const candidates = all.filter(
  (e) => ['body only', 'other', null].includes(e.equipment) && ['strength', 'plyometrics'].includes(e.category) && !EXCLUDE.test(e.id),
);
if (process.argv[1].endsWith('select.mjs')) {
  console.log(candidates.length);
  for (const e of candidates) console.log([e.id, e.category, e.level, e.primaryMuscles.join('/'), e.secondaryMuscles.join('/')].join(' | '));
}
