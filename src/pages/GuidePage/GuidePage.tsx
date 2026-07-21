import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import styles from './GuidePage.module.scss';
import useGuide from "../../hooks/useGuide";
import { formatGuideContent, grammarRules } from "../../utils/formatContent";
import { CDN } from "../../utils/buildLocalizedUrl";
import { DEFAULT_META, usePageMeta } from "../../hooks/usePageMeta";

export default function GuidePage() {
  const { i18n, t } = useTranslation();
  const { slug } = useParams<{ slug: string }>();
  const { guide, loading } = useGuide(slug!, i18n.language);

  usePageMeta(guide
    ? { ...DEFAULT_META, titleFr: guide.title, titleEn: guide.title }
    : DEFAULT_META);

  if (loading) return null;
  if (!guide) return <div>{t('to-come')}</div>;

  return (
    <div className={styles.guideWrapper}>
      <article className={styles.guideContent}>
        <img
          className={styles.icon}
          src={`${CDN}/images/${guide.id}.png`}
          alt=""
          width={128}
          height={128}
        />
        <h1>{grammarRules(i18n.language, guide.title)}</h1>
        {guide.content && formatGuideContent(i18n.language, guide.content, guide.id)}
      </article>
    </div>
  );
}
