/**
 * Animação do exercício: alterna a foto da posição inicial e a da final (efeito GIF) com crossfade.
 * `playing=false` congela no frame inicial (ex.: treino pausado ou em descanso).
 * Sem `media`, mostra o fallback (gradiente + ícone da modalidade).
 */
import React, { ReactNode, useEffect, useState } from 'react';
import { Animated, Image, StyleProp, View, ViewStyle } from 'react-native';
import { Exercise } from '../../core/domain/types';
import { colors, radius } from '../../core/theme/tokens';
import { HeroGradient, Icon, MODALITY_ICON } from './ui';

export function ExerciseAnimation({
  exercise, height = 200, playing = true, intervalMs = 900, style, children, rounded = true,
}: {
  exercise?: Exercise;
  height?: number;
  playing?: boolean;
  intervalMs?: number;
  style?: StyleProp<ViewStyle>;
  /** Conteúdo sobreposto (selos, legendas). */
  children?: ReactNode;
  rounded?: boolean;
}) {
  const frames = exercise?.media;
  const [fade] = useState(() => new Animated.Value(0)); // 0 = frame inicial, 1 = frame final

  useEffect(() => {
    if (!frames || frames.length < 2 || !playing) {
      fade.stopAnimation();
      fade.setValue(0);
      return;
    }
    const half = Math.max(150, intervalMs - 250);
    const loop = Animated.loop(
      Animated.sequence([
        Animated.delay(half),
        Animated.timing(fade, { toValue: 1, duration: 250, useNativeDriver: true }),
        Animated.delay(half),
        Animated.timing(fade, { toValue: 0, duration: 250, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [frames, playing, intervalMs, fade]);

  const r = rounded ? radius.lg : 0;
  if (!frames || frames.length === 0) {
    return (
      <HeroGradient style={[{ height, borderRadius: r, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.border }, style]}>
        <Icon name={MODALITY_ICON[exercise?.modality ?? 'calisthenics']} size={Math.min(64, height / 3)} color="rgba(242,133,34,0.35)" />
        {children && <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, top: 0 }}>{children}</View>}
      </HeroGradient>
    );
  }
  return (
    <View
      accessibilityRole="image"
      accessibilityLabel={`Demonstração: ${exercise?.name}`}
      style={[{ height, borderRadius: r, overflow: 'hidden', backgroundColor: colors.bgDeep, borderWidth: 1, borderColor: colors.border }, style]}
    >
      <Image source={frames[0]} style={{ position: 'absolute', width: '100%', height: '100%' }} resizeMode="contain" />
      {frames[1] != null && (
        <Animated.Image source={frames[1]} style={{ position: 'absolute', width: '100%', height: '100%', opacity: fade }} resizeMode="contain" />
      )}
      {children && <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, top: 0 }}>{children}</View>}
    </View>
  );
}

/** Miniatura estática (frame inicial) para listas; cai no ícone se não houver mídia. */
export function ExerciseThumb({ exercise, size = 52 }: { exercise?: Exercise; size?: number }) {
  const frame = exercise?.media?.[0];
  if (frame == null) {
    return (
      <View style={{ width: size, height: size, borderRadius: radius.md, backgroundColor: colors.surfaceHigh, alignItems: 'center', justifyContent: 'center' }}>
        <Icon name={MODALITY_ICON[exercise?.modality ?? 'strength']} size={size * 0.46} color={colors.primarySoft} />
      </View>
    );
  }
  return <Image source={frame} style={{ width: size, height: size, borderRadius: radius.md, backgroundColor: '#fff' }} resizeMode="cover" />;
}
