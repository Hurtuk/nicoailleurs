import styles from './Travel.module.scss';

type Props = {
  cityFrom: string;
  cityTo: string;
  transport: string;
}

export default function Travel({ cityFrom, cityTo, transport }: Props) {

  return (
    <div className={styles.travelWrapper}>
      <div>{cityFrom}</div>
      <div>
        <img src={'/images/transports/' + transport} />
      </div>
      <div>{cityTo}</div>
    </div>
  );
}