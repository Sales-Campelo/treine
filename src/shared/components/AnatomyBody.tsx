/**
 * Silhueta anatômica estilizada (frente/costas) — cada grupo muscular é uma forma SVG tocável,
 * colorida pela função `colorFor` (fadiga) e realçada quando selecionada.
 */
import React from 'react';
import { View } from 'react-native';
import Svg, { Circle, Ellipse, G, Path, Rect } from 'react-native-svg';
import { BodyView, MuscleId } from '../../core/domain/types';
import { colors, fatigueColors } from '../../core/theme/tokens';

type Shape =
  | { kind: 'ellipse'; cx: number; cy: number; rx: number; ry: number }
  | { kind: 'rect'; x: number; y: number; w: number; h: number; r?: number }
  | { kind: 'path'; d: string };

const mirror = (s: Shape): Shape => {
  if (s.kind === 'ellipse') return { ...s, cx: 100 - s.cx };
  if (s.kind === 'rect') return { ...s, x: 100 - s.x - s.w };
  // espelha path de pares "x,y"
  return { kind: 'path', d: s.d.replace(/(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/g, (_, x, y) => `${100 - Number(x)},${y}`) };
};
const pair = (s: Shape): Shape[] => [s, mirror(s)];

const FRONT: [MuscleId, Shape[]][] = [
  ['traps', [{ kind: 'path', d: 'M42,29 L58,29 L64,35 L36,35 Z' }]],
  ['side_delts', pair({ kind: 'ellipse', cx: 26, cy: 43, rx: 4.5, ry: 7 })],
  ['front_delts', pair({ kind: 'ellipse', cx: 32.5, cy: 40, rx: 6, ry: 6.5 })],
  ['chest', pair({ kind: 'rect', x: 36, y: 37, w: 13.5, h: 15, r: 5 })],
  ['biceps', pair({ kind: 'ellipse', cx: 25, cy: 60, rx: 5, ry: 10 })],
  ['forearms', pair({ kind: 'ellipse', cx: 21.5, cy: 84, rx: 4.5, ry: 11 })],
  ['obliques', pair({ kind: 'rect', x: 36.5, y: 56, w: 5.5, h: 28, r: 2.5 })],
  ['abs', [0, 1, 2].flatMap((i) => pair({ kind: 'rect', x: 43.5, y: 55 + i * 10.5, w: 6, h: 9, r: 2 }))],
  ['quads', pair({ kind: 'ellipse', cx: 40.5, cy: 124, rx: 7.5, ry: 22 })],
  ['adductors', pair({ kind: 'path', d: 'M47,106 Q49.5,108 49.5,114 L48.5,134 Q46.5,128 46,118 Z' })],
  ['calves', pair({ kind: 'ellipse', cx: 40.5, cy: 172, rx: 5, ry: 15 })],
];

const BACK: [MuscleId, Shape[]][] = [
  ['traps', [{ kind: 'path', d: 'M50,26 L63,33 L56,44 L44,44 L37,33 Z' }]],
  ['rear_delts', pair({ kind: 'ellipse', cx: 29.5, cy: 40, rx: 6.5, ry: 6.5 })],
  ['side_delts', pair({ kind: 'ellipse', cx: 24.5, cy: 44, rx: 3.5, ry: 6 })],
  ['upper_back', pair({ kind: 'rect', x: 38, y: 44, w: 11, h: 10, r: 3 })],
  ['lats', pair({ kind: 'path', d: 'M36,50 L48,56 L48,80 L39,72 Q35,62 36,50 Z' })],
  ['triceps', pair({ kind: 'ellipse', cx: 25, cy: 60, rx: 5, ry: 10 })],
  ['forearms', pair({ kind: 'ellipse', cx: 21.5, cy: 84, rx: 4.5, ry: 11 })],
  ['lower_back', [{ kind: 'rect', x: 43, y: 81, w: 14, h: 13, r: 3 }]],
  ['glutes', pair({ kind: 'ellipse', cx: 43, cy: 105, rx: 8, ry: 9 })],
  ['hamstrings', pair({ kind: 'ellipse', cx: 41.5, cy: 133, rx: 7.5, ry: 18 })],
  ['calves', pair({ kind: 'ellipse', cx: 40.5, cy: 172, rx: 5.5, ry: 15 })],
];

function Base() {
  const c = fatigueColors.idle;
  return (
    <G fill={c}>
      <Circle cx={50} cy={14} r={9} />
      <Rect x={46} y={22} width={8} height={8} rx={2} />
      <Path d="M34,32 L66,32 Q70,34 70,40 L64,98 L36,98 L30,40 Q30,34 34,32 Z" opacity={0.55} />
      {pair({ kind: 'ellipse', cx: 20, cy: 99, rx: 3.5, ry: 5 }).map((s, i) => <ShapeEl key={i} s={s} />)}
      {pair({ kind: 'ellipse', cx: 41.5, cy: 149, rx: 4.5, ry: 4 }).map((s, i) => <ShapeEl key={`k${i}`} s={s} />)}
      {pair({ kind: 'ellipse', cx: 40.5, cy: 191, rx: 5, ry: 3 }).map((s, i) => <ShapeEl key={`f${i}`} s={s} />)}
    </G>
  );
}

function ShapeEl({ s, ...props }: { s: Shape; [k: string]: unknown }) {
  if (s.kind === 'ellipse') return <Ellipse cx={s.cx} cy={s.cy} rx={s.rx} ry={s.ry} {...props} />;
  if (s.kind === 'rect') return <Rect x={s.x} y={s.y} width={s.w} height={s.h} rx={s.r ?? 0} {...props} />;
  return <Path d={s.d} {...props} />;
}

export function AnatomyBody({
  view, colorFor, selected, onSelect, width = 140,
}: {
  view: BodyView;
  colorFor: (m: MuscleId) => string;
  selected?: MuscleId | null;
  onSelect?: (m: MuscleId) => void;
  width?: number;
}) {
  const shapes = view === 'front' ? FRONT : BACK;
  return (
    <View style={{ width, aspectRatio: 100 / 200 }}>
      <Svg viewBox="0 0 100 200" width="100%" height="100%">
        <Base />
        {shapes.map(([m, list]) => (
          <G key={m} onPress={onSelect ? () => onSelect(m) : undefined}>
            {list.map((s, i) => (
              <ShapeEl
                key={i}
                s={s}
                fill={colorFor(m)}
                stroke={selected === m ? colors.white : colors.bg}
                strokeWidth={selected === m ? 1.4 : 0.8}
              />
            ))}
          </G>
        ))}
      </Svg>
    </View>
  );
}
