import { Outlet, useParams } from "react-router-dom";
import useTrip from "../../hooks/useTrip";
import { useTranslation } from "react-i18next";
import styles from './TripPage.module.scss';
import { CDN } from "../../utils/buildLocalizedUrl";
import CountryTag from "../../components/CountryTag/CountryTag";
import TripSummary from "../../components/TripSummary/TripSummary";
import TableOfContents from "../../components/TableOfContents/TableOfContents";
import { usePageMeta } from "../../hooks/usePageMeta";

export default function TripPage() {
  const { i18n } = useTranslation();
  const { slug } = useParams<{ slug: string }>();
  const { trip } = useTrip(slug!, i18n.language);

  usePageMeta({
    titleFr: `${trip?.title} — Nico ailleurs`,
    titleEn: `${trip?.title} — Nico ailleurs`,
    descriptionFr: 'Récits de voyage où le fond, les expériences, se mêlent à la forme, la littérature, la phrase juste, le mot adéquat.',
    descriptionEn: 'Travel writing where substance — the experiences — intertwines with form: the literature, the well-turned phrase, the precise word.',
  });

  return (
    <div className={styles.tripWrapper}>
      {trip && (
        <>
          <div className={styles.banner} style={{ backgroundImage: `url(${CDN}/photos/${trip.id}/banner.jpg)` }}>
            <div>
              {trip.countries.map(country => 
                <CountryTag key={country.slug} country={country} />
              )}
            </div>
            <h1>{trip.title}</h1>
            <div className={styles.dates}>
              <span>{trip.startDate.toLocaleDateString(i18n.language, { day: '2-digit', month: '2-digit', year: 'numeric' })}</span>
              →
              <span>{trip.endDate.toLocaleDateString(i18n.language, { day: '2-digit', month: '2-digit', year: 'numeric' })}</span>
            </div>
          </div>
          <div className={styles.tripDetail}>
            <TripSummary trip={trip} />
          </div>
          <section>
            {!!trip.chapters?.length && <TableOfContents trip={trip} />}
            <div>
              <Outlet context={{trip}} />
            </div>
          </section>
        </>
      )}
    </div>
  );
}