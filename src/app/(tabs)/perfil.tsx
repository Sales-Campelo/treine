import { useRouter } from 'expo-router';
import React from 'react';
import { Image, Platform, Pressable, ScrollView, View } from 'react-native';
import { GOAL_LABEL, LEVEL_LABEL, MODALITY_LABEL, Modality } from '../../core/domain/types';
import { useApp } from '../../core/store/appStore';
import { colors, radius, space } from '../../core/theme/tokens';
import { dateLong, kg, num } from '../../core/utils/format';
import { bmi, bmiCategory, deltas, streakDays } from '../../features/body/metrics';
import { tonnage } from '../../features/report/summary';
import { Avatar, Screen, TabHeader } from '../../shared/components/Screen';
import { Badge, Card, Chip, Icon, IconName, SectionTitle, Stepper, T, Toggle, styles } from '../../shared/components/ui';

export default function Perfil() {
  const router = useRouter();
  const { profile, sessions, measurements, setProfile, setPrefs } = useApp();
  const completed = sessions.filter((s) => s.status === 'completed');
  const { last, weight30, fat30 } = deltas(measurements);
  const w = last?.weightKg ?? 0;
  const imc = w ? bmi(w, profile.heightCm) : 0;
  const photos = completed.filter((s) => s.photoUri);
  const toggleModality = (m: Modality) =>
    setProfile({ modalities: profile.modalities.includes(m) ? profile.modalities.filter((x) => x !== m) : [...profile.modalities, m] });

  return (
    <Screen header={<TabHeader title="Perfil" />}>
      <Card style={{ gap: space.md, marginBottom: space.xl }}>
        <View style={[styles.row, { gap: space.md }]}>
          <Avatar size={72} />
          <View style={{ flex: 1, gap: 4 }}>
            <T v="headlineLg">{profile.name}</T>
            <Badge label={`${LEVEL_LABEL[profile.level]} • ${GOAL_LABEL[profile.goal]}`} tone="primary" />
            <T v="bodySm" color={colors.textSubtle}>{profile.modalities.map((m) => MODALITY_LABEL[m]).join(' • ')}</T>
          </View>
        </View>
        <View style={[styles.row, { gap: 8 }]}>
          <Mini label="Sequência" value={`${streakDays(completed.map((s) => s.startedAt))} dias`} />
          <Mini label="Treinos" value={String(completed.length)} />
          <Mini label="Carga total" value={kg(tonnage(completed))} />
        </View>
      </Card>

      <SectionTitle title="Antropometria & Composição" />
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 12 }}>
        <Metric label="PESO ATUAL" value={num(w, 1)} unit="kg" delta={weight30} sub={`Meta: ${num(profile.targetWeightKg, 1)} kg`} />
        <Metric label="ALTURA" value={num(profile.heightCm / 100, 2)} unit="m" sub={`IMC ${num(imc, 1)} • ${bmiCategory(imc)}`} />
        <Metric label="% GORDURA" value={num(last?.bodyFatPct ?? 0, 1)} unit="%" delta={fat30} accent bar={(last?.bodyFatPct ?? 0) / 30} />
        <Metric label="MASSA MUSCULAR" value={num(last?.muscleMassKg ?? 0, 1)} unit="kg" sub={w ? `${num(((last?.muscleMassKg ?? 0) / w) * 100, 1)}% do peso` : undefined} />
      </View>
      <Card onPress={() => router.push('/corpo')} style={[styles.rowBetween, { marginBottom: space.xl }]}>
        <View style={[styles.row, { gap: 12 }]}>
          <Icon name="clipboard-pulse-outline" size={24} color={colors.primary} />
          <T v="labelLg">Atualizar Avaliação Física & Bioimpedância</T>
        </View>
        <Icon name="chevron-right" size={22} color={colors.textMuted} />
      </Card>

      <SectionTitle title="Evolução do Físico" right={<T v="labelMd" color={colors.primary}>{photos.length} fotos</T>} />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -space.margin, marginBottom: space.xl }} contentContainerStyle={{ gap: 10, paddingHorizontal: space.margin }}>
        <View style={{ width: 120, height: 160, borderRadius: radius.lg, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center', gap: 6 }}>
          <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: colors.primaryTint, alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="camera-plus-outline" size={22} color={colors.primary} />
          </View>
          <T v="labelMd">Nova foto</T>
          <T v="bodySm" color={colors.textMuted} style={{ fontSize: 10 }}>no relatório pós-treino</T>
        </View>
        {photos.map((s) => (
          <View key={s.id} style={{ width: 120, height: 160, borderRadius: radius.lg, overflow: 'hidden', backgroundColor: colors.surface }}>
            <Image source={{ uri: s.photoUri }} style={{ width: '100%', height: '100%' }} />
            <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: 8, backgroundColor: 'rgba(0,0,0,0.55)' }}>
              <T v="labelMd">{dateLong(s.startedAt)}</T>
            </View>
          </View>
        ))}
      </ScrollView>

      <SectionTitle title="Metas & Rotina de Treino" />
      <Card style={{ gap: space.md, marginBottom: space.xl }}>
        <View style={styles.rowBetween}>
          <View style={{ flex: 1 }}>
            <T v="labelLg">Treinos por semana</T>
            <T v="bodySm" color={colors.textMuted}>Meta de consistência da Home</T>
          </View>
          <Stepper value={profile.weeklyTarget} min={1} onChange={(v) => setProfile({ weeklyTarget: Math.min(7, v) })} />
        </View>
        <View style={styles.rowBetween}>
          <View style={{ flex: 1 }}>
            <T v="labelLg">Descanso padrão entre séries</T>
            <T v="bodySm" color={colors.textMuted}>Usado em treinos criados</T>
          </View>
          <Stepper value={profile.prefs.defaultRestS} min={15} step={15} format={(v) => `${v}s`} onChange={(v) => setPrefs({ defaultRestS: v })} />
        </View>
        <View style={styles.rowBetween}>
          <T v="labelLg">Peso meta</T>
          <Stepper value={profile.targetWeightKg} min={40} step={0.5} format={(v) => num(v, 1)} onChange={(v) => setProfile({ targetWeightKg: v })} />
        </View>
        <View style={{ gap: 8 }}>
          <T v="labelLg">Modalidades praticadas</T>
          <View style={[styles.row, { gap: 8, flexWrap: 'wrap' }]}>
            {(['strength', 'martial', 'calisthenics'] as Modality[]).map((m) => (
              <Chip key={m} label={MODALITY_LABEL[m]} icon={profile.modalities.includes(m) ? 'check' : 'plus'} active={profile.modalities.includes(m)} onPress={() => toggleModality(m)} />
            ))}
          </View>
        </View>
      </Card>

      <SectionTitle title="Preferências do Sistema" />
      <View style={{ gap: 10, marginBottom: space.xl }}>
        <Pref icon="bell-ring-outline" title="Lembretes & alertas de treino" sub="Notificação ao fim do descanso com a tela bloqueada" value={profile.prefs.reminders} onChange={(v) => setPrefs({ reminders: v })} />
        <Pref icon="vibrate" title="Feedback háptico" sub="Vibrar ao concluir séries e fim de contagem" value={profile.prefs.haptics} onChange={(v) => setPrefs({ haptics: v })} />
        <Pref icon="volume-high" title="Sons do timer" sub="Gongo, sino e bipes dos 3 segundos finais" value={profile.prefs.sounds} onChange={(v) => setPrefs({ sounds: v })} />
        <Pref icon="account-voice" title="Narração por voz (TTS)" sub="Combos e rounds narrados em pt-BR" value={profile.prefs.tts} onChange={(v) => setPrefs({ tts: v })} />
        <Card style={styles.rowBetween}>
          <View style={[styles.row, { gap: 12, flex: 1 }]}>
            <Icon name="speedometer" size={22} color={colors.primary} />
            <T v="labelLg">Velocidade da voz</T>
          </View>
          <Stepper value={profile.prefs.ttsRate} min={0.5} step={0.1} format={(v) => `${num(v, 1)}x`} onChange={(v) => setPrefs({ ttsRate: Math.min(2, v) })} />
        </Card>
      </View>

      <Pressable
        onPress={() => {
          const ok = Platform.OS === 'web' ? globalThis.confirm?.('Apagar todo o histórico local e recriar os dados de demonstração?') ?? true : true;
          if (ok) {
            useApp.getState().resetAll();
            useApp.getState().ensureSeed();
          }
        }}
        style={[styles.row, { gap: 8, justifyContent: 'center', padding: 16, borderRadius: radius.lg, backgroundColor: colors.surface }]}
      >
        <Icon name="restore" size={20} color={colors.danger} />
        <T v="labelLg" color={colors.danger}>Restaurar dados de demonstração</T>
      </Pressable>
      <T v="bodySm" color={colors.textMuted} style={{ textAlign: 'center', marginTop: 12 }}>Treine v1.0 (MVP) • Dados salvos offline neste dispositivo</T>
    </Screen>
  );
}

function Mini({ label, value }: { label: string; value: string }) {
  return (
    <View style={{ flex: 1, backgroundColor: colors.surfaceHigh, borderRadius: radius.md, padding: 10, alignItems: 'center' }}>
      <T v="bodySm" color={colors.textSubtle}>{label}</T>
      <T v="headlineMd">{value}</T>
    </View>
  );
}

function Metric({ label, value, unit, delta, sub, accent, bar }: { label: string; value: string; unit: string; delta?: number; sub?: string; accent?: boolean; bar?: number }) {
  return (
    <View style={{ width: '48.5%', backgroundColor: colors.surface, borderRadius: radius.lg, padding: 14, gap: 4 }}>
      <View style={styles.rowBetween}>
        <T v="labelMd" color={colors.textSubtle}>{label}</T>
        {delta != null && delta !== 0 && <Badge label={`${delta > 0 ? '+' : ''}${num(delta, 1)}`} tone={delta > 0 ? 'primary' : 'success'} />}
      </View>
      <T v="metricSm" color={accent ? colors.primary : colors.onSurface}>{value}<T v="bodyMd" color={colors.textMuted}> {unit}</T></T>
      {bar != null && (
        <View style={{ height: 5, borderRadius: 3, backgroundColor: colors.surfaceHighest }}>
          <View style={{ width: `${Math.min(1, bar) * 100}%`, height: '100%', borderRadius: 3, backgroundColor: colors.primary }} />
        </View>
      )}
      {sub && <T v="bodySm" color={colors.textMuted}>{sub}</T>}
    </View>
  );
}

function Pref({ icon, title, sub, value, onChange }: { icon: IconName; title: string; sub: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <Card style={[styles.row, { gap: 12 }]}>
      <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: colors.primaryTint, alignItems: 'center', justifyContent: 'center' }}>
        <Icon name={icon} size={20} color={colors.primary} />
      </View>
      <View style={{ flex: 1 }}>
        <T v="labelLg">{title}</T>
        <T v="bodySm" color={colors.textMuted}>{sub}</T>
      </View>
      <Toggle value={value} onChange={onChange} />
    </Card>
  );
}
