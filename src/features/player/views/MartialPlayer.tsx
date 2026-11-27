import * as Speech from 'expo-speech';
import React, { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COMBO_BY_ID } from '../../../core/catalog/exercises';
import { Combo, MartialRx } from '../../../core/domain/types';
import { useApp } from '../../../core/store/appStore';
import { colors, radius, space, type } from '../../../core/theme/tokens';
import { mmss, mmssCeil } from '../../../core/utils/format';
import { ProgressRing } from '../../../shared/components/charts';
import { Badge, HeroGradient, Icon, IconButton, Segmented, T, styles } from '../../../shared/components/ui';
import { randomCombos } from '../engine/plans';
import { draftKey, usePlayer } from '../playerStore';
import { AudioPrefs, PlayerTopBar, TipCard, TopAction, useExitFlow, usePlayerView } from './common';

const TIPS = [
  'Mantenha a guarda colada ao queixo com a mão esquerda ao soltar o direto. Expire com vigor em cada golpe para manter o tônus do core.',
  'Gire o pé de trás no direto: a força vem do chão, passa pelo quadril e só termina no punho.',
  'Volte sempre à guarda depois do último golpe do combo — a defesa faz parte da combinação.',
  'No descanso, respire pelo nariz e solte os ombros. Recupere a frequência antes do gongo.',
];

export function MartialPlayer({ now }: { now: number }) {
  const insets = useSafeAreaInsets();
  const v = usePlayerView(now);
  const dispatch = usePlayer((s) => s.dispatch);
  const setDraft = usePlayer((s) => s.setDraft);
  const prefs = useApp((s) => s.profile.prefs);
  const setPrefs = useApp((s) => s.setPrefs);
  const { openExit, finish, sheet } = useExitFlow();
  const [showPrefs, setShowPrefs] = useState(false);
  // O combo sorteado vale só para a fase em que foi sorteado.
  const [rolled, setRolled] = useState<{ combo: Combo; phase: number } | null>(null);
  const randomCombo = rolled && rolled.phase === v.timer.index ? rolled.combo : null;

  const rx = v.item?.prescription as MartialRx | undefined;
  const totalRounds = rx?.rounds ?? 0;
  // No round: o round atual. Na preparação/descanso: o próximo round (combo, título e intensidade).
  const upcoming = v.timer.plan.slice(v.timer.index).find((p) => p.kind === 'ACTIVE_WORK');
  const ref = v.effective === 'ACTIVE_WORK' ? v.phase?.ref : upcoming?.ref;
  const round = ref?.round ?? (v.timer.status === 'COMPLETED' ? rx?.rounds ?? 1 : 1);
  const comboId = ref?.comboId;
  const combo = randomCombo ?? (comboId ? COMBO_BY_ID[comboId] : undefined);
  const roundsDone = v.session?.entries.filter((e) => e.blockIndex === v.block).length ?? 0;
  const idle = v.timer.status === 'IDLE';
  const completed = v.timer.status === 'COMPLETED';
  const intensity = v.drafts[draftKey(v.block, ref?.entryIndex ?? 0)]?.intensity ?? 0.8;

  const phaseLabel =
    idle ? 'PRONTO' : completed ? 'FIM' : v.effective === 'PREPARE' ? 'PREPARE-SE' : v.effective === 'REST' ? 'DESCANSO' : `ROUND ${round}`;
  const ringColor = v.effective === 'REST' ? colors.success : colors.primary;
  const display = idle ? mmss((rx?.workS ?? 180) * 1000) : completed ? '00:00' : mmssCeil(v.clock.remainingMs ?? 0);

  const rollCombo = () => {
    const c = randomCombos(v.exercise?.attributes.style ?? 'boxing', 1, Date.now())[0];
    setRolled({ combo: c, phase: v.timer.index });
    if (prefs.tts) {
      Speech.stop();
      Speech.speak(c.callout, { language: 'pt-BR', rate: prefs.ttsRate });
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg, paddingTop: insets.top }}>
      <PlayerTopBar sessionMs={v.clock.sessionMs} onClose={openExit} right={<TopAction icon="tune-variant" label="Ajustar" onPress={() => setShowPrefs((x) => !x)} />} />
      <ScrollView contentContainerStyle={{ paddingHorizontal: space.margin, paddingBottom: 150 + insets.bottom, gap: space.md }} showsVerticalScrollIndicator={false}>
        <View style={[styles.row, { gap: 8, flexWrap: 'wrap' }]}>
          <Badge label={idle ? 'PRONTO' : completed ? 'CONCLUÍDO' : 'EM ANDAMENTO'} tone="primary" dot />
          <Badge label={`Round ${Math.min(round, totalRounds)} de ${totalRounds}`} tone="muted" />
          {combo && <Badge label={`${combo.strikes.length} golpes`} tone="muted" />}
        </View>

        {showPrefs && <AudioPrefs />}

        <View style={[styles.row, { gap: 12 }]}>
          <View style={{ width: 4, alignSelf: 'stretch', borderRadius: 2, backgroundColor: colors.primary }} />
          <View style={{ flex: 1 }}>
            <T v="headlineLg">{combo ? `R${round} — ${combo.name}` : `R${round} — Round livre`}</T>
            <T v="bodyMd" color={colors.textSubtle}>{v.exercise?.name ?? 'Shadow boxing'} • Foco: velocidade e rotação de quadril</T>
          </View>
        </View>

        {/* Combo atual / próximo */}
        <HeroGradient style={{ height: 150, padding: space.md, justifyContent: 'space-between', borderWidth: 1, borderColor: colors.border }}>
          <View style={styles.rowBetween}>
            <T v="labelMd" color={colors.textMuted}>{v.effective === 'ACTIVE_WORK' ? 'COMBO ATUAL' : 'PRÓXIMO COMBO'}</T>
            <Icon name="boxing-glove" size={28} color={colors.primary} />
          </View>
          <View style={[styles.rowBetween, { alignItems: 'flex-end' }]}>
            <View style={[styles.row, { flexWrap: 'wrap', gap: 6, backgroundColor: 'rgba(0,0,0,0.45)', borderRadius: radius.full, paddingHorizontal: 14, paddingVertical: 8, flexShrink: 1 }]}>
              {(combo?.strikes ?? ['Livre']).map((s, i, a) => (
                <T key={i} v="labelLg" color={i === a.length - 1 ? colors.white : colors.primarySoft} style={{ fontSize: 16, textTransform: 'uppercase' }}>
                  {s}{i < a.length - 1 ? '  •' : ''}
                </T>
              ))}
            </View>
            <View style={[styles.row, { gap: 4, backgroundColor: 'rgba(0,0,0,0.45)', borderRadius: radius.full, paddingHorizontal: 12, paddingVertical: 8 }]}>
              <Icon name="account-voice" size={16} color={colors.textSubtle} />
              <T v="labelMd" color={colors.textSubtle}>“{combo?.callout ?? 'Livre'}”</T>
            </View>
          </View>
        </HeroGradient>

        {/* Anel do round */}
        <View style={{ alignItems: 'center', marginVertical: space.sm }}>
          <ProgressRing size={260} stroke={14} progress={idle ? 0 : completed ? 1 : v.clock.progress} color={ringColor}>
            <View style={[styles.row, { gap: 6 }]}>
              <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: ringColor }} />
              <T v="labelLg" color={ringColor} style={{ letterSpacing: 2 }}>{phaseLabel}</T>
            </View>
            <T style={[type.metric, { fontSize: 64, lineHeight: 72 }]}>{display}</T>
            <T v="bodyMd" color={colors.textSubtle}>
              {v.effective === 'REST' ? `Próximo: round ${round}` : `Restante / Total ${mmss((rx?.workS ?? 0) * 1000)}`}
            </T>
          </ProgressRing>
        </View>

        <View style={[styles.row, { gap: 10 }]}>
          <MiniStat label="Rounds">
            <T v="headlineLg">{roundsDone}<T v="bodyMd" color={colors.textMuted}>/{totalRounds}</T></T>
            <View style={[styles.row, { gap: 4 }]}>
              {Array.from({ length: Math.min(totalRounds, 10) }, (_, i) => (
                <View key={i} style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: i < roundsDone ? colors.primary : colors.surfaceHighest }} />
              ))}
            </View>
          </MiniStat>
          <MiniStat label="Intervalo">
            <T v="headlineLg" color={colors.primary}>{rx?.restS ?? 0}s</T>
            <T v="bodySm" color={colors.textSubtle}>Descanso ativo</T>
          </MiniStat>
          <MiniStat label="Narração">
            <Icon name={prefs.tts ? 'account-voice' : 'microphone-off'} size={26} color={prefs.tts ? colors.primary : colors.textMuted} />
            <T v="bodySm" color={colors.textSubtle}>a cada {rx?.calloutEveryS ?? 0}s</T>
          </MiniStat>
        </View>

        <View style={{ gap: 8 }}>
          <T v="labelLg" color={colors.textSubtle}>INTENSIDADE DO ROUND</T>
          <Segmented
            value={intensity <= 0.6 ? 'low' : intensity >= 0.95 ? 'high' : 'mid'}
            onChange={(k) => setDraft(draftKey(v.block, ref?.entryIndex ?? 0), { intensity: k === 'low' ? 0.6 : k === 'high' ? 1 : 0.8 })}
            options={[{ key: 'low', label: 'Técnica' }, { key: 'mid', label: 'Moderada' }, { key: 'high', label: 'Alta' }]}
          />
        </View>

        <TipCard title="Dica Tática do Treinador" icon="karate" text={TIPS[(round - 1) % TIPS.length]} />
      </ScrollView>

      {/* Controles — botões grandes, operáveis de luva */}
      <View style={{ position: 'absolute', left: space.margin, right: space.margin, bottom: insets.bottom + 16, backgroundColor: colors.surface, borderRadius: radius.xl, padding: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderWidth: 1, borderColor: colors.borderStrong }}>
        <IconButton icon={prefs.tts ? 'account-voice' : 'microphone-off'} size={52} bg={colors.surfaceHigh} color={prefs.tts ? colors.onSurface : colors.textMuted} label="Alternar narração" onPress={() => setPrefs({ tts: !prefs.tts })} />
        <IconButton icon="skip-previous" size={52} bg={colors.surfaceHigh} label="Round anterior" onPress={() => dispatch({ type: 'PREV' })} />
        {completed ? (
          <IconButton icon="flag-checkered" size={76} bg={colors.primary} color={colors.bg} label="Ver relatório" onPress={finish} />
        ) : idle ? (
          <IconButton icon="play" size={76} bg={colors.primary} color={colors.bg} label="Iniciar" onPress={() => dispatch({ type: 'START' })} />
        ) : (
          <IconButton
            icon={v.isPaused ? 'play' : 'pause'}
            size={76}
            bg={colors.primary}
            color={colors.bg}
            label={v.isPaused ? 'Retomar' : 'Pausar'}
            onPress={() => dispatch({ type: v.isPaused ? 'RESUME' : 'PAUSE' })}
          />
        )}
        <IconButton icon="skip-next" size={52} bg={colors.surfaceHigh} label="Pular fase" onPress={() => dispatch({ type: 'SKIP' })} />
        <IconButton icon="dice-5" size={52} bg={colors.surfaceHigh} label="Combo aleatório" onPress={rollCombo} />
      </View>
      {sheet}
    </View>
  );
}

function MiniStat({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View style={{ flex: 1, backgroundColor: colors.surface, borderRadius: radius.lg, padding: 12, alignItems: 'center', gap: 4, minHeight: 110, justifyContent: 'center' }}>
      <T v="bodySm" color={colors.textSubtle}>{label}</T>
      {children}
    </View>
  );
}
