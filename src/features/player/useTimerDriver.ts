/**
 * Driver do timer na UI:
 *  - TICK a cada 200 ms enquanto o app está em primeiro plano;
 *  - mantém a tela acesa (expo-keep-awake) durante o treino;
 *  - ao ir para background agenda notificações locais para o fim das próximas fases
 *    (JS fica suspenso; o SO entrega o alerta "Descanso acabou / Round 3!");
 *  - ao voltar, cancela as notificações e o TICK alcança o relógio real.
 */
import { useKeepAwake } from 'expo-keep-awake';
import * as Notifications from 'expo-notifications';
import { useEffect, useRef, useState } from 'react';
import { AppState, Platform } from 'react-native';
import { prepareWorkoutAudio } from '../../core/audio/effects';
import { isRunning } from './engine/timerMachine';
import { usePlayer } from './playerStore';

const NATIVE = Platform.OS !== 'web';

if (NATIVE) {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({ shouldPlaySound: true, shouldSetBadge: false, shouldShowBanner: true, shouldShowList: true }),
  });
}

async function schedulePhaseAlerts() {
  const { timer } = usePlayer.getState();
  if (!isRunning(timer) || timer.endsAt == null) return;
  const perm = await Notifications.getPermissionsAsync();
  if (!perm.granted) return;
  // Agenda até 6 transições futuras de fases com duração fixa.
  let at = timer.endsAt;
  for (let i = timer.index; i < timer.plan.length && i < timer.index + 6; i++) {
    const cur = timer.plan[i];
    const next = timer.plan[i + 1];
    const seconds = Math.round((at - Date.now()) / 1000);
    if (seconds >= 1) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: next ? (next.kind === 'REST' ? 'Descanso ⏱️' : next.label) : 'Treino concluído 🔥',
          body: next ? (next.kind === 'REST' ? 'Respire. Próximo round em breve.' : 'Hora de trabalhar!') : 'Abra o Treine para salvar a sessão.',
          sound: true,
        },
        trigger: { type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL, seconds },
      });
    }
    if (!cur.autoAdvance || !next || next.durationMs == null) break;
    at += next.durationMs;
  }
}

export async function ensureNotificationPermission() {
  if (!NATIVE) return;
  if (Platform.OS === 'android') {
    // eslint-disable-next-line import/namespace -- AndroidImportance é re-exportado via `export *` (falso positivo)
    await Notifications.setNotificationChannelAsync('default', { name: 'Timer de treino', importance: Notifications.AndroidImportance.MAX });
  }
  const p = await Notifications.getPermissionsAsync();
  if (!p.granted && p.canAskAgain) await Notifications.requestPermissionsAsync();
}

/** Retorna `now` atualizado a cada tick para a UI re-renderizar o relógio. */
export function useTimerDriver() {
  useKeepAwake('treine-player', { suppressDeactivateWarnings: true });
  const [now, setNow] = useState(() => Date.now());
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    prepareWorkoutAudio();
    ensureNotificationPermission().catch(() => undefined);
    const id = setInterval(() => {
      usePlayer.getState().dispatch({ type: 'TICK' });
      setNow(Date.now());
    }, 200);
    const sub = AppState.addEventListener('change', (next) => {
      if (!NATIVE) return;
      if (appState.current === 'active' && next.match(/inactive|background/)) {
        schedulePhaseAlerts().catch(() => undefined);
      } else if (next === 'active') {
        Notifications.cancelAllScheduledNotificationsAsync().catch(() => undefined);
        usePlayer.getState().dispatch({ type: 'TICK' });
      }
      appState.current = next;
    });
    return () => {
      clearInterval(id);
      sub.remove();
      if (NATIVE) Notifications.cancelAllScheduledNotificationsAsync().catch(() => undefined);
    };
  }, []);

  return now;
}
