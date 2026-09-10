import React, { useEffect, useMemo, useState } from 'react';
import { Alert, Pressable, Share, StyleSheet, Text, TextInput, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import { Screen, Eyebrow } from '@/components/Screen';
import { FieldRow } from '@/components/FieldRow';
import { QrPreview } from '@/components/QrPreview';
import { useApp } from '@/context/AppContext';
import { encodeProfile, qrToSvg } from '@/lib/encoding';
import { createField, createId, defaultDesign, fieldTemplates } from '@/lib/types';
import type { FieldType, QRProfile, QRStyle } from '@/lib/types';
import qrcode from 'qrcode-generator';

function newProfile(name = 'Untitled profile', types: FieldType[] = []): QRProfile {
  return { id: createId(), name, fields: types.map((type) => createField(type)), design: defaultDesign, favorite: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
}

export default function CreateScreen() {
  const router = useRouter();
  const { profileId } = useLocalSearchParams<{ profileId?: string }>();
  const { colors, t, profiles, upsertProfile, isRTL } = useApp();
  const existing = profileId ? profiles.find((item) => item.id === profileId) : undefined;
  const [profile, setProfile] = useState<QRProfile>(() => existing ? { ...existing, fields: existing.fields.map((field) => ({ ...field })) } : newProfile());
  const [showTemplates, setShowTemplates] = useState(!profileId && !existing);
  const [showDesign, setShowDesign] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (existing) setProfile({ ...existing, fields: existing.fields.map((field) => ({ ...field })) });
  }, [existing?.id]);

  const enabledCount = profile.fields.filter((field) => field.enabled && field.value.trim()).length;
  const encoded = useMemo(() => encodeProfile(profile), [profile]);

  const updateProfile = (patch: Partial<QRProfile>) => setProfile((current) => ({ ...current, ...patch, updatedAt: new Date().toISOString() }));
  const updateField = (id: string, patch: Partial<QRProfile['fields'][number]>) => updateProfile({ fields: profile.fields.map((field) => field.id === id ? { ...field, ...patch } : field) });
  const moveField = (index: number, direction: -1 | 1) => {
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= profile.fields.length) return;
    const next = [...profile.fields];
    [next[index], next[nextIndex]] = [next[nextIndex], next[index]];
    updateProfile({ fields: next });
  };
  const chooseTemplate = (name: string, types: FieldType[]) => {
    setProfile(newProfile(name, types));
    setShowTemplates(false);
  };
  const addCustom = () => updateProfile({ fields: [...profile.fields, createField('custom', 'Custom field')] });
  const save = () => {
    if (!profile.name.trim()) {
      Alert.alert('Name needed', 'Give this QR profile a name before saving.');
      return;
    }
    if (!enabledCount) {
      Alert.alert('Add some information', 'Enable at least one field with a value.');
      return;
    }
    upsertProfile(profile);
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  };
  const share = async () => {
    await Share.share({ message: encoded, title: profile.name });
  };
  const copy = async () => {
    await Clipboard.setStringAsync(encoded);
    Alert.alert('Copied', 'The structured QR content is on your clipboard.');
  };
  const exportSvg = async () => {
    const qr = qrcode(0, profile.design.errorCorrection);
    qr.addData(encoded);
    qr.make();
    const count = qr.getModuleCount();
    const modules = Array.from({ length: count }, (_, row) => Array.from({ length: count }, (_, col) => qr.isDark(row, col) ? 1 : 0));
    const path = `${FileSystem.cacheDirectory ?? ''}${profile.name.replace(/[^a-z0-9]+/gi, '-').toLowerCase() || 'mono-qr'}.svg`;
    await FileSystem.writeAsStringAsync(path, qrToSvg(modules, profile.design.foreground, profile.design.background));
    if (await Sharing.isAvailableAsync()) await Sharing.shareAsync(path, { mimeType: 'image/svg+xml', dialogTitle: 'Export QR' });
    else Alert.alert('SVG ready', path);
  };

  return <Screen>
    <View style={[styles.top, isRTL && styles.rtl]}>
      <Pressable onPress={() => router.back()} style={styles.back}><Feather name="arrow-left" size={20} color={colors.foreground} /></Pressable>
      <View style={{ flex: 1 }}><Eyebrow>{t('create')}</Eyebrow><Text style={[styles.headerTitle, { color: colors.foreground }]}>{profileId ? t('edit') : t('createQr')}</Text></View>
      <Pressable onPress={save} style={[styles.saveButton, { backgroundColor: saved ? colors.accent : colors.primary }]}><Feather name={saved ? 'check' : 'save'} size={16} color={saved ? colors.accentForeground : colors.primaryForeground} /></Pressable>
    </View>

    <View style={[styles.previewCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <QrPreview profile={profile} size={188} />
      <View style={styles.previewCopy}><Text style={[styles.previewName, { color: colors.foreground }]}>{profile.name}</Text><Text style={[styles.previewMeta, { color: colors.mutedForeground }]}>{enabledCount} active fields · updates live</Text></View>
      <View style={styles.previewActions}>
        <Pressable onPress={share} style={[styles.outlineButton, { borderColor: colors.border }]}><Feather name="share-2" size={16} color={colors.foreground} /><Text style={[styles.outlineText, { color: colors.foreground }]}>{t('share')}</Text></Pressable>
        <Pressable onPress={() => void exportSvg()} style={[styles.outlineButton, { borderColor: colors.border }]}><Feather name="download" size={16} color={colors.foreground} /><Text style={[styles.outlineText, { color: colors.foreground }]}>{t('export')}</Text></Pressable>
      </View>
    </View>

    <Text style={[styles.sectionLabel, { color: colors.mutedForeground, textAlign: isRTL ? 'right' : 'left' }]}>{t('profileName')}</Text>
    <TextInput value={profile.name} onChangeText={(name) => updateProfile({ name })} placeholder="e.g. Ahmed — Business card" placeholderTextColor={colors.mutedForeground} style={[styles.nameInput, { borderColor: colors.input, backgroundColor: colors.card, color: colors.foreground, textAlign: isRTL ? 'right' : 'left' }]} />

    <View style={[styles.sectionHeader, isRTL && styles.rtl]}><Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>{t('fields')}</Text><Text style={[styles.helper, { color: colors.mutedForeground }]}>{profile.fields.length} total</Text></View>
    {profile.fields.map((field, index) => <FieldRow key={field.id} field={field} colors={colors} isRTL={isRTL} onChange={(patch) => updateField(field.id, patch)} onDelete={() => updateProfile({ fields: profile.fields.filter((item) => item.id !== field.id) })} onMove={(direction) => moveField(index, direction)} />)}
    <Pressable onPress={addCustom} style={[styles.addCustom, { borderColor: colors.primary }]}><Feather name="plus" size={17} color={colors.primary} /><Text style={[styles.addText, { color: colors.primary }]}>{t('addCustom')}</Text></Pressable>
    <Pressable onPress={() => setShowTemplates(true)} style={[styles.secondaryLink, isRTL && styles.rtl]}><Feather name="layers" size={16} color={colors.mutedForeground} /><Text style={[styles.secondaryText, { color: colors.mutedForeground }]}>{t('chooseTemplate')}</Text></Pressable>

    <Pressable onPress={() => setShowDesign((value) => !value)} style={[styles.designHeader, { borderColor: colors.border }, isRTL && styles.rtl]}><View style={[styles.designIcon, { backgroundColor: colors.accent }]}><Feather name="sliders" size={17} color={colors.accentForeground} /></View><View style={{ flex: 1 }}><Text style={[styles.designTitle, { color: colors.foreground }]}>{t('customize')}</Text><Text style={[styles.designSubtitle, { color: colors.mutedForeground }]}>Style, contrast and scan reliability</Text></View><Feather name={showDesign ? 'chevron-up' : 'chevron-down'} size={18} color={colors.mutedForeground} /></Pressable>
    {showDesign ? <DesignPanel profile={profile} colors={colors} isRTL={isRTL} onChange={(design) => updateProfile({ design })} /> : null}

    <View style={[styles.warning, { backgroundColor: colors.accent }]}><Feather name="shield" size={15} color={colors.accentForeground} /><Text style={[styles.warningText, { color: colors.accentForeground }]}>{t('contrastWarning')}</Text></View>
    <Pressable onPress={copy} style={[styles.copyButton, { backgroundColor: colors.secondary }]}><Feather name="copy" size={16} color={colors.secondaryForeground} /><Text style={[styles.copyText, { color: colors.secondaryForeground }]}>{t('copy')} encoded content</Text></Pressable>

    {showTemplates ? <TemplateSheet colors={colors} t={t} onClose={() => setShowTemplates(false)} onSelect={chooseTemplate} /> : null}
  </Screen>;
}

function DesignPanel({ profile, colors, isRTL, onChange }: { profile: QRProfile; colors: any; isRTL: boolean; onChange: (design: QRProfile['design']) => void }) {
  const styles: QRStyle[] = ['classic', 'rounded', 'dots', 'modern'];
  return <View style={[panelStyles.panel, { backgroundColor: colors.card, borderColor: colors.border }]}>
    <Text style={[panelStyles.label, { color: colors.mutedForeground, textAlign: isRTL ? 'right' : 'left' }]}>QR style</Text>
    <View style={panelStyles.chips}>{styles.map((style) => <Pressable key={style} onPress={() => onChange({ ...profile.design, style })} style={[panelStyles.chip, { backgroundColor: profile.design.style === style ? colors.primary : colors.secondary }]}><Text style={{ color: profile.design.style === style ? colors.primaryForeground : colors.secondaryForeground, fontSize: 12, fontWeight: '700' }}>{style[0].toUpperCase() + style.slice(1)}</Text></Pressable>)}</View>
    <Text style={[panelStyles.label, { color: colors.mutedForeground, textAlign: isRTL ? 'right' : 'left' }]}>Professional presets</Text>
    <View style={panelStyles.swatches}>{[['#111214', '#ffffff'], ['#12312f', '#eef8f5'], ['#233044', '#f7efe2'], ['#3a1f32', '#f8eef4']].map(([foreground, background]) => <Pressable key={foreground} onPress={() => onChange({ ...profile.design, foreground, background })} style={[panelStyles.swatch, { backgroundColor: background, borderColor: profile.design.foreground === foreground ? colors.tint : colors.border }]}><View style={[panelStyles.swatchDot, { backgroundColor: foreground }]} /></Pressable>)}</View>
    <Text style={[panelStyles.label, { color: colors.mutedForeground, textAlign: isRTL ? 'right' : 'left' }]}>Error correction</Text>
    <View style={panelStyles.chips}>{(['L', 'M', 'Q', 'H'] as const).map((level) => <Pressable key={level} onPress={() => onChange({ ...profile.design, errorCorrection: level })} style={[panelStyles.chip, { backgroundColor: profile.design.errorCorrection === level ? colors.primary : colors.secondary }]}><Text style={{ color: profile.design.errorCorrection === level ? colors.primaryForeground : colors.secondaryForeground, fontSize: 12, fontWeight: '700' }}>{level}</Text></Pressable>)}</View>
  </View>;
}

function TemplateSheet({ colors, t, onClose, onSelect }: { colors: any; t: (key: any) => string; onClose: () => void; onSelect: (name: string, types: FieldType[]) => void }) {
  return <View style={[sheetStyles.sheet, { backgroundColor: colors.card, borderColor: colors.border }]}><View style={sheetStyles.sheetHeader}><Text style={[sheetStyles.sheetTitle, { color: colors.foreground }]}>{t('chooseTemplate')}</Text><Pressable onPress={onClose}><Feather name="x" size={20} color={colors.mutedForeground} /></Pressable></View>
    <TemplateButton icon="edit-3" title={t('startBlank')} description="Choose every field yourself" colors={colors} onPress={() => onSelect('Untitled profile', [])} />
    <TemplateButton icon="briefcase" title={t('businessCard')} description="Name, company, phone, email and website" colors={colors} onPress={() => onSelect('Business card', ['name', 'company', 'job', 'phone', 'email', 'website'])} />
    <TemplateButton icon="calendar" title={t('event')} description="Event name, place, date and details" colors={colors} onPress={() => onSelect('Event', ['calendar', 'address', 'maps', 'text'])} />
    <TemplateButton icon="wifi" title={t('wifi')} description="Share Wi-Fi details with a single scan" colors={colors} onPress={() => onSelect('Wi-Fi access', ['wifi'])} />
  </View>;
}

function TemplateButton({ icon, title, description, colors, onPress }: { icon: keyof typeof Feather.glyphMap; title: string; description: string; colors: any; onPress: () => void }) {
  return <Pressable onPress={onPress} style={({ pressed }) => [sheetStyles.template, { borderColor: colors.border, opacity: pressed ? 0.7 : 1 }]}><View style={[sheetStyles.templateIcon, { backgroundColor: colors.accent }]}><Feather name={icon} size={17} color={colors.accentForeground} /></View><View style={{ flex: 1 }}><Text style={[sheetStyles.templateTitle, { color: colors.foreground }]}>{title}</Text><Text style={[sheetStyles.templateDesc, { color: colors.mutedForeground }]}>{description}</Text></View><Feather name="chevron-right" size={17} color={colors.mutedForeground} /></Pressable>;
}

const styles = StyleSheet.create({
  top: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 20 }, rtl: { flexDirection: 'row-reverse' }, back: { width: 38, height: 38, borderRadius: 13, alignItems: 'center', justifyContent: 'center' }, headerTitle: { fontSize: 24, fontWeight: '800' }, saveButton: { width: 40, height: 40, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  previewCard: { borderWidth: 1, borderRadius: 22, alignItems: 'center', paddingVertical: 18, marginBottom: 22 }, previewCopy: { alignItems: 'center', marginTop: 12 }, previewName: { fontSize: 16, fontWeight: '800' }, previewMeta: { fontSize: 12, marginTop: 4 }, previewActions: { flexDirection: 'row', gap: 8, marginTop: 14 }, outlineButton: { borderWidth: 1, borderRadius: 11, paddingHorizontal: 13, paddingVertical: 9, flexDirection: 'row', gap: 7, alignItems: 'center' }, outlineText: { fontSize: 12, fontWeight: '700' }, sectionLabel: { fontSize: 12, textTransform: 'uppercase', letterSpacing: 1.1, fontWeight: '800', marginBottom: 9 }, nameInput: { borderWidth: 1, borderRadius: 13, paddingHorizontal: 14, minHeight: 48, fontSize: 14, marginBottom: 22 }, sectionHeader: { flexDirection: 'row', justifyContent: 'space-between' }, helper: { fontSize: 12 }, addCustom: { borderWidth: 1, borderStyle: 'dashed', minHeight: 47, borderRadius: 13, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 7, marginTop: 2 }, addText: { fontSize: 13, fontWeight: '800' }, secondaryLink: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7, paddingVertical: 18 }, secondaryText: { fontSize: 12, fontWeight: '700' }, designHeader: { borderWidth: 1, borderRadius: 17, padding: 13, flexDirection: 'row', alignItems: 'center', gap: 11 }, designIcon: { width: 35, height: 35, borderRadius: 11, alignItems: 'center', justifyContent: 'center' }, designTitle: { fontSize: 14, fontWeight: '800' }, designSubtitle: { fontSize: 12, marginTop: 2 }, warning: { borderRadius: 12, padding: 11, flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 15 }, warningText: { fontSize: 12, flex: 1, lineHeight: 17 }, copyButton: { minHeight: 45, borderRadius: 13, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 7, marginTop: 9 }, copyText: { fontSize: 12, fontWeight: '700' },
});
const panelStyles = StyleSheet.create({ panel: { borderWidth: 1, borderRadius: 17, padding: 14, marginTop: 9, gap: 11 }, label: { fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, fontWeight: '800' }, chips: { flexDirection: 'row', gap: 7, flexWrap: 'wrap' }, chip: { borderRadius: 10, paddingHorizontal: 12, paddingVertical: 9 }, swatches: { flexDirection: 'row', gap: 10 }, swatch: { width: 42, height: 34, borderRadius: 10, borderWidth: 2, alignItems: 'center', justifyContent: 'center' }, swatchDot: { width: 15, height: 15, borderRadius: 8 } });
const sheetStyles = StyleSheet.create({ sheet: { borderWidth: 1, borderRadius: 20, padding: 14, marginTop: 18, gap: 9 }, sheetHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 3 }, sheetTitle: { fontSize: 17, fontWeight: '800' }, template: { flexDirection: 'row', alignItems: 'center', gap: 11, paddingVertical: 11 }, templateIcon: { width: 38, height: 38, borderRadius: 13, alignItems: 'center', justifyContent: 'center' }, templateTitle: { fontSize: 14, fontWeight: '800' }, templateDesc: { fontSize: 12, marginTop: 3 } });