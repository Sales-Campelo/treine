import React, { useMemo, useState } from 'react';
import * as Haptics from 'expo-haptics';
import { Modal, Platform, Pressable, ScrollView, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { EXERCISES, getExercise } from '../../../core/catalog/exercises';
import { useApp } from '../../../core/store/appStore';
import { Exercise, STRENGTH_GROUP_LABEL } from '../../../core/domain/types';
import { colors, radius, space } from '../../../core/theme/tokens';
import { mmss, mmssCeil, num } from '../../../core/utils/format';
import { Badge, Icon, IconButton, MODALITY_ICON, PillButton, Stepper, T, Toggle, styles } from '../../../shared/components/ui';
import { draftKey, effectiveDraft, usePlayer } from '../playerStore';
import { BottomDock, muscleList, PlayerTopBar, StatusBadges, TipCard, TopAction, useExitFlow, usePlayerView } from './common';

export function StrengthPlayer({ now }: { now: number }) {
  const insets = useSafeAreaInsets();
  const v = usePlayerView(now);
  const { openExit, finish, sheet } = useExitFlow();
  const dispatch = usePlayer((s) => s.dispatch);
  const sessions = useApp((s) => s.sessions);
  const [noteOpen, setNoteOpen] = useState(false);
  const [swapOpen, setSwapOpen] = useState(false);

  const rx = v.item?.prescription.kind === 'strength' ? v.item.prescription : null;
  const sets = rx?.sets ?? [];
  const activeEntry = v.phase?.kind === 'ACTIVE_WORK' && v.phase.ref?.blockIndex === v.block ? v.phase.ref.entryIndex : -1;
  const doneEntries = new Set(v.session?.entries.filter((e) => e.blockIndex === v.block).map((e) => e.entryIndex));

  const pr = useMemo(() => {
    let best = 0;
    for (const s of sessions) for (const e of s.entries) if (e.exerciseId === v.item?.exerciseId && e.result.kind === 'strength') best = Math.max(best, e.result.kg);
    return best;
  }, [sessions, v.item?.exerciseId]);

  const [editing, setEditing] = useState<number | null>(null);
  const openEdit = (j: number) => {
    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => undefined);
    setEditing(j);
  };
  const resting = v.effective === 'REST';
  const paused = v.isPaused;
  const pauseBtn = (
    <IconButton
      icon={paused ? 'play' : 'pause'}
      size={56}
      bg={paused ? colors.primary : colors.surfaceHigh}
      color={paused ? colors.bg : colors.primary}
      label={paused ? 'Retomar treino' : 'Pausar treino'}
      onPress={() => dispatch({ type: paused ? 'RESUME' : 'PAUSE' })}
    />
  );
  const completed = v.timer.status === 'COMPLETED';
  const restTotal = v.clock.totalMs ?? 1;

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg, paddingTop: insets.top }}>
      <PlayerTopBar sessionMs={v.clock.sessionMs} onClose={openExit} right={<TopAction icon="chart-bar" label="Finalizar" onPress={openExit} />} />
      <ScrollView contentContainerStyle={{ paddingHorizontal: space.margin, paddingBottom: 260, gap: space.md }} showsVerticalScrollIndicator={false}>
        <View style={styles.rowBetween}>
          <StatusBadges items={[`Exercício ${v.block + 1}/${v.items.length}`]} />
          {pr > 0 && (
            <View style={[styles.row, { gap: 4 }]}>
              <Icon name="history" size={16} color={colors.primary} />
              <T v="labelLg" color={colors.primary}>PR: {num(pr)} kg</T>
            </View>
          )}
        </View>

        {/* Exercício atual */}
        <View style={[styles.row, { gap: space.md, backgroundColor: colors.surface, borderRadius: radius.lg, padding: space.md }]}>
          <View style={{ width: 64, height: 64, borderRadius: radius.md, backgroundColor: colors.surfaceHighest, alignItems: 'center', justifyContent: 'center' }}>
            <Icon name={MODALITY_ICON.strength} size={30} color={colors.primary} />
          </View>
          <View style={{ flex: 1, gap: 2 }}>
            <T v="headlineMd" numberOfLines={1}>{v.exercise?.name}</T>
            <T v="bodySm" color={colors.textSubtle} numberOfLines={1}>{muscleList(v.exercise)}</T>
            <View style={[styles.row, { gap: 6, marginTop: 6, flexWrap: 'wrap' }]}>
              {v.exercise?.equipment.slice(0, 1).map((e) => <Badge key={e} label={e} tone="muted" />)}
              <Badge label={`Descanso ${sets[0]?.restS ?? 90}s`} tone="muted" />
            </View>
          </View>
        </View>

        <View style={[styles.row, { gap: space.sm }]}>
          <PillButton label="Substituir" icon="swap-horizontal" variant="secondary" size="md" style={{ flex: 1 }} onPress={() => setSwapOpen(true)} />
          <PillButton label="+ Nota" icon="note-edit-outline" variant="secondary" size="md" style={{ flex: 1 }} onPress={() => setNoteOpen(true)} />
        </View>

        <View style={[styles.rowBetween, { paddingHorizontal: 4, marginTop: 4 }]}>
          <T v="labelLg" color={colors.textSubtle}>PROGRESSÃO DE SÉRIES</T>
          <T v="labelLg" color={colors.primary}>ALVO: {sets.length} SÉRIES</T>
        </View>
        <T v="bodySm" color={colors.textMuted} style={{ marginTop: -8, paddingHorizontal: 4 }}>Segure uma série para editar repetições e carga</T>

        {sets.map((s, j) => {
          const recorded = v.session?.entries.find((e) => e.blockIndex === v.block && e.entryIndex === j)?.result;
          const d = recorded?.kind === 'strength' ? { reps: recorded.reps, kg: recorded.kg } : effectiveDraft(v.items, v.drafts, v.block, j);
          const isActive = j === activeEntry;
          const done = doneEntries.has(j);
          const isLast = j === sets.length - 1;
          return (
            <Pressable
              key={j}
              accessibilityLabel={`Série ${j + 1}`}
              accessibilityHint="Segure para editar repetições e carga"
              delayLongPress={400}
              onLongPress={() => openEdit(j)}
              style={({ pressed }) => ({ backgroundColor: isActive ? colors.surfaceHigh : colors.surface, borderRadius: radius.lg, padding: space.md, overflow: 'hidden', opacity: !isActive && !done && activeEntry >= 0 && j > activeEntry ? 0.85 : 1, transform: [{ scale: pressed ? 0.98 : 1 }] })}
            >
              {isActive && <View style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 5, backgroundColor: colors.primary }} />}
              <View style={[styles.row, { gap: space.md }]}>
                <View style={{ width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', backgroundColor: isActive ? colors.primary : done ? colors.primaryTint : colors.surfaceHigh }}>
                  {done ? <Icon name="check" size={20} color={colors.primary} /> : <T v="headlineMd" color={isActive ? colors.bg : colors.textMuted}>{j + 1}</T>}
                </View>
                <View style={{ flex: 1 }}>
                  <T v="headlineMd" style={{ fontVariant: ['tabular-nums'] }}>
                    {d.reps} reps  •  <T v="headlineMd" color={isActive ? colors.primary : colors.onSurface}>{num(d.kg, d.kg % 1 ? 1 : 0)} kg</T>
                  </T>
                  <T v="bodySm" color={isActive ? colors.primary : colors.textMuted}>
                    {isActive ? '● Série ativa' : done ? 'Concluída' : isLast && s.toFailure ? 'Falha concêntrica' : 'Série principal'}
                  </T>
                </View>
                {isLast && s.toFailure && !isActive && !done && <Badge label="ATÉ A FALHA" tone="muted" />}
                {!isActive && !done && !(isLast && s.toFailure) && <Icon name="lock-clock" size={22} color={colors.textMuted} />}
                {isActive && <Icon name="gesture-tap-hold" size={22} color={colors.textMuted} />}
              </View>
            </Pressable>
          );
        })}

        {v.exercise?.tip && <TipCard text={v.exercise.tip} />}
      </ScrollView>

      <BottomDock>
        {completed ? (
          <>
            <T v="headlineMd">Treino concluído! 🔥</T>
            <PillButton label="Ver Relatório" icon="file-chart-outline" onPress={finish} />
          </>
        ) : paused ? (
          <>
            <View style={styles.rowBetween}>
              <View style={{ flex: 1 }}>
                <T v="headlineLg">Treino pausado</T>
                <T v="bodyMd" color={colors.textSubtle}>O cronômetro está congelado. Retome quando puder.</T>
              </View>
              <View style={[styles.row, { gap: 6, backgroundColor: colors.surfaceHigh, paddingHorizontal: 16, paddingVertical: 10, borderRadius: radius.full }]}>
                <Icon name="pause-circle-outline" size={22} color={colors.textMuted} />
                <T v="metricSm" color={colors.textMuted}>{resting ? mmssCeil(v.clock.remainingMs ?? 0) : mmss(v.clock.elapsedMs)}</T>
              </View>
            </View>
            <PillButton label="Retomar Treino" icon="play" onPress={() => dispatch({ type: 'RESUME' })} />
          </>
        ) : resting ? (
          <>
            <View style={styles.rowBetween}>
              <View style={{ flex: 1 }}>
                <T v="headlineLg">Descanso</T>
                <T v="bodyMd" color={colors.textSubtle}>Próxima: série {activeEntryAfterRest(v)} de {v.exercise?.name}</T>
              </View>
              <View style={[styles.row, { gap: 6, backgroundColor: colors.surfaceHigh, paddingHorizontal: 16, paddingVertical: 10, borderRadius: radius.full }]}>
                <Icon name="timer-outline" size={22} color={colors.primary} />
                <T v="metricSm" color={colors.primary}>{mmssCeil(v.clock.remainingMs ?? 0)}</T>
              </View>
            </View>
            <ProgressBar value={1 - (v.clock.remainingMs ?? 0) / restTotal} />
            <View style={[styles.row, { gap: 12 }]}>
              <IconButton icon="minus" size={56} bg={colors.surfaceHigh} label="Menos 15 segundos" onPress={() => dispatch({ type: 'ADJUST', deltaMs: -15000 })} />
              <IconButton icon="plus" size={56} bg={colors.surfaceHigh} label="Mais 15 segundos" onPress={() => dispatch({ type: 'ADJUST', deltaMs: 15000 })} />
              {pauseBtn}
              <PillButton label="Pular descanso" icon="skip-next" style={{ flex: 1 }} onPress={() => dispatch({ type: 'SKIP' })} />
            </View>
          </>
        ) : (
          <>
            <View style={styles.rowBetween}>
              <View style={{ flex: 1 }}>
                <T v="headlineLg">Vamos lá! <T v="headlineLg" color={colors.primary}>●</T></T>
                <T v="bodyMd" color={colors.textSubtle}>Faça o exercício com amplitude total</T>
              </View>
              <View style={[styles.row, { gap: 6, backgroundColor: colors.surfaceHigh, paddingHorizontal: 16, paddingVertical: 10, borderRadius: radius.full }]}>
                <Icon name="timer-outline" size={22} color={colors.primary} />
                <T v="metricSm" color={colors.primary}>{mmss(v.clock.elapsedMs)}</T>
              </View>
            </View>
            <ProgressBar value={Math.min(1, v.clock.elapsedMs / 60000)} />
            <View style={[styles.row, { gap: 12 }]}>
              <PillButton label="Voltar" icon="arrow-left" variant="secondary" style={{ flex: 0.55 }} onPress={() => dispatch({ type: 'PREV' })} />
              {pauseBtn}
              <PillButton label="Concluir Série" iconRight="check-circle-outline" style={{ flex: 1 }} onPress={() => dispatch({ type: 'SET_DONE' })} />
            </View>
          </>
        )}
      </BottomDock>

      {sheet}
      <NoteModal open={noteOpen} onClose={() => setNoteOpen(false)} />
      {editing != null && <EditSetSheet block={v.block} entry={editing} total={sets.length} onClose={() => setEditing(null)} />}
      <SwapModal open={swapOpen} onClose={() => setSwapOpen(false)} block={v.block} />
    </View>
  );
}

function activeEntryAfterRest(v: ReturnType<typeof usePlayerView>) {
  const next = v.timer.plan.slice(v.timer.index + 1).find((p) => p.kind === 'ACTIVE_WORK');
  return (next?.ref?.entryIndex ?? 0) + 1;
}

export function ProgressBar({ value }: { value: number }) {
  return (
    <View style={{ height: 6, backgroundColor: colors.surfaceHighest, borderRadius: 3, overflow: 'hidden' }}>
      <View style={{ width: `${Math.max(0, Math.min(1, value)) * 100}%`, height: '100%', backgroundColor: colors.primary, borderRadius: 3 }} />
    </View>
  );
}

function NoteModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const session = usePlayer((s) => s.session);
  const [text, setText] = useState(session?.notes ?? '');
  return (
    <Modal transparent visible={open} animationType="fade" onRequestClose={onClose}>
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', padding: space.lg }}>
        <View style={{ backgroundColor: colors.surface, borderRadius: radius.lg, padding: space.lg, gap: 12 }}>
          <T v="headlineMd">Nota do treino</T>
          <TextInput
            value={text}
            onChangeText={setText}
            multiline
            placeholder="Ex.: ombro direito incomodou na 3ª série"
            placeholderTextColor={colors.textMuted}
            style={{ minHeight: 100, color: colors.onSurface, backgroundColor: colors.bg, borderRadius: radius.md, padding: 12, borderWidth: 1, borderColor: colors.primary, textAlignVertical: 'top' }}
          />
          <PillButton label="Salvar nota" onPress={() => { usePlayer.setState((s) => ({ session: s.session ? { ...s.session, notes: text } : null })); onClose(); }} />
        </View>
      </View>
    </Modal>
  );
}

/** Substituição: troca o exercício do bloco por outro com o mesmo músculo primário. */
function SwapModal({ open, onClose, block }: { open: boolean; onClose: () => void; block: number }) {
  const items = usePlayer((s) => s.items);
  const current = getExercise(items[block]?.exerciseId);
  const primary = current?.muscles.find((m) => m.role === 'primary')?.muscle;
  // Alternativas: mesmo músculo primário; primeiro as do mesmo grupo do catálogo, na ordem da lista.
  const sameGroup = (e: Exercise) => !!current?.groups && !!e.groups?.some((g) => current.groups!.includes(g));
  const options = EXERCISES.filter((e) => e.id !== current?.id && e.modality === 'strength' && e.muscles.some((m) => m.role === 'primary' && m.muscle === primary))
    .sort((a, b) => Number(sameGroup(b)) - Number(sameGroup(a)) || (a.catalogNo ?? 999) - (b.catalogNo ?? 999));
  const swap = (id: string) => {
    usePlayer.setState((s) => ({
      items: s.items.map((it, i) => (i === block ? { ...it, exerciseId: id } : it)),
      timer: { ...s.timer, plan: s.timer.plan.map((p) => (p.ref?.blockIndex === block ? { ...p, ref: { ...p.ref, exerciseId: id }, label: p.label.replace(current?.name ?? '', getExercise(id)?.name ?? '') } : p)) },
    }));
    onClose();
  };
  return (
    <Modal transparent visible={open} animationType="fade" onRequestClose={onClose}>
      <Pressable style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' }} onPress={onClose}>
        <Pressable style={{ backgroundColor: colors.surface, borderTopLeftRadius: radius.xl, borderTopRightRadius: radius.xl, padding: space.lg, gap: 10, maxHeight: '75%' }}>
          <T v="headlineMd">Substituir {current?.name}</T>
          <T v="bodySm" color={colors.textMuted}>{options.length} alternativas que trabalham o mesmo músculo</T>
          {options.length === 0 && <T color={colors.textMuted}>Nenhuma alternativa para este músculo no catálogo.</T>}
          <ScrollView contentContainerStyle={{ gap: 8 }}>
            {options.map((o) => (
              <Pressable key={o.id} onPress={() => swap(o.id)} style={[styles.rowBetween, { backgroundColor: colors.surfaceHigh, padding: 14, borderRadius: radius.md, gap: 10 }]}>
                <View style={{ flex: 1 }}>
                  <T v="labelLg" numberOfLines={2}>{o.name}</T>
                  <T v="bodySm" color={colors.textMuted}>{o.equipment.join(' • ')}{o.groups ? ` • ${STRENGTH_GROUP_LABEL[o.groups[0]]}` : ''}</T>
                </View>
                <Icon name="swap-horizontal" size={20} color={colors.primary} />
              </Pressable>
            ))}
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

/** Editor da série (aberto por toque longo): reps e carga; opcionalmente aplica às séries seguintes. */
function EditSetSheet({ block, entry, total, onClose }: { block: number; entry: number; total: number; onClose: () => void }) {
  const items = usePlayer((s) => s.items);
  const drafts = usePlayer((s) => s.drafts);
  const session = usePlayer((s) => s.session);
  const setDraft = usePlayer((s) => s.setDraft);
  const updateEntry = usePlayer((s) => s.updateEntry);
  const recorded = session?.entries.find((e) => e.blockIndex === block && e.entryIndex === entry)?.result;
  const base = recorded?.kind === 'strength' ? { reps: recorded.reps, kg: recorded.kg } : effectiveDraft(items, drafts, block, entry);
  const [reps, setReps] = useState(base.reps);
  const [kg, setKg] = useState(base.kg);
  const [forward, setForward] = useState(true);
  const doneSet = new Set(session?.entries.filter((e) => e.blockIndex === block).map((e) => e.entryIndex));

  const save = () => {
    if (recorded) updateEntry(block, entry, { reps, kg });
    else setDraft(draftKey(block, entry), { reps, kg });
    if (forward) for (let j = entry + 1; j < total; j++) if (!doneSet.has(j)) setDraft(draftKey(block, j), { reps, kg });
    onClose();
  };

  return (
    <Modal transparent visible animationType="fade" onRequestClose={onClose}>
      <Pressable style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' }} onPress={onClose}>
        <Pressable style={{ backgroundColor: colors.surface, borderTopLeftRadius: radius.xl, borderTopRightRadius: radius.xl, padding: space.lg, gap: space.md }}>
          <View style={styles.rowBetween}>
            <T v="headlineMd">Editar série {entry + 1}</T>
            {recorded && <Badge label="Já concluída" tone="success" />}
          </View>
          <View style={[styles.row, { justifyContent: 'space-around' }]}>
            <Stepper label="Repetições" value={reps} min={0} onChange={setReps} />
            <Stepper label="Carga (kg)" value={kg} min={0} step={2.5} format={(x) => num(x, x % 1 ? 1 : 0)} onChange={setKg} />
          </View>
          {entry < total - 1 && (
            <View style={styles.rowBetween}>
              <T v="labelLg" style={{ flex: 1 }}>Aplicar às séries seguintes</T>
              <Toggle value={forward} onChange={setForward} />
            </View>
          )}
          <View style={[styles.row, { gap: 12 }]}>
            <PillButton label="Cancelar" variant="secondary" style={{ flex: 0.6 }} onPress={onClose} />
            <PillButton label="Salvar" icon="check" style={{ flex: 1 }} onPress={save} />
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
