import { useTranslation } from "react-i18next";
import { ROUTES } from "../utils/buildLocalizedUrl";

export default function useLocalizedPath() {
  const { i18n } = useTranslation();
  return (key: keyof typeof ROUTES.fr, slug?: any) => {
    const segment = ROUTES[i18n.language as "fr" | "en"][key];
    return `${i18n.language !== "fr" ? "/" + i18n.language : ""}/${segment}${slug ? `/${slug}` : ""}`;
  };
}