import { useRouter } from 'expo-router';
import React from 'react';
import { View } from 'react-native';
import { Session } from '../../core/domain/types';
import { colors, radius } from '../../core/theme/tokens';
import { kg } from '../../core/utils/format';
import { MOD_COLOR } from '../../shared/components/MonthCalendar';
import { Card, Icon, MODALITY_ICON, T, styles } from '../../shared/components/ui';

/** Linha de um treino realizado (abre o relatório). */
export function SessionRow({ s }: { s: Session }) {
  const router = useRouter();
  return (
    <Card style={[styles.row, { gap: 12 }]} onPress={() => router.push({ pathname: '/relatorio/[sessionId]', params: { sessionId: s.id } })}>
      <View style={{ width: 44, height: 44, borderRadius: radius.md, backgroundColor: colors.surfaceHigh, alignItems: 'center', justifyContent: 'center' }}>
        <Icon name={s.isHybrid ? 'shuffle-variant' : MODALITY_ICON[s.modality]} size={22} color={MOD_COLOR[s.modality]} />
      </View>
      <View style={{ flex: 1 }}>
        <T v="labelLg" numberOfLines={1}>{s.title}</T>
        <T v="bodySm" color={colors.textMuted}>
          {new Date(s.startedAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })} • {Math.round(s.activeSeconds / 60)} min •{' '}
          {s.modality === 'strength' || s.isHybrid ? kg(s.summary.tonnageKg ?? 0) : s.modality === 'martial' ? `${s.summary.rounds} rounds` : `${s.summary.sets} séries`}
        </T>
      </View>
      <Icon name="chevron-right" size={22} color={colors.textMuted} />
    </Card>
  );
}
