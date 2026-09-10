import React from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import type { QRField } from '@/lib/types';

type Props = {
  field: QRField;
  colors: any;
  isRTL: boolean;
  onChange: (patch: Partial<QRField>) => void;
  onDelete: () => void;
  onMove: (direction: -1 | 1) => void;
};

export function FieldRow({ field, colors, isRTL, onChange, onDelete, onMove }: Props) {
  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }, isRTL && styles.rtl]}>
      <View style={styles.header}>
        <View style={[styles.labelRow, isRTL && styles.rtl]}>
          <View style={[styles.icon, { backgroundColor: colors.accent }]}>
            <Feather name={(field.icon ?? 'plus') as keyof typeof Feather.glyphMap} size={16} color={colors.accentForeground} />
          </View>
          <TextInput
            value={field.label}
            onChangeText={(label) => onChange({ label })}
            placeholder="Field name"
            placeholderTextColor={colors.mutedForeground}
            style={[styles.label, { color: colors.foreground, textAlign: isRTL ? 'right' : 'left' }]}
          />
        </View>
        <View style={styles.actions}>
          <Pressable onPress={() => onMove(-1)} hitSlop={8}><Feather name="chevron-up" size={17} color={colors.mutedForeground} /></Pressable>
          <Pressable onPress={() => onMove(1)} hitSlop={8}><Feather name="chevron-down" size={17} color={colors.mutedForeground} /></Pressable>
          <Pressable onPress={onDelete} hitSlop={8}><Feather name="trash-2" size={16} color={colors.destructive} /></Pressable>
        </View>
      </View>
      <View style={[styles.inputWrap, { borderColor: colors.input }]}>
        <TextInput
          value={field.value}
          onChangeText={(value) => onChange({ value })}
          placeholder="Add information"
          placeholderTextColor={colors.mutedForeground}
          multiline
          autoCapitalize="none"
          style={[styles.input, { color: colors.foreground, textAlign: isRTL ? 'right' : 'left' }]}
        />
        <Pressable onPress={() => onChange({ enabled: !field.enabled })} style={[styles.toggle, { backgroundColor: field.enabled ? colors.primary : colors.muted }]}>
          <Feather name={field.enabled ? 'check' : 'minus'} size={13} color={field.enabled ? colors.primaryForeground : colors.mutedForeground} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: 16, borderWidth: 1, padding: 13, marginBottom: 10 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
  labelRow: { flexDirection: 'row', alignItems: 'center', gap: 9, flex: 1 },
  rtl: { flexDirection: 'row-reverse' },
  icon: { width: 30, height: 30, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  label: { fontSize: 14, fontWeight: '700', flex: 1, paddingVertical: 0 },
  actions: { flexDirection: 'row', gap: 13, alignItems: 'center' },
  inputWrap: { minHeight: 48, borderWidth: 1, borderRadius: 12, flexDirection: 'row', alignItems: 'center', paddingLeft: 12, paddingRight: 8 },
  input: { flex: 1, fontSize: 14, minHeight: 44, paddingVertical: 10 },
  toggle: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
});