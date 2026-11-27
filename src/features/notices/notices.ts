/**
 * Central de avisos — gerada de forma pura a partir do estado local (sem backend):
 * treino agendado, músculos recuperados, peso desatualizado, sequência, treino em andamento.
 */
import { MUSCLES } from '../../core/catalog/muscles';
import { BodyMeasurement, Routine, ScheduledWorkout, Session } from '../../core/domain/types';
import { sameDay, startOfDay } from '../../core/utils/format';
import { computeFatigue, RECOVERED_THRESHOLD, tauHours } from '../fatigue/fatigue';
import { streakDays } from '../body/metrics';

export type NoticeKind = 'schedule' | 'recovered' | 'weight' | 'streak' | 'active';
export interface Notice {
  id: string;
  kind: NoticeKind;
  title: string;
  body: string;
  /** Momento a partir do qual o aviso é "novo" (para o ponto no sino). */
  at: number;
  href?: { pathname: string; params?: Record<string, string> };
}

const H = 3_600_000;
const D = 24 * H;

export function buildNotices(input: {
  now: number;
  routines: Routine[];
  sessions: Session[];
  schedule: ScheduledWorkout[];
  measurements: BodyMeasurement[];
  activeSession?: Pick<Session, 'id' | 'title' | 'startedAt'> | null;
}): Notice[] {
  const { now, routines, sessions, schedule, measurements, activeSession } = input;
  const out: Notice[] = [];
  const today = startOfDay(now);

  if (activeSession) {
    out.push({
      id: `active:${activeSession.id}`, kind: 'active', title: 'Treino em andamento',
      body: `${activeSession.title} — toque para retomar.`, at: activeSession.startedAt,
      href: { pathname: '/player/[sessionId]', params: { sessionId: activeSession.id } },
    });
  }

  // Agendados para hoje e amanhã ainda não feitos
  for (const s of schedule) {
    if (s.date !== today && s.date !== today + D) continue;
    const done = sessions.some((x) => x.status === 'completed' && x.routineDayId === s.dayId && sameDay(x.startedAt, s.date));
    if (done) continue;
    const routine = routines.find((r) => r.id === s.routineId);
    const day = routine?.days.find((d) => d.id === s.dayId);
    if (!routine || !day) continue;
    const isToday = s.date === today;
    out.push({
      id: `sched:${s.id}`, kind: 'schedule',
      title: isToday ? 'Treino agendado para hoje' : 'Treino de amanhã',
      body: `${day.name} • ~${day.estMinutes} min`,
      at: isToday ? today : today + 18 * H, // lembrete de amanhã vira "novo" às 18h
      href: { pathname: '/treino/[routineId]', params: { routineId: routine.id, day: day.id } },
    });
  }

  // Músculos que cruzaram o limiar de recuperação nas últimas 24 h
  const bw = measurements.at(-1)?.weightKg ?? 80;
  const nowF = computeFatigue(sessions, bw, now);
  const before = computeFatigue(sessions, bw, now - 24 * H);
  const recovered = Object.values(nowF).filter((f) => f.pct < RECOVERED_THRESHOLD && before[f.muscle].pct >= RECOVERED_THRESHOLD);
  if (recovered.length) {
    // momento estimado em que o primeiro cruzou 30 %
    const at = Math.min(...recovered.map((f) => now - Math.max(0, tauHours(f.muscle) * Math.log(RECOVERED_THRESHOLD / Math.max(f.pct, 0.01))) * H));
    out.push({
      id: `rec:${today}`, kind: 'recovered', title: 'Músculos recuperados 💪',
      body: `${recovered.slice(0, 3).map((f) => MUSCLES[f.muscle].name).join(', ')}${recovered.length > 3 ? ` e mais ${recovered.length - 3}` : ''} já estão prontos para treinar.`,
      at: Math.max(at, now - 24 * H),
      href: { pathname: '/atividades' },
    });
  }

  // Peso sem atualização há mais de 7 dias
  const last = measurements.at(-1);
  if (!last || now - last.measuredAt > 7 * D) {
    out.push({
      id: `weight:${Math.floor(now / (7 * D))}`, kind: 'weight', title: 'Atualize seu peso e medidas',
      body: last ? `Última avaliação há ${Math.floor((now - last.measuredAt) / D)} dias.` : 'Registre sua primeira avaliação física.',
      at: (last?.measuredAt ?? now) + 7 * D, href: { pathname: '/corpo' },
    });
  }

  const streak = streakDays(sessions.filter((s) => s.status === 'completed').map((s) => s.startedAt));
  if (streak >= 3) {
    out.push({ id: `streak:${streak}`, kind: 'streak', title: `Sequência de ${streak} dias 🔥`, body: 'Continue assim — não quebre a corrente hoje!', at: today });
  }

  return out.sort((a, b) => b.at - a.at);
}

/** Há aviso já "vigente" (at ≤ agora) mais novo que a última visita à central? */
export const hasUnread = (notices: Notice[], seenAt: number, now: number) => notices.some((n) => n.at <= now && n.at > seenAt);
