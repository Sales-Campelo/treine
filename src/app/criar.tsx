import { useRouter } from 'expo-router';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, TextInput, View } from 'react-native';
import { getExercise } from '../core/catalog/exercises';
import { filterExercises, GroupChips, hasGroups, ShowMore, usePaged } from '../features/catalog/catalogFilter';
import { ExerciseThumb } from '../shared/components/ExerciseAnimation';
import { LEVEL_LABEL, MODALITY_LABEL, Modality, RoutineItem, STRENGTH_GROUP_LABEL, StrengthGroup } from '../core/domain/types';
import { useApp } from '../core/store/appStore';
import { colors, radius, space } from '../core/theme/tokens';
import { uuid } from '../core/utils/id';
import { quickItemsFor } from '../features/player/engine/plans';
import { describeRx } from '../features/workouts/describe';
import { Screen, StackHeader } from '../shared/components/Screen';
import { Badge, Card, Icon, IconButton, MODALITY_ICON, PillButton, SectionTitle, Segmented, Stepper, T, styles } from '../shared/components/ui';

/** Remove circuitos com menos de 2 itens consecutivos. */
function normalizeCircuits(items: RoutineItem[]): RoutineItem[] {
  return items.map((it, i) => {
    if (!it.circuit) return it;
    const prevSame = items[i - 1]?.circuit?.id === it.circuit.id;
    const nextSame = items[i + 1]?.circuit?.id === it.circuit.id;
    if (prevSame || nextSame) return it;
    const { circuit: _drop, ...rest } = it;
    void _drop;
    return rest;
  });
}

/**
 * Construtor de treinos: o catálogo filtra por modalidade, mas a lista montada é única —
 * dá para misturar Supino + Barra fixa + Rounds de boxe na mesma ficha (híbrida).
 * Exercícios de calistenia consecutivos podem ser unidos em um ciclo (circuito).
 */
export default function Criar() {
  const router = useRouter();
  const defaultRest = useApp((s) => s.profile.prefs.defaultRestS);
  const [name, setName] = useState('');
  const [filter, setFilter] = useState<Modality>('strength');
  const [items, setItems] = useState<RoutineItem[]>([]);
  const [toast, setToast] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [group, setGroup] = useState<StrengthGroup | null>(null);
  const catalog = useMemo(
    () => filterExercises({ q: search, modality: filter, group: hasGroups(filter) ? group : null }),
    [search, filter, group],
  );
  const page = usePaged(catalog, [search, filter, group].join('|'));
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (toastTimer.current) clearTimeout(toastTimer.current); }, []);

  const kinds = new Set(items.map((i) => i.prescription.kind));
  const isHybrid = kinds.size > 1;

  const add = (exerciseId: string) => {
    const it = quickItemsFor(exerciseId)[0];
    if (it.prescription.kind === 'strength') it.prescription.sets.forEach((s) => (s.restS = defaultRest));
    setItems((xs) => [...xs, { ...it, id: uuid() }]);
    setToast(`${getExercise(exerciseId)?.name} adicionado`);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 1600);
  };
  const patch = (i: number, fn: (it: RoutineItem) => RoutineItem) => setItems((xs) => xs.map((it, j) => (j === i ? fn(it) : it)));
  const remove = (i: number) => setItems((xs) => normalizeCircuits(xs.filter((_, j) => j !== i)));
  const move = (i: number, d: -1 | 1) =>
    setItems((xs) => {
      const j = i + d;
      if (j < 0 || j >= xs.length) return xs;
      const next = [...xs];
      [next[i], next[j]] = [next[j], next[i]];
      return normalizeCircuits(next);
    });

  /** Une o item i ao anterior (mesmo ciclo) ou separa. */
  const toggleLink = (i: number) =>
    setItems((xs) => {
      const prev = xs[i - 1];
      const cur = xs[i];
      const linked = !!prev.circuit && prev.circuit.id === cur.circuit?.id;
      let next: RoutineItem[];
      if (linked) {
        // separa: i e os seguintes do mesmo ciclo ganham um novo id
        const oldId = cur.circuit!.id;
        const newId = uuid();
        let k = i;
        next = [...xs];
        while (k < next.length && next[k].circuit?.id === oldId) {
          next[k] = { ...next[k], circuit: { ...next[k].circuit!, id: newId } };
          k++;
        }
      } else {
        const group = prev.circuit ?? { id: uuid(), rounds: 3, restS: 90 };
        next = xs.map((it, j) => (j === i - 1 || j === i || (cur.circuit && it.circuit?.id === cur.circuit.id) ? { ...it, circuit: group } : it));
      }
      return normalizeCircuits(next);
    });
  const setCircuitGroup = (id: string, p: { rounds?: number; restS?: number }) =>
    setItems((xs) => xs.map((it) => (it.circuit?.id === id ? { ...it, circuit: { ...it.circuit, ...p } } : it)));

  const save = () => {
    const id = uuid();
    const first = items[0].prescription.kind;
    const minutes = items.reduce((a, it) => {
      const rx = it.prescription;
      if (rx.kind === 'martial') return a + (rx.rounds * (rx.workS + rx.restS)) / 60;
      if (it.circuit) return a + 1.5 * it.circuit.rounds + it.circuit.restS / 60;
      return a + rx.sets.length * 2.5;
    }, 0);
    useApp.getState().upsertRoutine({
      id,
      name: name.trim() || (isHybrid ? 'Meu treino híbrido' : `Meu treino de ${MODALITY_LABEL[first]}`),
      modality: first,
      isHybrid,
      goal: isHybrid ? 'conditioning' : first === 'martial' ? 'conditioning' : first === 'calisthenics' ? 'skill' : 'hypertrophy',
      tag: isHybrid ? 'Híbrido' : 'Personalizado',
      description: `${items.length} exercício(s) • ${[...kinds].map((k) => MODALITY_LABEL[k]).join(' + ')}`,
      days: [{ id: uuid(), name: name.trim() || 'Treino A', estMinutes: Math.max(10, Math.round(minutes)), items }],
    });
    router.replace({ pathname: '/treino/[routineId]', params: { routineId: id } });
  };

  const countOf = (exId: string) => items.filter((i) => i.exerciseId === exId).length;

  return (
    <Screen
      tabBar={false}
      header={<StackHeader title="Criar Novo Treino" kicker={isHybrid ? 'HÍBRIDO' : 'PERSONALIZADO'} />}
      footer={
        <View style={{ position: 'absolute', left: space.margin, right: space.margin, bottom: 24, gap: 8 }}>
          {toast && (
            <View style={[styles.row, { alignSelf: 'center', gap: 6, backgroundColor: colors.surfaceHighest, paddingHorizontal: 14, paddingVertical: 8, borderRadius: radius.full }]}>
              <Icon name="check-circle" size={16} color={colors.success} />
              <T v="labelMd">{toast}</T>
            </View>
          )}
          <PillButton label={items.length ? `Salvar Treino (${items.length})` : 'Adicione exercícios'} icon="content-save-outline" onPress={save} disabled={items.length === 0} />
        </View>
      }
    >
      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="Nome do treino (ex.: Push Day)"
        placeholderTextColor={colors.textMuted}
        style={{ backgroundColor: colors.surface, color: colors.onSurface, borderRadius: radius.md, padding: 16, fontSize: 16, marginVertical: space.md, borderWidth: 1, borderColor: colors.border }}
      />

      <SectionTitle
        title={`Seu treino (${items.length})`}
        right={isHybrid ? <Badge label="Híbrido" tone="primary" /> : undefined}
      />
      <View style={{ gap: 6, marginBottom: space.lg }}>
        {items.length === 0 && <T color={colors.textMuted}>Toque em “+ Adicionar” no catálogo abaixo. Você pode misturar modalidades.</T>}
        {items.map((it, i) => {
          const ex = getExercise(it.exerciseId);
          const rx = it.prescription;
          const prev = items[i - 1];
          const canLink = i > 0 && rx.kind === 'calisthenics' && prev.prescription.kind === 'calisthenics';
          const linked = canLink && !!prev.circuit && prev.circuit.id === it.circuit?.id;
          const groupStart = it.circuit && !linked;
          return (
            <View key={it.id} style={{ gap: 6 }}>
              {canLink && (
                <Pressable onPress={() => toggleLink(i)} style={[styles.row, { gap: 6, alignSelf: 'center', paddingHorizontal: 12, paddingVertical: 6, borderRadius: radius.full, backgroundColor: linked ? colors.primaryTint : 'transparent', borderWidth: 1, borderColor: linked ? colors.primary : colors.surfaceHighest }]}>
                  <Icon name={linked ? 'link-variant' : 'link-variant-plus'} size={16} color={linked ? colors.primary : colors.textMuted} />
                  <T v="labelMd" color={linked ? colors.primary : colors.textMuted}>{linked ? 'No mesmo ciclo • toque para separar' : 'Unir em circuito'}</T>
                </Pressable>
              )}
              {groupStart && it.circuit && (
                <View style={{ backgroundColor: colors.primaryTint, borderRadius: radius.md, padding: 12, gap: 8 }}>
                  <View style={[styles.row, { gap: 6 }]}>
                    <Icon name="sync" size={18} color={colors.primary} />
                    <T v="labelLg" color={colors.primary}>Ciclo — exercícios em sequência, descanso só no fim da volta</T>
                  </View>
                  <View style={[styles.row, { justifyContent: 'space-around' }]}>
                    <Stepper compact label="Voltas" value={it.circuit.rounds} min={1} onChange={(r) => setCircuitGroup(it.circuit!.id, { rounds: r })} />
                    <Stepper compact label="Descanso no fim" value={it.circuit.restS} min={0} step={15} format={(v) => `${v}s`} onChange={(r) => setCircuitGroup(it.circuit!.id, { restS: r })} />
                  </View>
                </View>
              )}
              <Card style={{ gap: 10, borderColor: it.circuit ? colors.primary : colors.border }}>
                <View style={[styles.row, { gap: 10 }]}>
                  <View style={{ width: 36, height: 36, borderRadius: radius.md, backgroundColor: colors.surfaceHigh, alignItems: 'center', justifyContent: 'center' }}>
                    <Icon name={MODALITY_ICON[rx.kind]} size={18} color={colors.primarySoft} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <T v="labelLg" numberOfLines={1}>{i + 1}. {ex?.name}</T>
                    <T v="bodySm" color={colors.textMuted} numberOfLines={1}>{it.circuit ? `Ciclo • ${it.circuit.rounds} voltas` : describeRx(it)}</T>
                  </View>
                  <IconButton icon="chevron-up" size={32} bg={colors.surfaceHigh} onPress={() => move(i, -1)} label="Subir" />
                  <IconButton icon="chevron-down" size={32} bg={colors.surfaceHigh} onPress={() => move(i, 1)} label="Descer" />
                  <IconButton icon="delete-outline" size={32} bg={colors.surfaceHigh} color={colors.danger} onPress={() => remove(i)} label="Remover" />
                </View>
                {rx.kind === 'strength' && (
                  <View style={[styles.row, { justifyContent: 'space-between' }]}>
                    <Stepper compact label="Séries" value={rx.sets.length} min={1} onChange={(n) => patch(i, (x) => ({ ...x, prescription: { ...rx, sets: Array.from({ length: n }, (_, k) => rx.sets[k] ?? rx.sets[0]) } }))} />
                    <Stepper compact label="Reps" value={rx.sets[0].reps} min={1} onChange={(r) => patch(i, (x) => ({ ...x, prescription: { ...rx, sets: rx.sets.map((s) => ({ ...s, reps: r })) } }))} />
                    <Stepper compact label="kg" value={rx.sets[0].kg} min={0} step={2.5} onChange={(k) => patch(i, (x) => ({ ...x, prescription: { ...rx, sets: rx.sets.map((s) => ({ ...s, kg: k })) } }))} />
                  </View>
                )}
                {rx.kind === 'martial' && (
                  <View style={[styles.row, { justifyContent: 'space-around' }]}>
                    <Stepper compact label="Rounds" value={rx.rounds} min={1} onChange={(r) => patch(i, (x) => ({ ...x, prescription: { ...rx, rounds: r } }))} />
                    <Stepper compact label="Min/round" value={rx.workS / 60} min={1} step={0.5} onChange={(m) => patch(i, (x) => ({ ...x, prescription: { ...rx, workS: Math.round(m * 60) } }))} />
                    <Stepper compact label="Descanso" value={rx.restS} min={0} step={15} format={(v) => `${v}s`} onChange={(r) => patch(i, (x) => ({ ...x, prescription: { ...rx, restS: r } }))} />
                  </View>
                )}
                {rx.kind === 'calisthenics' && (
                  <View style={[styles.row, { justifyContent: 'space-around' }]}>
                    {!it.circuit && <Stepper compact label="Séries" value={rx.sets.length} min={1} onChange={(n) => patch(i, (x) => ({ ...x, prescription: { ...rx, sets: Array.from({ length: n }, (_, k) => rx.sets[k] ?? rx.sets[0]) } }))} />}
                    {rx.sets[0].mode === 'hold'
                      ? <Stepper compact label="Hold (s)" value={rx.sets[0].targetS ?? 20} min={5} step={5} onChange={(t) => patch(i, (x) => ({ ...x, prescription: { ...rx, sets: rx.sets.map((s) => ({ ...s, targetS: t })) } }))} />
                      : <Stepper compact label="Reps" value={rx.sets[0].reps ?? 8} min={1} onChange={(r) => patch(i, (x) => ({ ...x, prescription: { ...rx, sets: rx.sets.map((s) => ({ ...s, reps: r })) } }))} />}
                  </View>
                )}
              </Card>
            </View>
          );
        })}
      </View>

      <SectionTitle title="Catálogo" />
      <Segmented
        value={filter}
        onChange={(f) => { setFilter(f); setGroup(null); }}
        options={(['strength', 'martial', 'calisthenics'] as Modality[]).map((m) => ({ key: m, label: MODALITY_LABEL[m].split(' ')[0], icon: MODALITY_ICON[m] }))}
        style={{ marginBottom: space.md }}
      />
      <View style={[styles.row, { gap: 8, backgroundColor: colors.surface, borderRadius: radius.full, paddingHorizontal: 16, height: 46, marginBottom: 10 }]}>
        <Icon name="magnify" size={20} color={colors.textMuted} />
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Buscar no catálogo (ex.: smith, polia, supino)"
          placeholderTextColor={colors.textMuted}
          style={{ flex: 1, color: colors.onSurface, fontSize: 14 }}
        />
        {!!search && <IconButton icon="close-circle" size={28} bg="transparent" color={colors.textMuted} onPress={() => setSearch('')} label="Limpar busca" />}
      </View>
      {hasGroups(filter) && <GroupChips modality={filter} value={group} onChange={setGroup} style={{ marginBottom: 12 }} />}
      <T v="bodySm" color={colors.textMuted} style={{ marginBottom: 8 }}>{catalog.length} exercícios</T>
      <View style={{ gap: 8 }}>
        {page.visible.map((e) => {
          const n = countOf(e.id);
          return (
            <View key={e.id} style={[styles.row, { gap: 12, backgroundColor: colors.surface, borderRadius: radius.lg, padding: 12, borderWidth: 1, borderColor: n ? colors.outlineVariant : colors.border }]}>
              {e.media && <ExerciseThumb exercise={e} size={48} />}
              <View style={{ flex: 1, gap: 4 }}>
                <T v="labelLg" numberOfLines={2}>{e.name}</T>
                <View style={[styles.row, { gap: 6, flexWrap: 'wrap' }]}>
                  {e.groups && <Badge label={STRENGTH_GROUP_LABEL[e.groups[0]]} tone="primary" />}
                  <Badge label={e.equipment[0]} tone="muted" />
                  <Badge label={LEVEL_LABEL[e.level]} tone="muted" />
                  {e.tracking === 'hold' && <Badge label="Isometria" tone="muted" />}
                  {n > 0 && <Badge label={`✓ Adicionado (${n})`} tone="success" />}
                </View>
              </View>
              <PillButton label="Adicionar" icon="plus" size="md" variant={n ? 'secondary' : 'primary'} onPress={() => add(e.id)} />
            </View>
          );
        })}
        <ShowMore remaining={page.remaining} onPress={page.more} />
      </View>
    </Screen>
  );
}
