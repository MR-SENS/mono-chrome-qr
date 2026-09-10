import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '@/context/AppContext';

export function Screen({ children, scroll = true }: { children: React.ReactNode; scroll?: boolean }) {
  const insets = useSafeAreaInsets();
  const { colors, isRTL } = useApp();
  const content = <View style={[styles.content, { paddingTop: insets.top + 18, paddingBottom: insets.bottom + 92, backgroundColor: colors.background }, isRTL && styles.rtl]}>{children}</View>;
  return scroll ? <ScrollView style={{ backgroundColor: colors.background }} contentContainerStyle={{ minHeight: '100%' }} showsVerticalScrollIndicator={false}>{content}</ScrollView> : content;
}

export function Eyebrow({ children }: { children: React.ReactNode }) {
  const { colors, isRTL } = useApp();
  return <Text style={[styles.eyebrow, { color: colors.mutedForeground, textAlign: isRTL ? 'right' : 'left' }]}>{children}</Text>;
}

export function PageTitle({ children, subtitle }: { children: React.ReactNode; subtitle?: string }) {
  const { colors, isRTL } = useApp();
  return <View style={{ marginBottom: 24 }}><Text style={[styles.title, { color: colors.foreground, textAlign: isRTL ? 'right' : 'left' }]}>{children}</Text>{subtitle ? <Text style={[styles.subtitle, { color: colors.mutedForeground, textAlign: isRTL ? 'right' : 'left' }]}>{subtitle}</Text> : null}</View>;
}

const styles = StyleSheet.create({
  content: { flexGrow: 1, paddingHorizontal: 20 },
  rtl: {},
  eyebrow: { fontSize: 11, letterSpacing: 1.6, textTransform: 'uppercase', fontWeight: '700', marginBottom: 8 },
  title: { fontSize: 31, fontWeight: '800', letterSpacing: -0.8 },
  subtitle: { fontSize: 15, lineHeight: 22, marginTop: 8 },
});