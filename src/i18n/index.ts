import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import fr from "./locales/fr.json";
import en from "./locales/en.json";

export interface Language {
    code: string;
    label: string;
}

export const LANGUAGES: Language[] = [
    { code: "fr", label: 'Français' },
    { code: "en", label: 'English' }
];

export const SUPPORTED_LANGS = LANGUAGES.map(language => language.code);

i18n.use(initReactI18next).init({
  resources: { fr: { translation: fr }, en: { translation: en } },
  lng: "fr",
  fallbackLng: "en",
  interpolation: { escapeValue: false }, // React échappe déjà le HTML
});

export default i18n;