import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Modal, Pressable, ScrollView, View } from 'react-native';
import { useApp } from '../core/store/appStore';
import { colors, radius, space } from '../core/theme/tokens';
import { sameDay, startOfDay } from '../core/utils/format';
import { SessionRow } from '../features/workouts/SessionRow';
import { MonthCalendar } from '../shared/components/MonthCalendar';
import { EmptyState, Screen, StackHeader } from '../shared/components/Screen';
import { Badge, Card, Icon, IconButton, MODALITY_ICON, PillButton, T, styles } from '../shared/components/ui';

/** Calendário mensal: histórico de treinos feitos + treinos agendados, com agendamento por data. */
export default function Calendario() {
  const router = useRouter();
  const { date } = useLocalSearchParams<{ date?: string }>();
  const { sessions, schedule, routines, scheduleWorkout, unschedule } = useApp();
  const [today] = useState(() => startOfDay(Date.now()));
  const [selected, setSelected] = useState<number | null>(() => (date ? startOfDay(Number(date)) : today));
  const [cursor, setCursor] = useState(() => {
    const d = new Date(date ? Number(date) : today);
    return { y: d.getFullYear(), m: d.getMonth() };
  });
  const [picking, setPicking] = useState(false);

  const move = (delta: number) => {
    const d = new Date(cursor.y, cursor.m + delta, 1);
    setCursor({ y: d.getFullYear(), m: d.getMonth() });
    setSelected(null);
  };

  const monthStart = new Date(cursor.y, cursor.m, 1).getTime();
  const monthEnd = new Date(cursor.y, cursor.m + 1, 1).getTime();
  const done = sessions.filter((s) => s.status === 'completed' && (selected ? sameDay(s.startedAt, selected) : s.startedAt >= monthStart && s.startedAt < monthEnd));
  const planned = schedule.filter((s) => (selected ? s.date === selected : s.date >= monthStart && s.date < monthEnd));
  const canSchedule = selected != null && selected >= today;
  const rawLabel = selected
    ? new Date(selected).toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })
    : 'Mês inteiro';
  const label = rawLabel.charAt(0).toUpperCase() + rawLabel.slice(1);

  return (
    <Screen tabBar={false} header={<StackHeader icon="close" title="Calendário de Treinos" />}>
      <View style={{ marginTop: space.sm, marginBottom: space.lg }}>
        <MonthCalendar
          year={cursor.y}
          month={cursor.m}
          sessions={sessions}
          schedule={schedule}
          selected={selected}
          today={today}
          onSelect={setSelected}
          onPrev={() => move(-1)}
          onNext={() => move(1)}
        />
      </View>

      <View style={[styles.rowBetween, { marginBottom: 12 }]}>
        <T v="headlineMd" style={{ flex: 1 }}>{label}</T>
        {canSchedule && <PillButton label="Agendar treino" icon="calendar-plus" size="md" onPress={() => setPicking(true)} />}
      </View>

      {planned.length > 0 && (
        <View style={{ gap: 10, marginBottom: space.lg }}>
          <T v="labelLg" color={colors.textSubtle}>AGENDADOS</T>
          {planned.map((p) => {
            const routine = routines.find((r) => r.id === p.routineId);
            const day = routine?.days.find((d) => d.id === p.dayId);
            if (!routine || !day) return null;
            const completed = sessions.some((s) => s.status === 'completed' && s.routineDayId === p.dayId && sameDay(s.startedAt, p.date));
            const past = p.date < today;
            return (
              <Card key={p.id} style={[styles.row, { gap: 12, borderColor: past ? colors.border : colors.primary, borderStyle: 'dashed' }]}>
                <View style={{ width: 44, height: 44, borderRadius: radius.md, backgroundColor: colors.primaryTint, alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name={routine.isHybrid ? 'shuffle-variant' : MODALITY_ICON[routine.modality]} size={22} color={colors.primary} />
                </View>
                <View style={{ flex: 1, gap: 2 }}>
                  <T v="labelLg" numberOfLines={1}>{day.name}</T>
                  <T v="bodySm" color={colors.textMuted}>
                    {new Date(p.date).toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: 'short' })} • ~{day.estMinutes} min
                  </T>
                </View>
                {completed ? (
                  <Badge label="Feito" tone="success" />
                ) : past ? (
                  <Badge label="Perdido" tone="muted" />
                ) : (
                  <View style={[styles.row, { gap: 6 }]}>
                    <IconButton icon="play" size={36} bg={colors.primary} color={colors.bg} label="Abrir treino" onPress={() => router.push({ pathname: '/treino/[routineId]', params: { routineId: routine.id, day: day.id } })} />
                    <IconButton icon="close" size={36} bg={colors.surfaceHigh} label="Remover agendamento" onPress={() => unschedule(p.id)} />
                  </View>
                )}
              </Card>
            );
          })}
        </View>
      )}

      <View style={{ gap: 10 }}>
        <T v="labelLg" color={colors.textSubtle}>REALIZADOS ({done.length})</T>
        {done.length === 0 && planned.length === 0 && (
          <EmptyState icon="calendar-blank-outline" title="Nada neste dia" text={canSchedule ? 'Toque em "Agendar treino" para planejar.' : 'Nenhum treino registrado.'} />
        )}
        {done.map((s) => <SessionRow key={s.id} s={s} />)}
      </View>

      <Modal transparent visible={picking} animationType="fade" onRequestClose={() => setPicking(false)}>
        <Pressable style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' }} onPress={() => setPicking(false)}>
          <Pressable style={{ backgroundColor: colors.surface, borderTopLeftRadius: radius.xl, borderTopRightRadius: radius.xl, padding: space.lg, gap: 12, maxHeight: '80%' }}>
            <T v="headlineMd">Escolha a ficha</T>
            <T v="bodySm" color={colors.textMuted}>{label}</T>
            <ScrollView contentContainerStyle={{ gap: 8 }}>
              {routines.map((r) => (
                <View key={r.id} style={{ gap: 6 }}>
                  <View style={[styles.row, { gap: 6, marginTop: 6 }]}>
                    <Icon name={r.isHybrid ? 'shuffle-variant' : MODALITY_ICON[r.modality]} size={16} color={colors.primary} />
                    <T v="labelMd" color={colors.textSubtle}>{r.name.toUpperCase()}</T>
                  </View>
                  {r.days.map((d) => (
                    <Pressable
                      key={d.id}
                      onPress={() => {
                        if (selected != null) scheduleWorkout(selected, r.id, d.id);
                        setPicking(false);
                      }}
                      style={[styles.rowBetween, { backgroundColor: colors.surfaceHigh, padding: 14, borderRadius: radius.md }]}
                    >
                      <View style={{ flex: 1 }}>
                        <T v="labelLg">{d.name}</T>
                        <T v="bodySm" color={colors.textMuted}>{d.items.length} exercícios • ~{d.estMinutes} min</T>
                      </View>
                      <Icon name="calendar-plus" size={20} color={colors.primary} />
                    </Pressable>
                  ))}
                </View>
              ))}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </Screen>
  );
}
