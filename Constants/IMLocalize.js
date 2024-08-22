import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as RNLocalize from 'react-native-localize';

import en from './Translations/en';
import ur from './Translations/ur';

const LANGUAGES = {
  en,
  ur,
 
};
const LANG_CODES = Object.keys(LANGUAGES);
const LANGUAGE_DETECTOR = {
  type: 'languageDetector',
  async: true,
  detect: callback => {

    AsyncStorage.getItem('user-language', (err, language) => {

      // if error fetching stored data or no language was stored
      if (err || !language) {
        if (err) {
          console.log('Error fetching Languages from asyncstorage ', err);

        } else {

          // console.log('No language is set, choosing fallback language');
          const findBestAvailableLanguage =
            RNLocalize.findBestLanguageTag(LANG_CODES);

          callback(findBestAvailableLanguage.languageTag || 'en');
          return;
        }

      }
      callback(language);
    });
  },
  init: () => { },
  cacheUserLanguage: language => {
    AsyncStorage.setItem('user-language', language);
  }
};

i18n
  // detect language
  .use(LANGUAGE_DETECTOR)
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // set options
  .init({
    fallbackLng: 'en',
    compatibilityJSON: 'v3',
    resources: LANGUAGES,
    react: {
      useSuspense: false
    },
    interpolation: {
      escapeValue: false
    },
    defaultNS: 'common'
  });

