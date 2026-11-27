import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { ComponentProps, ReactNode } from 'react';
import { Pressable, PressableProps, StyleProp, StyleSheet, Switch, Text, TextProps, TextStyle, View, ViewStyle } from 'react-native';
import { colors, font, glow, radius, space, type } from '../../core/theme/tokens';
import { Modality } from '../../core/domain/types';

export type IconName = ComponentProps<typeof MaterialCommunityIcons>['name'];
export const Icon = ({ name, size = 20, color = colors.onSurface, style }: { name: IconName; size?: number; color?: string; style?: StyleProp<TextStyle> }) => (
  <MaterialCommunityIcons name={name} size={size} color={color} style={style} />
);

export const MODALITY_ICON: Record<Modality, IconName> = {
  strength: 'dumbbell',
  martial: 'boxing-glove',
  calisthenics: 'human-handsup',
};

// ------------------------------------------------------------------ Texto
type Variant = keyof typeof type;
export function T({ v = 'bodyMd', color, style, children, ...rest }: TextProps & { v?: Variant; color?: string }) {
  return (
    <Text {...rest} style={[type[v], color ? { color } : null, style]}>
      {children}
    </Text>
  );
}

// ------------------------------------------------------------------ Card
export function Card({ children, style, onPress, tone = 'base' }: { children: ReactNode; style?: StyleProp<ViewStyle>; onPress?: () => void; tone?: 'base' | 'high' | 'low' }) {
  const bg = tone === 'high' ? colors.surfaceHigh : tone === 'low' ? colors.surfaceLow : colors.surface;
  const content = <View style={[styles.card, { backgroundColor: bg }, style]}>{children}</View>;
  if (!onPress) return content;
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [{ transform: [{ scale: pressed ? 0.985 : 1 }] }]}>
      {content}
    </Pressable>
  );
}

// ------------------------------------------------------------------ Botões
export function PillButton({
  label, icon, iconRight, onPress, variant = 'primary', style, size = 'lg', disabled,
}: {
  label: string; icon?: IconName; iconRight?: IconName; onPress?: () => void; variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  style?: StyleProp<ViewStyle>; size?: 'md' | 'lg'; disabled?: boolean;
}) {
  const bg = variant === 'primary' ? colors.primary : variant === 'secondary' ? colors.surfaceHigh : 'transparent';
  const fg = variant === 'primary' ? colors.bg : variant === 'danger' ? colors.danger : colors.onSurface;
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.pill,
        { backgroundColor: bg, height: size === 'lg' ? 56 : 40, paddingHorizontal: size === 'lg' ? 24 : 16, opacity: disabled ? 0.5 : 1 },
        variant === 'ghost' && { borderWidth: 1.5, borderColor: colors.surfaceHighest },
        variant === 'primary' && glow,
        { transform: [{ scale: pressed ? 0.97 : 1 }] },
        style,
      ]}
    >
      {icon && <Icon name={icon} size={size === 'lg' ? 22 : 18} color={fg} />}
      <T v={size === 'lg' ? 'labelLg' : 'labelMd'} color={fg} style={size === 'lg' && { fontSize: 16, fontFamily: font.bold }}>
        {label}
      </T>
      {iconRight && <Icon name={iconRight} size={size === 'lg' ? 22 : 18} color={fg} />}
    </Pressable>
  );
}

export function IconButton({ icon, onPress, size = 40, bg = colors.surface, color = colors.onSurface, iconSize, label, style, ...rest }: {
  icon: IconName; onPress?: () => void; size?: number; bg?: string; color?: string; iconSize?: number; label?: string; style?: StyleProp<ViewStyle>;
} & Omit<PressableProps, 'style'>) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      {...rest}
      style={({ pressed }) => [{ width: size, height: size, borderRadius: size / 2, backgroundColor: bg, alignItems: 'center', justifyContent: 'center', transform: [{ scale: pressed ? 0.94 : 1 }] }, style]}
    >
      <Icon name={icon} size={iconSize ?? size * 0.5} color={color} />
    </Pressable>
  );
}

// ------------------------------------------------------------------ Chips & badges
export function Chip({ label, active, onPress, icon, style }: { label: string; active?: boolean; onPress?: () => void; icon?: IconName; style?: StyleProp<ViewStyle> }) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.chip, { backgroundColor: active ? colors.primary : colors.surfaceHigh }, style]}
    >
      {icon && <Icon name={icon} size={14} color={active ? colors.bg : colors.textMuted} />}
      <T v="labelMd" color={active ? colors.bg : colors.textSubtle}>{label}</T>
    </Pressable>
  );
}

export function Badge({ label, tone = 'primary', dot, style }: { label: string; tone?: 'primary' | 'muted' | 'success' | 'danger' | 'solid'; dot?: boolean; style?: StyleProp<ViewStyle> }) {
  const map = {
    primary: [colors.primaryTint, colors.primary],
    muted: [colors.surfaceHigh, colors.textSubtle],
    success: [colors.successSoft, '#7fd06b'],
    danger: [colors.dangerSoft, '#ff8a7e'],
    solid: [colors.primary, colors.bg],
  } as const;
  const [bg, fg] = map[tone];
  return (
    <View style={[styles.badge, { backgroundColor: bg }, style]}>
      {dot && <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: fg }} />}
      <T v="labelMd" color={fg} style={{ fontSize: 11 }}>{label}</T>
    </View>
  );
}

// ------------------------------------------------------------------ Títulos & layout
export function SectionTitle({ title, right, style }: { title: string; right?: ReactNode; style?: StyleProp<ViewStyle> }) {
  return (
    <View style={[styles.rowBetween, { marginBottom: space.md }, style]}>
      <View style={styles.row}>
        <View style={{ width: 5, height: 20, borderRadius: 3, backgroundColor: colors.primary, marginRight: 10 }} />
        <T v="headlineMd" style={{ fontSize: 22 }}>{title}</T>
      </View>
      {right}
    </View>
  );
}

export function StatTile({ icon, label, value, sub, accent, style }: { icon?: IconName; label: string; value: string; sub?: string; accent?: boolean; style?: StyleProp<ViewStyle> }) {
  return (
    <View style={[styles.statTile, style]}>
      {icon && <Icon name={icon} size={20} color={colors.primary} />}
      <T v="bodySm" color={colors.textMuted} style={{ marginTop: icon ? 6 : 0 }}>{label}</T>
      <T v="headlineMd" color={accent ? colors.primary : colors.onSurface} style={{ fontVariant: ['tabular-nums'] }}>{value}</T>
      {sub && <T v="bodySm" color={colors.textMuted}>{sub}</T>}
    </View>
  );
}

export function Stepper({ value, onChange, step = 1, min = -Infinity, format = (v: number) => String(v), label, compact }: { value: number; onChange: (v: number) => void; step?: number; min?: number; format?: (v: number) => string; label?: string; compact?: boolean }) {
  const btn = compact ? 30 : 36;
  return (
    <View style={{ alignItems: 'center', gap: 4 }}>
      {label && <T v="labelMd" color={colors.textMuted} numberOfLines={1}>{label}</T>}
      <View style={[styles.row, { gap: compact ? 4 : 10 }]}>
        <IconButton icon="minus" size={btn} bg={colors.surfaceHighest} onPress={() => onChange(Math.max(min, +(value - step).toFixed(2)))} label={`Diminuir ${label ?? ''}`} />
        <T v={compact ? 'labelLg' : 'headlineMd'} style={{ minWidth: compact ? 34 : 56, textAlign: 'center', fontVariant: ['tabular-nums'], fontSize: compact ? 16 : undefined }}>{format(value)}</T>
        <IconButton icon="plus" size={btn} bg={colors.surfaceHighest} onPress={() => onChange(+(value + step).toFixed(2))} label={`Aumentar ${label ?? ''}`} />
      </View>
    </View>
  );
}

export function Segmented<K extends string>({ options, value, onChange, style }: { options: { key: K; label: string; icon?: IconName }[]; value: K; onChange: (k: K) => void; style?: StyleProp<ViewStyle> }) {
  return (
    <View style={[styles.segmented, style]}>
      {options.map((o) => {
        const active = o.key === value;
        return (
          <Pressable key={o.key} onPress={() => onChange(o.key)} style={[styles.segment, active && { backgroundColor: colors.primary }]}>
            {o.icon && <Icon name={o.icon} size={16} color={active ? colors.bg : colors.textMuted} />}
            <T v="labelLg" color={active ? colors.bg : colors.onSurface}>{o.label}</T>
          </Pressable>
        );
      })}
    </View>
  );
}

export function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  // activeThumbColor é a prop do react-native-web (senão o thumb fica verde-azulado no web).
  const webProps = { activeThumbColor: colors.white, activeTrackColor: colors.primary } as object;
  return <Switch value={value} onValueChange={onChange} trackColor={{ true: colors.primary, false: colors.surfaceHighest }} thumbColor={colors.white} {...webProps} />;
}

export function Divider({ style }: { style?: StyleProp<ViewStyle> }) {
  return <View style={[{ height: 1, backgroundColor: colors.borderStrong }, style]} />;
}

/** Bloco com gradiente quente (substitui as fotos remotas efêmeras do design). */
export function HeroGradient({ children, style, height }: { children?: ReactNode; style?: StyleProp<ViewStyle>; height?: number }) {
  return (
    <LinearGradient
      colors={['#3a2414', '#221a14', '#151311']}
      start={{ x: 1, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={[{ borderRadius: radius.lg, overflow: 'hidden', height }, style]}
    >
      {children}
    </LinearGradient>
  );
}

export const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  card: { borderRadius: radius.lg, padding: space.md, borderWidth: 1, borderColor: colors.border },
  pill: { borderRadius: radius.full, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 },
  chip: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14, paddingVertical: 8, borderRadius: radius.full },
  badge: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 10, paddingVertical: 4, borderRadius: radius.full, alignSelf: 'flex-start' },
  statTile: { flex: 1, backgroundColor: colors.surface, borderRadius: radius.lg, padding: 14, gap: 2, borderWidth: 1, borderColor: colors.border, alignItems: 'center' },
  segmented: { flexDirection: 'row', backgroundColor: colors.surfaceLow, borderRadius: radius.full, padding: 4 },
  segment: { flex: 1, flexDirection: 'row', gap: 6, alignItems: 'center', justifyContent: 'center', paddingVertical: 10, borderRadius: radius.full },
});
