export type FieldType =
  | 'name'
  | 'company'
  | 'job'
  | 'phone'
  | 'whatsapp'
  | 'email'
  | 'website'
  | 'address'
  | 'maps'
  | 'instagram'
  | 'payment'
  | 'wifi'
  | 'sms'
  | 'text'
  | 'calendar'
  | 'custom';

export type QRStyle = 'classic' | 'rounded' | 'dots' | 'modern';
export type ErrorCorrection = 'L' | 'M' | 'Q' | 'H';
export type ThemeMode = 'light' | 'dark' | 'system';
export type Language = 'en' | 'ar';

export interface QRField {
  id: string;
  label: string;
  value: string;
  type: FieldType;
  enabled: boolean;
  icon?: string;
}

export interface QRDesign {
  style: QRStyle;
  foreground: string;
  background: string;
  errorCorrection: ErrorCorrection;
}

export interface QRProfile {
  id: string;
  name: string;
  fields: QRField[];
  design: QRDesign;
  favorite: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DecodedQR {
  isMono: boolean;
  profileName?: string;
  fields: QRField[];
  raw: string;
}

export const defaultDesign: QRDesign = {
  style: 'modern',
  foreground: '#111214',
  background: '#ffffff',
  errorCorrection: 'M',
};

export const fieldLabel: Record<FieldType, string> = {
  name: 'Name',
  company: 'Company',
  job: 'Job title',
  phone: 'Phone',
  whatsapp: 'WhatsApp',
  email: 'Email',
  website: 'Website',
  address: 'Address',
  maps: 'Google Maps',
  instagram: 'Instagram',
  payment: 'Payment link',
  wifi: 'Wi-Fi',
  sms: 'SMS',
  text: 'Plain text',
  calendar: 'Calendar event',
  custom: 'Custom field',
};

export const fieldIcon: Record<FieldType, string> = {
  name: 'user',
  company: 'briefcase',
  job: 'award',
  phone: 'phone',
  whatsapp: 'message-circle',
  email: 'mail',
  website: 'globe',
  address: 'map-pin',
  maps: 'navigation',
  instagram: 'camera',
  payment: 'credit-card',
  wifi: 'wifi',
  sms: 'message-square',
  text: 'align-left',
  calendar: 'calendar',
  custom: 'plus',
};

export const fieldTemplates: Array<{
  type: FieldType;
  label: string;
  icon: string;
}> = [
  { type: 'name', label: 'Name', icon: 'user' },
  { type: 'company', label: 'Company', icon: 'briefcase' },
  { type: 'job', label: 'Job title', icon: 'award' },
  { type: 'phone', label: 'Phone', icon: 'phone' },
  { type: 'whatsapp', label: 'WhatsApp', icon: 'message-circle' },
  { type: 'email', label: 'Email', icon: 'mail' },
  { type: 'website', label: 'Website', icon: 'globe' },
  { type: 'address', label: 'Address', icon: 'map-pin' },
  { type: 'maps', label: 'Google Maps', icon: 'navigation' },
  { type: 'instagram', label: 'Instagram', icon: 'camera' },
  { type: 'payment', label: 'Payment link', icon: 'credit-card' },
  { type: 'wifi', label: 'Wi-Fi', icon: 'wifi' },
  { type: 'sms', label: 'SMS', icon: 'message-square' },
  { type: 'text', label: 'Plain text', icon: 'align-left' },
  { type: 'calendar', label: 'Calendar event', icon: 'calendar' },
];

export function createId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
}

export function createField(type: FieldType = 'custom', label?: string): QRField {
  return {
    id: createId(),
    label: label ?? fieldLabel[type],
    value: '',
    type,
    enabled: true,
    icon: fieldIcon[type],
  };
}