import { useRouter } from 'expo-router';
import React, { ReactNode, useState } from 'react';
import { Modal, Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getExercise } from '../../../core/catalog/exercises';
import { MUSCLES } from '../../../core/catalog/muscles';
import { useApp } from '../../../core/store/appStore';
import { colors, radius, space } from '../../../core/theme/tokens';
import { mmss } from '../../../core/utils/format';
import { Badge, Icon, IconButton, IconName, PillButton, T, Toggle, styles } from '../../../shared/components/ui';
import { clock, currentPhase } from '../engine/timerMachine';
import { usePlayer } from '../playerStore';

/** Dados derivados comuns às 3 views do player. */
export function usePlayerView(now: number) {
  const timer = usePlayer((s) => s.timer);
  const items = usePlayer((s) => s.items);
  const session = usePlayer((s) => s.session);
  const drafts = usePlayer((s) => s.drafts);
  const phase = currentPhase(timer);
  const c = clock(timer, now);
  // Bloco exibido: o da fase atual; em descanso entre blocos, mostra o próximo trabalho.
  let block = phase?.ref?.blockIndex ?? 0;
  if (phase?.kind === 'REST') {
    const nextWork = timer.plan.slice(timer.index + 1).find((p) => p.kind === 'ACTIVE_WORK');
    if (nextWork?.ref && nextWork.ref.blockIndex !== block) block = nextWork.ref.blockIndex;
  }
  if (timer.status === 'COMPLETED') block = Math.max(0, items.length - 1);
  const item = items[block];
  const exercise = getExercise(item?.exerciseId);
  const isPaused = timer.status === 'PAUSED';
  const effective = isPaused ? timer.pausedFrom : timer.status;
  return { timer, items, session, drafts, phase, clock: c, block, item, exercise, effective, isPaused };
}

export const muscleList = (ex: ReturnType<typeof getExercise>) =>
  ex?.muscles.filter((m) => m.role !== 'stabilizer').map((m) => MUSCLES[m.muscle].name).join(', ') ?? '';

export function PlayerTopBar({ sessionMs, right, onClose }: { sessionMs: number; right?: ReactNode; onClose: () => void }) {
  return (
    <View style={[styles.rowBetween, { paddingHorizontal: space.margin, paddingVertical: 8 }]}>
      <IconButton icon="close" size={44} onPress={onClose} label="Fechar treino" />
      <View style={[styles.row, { gap: 6, backgroundColor: colors.surfaceHigh, paddingHorizontal: 14, paddingVertical: 8, borderRadius: radius.full }]}>
        <Icon name="timer-outline" size={18} color={colors.primary} />
        <T v="labelLg" style={{ fontVariant: ['tabular-nums'] }}>{mmss(sessionMs)}</T>
        <T v="bodySm" color={colors.textMuted}>total</T>
      </View>
      <View style={{ minWidth: 44, alignItems: 'flex-end' }}>{right}</View>
    </View>
  );
}

export function TopAction({ icon, label, onPress }: { icon: IconName; label: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={[styles.row, { gap: 6, backgroundColor: colors.surface, paddingHorizontal: 14, paddingVertical: 10, borderRadius: radius.full }]}>
      <Icon name={icon} size={18} color={colors.textSubtle} />
      <T v="labelLg" color={colors.textSubtle}>{label}</T>
    </Pressable>
  );
}

export function StatusBadges({ items }: { items: string[] }) {
  return (
    <View style={[styles.row, { gap: 8, flexWrap: 'wrap' }]}>
      <Badge label="EM ANDAMENTO" tone="primary" dot />
      {items.map((t) => <Badge key={t} label={t} tone="muted" />)}
    </View>
  );
}

export function TipCard({ title, text, icon = 'lightbulb-on-outline' }: { title?: string; text: string; icon?: IconName }) {
  return (
    <View style={[styles.row, { gap: 14, backgroundColor: colors.surface, borderRadius: radius.lg, padding: space.md, alignItems: 'flex-start' }]}>
      <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: colors.primaryTint, alignItems: 'center', justifyContent: 'center' }}>
        <Icon name={icon} size={22} color={colors.primary} />
      </View>
      <View style={{ flex: 1, gap: 2 }}>
        {title && <T v="labelLg" color={colors.primary}>{title}</T>}
        <T v="bodyMd" color={colors.textSubtle}>{text}</T>
      </View>
    </View>
  );
}

/** "Como fazer": passo a passo numerado da execução. */
export function HowTo({ steps, title = 'Como fazer' }: { steps: string[]; title?: string }) {
  return (
    <View style={{ backgroundColor: colors.surface, borderRadius: radius.lg, padding: space.md, gap: 10 }}>
      <View style={[styles.row, { gap: 8 }]}>
        <Icon name="format-list-numbered" size={20} color={colors.primary} />
        <T v="labelLg" color={colors.primary}>{title}</T>
      </View>
      {steps.map((st, i) => (
        <View key={i} style={[styles.row, { gap: 10, alignItems: 'flex-start' }]}>
          <View style={{ width: 22, height: 22, borderRadius: 11, backgroundColor: colors.primaryTint, alignItems: 'center', justifyContent: 'center', marginTop: 1 }}>
            <T v="labelMd" color={colors.primary} style={{ fontSize: 11 }}>{i + 1}</T>
          </View>
          <T v="bodyMd" color={colors.textSubtle} style={{ flex: 1 }}>{st}</T>
        </View>
      ))}
    </View>
  );
}

/** Folha inferior fixa com mensagem + ações primárias. */
export function BottomDock({ children }: { children: ReactNode }) {
  const insets = useSafeAreaInsets();
  return (
    <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, backgroundColor: colors.surfaceLow, borderTopLeftRadius: radius.xl, borderTopRightRadius: radius.xl, padding: space.margin, paddingBottom: space.margin + insets.bottom, gap: 14, borderTopWidth: 1, borderColor: colors.borderStrong }}>
      {children}
    </View>
  );
}

/** Modal de saída: finalizar → relatório; descartar; continuar. Também: preferências de áudio. */
export function useExitFlow() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const finish = () => {
    setOpen(false);
    const id = usePlayer.getState().finish();
    if (id) router.replace({ pathname: '/relatorio/[sessionId]', params: { sessionId: id } });
  };
  const discard = () => {
    setOpen(false);
    usePlayer.getState().discard();
    router.replace('/');
  };
  const minimize = () => {
    setOpen(false);
    if (router.canGoBack()) router.back();
    else router.replace('/');
  };
  const sheet = (
    <Modal transparent visible={open} animationType="fade" onRequestClose={() => setOpen(false)}>
      <Pressable style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' }} onPress={() => setOpen(false)}>
        <Pressable style={{ backgroundColor: colors.surface, borderTopLeftRadius: radius.xl, borderTopRightRadius: radius.xl, padding: space.lg, gap: 12 }}>
          <T v="headlineMd">Encerrar treino?</T>
          <T v="bodyMd" color={colors.textMuted}>As séries concluídas serão salvas no histórico e o mapa de fadiga será atualizado.</T>
          <AudioPrefs />
          <PillButton label="Finalizar e ver relatório" icon="flag-checkered" onPress={finish} />
          <PillButton label="Minimizar (continua rodando)" icon="arrow-collapse-down" variant="secondary" onPress={minimize} />
          <PillButton label="Descartar treino" icon="delete-outline" variant="danger" onPress={discard} />
        </Pressable>
      </Pressable>
    </Modal>
  );
  return { openExit: () => setOpen(true), finish, sheet };
}

export function AudioPrefs() {
  const prefs = useApp((s) => s.profile.prefs);
  const setPrefs = useApp((s) => s.setPrefs);
  const rows: { label: string; k: 'tts' | 'sounds' | 'haptics' }[] = [
    { label: 'Narração por voz (TTS)', k: 'tts' },
    { label: 'Sons (gongo / bipes)', k: 'sounds' },
    { label: 'Vibração', k: 'haptics' },
  ];
  return (
    <View style={{ gap: 8, backgroundColor: colors.surfaceHigh, borderRadius: radius.lg, padding: space.md }}>
      {rows.map(({ label, k }) => (
        <View key={k} style={styles.rowBetween}>
          <T v="labelLg">{label}</T>
          <Toggle value={prefs[k]} onChange={(v) => setPrefs({ [k]: v })} />
        </View>
      ))}
    </View>
  );
}
