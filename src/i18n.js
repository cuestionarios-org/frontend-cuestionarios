import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

// Carga los archivos de traducción
import en from './locales/en.json'
import es from './locales/es.json'
import pt from './locales/pt.json'

i18n
  .use(LanguageDetector)           // Detecta el idioma del navegador
  .use(initReactI18next)           // Pasa i18n a React
  .init({
    resources: { en: { translation: en }, es: { translation: es }, pt: { translation: pt } },
    fallbackLng: 'es',             // Si no encuentra traducción, usa español
    debug: false,
    interpolation: {
      escapeValue: false           // React ya escapa
    }
  })

export default i18n
