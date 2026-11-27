export const pad = (n: number) => String(Math.floor(n)).padStart(2, '0');

/** ms → "mm:ss" (ou "h:mm:ss"). */
export function mmss(ms: number): string {
  const total = Math.max(0, Math.round(ms / 1000));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  return h ? `${h}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`;
}

/** Contagem regressiva arredonda para cima (03:00 → 02:59 só após 1 s). */
export const mmssCeil = (ms: number) => mmss(Math.ceil(ms / 1000) * 1000);

export function duration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.round((seconds % 3600) / 60);
  return h ? `${h}h ${pad(m)}m` : `${m} min`;
}

export const kg = (v: number) => (v >= 1000 ? `${(v / 1000).toLocaleString('pt-BR', { maximumFractionDigits: 1 })}t` : `${Math.round(v).toLocaleString('pt-BR')} kg`);
export const num = (v: number, digits = 0) => v.toLocaleString('pt-BR', { minimumFractionDigits: digits, maximumFractionDigits: digits });

export const WEEKDAYS_SHORT = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
export const MONTHS = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
export const MONTHS_SHORT = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

export const startOfDay = (t: number) => {
  const d = new Date(t);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
};
export const sameDay = (a: number, b: number) => startOfDay(a) === startOfDay(b);

export function greeting(d = new Date()) {
  const h = d.getHours();
  return h < 12 ? 'Bom dia' : h < 18 ? 'Boa tarde' : 'Boa noite';
}

export const dateLong = (t: number) => {
  const d = new Date(t);
  return `${d.getDate()} ${MONTHS_SHORT[d.getMonth()]} ${d.getFullYear()}`;
};
export const hhmm = (t: number) => {
  const d = new Date(t);
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
};
