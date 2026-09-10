import type { DecodedQR, QRField, QRProfile } from '@/lib/types';

const PREFIX = 'MQR1';

export function encodeProfile(profile: Pick<QRProfile, 'name' | 'fields'>): string {
  const fields = profile.fields
    .filter((field) => field.enabled && field.value.trim().length > 0)
    .map(({ label, value, type, icon }) => ({ label, value, type, icon }));
  return `${PREFIX}|${encodeURIComponent(JSON.stringify({ name: profile.name, fields }))}`;
}

export function decodePayload(raw: string): DecodedQR {
  if (!raw.startsWith(`${PREFIX}|`)) {
    return { isMono: false, fields: [], raw };
  }
  try {
    const parsed = JSON.parse(decodeURIComponent(raw.slice(PREFIX.length + 1))) as {
      name?: string;
      fields?: Array<Pick<QRField, 'label' | 'value' | 'type' | 'icon'>>;
    };
    const fields: QRField[] = (parsed.fields ?? []).map((field) => ({
      ...field,
      id: `${field.label}-${field.value}`,
      enabled: true,
    }));
    return { isMono: true, profileName: parsed.name ?? 'Mono Chrome QR', fields, raw };
  } catch {
    return { isMono: true, fields: [], raw };
  }
}

export function getFieldActionUrl(field: QRField): string | undefined {
  const value = field.value.trim();
  if (!value) return undefined;
  if (field.type === 'phone') return `tel:${value}`;
  if (field.type === 'whatsapp') return `https://wa.me/${value.replace(/[^\d+]/g, '')}`;
  if (field.type === 'email') return `mailto:${value}`;
  if (field.type === 'sms') return `sms:${value}`;
  if (['website', 'maps', 'instagram', 'payment'].includes(field.type)) {
    return /^https?:\/\//i.test(value) ? value : `https://${value}`;
  }
  return undefined;
}

export function qrToSvg(
  modules: number[][],
  foreground: string,
  background: string,
  quiet = 4,
  cell = 8,
): string {
  const size = modules.length + quiet * 2;
  const rects: string[] = [];
  modules.forEach((row, y) =>
    row.forEach((value, x) => {
      if (value) rects.push(`<rect x="${(x + quiet) * cell}" y="${(y + quiet) * cell}" width="${cell}" height="${cell}"/>`);
    }),
  );
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size * cell}" height="${size * cell}" viewBox="0 0 ${size * cell} ${size * cell}"><rect width="100%" height="100%" fill="${background}"/><g fill="${foreground}">${rects.join('')}</g></svg>`;
}