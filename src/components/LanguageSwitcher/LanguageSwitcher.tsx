import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { buildLocalizedUrl } from "../../utils/buildLocalizedUrl";
import type { Language } from "../../i18n";

export default function LanguageSwitcher({ languages }: { languages: Language[] }) {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const targetLanguage = languages.find(l => l.code !== i18n.language);

  if (!targetLanguage) return null;

  return (
    <img
      src={`/images/flags/${targetLanguage.code}.png`}
      alt={targetLanguage.label}
      onClick={() => navigate(buildLocalizedUrl(pathname, targetLanguage.code))}
      style={{ cursor: "pointer", width: 28, height: "auto" }}
    />
  );
}