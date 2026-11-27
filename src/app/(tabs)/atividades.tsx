import React, { useMemo, useState } from 'react';
import { View } from 'react-native';
import { getExercise } from '../../core/catalog/exercises';
import { MUSCLE_FAMILIES, MUSCLES } from '../../core/catalog/muscles';
import { MuscleId, Session } from '../../core/domain/types';
import { latestWeight, useApp } from '../../core/store/appStore';
import { colors, fatigueColors, radius, space } from '../../core/theme/tokens';
import { hhmm, kg, MONTHS, sameDay, startOfDay } from '../../core/utils/format';
import { computeFatigue, FATIGUE_STATE_LABEL, FatigueState, MuscleFatigue } from '../../features/fatigue/fatigue';
import { AnatomyBody } from '../../shared/components/AnatomyBody';
import { BarChart } from '../../shared/components/charts';
import { MonthCalendar } from '../../shared/components/MonthCalendar';
import { SessionRow } from '../../features/workouts/SessionRow';
import { EmptyState, Screen, TabHeader } from '../../shared/components/Screen';
import { Badge, Card, Icon, IconButton, Segmented, T, styles } from '../../shared/components/ui';

export default function Atividades() {
  const [tab, setTab] = useState<'activity' | 'history'>('activity');
  return (
    <Screen header={<TabHeader title="Atividades" />}>
      <Segmented value={tab} onChange={setTab} options={[{ key: 'activity', label: 'Atividades' }, { key: 'history', label: 'Histórico' }]} style={{ marginBottom: space.lg }} />
      {tab === 'activity' ? <Activity /> : <History />}
    </Screen>
  );
}

// ------------------------------------------------------------------ Fadiga
function Activity() {
  const sessions = useApp((s) => s.sessions);
  const measurements = useApp((s) => s.measurements);
  const [selected, setSelected] = useState<MuscleId | null>(null);
  const [now] = useState(() => Date.now());
  const fatigue = useMemo(() => computeFatigue(sessions, latestWeight(measurements), now), [sessions, measurements, now]);
  const ranked = Object.values(fatigue).filter((f) => f.pct >= 5).sort((a, b) => b.pct - a.pct);
  const critical = ranked.filter((f) => f.pct >= 80);
  const fresh = Object.values(fatigue).filter((f) => f.state === 'recovered').map((f) => MUSCLES[f.muscle].region);
  const freshRegion = fresh.filter((r) => r === 'lower').length >= 3 ? 'Membros Inferiores & Core' : fresh.filter((r) => r === 'upper').length >= 4 ? 'Membros Superiores' : 'mobilidade e cardio leve';
  const colorFor = (m: MuscleId) => fatigueColors[fatigue[m].state];
  const sel = selected ? fatigue[selected] : null;

  return (
    <View style={{ gap: space.lg }}>
      <Card style={[styles.row, { gap: 12, alignItems: 'flex-start' }]}>
        <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: colors.primaryTint, alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="lightbulb-on-outline" size={22} color={colors.primary} />
        </View>
        <View style={{ flex: 1, gap: 4 }}>
          <View style={styles.rowBetween}>
            <T v="labelMd" color={colors.primary}>KINETIC INSIGHT</T>
            <T v="bodySm" color={colors.textMuted}>● Tempo real</T>
          </View>
          <T v="bodyMd">
            {critical.length
              ? `${critical.slice(0, 2).map((f) => MUSCLES[f.muscle].name).join(' e ')} atingiram fadiga crítica (>80%). Recomendamos descanso ativo ou foco em ${freshRegion} no próximo treino.`
              : ranked.length
                ? `Nenhum músculo em fadiga crítica. ${MUSCLES[ranked[0].muscle].name} é o mais desgastado (${Math.round(ranked[0].pct)}%).`
                : 'Corpo totalmente recuperado — ótimo dia para um treino pesado!'}
          </T>
        </View>
      </Card>

      <Card style={{ gap: space.md }}>
        <View style={styles.rowBetween}>
          <View style={{ flex: 1 }}>
            <T v="headlineMd">Fadiga Muscular</T>
            <T v="bodySm" color={colors.textSubtle}>Toque em um músculo para ver o detalhe</T>
          </View>
          <Badge label={`Hoje, ${hhmm(now)}`} tone="muted" />
        </View>
        <View style={{ backgroundColor: colors.bgDeep, borderRadius: radius.lg, paddingVertical: space.md, flexDirection: 'row', justifyContent: 'space-around' }}>
          {(['front', 'back'] as const).map((view) => (
            <View key={view} style={{ alignItems: 'center', gap: 8 }}>
              <T v="labelMd" color={colors.textSubtle}>{view === 'front' ? 'ANTERIOR' : 'POSTERIOR'}</T>
              <AnatomyBody view={view} width={130} colorFor={colorFor} selected={selected} onSelect={(m) => setSelected(m === selected ? null : m)} />
            </View>
          ))}
        </View>
        <View style={[styles.row, { flexWrap: 'wrap', gap: 12 }]}>
          {(Object.keys(FATIGUE_STATE_LABEL) as FatigueState[]).map((s) => (
            <View key={s} style={[styles.row, { gap: 6 }]}>
              <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: fatigueColors[s] }} />
              <T v="bodySm" color={colors.textSubtle}>{FATIGUE_STATE_LABEL[s]}</T>
            </View>
          ))}
        </View>
        {sel && <FatigueRow f={sel} sessions={sessions} />}
      </Card>

      <View>
        <View style={[styles.rowBetween, { marginBottom: 12 }]}>
          <T v="headlineMd">Fadiga por Região</T>
          <T v="bodySm" color={colors.textMuted}>Tempo p/ recuperar</T>
        </View>
        <View style={{ gap: 10 }}>
          {ranked.length === 0 && <EmptyState icon="check-circle-outline" title="Tudo recuperado" text="Nenhum grupo muscular com fadiga relevante nos últimos 7 dias." />}
          {ranked.slice(0, 5).map((f) => <FatigueRow key={f.muscle} f={f} sessions={sessions} />)}
        </View>
      </View>

      <MonthlySummary sessions={sessions} />
    </View>
  );
}

function FatigueRow({ f, sessions }: { f: MuscleFatigue; sessions: Session[] }) {
  const color = fatigueColors[f.state];
  // Exercício que mais contribuiu na sessão mais recente que treinou o músculo.
  const cause = useMemo(() => {
    const s = sessions.find((x) => x.status === 'completed' && x.entries.some((e) => getExercise(e.exerciseId)?.muscles.some((m) => m.muscle === f.muscle && m.role === 'primary')));
    const ex = s?.entries.map((e) => getExercise(e.exerciseId)).find((e) => e?.muscles.some((m) => m.muscle === f.muscle && m.role === 'primary'));
    return ex?.name;
  }, [sessions, f.muscle]);
  return (
    <View style={{ backgroundColor: colors.surface, borderRadius: radius.lg, padding: space.md, gap: 8 }}>
      <View style={styles.rowBetween}>
        <View style={[styles.row, { gap: 8, flex: 1 }]}>
          <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: color }} />
          <T v="labelLg" style={{ fontSize: 15 }}>{MUSCLES[f.muscle].name}</T>
          <Badge label={FATIGUE_STATE_LABEL[f.state]} tone={f.state === 'fatigued' ? 'danger' : f.state === 'recovered' ? 'success' : 'muted'} />
        </View>
        <T v="headlineMd" color={color}>{Math.round(f.pct)}%</T>
      </View>
      <View style={{ height: 6, borderRadius: 3, backgroundColor: colors.surfaceHighest }}>
        <View style={{ width: `${f.pct}%`, height: '100%', borderRadius: 3, backgroundColor: color }} />
      </View>
      <View style={styles.rowBetween}>
        <T v="bodySm" color={colors.textSubtle} style={{ flex: 1 }} numberOfLines={1}>{cause ? `Último estímulo: ${cause}` : 'Sem estímulo recente'}</T>
        <View style={[styles.row, { gap: 4 }]}>
          <Icon name="circle-half-full" size={14} color={colors.textSubtle} />
          <T v="bodySm" color={colors.textSubtle}>{f.hoursToRecover > 0 ? `~${Math.ceil(f.hoursToRecover)}h restantes` : 'Pronto'}</T>
        </View>
      </View>
    </View>
  );
}

function MonthlySummary({ sessions }: { sessions: Session[] }) {
  const [offset, setOffset] = useState(0);
  const [base] = useState(() => Date.now());
  const ref = new Date(base);
  ref.setDate(1);
  ref.setMonth(ref.getMonth() + offset);
  const month = sessions.filter((s) => s.status === 'completed' && new Date(s.startedAt).getMonth() === ref.getMonth() && new Date(s.startedAt).getFullYear() === ref.getFullYear());
  const volume = month.reduce((a, s) => a + (s.summary.tonnageKg ?? 0), 0);
  const weeks = Math.max(1, new Date(ref.getFullYear(), ref.getMonth() + 1, 0).getDate() / 7);
  // Séries por família muscular (primários)
  const counts: Record<string, number> = {};
  for (const s of month) for (const e of s.entries) {
    const ex = getExercise(e.exerciseId);
    for (const m of ex?.muscles.filter((x) => x.role === 'primary') ?? []) {
      const fam = MUSCLE_FAMILIES.find((f) => f.muscles.includes(m.muscle));
      if (fam) counts[fam.name] = (counts[fam.name] ?? 0) + 1;
    }
  }
  const total = Object.values(counts).reduce((a, b) => a + b, 0) || 1;
  const data: { label: string; value: number; highlight?: boolean }[] = MUSCLE_FAMILIES.map((f) => ({ label: f.name, value: (100 * (counts[f.name] ?? 0)) / total }));
  const top = [...data].sort((a, b) => b.value - a.value)[0];
  data.forEach((d) => (d.highlight = d === top));

  return (
    <Card style={{ gap: space.md }}>
      <View style={styles.rowBetween}>
        <View>
          <T v="headlineMd">Resumo Mensal</T>
          <T v="bodySm" color={colors.textSubtle}>Volume de tonelagem e frequência</T>
        </View>
        <View style={[styles.row, { gap: 4 }]}>
          <IconButton icon="chevron-left" size={32} bg={colors.surfaceHigh} onPress={() => setOffset(offset - 1)} label="Mês anterior" />
          <T v="labelMd" style={{ width: 92, textAlign: 'center' }}>{MONTHS[ref.getMonth()]} {ref.getFullYear()}</T>
          <IconButton icon="chevron-right" size={32} bg={colors.surfaceHigh} onPress={() => setOffset(Math.min(0, offset + 1))} label="Próximo mês" />
        </View>
      </View>
      <View style={[styles.row, { gap: 8 }]}>
        <MiniBox label="Volume total" value={kg(volume)} />
        <MiniBox label="Treinos" value={String(month.length)} sub={`${(month.length / weeks).toFixed(1)} sessões/sem`} />
        <MiniBox label="Foco maior" value={top && top.value > 0 ? top.label : '—'} sub={top && top.value > 0 ? `${Math.round(top.value)}% das séries` : undefined} />
      </View>
      <T v="bodySm" color={colors.textSubtle}>Distribuição de esforço por grupo (séries efetivas)</T>
      <BarChart data={data} height={120} />
    </Card>
  );
}

function MiniBox({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <View style={{ flex: 1, backgroundColor: colors.surfaceHigh, borderRadius: radius.md, padding: 10, gap: 2 }}>
      <T v="bodySm" color={colors.textSubtle}>{label}</T>
      <T v="headlineMd" color={colors.primarySoft} numberOfLines={1}>{value}</T>
      {sub && <T v="bodySm" color={colors.textMuted} style={{ fontSize: 10 }}>{sub}</T>}
    </View>
  );
}

// ------------------------------------------------------------------ Histórico
function History() {
  const sessions = useApp((s) => s.sessions).filter((s) => s.status === 'completed');
  const schedule = useApp((s) => s.schedule);
  const [today] = useState(() => startOfDay(Date.now()));
  const [cursor, setCursor] = useState(() => ({ y: new Date(today).getFullYear(), m: new Date(today).getMonth() }));
  const [day, setDay] = useState<number | null>(null);
  const move = (delta: number) => {
    const d = new Date(cursor.y, cursor.m + delta, 1);
    setCursor({ y: d.getFullYear(), m: d.getMonth() });
    setDay(null);
  };
  const first = new Date(cursor.y, cursor.m, 1).getTime();
  const end = new Date(cursor.y, cursor.m + 1, 1).getTime();
  const isCurrent = cursor.y === new Date(today).getFullYear() && cursor.m === new Date(today).getMonth();
  const inMonth = sessions.filter((s) => s.startedAt >= first && s.startedAt < end);
  const list = day ? inMonth.filter((s) => sameDay(s.startedAt, day)) : inMonth;

  return (
    <View style={{ gap: space.lg }}>
      <MonthCalendar year={cursor.y} month={cursor.m} sessions={sessions} schedule={schedule} selected={day} today={today} onSelect={setDay} onPrev={() => move(-1)} onNext={() => move(1)} canNext={!isCurrent} />
      <View style={{ gap: 10 }}>
        <T v="headlineMd">{day ? new Date(day).toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' }) : `${inMonth.length} sessões no mês`}</T>
        {list.length === 0 && <EmptyState icon="calendar-blank-outline" title="Sem treinos" text="Nenhuma sessão registrada neste período." />}
        {list.map((s) => <SessionRow key={s.id} s={s} />)}
      </View>
    </View>
  );
}
