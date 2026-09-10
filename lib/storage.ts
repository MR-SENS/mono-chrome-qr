import AsyncStorage from '@react-native-async-storage/async-storage';
import type { QRProfile, ThemeMode, Language } from '@/lib/types';

const PROFILE_KEY = '@mono-chrome-qr/profiles';
const SETTINGS_KEY = '@mono-chrome-qr/settings';

export interface AppSettings {
  themeMode: ThemeMode;
  language: Language;
}

export const defaultSettings: AppSettings = { themeMode: 'system', language: 'en' };

export async function loadProfiles(): Promise<QRProfile[]> {
  const raw = await AsyncStorage.getItem(PROFILE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as QRProfile[];
  } catch {
    return [];
  }
}

export async function saveProfiles(profiles: QRProfile[]): Promise<void> {
  await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(profiles));
}

export async function loadSettings(): Promise<AppSettings> {
  const raw = await AsyncStorage.getItem(SETTINGS_KEY);
  if (!raw) return defaultSettings;
  try {
    return { ...defaultSettings, ...(JSON.parse(raw) as Partial<AppSettings>) };
  } catch {
    return defaultSettings;
  }
}

export async function saveSettings(settings: AppSettings): Promise<void> {
  await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}