import { Activity } from 'lucide-react';
import styles from './Topbar.module.css';

export default function Topbar({ site, onSiteChange }) {
  return (
    <header className={styles.topbar}>
      <div className={styles.brand}>
        <Activity size={16} color="var(--accent)" strokeWidth={2.5} />
        <span>Data<em>Nirnaya</em></span>
        <span className={styles.tagline}>Supply Chain Intelligence</span>
      </div>

      <div className={styles.siteTabs}>
        {[
          { key: 'usa',   label: '🇺🇸 USA',   badge: 'USD' },
          { key: 'india', label: '🇮🇳 India', badge: 'INR' },
        ].map(({ key, label, badge }) => (
          <button
            key={key}
            className={`${styles.siteTab} ${site === key ? styles.active : ''}`}
            onClick={() => onSiteChange(key)}
          >
            {label}
            <span className={styles.badge}>{badge}</span>
          </button>
        ))}
      </div>

      <div className={styles.meta}>
        <span className={styles.demoTag}>Demo Mode</span>
        <span className={styles.dot} />
        <span className={styles.subtitle}>270 SKUs · 4 Decision Engines</span>
      </div>
    </header>
  );
}
