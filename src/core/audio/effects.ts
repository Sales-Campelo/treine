/**
 * Executor dos side-effects emitidos pela FSM: sons (expo-audio), voz (expo-speech) e haptics.
 * Os players de áudio são criados uma única vez e reutilizados (seekTo(0) + play()).
 */
import { AudioPlayer, createAudioPlayer, setAudioModeAsync } from 'expo-audio';
import * as Haptics from 'expo-haptics';
import * as Speech from 'expo-speech';
import { Platform } from 'react-native';
import type { Effect, SoundId } from '../../features/player/engine/timerMachine';

const SOURCES: Record<SoundId, number> = {
  gong: require('../../../assets/sounds/gong.wav'),
  bell: require('../../../assets/sounds/bell.wav'),
  beep: require('../../../assets/sounds/beep.wav'),
  beep_final: require('../../../assets/sounds/beep_final.wav'),
  warning: require('../../../assets/sounds/warning.wav'),
};

export interface EffectPrefs {
  sounds: boolean;
  tts: boolean;
  ttsRate: number;
  haptics: boolean;
}

let players: Partial<Record<SoundId, AudioPlayer>> = {};
let configured = false;

/** Sessão de áudio para treino: toca no modo silencioso e continua com a tela bloqueada (iOS: UIBackgroundModes=audio). */
export async function prepareWorkoutAudio() {
  if (configured) return;
  configured = true;
  try {
    await setAudioModeAsync({ playsInSilentMode: true, shouldPlayInBackground: true, interruptionMode: 'duckOthers' });
  } catch {
    // web / plataformas sem suporte
  }
}

function player(id: SoundId) {
  if (!players[id]) players[id] = createAudioPlayer(SOURCES[id]);
  return players[id]!;
}

export function releaseWorkoutAudio() {
  for (const p of Object.values(players)) p?.remove();
  players = {};
  Speech.stop();
}

async function playSound(id: SoundId) {
  try {
    const p = player(id);
    await p.seekTo(0);
    p.play();
  } catch {
    /* som não é crítico */
  }
}

function haptic(style: Extract<Effect, { type: 'haptic' }>['style']) {
  if (Platform.OS === 'web') return;
  const run =
    style === 'success' ? Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
    : style === 'warning' ? Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning)
    : Haptics.impactAsync(style === 'light' ? Haptics.ImpactFeedbackStyle.Light : style === 'heavy' ? Haptics.ImpactFeedbackStyle.Heavy : Haptics.ImpactFeedbackStyle.Medium);
  run.catch(() => undefined);
}

export function runEffects(effects: Effect[], prefs: EffectPrefs) {
  // Se há várias falas no mesmo tick, só a última importa (evita fila de TTS atrasada).
  const lastSpeak = [...effects].reverse().find((e) => e.type === 'speak');
  for (const e of effects) {
    if (e.type === 'sound' && prefs.sounds) playSound(e.sound);
    else if (e.type === 'haptic' && prefs.haptics) haptic(e.style);
    else if (e.type === 'speak' && prefs.tts && e === lastSpeak && e.text.trim()) {
      Speech.stop();
      Speech.speak(e.text, { language: 'pt-BR', rate: prefs.ttsRate });
    }
  }
}
