import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import styles from './GuidesPage.module.scss';
import { DEFAULT_META, usePageMeta } from "../../hooks/usePageMeta";
import useGuides from "../../hooks/useGuides";
import useLocalizedPath from "../../hooks/useLocalizedPath";
import { CDN } from "../../utils/buildLocalizedUrl";
import { grammarRules } from "../../utils/formatContent";

export default function GuidesPage() {
  const { i18n, t } = useTranslation();
  const { guides } = useGuides(i18n.language);
  const path = useLocalizedPath();

  usePageMeta(DEFAULT_META);

  return (
    <div className={styles.guidesWrapper}>
      <h1>{t('header.guides')}</h1>
      {guides.length === 0 ? (
        <p>{t('to-come')}</p>
      ) : (
        <div className={styles.guides}>
          {guides.map((guide) => (
            <Link key={guide.id} to={path('guides', guide.slug)} className={styles.card}>
              <img
                className={styles.icon}
                src={`${CDN}/images/${guide.id}.png`}
                alt=""
                width={128}
                height={128}
                loading="lazy"
              />
              <div className={styles.content}>
                <h3 className={styles.title}>{grammarRules(i18n.language, guide.title)}</h3>
                {guide.excerpt && <p className={styles.excerpt}>{grammarRules(i18n.language, guide.excerpt)}</p>}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
