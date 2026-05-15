let raw = null;

export async function loadPipelineData() {
  if (raw) return raw;
  const response = await fetch(`${import.meta.env.BASE_URL}data/pipeline_slim.json`);
  if (!response.ok) {
    throw new Error('Unable to load pipeline data.');
  }
  raw = await response.json();
  return raw;
}

export const DOMAINS = ['revenue', 'stock', 'marketing', 'product_health'];

export const DOMAIN_META = {
  revenue:        { label: 'Revenue',        color: 'var(--rev)', bg: 'var(--rev-bg)' },
  stock:          { label: 'Stock',           color: 'var(--stk)', bg: 'var(--stk-bg)' },
  marketing:      { label: 'Marketing',       color: 'var(--mkt)', bg: 'var(--mkt-bg)' },
  product_health: { label: 'Product Health',  color: 'var(--ph)',  bg: 'var(--ph-bg)'  },
};

export const SITES = {
  usa:   { label: 'USA',   currency: '$',  currencyCode: 'USD', flag: '🇺🇸' },
  india: { label: 'India', currency: '₹',  currencyCode: 'INR', flag: '🇮🇳' },
};

/** Domain-specific extra columns shown in table beyond core columns */
export const DOMAIN_EXTRA_COLS = {
  revenue: [
    { key: 'Rev 30 D',      label: 'Rev 30D',    type: 'currency' },
    { key: 'Rev 7D',        label: 'Rev 7D',     type: 'currency' },
    { key: '30DVs90D Rev%', label: '30v90D%',    type: 'pct' },
    { key: 'Rev Rank',      label: 'Rank',       type: 'num' },
    { key: 'Amz Stock',     label: 'Amz Stk',   type: 'num' },
  ],
  stock: [
    { key: 'Current_DOS',   label: 'DOS',        type: 'num' },
    { key: 'Fill_Rate_365D%', label: 'Fill Rate', type: 'pct' },
    { key: 'Days_Stockout', label: 'OOS Days',   type: 'num' },
    { key: 'OnHand',        label: 'On Hand',    type: 'num' },
    { key: 'ForecastedDemand_30D', label: 'Fcst 30D', type: 'num' },
  ],
  marketing: [
    { key: 'Spend_30D',     label: 'Spend 30D',  type: 'currency' },
    { key: 'CTR_30D%',      label: 'CTR 30D',    type: 'pct' },
    { key: 'CVR_30D%',      label: 'CVR 30D',    type: 'pct' },
    { key: 'ROAS_30D',      label: 'ROAS',       type: 'num' },
    { key: 'TACoS_30D%',    label: 'TACoS',      type: 'pct' },
  ],
  product_health: [
    { key: 'AvgRating_30D', label: 'Rating',     type: 'num' },
    { key: 'TotalRatings',  label: '# Reviews',  type: 'num' },
    { key: 'Return%_30D',   label: 'Return%',    type: 'pct' },
    { key: 'UnplannedCharge%', label: 'Unplanned%', type: 'pct' },
    { key: 'APlusPage',     label: 'A+ Page',    type: 'bool' },
  ],
};

export function getIssueSummary(site) {
  if (!raw?.[site]) return {};
  const d = raw[site];
  const result = {};
  DOMAINS.forEach(domain => {
    result[domain] = {};
    Object.entries(d[domain]).forEach(([issue, rows]) => {
      result[domain][issue] = rows.length;
    });
  });
  return result;
}

export function getIssueRows(site, domain, issue) {
  return raw?.[site]?.[domain]?.[issue] ?? [];
}

export function getSummary(site) {
  return raw?.[site]?.summary ?? {};
}

export function getDomainOppLoss(site, domain) {
  if (!raw?.[site]) return 0;
  let total = 0;
  Object.values(raw?.[site]?.[domain] ?? {}).forEach(rows => {
    rows.forEach(r => { total += parseFloat(r['Loss of Sale 30D'] ?? r['Loss Of Sale 30D'] ?? 0); });
  });
  return total;
}

export function getDomainFlagCount(site, domain) {
  return Object.values(raw?.[site]?.[domain] ?? {}).reduce((a, rows) => a + rows.length, 0);
}

export function getAllIssuesSorted(site) {
  if (!raw?.[site]) return [];
  const out = [];
  DOMAINS.forEach(domain => {
    Object.entries(raw[site]?.[domain] ?? {}).forEach(([issue, rows]) => {
      const loss = rows.reduce((a, r) => a + parseFloat(r['Loss of Sale 30D'] ?? r['Loss Of Sale 30D'] ?? 0), 0);
      out.push({ domain, issue, count: rows.length, loss });
    });
  });
  return out.sort((a, b) => b.loss - a.loss);
}

export function getWhys(row) {
  return [
    row['Why 1'] ?? row['Why 1 ?'],
    row['Why 2'] ?? row['Why 2 ?'],
    row['Why 3'] ?? row['Why 3?'],
    row['Why 4'] ?? row['Why 4 ?'],
  ].filter(Boolean);
}

export function fmt(val, currency = '') {
  if (val === null || val === undefined || val === '') return '—';
  const n = parseFloat(val);
  if (isNaN(n)) return String(val);
  if (Math.abs(n) >= 1e7) return currency + (n / 1e7).toFixed(1) + 'Cr';
  if (Math.abs(n) >= 1e5) return currency + (n / 1e5).toFixed(1) + 'L';
  if (Math.abs(n) >= 1e6) return currency + (n / 1e6).toFixed(1) + 'M';
  if (Math.abs(n) >= 1e3) return currency + (n / 1e3).toFixed(1) + 'K';
  return currency + n.toFixed(1);
}

export function fmtPct(val) {
  if (val === null || val === undefined || val === '') return '—';
  const n = parseFloat(val);
  if (isNaN(n)) return '—';
  return n.toFixed(1) + '%';
}

export function fmtCol(val, type, currency = '') {
  if (val === null || val === undefined || val === '') return '—';
  if (type === 'bool') return val ? '✓' : '✗';
  if (type === 'pct') return fmtPct(val);
  if (type === 'currency') return fmt(val, currency);
  if (type === 'num') {
    const n = parseFloat(val);
    if (isNaN(n)) return String(val);
    return n % 1 === 0 ? n.toLocaleString() : n.toFixed(1);
  }
  return String(val);
}

export function getSeverity(row) {
  const w = (row['Why 1'] ?? row['Why 1 ?'] ?? '').toLowerCase();
  if (w.includes('stockout') || w.includes('defect') || w.includes('pilferage') || w.includes('oos') || w.includes('dead sku'))
    return 'critical';
  if (w.includes('poor marketing') || w.includes('low') || w.includes('high') || w.includes('no marketing') || w.includes('no a+'))
    return 'warning';
  return 'monitor';
}

export function getIssueLoss(site, domain, issue) {
  return (raw?.[site]?.[domain]?.[issue] ?? []).reduce(
    (a, r) => a + parseFloat(r['Loss of Sale 30D'] ?? r['Loss Of Sale 30D'] ?? 0), 0
  );
}

export function getCategoryBreakdown(rows) {
  const map = {};
  rows.forEach(r => { const cat = r.Category ?? 'Other'; map[cat] = (map[cat] ?? 0) + 1; });
  return Object.entries(map).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([name, value]) => ({ name, value }));
}
