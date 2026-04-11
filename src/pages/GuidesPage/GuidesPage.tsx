import { useTranslation } from "react-i18next"
import styles from './GuidesPage.module.scss';
import { DEFAULT_META, usePageMeta } from "../../hooks/usePageMeta";

export default function GuidesPage() {
  const { t } = useTranslation();
  
  usePageMeta(DEFAULT_META);
  
  return <div className={styles.guidesWrapper}>
    <h1>{t('header.guides')}</h1>
    <p>{t('to-come')}</p>
  </div>
}