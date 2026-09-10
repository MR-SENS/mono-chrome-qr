import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { Svg, Rect } from 'react-native-svg';
import qrcode from 'qrcode-generator';
import { encodeProfile } from '@/lib/encoding';
import type { QRProfile } from '@/lib/types';

export function QrPreview({ profile, size = 220 }: { profile: QRProfile; size?: number }) {
  const modules = useMemo(() => {
    const qr = qrcode(0, profile.design.errorCorrection);
    qr.addData(encodeProfile(profile));
    qr.make();
    const count = qr.getModuleCount();
    return Array.from({ length: count }, (_, row) =>
      Array.from({ length: count }, (_, col) => qr.isDark(row, col) ? 1 : 0),
    );
  }, [profile]);
  const cell = size / (modules.length + 8);
  const inset = cell * 4;

  return (
    <View style={[styles.frame, { width: size + 24, height: size + 24, backgroundColor: profile.design.background }]}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <Rect width={size} height={size} fill={profile.design.background} />
        {modules.flatMap((row, y) => row.map((value, x) => value ? (
          <Rect
            key={`${x}-${y}`}
            x={inset + x * cell}
            y={inset + y * cell}
            width={cell + 0.2}
            height={cell + 0.2}
            fill={profile.design.foreground}
            rx={profile.design.style === 'dots' ? cell / 2 : profile.design.style === 'rounded' ? 1.5 : 0}
          />
        ) : null))}
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    padding: 12,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
});