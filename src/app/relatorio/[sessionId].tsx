import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Image, Pressable, Share, View } from 'react-native';
import { MUSCLES } from '../../core/catalog/muscles';
import { MuscleId } from '../../core/domain/types';
import { latestWeight, useApp } from '../../core/store/appStore';
import { colors, radius, space } from '../../core/theme/tokens';
import { dateLong, duration, hhmm, kg, num } from '../../core/utils/format';
import { sessionMuscleLoad } from '../../features/fatigue/fatigue';
import { describeEntries, entriesByBlock } from '../../features/report/summary';
import { EmptyState, Screen, StackHeader } from '../../shared/components/Screen';
import { Badge, Card, HeroGradient, Icon, IconButton, MODALITY_ICON, PillButton, StatTile, T, styles } from '../../shared/components/ui';

const RPE = [
  { label: 'Leve', v: 3 },
  { label: 'Moder.', v: 5 },
  { label: 'Forte', v: 7 },
  { label: 'Intenso', v: 8.5 },
  { label: 'Exausto', v: 10 },
];

export default function Report() {
  const { sessionId } = useLocalSearchParams<{ sessionId: string }>();
  const router = useRouter();
  const session = useApp((s) => s.sessions.find((x) => x.id === sessionId));
  const sessions = useApp((s) => s.sessions);
  const measurements = useApp((s) => s.measurements);
  const routines = useApp((s) => s.routines);
  const { updateSession, deleteSession } = useApp.getState();
  const [rpe, setRpe] = useState(session?.rpe ?? 8.5);
  const [photo, setPhoto] = useState(session?.photoUri);

  const prev = useMemo(
    () => sessions.find((s) => s.id !== session?.id && s.routineDayId && s.routineDayId === session?.routineDayId && s.startedAt < (session?.startedAt ?? 0)),
    [sessions, session],
  );
  const load = useMemo(() => (session ? sessionMuscleLoad(session.entries, latestWeight(measurements)) : {}), [session, measurements]);

  if (!session) {
    return (
      <Screen header={<StackHeader title="Relatório" icon="close" />} tabBar={false}>
        <EmptyState icon="file-question-outline" title="Sessão não encontrada" text="Este registro foi descartado." />
      </Screen>
    );
  }

  const s = session.summary;
  const blocks = entriesByBlock(session.entries);
  const day = routines.flatMap((r) => r.days).find((d) => d.id === session.routineDayId);
  const plannedBlocks = day?.items.length ?? blocks.length;
  const volumeGain = session.modality === 'strength' && prev ? (s.tonnageKg ?? 0) - (prev.summary.tonnageKg ?? 0) : 0;
  const topMuscles = (Object.entries(load) as [MuscleId, number][]).sort((a, b) => b[1] - a[1]).slice(0, 5);

  const tiles =
    session.isHybrid
      ? [{ icon: 'timer-outline', label: 'Duração', value: duration(session.activeSeconds) }, { icon: 'dumbbell', label: 'Carga Total', value: kg(s.tonnageKg ?? 0) }, { icon: 'boxing-glove', label: 'Rounds', value: String(s.rounds ?? 0) }]
      : session.modality === 'strength'
      ? [{ icon: 'timer-outline', label: 'Duração', value: duration(session.activeSeconds) }, { icon: 'lightning-bolt', label: 'Calorias (kcal)', value: num(s.calories ?? 0) }, { icon: 'dumbbell', label: 'Carga Total', value: kg(s.tonnageKg ?? 0) }]
      : session.modality === 'martial'
        ? [{ icon: 'timer-outline', label: 'Duração', value: duration(session.activeSeconds) }, { icon: 'boxing-glove', label: 'Rounds', value: String(s.rounds ?? 0) }, { icon: 'lightning-bolt', label: 'Calorias (kcal)', value: num(s.calories ?? 0) }]
        : [{ icon: 'timer-outline', label: 'Duração', value: duration(session.activeSeconds) }, { icon: 'timer-sand', label: 'Isometria', value: `${s.holdS ?? 0}s` }, { icon: 'repeat', label: 'Repetições', value: String(s.reps ?? 0) }];

  const pickPhoto = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.7, allowsEditing: true, aspect: [3, 4] });
    if (!res.canceled) setPhoto(res.assets[0].uri);
  };
  const save = () => {
    updateSession(session.id, { rpe, photoUri: photo });
    router.replace('/');
  };
  const discard = () => {
    deleteSession(session.id);
    router.replace('/');
  };
  const share = () =>
    Share.share({ message: `🔥 ${session.title}\n${tiles.map((t) => `${t.label}: ${t.value}`).join(' • ')}\n— registrado no Treine` }).catch(() => undefined);

  return (
    <Screen
      tabBar={false}
      header={<StackHeader icon="close" kicker="PÓS-TREINO" title="Relatório da Sessão" right={<IconButton icon="share-variant" onPress={share} label="Compartilhar" />} />}
    >
      <HeroGradient style={{ padding: space.lg, marginTop: space.sm, marginBottom: space.md, borderWidth: 1, borderColor: colors.border, gap: 10 }}>
        <Badge label="TREINO CONCLUÍDO" tone="solid" />
        <T v="headlineXl" style={{ fontSize: 30, lineHeight: 36 }}>{session.title}</T>
        <T v="bodyMd" color={colors.textSubtle}>
          {volumeGain > 0 ? 'Excelente consistência! Novo recorde de volume atingido hoje com progressão de carga.' : `${session.entries.length} registros salvos. O mapa de fadiga já foi atualizado.`}
        </T>
      </HeroGradient>

      <View style={[styles.row, { gap: 12, marginBottom: 12 }]}>
        <Pressable onPress={pickPhoto} style={{ flex: 1, height: 150, borderRadius: radius.lg, backgroundColor: colors.surfaceHigh, alignItems: 'center', justifyContent: 'center', overflow: 'hidden', gap: 6 }}>
          {photo ? (
            <Image source={{ uri: photo }} style={{ width: '100%', height: '100%' }} />
          ) : (
            <>
              <View style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: colors.primaryTint, alignItems: 'center', justifyContent: 'center' }}>
                <Icon name="camera-plus-outline" size={26} color={colors.primary} />
              </View>
              <T v="labelLg">Foto do Shape</T>
              <T v="bodySm" color={colors.textMuted}>Check-in corporal</T>
            </>
          )}
        </Pressable>
        <Card style={{ flex: 1, height: 150, justifyContent: 'space-between' }} tone="low">
          <View style={styles.rowBetween}>
            <T v="bodySm" color={colors.textSubtle}>Data da Sessão</T>
            <Icon name="calendar-blank-outline" size={20} color={colors.primary} />
          </View>
          <View>
            <T v="headlineLg">{dateLong(session.startedAt)}</T>
            <T v="bodySm" color={colors.textSubtle}>{hhmm(session.startedAt)} – {hhmm(session.endedAt ?? session.startedAt)} ({Math.round(session.activeSeconds / 60)} min)</T>
          </View>
        </Card>
      </View>

      <View style={[styles.row, { gap: 10, marginBottom: 12 }]}>
        {tiles.map((t) => <StatTile key={t.label} icon={t.icon as never} label={t.label} value={t.value} />)}
      </View>

      {volumeGain > 0 && (
        <View style={[styles.rowBetween, { backgroundColor: 'rgba(242,133,34,0.12)', borderRadius: radius.md, padding: 14, marginBottom: 12 }]}>
          <View style={[styles.row, { gap: 8 }]}>
            <Icon name="trophy-outline" size={20} color={colors.primary} />
            <T v="labelLg">Novo Recorde Pessoal</T>
          </View>
          <Badge label={`+${num(volumeGain)} kg de volume`} tone="solid" />
        </View>
      )}

      <Card style={{ marginBottom: space.lg, gap: 12 }}>
        <View style={styles.rowBetween}>
          <T v="headlineMd">Percepção de Esforço</T>
          <T v="labelLg" color={colors.primary}>RPE {num(rpe, rpe % 1 ? 1 : 0)}/10</T>
        </View>
        <T v="bodySm" color={colors.textSubtle}>Como foi a intensidade do treino hoje?</T>
        <View style={[styles.row, { gap: 6 }]}>
          {RPE.map((o) => (
            <Pressable key={o.label} onPress={() => setRpe(o.v)} style={{ flex: 1, paddingVertical: 10, borderRadius: radius.md, alignItems: 'center', backgroundColor: rpe === o.v ? colors.primary : colors.surfaceHigh }}>
              <T v="labelMd" color={rpe === o.v ? colors.bg : colors.textSubtle}>{o.label}</T>
            </Pressable>
          ))}
        </View>
      </Card>

      {topMuscles.length > 0 && (
        <Card style={{ marginBottom: space.lg, gap: 10 }}>
          <T v="headlineMd">Desgaste muscular da sessão</T>
          {topMuscles.map(([m, v]) => (
            <View key={m} style={{ gap: 4 }}>
              <View style={styles.rowBetween}>
                <T v="labelLg">{MUSCLES[m].name}</T>
                <T v="labelLg" color={colors.primary}>{Math.round(v)}%</T>
              </View>
              <View style={{ height: 6, borderRadius: 3, backgroundColor: colors.surfaceHighest }}>
                <View style={{ width: `${v}%`, height: '100%', borderRadius: 3, backgroundColor: colors.primary }} />
              </View>
            </View>
          ))}
        </Card>
      )}

      <View style={[styles.rowBetween, { marginBottom: 12 }]}>
        <T v="headlineLg">Exercícios executados</T>
        <Badge label={`${blocks.length}/${plannedBlocks} • ${Math.round((100 * blocks.length) / Math.max(1, plannedBlocks))}% da meta`} tone="muted" />
      </View>
      <View style={{ gap: 10, marginBottom: space.lg }}>
        {blocks.length === 0 && <T color={colors.textMuted}>Nenhuma série registrada.</T>}
        {blocks.map((b) => {
          const planned = day?.items[b.block]?.prescription;
          const plannedItem = day?.items[b.block];
          const plannedN = plannedItem?.circuit ? plannedItem.circuit.rounds : planned ? (planned.kind === 'martial' ? planned.rounds : planned.kind === 'calisthenics' && planned.timed?.kind === 'emom' ? planned.timed.minutes : planned.sets.length) : b.entries.length;
          const complete = b.entries.length >= plannedN;
          return (
            <View key={b.block} style={[styles.row, { gap: 12, backgroundColor: colors.surface, borderRadius: radius.lg, padding: 12 }]}>
              <View style={{ width: 44, height: 44, borderRadius: radius.md, backgroundColor: colors.surfaceHigh, alignItems: 'center', justifyContent: 'center' }}>
                <Icon name={MODALITY_ICON[b.exercise?.modality ?? 'strength']} size={22} color={colors.primarySoft} />
              </View>
              <View style={{ flex: 1 }}>
                <T v="labelLg" numberOfLines={1}>{b.exercise?.name ?? 'Round livre'}</T>
                <T v="bodySm" color={colors.textMuted} numberOfLines={1}>{describeEntries(b.entries)}</T>
              </View>
              <Badge label={complete ? 'Concluído' : `${b.entries.length}/${plannedN}`} tone={complete ? 'primary' : 'muted'} />
            </View>
          );
        })}
      </View>

      <PillButton label="Concluir e Salvar no Histórico" icon="content-save-outline" onPress={save} />
      <Pressable onPress={discard} style={{ alignItems: 'center', padding: 16 }}>
        <T v="labelLg" color={colors.textSubtle}>Descartar Registro de Hoje</T>
      </Pressable>
    </Screen>
  );
}
