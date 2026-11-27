import React, { ReactNode } from 'react';
import { View } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Path, Stop, Line, Circle as Dot } from 'react-native-svg';
import { colors } from '../../core/theme/tokens';
import { T } from './ui';

/** Anel de progresso circular (timer). progress 0..1 no sentido horário a partir do topo. */
export function ProgressRing({ size, stroke = 12, progress, color = colors.primary, track = colors.surfaceHigh, children }: {
  size: number; stroke?: number; progress: number; color?: string; track?: string; children?: ReactNode;
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const p = Math.max(0, Math.min(1, progress));
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size} style={{ position: 'absolute' }}>
        <Defs>
          <LinearGradient id="ringGlow" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor="#3a2414" stopOpacity="1" />
            <Stop offset="1" stopColor="#151311" stopOpacity="1" />
          </LinearGradient>
        </Defs>
        <Circle cx={size / 2} cy={size / 2} r={r - stroke / 2} fill="url(#ringGlow)" />
        <Circle cx={size / 2} cy={size / 2} r={r} stroke={track} strokeWidth={stroke} fill="none" />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={color}
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={`${c} ${c}`}
          strokeDashoffset={c * (1 - p)}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      {children}
    </View>
  );
}

/** Barras verticais com rótulo de valor (distribuição de esforço). */
export function BarChart({ data, height = 150, format = (v: number) => `${Math.round(v)}%` }: {
  data: { label: string; value: number; highlight?: boolean }[]; height?: number; format?: (v: number) => string;
}) {
  const max = Math.max(1, ...data.map((d) => d.value));
  return (
    <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 8, height: height + 40 }}>
      {data.map((d) => {
        const h = Math.max(6, (d.value / max) * height);
        const opacity = 0.35 + 0.65 * (d.value / max);
        return (
          <View key={d.label} style={{ flex: 1, alignItems: 'center', gap: 4 }}>
            <T v="labelMd" color={d.highlight ? colors.primarySoft : colors.textSubtle} style={{ fontSize: 11 }}>{format(d.value)}</T>
            <View style={{ width: '100%', height: h, borderTopLeftRadius: 6, borderTopRightRadius: 6, backgroundColor: colors.primary, opacity }} />
            <T v="bodySm" color={d.highlight ? colors.onSurface : colors.textMuted} style={{ fontSize: 11 }} numberOfLines={1}>{d.label}</T>
          </View>
        );
      })}
    </View>
  );
}

/** Linha com área preenchida + linha de meta opcional (evolução de peso). */
export function LineChart({ values, labels, width, height = 140, target }: { values: number[]; labels?: string[]; width: number; height?: number; target?: number }) {
  if (values.length < 2) return null;
  const all = target != null ? [...values, target] : values;
  const min = Math.min(...all) - 0.5;
  const max = Math.max(...all) + 0.5;
  const pad = 8;
  const x = (i: number) => pad + (i / (values.length - 1)) * (width - pad * 2);
  const y = (v: number) => pad + (1 - (v - min) / (max - min)) * (height - pad * 2);
  const line = values.map((v, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(' ');
  const area = `${line} L${x(values.length - 1)},${height} L${x(0)},${height} Z`;
  return (
    <View>
      <Svg width={width} height={height}>
        <Defs>
          <LinearGradient id="area" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={colors.primary} stopOpacity="0.35" />
            <Stop offset="1" stopColor={colors.primary} stopOpacity="0" />
          </LinearGradient>
        </Defs>
        {target != null && <Line x1={pad} x2={width - pad} y1={y(target)} y2={y(target)} stroke={colors.success} strokeDasharray="4 4" strokeWidth={1.5} />}
        <Path d={area} fill="url(#area)" />
        <Path d={line} stroke={colors.primary} strokeWidth={2.5} fill="none" strokeLinejoin="round" />
        <Dot cx={x(values.length - 1)} cy={y(values.at(-1)!)} r={5} fill={colors.primary} stroke={colors.bg} strokeWidth={2} />
      </Svg>
      {labels && (
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 }}>
          {labels.map((l, i) => <T key={i} v="bodySm" color={colors.textMuted} style={{ fontSize: 10 }}>{l}</T>)}
        </View>
      )}
    </View>
  );
}
