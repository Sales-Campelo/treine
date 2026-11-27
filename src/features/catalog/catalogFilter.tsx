import React, { useState } from 'react';
import { Pressable, ScrollView, StyleProp, ViewStyle } from 'react-native';
import { EXERCISES } from '../../core/catalog/exercises';
import { Exercise, Goal, Level, Modality, MuscleId, STRENGTH_GROUP_LABEL, STRENGTH_GROUPS, StrengthGroup } from '../../core/domain/types';
import { colors, radius, space } from '../../core/theme/tokens';
import { Chip, Icon, T, styles } from '../../shared/components/ui';

const MODALITY_ORDER: Record<Modality, number> = { strength: 0, calisthenics: 1, martial: 2 };

export const normalize = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

export interface CatalogFilter {
  q?: string;
  modality?: Modality | null;
  group?: StrengthGroup | null;
  level?: Level | null;
  goal?: Goal | null;
  muscle?: MuscleId | null;
}

/** Filtra o catálogo (busca sem acento por nome/equipamento) e ordena pelo nº do catálogo. */
export function filterExercises(f: CatalogFilter, list: Exercise[] = EXERCISES): Exercise[] {
  const terms = normalize(f.q?.trim() ?? '').split(/\s+/).filter(Boolean);
  return list
    .filter((e) => {
      if (f.modality && e.modality !== f.modality) return false;
      if (f.group && !e.groups?.includes(f.group)) return false;
      if (f.level && e.level !== f.level) return false;
      if (f.goal && !e.goals.includes(f.goal)) return false;
      if (f.muscle && !e.muscles.some((m) => m.muscle === f.muscle && m.role !== 'stabilizer')) return false;
      if (terms.length) {
        const hay = normalize(`${e.name} ${e.equipment.join(' ')}`);
        if (!terms.every((t) => hay.includes(t))) return false;
      }
      return true;
    })
    .sort((a, b) => MODALITY_ORDER[a.modality] - MODALITY_ORDER[b.modality] || (a.catalogNo ?? 9999) - (b.catalogNo ?? 9999));
}

export const groupCount = (g: StrengthGroup, modality?: Modality | null) =>
  EXERCISES.filter((e) => e.groups?.includes(g) && (!modality || e.modality === modality)).length;

/** Modalidades cujo catálogo é organizado por grupo do corpo. */
export const hasGroups = (m: Modality | null | undefined): m is Modality => m === 'strength' || m === 'calisthenics';

/** Chips horizontais dos grupos do corpo (só os que têm exercícios na modalidade). */
export function GroupChips({ value, onChange, modality = 'strength', style }: { value: StrengthGroup | null; onChange: (g: StrengthGroup | null) => void; modality?: Modality; style?: StyleProp<ViewStyle> }) {
  const groups = STRENGTH_GROUPS.map((g) => [g, groupCount(g, modality)] as const).filter(([, n]) => n > 0);
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={[{ marginHorizontal: -space.margin }, style]} contentContainerStyle={{ gap: 8, paddingHorizontal: space.margin }}>
      <Chip label="Todos os grupos" active={!value} onPress={() => onChange(null)} />
      {groups.map(([g, n]) => (
        <Chip key={g} label={`${STRENGTH_GROUP_LABEL[g]} (${n})`} active={value === g} onPress={() => onChange(value === g ? null : g)} />
      ))}
    </ScrollView>
  );
}

/**
 * Paginação simples: mostra `pageSize` itens e cresce com "Mostrar mais".
 * Reinicia sozinha quando a `key` (assinatura dos filtros) muda — sem efeitos.
 */
export function usePaged<T>(items: T[], key: string, pageSize = 30) {
  const [state, setState] = useState({ key, limit: pageSize });
  const limit = state.key === key ? state.limit : pageSize;
  return {
    visible: items.slice(0, limit),
    remaining: Math.max(0, items.length - limit),
    more: () => setState({ key, limit: limit + pageSize }),
  };
}

export function ShowMore({ remaining, onPress }: { remaining: number; onPress: () => void }) {
  if (remaining <= 0) return null;
  return (
    <Pressable onPress={onPress} style={[styles.row, { gap: 6, justifyContent: 'center', padding: 14, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.surfaceHighest }]}>
      <Icon name="chevron-down" size={18} color={colors.primary} />
      <T v="labelLg" color={colors.primary}>Mostrar mais ({remaining})</T>
    </Pressable>
  );
}
