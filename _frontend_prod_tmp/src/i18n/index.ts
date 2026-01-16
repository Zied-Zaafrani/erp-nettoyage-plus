import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './locales/en.json';
import fr from './locales/fr.json';
import ar from './locales/ar.json';

// ============================================
// i18n CONFIGURATION
// ============================================

export const languages = [
  { code: 'fr', name: 'Français', dir: 'ltr', flag: '🇫🇷' },
  { code: 'ar', name: 'العربية', dir: 'rtl', flag: '🇲🇷' },
  { code: 'en', name: 'English', dir: 'ltr', flag: '🇬🇧' },
] as const;

export type LanguageCode = typeof languages[number]['code'];

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      fr: { translation: fr },
      ar: { translation: ar },
    },
    fallbackLng: 'fr', // French as default (company is in Mauritania)
    debug: false,
    interpolation: {
      escapeValue: false, // React already escapes
    },
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },
  });

// Update document direction for RTL languages
i18n.on('languageChanged', (lng) => {
  const language = languages.find((l) => l.code === lng);
  if (language) {
    document.documentElement.dir = language.dir;
    document.documentElement.lang = lng;
  }
});

// Set initial direction
const currentLang = languages.find((l) => l.code === i18n.language);
if (currentLang) {
  document.documentElement.dir = currentLang.dir;
  document.documentElement.lang = i18n.language;
}

export default i18n;
