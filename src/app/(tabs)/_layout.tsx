import { Tabs } from 'expo-router/js-tabs';
import React from 'react';
import { View } from 'react-native';
import { colors, font } from '../../core/theme/tokens';
import { Icon, IconName } from '../../shared/components/ui';

const TABS: { name: string; title: string; icon: IconName }[] = [
  { name: 'index', title: 'Treinos', icon: 'dumbbell' },
  { name: 'atividades', title: 'Atividades', icon: 'heart-pulse' },
  { name: 'exercicios', title: 'Exercícios', icon: 'book-open-variant' },
  { name: 'perfil', title: 'Perfil', icon: 'human-handsup' },
];

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          position: 'absolute',
          backgroundColor: colors.navBg,
          borderTopColor: colors.borderStrong,
          borderTopWidth: 1,
          height: 72,
          paddingTop: 8,
        },
        tabBarLabelStyle: { fontFamily: font.semibold, fontSize: 11 },
        sceneStyle: { backgroundColor: colors.bg },
      }}
    >
      {TABS.map((t) => (
        <Tabs.Screen
          key={t.name}
          name={t.name}
          options={{
            title: t.title,
            tabBarIcon: ({ color, focused }) => (
              <View style={{ alignItems: 'center' }}>
                <Icon name={t.icon} size={22} color={String(color)} />
                {focused && <View style={{ position: 'absolute', bottom: -30, width: 4, height: 4, borderRadius: 2, backgroundColor: colors.primary }} />}
              </View>
            ),
          }}
        />
      ))}
    </Tabs>
  );
}
