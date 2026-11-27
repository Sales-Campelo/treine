/**
 * Store local-first. Fonte da verdade no device (AsyncStorage → SQLite kv no native).
 * Toda mutação de entidade sincronizável grava também na outbox (core/sync/outbox.ts),
 * que será drenada para o Supabase quando houver conexão/conta.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { SEED_ROUTINES } from '../catalog/seedRoutines';
import { BodyMeasurement, Profile, Routine, ScheduledWorkout, Session } from '../domain/types';
import { enqueue } from '../sync/outbox';
import { buildDemoHistory, buildDemoMeasurements, buildDemoSchedule } from './demoData';
import { uuid } from '../utils/id';
import { resolveExerciseId } from '../catalog/exercises';

export const DEFAULT_PROFILE: Profile = {
  name: 'Sales',
  heightCm: 181,
  birthYear: 1994,
  sex: 'male',
  goal: 'hypertrophy',
  level: 'intermediate',
  weeklyTarget: 5,
  targetWeightKg: 84,
  modalities: ['strength', 'martial', 'calisthenics'],
  prefs: { tts: true, ttsRate: 1.0, haptics: true, sounds: true, defaultRestS: 90, reminders: true },
};

interface AppState {
  hydrated: boolean;
  profile: Profile;
  routines: Routine[];
  sessions: Session[];
  measurements: BodyMeasurement[];
  schedule: ScheduledWorkout[];
  /** Último momento em que a central de avisos foi aberta. */
  noticesSeenAt: number;
  seededAt?: number;
  setProfile: (p: Partial<Profile>) => void;
  setPrefs: (p: Partial<Profile['prefs']>) => void;
  addSession: (s: Session) => void;
  updateSession: (id: string, patch: Partial<Session>) => void;
  deleteSession: (id: string) => void;
  addMeasurement: (m: BodyMeasurement) => void;
  upsertRoutine: (r: Routine) => void;
  scheduleWorkout: (date: number, routineId: string, dayId: string) => void;
  unschedule: (id: string) => void;
  markNoticesSeen: () => void;
  ensureSeed: () => void;
  resetAll: () => void;
}

export const useApp = create<AppState>()(
  persist(
    (set, get) => ({
      hydrated: false,
      profile: DEFAULT_PROFILE,
      routines: SEED_ROUTINES,
      sessions: [],
      measurements: [],
      schedule: [],
      noticesSeenAt: 0,
      setProfile: (p) => set({ profile: { ...get().profile, ...p } }),
      setPrefs: (p) => set({ profile: { ...get().profile, prefs: { ...get().profile.prefs, ...p } } }),
      addSession: (s) => {
        set({ sessions: [s, ...get().sessions.filter((x) => x.id !== s.id)] });
        enqueue('sessions', 'upsert', s);
      },
      updateSession: (id, patch) => {
        const sessions = get().sessions.map((s) => (s.id === id ? { ...s, ...patch } : s));
        set({ sessions });
        const s = sessions.find((x) => x.id === id);
        if (s) enqueue('sessions', 'upsert', s);
      },
      deleteSession: (id) => {
        set({ sessions: get().sessions.filter((s) => s.id !== id) });
        enqueue('sessions', 'delete', { id });
      },
      addMeasurement: (m) => {
        set({ measurements: [...get().measurements, m].sort((a, b) => a.measuredAt - b.measuredAt) });
        enqueue('body_measurements', 'upsert', m);
      },
      upsertRoutine: (r) => {
        set({ routines: [...get().routines.filter((x) => x.id !== r.id), r] });
        enqueue('routines', 'upsert', r);
      },
      scheduleWorkout: (date, routineId, dayId) => {
        const item: ScheduledWorkout = { id: uuid(), date, routineId, dayId };
        set({ schedule: [...get().schedule, item].sort((a, b) => a.date - b.date) });
        enqueue('scheduled_workouts', 'upsert', item);
      },
      unschedule: (id) => {
        set({ schedule: get().schedule.filter((x) => x.id !== id) });
        enqueue('scheduled_workouts', 'delete', { id });
      },
      markNoticesSeen: () => set({ noticesSeenAt: Date.now() }),
      ensureSeed: () => {
        if (get().seededAt) return;
        const now = Date.now();
        set({ seededAt: now, sessions: buildDemoHistory(now), measurements: buildDemoMeasurements(now), schedule: buildDemoSchedule(now) });
      },
      resetAll: () => set({ profile: DEFAULT_PROFILE, routines: SEED_ROUTINES, sessions: [], measurements: [], schedule: [], noticesSeenAt: 0, seededAt: undefined }),
    }),
    {
      name: 'treine/app/v1',
      version: 4,
      migrate: (persisted, version) => {
        let st = persisted as Partial<AppState>;
        // v1 → v2: agendamentos, avisos e novas fichas seed (Braços, Ciclo Full Body).
        if (version < 2) {
          st = { ...st, schedule: buildDemoSchedule(Date.now()), noticesSeenAt: 0 };
        }
        // v2 → v3: catálogo de musculação novo (máquinas/Smith/polias) — remapeia ids antigos.
        // Fichas seed passam para a versão atual; fichas criadas pelo usuário são mantidas (com ids remapeados).
        // v3 → v4: catálogo de calistenia novo (free-exercise-db) — mesmo remapeamento.
        if (version < 4) {
          const custom = (st.routines ?? []).filter((r) => !SEED_ROUTINES.some((x) => x.id === r.id)).map(remapRoutine);
          st = {
            ...st,
            routines: [...SEED_ROUTINES, ...custom],
            sessions: (st.sessions ?? []).map((x) => ({ ...x, entries: x.entries.map((e) => ({ ...e, exerciseId: resolveExerciseId(e.exerciseId) })) })),
          };
        }
        return st as AppState;
      },
      storage: createJSONStorage(() => AsyncStorage),
      partialize: ({ hydrated, ...rest }) => rest,
      onRehydrateStorage: () => () => useApp.setState({ hydrated: true }),
    },
  ),
);

/** Troca ids de exercícios legados nos itens de uma ficha. */
export const remapRoutine = (r: Routine): Routine => ({
  ...r,
  days: r.days.map((d) => ({ ...d, items: d.items.map((i) => ({ ...i, exerciseId: resolveExerciseId(i.exerciseId) })) })),
});

/** Peso mais recente (fallback 80 kg) — usado no cálculo de fadiga e calorias. */
export const latestWeight = (ms: BodyMeasurement[]) => ms.at(-1)?.weightKg ?? 80;
