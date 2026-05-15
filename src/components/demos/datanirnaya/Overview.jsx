import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
  PieChart, Pie, Legend,
} from 'recharts';
import {
  Package, TrendingDown, Megaphone, HeartPulse,
  ShoppingCart, AlertTriangle, Star, DollarSign,
  TrendingUp, Zap, Flame,
} from 'lucide-react';
import {
  DOMAINS, DOMAIN_META, getSummary, getDomainOppLoss,
  getDomainFlagCount, fmt, getAllIssuesSorted,
} from './pipelineData';
import styles from './Overview.module.css';

const DOMAIN_ICONS = {
  revenue: TrendingDown, stock: Package,
  marketing: Megaphone, product_health: HeartPulse,
};

function KpiCard({ icon: Icon, label, value, sub, accent }) {
  return (
    <div className={styles.kpiCard}>
      <div className={styles.kpiIconWrap} style={{ background: accent + '18' }}>
        <Icon size={15} color={accent} strokeWidth={2} />
      </div>
      <div>
        <div className={styles.kpiLabel}>{label}</div>
        <div className={styles.kpiValue}>{value}</div>
        {sub && <div className={styles.kpiSub}>{sub}</div>}
      </div>
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className={styles.tooltip}>
      <div className={styles.tooltipLabel}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.fill ?? p.color, fontSize: 12 }}>
          {p.name}: {typeof p.value === 'number' ? p.value.toLocaleString() : p.value}
        </div>
      ))}
    </div>
  );
};

const PieTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className={styles.tooltip}>
      <div style={{ color: payload[0].payload.fill, fontSize: 12, fontWeight: 600 }}>{payload[0].name}</div>
      <div style={{ fontSize: 12, color: 'var(--text-2)' }}>{payload[0].value} flags</div>
    </div>
  );
};

export default function Overview({ site, onSelect }) {
  const s = getSummary(site);
  const cur = s.currency === 'USD' ? '$' : '₹';

  const oppData = DOMAINS.map(d => ({
    domain: DOMAIN_META[d].label,
    loss: Math.round(getDomainOppLoss(site, d)),
    flags: getDomainFlagCount(site, d),
    color: DOMAIN_META[d].color,
  }));

  const maxLoss = Math.max(...oppData.map(d => d.loss));

  const trendPct = ((s.revenue_trend ?? 1) * 100).toFixed(0);
  const trendOk = parseFloat(trendPct) >= 90;

  const topIssues = getAllIssuesSorted(site).slice(0, 8);

  const pieData = DOMAINS.map(d => ({
    name: DOMAIN_META[d].label,
    value: getDomainFlagCount(site, d),
    fill: DOMAIN_META[d].color,
  }));

  return (
    <div className={styles.wrap}>
      {/* KPI row */}
      <div className={styles.kpiGrid}>
        <KpiCard icon={ShoppingCart} label="Total SKUs" value={s.total_skus} sub="Active catalogue" accent="var(--accent)" />
        <KpiCard
          icon={TrendingUp} label="Revenue 30D"
          value={fmt(s.revenue_30d, cur)}
          sub={<span style={{ color: trendOk ? 'var(--accent)' : 'var(--rev)' }}>{trendPct}% vs 90D avg</span>}
          accent="var(--accent)"
        />
        <KpiCard icon={AlertTriangle} label="OOS SKUs" value={s.oos_skus} sub="Out of stock on Amazon" accent="var(--rev)" />
        <KpiCard icon={DollarSign} label="Ad Spend 30D" value={fmt(s.total_spend_30d, cur)} sub="Marketing outlay" accent="var(--mkt)" />
        <KpiCard icon={Star} label="Low Rating SKUs" value={s.low_rating_skus} sub="Rating < 4.2" accent="var(--stk)" />
        <KpiCard icon={Zap} label="Avg DOS" value={`${s.avg_dos}d`} sub="Days of stock remaining" accent="var(--ph)" />
      </div>

      {/* Charts row */}
      <div className={styles.chartsRow}>
        {/* Opp loss bar */}
        <div className={styles.chartCard}>
          <div className={styles.cardHeader}>
            <span className={styles.cardTitle}>Opportunity Loss by Domain</span>
            <span className={styles.cardSub}>30D potential revenue leakage ({cur})</span>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={oppData} barSize={36}>
              <XAxis dataKey="domain" tick={{ fill: 'var(--text-3)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
              <Bar dataKey="loss" name="Opp Loss" radius={[4, 4, 0, 0]}>
                {oppData.map((d, i) => <Cell key={i} fill={d.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Issue flag distribution pie */}
        <div className={styles.chartCard}>
          <div className={styles.cardHeader}>
            <span className={styles.cardTitle}>Flag Distribution</span>
            <span className={styles.cardSub}>Flagged SKUs by domain</span>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                data={pieData} cx="50%" cy="50%"
                innerRadius={48} outerRadius={72}
                paddingAngle={3} dataKey="value"
              >
                {pieData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
              </Pie>
              <Tooltip content={<PieTooltip />} />
              <Legend
                iconType="circle" iconSize={8}
                formatter={(val) => <span style={{ color: 'var(--text-3)', fontSize: 11 }}>{val}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Issue count bar */}
        <div className={styles.chartCard}>
          <div className={styles.cardHeader}>
            <span className={styles.cardTitle}>Issue Count by Domain</span>
            <span className={styles.cardSub}>Total flagged SKUs</span>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={oppData} layout="vertical" barSize={14}>
              <XAxis type="number" hide />
              <YAxis dataKey="domain" type="category" width={80} tick={{ fill: 'var(--text-3)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
              <Bar dataKey="flags" name="Flagged SKUs" radius={[0, 4, 4, 0]}>
                {oppData.map((d, i) => <Cell key={i} fill={d.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top issues table + Domain cards */}
      <div className={styles.bottomRow}>
        {/* Top issues by opp loss */}
        <div className={styles.topIssuesCard}>
          <div className={styles.cardHeader}>
            <span className={styles.cardTitle}><Flame size={13} style={{ marginRight: 5, verticalAlign: -2 }} />Top Issues by Opportunity Loss</span>
            <span className={styles.cardSub}>Click to drill down</span>
          </div>
          <div className={styles.topIssuesList}>
            {topIssues.map((item, i) => {
              const dmeta = DOMAIN_META[item.domain];
              const barPct = maxLoss > 0 ? (item.loss / maxLoss) * 100 : 0;
              return (
                <div
                  key={i}
                  className={styles.topIssueRow}
                  onClick={() => onSelect(item.domain, item.issue)}
                >
                  <span className={styles.topIssueRank}>{i + 1}</span>
                  <div className={styles.topIssueInfo}>
                    <span className={styles.topIssueName}>{item.issue.replace(/_/g, ' ')}</span>
                    <span className={styles.topIssueDomain} style={{ color: dmeta.color }}>{dmeta.label}</span>
                  </div>
                  <div className={styles.topIssueBar}>
                    <div className={styles.topIssueBarFill} style={{ width: `${barPct}%`, background: dmeta.color }} />
                  </div>
                  <span className={styles.topIssueLoss} style={{ color: dmeta.color }}>{fmt(item.loss, cur)}</span>
                  <span className={styles.topIssueCount}>{item.count} SKUs</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Domain summary cards */}
        <div className={styles.domainGrid}>
          {DOMAINS.map(domain => {
            const meta = DOMAIN_META[domain];
            const Icon = DOMAIN_ICONS[domain];
            const loss = getDomainOppLoss(site, domain);
            const flags = getDomainFlagCount(site, domain);
            return (
              <div
                key={domain}
                className={styles.domainCard}
                style={{ '--d-color': meta.color, '--d-bg': meta.bg }}
                onClick={() => onSelect(domain, '')}
              >
                <div className={styles.domainCardTop}>
                  <div className={styles.domainIconBox}>
                    <Icon size={15} color={meta.color} strokeWidth={2} />
                  </div>
                  <span className={styles.domainCardTitle}>{meta.label}</span>
                  <span className={styles.domainCardCount}>{flags} flags</span>
                </div>
                <div className={styles.domainCardLoss}>
                  <span className={styles.lossLabel}>Opp loss 30D</span>
                  <span className={styles.lossValue}>{fmt(loss, cur)}</span>
                </div>
                <div className={styles.domainCardBar}>
                  <div
                    className={styles.barFill}
                    style={{ width: `${Math.min(100, (loss / maxLoss) * 100)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
