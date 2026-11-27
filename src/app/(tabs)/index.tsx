import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { MODALITY_LABEL, Modality } from '../../core/domain/types';
import { useApp } from '../../core/store/appStore';
import { colors, glow, radius, space } from '../../core/theme/tokens';
import { sameDay, startOfDay, WEEKDAYS_SHORT } from '../../core/utils/format';
import { quoteOfDay } from '../../core/catalog/quotes';
import { nextWorkout, useActiveSession } from '../../features/workouts/useStartWorkout';
import { Screen, TabHeader } from '../../shared/components/Screen';
import { Badge, Card, HeroGradient, Icon, MODALITY_ICON, PillButton, SectionTitle, T, styles } from '../../shared/components/ui';

const DAY = 86_400_000;
const MODALITY_SUB: Record<Modality, string> = {
  strength: 'Registro livre de séries e cargas',
  martial: 'Cronômetro de rounds e intervalos',
  calisthenics: 'Peso corporal, barras e isometria',
};

export default function Home() {
  const router = useRouter();
  const { profile, routines, sessions, schedule } = useApp();
  const active = useActiveSession();
  // Semana corrente (segunda → domingo)
  const [today] = useState(() => startOfDay(Date.now()));
  const next = nextWorkout(routines, sessions, schedule, today);
  const quote = quoteOfDay(today);
  const openPreview = () => router.push({ pathname: '/treino/[routineId]', params: { routineId: next.routine.id, day: next.day.id } });
  const week = useMemo(() => {
    const dow = (new Date(today).getDay() + 6) % 7;
    const monday = today - dow * DAY;
    return Array.from({ length: 7 }, (_, i) => {
      const t = monday + i * DAY;
      return {
        t,
        today: t === today,
        trained: sessions.some((s) => s.status === 'completed' && sameDay(s.startedAt, t)),
        planned: t >= today && schedule.some((x) => x.date === t),
      };
    });
  }, [sessions, schedule, today]);
  const whenLabel = next.scheduledFor == null || next.scheduledFor === today
    ? 'Hoje'
    : new Date(next.scheduledFor).toLocaleDateString('pt-BR', { weekday: 'long' });
  const exerciseCount = next.day.items.length;

  return (
    <Screen header={<TabHeader title="Treinos" />}>
      <View style={{ marginTop: 4, marginBottom: space.lg }}>
        <T v="headlineXl">Olá, {profile.name.split(' ')[0]} 🔥</T>
        <T v="bodyMd" color={colors.textSubtle}>Atualize seu peso e suas medidas no app</T>
      </View>

      {/* Faixa semanal */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingBottom: 4 }} style={{ marginHorizontal: -space.margin, paddingHorizontal: space.margin, marginBottom: space.lg }}>
        {week.map((d) => {
          const date = new Date(d.t);
          return (
            <Pressable
              key={d.t}
              accessibilityRole="button"
              accessibilityLabel={`Calendário ${date.getDate()}`}
              onPress={() => router.push({ pathname: '/calendario', params: { date: String(d.t) } })}
              style={({ pressed }) => [{ width: d.today ? 76 : 64, height: d.today ? 92 : 80, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center', gap: 2, backgroundColor: d.today ? colors.primary : colors.surface, alignSelf: 'center', borderWidth: !d.today && d.planned ? 1 : 0, borderColor: colors.outlineVariant, borderStyle: 'dashed', transform: [{ scale: pressed ? 0.95 : 1 }] }, d.today && glow]}
            >
              <T v="labelLg" color={d.today ? colors.bg : colors.textSubtle} style={d.today && { textTransform: 'uppercase' }}>{WEEKDAYS_SHORT[date.getDay()]}</T>
              <T v="headlineLg" color={d.today ? colors.bg : colors.onSurface} style={d.today && { fontSize: 30, lineHeight: 34 }}>{date.getDate()}</T>
              <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: d.trained ? (d.today ? colors.bg : colors.primary) : d.today ? colors.bg : colors.surfaceHighest }} />
            </Pressable>
          );
        })}
      </ScrollView>

      {active && (
        <Card style={{ marginBottom: space.md, borderColor: colors.primary, flexDirection: 'row', alignItems: 'center', gap: 12 }} onPress={() => router.push({ pathname: '/player/[sessionId]', params: { sessionId: active.id } })}>
          <Icon name="timer-sand" size={26} color={colors.primary} />
          <View style={{ flex: 1 }}>
            <T v="labelMd" color={colors.primary}>TREINO EM ANDAMENTO</T>
            <T v="labelLg" numberOfLines={1}>{active.title}</T>
          </View>
          <Icon name="chevron-right" size={24} color={colors.textMuted} />
        </Card>
      )}

      {/* Próximo treino */}
      <HeroGradient style={{ padding: space.md + 4, borderWidth: 1, borderColor: colors.border, marginBottom: space.xl }}>
        <View style={[styles.rowBetween, { marginBottom: 14 }]}>
          <Badge label={`Ciclo: ${next.routine.tag}`} tone="muted" dot style={{ backgroundColor: 'rgba(255,255,255,0.06)' }} />
          <Badge label={`Semana ${Math.max(1, Math.ceil(sessions.length / profile.weeklyTarget))}`} tone="muted" />
        </View>
        <View style={[styles.row, { gap: 6, marginBottom: 6 }]}>
          <Icon name={next.scheduledFor != null ? 'calendar-check' : 'clock-outline'} size={16} color={colors.primary} />
          <T v="labelLg" color={colors.primary}>{next.scheduledFor != null ? 'PRÓXIMO TREINO • AGENDADO' : 'PRÓXIMO TREINO'}</T>
        </View>
        <T v="headlineLg" style={{ fontSize: 26, lineHeight: 32 }}>{next.day.name}</T>
        <T v="bodyMd" color={colors.textSubtle} style={{ marginTop: 4, marginBottom: space.md }}>
          <T v="bodyMd" color={colors.textSubtle} style={{ textTransform: 'capitalize' }}>{whenLabel}</T> • ~{next.day.estMinutes} min • {exerciseCount} exercício{exerciseCount > 1 ? 's' : ''}
        </T>
        <PillButton label="Abrir Próximo Treino" icon="arrow-right-circle-outline" onPress={openPreview} />
        <View style={{ height: 1, backgroundColor: colors.borderStrong, marginVertical: space.md }} />
        {/* Frase motivacional do dia (muda automaticamente a cada dia) */}
        <View style={[styles.row, { gap: 10, alignItems: 'flex-start' }]}>
          <Icon name="format-quote-open" size={22} color={colors.primary} />
          <T v="bodyMd" color={colors.onSurfaceVariant} style={{ flex: 1, fontStyle: 'italic' }}>{quote}</T>
        </View>
      </HeroGradient>

      {/* Meus treinos */}
      <SectionTitle
        title="Meus treinos"
        right={
          <View style={[styles.row, { gap: 12 }]}>
            <Pressable style={[styles.row, { gap: 4, backgroundColor: colors.primaryTint, paddingHorizontal: 12, paddingVertical: 6, borderRadius: radius.full }]} onPress={() => router.push('/criar')}>
              <Icon name="plus" size={16} color={colors.primary} />
              <T v="labelLg" color={colors.primary}>Criar</T>
            </Pressable>
          </View>
        }
      />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -space.margin, marginBottom: space.xl }} contentContainerStyle={{ gap: 12, paddingHorizontal: space.margin }}>
        <Pressable onPress={() => router.push('/criar')} style={{ width: 250, borderRadius: radius.lg, borderWidth: 1.5, borderStyle: 'dashed', borderColor: colors.outlineVariant, padding: space.md, backgroundColor: colors.surfaceLow, justifyContent: 'space-between', minHeight: 200 }}>
          <View style={styles.rowBetween}>
            <Badge label="Personalizado" tone="primary" />
            <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: colors.primaryTint, alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="plus" size={20} color={colors.primary} />
            </View>
          </View>
          <View>
            <T v="headlineMd">Criar Novo Treino</T>
            <T v="bodySm" color={colors.textSubtle} style={{ marginTop: 4 }}>Monte sua rotina do zero com suas cargas e repetições.</T>
          </View>
          <View style={[styles.row, { gap: 4 }]}>
            <T v="labelLg" color={colors.primary}>Começar</T>
            <Icon name="arrow-right" size={16} color={colors.primary} />
          </View>
        </Pressable>
        {routines.map((r) => {
          const ex = new Set(r.days.flatMap((d) => d.items.map((i) => i.exerciseId))).size;
          return (
            <Pressable key={r.id} onPress={() => router.push({ pathname: '/treino/[routineId]', params: { routineId: r.id } })} style={{ width: 250, borderRadius: radius.lg, padding: space.md, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, justifyContent: 'space-between', minHeight: 200 }}>
              <Badge label={r.tag} tone="muted" />
              <View>
                <T v="headlineMd" numberOfLines={2}>{r.name}</T>
                <T v="bodySm" color={colors.textSubtle} numberOfLines={2} style={{ marginTop: 4 }}>{r.description}</T>
              </View>
              <View style={styles.rowBetween}>
                <View style={[styles.row, { gap: 6 }]}>
                  <Icon name={r.isHybrid ? 'shuffle-variant' : MODALITY_ICON[r.modality]} size={16} color={colors.textMuted} />
                  <T v="labelMd" color={colors.textSubtle}>{r.days.length} dias • {ex} exercícios</T>
                </View>
              </View>
            </Pressable>
          );
        })}
      </ScrollView>

      {/* Treino imediato por modalidade */}
      <SectionTitle title="Modalidade de Treino" />
      <View style={{ gap: 12 }}>
        {(['strength', 'martial', 'calisthenics'] as Modality[]).map((m) => (
          <Card key={m} style={[styles.row, { gap: 14 }]} onPress={() => router.push({ pathname: '/modalidade/[modality]', params: { modality: m } })}>
            <View style={{ width: 56, height: 56, borderRadius: radius.md, backgroundColor: colors.surfaceHighest, alignItems: 'center', justifyContent: 'center' }}>
              <Icon name={MODALITY_ICON[m]} size={26} color={colors.primarySoft} />
            </View>
            <View style={{ flex: 1 }}>
              <T v="headlineMd">{MODALITY_LABEL[m]}</T>
              <T v="bodySm" color={colors.textSubtle}>{MODALITY_SUB[m]}</T>
            </View>
            <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: colors.surfaceHigh, alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="play" size={20} color={colors.onSurface} />
            </View>
          </Card>
        ))}
      </View>
    </Screen>
  );
}
