import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { useApp } from '../core/store/appStore';
import { colors, radius, space } from '../core/theme/tokens';
import { NoticeKind } from '../features/notices/notices';
import { useNotices } from '../features/notices/useNotices';
import { EmptyState, Screen, StackHeader } from '../shared/components/Screen';
import { Card, Icon, IconName, SectionTitle, T, Toggle, styles } from '../shared/components/ui';

const KIND_ICON: Record<NoticeKind, IconName> = {
  active: 'timer-sand',
  schedule: 'calendar-clock',
  recovered: 'arm-flex-outline',
  weight: 'scale-bathroom',
  streak: 'fire',
};

/** Central de avisos e lembretes de treino. */
export default function Avisos() {
  const router = useRouter();
  const { notices } = useNotices();
  const prefs = useApp((s) => s.profile.prefs);
  const setPrefs = useApp((s) => s.setPrefs);
  const seenAt = useApp((s) => s.noticesSeenAt);
  // Guarda o "visto até" anterior para destacar os novos nesta visita, e marca tudo como lido.
  const [prevSeen] = useState(seenAt);
  const [now] = useState(() => Date.now());
  useEffect(() => {
    useApp.getState().markNoticesSeen();
  }, []);

  return (
    <Screen tabBar={false} header={<StackHeader icon="close" title="Avisos & Lembretes" />}>
      <Card style={{ gap: 12, marginVertical: space.md }}>
        <View style={[styles.row, { gap: 12 }]}>
          <Icon name="bell-ring-outline" size={22} color={colors.primary} />
          <View style={{ flex: 1 }}>
            <T v="labelLg">Lembretes de treino</T>
            <T v="bodySm" color={colors.textMuted}>Alertas de treino agendado e fim de descanso com a tela bloqueada</T>
          </View>
          <Toggle value={prefs.reminders} onChange={(v) => setPrefs({ reminders: v })} />
        </View>
      </Card>

      <SectionTitle title="Avisos" right={<T v="labelMd" color={colors.textMuted}>{notices.length}</T>} />
      <View style={{ gap: 10 }}>
        {notices.length === 0 && <EmptyState icon="bell-check-outline" title="Tudo em dia" text="Nenhum aviso no momento." />}
        {notices.map((n) => {
          const fresh = n.at <= now && n.at > prevSeen;
          return (
            <Card
              key={n.id}
              style={[styles.row, { gap: 12, alignItems: 'flex-start' }, fresh && { borderColor: colors.primary }]}
              onPress={n.href ? () => router.push(n.href as never) : undefined}
            >
              <View style={{ width: 40, height: 40, borderRadius: radius.full, backgroundColor: colors.primaryTint, alignItems: 'center', justifyContent: 'center' }}>
                <Icon name={KIND_ICON[n.kind]} size={20} color={colors.primary} />
              </View>
              <View style={{ flex: 1, gap: 2 }}>
                <View style={[styles.row, { gap: 6 }]}>
                  <T v="labelLg" style={{ flexShrink: 1 }}>{n.title}</T>
                  {fresh && <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: colors.primary }} />}
                </View>
                <T v="bodySm" color={colors.textSubtle}>{n.body}</T>
              </View>
              {n.href && <Icon name="chevron-right" size={22} color={colors.textMuted} />}
            </Card>
          );
        })}
      </View>
    </Screen>
  );
}
