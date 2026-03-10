import { SUPPORTED_LANGS } from "../i18n";

export function buildLocalizedUrl(pathname: string, targetLang: string): string {
  const segments = pathname.split("/").filter(Boolean);

  if (SUPPORTED_LANGS.includes(segments[0])) {
    segments[0] = targetLang;
  } else {
    segments.unshift(targetLang);
  }

  return "/" + segments.join("/");
}