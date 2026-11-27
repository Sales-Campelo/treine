import { useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { COMBO_BY_ID, getExercise } from '../../core/catalog/exercises';
import { MUSCLES } from '../../core/catalog/muscles';
import { latestWeight, useApp } from '../../core/store/appStore';
import { colors, radius, space } from '../../core/theme/tokens';
import { kg, num } from '../../core/utils/format';
import { describeRx } from '../../features/workouts/describe';
import { useActiveSession, useStartWorkout } from '../../features/workouts/useStartWorkout';
import { EmptyState, Screen, StackHeader } from '../../shared/components/Screen';
import { Badge, Chip, Icon, IconButton, MODALITY_ICON, PillButton, StatTile, T, styles } from '../../shared/components/ui';

export default function RoutineDetail() {
  const { routineId, day: dayParam } = useLocalSearchParams<{ routineId: string; day?: string }>();
  const routine = useApp((s) => s.routines.find((r) => r.id === routineId));
  const weight = useApp((s) => latestWeight(s.measurements));
  const start = useStartWorkout();
  const active = useActiveSession();
  const [dayId, setDayId] = useState(dayParam ?? routine?.days[0]?.id);
  const day = routine?.days.find((d) => d.id === dayId) ?? routine?.days[0];

  if (!routine || !day) return <Screen tabBar={false} header={<StackHeader title="Treino" />}><EmptyState icon="alert-circle-outline" title="Rotina não encontrada" text="" /></Screen>;

  const volume = day.items.reduce((a, it) => a + (it.prescription.kind === 'strength' ? it.prescription.sets.reduce((x, s) => x + s.kg * s.reps, 0) : 0), 0);
  const met = routine.modality === 'martial' ? 9 : routine.modality === 'calisthenics' ? 6 : 5;
  const kcal = Math.round(met * weight * (day.estMinutes / 60));

  return (
    <Screen tabBar={false} header={<StackHeader kicker={routine.name.split('—')[0].trim().toUpperCase()} title={day.name} right={<IconButton icon="bookmark-outline" label="Salvar" />} />}>
      {routine.days.length > 1 && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -space.margin, marginVertical: space.sm }} contentContainerStyle={{ gap: 8, paddingHorizontal: space.margin }}>
          {routine.days.map((d) => <Chip key={d.id} label={d.name.split('—')[0].trim() + ' — ' + (d.name.split('—')[1]?.trim().split(' ')[0] ?? '')} active={d.id === day.id} onPress={() => setDayId(d.id)} />)}
        </ScrollView>
      )}

      <View style={[styles.row, { gap: 8, backgroundColor: colors.surfaceLow, borderRadius: radius.lg, padding: 8, marginVertical: space.md }]}>
        <StatTile icon="timer-outline" label="Duração" value={`~${day.estMinutes} min`} />
        <StatTile icon="fire" label="Calorias" value={`${kcal} kcal`} />
        <StatTile icon={routine.isHybrid ? 'shuffle-variant' : routine.modality === 'strength' ? 'dumbbell' : MODALITY_ICON[routine.modality]} label={routine.modality === 'strength' ? 'Volume' : 'Blocos'} value={routine.modality === 'strength' ? kg(volume) : String(day.items.length)} />
      </View>

      {active && active.routineDayId !== day.id && (
        <T v="bodySm" color={colors.textMuted} style={{ textAlign: 'center', marginBottom: 8 }}>Há um treino em andamento: “{active.title}”. Ele será retomado.</T>
      )}
      <PillButton
        label={active ? 'RETOMAR TREINO' : 'INICIAR TREINO'}
        icon="play"
        onPress={() => start({ routineId: routine.id, dayId: day.id })}
        style={{ marginBottom: 8 }}
      />
      <T v="bodySm" color={colors.textMuted} style={{ textAlign: 'center', marginBottom: space.xl }}>
        {active ? '' : 'Começa com 10 s de contagem “Prepare-se!”'}
        {routine.isHybrid ? ' • Treino híbrido: o player muda de modo a cada bloco' : ''}
      </T>

      <View style={[styles.rowBetween, { marginBottom: space.md }]}>
        <View style={[styles.row, { gap: 10 }]}>
          <T v="headlineLg">Lista de exercícios</T>
          <Badge label={String(day.items.length)} tone="muted" />
        </View>
      </View>
      <View style={{ gap: 12 }}>
        {day.items.map((it, idx) => {
          const ex = getExercise(it.exerciseId);
          const prevSame = !!it.circuit && day.items[idx - 1]?.circuit?.id === it.circuit.id;
          const groupHeader = it.circuit && !prevSame ? it.circuit : null;
          const prim = ex?.muscles.filter((m) => m.role === 'primary').slice(0, 2) ?? [];
          const combos = it.prescription.kind === 'martial' ? it.prescription.comboIds.map((c) => COMBO_BY_ID[c]?.name).filter(Boolean) : [];
          return (
            <View key={it.id} style={{ gap: 6 }}>
            {groupHeader && (
              <View style={[styles.row, { gap: 8, backgroundColor: colors.primaryTint, borderRadius: radius.md, padding: 12 }]}>
                <Icon name="sync" size={20} color={colors.primary} />
                <View style={{ flex: 1 }}>
                  <T v="labelLg" color={colors.primary}>Ciclo • {groupHeader.rounds} voltas</T>
                  <T v="bodySm" color={colors.textSubtle}>Exercícios em sequência, sem intervalo • {groupHeader.restS}s de descanso ao fim de cada volta</T>
                </View>
              </View>
            )}
            <View style={[styles.row, { gap: 14, backgroundColor: colors.surface, borderRadius: radius.lg, padding: space.md, borderLeftWidth: it.circuit ? 3 : 0, borderLeftColor: colors.primary }]}>
              <View style={{ width: 72, height: 72, borderRadius: radius.md, backgroundColor: colors.surfaceHighest, alignItems: 'center', justifyContent: 'center' }}>
                <Icon name={MODALITY_ICON[ex?.modality ?? routine.modality]} size={32} color={colors.primary} />
              </View>
              <View style={{ flex: 1, gap: 4 }}>
                <T v="labelLg" style={{ fontSize: 16 }} numberOfLines={1}>{ex?.name ?? 'Round livre'}</T>
                <T v="bodyMd" color={colors.textSubtle}>{it.circuit ? describeRx(it).replace(/^\d+ séries • /, `${it.circuit.rounds}× • `) : describeRx(it)}</T>
                <View style={[styles.row, { gap: 6, flexWrap: 'wrap' }]}>
                  {prim.map((m) => <Badge key={m.muscle} label={MUSCLES[m.muscle].name.toUpperCase()} tone="primary" />)}
                  {combos.slice(0, 2).map((c) => <Badge key={c} label={c!} tone="muted" />)}
                </View>
              </View>
            </View>
            </View>
          );
        })}
      </View>
      <T v="bodySm" color={colors.textMuted} style={{ textAlign: 'center', marginTop: space.lg }}>
        {routine.description} • Volume planejado {num(volume)} kg
      </T>
    </Screen>
  );
}
