import { useLocalSearchParams } from 'expo-router';
import React, { useMemo } from 'react';
import { View } from 'react-native';
import { getExercise } from '../../core/catalog/exercises';
import { MUSCLES } from '../../core/catalog/muscles';
import { GOAL_LABEL, LEVEL_LABEL, MODALITY_LABEL, MuscleId, STRENGTH_GROUP_LABEL } from '../../core/domain/types';
import { useApp } from '../../core/store/appStore';
import { colors, fatigueColors, radius, space } from '../../core/theme/tokens';
import { num } from '../../core/utils/format';
import { quickItemsFor } from '../../features/player/engine/plans';
import { useStartWorkout } from '../../features/workouts/useStartWorkout';
import { AnatomyBody } from '../../shared/components/AnatomyBody';
import { ExerciseAnimation } from '../../shared/components/ExerciseAnimation';
import { HowTo } from '../../features/player/views/common';
import { EmptyState, Screen, StackHeader } from '../../shared/components/Screen';
import { Badge, Card, Icon, MODALITY_ICON, PillButton, StatTile, T, styles } from '../../shared/components/ui';

export default function ExerciseDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const ex = getExercise(id);
  const sessions = useApp((s) => s.sessions);
  const start = useStartWorkout();

  const history = useMemo(() => {
    const entries = sessions.flatMap((s) => s.entries.filter((e) => e.exerciseId === id).map((e) => ({ ...e, at: s.startedAt })));
    let best = 0;
    let bestHold = 0;
    let totalReps = 0;
    for (const e of entries) {
      if (e.result.kind === 'strength') { best = Math.max(best, e.result.kg); totalReps += e.result.reps; }
      if (e.result.kind === 'calisthenics') { bestHold = Math.max(bestHold, e.result.holdS ?? 0); totalReps += e.result.reps ?? 0; }
    }
    return { count: entries.length, sessions: new Set(entries.map((e) => e.at)).size, best, bestHold, totalReps };
  }, [sessions, id]);

  if (!ex) return <Screen tabBar={false} header={<StackHeader title="Exercício" />}><EmptyState icon="alert-circle-outline" title="Não encontrado" text="Exercício inexistente no catálogo." /></Screen>;

  const weight = (m: MuscleId) => ex.muscles.find((x) => x.muscle === m);
  const colorFor = (m: MuscleId) => {
    const w = weight(m);
    if (!w) return fatigueColors.idle;
    return w.role === 'primary' ? colors.primary : w.role === 'secondary' ? '#a8612a' : '#5a4d44';
  };

  return (
    <Screen tabBar={false} header={<StackHeader title={ex.name} kicker={MODALITY_LABEL[ex.modality].toUpperCase()} />}>
      {ex.media && <ExerciseAnimation exercise={ex} height={230} style={{ marginTop: space.sm }} />}

      <View style={[styles.row, { gap: 6, flexWrap: 'wrap', marginVertical: space.md }]}>
        {ex.catalogNo != null && <Badge label={`Nº ${ex.catalogNo}`} tone="solid" />}
        {ex.groups?.map((g) => <Badge key={g} label={STRENGTH_GROUP_LABEL[g]} tone="primary" />)}
        <Badge label={LEVEL_LABEL[ex.level]} tone="primary" />
        {ex.goals.map((g) => <Badge key={g} label={GOAL_LABEL[g]} tone="muted" />)}
        {ex.equipment.map((e) => <Badge key={e} label={e} tone="muted" />)}
      </View>

      <Card style={{ flexDirection: 'row', justifyContent: 'space-around', marginBottom: space.md }}>
        <AnatomyBody view="front" width={120} colorFor={colorFor} />
        <AnatomyBody view="back" width={120} colorFor={colorFor} />
      </Card>

      <Card style={{ gap: 10, marginBottom: space.md }}>
        <T v="headlineMd">Músculos envolvidos</T>
        {ex.muscles.map((m) => (
          <View key={m.muscle} style={{ gap: 4 }}>
            <View style={styles.rowBetween}>
              <T v="labelLg">{MUSCLES[m.muscle].name}</T>
              <T v="bodySm" color={colors.textMuted}>{m.role === 'primary' ? 'Primário' : m.role === 'secondary' ? 'Secundário' : 'Estabilizador'} • {Math.round(m.activation * 100)}%</T>
            </View>
            <View style={{ height: 5, borderRadius: 3, backgroundColor: colors.surfaceHighest }}>
              <View style={{ width: `${m.activation * 100}%`, height: '100%', borderRadius: 3, backgroundColor: colorFor(m.muscle) }} />
            </View>
          </View>
        ))}
      </Card>

      {ex.tip && (
        <Card style={[styles.row, { gap: 12, marginBottom: space.md, alignItems: 'flex-start' }]}>
          <Icon name="lightbulb-on-outline" size={22} color={colors.primary} />
          <View style={{ flex: 1 }}>
            <T v="labelLg" color={colors.primary}>Dica de execução</T>
            <T v="bodyMd" color={colors.textSubtle}>{ex.tip}</T>
          </View>
        </Card>
      )}

      {ex.steps && (
        <View style={{ marginBottom: space.md }}>
          <HowTo steps={ex.steps} />
        </View>
      )}

      {ex.attributes.progressionTree && ex.modality === 'calisthenics' && (
        <Card style={{ gap: 10, marginBottom: space.md }}>
          <T v="headlineMd">Nível de dificuldade</T>
          <View style={[styles.row, { gap: 6 }]}>
            {Array.from({ length: ex.attributes.maxLevel ?? 5 }, (_, i) => {
              const lvl = i + 1;
              const reached = lvl <= (ex.attributes.progressionLevel ?? 1);
              return (
                <View key={lvl} style={{ flex: 1, alignItems: 'center', gap: 4 }}>
                  <View style={{ width: '100%', height: 8, borderRadius: 4, backgroundColor: reached ? colors.primary : colors.surfaceHighest }} />
                  <T v="bodySm" color={reached ? colors.primary : colors.textMuted}>Nv {lvl}</T>
                </View>
              );
            })}
          </View>
        </Card>
      )}

      <View style={[styles.row, { gap: 10, marginBottom: space.lg }]}>
        <StatTile icon="history" label="Sessões" value={String(history.sessions)} />
        {ex.modality === 'strength' && <StatTile icon="trophy-outline" label="PR (kg)" value={num(history.best)} accent />}
        {ex.modality === 'calisthenics' && <StatTile icon="timer-sand" label={ex.tracking === 'hold' ? 'Melhor hold' : 'Reps totais'} value={ex.tracking === 'hold' ? `${history.bestHold}s` : String(history.totalReps)} accent />}
        {ex.modality === 'martial' && <StatTile icon="boxing-glove" label="Rounds" value={String(history.count)} accent />}
      </View>

      <PillButton label="Treinar agora" icon={MODALITY_ICON[ex.modality]} onPress={() => start({ custom: { items: quickItemsFor(ex.id), title: ex.name, modality: ex.modality } })} />
      <View style={{ height: radius.lg }} />
    </Screen>
  );
}
