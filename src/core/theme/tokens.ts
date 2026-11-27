// Kinetic Amber — tokens extraídos de desing/kinetic_amber/DESIGN.md e dos code.html.
import { TextStyle } from 'react-native';

export const colors = {
  bg: '#151311',
  bgDeep: '#100e0c',
  surfaceLow: '#1d1b19',
  surface: '#221f1d',
  surfaceHigh: '#2c2927',
  surfaceHighest: '#373432',
  surfaceBright: '#3c3936',
  onSurface: '#e8e1dd',
  onSurfaceVariant: '#dcc1b0',
  textMuted: '#9e958e',
  textSubtle: '#c0b7af',
  white: '#ffffff',
  outline: '#a48c7c',
  outlineVariant: '#564336',
  primary: '#f28522', // laranja queimado — ação/timer/progresso
  primarySoft: '#ffb783',
  onPrimary: '#4f2500',
  primaryTint: 'rgba(242,133,34,0.15)',
  primaryGlow: 'rgba(242,133,34,0.25)',
  success: '#4e9f3d',
  successSoft: 'rgba(78,159,61,0.18)',
  danger: '#d34537',
  dangerSoft: 'rgba(211,69,55,0.18)',
  warning: '#f2b822',
  border: 'rgba(255,255,255,0.05)',
  borderStrong: 'rgba(255,255,255,0.08)',
  navBg: 'rgba(18,16,14,0.92)',
} as const;

export const fatigueColors = {
  recovered: '#2bb673',
  recovering: '#f2b822',
  weakened: '#f28522',
  fatigued: '#e5484d',
  idle: '#3a3633',
} as const;

export const space = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32, margin: 20, gutter: 16 } as const;
export const radius = { sm: 4, md: 12, lg: 16, xl: 24, full: 9999 } as const;

export const font = {
  regular: 'PlusJakartaSans_400Regular',
  medium: 'PlusJakartaSans_500Medium',
  semibold: 'PlusJakartaSans_600SemiBold',
  bold: 'PlusJakartaSans_700Bold',
  extrabold: 'PlusJakartaSans_800ExtraBold',
} as const;

const t = (fontFamily: string, fontSize: number, lineHeight: number, letterSpacing = 0): TextStyle => ({
  fontFamily,
  fontSize,
  lineHeight,
  letterSpacing,
  color: colors.onSurface,
});

export const type = {
  headlineXl: t(font.extrabold, 28, 34, -0.6),
  headlineLg: t(font.bold, 24, 30, -0.5),
  headlineMd: t(font.bold, 20, 26, -0.2),
  bodyLg: t(font.regular, 16, 24),
  bodyMd: t(font.regular, 14, 20),
  bodySm: t(font.regular, 12, 16),
  labelLg: t(font.semibold, 14, 18, 0.14),
  labelMd: t(font.semibold, 12, 16, 0.24),
  metric: { ...t(font.extrabold, 44, 48, -1.7), fontVariant: ['tabular-nums'] } as TextStyle,
  metricSm: { ...t(font.extrabold, 28, 32, -0.8), fontVariant: ['tabular-nums'] } as TextStyle,
} as const;

export const glow = {
  shadowColor: colors.primary,
  shadowOffset: { width: 0, height: 8 },
  shadowOpacity: 0.3,
  shadowRadius: 24,
  elevation: 10,
} as const;
