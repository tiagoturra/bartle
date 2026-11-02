import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import enCommon from './locales/en-US/common.json'
import enBartle from './locales/en-US/bartle.json'
import enQuestions from './locales/en-US/questions.json'
import ptCommon from './locales/pt-BR/common.json'
import ptBartle from './locales/pt-BR/bartle.json'
import ptQuestions from './locales/pt-BR/questions.json'
import frCommon from './locales/fr-FR/common.json'
import frBartle from './locales/fr-FR/bartle.json'
import frQuestions from './locales/fr-FR/questions.json'
import deCommon from './locales/de-DE/common.json'
import deBartle from './locales/de-DE/bartle.json'
import deQuestions from './locales/de-DE/questions.json'

void i18n.use(initReactI18next).init({
  lng: 'en-US',
  fallbackLng: 'en-US',
  defaultNS: 'common',
  resources: {
    'en-US': {
      common: enCommon,
      bartle: enBartle,
      questions: enQuestions,
    },
    'pt-BR': {
      common: ptCommon,
      bartle: ptBartle,
      questions: ptQuestions,
    },
    'fr-FR': {
      common: frCommon,
      bartle: frBartle,
      questions: frQuestions,
    },
    'de-DE': {
      common: deCommon,
      bartle: deBartle,
      questions: deQuestions,
    },
  },
  interpolation: {
    escapeValue: false,
  },
})

i18n.on('languageChanged', (language) => {
  if (typeof document !== 'undefined') {
    document.documentElement.lang = language
  }
})

export default i18n
