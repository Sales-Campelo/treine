/**
 * Outbox de sincronização (offline-first).
 *
 * Cada mutação local vira uma operação idempotente {table, op, payload, clientRev}. Quando o Supabase
 * for configurado, `drain()` envia em lote via upsert (ids são UUID gerados no device, então reenviar é
 * seguro) e depois faz pull incremental com `rpc('pull_changes', { since })`. Conflitos: last-write-wins
 * por `updated_at`, exceto sessões concluídas, que são imutáveis no servidor.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';

export type SyncTable = 'sessions' | 'session_entries' | 'routines' | 'body_measurements' | 'profiles' | 'scheduled_workouts';
export interface OutboxOp {
  id: string;
  table: SyncTable;
  op: 'upsert' | 'delete';
  payload: unknown;
  clientRev: number;
  createdAt: number;
}

const KEY = 'treine/outbox/v1';
let queue: OutboxOp[] | null = null;
let rev = 0;

async function load(): Promise<OutboxOp[]> {
  if (queue) return queue;
  try {
    queue = JSON.parse((await AsyncStorage.getItem(KEY)) ?? '[]') as OutboxOp[];
  } catch {
    queue = [];
  }
  rev = queue.reduce((m, o) => Math.max(m, o.clientRev), 0);
  return queue;
}

export async function enqueue(table: SyncTable, op: OutboxOp['op'], payload: unknown) {
  const q = await load();
  const id = (payload as { id?: string })?.id ?? String(Date.now());
  // Compacta: só a última operação por (tabela, id) importa.
  const next = q.filter((o) => !(o.table === table && (o.payload as { id?: string })?.id === id));
  next.push({ id: `${table}:${id}:${++rev}`, table, op, payload, clientRev: rev, createdAt: Date.now() });
  queue = next;
  await AsyncStorage.setItem(KEY, JSON.stringify(next)).catch(() => undefined);
}

export async function pendingCount() {
  return (await load()).length;
}

export interface SyncTransport {
  push(ops: OutboxOp[]): Promise<{ ok: string[] }>;
}

/** Drena a fila com um transporte (Supabase). Sem transporte configurado, é no-op. */
export async function drain(transport?: SyncTransport) {
  if (!transport) return { sent: 0 };
  const q = await load();
  if (!q.length) return { sent: 0 };
  const { ok } = await transport.push(q.slice(0, 200));
  queue = q.filter((o) => !ok.includes(o.id));
  await AsyncStorage.setItem(KEY, JSON.stringify(queue));
  return { sent: ok.length };
}
