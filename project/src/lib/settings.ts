import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ThemeType = 'light' | 'dark';
export type FontSize = 'small' | 'medium' | 'large';
export type Language = 'ru' | 'en';

interface SettingsState {
  theme: ThemeType;
  language: Language;
  notifications: boolean;
  fontSize: FontSize;
  setTheme: (theme: ThemeType) => void;
  setLanguage: (language: Language) => void;
  setNotifications: (enabled: boolean) => void;
  setFontSize: (size: FontSize) => void;
  resetSettings: () => void;
  clearCache: () => void;
}

const defaultSettings = {
  theme: 'dark' as ThemeType,
  language: 'ru' as Language,
  notifications: true,
  fontSize: 'medium' as FontSize,
};

export const useSettings = create<SettingsState>()(
  persist(
    (set) => ({
      ...defaultSettings,
      setTheme: (theme) => set({ theme }),
      setLanguage: (language) => set({ language }),
      setNotifications: (notifications) => set({ notifications }),
      setFontSize: (fontSize) => set({ fontSize }),
      resetSettings: () => set(defaultSettings),
      clearCache: async () => {
        if ('caches' in window) {
          try {
            const cacheKeys = await caches.keys();
            await Promise.all(cacheKeys.map(key => caches.delete(key)));
          } catch (error) {
            console.error('Failed to clear cache:', error);
          }
        }
      },
    }),
    {
      name: 'aniverse-settings',
    }
  )
);