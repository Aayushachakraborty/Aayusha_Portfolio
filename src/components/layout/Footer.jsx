import { formatBuildDate } from '../../utils/format';

export default function Footer({ person }) {
  return (
    <footer>
      <span>(c) 2026 {person.name}</span>
      <span>Last updated {formatBuildDate(__BUILD_DATE__)}</span>
    </footer>
  );
}
