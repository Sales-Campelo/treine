/**
 * Gera supabase/seed/catalog.sql a partir do catálogo TypeScript (musculação + calistenia + lutas).
 *   npx tsx scripts/gen-catalog-sql.ts
 * Idempotente (upsert). UUIDs determinísticos (v5) a partir do slug do exercício.
 */
import { createHash } from 'node:crypto';
import { writeFileSync } from 'node:fs';
import { join, sep } from 'node:path';
import Module from 'node:module';

// Imagens são `require('...webp')` no app; aqui viram o caminho do asset.
(Module as unknown as { _extensions: Record<string, (m: { exports: unknown }, f: string) => void> })._extensions['.webp'] = (m, f) => {
  m.exports = f.split(sep).join('/').split('/assets/')[1];
};

const NS = '6f1c2b3e-9a4d-5e6f-8a7b-1c2d3e4f5a6b';
function uuidv5(name: string) {
  const ns = Buffer.from(NS.replace(/-/g, ''), 'hex');
  const h = createHash('sha1').update(Buffer.concat([ns, Buffer.from(name)])).digest();
  h[6] = (h[6] & 0x0f) | 0x50;
  h[8] = (h[8] & 0x3f) | 0x80;
  const x = h.subarray(0, 16).toString('hex');
  return `${x.slice(0, 8)}-${x.slice(8, 12)}-${x.slice(12, 16)}-${x.slice(16, 20)}-${x.slice(20)}`;
}
const q = (v: unknown) => (v == null ? 'null' : `'${String(v).replace(/'/g, "''")}'`);
const arr = (xs: string[]) => `array[${xs.map(q).join(',')}]::text[]`;

async function main() {
  const { EXERCISES } = await import('../src/core/catalog/exercises');
  const { MUSCLES } = await import('../src/core/catalog/muscles');
  const out: string[] = ['-- ARQUIVO GERADO por scripts/gen-catalog-sql.ts — não editar à mão.', 'begin;', ''];

  out.push('-- Grupos musculares (mapa de fadiga)');
  for (const m of Object.values(MUSCLES)) {
    const tau = (m.recoveryHours / Math.log(100 / 30)).toFixed(1);
    out.push(`insert into muscle_groups (id, name_pt, region, views, recovery_tau_h, size_factor) values (${q(m.id)}, ${q(m.name)}, ${q(m.region)}, array[${m.views.map(q).join(',')}]::body_view[], ${tau}, ${m.sizeFactor})
  on conflict (id) do update set name_pt = excluded.name_pt, region = excluded.region, views = excluded.views, recovery_tau_h = excluded.recovery_tau_h, size_factor = excluded.size_factor;`);
  }

  out.push('', `-- Exercícios (${EXERCISES.length})`);
  for (const e of EXERCISES) {
    const id = uuidv5(e.id);
    const media = (e.media ?? []) as unknown as string[];
    const attributes = {
      ...e.attributes,
      groups: e.groups ?? [],
      catalog_no: e.catalogNo ?? null,
      source_id: e.sourceId ?? null,
      steps: e.steps ?? [],
      tip: e.tip ?? null,
      media_keys: media,
      ...(e.modality === 'martial' ? { style: e.attributes.style ?? 'boxing' } : {}),
    };
    out.push(`insert into exercises (id, owner_id, slug, name_pt, modality, tracking, level, goals, equipment, media_url, instructions, attributes)
values ('${id}', null, ${q(e.id)}, ${q(e.name)}, '${e.modality}', '${e.tracking}', '${e.level}', array[${e.goals.map(q).join(',')}]::goal_kind[], ${arr(e.equipment)}, ${q(media[0] ?? null)}, ${q(e.steps?.join('\n') ?? e.tip ?? null)}, ${q(JSON.stringify(attributes))}::jsonb)
  on conflict (id) do update set slug = excluded.slug, name_pt = excluded.name_pt, tracking = excluded.tracking, level = excluded.level, goals = excluded.goals, equipment = excluded.equipment, media_url = excluded.media_url, instructions = excluded.instructions, attributes = excluded.attributes;`);
    out.push(`delete from exercise_muscles where exercise_id = '${id}';`);
    for (const m of e.muscles) {
      out.push(`insert into exercise_muscles (exercise_id, muscle_id, role, activation) values ('${id}', ${q(m.muscle)}, ${q(m.role)}, ${m.activation});`);
    }
  }
  out.push('', 'commit;', '');
  const file = join(__dirname, '..', 'supabase', 'seed', 'catalog.sql');
  writeFileSync(file, out.join('\n'));
  console.log(`${EXERCISES.length} exercícios → ${file}`);
}
main().catch((e) => {
  console.error(e);
  process.exit(1);
});
