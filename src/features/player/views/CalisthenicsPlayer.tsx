import React, { useState } from 'react';
import { Modal, Pressable, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, radius, space, type } from '../../../core/theme/tokens';
import { mmss, mmssCeil } from '../../../core/utils/format';
import { LEVEL_LABEL } from '../../../core/domain/types';
import { getExercise } from '../../../core/catalog/exercises';
import { ProgressRing } from '../../../shared/components/charts';
import { Icon, IconButton, PillButton, Segmented, Stepper, T, styles } from '../../../shared/components/ui';
import { draftKey, effectiveDraft, usePlayer } from '../playerStore';
import { ExerciseAnimation, ExerciseThumb } from '../../../shared/components/ExerciseAnimation';
import { BottomDock, HowTo, muscleList, PlayerTopBar, StatusBadges, TipCard, TopAction, useExitFlow, usePlayerView } from './common';

const levelName = (l: number) => (l <= 2 ? LEVEL_LABEL.beginner : l <= 3 ? LEVEL_LABEL.intermediate : LEVEL_LABEL.advanced);

export function CalisthenicsPlayer({ now }: { now: number }) {
  const insets = useSafeAreaInsets();
  const v = usePlayerView(now);
  const dispatch = usePlayer((s) => s.dispatch);
  const setDraft = usePlayer((s) => s.setDraft);
  const routineName = usePlayer((s) => s.session?.title ?? '');
  const { openExit, finish, sheet } = useExitFlow();
  const [levelsOpen, setLevelsOpen] = useState(false);
  const [showSteps, setShowSteps] = useState(false);

  const rx = v.item?.prescription.kind === 'calisthenics' ? v.item.prescription : null;
  const circuit = rx?.timed;
  const sets = rx?.sets ?? [];
  const ref = v.phase?.ref;
  const entry = v.phase?.kind === 'ACTIVE_WORK' && ref?.blockIndex === v.block ? ref.entryIndex : nextEntry(v);
  const d = effectiveDraft(v.items, v.drafts, v.block, Math.min(entry, Math.max(0, sets.length - 1)));
  const key = draftKey(v.block, entry);
  const holdMode = d.mode === 'hold' && !circuit;
  const done = new Map(v.session?.entries.filter((e) => e.blockIndex === v.block).map((e) => [e.entryIndex, e.result]));
  const resting = v.effective === 'REST';
  const preparing = v.effective === 'PREPARE';
  const completed = v.timer.status === 'COMPLETED';
  const idle = v.timer.status === 'IDLE';
  const timedWork = v.phase?.durationMs != null; // EMOM / AMRAP
  // Ciclo (circuito): referência da fase atual ou, no descanso, da próxima fase de trabalho.
  const upcomingWork = v.timer.plan.slice(v.timer.index).find((p) => p.kind === 'ACTIVE_WORK');
  const cref = ref?.circuitId && !resting ? ref : upcomingWork?.ref?.circuitId ? upcomingWork.ref : ref?.circuitId ? ref : undefined;
  const cycle = cref?.circuitId
    ? v.items.map((it, i) => ({ it, i })).filter(({ it }) => it.circuit?.id === cref.circuitId)
    : [];
  const nEntries = v.item?.circuit ? v.item.circuit.rounds : sets.length;
  const lastOfRound = cref != null && cref.circuitPos === (cref.circuitSize ?? 1) - 1;

  // Relógio do anel
  let ringValue = '00:00';
  let ringSub = '';
  let progress = 0;
  if (idle) {
    ringValue = circuit ? `${circuit.minutes}:00` : '00:00';
    ringSub = circuit ? `${circuit.kind.toUpperCase()} • ${circuit.minutes} min` : 'Toque em iniciar';
  } else if (resting || preparing || timedWork) {
    ringValue = mmssCeil(v.clock.remainingMs ?? 0);
    ringSub = resting ? (cref ? `Próxima volta ${cref.circuitRound}/${cref.circuitRounds}` : 'Descanso') : preparing ? 'Prepare-se' : v.phase?.label.split(' — ')[0] ?? '';
    progress = v.clock.progress;
  } else if (holdMode) {
    ringValue = mmss(v.clock.elapsedMs);
    ringSub = `Alvo: ${mmss(v.timer.targetMs ?? (sets[entry]?.targetS ?? 30) * 1000)} seg`;
    progress = v.timer.targetMs ? v.clock.elapsedMs / v.timer.targetMs : 0;
  } else {
    ringValue = mmss(v.clock.elapsedMs);
    ringSub = `Alvo: ${d.reps} reps`;
    progress = Math.min(1, v.clock.elapsedMs / 45000);
  }
  // Nível, lastro e modo valem para a série atual e as seguintes do exercício.
  const applyFrom = (patch: Parameters<typeof setDraft>[1]) => {
    for (let j = entry; j < Math.max(nEntries, entry + 1); j++) setDraft(draftKey(v.block, j), patch);
  };
  const reachedTarget = holdMode && v.timer.targetMs != null && v.clock.elapsedMs >= v.timer.targetMs;

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg, paddingTop: insets.top }}>
      <PlayerTopBar sessionMs={v.clock.sessionMs} onClose={openExit} right={<TopAction icon="format-list-checks" label={showSteps ? 'Ocultar' : 'Como fazer'} onPress={() => setShowSteps((x) => !x)} />} />
      <ScrollView contentContainerStyle={{ paddingHorizontal: space.margin, paddingBottom: 260, gap: space.md }} showsVerticalScrollIndicator={false}>
        <StatusBadges
          items={
            cref
              ? ['Circuito', `Volta ${cref.circuitRound}/${cref.circuitRounds}`, `Exercício ${(cref.circuitPos ?? 0) + 1}/${cref.circuitSize}`]
              : [`Exercício ${v.block + 1} de ${v.items.length}`, routineName]
          }
        />

        <View style={[styles.rowBetween, { alignItems: 'flex-start' }]}>
          <View style={[styles.row, { gap: 12, flex: 1, alignItems: 'stretch' }]}>
            <View style={{ width: 4, borderRadius: 2, backgroundColor: colors.primary }} />
            <View style={{ flex: 1 }}>
              <T v="headlineLg">{v.exercise?.name}</T>
              <View style={[styles.row, { gap: 14, marginTop: 4, flexWrap: 'wrap' }]}>
                <View style={[styles.row, { gap: 4 }]}>
                  <Icon name="lightning-bolt" size={16} color={colors.primary} />
                  <T v="labelLg" color={colors.primary}>Nível {d.level} • {levelName(d.level)}</T>
                </View>
                <T v="labelLg" color={colors.textSubtle}>{d.loadKg >= 0 ? '+' : ''}{d.loadKg} kg {d.loadKg >= 0 ? 'Lastro' : 'Assist.'}</T>
              </View>
            </View>
          </View>
          <TopAction icon="tune-variant" label="Níveis" onPress={() => setLevelsOpen(true)} />
        </View>

        {/* Demonstração animada do exercício atual (congela no descanso e na pausa) */}
        <ExerciseAnimation exercise={v.exercise} height={210} playing={!resting && !v.isPaused && !completed}>
          <View style={{ flex: 1, justifyContent: 'flex-end', padding: 10 }}>
            <View style={styles.rowBetween}>
              <View style={[styles.row, { gap: 6, flex: 1, backgroundColor: 'rgba(21,19,17,0.82)', paddingHorizontal: 10, paddingVertical: 6, borderRadius: radius.full, marginRight: 8 }]}>
                <Icon name="target" size={16} color={colors.primary} />
                <T v="labelMd" numberOfLines={1} style={{ flex: 1 }}>Alvo: {muscleList(v.exercise)}</T>
              </View>
              <View style={{ backgroundColor: 'rgba(21,19,17,0.82)', paddingHorizontal: 10, paddingVertical: 6, borderRadius: radius.full }}>
                <T v="labelMd" color={colors.textSubtle}>{v.exercise?.equipment[0]}</T>
              </View>
            </View>
          </View>
        </ExerciseAnimation>

        {!circuit && (
          <Segmented
            value={d.mode}
            onChange={(m) => applyFrom({ mode: m })}
            options={[{ key: 'hold', label: 'Isometria (seg)' }, { key: 'reps', label: 'Repetições' }]}
          />
        )}

        <View style={{ alignItems: 'center', gap: 14 }}>
          <ProgressRing size={250} stroke={14} progress={progress} color={resting ? colors.success : colors.primary}>
            <T v="labelLg" color={resting ? colors.success : colors.primary} style={{ letterSpacing: 1.5 }}>
              {resting
                ? cref ? '● DESCANSO DO CICLO ●' : '● DESCANSO ●'
                : circuit ? `● ${circuit.kind.toUpperCase()} ●`
                : cref ? `● VOLTA ${cref.circuitRound} DE ${cref.circuitRounds} ●`
                : `● SÉRIE ${entry + 1} DE ${sets.length} ●`}
            </T>
            <T style={[type.metric, { fontSize: 60, lineHeight: 68 }]}>{ringValue}</T>
            <T v="labelLg" color={reachedTarget ? colors.primary : colors.textSubtle}>{reachedTarget ? 'Meta atingida! 🔥' : ringSub}</T>
          </ProgressRing>
          <View style={[styles.row, { gap: 16 }]}>
            <Pressable onPress={() => dispatch({ type: 'ADJUST', deltaMs: -5000 })} style={pillSmall}><T v="labelLg">-5s</T></Pressable>
            {idle ? (
              <IconButton icon="play" size={52} bg={colors.primary} color={colors.bg} label="Iniciar" onPress={() => dispatch({ type: 'START' })} />
            ) : (
              <IconButton icon={v.isPaused ? 'play' : 'pause'} size={52} bg={colors.surfaceHigh} color={colors.primary} label={v.isPaused ? 'Retomar' : 'Pausar'} onPress={() => dispatch({ type: v.isPaused ? 'RESUME' : 'PAUSE' })} />
            )}
            <Pressable onPress={() => dispatch({ type: 'ADJUST', deltaMs: 5000 })} style={pillSmall}><T v="labelLg">+5s</T></Pressable>
          </View>
          {!holdMode && !resting && (
            <Stepper label={circuit?.kind === 'amrap' ? 'Rounds completos' : 'Repetições'} value={d.reps} min={0} onChange={(x) => setDraft(key, { reps: x })} />
          )}
        </View>

        {cref && (
          <>
            <View style={[styles.rowBetween, { paddingHorizontal: 4, marginTop: 4 }]}>
              <T v="labelLg" color={colors.textSubtle}>CICLO</T>
              <T v="labelLg" color={colors.primary}>{cref.circuitRounds} voltas • sem pausa entre exercícios</T>
            </View>
            {cycle.map(({ it, i }, pos) => {
              const ex = getExercise(it.exerciseId);
              const round = (cref.circuitRound ?? 1) - 1;
              const r = v.session?.entries.find((e) => e.blockIndex === i && e.entryIndex === round)?.result;
              const active = i === v.block && !resting && !r;
              const set0 = it.prescription.kind === 'calisthenics' ? it.prescription.sets[0] : undefined;
              const target = set0?.mode === 'hold' ? `${set0.targetS}s` : `${set0?.reps ?? '—'} reps`;
              return (
                <View key={it.id} style={[styles.row, { gap: 14, backgroundColor: active ? colors.surfaceHigh : colors.surface, borderRadius: radius.lg, padding: space.md, overflow: 'hidden', opacity: !r && !active ? 0.75 : 1 }]}>
                  {active && <View style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 5, backgroundColor: colors.primary }} />}
                  <View>
                    <ExerciseThumb exercise={ex} size={44} />
                    <View style={{ position: 'absolute', right: -4, bottom: -4, width: 22, height: 22, borderRadius: 11, alignItems: 'center', justifyContent: 'center', backgroundColor: active ? colors.primary : r ? colors.success : colors.surfaceHighest, borderWidth: 2, borderColor: colors.surface }}>
                      {r ? <Icon name="check" size={12} color={colors.white} /> : <T v="labelMd" color={active ? colors.bg : colors.textMuted} style={{ fontSize: 10 }}>{pos + 1}</T>}
                    </View>
                  </View>
                  <View style={{ flex: 1 }}>
                    <T v="labelLg" numberOfLines={1}>{ex?.name}</T>
                    <T v="bodySm" color={colors.textMuted}>{r ? 'Feito nesta volta' : active ? '● Em execução' : pos === cycle.length - 1 ? 'Depois: descanso do ciclo' : 'Na sequência, sem descanso'}</T>
                  </View>
                  <T v="headlineMd" color={active ? colors.primary : colors.onSurface}>
                    {r && r.kind === 'calisthenics' ? (r.mode === 'hold' ? `${r.holdS}s` : `${r.reps}`) : target}
                  </T>
                </View>
              );
            })}
          </>
        )}

        {!circuit && !cref && (
          <>
            <View style={[styles.rowBetween, { paddingHorizontal: 4, marginTop: 4 }]}>
              <T v="labelLg" color={colors.textSubtle}>PROGRESSÃO DE SÉRIES</T>
              <T v="labelLg" color={colors.primary}>Alvo: {sets.length}x {sets[0]?.mode === 'hold' ? 'Isometria' : 'Repetições'}</T>
            </View>
            {sets.map((s, j) => {
              const r = done.get(j);
              const active = j === entry && !resting && !idle;
              const isLast = j === sets.length - 1;
              return (
                <View key={j} style={[styles.row, { gap: 14, backgroundColor: active ? colors.surfaceHigh : colors.surface, borderRadius: radius.lg, padding: space.md, overflow: 'hidden', opacity: !r && !active ? 0.75 : 1 }]}>
                  {active && <View style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 5, backgroundColor: colors.primary }} />}
                  <View style={{ width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', backgroundColor: active ? colors.primary : r ? colors.primaryTint : colors.surfaceHigh }}>
                    {r ? <Icon name="check" size={20} color={colors.primary} /> : active ? <T v="labelLg" color={colors.bg}>{j + 1}</T> : <Icon name={isLast ? 'fire' : 'lock-outline'} size={18} color={colors.textMuted} />}
                  </View>
                  <View style={{ flex: 1 }}>
                    <T v="labelLg">Série {j + 1} {r ? <T v="labelMd" color={colors.primary}>✓ Feito</T> : active ? <T v="labelMd" color={colors.primary}>● Ativa</T> : null}</T>
                    <T v="bodySm" color={colors.textMuted}>
                      {r && r.kind === 'calisthenics' ? (r.mode === 'hold' ? `${r.holdS}s sustentado` : `${r.reps} reps`) : s.mode === 'hold' ? `Alvo: ${s.targetS}s sustentado` : `Alvo: ${s.reps} reps`}
                    </T>
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <T v="headlineMd" color={active ? colors.primary : colors.onSurface}>
                      {r && r.kind === 'calisthenics' ? (r.mode === 'hold' ? `${r.holdS}s` : `${r.reps}`) : active && holdMode ? mmss(v.clock.elapsedMs) : s.mode === 'hold' ? `${s.targetS}s` : `${s.reps}`}
                    </T>
                    <T v="bodySm" color={colors.textMuted}>
                      {r && r.kind === 'calisthenics' && r.mode === 'hold' && r.targetS ? `${Math.round((100 * (r.holdS ?? 0)) / r.targetS)}% alvo` : active ? 'Em execução' : 'Espera'}
                    </T>
                  </View>
                </View>
              );
            })}
          </>
        )}

        {v.exercise?.tip && <TipCard title="Dica Técnica de Postura" text={v.exercise.tip} />}
        {showSteps && v.exercise?.steps && <HowTo steps={v.exercise.steps} />}
      </ScrollView>

      <BottomDock>
        {completed ? (
          <>
            <T v="headlineMd">Circuito concluído! 🔥</T>
            <PillButton label="Ver Relatório" icon="file-chart-outline" onPress={finish} />
          </>
        ) : (
          <>
            <View style={styles.rowBetween}>
              <T v="labelLg">{resting ? 'Recupere o fôlego 💨' : cref && !lastOfRound ? 'Sem descanso: emende o próximo! ⚡' : holdMode ? 'Mantenha a posição! 🔥' : 'Execução controlada 💪'}</T>
              <T v="labelMd" color={colors.primary}>{resting ? 'Solte os ombros' : 'Trave glúteos e abdômen'}</T>
            </View>
            <View style={[styles.row, { gap: 12 }]}>
              <PillButton label="Voltar" icon="arrow-left" variant="secondary" style={{ flex: 0.6 }} onPress={() => dispatch({ type: 'PREV' })} />
              {resting || preparing || timedWork ? (
                <PillButton label={resting ? 'Pular descanso' : 'Pular'} icon="skip-next" style={{ flex: 1 }} onPress={() => dispatch({ type: 'SKIP' })} />
              ) : (
                <PillButton
                  label={cref ? (lastOfRound ? 'Concluir volta' : 'Próximo exercício') : 'Concluir Série'}
                  icon={cref && !lastOfRound ? 'arrow-right-circle-outline' : 'check-circle-outline'}
                  style={{ flex: 1 }}
                  onPress={() => dispatch({ type: 'SET_DONE' })}
                  disabled={idle}
                />
              )}
            </View>
          </>
        )}
      </BottomDock>

      <Modal transparent visible={levelsOpen} animationType="fade" onRequestClose={() => setLevelsOpen(false)}>
        <Pressable style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' }} onPress={() => setLevelsOpen(false)}>
          <Pressable style={{ backgroundColor: colors.surface, borderTopLeftRadius: radius.xl, borderTopRightRadius: radius.xl, padding: space.lg, gap: space.md }}>
            <T v="headlineMd">Progressão & Lastro</T>
            <T v="bodyMd" color={colors.textMuted}>Árvore: {v.exercise?.attributes.progressionTree?.replace('_', ' ')} (máx. nível {v.exercise?.attributes.maxLevel ?? 5})</T>
            <View style={[styles.row, { justifyContent: 'space-around' }]}>
              <Stepper label="Nível" value={d.level} min={1} onChange={(x) => applyFrom({ level: Math.min(x, v.exercise?.attributes.maxLevel ?? 5) })} />
              <Stepper label="Lastro (+) / Assist. (−) kg" value={d.loadKg} step={2.5} onChange={(x) => applyFrom({ loadKg: x })} />
            </View>
            <PillButton label="Aplicar" onPress={() => setLevelsOpen(false)} />
          </Pressable>
        </Pressable>
      </Modal>
      {sheet}
    </View>
  );
}

const pillSmall = { backgroundColor: colors.surfaceHigh, paddingHorizontal: 18, paddingVertical: 12, borderRadius: radius.full } as const;

function nextEntry(v: ReturnType<typeof usePlayerView>) {
  const next = v.timer.plan.slice(v.timer.index).find((p) => p.kind === 'ACTIVE_WORK' && p.ref?.blockIndex === v.block);
  return next?.ref?.entryIndex ?? 0;
}
