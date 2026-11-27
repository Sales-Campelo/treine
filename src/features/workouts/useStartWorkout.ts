import { useRouter } from 'expo-router';
import { useCallback } from 'react';
import { Routine, RoutineDay, ScheduledWorkout, Session } from '../../core/domain/types';
import { sameDay, startOfDay } from '../../core/utils/format';
import { useApp } from '../../core/store/appStore';
import { StartOptions, usePlayer } from '../player/playerStore';

/** Inicia (ou retoma) um treino e abre o player. Só existe uma sessão ativa por vez. */
export function useStartWorkout() {
  const router = useRouter();
  return useCallback(
    (opts: StartOptions) => {
      const active = usePlayer.getState().session;
      const id = active ? active.id : usePlayer.getState().start(opts);
      router.push({ pathname: '/player/[sessionId]', params: { sessionId: id } });
    },
    [router],
  );
}

/**
 * Próximo treino da Home:
 *  1. o agendado para hoje (ainda não concluído hoje);
 *  2. senão, o próximo agendado nos próximos dias;
 *  3. senão, o dia seguinte da rotina do último treino concluído.
 */
export function nextWorkout(
  routines: Routine[],
  sessions: Session[],
  schedule: ScheduledWorkout[] = [],
  now = Date.now(),
): { routine: Routine; day: RoutineDay; scheduledFor?: number } {
  const today = startOfDay(now);
  for (const s of schedule) {
    if (s.date < today) continue;
    if (s.date === today && sessions.some((x) => x.status === 'completed' && x.routineDayId === s.dayId && sameDay(x.startedAt, now))) continue;
    const routine = routines.find((r) => r.id === s.routineId);
    const day = routine?.days.find((d) => d.id === s.dayId);
    if (routine && day) return { routine, day, scheduledFor: s.date };
  }
  const last = sessions.find((s) => s.status === 'completed' && s.routineId && s.routineDayId);
  const routine = routines.find((r) => r.id === last?.routineId && r.modality === 'strength') ?? routines.find((r) => r.modality === 'strength') ?? routines[0];
  const idx = routine.days.findIndex((d) => d.id === last?.routineDayId);
  return { routine, day: routine.days[(idx + 1) % routine.days.length] };
}

export const useActiveSession = () => usePlayer((s) => s.session);
export const useRoutines = () => useApp((s) => s.routines);
