import styles from "./WelcomeSection.module.scss";
import { Trans, useTranslation } from "react-i18next";

const age = new Date().getFullYear() - 1991;

export default function WelcomeSection() {
  const { t } = useTranslation();

  return (
    <section className={styles.wrapper}>
      <div>
        <div className={styles.text}>
          <h2>{ t('welcome.title') }</h2>
          <p>{ t('welcome.presentation1') }</p>
          <p><Trans
            i18nKey="welcome.presentation2"
            values={{ age }}
            components={{ a: <a target="_blank" href="https://www.amazon.fr/Philharmonia-Nicolas-Lethuillier/dp/1718016263/" /> }}
          /></p>
        </div>
        <div className={styles.photo}>
          <img src="/images/me.jpg" />
        </div>
      </div>
    </section>
  )
}