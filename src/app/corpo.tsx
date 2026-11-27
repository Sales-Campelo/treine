import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, useWindowDimensions, View } from 'react-native';
import { CIRCUMFERENCE_LABEL, CircumferenceKey } from '../core/domain/types';
import { useApp } from '../core/store/appStore';
import { colors, radius, space } from '../core/theme/tokens';
import { dateLong, MONTHS_SHORT, num } from '../core/utils/format';
import { uuid } from '../core/utils/id';
import { bmi, bmiCategory, deltas, fatCategory, idealRange } from '../features/body/metrics';
import { LineChart } from '../shared/components/charts';
import { Screen, StackHeader } from '../shared/components/Screen';
import { Badge, Card, Icon, IconButton, PillButton, SectionTitle, Segmented, Stepper, T, styles } from '../shared/components/ui';

export default function Corpo() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { profile, measurements, addMeasurement } = useApp();
  const { last, prev, weight30, fat30 } = deltas(measurements);
  const [draft, setDraft] = useState(() => ({
    weightKg: last?.weightKg ?? 80,
    bodyFatPct: last?.bodyFatPct ?? 15,
    muscleMassKg: last?.muscleMassKg ?? 38,
    circumferences: { ...(last?.circumferences ?? {}) } as Partial<Record<CircumferenceKey, number>>,
  }));
  const [tab, setTab] = useState<'bio' | 'tape'>('bio');
  const [range, setRange] = useState<'1m' | '3m' | 'all'>('3m');
  const [now] = useState(() => Date.now());
  const dirty =
    draft.weightKg !== last?.weightKg || draft.bodyFatPct !== last?.bodyFatPct || draft.muscleMassKg !== last?.muscleMassKg ||
    JSON.stringify(draft.circumferences) !== JSON.stringify(last?.circumferences ?? {});

  const save = () => {
    addMeasurement({ id: uuid(), measuredAt: Date.now(), ...draft });
    router.back();
  };

  const imc = bmi(draft.weightKg, profile.heightCm);
  const [lo, hi] = idealRange(profile.heightCm);
  const fatCat = fatCategory(draft.bodyFatPct, profile.sex);
  const lean = draft.weightKg * (1 - draft.bodyFatPct / 100);
  const toGoal = draft.weightKg - profile.targetWeightKg;
  const since = range === '1m' ? 31 : range === '3m' ? 92 : 3650;
  const series = measurements.filter((m) => now - m.measuredAt <= since * 86_400_000);
  const chartW = Math.min(width, 520) - space.margin * 2 - space.md * 2;

  return (
    <Screen
      tabBar={false}
      footer={
        dirty ? (
          <View style={{ position: 'absolute', left: space.margin, right: space.margin, bottom: 24 }}>
            <PillButton label="Salvar e Atualizar Perfil" icon="check-circle-outline" onPress={save} />
          </View>
        ) : undefined
      }
      header={<StackHeader icon="close" title="Biometria & Medidas" right={<IconButton icon="content-save-outline" bg={dirty ? colors.primary : colors.surface} color={dirty ? colors.bg : colors.textMuted} onPress={dirty ? save : undefined} label="Salvar" />} />}
    >
      <Card style={{ gap: 6, marginVertical: space.md }}>
        <View style={[styles.row, { gap: 6 }]}>
          <Icon name="calendar-blank-outline" size={16} color={colors.primary} />
          <T v="labelMd" color={colors.primary}>Última avaliação: {last ? dateLong(last.measuredAt) : '—'}</T>
        </View>
        <T v="headlineMd">{profile.name}</T>
        <T v="bodySm" color={colors.textSubtle}>{measurements.length} avaliações registradas • altura {num(profile.heightCm)} cm</T>
      </Card>

      <Segmented value={tab} onChange={setTab} options={[{ key: 'bio', label: 'Bioimpedância', icon: 'chart-donut' }, { key: 'tape', label: 'Fita métrica', icon: 'tape-measure' }]} style={{ marginBottom: space.lg }} />

      {tab === 'bio' ? (
        <>
          <SectionTitle title="Composição Corporal" right={<T v="labelMd" color={colors.primary}>Delta 30 dias</T>} />
          <Card style={{ gap: 10, marginBottom: 12 }}>
            <View style={styles.rowBetween}>
              <T v="labelLg" color={colors.textSubtle}>Peso corporal total</T>
              {weight30 !== 0 && <Badge label={`${weight30 > 0 ? '↗ +' : '↘ '}${num(weight30, 1)} kg`} tone={weight30 > 0 ? 'success' : 'primary'} />}
            </View>
            <View style={styles.rowBetween}>
              <T v="metric">{num(draft.weightKg, 1)}<T v="headlineMd" color={colors.textMuted}> kg</T></T>
              <Stepper value={draft.weightKg} step={0.1} min={30} format={() => '0.1'} onChange={(v) => setDraft({ ...draft, weightKg: v })} />
            </View>
            <View style={{ gap: 6 }}>
              <View style={styles.rowBetween}>
                <T v="bodySm" color={colors.textSubtle}>Meta {num(profile.targetWeightKg, 1)} kg</T>
                <T v="bodySm" color={colors.primary}>{Math.abs(toGoal) < 0.1 ? 'Meta atingida 🎯' : `${toGoal > 0 ? 'faltam −' : 'faltam +'}${num(Math.abs(toGoal), 1)} kg`}</T>
              </View>
              <RangeBar min={lo - 10} max={hi + 10} bandLo={lo} bandHi={hi} value={draft.weightKg} target={profile.targetWeightKg} />
              <T v="bodySm" color={colors.textMuted}>Faixa de peso ideal (IMC 18,5–24,9): {num(lo, 1)}–{num(hi, 1)} kg</T>
            </View>
          </Card>

          <Card style={{ gap: 10, marginBottom: 12 }}>
            <View style={styles.rowBetween}>
              <T v="labelLg" color={colors.textSubtle}>Percentual de gordura (BF)</T>
              {fat30 !== 0 && <Badge label={`${fat30 > 0 ? '↗ +' : '↘ '}${num(fat30, 1)}%`} tone={fat30 > 0 ? 'danger' : 'success'} />}
            </View>
            <View style={styles.rowBetween}>
              <T v="metricSm" color={colors.primary}>{num(draft.bodyFatPct, 1)} %</T>
              <Stepper value={draft.bodyFatPct} step={0.1} min={3} format={(v) => num(v, 1)} onChange={(v) => setDraft({ ...draft, bodyFatPct: v })} />
            </View>
            <View style={{ flexDirection: 'row', height: 8, borderRadius: 4, overflow: 'hidden' }}>
              {['#3b82c4', colors.primary, colors.success, '#8a5a2b'].map((c) => <View key={c} style={{ flex: 1, backgroundColor: c }} />)}
            </View>
            <View style={styles.rowBetween}>
              <T v="bodySm" color={colors.textMuted}>Essencial</T>
              <T v="bodySm" color={colors.onSurface}>Categoria: {fatCat}</T>
              <T v="bodySm" color={colors.textMuted}>Média+</T>
            </View>
          </Card>

          <View style={[styles.row, { gap: 10, marginBottom: 12 }]}>
            <Card style={{ flex: 1, gap: 4 }}>
              <T v="bodySm" color={colors.textSubtle}>Massa muscular</T>
              <T v="headlineLg">{num(draft.muscleMassKg, 1)} <T v="bodyMd" color={colors.textMuted}>kg</T></T>
              <Stepper value={draft.muscleMassKg} step={0.1} min={10} format={() => ''} onChange={(v) => setDraft({ ...draft, muscleMassKg: v })} />
            </Card>
            <Card style={{ flex: 1, gap: 4 }}>
              <T v="bodySm" color={colors.textSubtle}>Massa livre de gordura</T>
              <T v="headlineLg">{num(lean, 1)} <T v="bodyMd" color={colors.textMuted}>kg</T></T>
              <T v="bodySm" color={colors.primary}>{num((lean / draft.weightKg) * 100, 1)}% do total</T>
              <T v="bodySm" color={colors.textMuted}>IMC {num(imc, 1)} • {bmiCategory(imc)}</T>
            </Card>
          </View>

          <SectionTitle title="Evolução do peso" style={{ marginTop: space.md }} />
          <Card style={{ gap: 12, marginBottom: space.lg }}>
            <Segmented value={range} onChange={setRange} options={[{ key: '1m', label: '1 mês' }, { key: '3m', label: '3 meses' }, { key: 'all', label: 'Tudo' }]} />
            {series.length >= 2 ? (
              <LineChart
                width={chartW}
                values={series.map((m) => m.weightKg)}
                target={profile.targetWeightKg}
                labels={[series[0], series[Math.floor(series.length / 2)], series.at(-1)!].map((m) => `${new Date(m.measuredAt).getDate()} ${MONTHS_SHORT[new Date(m.measuredAt).getMonth()]}`)}
              />
            ) : (
              <T color={colors.textMuted}>Registre ao menos duas avaliações para ver o gráfico.</T>
            )}
            <View style={[styles.row, { gap: 6 }]}>
              <View style={{ width: 14, height: 2, backgroundColor: colors.success }} />
              <T v="bodySm" color={colors.textMuted}>Meta {num(profile.targetWeightKg, 1)} kg</T>
            </View>
          </Card>
        </>
      ) : (
        <>
          <SectionTitle title="Circunferências (cm)" />
          <View style={{ gap: 8, marginBottom: space.lg }}>
            {(Object.keys(CIRCUMFERENCE_LABEL) as CircumferenceKey[]).map((k) => {
              const v = draft.circumferences[k] ?? 0;
              // Sem edição: variação última vs. penúltima avaliação. Editando: variação vs. última.
              const lastV = last?.circumferences[k];
              const prevV = prev?.circumferences[k];
              const shownDelta = lastV == null ? 0 : v !== lastV ? v - lastV : prevV != null ? lastV - prevV : 0;
              return (
                <View key={k} style={[styles.rowBetween, { backgroundColor: colors.surface, borderRadius: radius.md, paddingHorizontal: 14, paddingVertical: 10 }]}>
                  <View style={{ flex: 1 }}>
                    <T v="labelLg">{CIRCUMFERENCE_LABEL[k]}</T>
                    <T v="bodySm" color={shownDelta > 0 ? colors.success : shownDelta < 0 ? colors.primary : colors.textMuted}>
                      {shownDelta === 0 ? '0,0 cm' : `${shownDelta > 0 ? '+' : ''}${num(shownDelta, 1)} cm`}
                    </T>
                  </View>
                  <View style={[styles.row, { gap: 8 }]}>
                    <IconButton icon="minus" size={32} bg={colors.surfaceHighest} onPress={() => setDraft({ ...draft, circumferences: { ...draft.circumferences, [k]: +(v - 0.5).toFixed(1) } })} label={`Diminuir ${CIRCUMFERENCE_LABEL[k]}`} />
                    <T v="headlineMd" style={{ width: 64, textAlign: 'center', fontVariant: ['tabular-nums'] }}>{num(v, 1)}</T>
                    <IconButton icon="plus" size={32} bg={colors.surfaceHighest} onPress={() => setDraft({ ...draft, circumferences: { ...draft.circumferences, [k]: +(v + 0.5).toFixed(1) } })} label={`Aumentar ${CIRCUMFERENCE_LABEL[k]}`} />
                  </View>
                </View>
              );
            })}
          </View>
        </>
      )}
      <Pressable onPress={() => router.back()} style={{ alignItems: 'center', padding: 12 }}>
        <T v="labelLg" color={colors.textSubtle}>Cancelar</T>
      </Pressable>
    </Screen>
  );
}

function RangeBar({ min, max, bandLo, bandHi, value, target }: { min: number; max: number; bandLo: number; bandHi: number; value: number; target: number }) {
  const pos = (v: number) => `${Math.max(0, Math.min(1, (v - min) / (max - min))) * 100}%` as const;
  return (
    <View style={{ height: 14, justifyContent: 'center' }}>
      <View style={{ height: 6, borderRadius: 3, backgroundColor: colors.surfaceHighest }} />
      <View style={{ position: 'absolute', left: pos(bandLo), width: `${((bandHi - bandLo) / (max - min)) * 100}%`, height: 6, borderRadius: 3, backgroundColor: colors.successSoft, borderWidth: 1, borderColor: colors.success }} />
      <View style={{ position: 'absolute', left: pos(target), width: 2, height: 14, marginLeft: -1, backgroundColor: colors.success }} />
      <View style={{ position: 'absolute', left: pos(value), width: 14, height: 14, marginLeft: -7, borderRadius: 7, backgroundColor: colors.primary, borderWidth: 2, borderColor: colors.bg }} />
    </View>
  );
}
