import { useTranslation } from "react-i18next"
import styles from './GuidesPage.module.scss';

export default function GuidesPage() {
  const { t } = useTranslation();
  return <div className={styles.guidesWrapper}>
    <h1>{t('header.guides')}</h1>
    <p>{t('to-come')}</p>
  </div>
}