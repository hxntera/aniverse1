import { useSettings } from '../settings';
import { translations } from './translations';

export function useTranslation() {
  const { language } = useSettings();
  return {
    t: (key: string) => {
      const keys = key.split('.');
      let value = translations[language];
      for (const k of keys) {
        value = value?.[k];
      }
      return value || key;
    }
  };
}