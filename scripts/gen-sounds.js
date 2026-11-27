// Gera os sons do timer como WAV mono 16-bit (sem dependências): node scripts/gen-sounds.js
const fs = require('fs');
const path = require('path');
const RATE = 22050;

function wav(samples) {
  const buf = Buffer.alloc(44 + samples.length * 2);
  buf.write('RIFF', 0); buf.writeUInt32LE(36 + samples.length * 2, 4); buf.write('WAVE', 8);
  buf.write('fmt ', 12); buf.writeUInt32LE(16, 16); buf.writeUInt16LE(1, 20); buf.writeUInt16LE(1, 22);
  buf.writeUInt32LE(RATE, 24); buf.writeUInt32LE(RATE * 2, 28); buf.writeUInt16LE(2, 32); buf.writeUInt16LE(16, 34);
  buf.write('data', 36); buf.writeUInt32LE(samples.length * 2, 40);
  samples.forEach((s, i) => buf.writeInt16LE(Math.max(-1, Math.min(1, s)) * 32767, 44 + i * 2));
  return buf;
}
// Soma de parciais com envelope exponencial (sinos/gongos são inarmônicos).
function tone(seconds, partials, decay, attack = 0.005) {
  const n = Math.floor(seconds * RATE);
  const out = new Array(n);
  for (let i = 0; i < n; i++) {
    const t = i / RATE;
    const env = Math.min(1, t / attack) * Math.exp(-t * decay);
    let v = 0;
    for (const [f, a, d = 0] of partials) v += a * Math.sin(2 * Math.PI * f * t) * Math.exp(-t * d);
    out[i] = v * env;
  }
  const peak = Math.max(...out.map(Math.abs));
  return out.map((v) => (v / peak) * 0.9);
}
const sounds = {
  gong: tone(2.2, [[110, 1], [163, 0.6, 0.5], [227, 0.5, 1], [318, 0.35, 1.5], [441, 0.2, 2]], 1.4, 0.01),
  bell: tone(1.2, [[880, 1], [1760, 0.4, 2], [2640, 0.2, 4], [1320, 0.25, 3]], 3.0),
  beep: tone(0.15, [[1000, 1]], 4, 0.003),
  beep_final: tone(0.45, [[1400, 1], [2800, 0.2]], 3, 0.003),
  warning: (() => { const a = tone(0.12, [[1200, 1]], 2); const gap = new Array(Math.floor(0.08 * RATE)).fill(0); return [...a, ...gap, ...a]; })(),
};
const dir = path.join(__dirname, '..', 'assets', 'sounds');
fs.mkdirSync(dir, { recursive: true });
for (const [name, s] of Object.entries(sounds)) fs.writeFileSync(path.join(dir, `${name}.wav`), wav(s));
console.log('ok', Object.keys(sounds).join(', '));
