import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { Screen, Eyebrow, PageTitle } from '@/components/Screen';
import { useApp } from '@/context/AppContext';
import { QrPreview } from '@/components/QrPreview';
import type { QRProfile } from '@/lib/types';

function Action({ icon, title, subtitle, onPress, colors }: { icon: keyof typeof Feather.glyphMap; title: string; subtitle: string; onPress: () => void; colors: any }) {
  return <Pressable onPress={onPress} style={({ pressed }) => [styles.action, { backgroundColor: colors.card, borderColor: colors.border, opacity: pressed ? 0.72 : 1 }]}>
    <View style={[styles.actionIcon, { backgroundColor: colors.accent }]}><Feather name={icon} size={19} color={colors.accentForeground} /></View>
    <View style={{ flex: 1 }}><Text style={[styles.actionTitle, { color: colors.foreground }]}>{title}</Text><Text style={[styles.actionSubtitle, { color: colors.mutedForeground }]}>{subtitle}</Text></View>
    <Feather name="arrow-up-right" size={17} color={colors.mutedForeground} />
  </Pressable>;
}

export default function HomeScreen() {
  const router = useRouter();
  const { colors, t, profiles, isRTL } = useApp();
  const recent = profiles.slice(0, 3);
  return <Screen>
    <View style={[styles.brandRow, isRTL && styles.rtl]}>
      <View><Eyebrow>MONO CHROME QR</Eyebrow><Text style={[styles.tagline, { color: colors.foreground }]}>{t('createSubtitle')}</Text></View>
      <View style={[styles.mark, { backgroundColor: colors.primary }]}><Feather name="maximize" size={20} color={colors.primaryForeground} /></View>
    </View>
    <PageTitle subtitle="Create. Scan. Share.">Your QR, in one profile.</PageTitle>
    <Text style={[styles.sectionLabel, { color: colors.mutedForeground, textAlign: isRTL ? 'right' : 'left' }]}>{t('quickActions')}</Text>
    <View style={styles.actions}>
      <Action colors={colors} icon="plus" title={t('createQr')} subtitle="Build a multi-content profile" onPress={() => router.push('/create')} />
      <Action colors={colors} icon="camera" title={t('scanQr')} subtitle="Read any QR, instantly" onPress={() => router.push('/scan')} />
    </View>
    <View style={[styles.sectionHeader, isRTL && styles.rtl]}><Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>{t('recentProfiles')}</Text>{profiles.length > 3 ? <Pressable onPress={() => router.push('/history')}><Text style={[styles.seeAll, { color: colors.accentForeground }]}>{t('seeAll')}</Text></Pressable> : null}</View>
    {recent.length === 0 ? <View style={[styles.empty, { backgroundColor: colors.card, borderColor: colors.border }]}><Feather name="layers" size={22} color={colors.mutedForeground} /><Text style={[styles.emptyTitle, { color: colors.foreground }]}>{t('noProfiles')}</Text><Text style={[styles.emptyText, { color: colors.mutedForeground }]}>{t('historySubtitle')}</Text></View> : recent.map((profile) => <ProfilePreview key={profile.id} profile={profile} colors={colors} onPress={() => router.push({ pathname: '/create', params: { profileId: profile.id } })} />)}
  </Screen>;
}

function ProfilePreview({ profile, colors, onPress }: { profile: QRProfile; colors: any; onPress: () => void }) {
  return <Pressable onPress={onPress} style={({ pressed }) => [styles.profile, { backgroundColor: colors.card, borderColor: colors.border, opacity: pressed ? 0.78 : 1 }]}>
    <QrPreview profile={profile} size={74} />
    <View style={{ flex: 1, gap: 5 }}><Text style={[styles.profileName, { color: colors.foreground }]}>{profile.name}</Text><Text style={[styles.profileMeta, { color: colors.mutedForeground }]}>{profile.fields.filter((field) => field.enabled && field.value).length} fields · {new Date(profile.updatedAt).toLocaleDateString()}</Text></View>
    <Feather name="chevron-right" size={18} color={colors.mutedForeground} />
  </Pressable>;
}

const styles = StyleSheet.create({
  brandRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 },
  rtl: { flexDirection: 'row-reverse' },
  tagline: { fontSize: 14, lineHeight: 20, maxWidth: 250 },
  mark: { width: 46, height: 46, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  sectionLabel: { fontSize: 12, letterSpacing: 1.1, textTransform: 'uppercase', fontWeight: '800', marginBottom: 11 },
  actions: { gap: 10, marginBottom: 28 },
  action: { borderRadius: 17, borderWidth: 1, minHeight: 74, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 12 },
  actionIcon: { width: 40, height: 40, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  actionTitle: { fontSize: 15, fontWeight: '800' },
  actionSubtitle: { fontSize: 12, marginTop: 3 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  seeAll: { fontSize: 12, fontWeight: '800', marginBottom: 11 },
  empty: { borderWidth: 1, borderRadius: 18, padding: 24, alignItems: 'center', gap: 8 },
  emptyTitle: { fontSize: 15, fontWeight: '800', marginTop: 4 },
  emptyText: { fontSize: 13, textAlign: 'center', lineHeight: 19 },
  profile: { borderWidth: 1, borderRadius: 18, padding: 12, flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 10 },
  profileName: { fontSize: 15, fontWeight: '800' },
  profileMeta: { fontSize: 12 },
});