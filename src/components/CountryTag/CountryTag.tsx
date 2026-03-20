import { Link } from "react-router-dom";
import useLocalizedPath from "../../hooks/useLocalizedPath";
import styles from "./CountryTag.module.scss";
import type { Country } from "../../api/models/Country";

type Props = {
  country: Country;
};

export default function CountryTag({ country }: Props) {
  const path = useLocalizedPath();

  return (
    <Link to={path("countries", country.slug)} className={styles.cityCountry}>
      <span className={`fi fi-${country.codeAlpha2.toLowerCase()}`}></span>
      {country.name}
    </Link>
  );
}