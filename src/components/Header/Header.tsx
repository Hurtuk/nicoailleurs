import { NavLink, useLocation } from "react-router-dom";
import styles from "./Header.module.scss";
import LanguageSwitcher from "../LanguageSwitcher/LanguageSwitcher";
import { LANGUAGES } from "../../i18n";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import useLocalizedPath from "../../hooks/useLocalizedPath";

function isHome(pathname: string): boolean {
  return ['/', '/fr', '/en'].includes(pathname);
}

export default function Header() {
  const { t } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const path = useLocalizedPath();

  useEffect(() => {
    setMenuOpen(false)
  }, [location]);

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `${styles.navLink} ${isActive ? styles.active : ""}`.trim();
  
  return (
    <header className={styles.header}>
      <NavLink to={path("/")} className={`${isHome(location.pathname) ? styles.homeBrand : styles.brand}`}>
        <img src="/images/logo-transparent.png" className={styles.logo} />
      </NavLink>
      <button
        className={styles.burgerButton}
        onClick={() => setMenuOpen(o => !o)}
        aria-label="Menu"
      >
        <img src="images/burger-bar.png" className={styles.burgerIcon} />
      </button>
      <nav className={`${styles.nav} ${menuOpen ? styles.navOpen : ""}`}>
        <NavLink to={path("/")} className={navLinkClass}>
          {t('header.home')}
        </NavLink>
        <NavLink to={path("trips")} className={navLinkClass}>
          {t('header.stories')}
        </NavLink>
        <NavLink to={path("countries")} className={navLinkClass}>
          {t('header.countries')}
        </NavLink>
        <NavLink to={path("cities")} className={navLinkClass}>
          {t('header.cities')}
        </NavLink>
        <NavLink to={path("guides")} className={navLinkClass}>
          {t('header.guides')}
        </NavLink>
      </nav>
      <LanguageSwitcher languages={LANGUAGES} />
    </header>
  );
}