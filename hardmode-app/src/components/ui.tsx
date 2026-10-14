import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { ReactNode } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors, radius, space } from '../theme';

export function haptic(kind: 'success' | 'light' = 'light') {
  if (Platform.OS === 'web') return;
  if (kind === 'success') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  else Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
}

export function Screen({ children, scroll = true }: { children: ReactNode; scroll?: boolean }) {
  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      {scroll ? (
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          {children}
        </ScrollView>
      ) : (
        <View style={[styles.content, { flex: 1 }]}>{children}</View>
      )}
    </SafeAreaView>
  );
}

export function Title({ kicker, children, right }: { kicker?: string; children: ReactNode; right?: ReactNode }) {
  return (
    <View style={styles.titleRow}>
      <View style={{ flex: 1 }}>
        {kicker ? <Text style={styles.kicker}>{kicker}</Text> : null}
        <Text style={styles.title}>{children}</Text>
      </View>
      {right}
    </View>
  );
}

export function Card({ children, style, accent }: { children: ReactNode; style?: ViewStyle; accent?: boolean }) {
  return <View style={[styles.card, accent && styles.cardAccent, style]}>{children}</View>;
}

export function Label({ children, color = colors.textDim }: { children: ReactNode; color?: string }) {
  return <Text style={[styles.label, { color }]}>{children}</Text>;
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  icon,
  disabled,
}: {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'ghost' | 'success';
  icon?: keyof typeof Ionicons.glyphMap;
  disabled?: boolean;
}) {
  const bg = variant === 'primary' ? colors.accent : variant === 'success' ? colors.success : 'transparent';
  const fg = variant === 'ghost' ? colors.text : '#0A0A0B';
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: bg, opacity: disabled ? 0.4 : pressed ? 0.8 : 1 },
        variant === 'ghost' && styles.buttonGhost,
      ]}>
      {icon ? <Ionicons name={icon} size={18} color={fg} /> : null}
      <Text style={[styles.buttonText, { color: fg }]}>{title}</Text>
    </Pressable>
  );
}

export function CheckRow({
  title,
  done,
  onPress,
  right,
}: {
  title: string;
  done: boolean;
  onPress: () => void;
  right?: ReactNode;
}) {
  return (
    <Pressable
      onPress={() => {
        haptic(done ? 'light' : 'success');
        onPress();
      }}
      style={({ pressed }) => [styles.checkRow, pressed && { opacity: 0.7 }]}>
      <View style={[styles.checkbox, done && styles.checkboxDone]}>
        {done ? <Ionicons name="checkmark" size={16} color="#0A0A0B" /> : null}
      </View>
      <Text style={[styles.checkText, done && styles.checkTextDone]}>{title}</Text>
      {right}
    </Pressable>
  );
}

export function ProgressBar({ value, color = colors.accent }: { value: number; color?: string }) {
  return (
    <View style={styles.barTrack}>
      <View style={[styles.barFill, { width: `${Math.min(100, Math.max(0, value * 100))}%`, backgroundColor: color }]} />
    </View>
  );
}

export function Stat({ value, label, color = colors.text }: { value: string | number; label: string; color?: string }) {
  return (
    <View style={styles.stat}>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

export const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  content: { padding: space(5), paddingBottom: space(12), gap: space(4) },
  titleRow: { flexDirection: 'row', alignItems: 'flex-end', marginBottom: space(1) },
  kicker: { color: colors.accent, fontSize: 12, fontWeight: '800', letterSpacing: 2, textTransform: 'uppercase' },
  title: { color: colors.text, fontSize: 32, fontWeight: '900', letterSpacing: -0.5, marginTop: 2 },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: space(4),
    gap: space(3),
  },
  cardAccent: { borderColor: colors.accent, backgroundColor: colors.accentDim },
  label: { fontSize: 12, fontWeight: '700', letterSpacing: 1.5, textTransform: 'uppercase' },
  h2: { color: colors.text, fontSize: 22, fontWeight: '800' },
  body: { color: colors.textDim, fontSize: 15, lineHeight: 22 },
  button: {
    flexDirection: 'row',
    gap: space(2),
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: space(3.5),
    paddingHorizontal: space(5),
    borderRadius: radius.sm,
  },
  buttonGhost: { borderWidth: 1, borderColor: colors.border },
  buttonText: { fontSize: 16, fontWeight: '800', letterSpacing: 0.3 },
  checkRow: { flexDirection: 'row', alignItems: 'center', gap: space(3), paddingVertical: space(2) },
  checkbox: {
    width: 26,
    height: 26,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: colors.textFaint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxDone: { backgroundColor: colors.success, borderColor: colors.success },
  checkText: { color: colors.text, fontSize: 16, flex: 1, fontWeight: '600' },
  checkTextDone: { color: colors.textFaint, textDecorationLine: 'line-through' },
  barTrack: { height: 8, borderRadius: 4, backgroundColor: colors.surfaceAlt, overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 4 },
  stat: { flex: 1, alignItems: 'center', gap: 2 },
  statValue: { fontSize: 28, fontWeight: '900' },
  statLabel: { color: colors.textDim, fontSize: 11, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase' },
  input: {
    backgroundColor: colors.surfaceAlt,
    color: colors.text,
    borderRadius: radius.sm,
    paddingHorizontal: space(4),
    paddingVertical: space(3),
    fontSize: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
});
