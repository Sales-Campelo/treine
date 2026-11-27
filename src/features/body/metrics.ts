import { BodyMeasurement, Profile } from '../../core/domain/types';

export const bmi = (weightKg: number, heightCm: number) => weightKg / (heightCm / 100) ** 2;

export function bmiCategory(v: number) {
  if (v < 18.5) return 'Abaixo do peso';
  if (v < 25) return 'Peso normal';
  if (v < 30) return 'Sobrepeso';
  return 'Obesidade';
}

/** Faixa de peso "ideal" pela OMS (IMC 18,5–24,9) para a altura. */
export const idealRange = (heightCm: number) => {
  const h2 = (heightCm / 100) ** 2;
  return [18.5 * h2, 24.9 * h2] as const;
};

/** Faixas de % de gordura (ACE). */
export function fatCategory(pct: number, sex: Profile['sex']) {
  const t = sex === 'female' ? [14, 21, 25, 32] : [6, 14, 18, 25];
  if (pct < t[0]) return 'Essencial';
  if (pct < t[1]) return 'Atleta';
  if (pct < t[2]) return 'Fitness';
  if (pct < t[3]) return 'Média';
  return 'Acima da média';
}

export function deltas(ms: BodyMeasurement[]) {
  const last = ms.at(-1);
  const prev = ms.at(-2);
  const first30 = ms.find((m) => last && last.measuredAt - m.measuredAt <= 30 * 86_400_000) ?? ms[0];
  return {
    last,
    prev,
    weight30: last && first30 ? last.weightKg - first30.weightKg : 0,
    fat30: last?.bodyFatPct != null && first30?.bodyFatPct != null ? last.bodyFatPct - first30.bodyFatPct : 0,
  };
}

/** Sequência de dias consecutivos (até hoje/ontem) com pelo menos um treino. */
export function streakDays(startedAts: number[]) {
  const days = new Set(startedAts.map((t) => new Date(t).toDateString()));
  const d = new Date();
  if (!days.has(d.toDateString())) d.setDate(d.getDate() - 1);
  let n = 0;
  // domingos de descanso não quebram a sequência
  while (days.has(d.toDateString()) || (d.getDay() === 0 && n > 0)) {
    if (days.has(d.toDateString())) n++;
    d.setDate(d.getDate() - 1);
  }
  return n;
}
