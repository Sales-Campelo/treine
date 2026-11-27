import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { View } from 'react-native';
import { getExercise } from '../../core/catalog/exercises';
import { MODALITY_LABEL, Modality } from '../../core/domain/types';
import { useApp } from '../../core/store/appStore';
import { colors, radius, space } from '../../core/theme/tokens';
import { useStartWorkout } from '../../features/workouts/useStartWorkout';
import { EmptyState, Screen, StackHeader } from '../../shared/components/Screen';
import { Badge, Card, Icon, MODALITY_ICON, SectionTitle, T, styles } from '../../shared/components/ui';

const COPY: Record<Modality, { kicker: string; sub: string; free: string; freeSub: string }> = {
  strength: { kicker: 'FICHAS', sub: 'Escolha a ficha de musculação para hoje.', free: 'Treino livre', freeSub: 'Registre séries e cargas sem ficha' },
  martial: { kicker: 'COMBOS & ROUNDS', sub: 'Escolha a sessão de combos para treinar.', free: 'Round livre (freestyle)', freeSub: '3 rounds com combos aleatórios narrados' },
  calisthenics: { kicker: 'CICLOS & SKILLS', sub: 'Escolha o ciclo ou a sessão de calistenia.', free: 'Treino livre', freeSub: 'Flexões em séries livres' },
};

/** Treino rápido: lista as fichas salvas da modalidade antes de abrir o preview. */
export default function ModalityPicker() {
  const { modality } = useLocalSearchParams<{ modality: Modality }>();
  const m: Modality = modality === 'martial' || modality === 'calisthenics' ? modality : 'strength';
  const router = useRouter();
  const start = useStartWorkout();
  const routines = useApp((s) => s.routines);

  // Fichas da modalidade + fichas híbridas que contenham exercícios dela
  const entries = routines.flatMap((r) =>
    r.days
      .filter((d) => (r.modality === m && !r.isHybrid) || d.items.some((i) => i.prescription.kind === m))
      .map((d) => ({ routine: r, day: d })),
  );
  const copy = COPY[m];

  return (
    <Screen tabBar={false} header={<StackHeader title={MODALITY_LABEL[m]} kicker={copy.kicker} />}>
      <T v="bodyMd" color={colors.textSubtle} style={{ marginVertical: space.md }}>{copy.sub}</T>

      <SectionTitle title="Suas fichas" right={<T v="labelMd" color={colors.textMuted}>{entries.length}</T>} />
      <View style={{ gap: 10, marginBottom: space.xl }}>
        {entries.length === 0 && <EmptyState icon="clipboard-text-off-outline" title="Nenhuma ficha" text="Crie um treino em “Meus treinos → Criar”." />}
        {entries.map(({ routine, day }) => {
          const names = day.items.map((i) => getExercise(i.exerciseId)?.name).filter(Boolean).slice(0, 3).join(' • ');
          const isCircuit = day.items.some((i) => i.circuit);
          return (
            <Card key={day.id} style={[styles.row, { gap: 14 }]} onPress={() => router.push({ pathname: '/treino/[routineId]', params: { routineId: routine.id, day: day.id } })}>
              <View style={{ width: 52, height: 52, borderRadius: radius.md, backgroundColor: colors.surfaceHighest, alignItems: 'center', justifyContent: 'center' }}>
                <Icon name={routine.isHybrid ? 'shuffle-variant' : isCircuit ? 'sync' : MODALITY_ICON[m]} size={26} color={colors.primarySoft} />
              </View>
              <View style={{ flex: 1, gap: 3 }}>
                <T v="labelLg" style={{ fontSize: 16 }} numberOfLines={1}>{day.name}</T>
                <T v="bodySm" color={colors.textMuted} numberOfLines={1}>{names}</T>
                <View style={[styles.row, { gap: 6 }]}>
                  <Badge label={`${day.items.length} exercícios`} tone="muted" />
                  <Badge label={`~${day.estMinutes} min`} tone="muted" />
                  {isCircuit && <Badge label="Ciclo" tone="primary" />}
                  {routine.isHybrid && <Badge label="Híbrido" tone="primary" />}
                </View>
              </View>
              <Icon name="chevron-right" size={22} color={colors.textMuted} />
            </Card>
          );
        })}
      </View>

      <SectionTitle title="Sem ficha" />
      <Card style={[styles.row, { gap: 14, borderStyle: 'dashed', borderColor: colors.outlineVariant }]} onPress={() => start({ quick: m })}>
        <View style={{ width: 52, height: 52, borderRadius: radius.md, backgroundColor: colors.primaryTint, alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="lightning-bolt" size={26} color={colors.primary} />
        </View>
        <View style={{ flex: 1 }}>
          <T v="labelLg" style={{ fontSize: 16 }}>{copy.free}</T>
          <T v="bodySm" color={colors.textMuted}>{copy.freeSub}</T>
        </View>
        <Icon name="play-circle" size={30} color={colors.primary} />
      </Card>
    </Screen>
  );
}
