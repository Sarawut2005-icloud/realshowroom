import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import th from './locales/th.json';
import en from './locales/en.json';
import ja from './locales/ja.json';
import zh from './locales/zh.json';
import ko from './locales/ko.json';
import de from './locales/de.json';
import fr from './locales/fr.json';
import es from './locales/es.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      th: { translation: th },
      en: { translation: en },
      ja: { translation: ja },
      zh: { translation: zh },
      ko: { translation: ko },
      de: { translation: de },
      fr: { translation: fr },
      es: { translation: es },
    },
    fallbackLng: 'th',
    lng: 'th',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
