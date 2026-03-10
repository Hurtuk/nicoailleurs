import { useEffect } from "react";
import { useParams, Outlet, Navigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { buildLocalizedUrl } from "../utils/buildLocalizedUrl";
import { SUPPORTED_LANGS } from "../i18n";

export default function LocaleWrapper() {
  const { lang } = useParams<{ lang: string }>();
  const { i18n } = useTranslation();
  const { pathname } = useLocation();

  const resolvedLang = SUPPORTED_LANGS.includes(lang ?? "") ? lang! : "fr";

  useEffect(() => {
    i18n.changeLanguage(resolvedLang);
  }, [resolvedLang]);

  if (lang && !SUPPORTED_LANGS.includes(lang)) {
    return <Navigate to={buildLocalizedUrl(pathname, "fr")} replace />;
  }

  return <Outlet />;
}