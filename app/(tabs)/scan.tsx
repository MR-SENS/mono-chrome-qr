import React, { useState } from 'react';
import { Alert, Linking, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as Clipboard from 'expo-clipboard';
import { Feather } from '@expo/vector-icons';
import { Screen, Eyebrow, PageTitle } from '@/components/Screen';
import { useApp } from '@/context/AppContext';
import { decodePayload, getFieldActionUrl } from '@/lib/encoding';
import type { DecodedQR, QRField } from '@/lib/types';

export default function ScanScreen() {
  const { colors, t, isRTL } = useApp();
  const [permission, requestPermission] = useCameraPermissions();
  const [decoded, setDecoded] = useState<DecodedQR | null>(null);
  const [manual, setManual] = useState('');
  const [scanned, setScanned] = useState(false);

  const onScan = ({ data }: { data: string }) => {
    if (scanned) return;
    setScanned(true);
    setDecoded(decodePayload(data));
  };
  const open = (field: QRField) => {
    const url = getFieldActionUrl(field);
    if (!url) return;
    Alert.alert('Open external link?', 'Only continue if you recognize and trust this destination.', [{ text: t('cancel'), style: 'cancel' }, { text: t('open'), onPress: () => void Linking.openURL(url) }]);
  };
  const submitManual = () => {
    if (manual.trim()) {
      setDecoded(decodePayload(manual.trim()));
      setScanned(true);
    }
  };
  return <Screen>
    <Eyebrow>{t('scan')}</Eyebrow>
    <PageTitle subtitle={t('scanHint')}>Scan any QR.</PageTitle>
    {Platform.OS === 'web' ? <View style={[styles.webFallback, { backgroundColor: colors.card, borderColor: colors.border }]}><Feather name="camera-off" size={22} color={colors.mutedForeground} /><Text style={[styles.webText, { color: colors.mutedForeground }]}>Camera preview is available on Android. Paste a QR payload here to preview the decoder.</Text></View> : permission?.granted ? <View style={styles.cameraWrap}><CameraView style={styles.camera} facing="back" barcodeScannerSettings={{ barcodeTypes: ['qr'] }} onBarcodeScanned={scanned ? undefined : onScan}><View style={styles.focus}><View style={styles.corner} /><View style={[styles.corner, styles.cornerTR]} /><View style={[styles.corner, styles.cornerBL]} /><View style={[styles.corner, styles.cornerBR]} /></View></CameraView></View> : <View style={[styles.permission, { backgroundColor: colors.card, borderColor: colors.border }]}><Feather name="camera" size={26} color={colors.accentForeground} /><Text style={[styles.permissionTitle, { color: colors.foreground }]}>{t('cameraPermission')}</Text><Pressable onPress={() => void requestPermission()} style={[styles.primary, { backgroundColor: colors.primary }]}><Text style={{ color: colors.primaryForeground, fontWeight: '800', fontSize: 13 }}>{t('grantCamera')}</Text></Pressable></View>}
    {scanned ? <Pressable onPress={() => { setScanned(false); setDecoded(null); }} style={[styles.rescan, { borderColor: colors.border }]}><Feather name="refresh-cw" size={15} color={colors.foreground} /><Text style={[styles.rescanText, { color: colors.foreground }]}>Scan another</Text></Pressable> : null}
    <View style={[styles.manual, { borderColor: colors.border, backgroundColor: colors.card }]}><TextInput value={manual} onChangeText={setManual} placeholder={t('pasteCode')} placeholderTextColor={colors.mutedForeground} multiline style={[styles.manualInput, { color: colors.foreground, textAlign: isRTL ? 'right' : 'left' }]} /><Pressable onPress={submitManual} style={[styles.manualButton, { backgroundColor: colors.secondary }]}><Feather name="arrow-right" size={17} color={colors.secondaryForeground} /></Pressable></View>
    {decoded ? <DecodedCard decoded={decoded} colors={colors} t={t} onOpen={open} onCopy={(value) => { void Clipboard.setStringAsync(value); Alert.alert('Copied', 'Value copied to clipboard.'); }} /> : null}
  </Screen>;
}

function DecodedCard({ decoded, colors, t, onOpen, onCopy }: { decoded: DecodedQR; colors: any; t: (key: any) => string; onOpen: (field: QRField) => void; onCopy: (value: string) => void }) {
  return <View style={[styles.decoded, { backgroundColor: colors.card, borderColor: colors.border }]}><View style={styles.decodedHeader}><View style={[styles.decodedBadge, { backgroundColor: colors.accent }]}><Feather name={decoded.isMono ? 'layers' : 'link'} size={15} color={colors.accentForeground} /></View><View style={{ flex: 1 }}><Text style={[styles.decodedTitle, { color: colors.foreground }]}>{decoded.profileName ?? t('decoded')}</Text><Text style={[styles.decodedMeta, { color: colors.mutedForeground }]}>{decoded.isMono ? `${decoded.fields.length} fields` : 'Standard QR content'}</Text></View></View>{decoded.fields.length ? decoded.fields.map((field) => <View key={field.id} style={[styles.decodedRow, { borderTopColor: colors.border }]}><View style={{ flex: 1 }}><Text style={[styles.fieldLabel, { color: colors.mutedForeground }]}>{field.label}</Text><Text style={[styles.fieldValue, { color: colors.foreground }]} numberOfLines={2}>{field.value}</Text></View>{getFieldActionUrl(field) ? <Pressable onPress={() => onOpen(field)} style={[styles.rowAction, { backgroundColor: colors.accent }]}><Feather name="external-link" size={14} color={colors.accentForeground} /></Pressable> : null}<Pressable onPress={() => onCopy(field.value)} style={[styles.rowAction, { backgroundColor: colors.secondary }]}><Feather name="copy" size={14} color={colors.secondaryForeground} /></Pressable></View>) : <Text style={[styles.raw, { color: colors.foreground }]}>{decoded.raw}</Text>}</View>;
}

const styles = StyleSheet.create({
  cameraWrap: { height: 310, borderRadius: 24, overflow: 'hidden', backgroundColor: '#111', marginBottom: 12 }, camera: { flex: 1 }, focus: { flex: 1, margin: 50, position: 'relative' }, corner: { position: 'absolute', top: 0, left: 0, width: 38, height: 38, borderTopWidth: 3, borderLeftWidth: 3, borderColor: '#fff', borderTopLeftRadius: 10 }, cornerTR: { left: undefined, right: 0, borderLeftWidth: 0, borderRightWidth: 3, borderTopLeftRadius: 0, borderTopRightRadius: 10 }, cornerBL: { top: undefined, bottom: 0, borderTopWidth: 0, borderBottomWidth: 3, borderTopLeftRadius: 0, borderBottomLeftRadius: 10 }, cornerBR: { top: undefined, left: undefined, right: 0, bottom: 0, borderTopWidth: 0, borderLeftWidth: 0, borderRightWidth: 3, borderBottomWidth: 3, borderTopLeftRadius: 0, borderBottomRightRadius: 10 }, permission: { borderWidth: 1, borderRadius: 20, minHeight: 210, alignItems: 'center', justifyContent: 'center', gap: 14, padding: 24 }, permissionTitle: { fontSize: 15, fontWeight: '700', textAlign: 'center' }, primary: { borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12 }, webFallback: { borderWidth: 1, borderRadius: 20, padding: 24, gap: 10, alignItems: 'center' }, webText: { textAlign: 'center', lineHeight: 19, fontSize: 13 }, rescan: { borderWidth: 1, borderRadius: 12, padding: 11, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 7, marginBottom: 12 }, rescanText: { fontWeight: '700', fontSize: 12 }, manual: { borderWidth: 1, borderRadius: 15, padding: 8, flexDirection: 'row', alignItems: 'center', marginBottom: 18 }, manualInput: { flex: 1, minHeight: 40, maxHeight: 76, paddingHorizontal: 8, fontSize: 13 }, manualButton: { width: 34, height: 34, borderRadius: 11, alignItems: 'center', justifyContent: 'center' }, decoded: { borderWidth: 1, borderRadius: 20, padding: 14 }, decodedHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 4 }, decodedBadge: { width: 34, height: 34, borderRadius: 11, alignItems: 'center', justifyContent: 'center' }, decodedTitle: { fontSize: 16, fontWeight: '800' }, decodedMeta: { fontSize: 12, marginTop: 2 }, decodedRow: { borderTopWidth: 1, paddingVertical: 12, flexDirection: 'row', alignItems: 'center', gap: 7 }, fieldLabel: { fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.7 }, fieldValue: { fontSize: 14, marginTop: 4 }, rowAction: { width: 30, height: 30, borderRadius: 10, alignItems: 'center', justifyContent: 'center' }, raw: { lineHeight: 20, fontSize: 13, marginTop: 9 },
});