import { NavLink } from "react-router-dom";
import styles from "./Header.module.scss";
import LanguageSwitcher from "../LanguageSwitcher/LanguageSwitcher";
import { LANGUAGES } from "../../i18n";
import { useTranslation } from "react-i18next";
import { useState } from "react";

export default function Header() {
  const { t } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <header className={styles.header}>
      <NavLink to="/" className={styles.brand}>
        <img src="images/logo-transparent.png" className={styles.logo} />
      </NavLink>
      <button
        className={styles.burgerButton}
        onClick={() => setMenuOpen(o => !o)}
        aria-label="Menu"
      >
        <img src="images/burger-bar.png" className={styles.burgerIcon} />
      </button>
      <nav className={`${styles.nav} ${menuOpen ? styles.navOpen : ""}`}>
        <NavLink to="/" className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}>
          {t('header.home')}
        </NavLink>
        <NavLink to="/voyages" className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}>
          {t('header.stories')}
        </NavLink>
        <NavLink to="/carte" className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}>
          {t('header.countries')}
        </NavLink>
        <NavLink to="/a-propos" className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}>
          {t('header.cities')}
        </NavLink>
        <NavLink to="/a-propos" className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}>
          {t('header.guides')}
        </NavLink>
      </nav>
      <LanguageSwitcher languages={LANGUAGES} />
    </header>
  );
}