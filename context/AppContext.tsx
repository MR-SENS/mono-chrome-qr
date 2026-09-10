import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useColorScheme } from 'react-native';
import colors from '@/constants/colors';
import type { AppSettings } from '@/lib/storage';
import { defaultSettings, loadProfiles, loadSettings, saveProfiles, saveSettings } from '@/lib/storage';
import type { Language, QRProfile, ThemeMode } from '@/lib/types';

type AppContextValue = {
  profiles: QRProfile[];
  settings: AppSettings;
  colors: typeof colors.light;
  isReady: boolean;
  language: Language;
  isRTL: boolean;
  t: (key: keyof typeof translations.en) => string;
  setThemeMode: (mode: ThemeMode) => void;
  setLanguage: (language: Language) => void;
  upsertProfile: (profile: QRProfile) => void;
  deleteProfile: (id: string) => void;
  toggleFavorite: (id: string) => void;
};

const translations = {
  en: {
    home: 'Home',
    create: 'Create',
    scan: 'Scan',
    history: 'History',
    settings: 'Settings',
    createQr: 'Create QR',
    scanQr: 'Scan QR',
    favorites: 'Favorites',
    recentProfiles: 'Recent profiles',
    seeAll: 'See all',
    createSubtitle: 'Build one QR with everything people need to know.',
    quickActions: 'Quick actions',
    noProfiles: 'Your saved profiles will appear here.',
    profileName: 'Profile name',
    startBlank: 'Start blank',
    businessCard: 'Business card',
    event: 'Event',
    wifi: 'Wi-Fi',
    chooseTemplate: 'Choose a starting point',
    fields: 'Fields',
    addField: 'Add field',
    addCustom: 'Add custom field',
    customize: 'Customize',
    save: 'Save',
    share: 'Share',
    export: 'Export',
    edit: 'Edit',
    duplicate: 'Duplicate',
    delete: 'Delete',
    favorite: 'Favorite',
    noHistory: 'No QR profiles yet',
    historySubtitle: 'Generate a profile and it will stay on this device.',
    preview: 'Live preview',
    style: 'Style',
    colors: 'Colors',
    contrastWarning: 'Keep strong contrast so every scanner can read it.',
    foreground: 'Foreground',
    background: 'Background',
    scanHint: 'Point your camera at a QR code',
    cameraPermission: 'Camera access is needed to scan QR codes.',
    grantCamera: 'Allow camera',
    pasteCode: 'Paste QR text',
    decoded: 'Decoded profile',
    open: 'Open',
    copy: 'Copy',
    shareText: 'Share text',
    system: 'System',
    light: 'Light',
    dark: 'Dark',
    language: 'Language',
    appearance: 'Appearance',
    privacy: 'Privacy first',
    privacyText: 'Everything stays on this device. No login, uploads, or analytics.',
    deleteConfirm: 'Delete this profile?',
    cancel: 'Cancel',
    confirm: 'Confirm',
  },
  ar: {
    home: 'الرئيسية',
    create: 'إنشاء',
    scan: 'مسح',
    history: 'السجل',
    settings: 'الإعدادات',
    createQr: 'إنشاء QR',
    scanQr: 'مسح QR',
    favorites: 'المفضلة',
    recentProfiles: 'الملفات الأخيرة',
    seeAll: 'عرض الكل',
    createSubtitle: 'أنشئ رمزاً واحداً يجمع كل معلوماتك المهمة.',
    quickActions: 'إجراءات سريعة',
    noProfiles: 'ستظهر ملفاتك المحفوظة هنا.',
    profileName: 'اسم الملف',
    startBlank: 'ابدأ فارغاً',
    businessCard: 'بطاقة أعمال',
    event: 'فعالية',
    wifi: 'شبكة Wi-Fi',
    chooseTemplate: 'اختر نقطة البداية',
    fields: 'الحقول',
    addField: 'إضافة حقل',
    addCustom: 'إضافة حقل مخصص',
    customize: 'تخصيص',
    save: 'حفظ',
    share: 'مشاركة',
    export: 'تصدير',
    edit: 'تعديل',
    duplicate: 'نسخ',
    delete: 'حذف',
    favorite: 'المفضلة',
    noHistory: 'لا توجد ملفات QR بعد',
    historySubtitle: 'أنشئ ملفاً وسيبقى محفوظاً على هذا الجهاز.',
    preview: 'معاينة مباشرة',
    style: 'النمط',
    colors: 'الألوان',
    contrastWarning: 'حافظ على تباين قوي ليتمكن أي ماسح من قراءته.',
    foreground: 'اللون الأمامي',
    background: 'الخلفية',
    scanHint: 'وجّه الكاميرا نحو رمز QR',
    cameraPermission: 'نحتاج إلى إذن الكاميرا لمسح رموز QR.',
    grantCamera: 'السماح بالكاميرا',
    pasteCode: 'ألصق نص QR',
    decoded: 'الملف المقروء',
    open: 'فتح',
    copy: 'نسخ',
    shareText: 'مشاركة النص',
    system: 'النظام',
    light: 'فاتح',
    dark: 'داكن',
    language: 'اللغة',
    appearance: 'المظهر',
    privacy: 'خصوصيتك أولاً',
    privacyText: 'كل شيء يبقى على هذا الجهاز. لا تسجيل دخول ولا رفع ولا تحليلات.',
    deleteConfirm: 'هل تريد حذف هذا الملف؟',
    cancel: 'إلغاء',
    confirm: 'تأكيد',
  },
} as const;

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme();
  const [profiles, setProfiles] = useState<QRProfile[]>([]);
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    Promise.all([loadProfiles(), loadSettings()]).then(([loadedProfiles, loadedSettings]) => {
      setProfiles(loadedProfiles);
      setSettings(loadedSettings);
      setIsReady(true);
    });
  }, []);

  const persistSettings = (next: AppSettings) => {
    setSettings(next);
    void saveSettings(next);
  };
  const activeDark = settings.themeMode === 'dark' || (settings.themeMode === 'system' && systemScheme === 'dark');
  const activeColors = activeDark ? colors.dark : colors.light;
  const value = useMemo<AppContextValue>(() => ({
    profiles,
    settings,
    colors: activeColors,
    isReady,
    language: settings.language,
    isRTL: settings.language === 'ar',
    t: (key) => translations[settings.language][key],
    setThemeMode: (themeMode) => persistSettings({ ...settings, themeMode }),
    setLanguage: (language) => persistSettings({ ...settings, language }),
    upsertProfile: (profile) => {
      const next = [profile, ...profiles.filter((item) => item.id !== profile.id)];
      setProfiles(next);
      void saveProfiles(next);
    },
    deleteProfile: (id) => {
      const next = profiles.filter((item) => item.id !== id);
      setProfiles(next);
      void saveProfiles(next);
    },
    toggleFavorite: (id) => {
      const next = profiles.map((item) => item.id === id ? { ...item, favorite: !item.favorite } : item);
      setProfiles(next);
      void saveProfiles(next);
    },
  }), [activeColors, isReady, profiles, settings]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used inside AppProvider');
  return context;
}