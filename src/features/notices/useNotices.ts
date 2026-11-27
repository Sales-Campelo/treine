import { useMemo, useState } from 'react';
import { useApp } from '../../core/store/appStore';
import { usePlayer } from '../player/playerStore';
import { buildNotices, hasUnread } from './notices';

/** Avisos atuais + se há algum não lido (para o ponto no sino). */
export function useNotices() {
  const routines = useApp((s) => s.routines);
  const sessions = useApp((s) => s.sessions);
  const schedule = useApp((s) => s.schedule);
  const measurements = useApp((s) => s.measurements);
  const seenAt = useApp((s) => s.noticesSeenAt);
  const active = usePlayer((s) => s.session);
  const [now] = useState(() => Date.now());
  const notices = useMemo(
    () => buildNotices({ now, routines, sessions, schedule, measurements, activeSession: active }),
    [now, routines, sessions, schedule, measurements, active],
  );
  return { notices, unread: hasUnread(notices, seenAt, now) };
}
