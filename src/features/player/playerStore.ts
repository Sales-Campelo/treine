/**
 * Store do Workout Player. Persistido: se o app for morto no meio do treino, a sessão é restaurada e
 * o próximo TICK alcança o relógio real (timestamps absolutos na FSM).
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { COMBO_BY_ID, resolveExerciseId } from '../../core/catalog/exercises';
import { EntryResult, Modality, RoutineItem, Session, SessionEntry } from '../../core/domain/types';
import { latestWeight, useApp } from '../../core/store/appStore';
import { uuid } from '../../core/utils/id';
import { runEffects } from '../../core/audio/effects';
import { summarize } from '../report/summary';
import { buildPlan, quickItems } from './engine/plans';
import { clock, CompletedPhase, createTimer, TimerEvent, TimerState, transition } from './engine/timerMachine';

export interface Draft {
  kg?: number;
  reps?: number;
  mode?: 'reps' | 'hold';
  level?: number;
  loadKg?: number;
  intensity?: number;
}
export const draftKey = (block: number, entry: number) => `${block}:${entry}`;

export type StartOptions =
  | { routineId: string; dayId: string }
  | { quick: Modality }
  | { custom: { items: RoutineItem[]; title: string; modality: Modality } };

type EventInput = TimerEvent extends infer E ? (E extends { now: number } ? Omit<E, 'now'> : E) : never;

interface PlayerState {
  session: Session | null;
  items: RoutineItem[];
  timer: TimerState;
  drafts: Record<string, Draft>;
  start: (opts: StartOptions) => string;
  dispatch: (ev: EventInput) => void;
  setDraft: (key: string, patch: Draft) => void;
  /** Edita uma série já registrada (toque longo no card). */
  updateEntry: (block: number, entry: number, patch: { kg?: number; reps?: number }) => void;
  finish: () => string | null;
  discard: () => void;
}

/** Resolve os valores efetivos de uma série a partir do rascunho + prescrição. */
export function effectiveDraft(items: RoutineItem[], drafts: Record<string, Draft>, block: number, entry: number): Required<Draft> {
  const rx = items[block]?.prescription;
  const d = drafts[draftKey(block, entry)] ?? {};
  const base: Required<Draft> = { kg: 0, reps: 0, mode: 'reps', level: 1, loadKg: 0, intensity: 0.8 };
  if (rx?.kind === 'strength') {
    const s = rx.sets[Math.min(entry, rx.sets.length - 1)];
    return { ...base, kg: s.kg, reps: s.reps, ...d } as Required<Draft>;
  }
  if (rx?.kind === 'calisthenics') {
    const s = rx.sets[Math.min(entry, rx.sets.length - 1)];
    return { ...base, mode: s.mode, reps: s.reps ?? 0, level: s.level, loadKg: s.loadKg, ...d } as Required<Draft>;
  }
  return { ...base, ...d } as Required<Draft>;
}

function toEntry(state: PlayerState, c: CompletedPhase, liveTargetMs: number | null): SessionEntry | null {
  const phase = state.timer.plan[c.index];
  if (c.kind !== 'ACTIVE_WORK' || !phase.ref) return null;
  const { blockIndex: b, entryIndex: j, exerciseId, comboId } = phase.ref;
  const item = state.items[b];
  if (!item) return null;
  const d = effectiveDraft(state.items, state.drafts, b, j);
  const secs = Math.round(c.elapsedMs / 1000);
  let result: EntryResult;
  const rx = item.prescription;
  if (rx.kind === 'strength') {
    if (c.reason === 'skip') return null;
    result = { kind: 'strength', kg: d.kg, reps: d.reps };
  } else if (rx.kind === 'martial') {
    if (secs < 10) return null;
    result = { kind: 'martial', workS: secs, comboIds: comboId && COMBO_BY_ID[comboId] ? [comboId] : [], freestyle: !comboId, intensity: d.intensity };
  } else {
    if (c.reason === 'skip' && !rx.timed) return null;
    const hold = d.mode === 'hold' && !rx.timed;
    const targetMs = liveTargetMs ?? phase.targetMs;
    result = hold
      ? { kind: 'calisthenics', mode: 'hold', holdS: secs, targetS: targetMs ? Math.round(targetMs / 1000) : undefined, level: d.level, loadKg: d.loadKg }
      : { kind: 'calisthenics', mode: 'reps', reps: d.reps, level: d.level, loadKg: d.loadKg };
  }
  return { id: uuid(), exerciseId: exerciseId ?? null, blockIndex: b, entryIndex: j, completedAt: c.endedAt, result };
}

const emptyTimer = createTimer([]);

export const usePlayer = create<PlayerState>()(
  persist(
    (set, get) => ({
      session: null,
      items: [],
      timer: emptyTimer,
      drafts: {},

      start: (opts) => {
        const app = useApp.getState();
        let items: RoutineItem[];
        let title: string;
        let modality: Modality;
        let routineId: string | undefined;
        let routineDayId: string | undefined;
        if ('custom' in opts) {
          ({ items, title, modality } = opts.custom);
        } else if ('quick' in opts) {
          items = quickItems(opts.quick);
          modality = opts.quick;
          title = { strength: 'Treino Livre — Musculação', martial: 'Round Livre — Shadow Boxing', calisthenics: 'Treino Livre — Calistenia' }[opts.quick];
        } else {
          const routine = app.routines.find((r) => r.id === opts.routineId);
          const day = routine?.days.find((d) => d.id === opts.dayId);
          if (!routine || !day) throw new Error('Rotina não encontrada');
          items = day.items;
          title = day.name;
          modality = routine.modality;
          routineId = routine.id;
          routineDayId = day.id;
        }
        const kinds = new Set(items.map((i) => i.prescription.kind));
        const session: Session = {
          id: uuid(), modality, title, routineId, routineDayId, status: 'in_progress',
          startedAt: Date.now(), activeSeconds: 0, entries: [], summary: {}, isHybrid: kinds.size > 1,
        };
        set({ session, items, drafts: {}, timer: createTimer(buildPlan(items, session.startedAt)) });
        // Iniciar = começa a contagem "Prepare-se!" (10 s) do plano.
        get().dispatch({ type: 'START' });
        return session.id;
      },

      dispatch: (input) => {
        const ev = (input.type === 'RESET' ? input : { ...input, now: Date.now() }) as TimerEvent;
        const st = get();
        const { state: timer, effects } = transition(st.timer, ev);
        if (timer === st.timer && effects.length === 0) return;
        let session = st.session;
        if (session && timer.completed.length) {
          const fresh = timer.completed
            .map((c) => toEntry(st, c, st.timer.index === c.index ? st.timer.targetMs : null))
            .filter(Boolean) as SessionEntry[];
          if (fresh.length) {
            const keep = session.entries.filter((e) => !fresh.some((f) => f.blockIndex === e.blockIndex && f.entryIndex === e.entryIndex));
            session = { ...session, entries: [...keep, ...fresh] };
          }
        }
        set({ timer, session });
        if (effects.length) runEffects(effects, useApp.getState().profile.prefs);
      },

      updateEntry: (block, entry, patch) => {
        const session = get().session;
        if (!session) return;
        set({
          session: {
            ...session,
            entries: session.entries.map((e) => {
              if (e.blockIndex !== block || e.entryIndex !== entry) return e;
              const r = e.result;
              if (r.kind === 'strength') return { ...e, result: { ...r, kg: patch.kg ?? r.kg, reps: patch.reps ?? r.reps } };
              if (r.kind === 'calisthenics' && r.mode === 'reps') return { ...e, result: { ...r, reps: patch.reps ?? r.reps } };
              return e;
            }),
          },
        });
      },

      setDraft: (key, patch) => set({ drafts: { ...get().drafts, [key]: { ...get().drafts[key], ...patch } } }),

      finish: () => {
        const st = get();
        if (!st.session) return null;
        let timer = st.timer;
        if (timer.status !== 'COMPLETED') {
          // Registra a fase de trabalho em andamento (ex.: hold sendo sustentado) antes de encerrar.
          if (timer.status === 'ACTIVE_WORK') st.dispatch({ type: 'SET_DONE' });
          st.dispatch({ type: 'FINISH' });
          timer = get().timer;
        }
        const session0 = get().session!;
        const app = useApp.getState();
        const activeSeconds = Math.round(clock(timer, Date.now()).sessionMs / 1000);
        const entries = [...session0.entries].sort((a, b) => a.blockIndex - b.blockIndex || a.entryIndex - b.entryIndex);
        const session: Session = {
          ...session0,
          entries,
          status: 'completed',
          endedAt: Date.now(),
          activeSeconds,
          summary: summarize(entries, session0.modality, activeSeconds, latestWeight(app.measurements)),
        };
        app.addSession(session);
        set({ session: null, items: [], drafts: {}, timer: emptyTimer });
        return session.id;
      },

      discard: () => set({ session: null, items: [], drafts: {}, timer: emptyTimer }),
    }),
    {
      name: 'treine/player/v1',
      version: 2,
      // v0/v1 → v2: ids dos catálogos antigos (musculação e calistenia) num treino em andamento.
      migrate: (persisted) => {
        const st = persisted as Pick<PlayerState, 'session' | 'items' | 'timer' | 'drafts'>;
        return {
          ...st,
          items: (st.items ?? []).map((i) => ({ ...i, exerciseId: resolveExerciseId(i.exerciseId) })),
          timer: { ...st.timer, plan: (st.timer?.plan ?? []).map((ph) => (ph.ref ? { ...ph, ref: { ...ph.ref, exerciseId: resolveExerciseId(ph.ref.exerciseId) } } : ph)) },
          session: st.session ? { ...st.session, entries: st.session.entries.map((e) => ({ ...e, exerciseId: resolveExerciseId(e.exerciseId) })) } : null,
        } as PlayerState;
      },
      storage: createJSONStorage(() => AsyncStorage),
      partialize: ({ session, items, timer, drafts }) => ({ session, items, timer, drafts }),
    },
  ),
);
