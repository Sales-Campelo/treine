import { useRouter } from 'expo-router';
import React from 'react';
import { View } from 'react-native';
import { colors } from '../../core/theme/tokens';
import { usePlayer } from '../../features/player/playerStore';
import { useTimerDriver } from '../../features/player/useTimerDriver';
import { CalisthenicsPlayer } from '../../features/player/views/CalisthenicsPlayer';
import { useExitFlow, usePlayerView } from '../../features/player/views/common';
import { MartialPlayer } from '../../features/player/views/MartialPlayer';
import { PrepareOverlay } from '../../features/player/views/PrepareOverlay';
import { StrengthPlayer } from '../../features/player/views/StrengthPlayer';
import { EmptyState } from '../../shared/components/Screen';
import { PillButton } from '../../shared/components/ui';

/**
 * Workout Player polimórfico: um driver/FSM; a view é escolhida pelo tipo do BLOCO ATUAL,
 * então um treino híbrido troca de motor no meio da sessão (Supino → Barra fixa → Boxe).
 * O START acontece no preview ("Iniciar Treino"); aqui o plano já começa no PREPARE de 10 s.
 */
export default function PlayerRoute() {
  const router = useRouter();
  const session = usePlayer((s) => s.session);
  const now = useTimerDriver();
  const v = usePlayerView(now);
  const exit = useExitFlow();

  if (!session) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg, justifyContent: 'center', padding: 24 }}>
        <EmptyState icon="timer-off-outline" title="Nenhum treino ativo" text="Inicie um treino pela aba Treinos." />
        <PillButton label="Voltar" onPress={() => router.replace('/')} />
      </View>
    );
  }
  const kind = v.item?.prescription.kind ?? session.modality;
  const View_ = kind === 'martial' ? MartialPlayer : kind === 'calisthenics' ? CalisthenicsPlayer : StrengthPlayer;
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <View_ now={now} />
      {v.effective === 'PREPARE' && <PrepareOverlay now={now} onClose={exit.openExit} />}
      {exit.sheet}
    </View>
  );
}
