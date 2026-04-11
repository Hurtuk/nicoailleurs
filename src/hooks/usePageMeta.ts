import { useEffect } from "react";
import { useTranslation } from "react-i18next";

interface PageMeta {
  titleFr: string;
  titleEn: string;
  descriptionFr: string;
  descriptionEn: string;
}

export const DEFAULT_META = {
  titleFr: 'Nico ailleurs – Récits de voyage',
  titleEn: 'Nico ailleurs – Travel Stories',
  descriptionFr: 'Récits de voyage où le fond, les expériences, se mêlent à la forme, la littérature, la phrase juste, le mot adéquat.',
  descriptionEn: 'Travel writing where substance — the experiences — intertwines with form: the literature, the well-turned phrase, the precise word.',
};

export function usePageMeta({ titleFr, titleEn, descriptionFr, descriptionEn }: PageMeta) {
  const { i18n } = useTranslation();
  const isEn = i18n.language === 'en';

  useEffect(() => {
    document.title = isEn ? titleEn : titleFr;
    document.documentElement.lang = isEn ? 'en' : 'fr';

    document.querySelector('meta[name="description"]')
      ?.setAttribute('content', isEn ? descriptionEn : descriptionFr);

    document.querySelectorAll('link[rel="alternate"]').forEach(el => el.remove());
    [
      { hreflang: 'fr', href: 'https://nicoailleurs.com/' },
      { hreflang: 'en', href: 'https://nicoailleurs.com/en/' },
      { hreflang: 'x-default', href: 'https://nicoailleurs.com/' },
    ].forEach(({ hreflang, href }) => {
      const link = document.createElement('link');
      link.rel = 'alternate';
      link.setAttribute('hreflang', hreflang);
      link.href = href;
      document.head.appendChild(link);
    });
  }, [isEn, titleFr, titleEn, descriptionFr, descriptionEn]);
}