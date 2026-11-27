import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, TextInput, View } from 'react-native';
import { EXERCISES } from '../../core/catalog/exercises';
import { MUSCLES } from '../../core/catalog/muscles';
import { BodyView, GOAL_LABEL, Goal, LEVEL_LABEL, Level, MODALITY_LABEL, Modality, MuscleId, STRENGTH_GROUP_LABEL, StrengthGroup } from '../../core/domain/types';
import { filterExercises, GroupChips, hasGroups, ShowMore, usePaged } from '../../features/catalog/catalogFilter';
import { ExerciseThumb } from '../../shared/components/ExerciseAnimation';
import { colors, fatigueColors, radius, space } from '../../core/theme/tokens';
import { AnatomyBody } from '../../shared/components/AnatomyBody';
import { EmptyState, Screen, TabHeader } from '../../shared/components/Screen';
import { Badge, Card, Chip, HeroGradient, Icon, IconButton, IconName, T, styles } from '../../shared/components/ui';

const MODALITY_CARDS: { m: Modality; kicker: string; icon: IconName; text: string; tags: string[] }[] = [
  { m: 'strength', kicker: 'Hipertrofia & Força', icon: 'dumbbell', text: '150 exercícios em máquinas articuladas, Smith e polias, organizados por grupo muscular.', tags: ['Peitoral', 'Costas', 'Ombros', 'Pernas', 'Braços', 'Core'] },
  { m: 'martial', kicker: 'Combate & Striking', icon: 'boxing-glove', text: 'Fundamentos de golpes, footwork e rounds guiados com combos narrados por voz.', tags: ['Boxe', 'Muay Thai', 'Kickboxing'] },
  { m: 'calisthenics', kicker: 'Peso Corporal & Pliometria', icon: 'human-handsup', text: '150 exercícios de peso corporal com demonstração animada: barras, paralelas, core, pernas e saltos.', tags: ['Barra fixa', 'Paralelas', 'Core', 'Saltos'] },
];

export default function Exercicios() {
  const router = useRouter();
  const [q, setQ] = useState('');
  const [level, setLevel] = useState<Level | null>(null);
  const [modality, setModality] = useState<Modality | null>(null);
  const [goal, setGoal] = useState<Goal | null>(null);
  const [muscle, setMuscle] = useState<MuscleId | null>(null);
  const [view, setView] = useState<BodyView>('front');
  const [showFilters, setShowFilters] = useState(false);

  const [group, setGroup] = useState<StrengthGroup | null>(null);
  const results = useMemo(
    () => filterExercises({ q, level, modality, goal, muscle, group: hasGroups(modality) ? group : null }),
    [q, level, modality, goal, muscle, group],
  );
  const page = usePaged(results, [q, level, modality, goal, muscle, group].join('|'));

  const countFor = (m: Modality) => EXERCISES.filter((e) => e.modality === m).length;
  const colorFor = (m: MuscleId) => (m === muscle ? colors.primary : EXERCISES.some((e) => (!modality || e.modality === modality) && e.muscles.some((x) => x.muscle === m && x.role === 'primary')) ? '#5a4d44' : fatigueColors.idle);

  return (
    <Screen header={<TabHeader title="Exercícios" />}>
      <View style={[styles.row, { gap: 10, marginBottom: space.md }]}>
        <View style={[styles.row, { flex: 1, gap: 8, backgroundColor: colors.surface, borderRadius: radius.full, paddingHorizontal: 16, height: 48 }]}>
          <Icon name="magnify" size={20} color={colors.textMuted} />
          <TextInput value={q} onChangeText={setQ} placeholder="Buscar exercício ou equipamento..." placeholderTextColor={colors.textMuted} style={{ flex: 1, color: colors.onSurface, fontSize: 14 }} />
          {!!q && <Icon name="close-circle" size={18} color={colors.textMuted} />}
        </View>
        <IconButton icon="tune-variant" size={48} bg={showFilters ? colors.primary : colors.surface} color={showFilters ? colors.bg : colors.onSurface} onPress={() => setShowFilters(!showFilters)} label="Filtros" />
      </View>

      <Badge label={`3 Modalidades Ativas • ${EXERCISES.length} exercícios`} tone="primary" dot style={{ marginBottom: 10 }} />
      <T v="headlineXl">Guia de Exercícios</T>
      <T v="bodyMd" color={colors.textSubtle} style={{ marginBottom: space.md }}>Aprenda a técnica correta, biomecânica e dicas de execução de cada movimento.</T>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -space.margin, marginBottom: 10 }} contentContainerStyle={{ gap: 8, paddingHorizontal: space.margin }}>
        <Chip label="Todos os níveis" active={!level} onPress={() => setLevel(null)} />
        {(Object.keys(LEVEL_LABEL) as Level[]).map((l) => <Chip key={l} label={LEVEL_LABEL[l]} active={level === l} onPress={() => setLevel(level === l ? null : l)} />)}
      </ScrollView>
      {showFilters && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -space.margin, marginBottom: 10 }} contentContainerStyle={{ gap: 8, paddingHorizontal: space.margin }}>
          {(Object.keys(GOAL_LABEL) as Goal[]).map((g) => <Chip key={g} label={GOAL_LABEL[g]} icon="target" active={goal === g} onPress={() => setGoal(goal === g ? null : g)} />)}
        </ScrollView>
      )}

      {/* Modalidades */}
      <T v="headlineMd" style={{ marginTop: space.md, marginBottom: 12 }}>Modalidades Principais</T>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -space.margin, marginBottom: space.lg }} contentContainerStyle={{ gap: 12, paddingHorizontal: space.margin }}>
        {MODALITY_CARDS.map((c) => {
          const active = modality === c.m;
          return (
            <Pressable key={c.m} onPress={() => { setModality(active ? null : c.m); setGroup(null); }} style={{ width: 280 }}>
              <HeroGradient style={{ padding: space.md, gap: 10, borderWidth: 1.5, borderColor: active ? colors.primary : colors.border, minHeight: 230 }}>
                <View style={styles.rowBetween}>
                  <View style={[styles.row, { gap: 6 }]}>
                    <Icon name={c.icon} size={16} color={colors.primary} />
                    <T v="labelMd" color={colors.primarySoft}>{c.kicker}</T>
                  </View>
                  <Badge label={`${countFor(c.m)} exercícios`} tone="solid" />
                </View>
                <T v="headlineLg">{MODALITY_LABEL[c.m]}</T>
                <T v="bodySm" color={colors.textSubtle}>{c.text}</T>
                <View style={[styles.row, { gap: 6, flexWrap: 'wrap' }]}>
                  {c.tags.map((t) => <Badge key={t} label={t} tone="muted" />)}
                </View>
                <View style={[styles.rowBetween, { borderWidth: 1, borderColor: colors.primary, borderRadius: radius.full, paddingHorizontal: 14, paddingVertical: 8, backgroundColor: active ? colors.primary : 'transparent' }]}>
                  <T v="labelMd" color={active ? colors.bg : colors.primary}>{active ? 'Filtrando' : 'Ver'} {MODALITY_LABEL[c.m]}</T>
                  <Icon name={active ? 'check' : 'arrow-right'} size={16} color={active ? colors.bg : colors.primary} />
                </View>
              </HeroGradient>
            </Pressable>
          );
        })}
      </ScrollView>

      {/* Seletor anatômico */}
      <Card style={{ gap: 12, marginBottom: space.lg }}>
        <View style={styles.rowBetween}>
          <View style={{ flex: 1 }}>
            <T v="headlineMd">Explorar por músculo</T>
            <T v="bodySm" color={colors.textSubtle}>{muscle ? `Filtrando: ${MUSCLES[muscle].name}` : 'Toque diretamente no músculo da silhueta'}</T>
          </View>
          <Pressable onPress={() => setView(view === 'front' ? 'back' : 'front')} style={[styles.row, { gap: 6, backgroundColor: colors.surfaceHigh, borderRadius: radius.full, paddingHorizontal: 12, paddingVertical: 8 }]}>
            <Icon name="rotate-3d-variant" size={18} color={colors.primary} />
            <T v="labelMd">{view === 'front' ? 'Frente' : 'Costas'}</T>
          </Pressable>
        </View>
        <View style={{ alignItems: 'center', backgroundColor: colors.bgDeep, borderRadius: radius.lg, paddingVertical: space.md }}>
          <AnatomyBody view={view} width={170} colorFor={colorFor} selected={muscle} onSelect={(m) => setMuscle(m === muscle ? null : m)} />
        </View>
        {muscle && <Chip label={`Limpar: ${MUSCLES[muscle].name}`} icon="close" active onPress={() => setMuscle(null)} style={{ alignSelf: 'flex-start' }} />}
      </Card>

      {hasGroups(modality) && <GroupChips modality={modality} value={group} onChange={setGroup} style={{ marginBottom: 14 }} />}
      <View style={[styles.rowBetween, { marginBottom: 12 }]}>
        <T v="headlineMd">{results.length} exercício{results.length === 1 ? '' : 's'}</T>
        {(level || modality || goal || muscle || q || group) && (
          <Pressable onPress={() => { setLevel(null); setModality(null); setGoal(null); setMuscle(null); setQ(''); setGroup(null); }}>
            <T v="labelLg" color={colors.primary}>Limpar filtros</T>
          </Pressable>
        )}
      </View>
      <View style={{ gap: 10 }}>
        {results.length === 0 && <EmptyState icon="magnify-close" title="Nada encontrado" text="Ajuste os filtros ou toque em outro músculo." />}
        {page.visible.map((e) => (
          <Card key={e.id} style={[styles.row, { gap: 12 }]} onPress={() => router.push({ pathname: '/exercicio/[id]', params: { id: e.id } })}>
            <ExerciseThumb exercise={e} size={56} />
            <View style={{ flex: 1, gap: 4 }}>
              <T v="labelLg" numberOfLines={2} style={{ fontSize: 15 }}>{e.name}</T>
              <View style={[styles.row, { gap: 6, flexWrap: 'wrap' }]}>
                {e.groups ? <Badge label={STRENGTH_GROUP_LABEL[e.groups[0]]} tone="primary" /> : <Badge label={MODALITY_LABEL[e.modality]} tone="muted" />}
                <Badge label={e.equipment[0]} tone="muted" />
                <Badge label={LEVEL_LABEL[e.level]} tone="muted" />
                {e.tracking === 'hold' && <Badge label="Isometria" tone="primary" />}
              </View>
            </View>
            <Icon name="chevron-right" size={22} color={colors.textMuted} />
          </Card>
        ))}
        <ShowMore remaining={page.remaining} onPress={page.more} />
      </View>
    </Screen>
  );
}
