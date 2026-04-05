import { Link } from "react-router-dom";
import type { Tag } from "../../api/models/Tag"
import useLocalizedPath from "../../hooks/useLocalizedPath";
import styles from './Tag.module.scss';

type Props = {
  tag: Tag;
  clickToRemove?: boolean
}

export default function Tag({ tag, clickToRemove }: Props) {
  const path = useLocalizedPath();

  return <Link to={path("trips", clickToRemove ? "" : "?tag=" + tag.slug)} className={styles.tagLink}>
    {tag.name}
    {clickToRemove && <img src="/icons/close.png" />}
  </Link>
}