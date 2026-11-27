import React from 'react';
import { Pressable, View } from 'react-native';
import { MODALITY_LABEL, Modality, ScheduledWorkout, Session } from '../../core/domain/types';
import { colors, radius } from '../../core/theme/tokens';
import { MONTHS, sameDay } from '../../core/utils/format';
import { Card, IconButton, T, styles } from './ui';

export const MOD_COLOR: Record<Modality, string> = { strength: colors.primary, martial: '#e5484d', calisthenics: '#2bb673' };

/** Dias (epoch, 00:00) do mês `year/month` com preenchimento para começar na segunda-feira. */
export function monthCells(year: number, month: number): (number | null)[] {
  const first = new Date(year, month, 1);
  const lead = (first.getDay() + 6) % 7;
  const daysIn = new Date(year, month + 1, 0).getDate();
  return [...Array(lead).fill(null), ...Array.from({ length: daysIn }, (_, i) => new Date(year, month, i + 1).getTime())];
}

/**
 * Grade mensal: pontos cheios = treinos feitos (cor por modalidade); anel laranja = treino agendado.
 */
export function MonthCalendar({
  year, month, sessions, schedule = [], selected, today, onSelect, onPrev, onNext, canNext = true,
}: {
  year: number;
  month: number;
  sessions: Session[];
  schedule?: ScheduledWorkout[];
  selected: number | null;
  today: number;
  onSelect: (day: number | null) => void;
  onPrev: () => void;
  onNext: () => void;
  canNext?: boolean;
}) {
  const cells = monthCells(year, month);
  return (
    <Card style={{ gap: 12 }}>
      <View style={styles.rowBetween}>
        <IconButton icon="chevron-left" size={36} bg={colors.surfaceHigh} onPress={onPrev} label="Mês anterior" />
        <T v="headlineMd">{MONTHS[month]} {year}</T>
        <IconButton icon="chevron-right" size={36} bg={colors.surfaceHigh} onPress={canNext ? onNext : undefined} color={canNext ? colors.onSurface : colors.surfaceHighest} label="Próximo mês" />
      </View>
      <View style={{ flexDirection: 'row' }}>
        {['S', 'T', 'Q', 'Q', 'S', 'S', 'D'].map((d, i) => <T key={i} v="labelMd" color={colors.textMuted} style={{ flex: 1, textAlign: 'center' }}>{d}</T>)}
      </View>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
        {cells.map((t, i) => {
          if (t == null) return <View key={`e${i}`} style={{ width: `${100 / 7}%`, aspectRatio: 1 }} />;
          const done = sessions.filter((s) => s.status === 'completed' && sameDay(s.startedAt, t));
          const planned = schedule.filter((s) => s.date === t);
          const isSel = selected != null && sameDay(selected, t);
          const isToday = t === today;
          const pending = planned.length > 0 && t >= today;
          return (
            <Pressable key={t} accessibilityLabel={`Dia ${new Date(t).getDate()}`} onPress={() => onSelect(isSel ? null : t)} style={{ width: `${100 / 7}%`, aspectRatio: 1, padding: 3 }}>
              <View
                style={{
                  flex: 1, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center', gap: 3,
                  backgroundColor: isSel ? colors.primary : done.length ? colors.surfaceHigh : 'transparent',
                  borderWidth: isSel ? 0 : pending ? 1.5 : isToday ? 1 : 0,
                  borderColor: pending ? colors.primary : colors.textMuted,
                  borderStyle: pending && !isToday ? 'dashed' : 'solid',
                }}
              >
                <T v="labelLg" color={isSel ? colors.bg : done.length || pending ? colors.onSurface : colors.textMuted}>{new Date(t).getDate()}</T>
                <View style={[styles.row, { gap: 2, height: 5 }]}>
                  {done.slice(0, 3).map((s) => <View key={s.id} style={{ width: 5, height: 5, borderRadius: 3, backgroundColor: isSel ? colors.bg : MOD_COLOR[s.modality] }} />)}
                </View>
              </View>
            </Pressable>
          );
        })}
      </View>
      <View style={[styles.row, { gap: 12, justifyContent: 'center', flexWrap: 'wrap' }]}>
        {(Object.keys(MOD_COLOR) as Modality[]).map((m) => (
          <View key={m} style={[styles.row, { gap: 6 }]}>
            <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: MOD_COLOR[m] }} />
            <T v="bodySm" color={colors.textSubtle}>{MODALITY_LABEL[m]}</T>
          </View>
        ))}
        {schedule.length > 0 && (
          <View style={[styles.row, { gap: 6 }]}>
            <View style={{ width: 10, height: 10, borderRadius: 3, borderWidth: 1.5, borderStyle: 'dashed', borderColor: colors.primary }} />
            <T v="bodySm" color={colors.textSubtle}>Agendado</T>
          </View>
        )}
      </View>
    </Card>
  );
}
