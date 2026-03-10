import { useTranslation } from "react-i18next";
import styles from "./Footer.module.scss";

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className={styles.footer}>
      <a
        href="https://www.instagram.com/nicoailleurs/"
        target="_blank"
        rel="noopener noreferrer"
        className={styles.link}
      >
        <img src="/images/instagram.png" alt="Instagram" className={styles.icon} />
        <span>{t('footer.followInstagram')}</span>
      </a>
    </footer>
  );
}