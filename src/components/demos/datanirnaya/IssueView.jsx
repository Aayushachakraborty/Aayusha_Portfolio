import { useMemo, useState } from 'react';
import {
  TrendingDown, Package, Megaphone, HeartPulse,
  ArrowUpDown, Search, AlertCircle, CheckCircle, Info, X,
  BarChart2, Star,
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
} from 'recharts';
import {
  DOMAIN_META, DOMAIN_EXTRA_COLS, getIssueRows, getDomainOppLoss,
  getWhys, fmt, fmtCol, getSeverity, getSummary, getCategoryBreakdown,
} from './pipelineData';
import styles from './IssueView.module.css';

const DOMAIN_ICONS = {
  revenue: TrendingDown, stock: Package,
  marketing: Megaphone, product_health: HeartPulse,
};

const SEV_META = {
  critical: { label: 'Critical', color: 'var(--rev)',  icon: AlertCircle },
  warning:  { label: 'Warning',  color: 'var(--stk)',  icon: Info },
  monitor:  { label: 'Monitor',  color: 'var(--mkt)',  icon: CheckCircle },
};

function WhyLadder({ row, domainColor }) {
  const whys = getWhys(row);
  return (
    <div className={styles.whyLadder}>
      {whys.map((w, i) => (
        <span
          key={i}
          className={styles.whyPill}
          style={i === 0 ? { background: domainColor + '18', color: domainColor, borderColor: domainColor + '40' } : {}}
          title={w}
        >
          <span className={styles.whyNum}>W{i + 1}</span>
          {w}
        </span>
      ))}
    </div>
  );
}

function SevBadge({ row }) {
  const sev = getSeverity(row);
  const meta = SEV_META[sev];
  const Icon = meta.icon;
  return (
    <span className={styles.sevBadge} style={{ color: meta.color, borderColor: meta.color + '40', background: meta.color + '12' }}>
      <Icon size={10} strokeWidth={2.5} />
      {meta.label}
    </span>
  );
}

function SKUModal({ row, domain, cur, onClose }) {
  if (!row) return null;
  const meta = DOMAIN_META[domain];
  const whys = getWhys(row);
  const sev = getSeverity(row);
  const sevMeta = SEV_META[sev];
  const SevIcon = sevMeta.icon;
  const extraCols = DOMAIN_EXTRA_COLS[domain] ?? [];

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.modalHeader} style={{ borderLeftColor: meta.color }}>
          <div>
            <div className={styles.modalSku}>{row.ItemNo ?? '—'}</div>
            <div className={styles.modalDesc}>{row.Description ?? '—'}</div>
            <div className={styles.modalMeta}>
              <span className={styles.catBadge}>{row.Category ?? '—'}</span>
              <span className={styles.catBadge}>{row['Sub Category'] ?? ''}</span>
              <span className={styles.revCat}>{row.Rev_Cat ?? ''}</span>
            </div>
          </div>
          <button className={styles.modalClose} onClick={onClose}><X size={16} /></button>
        </div>

        <div className={styles.modalBody}>
          {/* Severity + Loss */}
          <div className={styles.modalKpiRow}>
            <div className={styles.modalKpi}>
              <span className={styles.modalKpiLabel}>Severity</span>
              <span className={styles.sevBadge} style={{ color: sevMeta.color, borderColor: sevMeta.color + '40', background: sevMeta.color + '12', fontSize: 13 }}>
                <SevIcon size={12} strokeWidth={2.5} />{sevMeta.label}
              </span>
            </div>
            <div className={styles.modalKpi}>
              <span className={styles.modalKpiLabel}>Opp Loss 30D</span>
              <span className={styles.modalKpiVal} style={{ color: meta.color }}>
                {fmt(row['Loss of Sale 30D'] ?? row['Loss Of Sale 30D'], cur)}
              </span>
            </div>
            {extraCols.slice(0, 3).map(col => (
              <div key={col.key} className={styles.modalKpi}>
                <span className={styles.modalKpiLabel}>{col.label}</span>
                <span className={styles.modalKpiVal}>{fmtCol(row[col.key], col.type, cur)}</span>
              </div>
            ))}
          </div>

          {/* Why Ladder */}
          <div className={styles.modalSection}>
            <div className={styles.modalSectionTitle}>4-Why Root Cause Analysis</div>
            <div className={styles.whyTimeline}>
              {whys.map((w, i) => (
                <div key={i} className={styles.whyTimelineItem}>
                  <div className={styles.whyTimelineDot} style={{ background: i === 0 ? meta.color : 'var(--border-2)' }} />
                  {i < whys.length - 1 && <div className={styles.whyTimelineLine} />}
                  <div className={styles.whyTimelineText}>
                    <span className={styles.whyTimelineNum} style={{ color: i === 0 ? meta.color : 'var(--text-3)' }}>Why {i + 1}</span>
                    <span className={styles.whyTimelineVal}>{w}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Extra metrics */}
          {extraCols.length > 0 && (
            <div className={styles.modalSection}>
              <div className={styles.modalSectionTitle}>Key Metrics</div>
              <div className={styles.modalMetricsGrid}>
                {extraCols.map(col => (
                  <div key={col.key} className={styles.modalMetric}>
                    <span className={styles.modalMetricLabel}>{col.label}</span>
                    <span className={styles.modalMetricVal}>{fmtCol(row[col.key], col.type, cur)}</span>
                  </div>
                ))}
                {row['Range'] && (
                  <div className={styles.modalMetric}>
                    <span className={styles.modalMetricLabel}>Range</span>
                    <span className={styles.modalMetricVal}>{row['Range']}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Sentiment if available */}
          {row.SentimentExplanation && (
            <div className={styles.modalSection}>
              <div className={styles.modalSectionTitle}>Customer Sentiment</div>
              <div className={styles.sentimentBox}>
                <Star size={13} color="var(--stk)" />
                <span>{row.SentimentExplanation}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: 'var(--bg-3)', border: '1px solid var(--border-2)', borderRadius: 6, padding: '6px 10px', fontSize: 12 }}>
      <div style={{ color: 'var(--text-2)', marginBottom: 2 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.fill ?? p.color }}>{p.value} SKUs</div>
      ))}
    </div>
  );
};

export default function IssueView({ site, domain, issue }) {
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState('loss');
  const [selectedRow, setSelectedRow] = useState(null);
  const [showChart, setShowChart] = useState(false);

  const meta = DOMAIN_META[domain];
  const Icon = DOMAIN_ICONS[domain];
  const s = getSummary(site);
  const cur = s.currency === 'USD' ? '$' : '₹';
  const extraCols = DOMAIN_EXTRA_COLS[domain] ?? [];

  const rawRows = getIssueRows(site, domain, issue);

  const rows = useMemo(() => {
    let r = rawRows.filter(row => {
      if (!search) return true;
      const q = search.toLowerCase();
      return (
        (row.ItemNo ?? '').toLowerCase().includes(q) ||
        (row.Description ?? '').toLowerCase().includes(q) ||
        (row.Category ?? '').toLowerCase().includes(q) ||
        getWhys(row).some(w => w.toLowerCase().includes(q))
      );
    });
    return [...r].sort((a, b) => {
      if (sortKey === 'loss') {
        const al = parseFloat(a['Loss of Sale 30D'] ?? a['Loss Of Sale 30D'] ?? 0);
        const bl = parseFloat(b['Loss of Sale 30D'] ?? b['Loss Of Sale 30D'] ?? 0);
        return bl - al;
      }
      if (sortKey === 'sku') return (a.ItemNo ?? '').localeCompare(b.ItemNo ?? '');
      if (sortKey === 'rank') return (parseFloat(a['Rev Rank'] ?? 999)) - (parseFloat(b['Rev Rank'] ?? 999));
      return 0;
    });
  }, [rawRows, search, sortKey]);

  const totalLoss = rawRows.reduce(
    (acc, r) => acc + parseFloat(r['Loss of Sale 30D'] ?? r['Loss Of Sale 30D'] ?? 0), 0
  );
  const totalOppDomain = getDomainOppLoss(site, domain);

  const sevCounts = rawRows.reduce((acc, r) => {
    const sv = getSeverity(r); acc[sv] = (acc[sv] ?? 0) + 1; return acc;
  }, {});

  const catData = useMemo(() => getCategoryBreakdown(rawRows), [rawRows]);

  return (
    <div className={styles.wrap}>
      {/* Header */}
      <div className={styles.header} style={{ borderLeftColor: meta.color }}>
        <div className={styles.headerLeft}>
          <div className={styles.iconBox} style={{ background: meta.bg }}>
            <Icon size={16} color={meta.color} strokeWidth={2} />
          </div>
          <div>
            <div className={styles.issueName}>{issue.replace(/_/g, ' ')}</div>
            <div className={styles.issueMeta}>
              {meta.label} · {rawRows.length} items · Opp loss&nbsp;
              <strong style={{ color: meta.color }}>{fmt(totalLoss, cur)}</strong>
              &nbsp;/ domain {fmt(totalOppDomain, cur)}
            </div>
          </div>
        </div>

        <div className={styles.headerRight}>
          {/* Severity summary */}
          <div className={styles.sevSummary}>
            {Object.entries(sevCounts).map(([sev, cnt]) => {
              const m = SEV_META[sev];
              return (
                <div key={sev} className={styles.sevChip} style={{ background: m.color + '12', borderColor: m.color + '40' }}>
                  <span style={{ color: m.color }}>{cnt}</span>
                  <span className={styles.sevChipLabel}>{m.label}</span>
                </div>
              );
            })}
          </div>
          <button
            className={`${styles.chartToggle} ${showChart ? styles.chartToggleActive : ''}`}
            style={showChart ? { borderColor: meta.color + '60', color: meta.color } : {}}
            onClick={() => setShowChart(v => !v)}
            title="Category breakdown"
          >
            <BarChart2 size={13} />
            <span>Chart</span>
          </button>
        </div>
      </div>

      {/* Category chart */}
      {showChart && (
        <div className={styles.catChartCard}>
          <div className={styles.catChartTitle}>Category Breakdown — {issue.replace(/_/g, ' ')}</div>
          <ResponsiveContainer width="100%" height={140}>
            <BarChart data={catData} barSize={28}>
              <XAxis dataKey="name" tick={{ fill: 'var(--text-3)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
              <Bar dataKey="value" radius={[3, 3, 0, 0]}>
                {catData.map((_, i) => <Cell key={i} fill={meta.color} fillOpacity={1 - i * 0.1} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Controls */}
      <div className={styles.controls}>
        <div className={styles.searchWrap}>
          <Search size={13} color="var(--text-3)" />
          <input
            className={styles.searchInput}
            placeholder="Filter SKU, description, category, root cause…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && (
            <button className={styles.clearSearch} onClick={() => setSearch('')}><X size={11} /></button>
          )}
        </div>
        <div className={styles.sortGroup}>
          <span className={styles.sortLabel}><ArrowUpDown size={11} /> Sort:</span>
          {[['loss', 'Opp Loss'], ['rank', 'Rev Rank'], ['sku', 'SKU']].map(([k, l]) => (
            <button
              key={k}
              className={`${styles.sortBtn} ${sortKey === k ? styles.sortActive : ''}`}
              onClick={() => setSortKey(k)}
              style={sortKey === k ? { borderColor: meta.color + '60', color: meta.color } : {}}
            >
              {l}
            </button>
          ))}
        </div>
        <span className={styles.resultCount}>{rows.length} rows</span>
      </div>

      {/* Table */}
      {rows.length === 0 ? (
        <div className={styles.empty}>
          <CheckCircle size={28} color="var(--text-3)" />
          <p>No items match your filter</p>
        </div>
      ) : (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th style={{ width: 120 }}>SKU</th>
                <th style={{ width: 180 }}>Description</th>
                <th style={{ width: 80 }}>Category</th>
                <th>Root Cause (4-Why)</th>
                {extraCols.map(c => <th key={c.key} style={{ width: 82 }}>{c.label}</th>)}
                <th style={{ width: 100 }}>Opp Loss 30D</th>
                <th style={{ width: 88 }}>Severity</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => {
                const loss = parseFloat(row['Loss of Sale 30D'] ?? row['Loss Of Sale 30D'] ?? 0);
                return (
                  <tr
                    key={i}
                    className={styles.row}
                    onClick={() => setSelectedRow(row)}
                    title="Click for detail"
                  >
                    <td>
                      <span className={styles.skuId}>{row.ItemNo ?? '—'}</span>
                      <span className={styles.revCat}>{row.Rev_Cat ?? ''}</span>
                    </td>
                    <td className={styles.descCell}>{row.Description ?? '—'}</td>
                    <td>
                      <span className={styles.catBadge}>{row.Category ?? '—'}</span>
                    </td>
                    <td>
                      <WhyLadder row={row} domainColor={meta.color} />
                    </td>
                    {extraCols.map(c => (
                      <td key={c.key} className={styles.metricCell}>
                        {fmtCol(row[c.key], c.type, cur)}
                      </td>
                    ))}
                    <td>
                      {loss > 0 ? (
                        <span className={styles.lossVal}>{fmt(loss, cur)}</span>
                      ) : (
                        <span className={styles.lossNil}>—</span>
                      )}
                    </td>
                    <td><SevBadge row={row} /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* SKU Detail Modal */}
      {selectedRow && (
        <SKUModal
          row={selectedRow}
          domain={domain}
          cur={cur}
          onClose={() => setSelectedRow(null)}
        />
      )}
    </div>
  );
}
