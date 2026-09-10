import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Screen, Eyebrow, PageTitle } from '@/components/Screen';
import { useApp } from '@/context/AppContext';
import type { Language, ThemeMode } from '@/lib/types';

export default function SettingsScreen() {
  const { colors, t, settings, setThemeMode, setLanguage, isRTL } = useApp();
  return <Screen><Eyebrow>{t('settings')}</Eyebrow><PageTitle subtitle="Make Mono Chrome QR yours.">Settings</PageTitle>
    <Text style={[styles.section, { color: colors.mutedForeground, textAlign: isRTL ? 'right' : 'left' }]}>{t('appearance')}</Text>
    <SettingCard icon="sun" title={t('appearance')} subtitle={settings.themeMode === 'system' ? t('system') : settings.themeMode === 'dark' ? t('dark') : t('light')} colors={colors}><Segment options={[['system', t('system')], ['light', t('light')], ['dark', t('dark')]]} value={settings.themeMode} onChange={(value) => setThemeMode(value as ThemeMode)} colors={colors} /></SettingCard>
    <Text style={[styles.section, { color: colors.mutedForeground, textAlign: isRTL ? 'right' : 'left' }]}>{t('language')}</Text>
    <SettingCard icon="globe" title={t('language')} subtitle={settings.language === 'ar' ? 'العربية · RTL' : 'English'} colors={colors}><Segment options={[['en', 'English'], ['ar', 'العربية']]} value={settings.language} onChange={(value) => setLanguage(value as Language)} colors={colors} /></SettingCard>
    <View style={[styles.privacy, { backgroundColor: colors.accent }]}><View style={[styles.privacyIcon, { backgroundColor: colors.primary }]}><Feather name="shield" size={17} color={colors.primaryForeground} /></View><View style={{ flex: 1 }}><Text style={[styles.privacyTitle, { color: colors.accentForeground }]}>{t('privacy')}</Text><Text style={[styles.privacyText, { color: colors.accentForeground }]}>{t('privacyText')}</Text></View></View>
    <View style={styles.about}><Text style={[styles.aboutName, { color: colors.foreground }]}>MONO CHROME QR</Text><Text style={[styles.aboutMeta, { color: colors.mutedForeground }]}>Version 1.0 · Built for private sharing</Text><Text style={[styles.aboutMeta, { color: colors.mutedForeground }]}>Profiles, scan results and preferences never leave this device.</Text></View>
  </Screen>;
}

function SettingCard({ icon, title, subtitle, colors, children }: { icon: keyof typeof Feather.glyphMap; title: string; subtitle: string; colors: any; children: React.ReactNode }) {
  return <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}><View style={styles.row}><View style={[styles.icon, { backgroundColor: colors.accent }]}><Feather name={icon} size={17} color={colors.accentForeground} /></View><View style={{ flex: 1 }}><Text style={[styles.title, { color: colors.foreground }]}>{title}</Text><Text style={[styles.subtitle, { color: colors.mutedForeground }]}>{subtitle}</Text></View></View><View style={{ marginTop: 14 }}>{children}</View></View>;
}
function Segment({ options, value, onChange, colors }: { options: Array<[string, string]>; value: string; onChange: (value: string) => void; colors: any }) {
  return <View style={[styles.segment, { backgroundColor: colors.secondary }]}>{options.map(([key, label]) => <Pressable key={key} onPress={() => onChange(key)} style={[styles.segmentItem, value === key && { backgroundColor: colors.card }]}><Text style={{ color: value === key ? colors.foreground : colors.mutedForeground, fontSize: 12, fontWeight: '700' }}>{label}</Text></Pressable>)}</View>;
}
const styles = StyleSheet.create({ section: { fontSize: 11, letterSpacing: 1.1, textTransform: 'uppercase', fontWeight: '800', marginBottom: 10 }, card: { borderWidth: 1, borderRadius: 18, padding: 14, marginBottom: 22 }, row: { flexDirection: 'row', gap: 11, alignItems: 'center' }, icon: { width: 36, height: 36, borderRadius: 12, alignItems: 'center', justifyContent: 'center' }, title: { fontSize: 14, fontWeight: '800' }, subtitle: { fontSize: 12, marginTop: 3 }, segment: { borderRadius: 12, padding: 3, flexDirection: 'row', gap: 3 }, segmentItem: { flex: 1, paddingVertical: 9, borderRadius: 9, alignItems: 'center', justifyContent: 'center' }, privacy: { borderRadius: 18, padding: 15, flexDirection: 'row', gap: 11, alignItems: 'center', marginBottom: 28 }, privacyIcon: { width: 35, height: 35, borderRadius: 12, alignItems: 'center', justifyContent: 'center' }, privacyTitle: { fontSize: 14, fontWeight: '800' }, privacyText: { fontSize: 12, lineHeight: 17, marginTop: 3 }, about: { alignItems: 'center', gap: 6 }, aboutName: { fontSize: 13, fontWeight: '800', letterSpacing: 1.6 }, aboutMeta: { fontSize: 11, textAlign: 'center' } });