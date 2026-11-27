/**
 * Timer Engine — máquina de estados finitos pura e determinística.
 *
 * Estados: IDLE → PREPARE → ACTIVE_WORK ⇄ REST → COMPLETED, com PAUSED a partir de qualquer fase ativa.
 * O tempo é derivado de timestamps absolutos (`phaseStartedAt`/`endsAt`), nunca de decrementos;
 * assim o estado sobrevive a app em background, tela bloqueada ou processo morto (o estado é persistido
 * e o próximo TICK "alcança" o relógio de parede, pulando fases vencidas sem disparar áudio atrasado).
 *
 * A FSM não executa side-effects: devolve uma lista de `Effect` que o driver executa (som, TTS, haptics).
 * Os três motores (musculação, artes marciais, calistenia) só diferem no `plan` (lista de PhaseSpec)
 * gerado por `plans.ts`.
 */

export type PhaseKind = 'PREPARE' | 'ACTIVE_WORK' | 'REST';
export type TimerStatus = 'IDLE' | PhaseKind | 'PAUSED' | 'COMPLETED';

export type SoundId = 'gong' | 'bell' | 'beep' | 'beep_final' | 'warning';
export type Effect =
  | { type: 'sound'; sound: SoundId }
  | { type: 'speak'; text: string }
  | { type: 'haptic'; style: 'light' | 'medium' | 'heavy' | 'success' | 'warning' };

export interface Cue {
  id: string;
  /** 'remaining': dispara quando restar ≤ at ms; 'elapsed': quando decorrido ≥ at ms. */
  ref: 'remaining' | 'elapsed';
  at: number;
  effects: Effect[];
}

export interface PhaseRef {
  blockIndex: number;
  entryIndex: number;
  itemId?: string;
  exerciseId?: string | null;
  comboId?: string;
  round?: number;
  /** Circuito/ciclo: id do grupo, volta (1..n), posição no grupo (0..size-1). */
  circuitId?: string;
  circuitRound?: number;
  circuitRounds?: number;
  circuitPos?: number;
  circuitSize?: number;
}

export interface PhaseSpec {
  kind: PhaseKind;
  /** null = fase aberta (cronômetro progressivo, termina com SET_DONE). */
  durationMs: number | null;
  /** Meta de uma fase aberta (ex.: hold de 30 s) — dispara sino ao atingir. */
  targetMs?: number;
  /** Ao zerar, avança automaticamente para a próxima fase. */
  autoAdvance: boolean;
  /** Bipe nos 3 s finais e aviso aos 10 s. */
  countdownBeeps?: boolean;
  label: string;
  ref?: PhaseRef;
  onEnter?: Effect[];
  cues?: Cue[];
}

export interface CompletedPhase {
  index: number;
  kind: PhaseKind;
  elapsedMs: number;
  endedAt: number;
  reason: 'timeout' | 'done' | 'skip';
}

export interface TimerState {
  status: TimerStatus;
  plan: PhaseSpec[];
  index: number;
  phaseStartedAt: number;
  endsAt: number | null;
  /** Meta efetiva da fase atual (pode ser ajustada com ±5 s). */
  targetMs: number | null;
  pausedFrom: PhaseKind | null;
  pausedAt: number | null;
  sessionStartedAt: number | null;
  pausedTotalMs: number;
  firedCues: string[];
  /** Fases concluídas desde o último dispatch (o player transforma em registros). */
  completed: CompletedPhase[];
}

export type TimerEvent =
  | { type: 'START'; now: number }
  | { type: 'TICK'; now: number }
  | { type: 'PAUSE'; now: number }
  | { type: 'RESUME'; now: number }
  | { type: 'SET_DONE'; now: number }
  | { type: 'SKIP'; now: number }
  | { type: 'PREV'; now: number }
  | { type: 'ADJUST'; deltaMs: number; now: number }
  | { type: 'FINISH'; now: number }
  | { type: 'RESET' };

export interface Transition {
  state: TimerState;
  effects: Effect[];
}

/** Cues "atrasados" mais que isso (ex.: voltando do background) são marcados sem tocar. */
export const STALE_CUE_MS = 1500;

export function createTimer(plan: PhaseSpec[]): TimerState {
  return {
    status: 'IDLE',
    plan,
    index: 0,
    phaseStartedAt: 0,
    endsAt: null,
    targetMs: null,
    pausedFrom: null,
    pausedAt: null,
    sessionStartedAt: null,
    pausedTotalMs: 0,
    firedCues: [],
    completed: [],
  };
}

export const isRunning = (s: TimerState) => s.status === 'PREPARE' || s.status === 'ACTIVE_WORK' || s.status === 'REST';
export const currentPhase = (s: TimerState): PhaseSpec | undefined => s.plan[s.index];

/** Todos os cues de uma fase: os do plano + contagem regressiva + meta de hold. */
export function phaseCues(p: PhaseSpec, targetMs: number | null): Cue[] {
  const cues = [...(p.cues ?? [])];
  if (p.countdownBeeps && p.durationMs != null) {
    if (p.durationMs > 15_000) cues.push({ id: 'cd10', ref: 'remaining', at: 10_000, effects: [{ type: 'sound', sound: 'warning' }, { type: 'haptic', style: 'warning' }] });
    for (const sec of [3, 2, 1]) {
      if (p.durationMs > sec * 1000) cues.push({ id: `cd${sec}`, ref: 'remaining', at: sec * 1000, effects: [{ type: 'sound', sound: 'beep' }] });
    }
  }
  if (p.durationMs == null && targetMs != null) {
    cues.push({
      id: 'target',
      ref: 'elapsed',
      at: targetMs,
      effects: [{ type: 'sound', sound: 'bell' }, { type: 'haptic', style: 'success' }, { type: 'speak', text: 'Meta atingida' }],
    });
  }
  return cues;
}

const cueDueAt = (c: Cue, s: TimerState): number | null => {
  if (c.ref === 'elapsed') return s.phaseStartedAt + c.at;
  return s.endsAt == null ? null : s.endsAt - c.at;
};

/** Relógio derivado para a UI. */
export function clock(s: TimerState, now: number) {
  const p = currentPhase(s);
  const ref = s.status === 'PAUSED' && s.pausedAt != null ? s.pausedAt : now;
  const active = isRunning(s) || s.status === 'PAUSED';
  const elapsedMs = active ? Math.max(0, ref - s.phaseStartedAt) : 0;
  const remainingMs = active && s.endsAt != null ? Math.max(0, s.endsAt - ref) : null;
  const total = p?.durationMs != null ? (s.endsAt ?? 0) - s.phaseStartedAt : s.targetMs;
  const progress = total ? Math.min(1, elapsedMs / total) : 0;
  const sessionMs =
    s.sessionStartedAt == null ? 0 : Math.max(0, (s.status === 'COMPLETED' ? s.phaseStartedAt : ref) - s.sessionStartedAt - s.pausedTotalMs);
  return { elapsedMs, remainingMs, progress, sessionMs, totalMs: total ?? null };
}

function enter(s: TimerState, index: number, at: number, effects: Effect[]): TimerState {
  if (index >= s.plan.length) {
    effects.push({ type: 'sound', sound: 'gong' }, { type: 'haptic', style: 'success' }, { type: 'speak', text: 'Treino concluído. Excelente trabalho!' });
    return { ...s, status: 'COMPLETED', index: s.plan.length, phaseStartedAt: at, endsAt: null, targetMs: null, firedCues: [] };
  }
  const p = s.plan[index];
  effects.push(...(p.onEnter ?? []));
  return {
    ...s,
    status: p.kind,
    index,
    phaseStartedAt: at,
    endsAt: p.durationMs != null ? at + p.durationMs : null,
    targetMs: p.targetMs ?? null,
    firedCues: [],
  };
}

function completeAndAdvance(s: TimerState, endedAt: number, reason: CompletedPhase['reason'], effects: Effect[]): TimerState {
  const p = s.plan[s.index];
  const done: CompletedPhase = { index: s.index, kind: p.kind, elapsedMs: Math.max(0, endedAt - s.phaseStartedAt), endedAt, reason };
  return enter({ ...s, completed: [...s.completed, done] }, s.index + 1, endedAt, effects);
}

function fireCues(s: TimerState, now: number, effects: Effect[]): TimerState {
  const p = currentPhase(s);
  if (!p) return s;
  let fired = s.firedCues;
  for (const c of phaseCues(p, s.targetMs)) {
    if (fired.includes(c.id)) continue;
    const due = cueDueAt(c, s);
    if (due == null || now < due) continue;
    // Não dispara cues de uma fase que já terminou neste mesmo tick, nem cues velhos.
    if (now - due <= STALE_CUE_MS) effects.push(...c.effects);
    fired = [...fired, c.id];
  }
  return fired === s.firedCues ? s : { ...s, firedCues: fired };
}

/** Avança fases vencidas (auto-advance) até alcançar `now`. Áudio só da última transição. */
function catchUp(s: TimerState, now: number, effects: Effect[]): TimerState {
  let guard = 0;
  while (isRunning(s) && s.endsAt != null && now >= s.endsAt && guard++ < 10_000) {
    const p = s.plan[s.index];
    const endsAt: number = s.endsAt;
    const stale = now - endsAt > STALE_CUE_MS;
    s = fireCues(s, endsAt, stale ? [] : effects);
    if (!p.autoAdvance) break; // fase cronometrada sem auto-avanço: fica em 0 aguardando SET_DONE
    const local: Effect[] = [];
    s = completeAndAdvance(s, endsAt, 'timeout', local);
    if (!stale || !isRunning(s)) effects.push(...local);
  }
  return fireCues(s, now, effects);
}

export function transition(prev: TimerState, ev: TimerEvent): Transition {
  const effects: Effect[] = [];
  let s: TimerState = { ...prev, completed: [] };

  switch (ev.type) {
    case 'START': {
      if (s.status !== 'IDLE' || s.plan.length === 0) return { state: prev, effects };
      s = { ...s, sessionStartedAt: ev.now, pausedTotalMs: 0 };
      s = enter(s, 0, ev.now, effects);
      break;
    }
    case 'TICK': {
      if (!isRunning(s)) return { state: prev, effects };
      s = catchUp(s, ev.now, effects);
      break;
    }
    case 'PAUSE': {
      if (!isRunning(s)) return { state: prev, effects };
      s = catchUp(s, ev.now, effects);
      if (!isRunning(s)) break;
      s = { ...s, pausedFrom: s.status as PhaseKind, pausedAt: ev.now, status: 'PAUSED' };
      effects.push({ type: 'haptic', style: 'light' });
      break;
    }
    case 'RESUME': {
      if (s.status !== 'PAUSED' || s.pausedAt == null || !s.pausedFrom) return { state: prev, effects };
      const d = ev.now - s.pausedAt;
      s = {
        ...s,
        status: s.pausedFrom,
        pausedFrom: null,
        pausedAt: null,
        phaseStartedAt: s.phaseStartedAt + d,
        endsAt: s.endsAt == null ? null : s.endsAt + d,
        pausedTotalMs: s.pausedTotalMs + d,
      };
      effects.push({ type: 'haptic', style: 'light' });
      break;
    }
    case 'SET_DONE':
    case 'SKIP': {
      if (s.status === 'PAUSED') s = transition(s, { type: 'RESUME', now: ev.now }).state;
      if (!isRunning(s)) return { state: prev, effects };
      s = catchUp(s, ev.now, effects);
      if (!isRunning(s)) break;
      const reason = ev.type === 'SET_DONE' ? 'done' : 'skip';
      if (ev.type === 'SET_DONE') effects.push({ type: 'haptic', style: 'medium' });
      s = completeAndAdvance(s, ev.now, reason, effects);
      break;
    }
    case 'PREV': {
      if (s.status === 'IDLE') return { state: prev, effects };
      // Volta para a fase de trabalho anterior (ou reinicia a atual se for a primeira).
      let i = Math.min(s.index, s.plan.length) - 1;
      while (i > 0 && s.plan[i].kind !== 'ACTIVE_WORK') i--;
      i = Math.max(0, i);
      s = { ...s, pausedFrom: null, pausedAt: null };
      s = enter(s, i, ev.now, effects);
      break;
    }
    case 'ADJUST': {
      const running = isRunning(s) || s.status === 'PAUSED';
      if (!running) return { state: prev, effects };
      const ref = s.status === 'PAUSED' && s.pausedAt != null ? s.pausedAt : ev.now;
      if (s.endsAt != null) {
        s = { ...s, endsAt: Math.max(ref + 1000, s.endsAt + ev.deltaMs) };
      } else if (s.targetMs != null) {
        s = { ...s, targetMs: Math.max(5000, s.targetMs + ev.deltaMs) };
      } else return { state: prev, effects };
      // Rearma cues que voltaram a ficar no futuro.
      s = { ...s, firedCues: s.firedCues.filter((id) => {
        const c = phaseCues(s.plan[s.index], s.targetMs).find((x) => x.id === id);
        const due = c ? cueDueAt(c, s) : null;
        return due != null && due <= ref;
      }) };
      effects.push({ type: 'haptic', style: 'light' });
      break;
    }
    case 'FINISH': {
      if (s.status === 'COMPLETED') return { state: prev, effects };
      const extraPause = s.status === 'PAUSED' && s.pausedAt != null ? ev.now - s.pausedAt : 0;
      s = {
        ...s,
        status: 'COMPLETED',
        endsAt: null,
        pausedAt: null,
        pausedFrom: null,
        phaseStartedAt: ev.now,
        pausedTotalMs: s.pausedTotalMs + extraPause,
      };
      break;
    }
    case 'RESET':
      return { state: createTimer(prev.plan), effects };
  }
  return { state: s, effects };
}
