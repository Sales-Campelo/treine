import React, { ReactNode } from 'react';
import { Pressable, ScrollView, StyleProp, View, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { colors, space } from '../../core/theme/tokens';
import { useApp } from '../../core/store/appStore';
import { useNotices } from '../../features/notices/useNotices';
import { Icon, IconButton, T, styles } from './ui';

/** Tela rolável com margens do design (20 px) e respiro para a tab bar. */
export function Screen({ children, header, footer, contentStyle, scroll = true, tabBar = true }: {
  children: ReactNode; header?: ReactNode; footer?: ReactNode; contentStyle?: StyleProp<ViewStyle>; scroll?: boolean; tabBar?: boolean;
}) {
  const insets = useSafeAreaInsets();
  const pad = { paddingHorizontal: space.margin, paddingBottom: (tabBar ? 110 : 40) + (footer ? 120 : 0) };
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg, paddingTop: insets.top }}>
      {header}
      {scroll ? (
        <ScrollView contentContainerStyle={[pad, contentStyle]} showsVerticalScrollIndicator={false}>
          {children}
        </ScrollView>
      ) : (
        <View style={[{ flex: 1 }, pad, contentStyle]}>{children}</View>
      )}
      {footer}
    </View>
  );
}

export function Avatar({ size = 40, onPress }: { size?: number; onPress?: () => void }) {
  const name = useApp((s) => s.profile.name);
  const initials = name.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase();
  return (
    <Pressable onPress={onPress} accessibilityLabel="Perfil" style={{ width: size, height: size, borderRadius: size / 2, borderWidth: 2, borderColor: colors.primary, backgroundColor: colors.surfaceHigh, alignItems: 'center', justifyContent: 'center' }}>
      <T v="labelLg" color={colors.primary} style={{ fontSize: size * 0.36 }}>{initials}</T>
    </Pressable>
  );
}

/** Barra superior das abas: título + sino + avatar. */
export function TabHeader({ title, right }: { title: string; right?: ReactNode }) {
  const router = useRouter();
  const { unread } = useNotices();
  return (
    <View style={[styles.rowBetween, { paddingHorizontal: space.margin, paddingVertical: 12 }]}>
      <T v="headlineLg">{title}</T>
      <View style={[styles.row, { gap: 12 }]}>
        {right}
        <View>
          <IconButton icon={unread ? 'bell-ring-outline' : 'bell-outline'} bg="transparent" iconSize={24} label="Notificações" onPress={() => router.push('/avisos')} />
          {unread && <View style={{ position: 'absolute', top: 6, right: 7, width: 9, height: 9, borderRadius: 5, backgroundColor: colors.primary, borderWidth: 1.5, borderColor: colors.bg }} />}
        </View>
        <Avatar onPress={() => router.push('/perfil')} />
      </View>
    </View>
  );
}

/** Barra superior de telas empilhadas: voltar + título central + ações. */
export function StackHeader({ title, kicker, right, icon = 'arrow-left' }: { title: string; kicker?: string; right?: ReactNode; icon?: 'arrow-left' | 'close' }) {
  const router = useRouter();
  return (
    <View style={[styles.rowBetween, { paddingHorizontal: space.margin, paddingVertical: 10, gap: 12 }]}>
      <IconButton icon={icon} onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))} label="Voltar" />
      <View style={{ flex: 1, alignItems: 'center' }}>
        {kicker && <T v="labelMd" color={colors.primary} style={{ letterSpacing: 2 }}>{kicker}</T>}
        <T v="headlineMd" numberOfLines={1}>{title}</T>
      </View>
      <View style={[styles.row, { gap: 8, minWidth: 40, justifyContent: 'flex-end' }]}>{right}</View>
    </View>
  );
}

export function EmptyState({ icon, title, text }: { icon: Parameters<typeof Icon>[0]['name']; title: string; text: string }) {
  return (
    <View style={{ alignItems: 'center', padding: space.xl, gap: 8 }}>
      <Icon name={icon} size={40} color={colors.textMuted} />
      <T v="headlineMd">{title}</T>
      <T v="bodyMd" color={colors.textMuted} style={{ textAlign: 'center' }}>{text}</T>
    </View>
  );
}
