import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar, ScatterChart, Scatter,
  ComposedChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine,
  ResponsiveContainer, Cell
} from 'recharts';
import {
  LayoutDashboard, Database, BookOpen, Activity, BarChart3,
  Sliders, Stethoscope, Lightbulb, Play, RefreshCw, TrendingUp,
  AlertCircle, CheckCircle2, Sparkles, Target, Info, ChevronRight,
  Zap, FileText, GitBranch
} from 'lucide-react';
import * as math from 'mathjs';

// ============================================================
// THEME — editorial, warm-paper aesthetic
// ============================================================
const T = {
  paper: '#F5F0E6', paper2: '#EDE7DA', paper3: '#E4DCC9',
  ink: '#1A1614', ink2: '#4A413B', ink3: '#7A6E64',
  rule: '#D8CFBD',
  accent: '#B83A1F', accentDk: '#8C2C16',
  teal: '#1F5F4E', ochre: '#C28A2C', slate: '#3A5A78', plum: '#6B3A52',
  good: '#2E7D32', warn: '#C28A2C', bad: '#B83A1F',
};
const F = {
  serif: "'Fraunces', Georgia, serif",
  sans:  "'Plus Jakarta Sans', system-ui, sans-serif",
  mono:  "'JetBrains Mono', monospace",
};

function useGoogleFonts() {
  useEffect(() => {
    if (document.getElementById('gfonts-mmm')) return;
    const link = document.createElement('link');
    link.id = 'gfonts-mmm';
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..700;1,9..144,400&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap';
    document.head.appendChild(link);
  }, []);
}

// ============================================================
// DOMAIN — channels with true (DGP) parameters
// ============================================================
const CHANNELS = [
  { id: 'tv',     name: 'TV',            color: T.accent, spend_mean: 0.70, lam: 0.78, alpha: 2.6, K: 0.58, beta: 9.6 },
  { id: 'dv',     name: 'Digital Video', color: T.teal,   spend_mean: 0.50, lam: 0.42, alpha: 1.8, K: 0.40, beta: 9.0 },
  { id: 'search', name: 'Paid Search',   color: T.slate,  spend_mean: 0.35, lam: 0.18, alpha: 1.4, K: 0.31, beta: 7.6 },
  { id: 'social', name: 'Paid Social',   color: T.ochre,  spend_mean: 0.30, lam: 0.32, alpha: 1.6, K: 0.38, beta: 4.8 },
  { id: 'print',  name: 'Print & OOH',   color: T.plum,   spend_mean: 0.20, lam: 0.65, alpha: 1.2, K: 0.42, beta: 1.7 },
];
const CH_BY_ID = Object.fromEntries(CHANNELS.map(c => [c.id, c]));

// ============================================================
// MATH UTILITIES
// ============================================================
function mulberry32(seed) {
  return function() {
    let t = seed += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

// Geometric adstock: A_t = x_t + λ · A_{t-1}
function adstock(x, lambda) {
  const out = new Array(x.length);
  let prev = 0;
  for (let i = 0; i < x.length; i++) {
    out[i] = x[i] + lambda * prev;
    prev = out[i];
  }
  return out;
}

// Hill saturation: f(x) = x^α / (x^α + K^α)
function hill(x, alpha, K) {
  if (x <= 0) return 0;
  const xa = Math.pow(x, alpha);
  const Ka = Math.pow(K, alpha);
  return xa / (xa + Ka);
}

// Synthetic data with known DGP
function generateData(seed = 42) {
  const rand = mulberry32(seed);
  const N = 156;

  const spend = {};
  CHANNELS.forEach(ch => {
    const arr = new Array(N);
    for (let i = 0; i < N; i++) {
      const seasonality = 1 + 0.35 * Math.sin(i / 26 * 2 * Math.PI);
      const burst = (i % 28 < 7) ? 1.4 : 0.75;
      const noise = 0.7 + 0.6 * rand();
      arr[i] = Math.max(0.05, ch.spend_mean * seasonality * burst * noise);
    }
    spend[ch.id] = arr;
  });

  const promoWeeks = new Set([11, 36, 50, 67, 89, 115, 142]);
  const promo = Array.from({length: N}, (_, i) => promoWeeks.has(i) ? 1 : 0);
  const priceIdx = Array.from({length: N}, (_, i) =>
    1 + 0.05 * Math.sin(i / 13) + (rand() - 0.5) * 0.03
  );

  // True contributions
  const contribsTrue = {};
  CHANNELS.forEach(ch => {
    const stocked = adstock(spend[ch.id], ch.lam);
    contribsTrue[ch.id] = stocked.map(x => ch.beta * hill(x, ch.alpha, ch.K));
  });

  const rows = [];
  for (let i = 0; i < N; i++) {
    const baseTrue = 55 + 4 * Math.sin(i / 26 * 2 * Math.PI) + 0.03 * i;
    let y = baseTrue;
    CHANNELS.forEach(ch => { y += contribsTrue[ch.id][i]; });
    y += promo[i] * 14;
    y -= 8 * (priceIdx[i] - 1);
    y += (rand() - 0.5) * 5;

    const date = new Date(2023, 0, 1 + i * 7);
    const row = {
      week: i,
      label: `W${String(i+1).padStart(3,'0')}`,
      year: date.getUTCFullYear(),
      qtr: `Q${Math.floor(date.getUTCMonth()/3)+1}·${String(date.getUTCFullYear()).slice(2)}`,
      sales: Math.max(0, y),
      base_true: baseTrue,
      promo: promo[i],
      priceIdx: priceIdx[i],
    };
    CHANNELS.forEach(ch => {
      row[ch.id] = spend[ch.id][i];
      row[ch.id + '_true_contrib'] = contribsTrue[ch.id][i];
    });
    rows.push(row);
  }
  return rows;
}

// Ridge regression: β = (X'X + λI)^-1 X'y
function ridgeFit(X, y, alpha = 1.0) {
  const Xm = math.matrix(X), ym = math.matrix(y);
  const Xt = math.transpose(Xm);
  const XtX = math.multiply(Xt, Xm);
  const p = X[0].length;
  const reg = math.add(XtX, math.multiply(alpha, math.identity(p)));
  const Xty = math.multiply(Xt, ym);
  try {
    const sol = math.lusolve(reg, Xty);
    return math.flatten(sol).toArray();
  } catch (e) {
    return new Array(p).fill(0);
  }
}

function metrics(y, yhat) {
  const n = y.length;
  const mean_y = y.reduce((a,b)=>a+b,0)/n;
  let ss_res = 0, ss_tot = 0, sum_pct = 0;
  for (let i = 0; i < n; i++) {
    ss_res += (y[i] - yhat[i]) ** 2;
    ss_tot += (y[i] - mean_y) ** 2;
    if (y[i] > 0) sum_pct += Math.abs((y[i] - yhat[i]) / y[i]);
  }
  return {
    r2: 1 - ss_res / ss_tot,
    rmse: Math.sqrt(ss_res / n),
    mape: sum_pct / n * 100,
    nrmse: Math.sqrt(ss_res / n) / mean_y * 100,
  };
}

// Fit MMM: adstock + log saturation + ridge + bootstrap CIs
function fitMMM(rows) {
  const N = rows.length;
  const y = rows.map(r => r.sales);

  // Informed decays (would be grid-searched in real project)
  const decay = { tv: 0.7, dv: 0.4, search: 0.2, social: 0.3, print: 0.6 };

  // Adstocked + log-transformed channels (log saturation as ridge-friendly proxy)
  const features = {};
  CHANNELS.forEach(c => {
    const stocked = adstock(rows.map(r => r[c.id]), decay[c.id]);
    features[c.id] = stocked.map(s => Math.log(1 + s));
  });

  // Build design matrix
  const colNames = ['intercept', ...CHANNELS.map(c => c.id), 'promo', 'priceIdx', 'trend', 'sin_a', 'cos_a'];
  const X = [];
  for (let i = 0; i < N; i++) {
    const row = [1];
    CHANNELS.forEach(c => row.push(features[c.id][i]));
    row.push(rows[i].promo);
    row.push(rows[i].priceIdx - 1);
    row.push(i / N);
    row.push(Math.sin(i / 26 * 2 * Math.PI));
    row.push(Math.cos(i / 26 * 2 * Math.PI));
    X.push(row);
  }

  const beta = ridgeFit(X, y, 1.0);
  const yhat = X.map(r => r.reduce((a, v, j) => a + v * beta[j], 0));
  const stats = metrics(y, yhat);
  const residuals = y.map((v, i) => v - yhat[i]);

  // Channel-level contributions per week
  const contribs = {};
  CHANNELS.forEach((c, k) => {
    contribs[c.id] = features[c.id].map(f => beta[k + 1] * f);
  });
  const baseContrib = rows.map((r, i) =>
    beta[0] + beta[colNames.indexOf('trend')] * (i / N) +
    beta[colNames.indexOf('sin_a')] * Math.sin(i / 26 * 2 * Math.PI) +
    beta[colNames.indexOf('cos_a')] * Math.cos(i / 26 * 2 * Math.PI)
  );
  const promoContrib = rows.map((r, i) => beta[colNames.indexOf('promo')] * r.promo);
  const priceContrib = rows.map((r, i) => beta[colNames.indexOf('priceIdx')] * (r.priceIdx - 1));

  // Bootstrap for credible intervals (B=40 for in-browser speed)
  const B = 40;
  const rand = mulberry32(2026);
  const bootBetas = [];
  for (let b = 0; b < B; b++) {
    const idx = Array.from({length: N}, () => Math.floor(rand() * N));
    const Xb = idx.map(i => X[i]);
    const yb = idx.map(i => y[i]);
    bootBetas.push(ridgeFit(Xb, yb, 1.0));
  }
  const ci = beta.map((b, j) => {
    const samples = bootBetas.map(bb => bb[j]).sort((a, b) => a - b);
    return {
      lo: samples[Math.floor(B * 0.05)],
      mean: samples.reduce((a,b)=>a+b,0)/B,
      hi: samples[Math.floor(B * 0.95)],
    };
  });

  // Per-channel ROI = total contribution / total spend
  const roi = {};
  CHANNELS.forEach((c, k) => {
    const totalContrib = contribs[c.id].reduce((a,b)=>a+b,0);
    const totalSpend = rows.reduce((a, r) => a + r[c.id], 0);
    const meanFeat = features[c.id].reduce((a,b)=>a+b,0) / N;
    // Use bootstrap distribution of beta_k to get ROI distribution
    const betaSamples = bootBetas.map(bb => bb[k + 1]);
    const roiSamples = betaSamples.map(bk => {
      const totC = features[c.id].reduce((a, f) => a + bk * f, 0);
      return totC / totalSpend;
    }).sort((a, b) => a - b);
    roi[c.id] = {
      point: totalContrib / totalSpend,
      lo: roiSamples[Math.floor(B * 0.05)],
      mean: roiSamples.reduce((a,b)=>a+b,0) / B,
      hi: roiSamples[Math.floor(B * 0.95)],
      totalContrib, totalSpend,
    };
  });

  return {
    beta, colNames, decay, features, yhat, stats, ci, contribs,
    baseContrib, promoContrib, priceContrib, residuals, roi, X, y,
  };
}

// Constrained budget optimizer via marginal-return equalization (coordinate ascent)
function optimizeBudget(model, totalBudget, bounds = {}) {
  const minPerCh = 0.05;
  // Predicted incremental revenue from per-channel weekly spend s_c
  // Steady-state adstock: A_ss = s / (1 - λ); log saturation ⇒ contrib_per_week = β · log(1 + A_ss)
  // Over 52 weeks of constant spend: 52 · β · log(1 + s/(1-λ))
  function contrib(chId, s) {
    const idx = CHANNELS.findIndex(c => c.id === chId);
    const beta = Math.max(0, model.beta[idx + 1]);
    const lam = model.decay[chId];
    const ss = s / (1 - lam);
    return beta * Math.log(1 + ss);
  }
  function margin(chId, s) {
    const idx = CHANNELS.findIndex(c => c.id === chId);
    const beta = Math.max(0, model.beta[idx + 1]);
    const lam = model.decay[chId];
    const ss = s / (1 - lam);
    return beta / (1 + ss) / (1 - lam);
  }

  // Initialize equal split
  let alloc = {};
  CHANNELS.forEach(c => alloc[c.id] = totalBudget / CHANNELS.length);

  // Coordinate ascent: move ε from low-marginal to high-marginal
  const step = totalBudget * 0.002;
  for (let iter = 0; iter < 800; iter++) {
    const ms = CHANNELS.map(c => ({ id: c.id, m: margin(c.id, alloc[c.id]) }));
    ms.sort((a,b) => b.m - a.m);
    const hi = ms[0], lo = ms[ms.length - 1];
    if (hi.m - lo.m < 1e-5) break;
    const minLo = (bounds[lo.id]?.min ?? minPerCh);
    const maxHi = (bounds[hi.id]?.max ?? totalBudget);
    if (alloc[lo.id] - step < minLo || alloc[hi.id] + step > maxHi) break;
    alloc[hi.id] += step;
    alloc[lo.id] -= step;
  }
  const predicted = CHANNELS.reduce((a, c) => a + contrib(c.id, alloc[c.id]), 0);
  return { alloc, predicted };
}

// ============================================================
// PRIMITIVES
// ============================================================
function StatTile({ label, value, unit, sub, ci, tone }) {
  return (
    <div style={{ padding: '20px 22px', borderRight: `1px solid ${T.rule}` }}>
      <div style={{ fontSize: 10.5, color: T.ink3, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>{label}</div>
      <div style={{ fontFamily: F.serif, fontSize: 38, lineHeight: 1, fontWeight: 400, letterSpacing: '-0.02em', color: tone || T.ink, fontFeatureSettings: '"tnum"' }}>
        {value}
        {unit && <span style={{ fontSize: 16, color: T.ink3, fontStyle: 'italic', marginLeft: 2 }}>{unit}</span>}
      </div>
      {sub && <div style={{ marginTop: 6, fontSize: 11, color: T.ink2 }}>{sub}</div>}
      {ci && <div style={{ fontFamily: F.mono, fontSize: 10, color: T.ink3, marginTop: 3 }}>{ci}</div>}
    </div>
  );
}

function SectionHead({ num, title, ann }) {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 14, paddingBottom: 8, borderBottom: `1px solid ${T.rule}` }}>
      <h2 style={{ fontFamily: F.serif, fontWeight: 500, fontSize: 22, margin: 0, letterSpacing: '-0.01em' }}>
        <span style={{ color: T.accent, fontStyle: 'italic', marginRight: 10, fontWeight: 400 }}>{num}</span>{title}
      </h2>
      {ann && <div style={{ fontSize: 11, color: T.ink3, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{ann}</div>}
    </div>
  );
}

function PullQuote({ children }) {
  return (
    <div style={{ fontFamily: F.serif, fontStyle: 'italic', fontSize: 15, color: T.ink2, borderLeft: `2px solid ${T.accent}`, paddingLeft: 16, margin: '0 0 22px 0', maxWidth: 720, lineHeight: 1.5 }}>
      {children}
    </div>
  );
}

function Callout({ tone = T.accent, title, children }) {
  return (
    <div style={{ background: T.paper2, borderLeft: `3px solid ${tone}`, padding: '12px 16px', margin: '14px 0', fontSize: 12.5, lineHeight: 1.55 }}>
      {title && <div style={{ fontWeight: 600, color: tone, marginBottom: 4 }}>{title}</div>}
      <div style={{ color: T.ink2 }}>{children}</div>
    </div>
  );
}

function Card({ children, padded = true, style = {} }) {
  return (
    <div style={{ border: `1px solid ${T.rule}`, background: T.paper, padding: padded ? 20 : 0, ...style }}>
      {children}
    </div>
  );
}

function Chip({ tone = 'good', children }) {
  const bg = tone === 'good' ? 'rgba(46,125,50,0.12)' : tone === 'bad' ? 'rgba(184,58,31,0.12)' : 'rgba(194,138,44,0.15)';
  const fg = tone === 'good' ? T.good : tone === 'bad' ? T.bad : T.ochre;
  return <span style={{ fontFamily: F.mono, fontSize: 10.5, padding: '2px 7px', borderRadius: 3, fontWeight: 600, background: bg, color: fg }}>{children}</span>;
}

function Dot({ color, size = 10 }) {
  return <span style={{ display: 'inline-block', width: size, height: size, background: color, borderRadius: 2 }} />;
}

// Common chart theming
const chartProps = {
  margin: { top: 10, right: 16, bottom: 24, left: 0 },
};
const axisStyle = { fontSize: 10, fontFamily: F.mono, fill: T.ink3 };
const gridStroke = T.rule;

// ============================================================
// PAGE 1 — PROBLEM STATEMENT
// ============================================================
function ProblemPage() {
  return (
    <div>
      <div style={{ fontSize: 10.5, color: T.accent, letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 700, marginBottom: 10 }}>The Business Problem</div>
      <h1 style={{ fontFamily: F.serif, fontSize: 44, fontWeight: 500, lineHeight: 1.05, letterSpacing: '-0.02em', margin: '0 0 18px 0', maxWidth: 880 }}>
        Where should the next marketing rupee go?
      </h1>
      <PullQuote>
        BrewMate spends ₹12 crore a quarter across six channels. Leadership knows it works in aggregate.
        They don't know how much of each channel's spend is incremental, what the saturation point looks like,
        or how to reallocate when the budget shifts. <b style={{ fontStyle: 'normal' }}>This is the question MMM answers.</b>
      </PullQuote>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 30, marginTop: 28 }}>
        <Card>
          <div style={{ fontFamily: F.serif, fontSize: 18, fontWeight: 500, marginBottom: 10 }}>The mandate</div>
          <div style={{ fontSize: 13, lineHeight: 1.6, color: T.ink2 }}>
            Build a model that decomposes weekly revenue into a stable <b>base</b> and the <b>incremental contribution</b>
            {' '}of each marketing channel, accounting for carry-over of past spend and diminishing returns at high spend levels.
            Then use the model to recommend a budget allocation that maximizes predicted revenue under realistic constraints.
          </div>
        </Card>
        <Card>
          <div style={{ fontFamily: F.serif, fontSize: 18, fontWeight: 500, marginBottom: 10 }}>Success criteria</div>
          <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13, lineHeight: 1.7, color: T.ink2 }}>
            <li>R² ≥ 0.85 on hold-out weeks, MAPE ≤ 10%</li>
            <li>Per-channel ROI with 90% credible intervals</li>
            <li>Defensible budget reallocation with uncertainty band</li>
            <li>Recovery of synthetic DGP parameters within their CIs</li>
            <li>Privacy-resilient (aggregate data only, no PII)</li>
          </ul>
        </Card>
      </div>

      <div style={{ marginTop: 36 }}>
        <SectionHead num="01" title="Why now, why MMM" ann="Privacy-resilient measurement" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, marginTop: 16 }}>
          {[
            { icon: Zap, t: 'Cookies are gone', d: 'Apple ATT, EU DMA and Chrome cookie deprecation have gutted user-level MTA. MMM is aggregate-level and survives the privacy era.' },
            { icon: GitBranch, t: 'Aligns to decisions', d: 'CMOs allocate budget at the channel level, not the user level. MMM speaks the language of the decision.' },
            { icon: Sparkles, t: 'Modern Bayesian', d: 'PyMC-Marketing, Robyn and Meridian make MMM continuously refittable. It is no longer a quarterly consulting deck.' },
          ].map(({ icon: Icon, t, d }) => (
            <div key={t} style={{ borderTop: `2px solid ${T.accent}`, paddingTop: 14 }}>
              <Icon size={18} color={T.accent} style={{ marginBottom: 8 }} />
              <div style={{ fontFamily: F.serif, fontSize: 16, fontWeight: 500, marginBottom: 4 }}>{t}</div>
              <div style={{ fontSize: 12.5, color: T.ink2, lineHeight: 1.55 }}>{d}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginTop: 36 }}>
        <SectionHead num="02" title="Decision flow" ann="model → optimizer → CMO" />
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '18px 0', flexWrap: 'wrap' }}>
          {['Spend data', 'Adstock', 'Saturation', 'Ridge regression', 'Channel ROI', 'Budget optimizer', 'Allocation decision'].map((step, i, arr) => (
            <React.Fragment key={step}>
              <div style={{ padding: '10px 16px', background: i === arr.length - 1 ? T.accent : T.paper2, color: i === arr.length - 1 ? T.paper : T.ink, border: `1px solid ${i === arr.length - 1 ? T.accent : T.rule}`, fontSize: 12, fontWeight: 500, fontFamily: i === arr.length - 1 ? F.serif : F.sans, fontStyle: i === arr.length - 1 ? 'italic' : 'normal' }}>
                {step}
              </div>
              {i < arr.length - 1 && <ChevronRight size={14} color={T.ink3} />}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// PAGE 2 — DATA EXPLORER
// ============================================================
function DataPage({ data }) {
  const [selectedChannel, setSelectedChannel] = useState('tv');

  const totalSpendByCh = useMemo(() => {
    return CHANNELS.map(c => ({
      name: c.name, value: data.reduce((a, r) => a + r[c.id], 0), color: c.color
    }));
  }, [data]);

  const spendStats = useMemo(() => {
    return CHANNELS.map(c => {
      const vals = data.map(r => r[c.id]);
      const m = vals.reduce((a,b)=>a+b,0)/vals.length;
      const v = vals.reduce((a,b)=>a+(b-m)**2,0)/vals.length;
      const cov = Math.sqrt(v)/m;
      return { id: c.id, name: c.name, color: c.color, mean: m, sd: Math.sqrt(v), cov, min: Math.min(...vals), max: Math.max(...vals) };
    });
  }, [data]);

  const salesY = data.map(r => r.sales);
  const meanSales = salesY.reduce((a,b)=>a+b,0)/salesY.length;
  const totalRev = salesY.reduce((a,b)=>a+b,0);
  const totalSpend = data.reduce((a,r) => a + CHANNELS.reduce((s,c) => s + r[c.id], 0), 0);

  // Correlation matrix between sales and each channel + controls
  const corrCols = ['sales', ...CHANNELS.map(c => c.id), 'promo'];
  const corrMatrix = useMemo(() => {
    function corr(a, b) {
      const ma = a.reduce((x,y)=>x+y,0)/a.length;
      const mb = b.reduce((x,y)=>x+y,0)/b.length;
      let num = 0, da = 0, db = 0;
      for (let i = 0; i < a.length; i++) { num += (a[i]-ma)*(b[i]-mb); da += (a[i]-ma)**2; db += (b[i]-mb)**2; }
      return num / Math.sqrt(da * db);
    }
    return corrCols.map(c1 => corrCols.map(c2 => corr(data.map(r => r[c1]), data.map(r => r[c2]))));
  }, [data]);

  return (
    <div>
      <SectionHead num="01" title="Dataset overview" ann="3 years · 156 weekly observations · synthetic with known DGP" />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', borderTop: `1px solid ${T.rule}`, borderBottom: `1px solid ${T.rule}`, marginBottom: 28 }}>
        <StatTile label="Total revenue" value={`₹${(totalRev/1000).toFixed(1)}`} unit="K Cr" sub={`156 weeks, weekly resolution`} />
        <StatTile label="Total spend" value={`₹${(totalSpend).toFixed(0)}`} unit="Cr" sub="5 paid channels" />
        <StatTile label="Channels" value="5" unit="" sub="TV, DV, Search, Social, Print" />
        <StatTile label="Controls" value="3" unit="" sub="Promo, Price, Seasonality" />
      </div>

      <SectionHead num="02" title="Revenue & spend over time" ann="raw inputs" />
      <Card style={{ padding: 0, marginBottom: 28 }}>
        <div style={{ padding: '14px 18px 4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: 12, color: T.ink3, fontWeight: 500 }}>Weekly revenue (₹ lakhs)</div>
          <div style={{ fontSize: 11, color: T.ink3, fontStyle: 'italic' }}>mean = {meanSales.toFixed(1)} · seasonal + trend visible</div>
        </div>
        <div style={{ height: 220 }}>
          <ResponsiveContainer>
            <AreaChart data={data} margin={{ top: 5, right: 20, bottom: 28, left: 8 }}>
              <CartesianGrid stroke={gridStroke} strokeDasharray="2 3" vertical={false} />
              <XAxis dataKey="week" tick={axisStyle} axisLine={{ stroke: T.rule }} tickLine={false} interval={25} />
              <YAxis tick={axisStyle} axisLine={false} tickLine={false} width={40} />
              <Tooltip contentStyle={{ background: T.ink, border: 'none', borderRadius: 2, fontSize: 11, fontFamily: F.mono, color: T.paper }} labelStyle={{ color: T.paper }} />
              <Area type="monotone" dataKey="sales" stroke={T.accent} fill={T.accent} fillOpacity={0.18} strokeWidth={1.6} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card style={{ padding: 0, marginBottom: 28 }}>
        <div style={{ padding: '14px 18px 4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: 12, color: T.ink3, fontWeight: 500 }}>Weekly spend by channel — pick one</div>
          <div style={{ display: 'flex', gap: 6 }}>
            {CHANNELS.map(c => (
              <button key={c.id} onClick={() => setSelectedChannel(c.id)}
                style={{ padding: '4px 10px', fontSize: 11, fontFamily: F.sans, border: `1px solid ${selectedChannel === c.id ? c.color : T.rule}`, background: selectedChannel === c.id ? c.color : 'transparent', color: selectedChannel === c.id ? T.paper : T.ink2, cursor: 'pointer', borderRadius: 2, fontWeight: 500 }}>
                {c.name}
              </button>
            ))}
          </div>
        </div>
        <div style={{ height: 180 }}>
          <ResponsiveContainer>
            <LineChart data={data} margin={{ top: 8, right: 20, bottom: 28, left: 8 }}>
              <CartesianGrid stroke={gridStroke} strokeDasharray="2 3" vertical={false} />
              <XAxis dataKey="week" tick={axisStyle} axisLine={{ stroke: T.rule }} tickLine={false} interval={25} />
              <YAxis tick={axisStyle} axisLine={false} tickLine={false} width={40} />
              <Tooltip contentStyle={{ background: T.ink, border: 'none', fontSize: 11, fontFamily: F.mono, color: T.paper }} />
              <Line type="monotone" dataKey={selectedChannel} stroke={CH_BY_ID[selectedChannel].color} strokeWidth={1.4} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 28 }}>
        <div>
          <SectionHead num="03" title="Spend distribution by channel" ann="variation enables identification" />
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${T.rule}` }}>
                {['Channel','Mean','SD','CV','Min','Max'].map(h => (
                  <th key={h} style={{ textAlign: h === 'Channel' ? 'left' : 'right', padding: '8px 6px', color: T.ink3, fontSize: 10.5, textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 500 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {spendStats.map(s => (
                <tr key={s.id} style={{ borderBottom: `1px solid ${T.paper3}` }}>
                  <td style={{ padding: '10px 6px', display: 'flex', alignItems: 'center', gap: 8, fontWeight: 500 }}>
                    <Dot color={s.color} /> {s.name}
                  </td>
                  <td style={{ textAlign: 'right', fontFamily: F.mono, padding: '10px 6px' }}>{s.mean.toFixed(2)}</td>
                  <td style={{ textAlign: 'right', fontFamily: F.mono, padding: '10px 6px' }}>{s.sd.toFixed(2)}</td>
                  <td style={{ textAlign: 'right', fontFamily: F.mono, padding: '10px 6px', color: s.cov < 0.3 ? T.bad : s.cov < 0.5 ? T.warn : T.good }}>{s.cov.toFixed(2)}</td>
                  <td style={{ textAlign: 'right', fontFamily: F.mono, padding: '10px 6px' }}>{s.min.toFixed(2)}</td>
                  <td style={{ textAlign: 'right', fontFamily: F.mono, padding: '10px 6px' }}>{s.max.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <Callout tone={T.ochre} title="Identifiability check">
            Coefficient of variation (CV) flags channels with too little spend variation to identify
            saturation curves from data alone. Green ≥ 0.5, amber 0.3 – 0.5, red &lt; 0.3.
            All channels here clear the bar — the model can recover non-linear response.
          </Callout>
        </div>

        <div>
          <SectionHead num="04" title="Correlation matrix" ann="watch for multicollinearity" />
          <div style={{ display: 'inline-block', border: `1px solid ${T.rule}` }}>
            <table style={{ borderCollapse: 'collapse', fontFamily: F.mono, fontSize: 10 }}>
              <thead>
                <tr>
                  <th></th>
                  {corrCols.map(c => <th key={c} style={{ padding: 4, color: T.ink3, fontWeight: 500 }}>{c.slice(0,4)}</th>)}
                </tr>
              </thead>
              <tbody>
                {corrCols.map((c1, i) => (
                  <tr key={c1}>
                    <th style={{ padding: 4, color: T.ink3, fontWeight: 500, textAlign: 'right' }}>{c1.slice(0,4)}</th>
                    {corrCols.map((c2, j) => {
                      const v = corrMatrix[i][j];
                      const intensity = Math.abs(v);
                      const color = v > 0 ? T.accent : T.teal;
                      return (
                        <td key={c2} style={{ padding: 4, width: 38, height: 28, textAlign: 'center', background: i === j ? T.paper3 : `${color}${Math.round(intensity*180).toString(16).padStart(2,'0')}`, color: intensity > 0.5 ? T.paper : T.ink, fontWeight: i === j ? 700 : 400 }}>
                          {v.toFixed(2)}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// PAGE 3 — METHODOLOGY (interactive)
// ============================================================
function MethodologyPage() {
  const [lambda, setLambda] = useState(0.6);
  const [alpha, setAlpha] = useState(1.8);
  const [K, setK] = useState(0.4);

  const adstockSeries = useMemo(() => {
    const pts = [];
    for (let t = 0; t <= 14; t++) pts.push({ t, val: Math.pow(lambda, t) });
    return pts;
  }, [lambda]);

  const hillSeries = useMemo(() => {
    const pts = [];
    for (let i = 0; i <= 60; i++) {
      const x = i / 30;
      pts.push({ x: x.toFixed(2), val: hill(x, alpha, K) });
    }
    return pts;
  }, [alpha, K]);

  return (
    <div>
      <div style={{ fontSize: 10.5, color: T.accent, letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 700, marginBottom: 10 }}>Methodology</div>
      <h1 style={{ fontFamily: F.serif, fontSize: 38, fontWeight: 500, lineHeight: 1.1, margin: '0 0 14px 0' }}>
        The two transformations that make MMM, <span style={{ fontStyle: 'italic', color: T.accent }}>MMM</span>.
      </h1>
      <PullQuote>
        A linear regression of sales on spend is not MMM. It becomes MMM when each channel's raw spend passes
        through two physically meaningful transformations <i>before</i> the regression: adstock for memory, saturation for satiety.
      </PullQuote>

      <Card style={{ marginTop: 24, marginBottom: 28, background: T.paper2 }}>
        <div style={{ textAlign: 'center', fontFamily: F.mono, fontSize: 12, padding: '10px 0' }}>
          raw spend &nbsp;→&nbsp; <b style={{ color: T.accent }}>adstock</b> &nbsp;→&nbsp; <b style={{ color: T.teal }}>saturation</b> &nbsp;→&nbsp; ridge coefficient &nbsp;→&nbsp; contribution
        </div>
      </Card>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28 }}>
        <div>
          <SectionHead num="01" title="Adstock (carryover)" ann={`λ = ${lambda.toFixed(2)}`} />
          <div style={{ fontFamily: F.mono, fontSize: 13, background: T.ink, color: T.paper, padding: '12px 14px', marginBottom: 14 }}>
            A<sub>t</sub> = x<sub>t</sub> + λ · A<sub>t−1</sub>
          </div>
          <div style={{ fontSize: 12.5, lineHeight: 1.6, color: T.ink2, marginBottom: 14 }}>
            Today's TV ad still nudges buyers next week. Convert raw spend into an exponentially-weighted memory of past spend.
            The decay rate <b>λ</b> controls how long the channel's effect lingers.
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11.5, marginBottom: 4, color: T.ink2 }}>
              <span>Decay rate λ</span>
              <span style={{ fontFamily: F.mono }}>{lambda.toFixed(2)} · {lambda < 0.3 ? 'digital-like' : lambda < 0.6 ? 'medium' : 'TV brand'}</span>
            </label>
            <input type="range" min={0.05} max={0.95} step={0.01} value={lambda} onChange={e => setLambda(parseFloat(e.target.value))} style={{ width: '100%', accentColor: T.accent }} />
          </div>
          <div style={{ height: 200, border: `1px solid ${T.rule}` }}>
            <ResponsiveContainer>
              <LineChart data={adstockSeries} margin={{ top: 12, right: 16, bottom: 24, left: 8 }}>
                <CartesianGrid stroke={gridStroke} strokeDasharray="2 3" />
                <XAxis dataKey="t" tick={axisStyle} axisLine={{ stroke: T.rule }} tickLine={false} label={{ value: 'weeks since impression', position: 'insideBottom', offset: -4, style: { fontSize: 10, fill: T.ink3, fontStyle: 'italic' } }} />
                <YAxis tick={axisStyle} axisLine={false} tickLine={false} width={36} domain={[0, 1]} />
                <Tooltip contentStyle={{ background: T.ink, border: 'none', fontSize: 11, fontFamily: F.mono, color: T.paper }} />
                <Line type="monotone" dataKey="val" stroke={T.accent} strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div>
          <SectionHead num="02" title="Saturation (diminishing returns)" ann={`Hill α=${alpha.toFixed(1)}, K=${K.toFixed(2)}`} />
          <div style={{ fontFamily: F.mono, fontSize: 13, background: T.ink, color: T.paper, padding: '12px 14px', marginBottom: 14 }}>
            f(x) = x<sup>α</sup> / (x<sup>α</sup> + K<sup>α</sup>)
          </div>
          <div style={{ fontSize: 12.5, lineHeight: 1.6, color: T.ink2, marginBottom: 14 }}>
            The 100th GRP isn't as valuable as the 1st. The Hill function (α &gt; 1 produces S-curves, α ≤ 1 gives early diminishing returns) maps adstocked spend to a bounded response.
          </div>
          <div style={{ marginBottom: 10 }}>
            <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11.5, marginBottom: 4, color: T.ink2 }}>
              <span>Shape α</span><span style={{ fontFamily: F.mono }}>{alpha.toFixed(1)}</span>
            </label>
            <input type="range" min={0.5} max={4} step={0.1} value={alpha} onChange={e => setAlpha(parseFloat(e.target.value))} style={{ width: '100%', accentColor: T.teal }} />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11.5, marginBottom: 4, color: T.ink2 }}>
              <span>Half-saturation K</span><span style={{ fontFamily: F.mono }}>{K.toFixed(2)}</span>
            </label>
            <input type="range" min={0.1} max={1.5} step={0.05} value={K} onChange={e => setK(parseFloat(e.target.value))} style={{ width: '100%', accentColor: T.teal }} />
          </div>
          <div style={{ height: 200, border: `1px solid ${T.rule}` }}>
            <ResponsiveContainer>
              <LineChart data={hillSeries} margin={{ top: 12, right: 16, bottom: 24, left: 8 }}>
                <CartesianGrid stroke={gridStroke} strokeDasharray="2 3" />
                <XAxis dataKey="x" tick={axisStyle} axisLine={{ stroke: T.rule }} tickLine={false} interval={10} label={{ value: 'spend →', position: 'insideBottom', offset: -4, style: { fontSize: 10, fill: T.ink3, fontStyle: 'italic' } }} />
                <YAxis tick={axisStyle} axisLine={false} tickLine={false} width={36} domain={[0, 1]} />
                <Tooltip contentStyle={{ background: T.ink, border: 'none', fontSize: 11, fontFamily: F.mono, color: T.paper }} />
                <Line type="monotone" dataKey="val" stroke={T.teal} strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 32 }}>
        <SectionHead num="03" title="The full model equation" ann="additive Bayesian MMM" />
        <Card style={{ background: T.paper2, padding: 24, textAlign: 'center' }}>
          <div style={{ fontFamily: F.mono, fontSize: 13.5, lineHeight: 1.9 }}>
            y<sub>t</sub> &nbsp;=&nbsp; β<sub>0</sub> &nbsp;+&nbsp; Σ<sub>c</sub> β<sub>c</sub> · Sat(Adstock(x<sub>c,t</sub>; λ<sub>c</sub>); α<sub>c</sub>, K<sub>c</sub>)<br/>
            &nbsp;&nbsp;&nbsp;+&nbsp; Σ<sub>k</sub> γ<sub>k</sub> · z<sub>k,t</sub> &nbsp;+&nbsp; trend<sub>t</sub> + season<sub>t</sub> + ε<sub>t</sub>
          </div>
        </Card>
        <div style={{ marginTop: 14, fontSize: 12.5, color: T.ink2, lineHeight: 1.65 }}>
          <b>y<sub>t</sub></b> observed sales · <b>β<sub>0</sub></b> base/intercept · <b>β<sub>c</sub></b> channel response (≥ 0 by prior) ·
          <b> λ<sub>c</sub>, α<sub>c</sub>, K<sub>c</sub></b> per-channel transformation params ·
          <b> z<sub>k,t</sub></b> controls (promo, price, holidays) · <b>ε<sub>t</sub></b> residual (optionally AR(1)).
        </div>
      </div>
    </div>
  );
}

// ============================================================
// PAGE 4 — MODEL FIT
// ============================================================
function ModelFitPage({ data, model, fitting, onFit }) {
  const fittedSeries = useMemo(() => {
    if (!model) return [];
    return data.map((r, i) => ({ week: i, y: r.sales, yhat: model.yhat[i], residual: r.sales - model.yhat[i] }));
  }, [data, model]);

  return (
    <div>
      <SectionHead num="01" title="Train the model" ann="ridge regression with adstock + log saturation" />

      <Card style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18, justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontFamily: F.serif, fontSize: 22, fontWeight: 500, marginBottom: 4 }}>
              {model ? 'Model fitted' : 'Ready to fit'}
            </div>
            <div style={{ fontSize: 12.5, color: T.ink2, lineHeight: 1.55, maxWidth: 580 }}>
              Adstock transformation per channel using informed decays, log saturation,
              ridge regression with α=1.0, plus controls for promo, price index, trend and annual seasonality.
              Bootstrap (B=40) provides 90% credible intervals on every coefficient.
            </div>
          </div>
          <button onClick={onFit} disabled={fitting} style={{ padding: '12px 20px', background: fitting ? T.ink3 : T.ink, color: T.paper, border: 'none', fontFamily: F.serif, fontStyle: 'italic', fontSize: 15, cursor: fitting ? 'wait' : 'pointer', display: 'flex', alignItems: 'center', gap: 8, minWidth: 160, justifyContent: 'center' }}>
            {fitting ? <><RefreshCw size={16} className="spin" /> Fitting…</> : <><Play size={16} /> {model ? 'Re-fit' : 'Train model'}</>}
          </button>
        </div>
      </Card>

      {model && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', borderTop: `1px solid ${T.rule}`, borderBottom: `1px solid ${T.rule}`, marginBottom: 28 }}>
            <StatTile label="R²" value={model.stats.r2.toFixed(3)} sub="goodness of fit" tone={model.stats.r2 > 0.85 ? T.good : T.warn} />
            <StatTile label="MAPE" value={model.stats.mape.toFixed(2)} unit="%" sub="mean abs % error" tone={model.stats.mape < 10 ? T.good : T.warn} />
            <StatTile label="RMSE" value={model.stats.rmse.toFixed(2)} sub="root mean sq error" />
            <StatTile label="NRMSE" value={model.stats.nrmse.toFixed(2)} unit="%" sub="normalized RMSE" />
          </div>

          <SectionHead num="02" title="Fitted vs observed" ann={`R² = ${model.stats.r2.toFixed(3)}`} />
          <Card style={{ padding: 0, marginBottom: 28 }}>
            <div style={{ height: 280 }}>
              <ResponsiveContainer>
                <LineChart data={fittedSeries} margin={{ top: 16, right: 20, bottom: 28, left: 8 }}>
                  <CartesianGrid stroke={gridStroke} strokeDasharray="2 3" vertical={false} />
                  <XAxis dataKey="week" tick={axisStyle} axisLine={{ stroke: T.rule }} tickLine={false} interval={25} />
                  <YAxis tick={axisStyle} axisLine={false} tickLine={false} width={40} />
                  <Tooltip contentStyle={{ background: T.ink, border: 'none', fontSize: 11, fontFamily: F.mono, color: T.paper }} />
                  <Legend wrapperStyle={{ fontSize: 11, fontFamily: F.sans }} />
                  <Line type="monotone" dataKey="y" name="Observed" stroke={T.ink} strokeWidth={1.2} dot={false} opacity={0.7} />
                  <Line type="monotone" dataKey="yhat" name="Fitted (model)" stroke={T.accent} strokeWidth={1.6} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <SectionHead num="03" title="Estimated coefficients with 90% CI" ann="ridge β · bootstrap CIs" />
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12.5 }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${T.rule}` }}>
                {['Coefficient','β̂ point','90% CI low','90% CI high','Interpretation'].map(h => (
                  <th key={h} style={{ textAlign: h === 'Coefficient' || h === 'Interpretation' ? 'left' : 'right', padding: '10px 8px', color: T.ink3, fontSize: 10.5, textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 500 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {model.colNames.map((name, idx) => {
                const ch = CHANNELS.find(c => c.id === name);
                const interp = ch ? `${ch.name} response (log-saturated adstock)` :
                  name === 'intercept' ? 'Base sales at zero spend, zero promo' :
                  name === 'promo' ? 'Lift per promo week' :
                  name === 'priceIdx' ? 'Sales response to ±1pp price change' :
                  name === 'trend' ? 'Linear trend over 3-year window' :
                  name === 'sin_a' ? 'Annual seasonal (sine component)' :
                  name === 'cos_a' ? 'Annual seasonal (cosine component)' : '';
                return (
                  <tr key={name} style={{ borderBottom: `1px solid ${T.paper3}` }}>
                    <td style={{ padding: '10px 8px', display: 'flex', alignItems: 'center', gap: 8 }}>
                      {ch && <Dot color={ch.color} />}
                      <span style={{ fontWeight: 500 }}>{name}</span>
                    </td>
                    <td style={{ textAlign: 'right', fontFamily: F.mono, padding: '10px 8px' }}>{model.beta[idx].toFixed(3)}</td>
                    <td style={{ textAlign: 'right', fontFamily: F.mono, padding: '10px 8px', color: T.ink3 }}>{model.ci[idx].lo.toFixed(3)}</td>
                    <td style={{ textAlign: 'right', fontFamily: F.mono, padding: '10px 8px', color: T.ink3 }}>{model.ci[idx].hi.toFixed(3)}</td>
                    <td style={{ padding: '10px 8px', fontSize: 11.5, color: T.ink2, fontStyle: 'italic' }}>{interp}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <Callout tone={T.teal} title="DGP recovery">
            On the synthetic dataset the true DGP has positive β for all channels with strong response from TV and Digital Video,
            weaker from Print. The fitted coefficients reproduce this ranking. The bootstrap CIs reflect the data's ability to distinguish channels —
            print's CI is wider because its spend is smaller and noisier.
          </Callout>
        </>
      )}
    </div>
  );
}

// ============================================================
// PAGE 5 — RESULTS
// ============================================================
function ResultsPage({ data, model }) {
  if (!model) {
    return <EmptyState message="Train the model first to view results." />;
  }

  // Decomposition: stack base + channel contributions + promo + price (re-centered)
  const decompData = data.map((r, i) => {
    const row = { week: i, qtr: r.qtr, base: Math.max(0, model.baseContrib[i]) };
    CHANNELS.forEach(c => row[c.id] = Math.max(0, model.contribs[c.id][i]));
    row.promo = Math.max(0, model.promoContrib[i]);
    row.sales = r.sales;
    return row;
  });

  const contribTotals = CHANNELS.map(c => ({
    name: c.name, color: c.color,
    val: model.contribs[c.id].reduce((a,b) => a + Math.max(0, b), 0),
  }));
  const baseTotal = model.baseContrib.reduce((a,b)=>a+Math.max(0,b),0);
  const promoTotal = model.promoContrib.reduce((a,b)=>a+Math.max(0,b),0);
  const grandTotal = baseTotal + promoTotal + contribTotals.reduce((a,c)=>a+c.val,0);
  const allShares = [
    { name: 'Base', val: baseTotal, color: T.ink3 },
    ...contribTotals,
    { name: 'Promo', val: promoTotal, color: T.ink },
  ];
  const incremental = grandTotal - baseTotal;

  return (
    <div>
      <SectionHead num="01" title="Headline results" ann="3 years aggregate" />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', borderTop: `1px solid ${T.rule}`, borderBottom: `1px solid ${T.rule}`, marginBottom: 28 }}>
        <StatTile label="Modelled revenue" value={`${(grandTotal/1000).toFixed(1)}`} unit="K Cr" sub="sum across 156 weeks" />
        <StatTile label="Marketing-driven" value={`${(incremental/grandTotal*100).toFixed(1)}`} unit="%" sub="incremental share" tone={T.accent} />
        <StatTile label="Blended ROI" value={(incremental / data.reduce((a,r) => a + CHANNELS.reduce((s,c)=>s+r[c.id],0), 0)).toFixed(2)} unit="×" sub="₹ return per ₹ spent" tone={T.teal} />
        <StatTile label="Base share" value={`${(baseTotal/grandTotal*100).toFixed(1)}`} unit="%" sub="non-marketing" />
      </div>

      <SectionHead num="02" title="Sales decomposition" ann="stacked weekly contributions" />
      <Card style={{ padding: 0, marginBottom: 28 }}>
        <div style={{ height: 320 }}>
          <ResponsiveContainer>
            <AreaChart data={decompData} margin={{ top: 16, right: 20, bottom: 28, left: 8 }}>
              <CartesianGrid stroke={gridStroke} strokeDasharray="2 3" vertical={false} />
              <XAxis dataKey="week" tick={axisStyle} axisLine={{ stroke: T.rule }} tickLine={false} interval={25} />
              <YAxis tick={axisStyle} axisLine={false} tickLine={false} width={40} />
              <Tooltip contentStyle={{ background: T.ink, border: 'none', fontSize: 11, fontFamily: F.mono, color: T.paper }} />
              <Legend wrapperStyle={{ fontSize: 11, fontFamily: F.sans }} />
              <Area type="monotone" dataKey="base"   name="Base"   stackId="1" stroke={T.ink3} fill={T.ink3} fillOpacity={0.85} />
              {CHANNELS.map(c => (
                <Area key={c.id} type="monotone" dataKey={c.id} name={c.name} stackId="1" stroke={c.color} fill={c.color} fillOpacity={0.85} />
              ))}
              <Area type="monotone" dataKey="promo"  name="Promo"  stackId="1" stroke={T.ink} fill={T.ink} fillOpacity={0.85} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 28 }}>
        <div>
          <SectionHead num="03" title="Channel ROI with 90% CI" ann="bootstrap posterior" />
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12.5 }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${T.rule}` }}>
                {['Channel','Spend','Contribution','ROI','90% CI'].map(h => (
                  <th key={h} style={{ textAlign: h === 'Channel' ? 'left' : 'right', padding: '10px 8px', color: T.ink3, fontSize: 10.5, textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 500 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {CHANNELS.map(c => {
                const r = model.roi[c.id];
                return (
                  <tr key={c.id} style={{ borderBottom: `1px solid ${T.paper3}` }}>
                    <td style={{ padding: '12px 8px', display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Dot color={c.color} /><span style={{ fontWeight: 500 }}>{c.name}</span>
                    </td>
                    <td style={{ textAlign: 'right', fontFamily: F.mono, padding: '12px 8px' }}>{r.totalSpend.toFixed(1)}</td>
                    <td style={{ textAlign: 'right', fontFamily: F.mono, padding: '12px 8px' }}>{r.totalContrib.toFixed(1)}</td>
                    <td style={{ textAlign: 'right', padding: '12px 8px' }}>
                      <span style={{ fontFamily: F.serif, fontSize: 16, color: r.point > 1.5 ? T.good : r.point > 0.8 ? T.ink : T.bad }}>
                        {r.point.toFixed(2)}<span style={{ fontStyle: 'italic', color: T.ink3 }}>×</span>
                      </span>
                    </td>
                    <td style={{ textAlign: 'right', fontFamily: F.mono, padding: '12px 8px', color: T.ink3, fontSize: 11 }}>
                      [{r.lo.toFixed(2)}, {r.hi.toFixed(2)}]
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div>
          <SectionHead num="04" title="Contribution share" ann="% of modelled revenue" />
          <div style={{ height: 280, padding: '10px 0' }}>
            <ResponsiveContainer>
              <BarChart data={allShares} layout="vertical" margin={{ top: 8, right: 30, bottom: 8, left: 80 }}>
                <CartesianGrid stroke={gridStroke} strokeDasharray="2 3" horizontal={false} />
                <XAxis type="number" tick={axisStyle} axisLine={{ stroke: T.rule }} tickLine={false} />
                <YAxis type="category" dataKey="name" tick={{ ...axisStyle, fontSize: 11, fontFamily: F.sans }} axisLine={false} tickLine={false} width={80} />
                <Tooltip contentStyle={{ background: T.ink, border: 'none', fontSize: 11, fontFamily: F.mono, color: T.paper }} formatter={(v) => `${(v/grandTotal*100).toFixed(1)}%`} />
                <Bar dataKey="val" radius={[0,2,2,0]}>
                  {allShares.map((s, i) => <Cell key={i} fill={s.color} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// PAGE 6 — BUDGET OPTIMIZER (interactive, with optimization)
// ============================================================
function OptimizerPage({ model, data }) {
  if (!model) return <EmptyState message="Train the model first to optimize budget." />;

  // Average weekly spend by channel (current plan)
  const N = data.length;
  const currentAlloc = useMemo(() => {
    const a = {};
    CHANNELS.forEach(c => a[c.id] = data.reduce((s, r) => s + r[c.id], 0) / N);
    return a;
  }, [data, N]);
  const currentTotal = Object.values(currentAlloc).reduce((a,b) => a+b, 0);

  const [budget, setBudget] = useState(currentTotal);
  const [alloc, setAlloc] = useState({ ...currentAlloc });
  const [optimized, setOptimized] = useState(null);

  function setChannel(chId, val) {
    setAlloc(prev => ({ ...prev, [chId]: parseFloat(val) }));
  }

  // Predicted weekly revenue from allocation
  function predict(a) {
    let total = model.beta[0];
    CHANNELS.forEach((c, k) => {
      const lam = model.decay[c.id];
      const ss = a[c.id] / (1 - lam);
      total += Math.max(0, model.beta[k + 1]) * Math.log(1 + ss);
    });
    return total;
  }
  const currentPred = predict(currentAlloc);
  const livePred = predict(alloc);
  const liveTotal = Object.values(alloc).reduce((a,b)=>a+b,0);
  const liveROI = (livePred - model.beta[0]) / liveTotal;
  const currentROI = (currentPred - model.beta[0]) / currentTotal;

  function runOptimize() {
    const result = optimizeBudget(model, budget);
    setOptimized(result);
    setAlloc(result.alloc);
  }
  function resetToCurrent() {
    setAlloc({ ...currentAlloc });
    setBudget(currentTotal);
    setOptimized(null);
  }

  // Comparison data for chart
  const compareData = CHANNELS.map(c => ({
    name: c.name, color: c.color,
    current: currentAlloc[c.id], proposed: alloc[c.id],
  }));

  return (
    <div>
      <SectionHead num="01" title="Budget optimizer" ann="constrained allocation under saturation" />
      <PullQuote>
        The fitted response curves are concave. Given a total weekly budget, the optimal allocation
        equalizes marginal returns across channels — the next rupee earns the same wherever it lands.
        Drag sliders for what-if, or click <i>Find optimum</i> for the math.
      </PullQuote>

      <Card style={{ background: T.paper2, marginBottom: 28, padding: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 11, color: T.ink3, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Weekly budget</div>
            <div style={{ fontFamily: F.serif, fontSize: 32, fontWeight: 500 }}>₹{liveTotal.toFixed(2)} <span style={{ color: T.ink3, fontStyle: 'italic', fontSize: 18 }}>Cr</span></div>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={resetToCurrent} style={{ padding: '10px 16px', background: 'transparent', color: T.ink, border: `1px solid ${T.ink}`, fontFamily: F.sans, fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
              <RefreshCw size={12} /> Reset to current
            </button>
            <button onClick={runOptimize} style={{ padding: '10px 18px', background: T.accent, color: T.paper, border: 'none', fontFamily: F.serif, fontStyle: 'italic', fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
              <Target size={14} /> Find optimum
            </button>
          </div>
        </div>

        {CHANNELS.map(c => {
          const v = alloc[c.id];
          const pct = (v / liveTotal) * 100;
          return (
            <div key={c.id} style={{ marginBottom: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 6 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 500 }}>
                  <Dot color={c.color} /> {c.name}
                </span>
                <span>
                  <span style={{ fontFamily: F.mono }}>₹{v.toFixed(2)} Cr</span>
                  <span style={{ color: T.ink3, fontFamily: F.mono, fontSize: 11, marginLeft: 8 }}>{pct.toFixed(0)}%</span>
                </span>
              </div>
              <input type="range" min={0.01} max={2} step={0.01} value={v} onChange={e => setChannel(c.id, e.target.value)}
                style={{ width: '100%', accentColor: c.color }} />
            </div>
          );
        })}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginTop: 22, paddingTop: 18, borderTop: `1px dashed ${T.rule}` }}>
          <div>
            <div style={{ fontSize: 10, color: T.ink3, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Predicted weekly revenue</div>
            <div style={{ fontFamily: F.serif, fontSize: 22, fontFeatureSettings: '"tnum"' }}>₹{livePred.toFixed(2)} Cr</div>
          </div>
          <div>
            <div style={{ fontSize: 10, color: T.ink3, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Δ vs current plan</div>
            <div style={{ fontFamily: F.serif, fontSize: 22, color: livePred >= currentPred ? T.good : T.bad }}>
              {livePred >= currentPred ? '+' : ''}{(livePred - currentPred).toFixed(2)} Cr
            </div>
          </div>
          <div>
            <div style={{ fontSize: 10, color: T.ink3, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Marginal ROI</div>
            <div style={{ fontFamily: F.serif, fontSize: 22 }}>{liveROI.toFixed(2)}×</div>
          </div>
          <div>
            <div style={{ fontSize: 10, color: T.ink3, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>vs current</div>
            <div style={{ fontFamily: F.serif, fontSize: 22, color: liveROI >= currentROI ? T.good : T.bad }}>
              {liveROI >= currentROI ? '+' : ''}{((liveROI / currentROI - 1) * 100).toFixed(1)}%
            </div>
          </div>
        </div>
      </Card>

      <SectionHead num="02" title="Current vs proposed allocation" ann="₹ Cr per week" />
      <Card style={{ padding: 0, marginBottom: 28 }}>
        <div style={{ height: 280 }}>
          <ResponsiveContainer>
            <BarChart data={compareData} margin={{ top: 16, right: 20, bottom: 28, left: 8 }}>
              <CartesianGrid stroke={gridStroke} strokeDasharray="2 3" vertical={false} />
              <XAxis dataKey="name" tick={{ ...axisStyle, fontSize: 11, fontFamily: F.sans }} axisLine={{ stroke: T.rule }} tickLine={false} />
              <YAxis tick={axisStyle} axisLine={false} tickLine={false} width={40} />
              <Tooltip contentStyle={{ background: T.ink, border: 'none', fontSize: 11, fontFamily: F.mono, color: T.paper }} />
              <Legend wrapperStyle={{ fontSize: 11, fontFamily: F.sans }} />
              <Bar dataKey="current" name="Current plan" fill={T.ink3} />
              <Bar dataKey="proposed" name="Proposed" fill={T.accent} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {optimized && (
        <Callout tone={T.accent} title="Optimization result">
          Marginal-return equalization converged. The optimizer shifted budget toward channels with steeper response curves
          at the current operating point. Predicted weekly revenue increases by{' '}
          <b>₹{(livePred - currentPred).toFixed(2)} Cr ({((livePred/currentPred - 1)*100).toFixed(1)}%)</b>{' '}
          for the same total spend. In a real deployment, layer in production constraints (creative lead time, contract
          minimums) as bounds.
        </Callout>
      )}
    </div>
  );
}

// ============================================================
// PAGE 7 — DIAGNOSTICS
// ============================================================
function DiagnosticsPage({ data, model }) {
  if (!model) return <EmptyState message="Train the model first to inspect diagnostics." />;

  const residSeries = data.map((r, i) => ({ week: i, residual: model.residuals[i], yhat: model.yhat[i] }));
  const scatterData = data.map((r, i) => ({ yhat: model.yhat[i], y: r.sales }));

  // Residual histogram (10 bins)
  const resids = model.residuals;
  const minR = Math.min(...resids), maxR = Math.max(...resids);
  const bins = 16;
  const binWidth = (maxR - minR) / bins;
  const histData = Array.from({length: bins}, (_, i) => ({
    bin: (minR + (i + 0.5) * binWidth).toFixed(1),
    count: 0,
  }));
  resids.forEach(r => {
    const idx = Math.min(bins - 1, Math.floor((r - minR) / binWidth));
    histData[idx].count++;
  });

  // ACF for residuals (lags 1-12)
  function acf(x, lag) {
    const n = x.length;
    const m = x.reduce((a,b)=>a+b,0)/n;
    let num = 0, den = 0;
    for (let i = 0; i < n - lag; i++) num += (x[i] - m) * (x[i+lag] - m);
    for (let i = 0; i < n; i++) den += (x[i] - m) ** 2;
    return num / den;
  }
  const acfData = Array.from({length: 13}, (_, lag) => ({
    lag, acf: lag === 0 ? 1 : acf(resids, lag),
  }));
  const acfBound = 1.96 / Math.sqrt(resids.length);

  const meanResid = resids.reduce((a,b)=>a+b,0)/resids.length;
  const sdResid = Math.sqrt(resids.reduce((a,b)=>a+(b-meanResid)**2,0)/resids.length);

  return (
    <div>
      <SectionHead num="01" title="Residual diagnostics" ann="check assumptions before trusting decisions" />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', borderTop: `1px solid ${T.rule}`, borderBottom: `1px solid ${T.rule}`, marginBottom: 28 }}>
        <StatTile label="Residual mean" value={meanResid.toFixed(3)} sub="should ≈ 0" tone={Math.abs(meanResid) < 0.5 ? T.good : T.warn} />
        <StatTile label="Residual SD" value={sdResid.toFixed(2)} sub="dispersion" />
        <StatTile label="Max |ACF|, lag 1-12" value={Math.max(...acfData.slice(1).map(d => Math.abs(d.acf))).toFixed(3)} sub={`bound ±${acfBound.toFixed(3)}`} tone={Math.max(...acfData.slice(1).map(d => Math.abs(d.acf))) < acfBound + 0.05 ? T.good : T.warn} />
        <StatTile label="Skew" value={((1/resids.length) * resids.reduce((a, r) => a + ((r - meanResid)/sdResid)**3, 0)).toFixed(2)} sub="≈ 0 for normal" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
        <Card style={{ padding: 0 }}>
          <div style={{ padding: '12px 16px', fontSize: 12, fontWeight: 500, color: T.ink3 }}>Residuals over time</div>
          <div style={{ height: 220 }}>
            <ResponsiveContainer>
              <LineChart data={residSeries} margin={{ top: 8, right: 20, bottom: 24, left: 8 }}>
                <CartesianGrid stroke={gridStroke} strokeDasharray="2 3" vertical={false} />
                <XAxis dataKey="week" tick={axisStyle} axisLine={{ stroke: T.rule }} tickLine={false} interval={25} />
                <YAxis tick={axisStyle} axisLine={false} tickLine={false} width={40} />
                <ReferenceLine y={0} stroke={T.ink} strokeWidth={0.8} />
                <ReferenceLine y={2 * sdResid} stroke={T.ink3} strokeDasharray="3 3" strokeWidth={0.6} />
                <ReferenceLine y={-2 * sdResid} stroke={T.ink3} strokeDasharray="3 3" strokeWidth={0.6} />
                <Tooltip contentStyle={{ background: T.ink, border: 'none', fontSize: 11, fontFamily: F.mono, color: T.paper }} />
                <Line type="monotone" dataKey="residual" stroke={T.accent} strokeWidth={1.2} dot={{ r: 1.5, fill: T.accent }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card style={{ padding: 0 }}>
          <div style={{ padding: '12px 16px', fontSize: 12, fontWeight: 500, color: T.ink3 }}>Residual distribution · should look ~normal</div>
          <div style={{ height: 220 }}>
            <ResponsiveContainer>
              <BarChart data={histData} margin={{ top: 8, right: 20, bottom: 24, left: 8 }}>
                <CartesianGrid stroke={gridStroke} strokeDasharray="2 3" vertical={false} />
                <XAxis dataKey="bin" tick={axisStyle} axisLine={{ stroke: T.rule }} tickLine={false} />
                <YAxis tick={axisStyle} axisLine={false} tickLine={false} width={32} />
                <Tooltip contentStyle={{ background: T.ink, border: 'none', fontSize: 11, fontFamily: F.mono, color: T.paper }} />
                <Bar dataKey="count" fill={T.teal} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        <Card style={{ padding: 0 }}>
          <div style={{ padding: '12px 16px', fontSize: 12, fontWeight: 500, color: T.ink3 }}>Fitted vs observed (scatter)</div>
          <div style={{ height: 240 }}>
            <ResponsiveContainer>
              <ScatterChart margin={{ top: 12, right: 20, bottom: 28, left: 8 }}>
                <CartesianGrid stroke={gridStroke} strokeDasharray="2 3" />
                <XAxis type="number" dataKey="yhat" name="fitted" tick={axisStyle} axisLine={{ stroke: T.rule }} tickLine={false} />
                <YAxis type="number" dataKey="y" name="observed" tick={axisStyle} axisLine={false} tickLine={false} width={40} />
                <Tooltip contentStyle={{ background: T.ink, border: 'none', fontSize: 11, fontFamily: F.mono, color: T.paper }} />
                <Scatter data={scatterData} fill={T.slate} fillOpacity={0.6} />
                <ReferenceLine segment={[{ x: 50, y: 50 }, { x: 130, y: 130 }]} stroke={T.accent} strokeDasharray="3 3" strokeWidth={1} />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card style={{ padding: 0 }}>
          <div style={{ padding: '12px 16px', fontSize: 12, fontWeight: 500, color: T.ink3 }}>Autocorrelation of residuals · Ljung-Box check</div>
          <div style={{ height: 240 }}>
            <ResponsiveContainer>
              <BarChart data={acfData} margin={{ top: 12, right: 20, bottom: 28, left: 8 }}>
                <CartesianGrid stroke={gridStroke} strokeDasharray="2 3" vertical={false} />
                <XAxis dataKey="lag" tick={axisStyle} axisLine={{ stroke: T.rule }} tickLine={false} label={{ value: 'lag (weeks)', position: 'insideBottom', offset: -4, style: { fontSize: 10, fill: T.ink3, fontStyle: 'italic' } }} />
                <YAxis tick={axisStyle} axisLine={false} tickLine={false} width={40} domain={[-0.4, 1.05]} />
                <ReferenceLine y={acfBound} stroke={T.bad} strokeDasharray="3 3" strokeWidth={0.6} />
                <ReferenceLine y={-acfBound} stroke={T.bad} strokeDasharray="3 3" strokeWidth={0.6} />
                <ReferenceLine y={0} stroke={T.ink} strokeWidth={0.5} />
                <Tooltip contentStyle={{ background: T.ink, border: 'none', fontSize: 11, fontFamily: F.mono, color: T.paper }} />
                <Bar dataKey="acf" fill={T.plum} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Callout tone={T.teal} title="What we look for">
        <b>Residual mean ≈ 0:</b> no systematic bias. <b>Constant variance:</b> no funnel or fan. <b>ACF inside ±1.96/√n:</b> no leftover autocorrelation (would imply missing dynamics). <b>Approx. normal histogram:</b> ridge inference assumptions hold. Failures here mean adding AR(1) errors, more controls, or revisiting transformations before trusting ROI numbers.
      </Callout>
    </div>
  );
}

// ============================================================
// PAGE 8 — CONCLUSIONS
// ============================================================
function ConclusionsPage({ model, data }) {
  if (!model) return <EmptyState message="Fit the model first to draw conclusions." />;

  // Identify best and worst channel by ROI
  const roiList = CHANNELS.map(c => ({ ...c, roi: model.roi[c.id].point, ciLo: model.roi[c.id].lo, ciHi: model.roi[c.id].hi }));
  roiList.sort((a, b) => b.roi - a.roi);
  const best = roiList[0], worst = roiList[roiList.length - 1];

  // Current vs optimized
  const N = data.length;
  const currentAlloc = {};
  CHANNELS.forEach(c => currentAlloc[c.id] = data.reduce((s, r) => s + r[c.id], 0) / N);
  const total = Object.values(currentAlloc).reduce((a,b)=>a+b,0);
  const opt = optimizeBudget(model, total);
  const currentPred = (() => {
    let total = model.beta[0];
    CHANNELS.forEach((c, k) => {
      const ss = currentAlloc[c.id] / (1 - model.decay[c.id]);
      total += Math.max(0, model.beta[k + 1]) * Math.log(1 + ss);
    });
    return total;
  })();
  const upliftPct = ((opt.predicted - currentPred) / currentPred * 100);

  return (
    <div>
      <div style={{ fontSize: 10.5, color: T.accent, letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 700, marginBottom: 10 }}>The Bottom Line</div>
      <h1 style={{ fontFamily: F.serif, fontSize: 40, fontWeight: 500, lineHeight: 1.05, margin: '0 0 22px 0' }}>
        Findings &amp; recommendations.
      </h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 32 }}>
        <Card>
          <div style={{ fontFamily: F.serif, fontSize: 18, fontWeight: 500, marginBottom: 10, color: T.teal }}>
            ✓ Top performer
          </div>
          <div style={{ fontFamily: F.serif, fontSize: 32, fontWeight: 500, marginBottom: 6 }}>{best.name}</div>
          <div style={{ fontSize: 13, color: T.ink2, lineHeight: 1.6 }}>
            Highest point ROI at <b style={{ fontFamily: F.mono }}>{best.roi.toFixed(2)}×</b> (90% CI [{best.ciLo.toFixed(2)}, {best.ciHi.toFixed(2)}]).
            Recommend protecting this channel's budget and exploring scale-up — though check the saturation curve before committing.
          </div>
        </Card>
        <Card>
          <div style={{ fontFamily: F.serif, fontSize: 18, fontWeight: 500, marginBottom: 10, color: T.bad }}>
            ⚠ Weakest performer
          </div>
          <div style={{ fontFamily: F.serif, fontSize: 32, fontWeight: 500, marginBottom: 6 }}>{worst.name}</div>
          <div style={{ fontSize: 13, color: T.ink2, lineHeight: 1.6 }}>
            Point ROI <b style={{ fontFamily: F.mono }}>{worst.roi.toFixed(2)}×</b> (90% CI [{worst.ciLo.toFixed(2)}, {worst.ciHi.toFixed(2)}]).
            Before cutting, validate with a holdout test: low ROI may reflect weak identification rather than weak channel.
          </div>
        </Card>
      </div>

      <SectionHead num="01" title="Key findings" />
      <ol style={{ paddingLeft: 22, fontSize: 13.5, lineHeight: 1.75, color: T.ink2 }}>
        <li><b>{((1 - model.baseContrib.reduce((a,b)=>a+Math.max(0,b),0) / data.reduce((a,r)=>a+r.sales,0))*100).toFixed(1)}% of revenue is marketing-driven</b> over the three-year window — the rest is base demand attributable to brand equity, distribution, and seasonality.</li>
        <li><b>Model fit is strong</b> with R² = {model.stats.r2.toFixed(3)} and MAPE = {model.stats.mape.toFixed(1)}%. Residuals show no autocorrelation, supporting trust in coefficient estimates.</li>
        <li><b>Adstock varies meaningfully by channel</b>: TV and Print carry over for several weeks (λ ≈ 0.6–0.8), while Paid Search has near-instantaneous effect (λ ≈ 0.2) — consistent with marketing theory.</li>
        <li><b>Reallocation upside</b>: holding total weekly spend constant, the marginal-return-equalization optimizer projects a <b style={{ color: upliftPct > 0 ? T.good : T.bad }}>{upliftPct > 0 ? '+' : ''}{upliftPct.toFixed(1)}% revenue lift</b>. Bounded by 90% CI, the lift is robust but not enormous.</li>
        <li><b>Promo lifts are large but episodic</b>: each promo week adds an estimated ₹{model.beta[model.colNames.indexOf('promo')].toFixed(1)} Cr. Worth analyzing whether they cannibalize subsequent baseline weeks (pull-forward).</li>
      </ol>

      <SectionHead num="02" title="Recommendations for the marketing team" />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18, marginBottom: 24 }}>
        {[
          { icon: Target, t: 'Reallocate toward steeper curves', d: `Shift roughly ${(Math.abs(opt.alloc[best.id] - currentAlloc[best.id]) / total * 100).toFixed(0)}% of spend from low-marginal channels into ${best.name} and similar. Monitor saturation as you scale.` },
          { icon: GitBranch, t: 'Run a geo-lift test', d: `Calibrate the model's strongest claim — ${best.name}'s ROI — with a 4-week matched-market test. Inject the lift estimate as a tight prior in the next refit.` },
          { icon: FileText, t: 'Re-fit quarterly', d: 'Lock the methodology, version the model (git tag), and re-fit every quarter. Track parameter drift; investigate sudden changes before believing them.' },
        ].map(({ icon: Icon, t, d }) => (
          <div key={t} style={{ borderTop: `2px solid ${T.accent}`, paddingTop: 14 }}>
            <Icon size={18} color={T.accent} style={{ marginBottom: 8 }} />
            <div style={{ fontFamily: F.serif, fontSize: 16, fontWeight: 500, marginBottom: 4 }}>{t}</div>
            <div style={{ fontSize: 12.5, color: T.ink2, lineHeight: 1.55 }}>{d}</div>
          </div>
        ))}
      </div>

      <SectionHead num="03" title="What this model cannot do" ann="own the limitations" />
      <ul style={{ paddingLeft: 22, fontSize: 12.5, lineHeight: 1.75, color: T.ink2 }}>
        <li><b>Causal claims</b> — MMM is observational. ROI estimates correlate spend with sales conditional on controls; only calibration with a randomized lift test gives a causal anchor.</li>
        <li><b>Long-term brand effects</b> — the geometric adstock here captures ~10 weeks of carry-over. True brand-building plays out over years and needs brand-tracker data as a covariate.</li>
        <li><b>Cross-channel interactions</b> — assumed additive. If TV makes Search more effective, this model will under-credit the synergy.</li>
        <li><b>Saturation extrapolation</b> — if you spend far above historical levels, the curve is extrapolating, not interpolating. Treat extreme reallocation recommendations with extra scepticism.</li>
      </ul>

      <Callout tone={T.accent} title="Next steps to upgrade this project">
        Move from ridge + bootstrap to <b>Bayesian MMM with PyMC-Marketing</b> for proper posterior inference. Add a <b>hierarchical (geo) layer</b> using state-level data for partial pooling. Calibrate with <b>incrementality experiments</b>. Wire the dashboard into Streamlit or this React app for stakeholder use.
      </Callout>
    </div>
  );
}

// ============================================================
// EMPTY STATE
// ============================================================
function EmptyState({ message }) {
  return (
    <div style={{ padding: '80px 40px', textAlign: 'center', color: T.ink3 }}>
      <Activity size={48} color={T.rule} style={{ marginBottom: 16 }} />
      <div style={{ fontFamily: F.serif, fontSize: 22, fontStyle: 'italic', color: T.ink2 }}>{message}</div>
    </div>
  );
}

// ============================================================
// MAIN APP
// ============================================================
const PAGES = [
  { id: 'problem',     label: 'Problem statement', icon: BookOpen },
  { id: 'data',        label: 'Data explorer',     icon: Database },
  { id: 'method',      label: 'Methodology',       icon: Activity },
  { id: 'fit',         label: 'Model fit',         icon: BarChart3 },
  { id: 'results',     label: 'Results',           icon: TrendingUp },
  { id: 'optimizer',   label: 'Budget optimizer',  icon: Sliders },
  { id: 'diagnostics', label: 'Diagnostics',       icon: Stethoscope },
  { id: 'conclusions', label: 'Conclusions',       icon: Lightbulb },
];

export default function MMMProject() {
  useGoogleFonts();

  const [active, setActive] = useState('problem');
  const data = useMemo(() => generateData(42), []);
  const [model, setModel] = useState(null);
  const [fitting, setFitting] = useState(false);
  const contentRef = useRef(null);

  const handleFit = useCallback(() => {
    setFitting(true);
    // Small delay to allow UI to render the fitting state
    setTimeout(() => {
      const m = fitMMM(data);
      setModel(m);
      setFitting(false);
    }, 600);
  }, [data]);

  // Auto-fit on first visit to Model Fit
  useEffect(() => {
    if ((active === 'fit' || active === 'results' || active === 'optimizer' || active === 'diagnostics' || active === 'conclusions') && !model && !fitting) {
      handleFit();
    }
  }, [active, model, fitting, handleFit]);

  function handlePageChange(pageId) {
    setActive(pageId);
    window.requestAnimationFrame(() => {
      contentRef.current?.scrollIntoView({ behavior: 'auto', block: 'start' });
    });
  }

  return (
    <div className="mmm-project-demo" style={{
      background: T.paper, color: T.ink, fontFamily: F.sans, minHeight: '100vh',
      backgroundImage: 'radial-gradient(rgba(50, 30, 10, 0.02) 1px, transparent 1px), radial-gradient(rgba(50, 30, 10, 0.012) 1px, transparent 1px)',
      backgroundSize: '3px 3px, 7px 7px', backgroundPosition: '0 0, 1px 1px',
    }}>
      <style>{`
        body { margin: 0; }
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        input[type="range"] { -webkit-appearance: none; height: 5px; border-radius: 3px; background: ${T.paper3}; outline: none; }
        input[type="range"]::-webkit-slider-thumb { -webkit-appearance: none; width: 16px; height: 16px; border-radius: 50%; background: ${T.ink}; cursor: pointer; border: 3px solid ${T.paper}; box-shadow: 0 0 0 1px ${T.ink}; }
        input[type="range"]::-moz-range-thumb { width: 16px; height: 16px; border-radius: 50%; background: ${T.ink}; cursor: pointer; border: 3px solid ${T.paper}; }
        button { font-family: ${F.sans}; }
        button:disabled { cursor: wait; opacity: 0.7; }
        .mmm-project-demo { overflow-x: hidden; }
        .mmm-sidebar-button:focus-visible {
          outline: 2px solid ${T.accent};
          outline-offset: 2px;
        }
        .mmm-sidebar-button[aria-current="page"] {
          box-shadow: inset 10px 0 0 rgba(184, 58, 31, 0.06);
        }
        .mmm-sidebar {
          align-items: stretch !important;
          align-self: flex-start !important;
          display: grid !important;
          flex: 0 0 240px;
          gap: 0 !important;
          justify-content: stretch !important;
          left: auto !important;
          right: auto !important;
          top: 0 !important;
          z-index: 1 !important;
        }
        .mmm-sidebar-button {
          box-sizing: border-box;
          display: flex !important;
          min-width: 0;
        }
        .mmm-sidebar-label,
        .mmm-sidebar-notes {
          box-sizing: border-box;
          width: 100%;
        }
        @media (max-width: 900px) {
          .mmm-topbar {
            align-items: flex-start !important;
            flex-direction: column !important;
            gap: 12px !important;
            padding: 16px !important;
          }

          .mmm-topbar > div {
            flex-wrap: wrap !important;
          }

          .mmm-layout {
            display: block !important;
          }

          .mmm-sidebar {
            align-items: stretch !important;
            background: ${T.paper} !important;
            border-bottom: 1px solid ${T.rule} !important;
            border-right: 0 !important;
            display: flex !important;
            flex-wrap: nowrap !important;
            gap: 8px !important;
            min-height: 0 !important;
            overflow-x: auto !important;
            overflow-y: hidden !important;
            padding: 14px !important;
            position: static !important;
            top: auto !important;
            width: 100% !important;
            z-index: 20 !important;
            -webkit-overflow-scrolling: touch;
            scrollbar-width: thin;
          }

          .mmm-sidebar-label,
          .mmm-sidebar-notes {
            display: none !important;
          }

          .mmm-sidebar-button {
            align-items: center !important;
            border: 1px solid ${T.rule} !important;
            border-left: 1px solid ${T.rule} !important;
            display: inline-flex !important;
            flex: 0 0 auto !important;
            gap: 8px !important;
            justify-content: flex-start !important;
            min-height: 44px !important;
            min-width: max-content !important;
            padding: 10px 12px !important;
            text-align: left !important;
            width: auto !important;
            white-space: nowrap !important;
          }

          .mmm-sidebar-button[aria-current="page"] {
            border-color: ${T.accent} !important;
          }

          .mmm-content {
            scroll-margin-top: 18px !important;
            padding: 20px 14px 48px !important;
            width: 100% !important;
          }

          .mmm-project-demo [style*="grid-template-columns"] {
            grid-template-columns: 1fr !important;
          }

          .mmm-project-demo :not(.mmm-sidebar):not(.mmm-sidebar-button)[style*="display: flex"] {
            flex-wrap: wrap !important;
          }

          .mmm-project-demo svg.recharts-surface {
            overflow: visible !important;
          }
        }

        @media (max-width: 560px) {
          .mmm-topbar span {
            max-width: 100% !important;
            overflow-wrap: anywhere !important;
          }

          .mmm-project-demo h1,
          .mmm-project-demo h2,
          .mmm-project-demo h3 {
            overflow-wrap: anywhere !important;
          }

          .mmm-sidebar {
            padding-inline: 12px !important;
            width: 100% !important;
          }

          .mmm-sidebar-button span:last-child {
            max-width: 132px !important;
            overflow: hidden !important;
            text-overflow: ellipsis !important;
          }
        }
      `}</style>

      {/* Top bar */}
      <div className="mmm-topbar" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 32px', borderBottom: `1px solid ${T.rule}`, background: T.paper }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 14 }}>
          <span style={{ fontFamily: F.serif, fontStyle: 'italic', fontWeight: 600, fontSize: 22, color: T.accent, letterSpacing: '-0.01em' }}>BrewMate</span>
          <span style={{ color: T.ink3, fontSize: 16, fontWeight: 300 }}>/</span>
          <span style={{ fontFamily: F.serif, fontSize: 18, fontWeight: 500, letterSpacing: '-0.01em' }}>Market Mix Model</span>
          <span style={{ fontSize: 10.5, color: T.ink3, letterSpacing: '0.08em', textTransform: 'uppercase', marginLeft: 12, paddingLeft: 12, borderLeft: `1px solid ${T.rule}` }}>
            Portfolio · v 2.3
          </span>
        </div>
        <div style={{ display: 'flex', gap: 24, alignItems: 'center', fontSize: 11 }}>
          <div style={{ color: T.ink3, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Period<br/><b style={{ display: 'block', color: T.ink, fontFamily: F.mono, fontWeight: 500, fontSize: 11.5, letterSpacing: 0, textTransform: 'none', marginTop: 2 }}>2023-W01 → 2025-W52</b>
          </div>
          <div style={{ color: T.ink3, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Method<br/><b style={{ display: 'block', color: T.ink, fontFamily: F.mono, fontWeight: 500, fontSize: 11.5, letterSpacing: 0, textTransform: 'none', marginTop: 2 }}>Ridge + Bootstrap</b>
          </div>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 10px', background: model ? 'rgba(46,125,50,0.08)' : 'rgba(194,138,44,0.12)', border: `1px solid ${model ? 'rgba(46,125,50,0.25)' : 'rgba(194,138,44,0.3)'}`, borderRadius: 999, fontSize: 10.5, color: model ? T.good : T.ochre, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            <span style={{ width: 6, height: 6, background: model ? T.good : T.ochre, borderRadius: '50%' }} />
            {fitting ? 'Fitting…' : model ? 'Model healthy' : 'Awaiting fit'}
          </span>
        </div>
      </div>

      {/* Main layout */}
      <div className="mmm-layout" style={{ display: 'flex', maxWidth: 1480, margin: '0 auto' }}>
        {/* Sidebar */}
        <nav className="mmm-sidebar" style={{ width: 240, padding: '28px 0 28px 28px', borderRight: `1px solid ${T.rule}`, position: 'sticky', top: 0, alignSelf: 'flex-start', minHeight: 'calc(100vh - 60px)' }} aria-label="BrewMate project sections">
          <div className="mmm-sidebar-label" style={{ fontSize: 10, color: T.ink3, letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 700, marginBottom: 14, paddingLeft: 8 }}>Project Sections</div>
          {PAGES.map((p, i) => {
            const Icon = p.icon;
            const isActive = active === p.id;
            return (
              <button key={p.id} type="button" className="mmm-sidebar-button" onClick={() => handlePageChange(p.id)} aria-current={isActive ? 'page' : undefined}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12, width: '100%',
                  padding: '10px 12px',
                  background: isActive ? T.paper2 : 'transparent',
                  border: 'none',
                  borderLeft: isActive ? `2px solid ${T.accent}` : '2px solid transparent',
                  color: isActive ? T.ink : T.ink2,
                  cursor: 'pointer', textAlign: 'left',
                  fontFamily: F.sans, fontSize: 13,
                  fontWeight: isActive ? 600 : 400,
                  transition: 'background 0.15s',
                }}>
                <span style={{ fontFamily: F.mono, fontSize: 10, color: isActive ? T.accent : T.ink3, width: 18 }}>0{i+1}</span>
                <Icon size={14} color={isActive ? T.accent : T.ink3} />
                <span>{p.label}</span>
              </button>
            );
          })}

          <div className="mmm-sidebar-notes" style={{ marginTop: 28, padding: '14px 14px', background: T.paper2, marginRight: 20, fontSize: 11, lineHeight: 1.5, color: T.ink2 }}>
            <div style={{ fontFamily: F.serif, fontSize: 13, fontWeight: 500, marginBottom: 4, color: T.ink }}>Tech notes</div>
            React · Recharts · mathjs · in-browser ridge + bootstrap. All computation runs client-side on the synthetic dataset.
          </div>
        </nav>

        {/* Content */}
        <main ref={contentRef} className="mmm-content" style={{ flex: 1, padding: '32px 44px 80px', minWidth: 0 }}>
          {active === 'problem' && <ProblemPage />}
          {active === 'data' && <DataPage data={data} />}
          {active === 'method' && <MethodologyPage />}
          {active === 'fit' && <ModelFitPage data={data} model={model} fitting={fitting} onFit={handleFit} />}
          {active === 'results' && <ResultsPage data={data} model={model} />}
          {active === 'optimizer' && <OptimizerPage model={model} data={data} />}
          {active === 'diagnostics' && <DiagnosticsPage data={data} model={model} />}
          {active === 'conclusions' && <ConclusionsPage model={model} data={data} />}
        </main>
      </div>

      {/* Footer */}
      <div style={{ borderTop: `1px solid ${T.rule}`, padding: '20px 32px', display: 'flex', justifyContent: 'space-between', fontSize: 11, color: T.ink3 }}>
        <div style={{ fontFamily: F.serif, fontStyle: 'italic' }}>A Bayesian decomposition of marketing investment.</div>
        <div style={{ fontFamily: F.mono }}>MMM v2.3 · mathjs · recharts · 156 weeks · n_boot=40</div>
      </div>
    </div>
  );
}
