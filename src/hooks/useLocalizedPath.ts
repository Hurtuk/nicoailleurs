import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

const routes = {
  fr: { "/": "", countries: "pays", cities: "villes", trips: 'voyages', guides: "guides" },
  en: { "/": "", countries: "country", cities: "cities", trips: 'trips', guides: "guides" },
};

export default function useLocalizedPath() {
  const { i18n } = useTranslation();
  return (key: keyof typeof routes.fr, slug?: any) => {
    const segment = routes[i18n.language as "fr" | "en"][key];
    return `${i18n.language !== "fr" ? "/" + i18n.language : ""}/${segment}${slug ? `/${slug}` : ""}`;
  };
}