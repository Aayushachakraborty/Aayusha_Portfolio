import { LayoutDashboard, TrendingDown, Package, Megaphone, HeartPulse } from 'lucide-react';
import { DOMAIN_META, DOMAINS } from './pipelineData';
import styles from './Sidebar.module.css';

const DOMAIN_ICONS = {
  revenue:        TrendingDown,
  stock:          Package,
  marketing:      Megaphone,
  product_health: HeartPulse,
};

export default function Sidebar({ site, issueSummary, activeDomain, activeIssue, onSelect }) {
  return (
    <aside className={styles.sidebar}>
      {/* Overview */}
      <div className={styles.section}>
        <button
          className={`${styles.navItem} ${activeDomain === 'overview' ? styles.active : ''}`}
          onClick={() => onSelect('overview', '')}
        >
          <LayoutDashboard size={14} />
          <span className={styles.navLabel}>Overview</span>
        </button>
      </div>

      {DOMAINS.map(domain => {
        const meta = DOMAIN_META[domain];
        const Icon = DOMAIN_ICONS[domain];
        const issues = issueSummary[domain] ?? {};
        const totalCount = Object.values(issues).reduce((a, b) => a + b, 0);

        return (
          <div key={domain} className={styles.section}>
            <div className={styles.domainHeader}>
              <Icon size={12} color={meta.color} strokeWidth={2} />
              <span className={styles.domainLabel}>{meta.label}</span>
              <span className={styles.domainCount}>{totalCount}</span>
            </div>

            {Object.entries(issues).map(([issue, count]) => {
              const isActive = activeDomain === domain && activeIssue === issue;
              return (
                <button
                  key={issue}
                  className={`${styles.navItem} ${isActive ? styles.active : ''}`}
                  style={isActive ? { '--domain-color': meta.color, '--domain-bg': meta.bg } : {}}
                  onClick={() => onSelect(domain, issue)}
                >
                  <span
                    className={styles.dot}
                    style={{ background: isActive ? meta.color : undefined }}
                  />
                  <span className={styles.navLabel}>{issue.replace(/_/g, ' ')}</span>
                  <span
                    className={styles.badge}
                    style={isActive ? { background: meta.bg, color: meta.color } : {}}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        );
      })}
    </aside>
  );
}
