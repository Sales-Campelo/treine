import React from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COMBO_BY_ID, getExercise } from '../../../core/catalog/exercises';
import { colors, space, type } from '../../../core/theme/tokens';
import { ProgressRing } from '../../../shared/components/charts';
import { Badge, IconButton, MODALITY_ICON, PillButton, T, styles } from '../../../shared/components/ui';
import { usePlayer } from '../playerStore';
import { usePlayerView } from './common';
import { ExerciseAnimation } from '../../../shared/components/ExerciseAnimation';

/**
 * Contagem regressiva "Prepare-se!" (10 s) antes do 1º exercício/round — igual nas 3 modalidades.
 * Cobre a tela inteira; mostra o que vem a seguir e permite pausar ou pular.
 */
export function PrepareOverlay({ now, onClose }: { now: number; onClose: () => void }) {
  const insets = useSafeAreaInsets();
  const v = usePlayerView(now);
  const dispatch = usePlayer((s) => s.dispatch);
  const next = v.timer.plan.slice(v.timer.index).find((p) => p.kind === 'ACTIVE_WORK');
  const ex = getExercise(next?.ref?.exerciseId);
  const combo = next?.ref?.comboId ? COMBO_BY_ID[next.ref.comboId] : undefined;
  const secs = Math.ceil((v.clock.remainingMs ?? 0) / 1000);
  const kind = v.items[next?.ref?.blockIndex ?? 0]?.prescription.kind ?? 'strength';

  return (
    <View style={{ position: 'absolute', inset: 0, backgroundColor: colors.bg, paddingTop: insets.top, paddingBottom: insets.bottom + space.lg, paddingHorizontal: space.margin }}>
      <View style={[styles.rowBetween, { paddingVertical: 8 }]}>
        <IconButton icon="close" size={44} onPress={onClose} label="Fechar treino" />
        <Badge label={v.session?.title ?? ''} tone="muted" />
        <View style={{ width: 44 }} />
      </View>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: space.lg }}>
        <T v="labelLg" color={colors.primary} style={{ letterSpacing: 3 }}>● PREPARE-SE ●</T>
        <ProgressRing size={ex?.media ? 200 : 260} stroke={14} progress={v.clock.progress}>
          <T style={[type.metric, { fontSize: 96, lineHeight: 104 }]}>{v.isPaused ? '❚❚' : secs}</T>
          <T v="bodyMd" color={colors.textSubtle}>{v.isPaused ? 'Pausado' : 'segundos'}</T>
        </ProgressRing>
        <View style={{ alignItems: 'center', gap: 6 }}>
          <T v="labelMd" color={colors.textMuted}>{kind === 'martial' ? 'PRIMEIRO ROUND' : 'PRIMEIRO EXERCÍCIO'}</T>
          <View style={[styles.row, { gap: 8 }]}>
            <IconButton icon={MODALITY_ICON[kind]} size={36} bg={colors.primaryTint} color={colors.primary} />
            <T v="headlineLg">{ex?.name ?? 'Round livre'}</T>
          </View>
          {combo && <T v="bodyMd" color={colors.primarySoft}>{combo.strikes.join(' • ')}</T>}
          {ex?.media && <ExerciseAnimation exercise={ex} height={150} style={{ width: 230, marginTop: 6 }} />}
          {next?.ref?.circuitId && <T v="bodyMd" color={colors.primarySoft}>Ciclo de {next.ref.circuitSize} exercícios • {next.ref.circuitRounds} voltas</T>}
        </View>
      </View>
      <View style={[styles.row, { gap: 12 }]}>
        <PillButton
          label={v.isPaused ? 'Retomar' : 'Pausar'}
          icon={v.isPaused ? 'play' : 'pause'}
          variant="secondary"
          style={{ flex: 0.8 }}
          onPress={() => dispatch({ type: v.isPaused ? 'RESUME' : 'PAUSE' })}
        />
        <PillButton label="Começar agora" icon="skip-next" style={{ flex: 1 }} onPress={() => dispatch({ type: 'SKIP' })} />
      </View>
    </View>
  );
}
