import { useEffect, useMemo, useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL;

const slugify = (value) => value
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/(^-|-$)/g, '');

const fallbackProfile = {
  person: {
    name: 'Aayusha Chakraborty',
    brand: 'A.Chakraborty',
    eyebrow: 'Available - Greater Noida | Remote | UK',
    summary: 'I make data do things that make people say - wait, how did you do that?',
    headline: ['Most data scientists', 'speak in models.', 'I speak in', 'money.'],
    email: 'chakrabortyaayusha22@gmail.com',
    phone: '+91 81026 35950',
    linkedin: 'https://linkedin.com/in/aayusha-chakraborty',
    github: 'https://github.com/chakrabortyaayusha22',
  },
  ticker: ['Data Scientist', 'AI Engineer', 'Marketing Analyst', 'Ops Automation'],
  manifesto: {
    eyebrow: 'Manifesto',
    heading: 'Data is my creative medium.',
    paragraphs: ['I use analytics to find leverage inside messy businesses.'],
  },
  numbers: [],
  skills: [],
  projects: [],
  experience: [],
  awards: [],
  video: { title: 'Video CV', heading: '', description: '', status: 'Coming Soon', tips: [] },
};

function useCursor() {
  useEffect(() => {
    const cursor = document.querySelector('.cursor-dot');
    const ring = document.querySelector('.cursor-ring');
    if (!cursor || !ring || window.matchMedia('(pointer: coarse)').matches) return undefined;

    let mouseX = 0;
    let mouseY = 0;
    let ringX = 0;
    let ringY = 0;
    let frameId = 0;

    const move = (event) => {
      mouseX = event.clientX;
      mouseY = event.clientY;
      cursor.style.transform = `translate(${mouseX - 6}px, ${mouseY - 6}px)`;
    };

    const loop = () => {
      ringX += (mouseX - ringX) * 0.12;
      ringY += (mouseY - ringY) * 0.12;
      ring.style.transform = `translate(${ringX - 20}px, ${ringY - 20}px)`;
      frameId = requestAnimationFrame(loop);
    };

    document.addEventListener('mousemove', move);
    loop();

    return () => {
      document.removeEventListener('mousemove', move);
      cancelAnimationFrame(frameId);
    };
  }, []);
}

function useReveal(dependency) {
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('on');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    document.querySelectorAll('.rv').forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [dependency]);
}

function Nav({ person }) {
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 60);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav className={solid ? 'solid' : ''}>
      <a href="#hero" className="nmark">{person.brand?.split('.')[0] || 'A'}<span>.</span>{person.brand?.split('.')[1] || 'Chakraborty'}</a>
      <button className="menu-btn" type="button" onClick={() => setOpen(!open)} aria-expanded={open}>
        Menu
      </button>
      <div className={`nright ${open ? 'open' : ''}`}>
        <a href="#story" className="nlink" onClick={() => setOpen(false)}>Story</a>
        <a href="#work" className="nlink" onClick={() => setOpen(false)}>Work</a>
        <a href="#awards" className="nlink" onClick={() => setOpen(false)}>Awards</a>
        <a href="#skills" className="nlink" onClick={() => setOpen(false)}>Skills</a>
        <a href={`mailto:${person.email}`} className="ncta">Hire Me</a>
      </div>
    </nav>
  );
}

function Hero({ person, ticker }) {
  const headline = person.headline || [];
  const tickerItems = [...ticker, ...ticker];

  return (
    <section id="hero">
      <div className="ring-wrap" aria-hidden="true">
        <svg className="ring-text" viewBox="0 0 200 200">
          <defs>
            <path id="circlePath" d="M 100,100 m -74,0 a 74,74 0 1,1 148,0 a 74,74 0 1,1 -148,0" />
          </defs>
          <text>
            <textPath href="#circlePath">DATA SCIENTIST - AI ENGINEER - OPS AUTOMATION - </textPath>
          </text>
        </svg>
      </div>

      <div className="hero-inner">
        <div className="hero-overline">{person.eyebrow}</div>
        <h1 className="hero-headline">
          {headline[0]}<br />
          <span className="outline">{headline[1]}</span><br />
          {headline[2]} <span className="italic">{headline[3]}</span>
        </h1>
        <p className="hero-tagline">{person.summary}</p>
        <div className="hero-bottom-row">
          <div className="hero-stats">
            <div><span className="hs-num">4.5+</span><span className="hs-label">Years</span></div>
            <div><span className="hs-num">24+</span><span className="hs-label">Hackathons</span></div>
            <div><span className="hs-num">6</span><span className="hs-label">Flagship Builds</span></div>
          </div>
          <div className="hero-cta-group">
            <a href="#work" className="hbtn-main">See my work</a>
            <a href="#contact" className="hbtn-ghost">Let's talk -&gt;</a>
          </div>
        </div>
      </div>

      <div className="ticker-wrap">
        <div className="ticker-track">
          {tickerItems.map((item, index) => (
            <span className={`ticker-item ${index % 3 === 2 ? 'accent' : ''}`} key={`${item}-${index}`}>
              {item}<span className="ticker-sep">x</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

function Manifesto({ manifesto, numbers }) {
  return (
    <>
      <section id="manifesto">
        <div className="sec-label">{manifesto.eyebrow}</div>
        <div className="manifesto-layout">
          <h2 className="manifesto-big rv">
            Data is my<br /><em>creative</em><br /><span className="outline-dark">medium.</span>
          </h2>
          <div className="manifesto-right">
            {manifesto.paragraphs.map((paragraph) => (
              <p className="manifesto-p rv" key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </section>
      <section id="numbers" aria-label="Impact numbers">
        {numbers.map((item) => (
          <div className="num-item rv" key={item.label}>
            <span className="num-big">{item.value}</span>
            <span className="num-desc">{item.label}</span>
          </div>
        ))}
      </section>
    </>
  );
}

function Story({ experience }) {
  return (
    <section id="story" className="section">
      <div className="sec-label">Story</div>
      <p className="story-intro rv">
        I like roles where the model has to survive contact with the business. <strong>That is where the useful work starts.</strong>
      </p>
      <div className="jobs">
        {experience.map((job) => (
          <article className="job rv" key={`${job.company}-${job.role}`}>
            <div className="job-year">{job.period}</div>
            <div className="job-line"><div className="job-dot" /><div className="job-connector" /></div>
            <div className="job-content">
              <div className="job-company">{job.company}</div>
              <h3 className="job-title">{job.role}</h3>
              <div className="job-impact">{job.impact}</div>
              {job.bullets.map((bullet) => <p className="job-desc" key={bullet}>{bullet}</p>)}
              <div className="job-tags">
                {(job.tags || []).map((tag) => <span className="jtag" key={tag}>{tag}</span>)}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function Work({ projects }) {
  return (
    <section id="work">
      <div className="work-header">
        <div>
          <div className="sec-label">Selected work</div>
          <h2 className="work-title">Projects with<br /><em>business teeth.</em></h2>
        </div>
      </div>
      <div className="proj-grid">
        {projects.map((project, index) => (
          <article className={`pc pc${(index % 6) + 1} rv`} key={project.title}>
            <div className="pc-num">
              <span>{String(index + 1).padStart(3, '0')}{index === 0 ? ' - Featured' : ''}</span>
              <span className="pc-badge">{project.badge}</span>
            </div>
            <h3 className="pc-title">{project.title}</h3>
            <div className="pc-impact">{project.impact}</div>
            <p className="pc-desc">{project.summary}</p>
            <div className="pc-stack">
              {project.stack.map((item) => <span className="pcs" key={item}>{item}</span>)}
            </div>
            <a href={`/projects/${slugify(project.title)}`} className="pc-link">Open project -&gt;</a>
          </article>
        ))}
      </div>
    </section>
  );
}

function MetricTile({ label, value }) {
  return (
    <div className="demo-metric">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function DriverBar({ label, value, tone = 'rust' }) {
  return (
    <div className="driver-bar">
      <div>
        <span>{label}</span>
        <strong>{value > 0 ? '+' : ''}{value.toFixed(2)}</strong>
      </div>
      <div className="bar-track">
        <div className={`bar-fill ${tone}`} style={{ width: `${Math.min(Math.abs(value) * 16, 100)}%` }} />
      </div>
    </div>
  );
}

function ModelTable({ rows, columns }) {
  return (
    <div className="model-table">
      <div className="model-table-head" style={{ gridTemplateColumns: `repeat(${columns.length}, 1fr)` }}>
        {columns.map((column) => <span key={column.key}>{column.label}</span>)}
      </div>
      {rows.map((row) => (
        <div className="model-table-row" style={{ gridTemplateColumns: `repeat(${columns.length}, 1fr)` }} key={row.id || JSON.stringify(row)}>
          {columns.map((column) => <span key={column.key}>{row[column.key]}</span>)}
        </div>
      ))}
    </div>
  );
}

function StrategyDemo() {
  const [growth, setGrowth] = useState(12);
  const [inventory, setInventory] = useState(18);
  const [hiring, setHiring] = useState(8);
  const finance = Math.round(68 + growth * 0.3 - hiring * 0.8);
  const procurement = Math.round(54 + inventory * 1.1 - growth * 0.25);
  const sales = Math.round(62 + growth * 0.95 - inventory * 0.15);
  const ops = Math.round(70 + inventory * 0.35 - hiring * 0.2);
  const score = Math.round((finance + procurement + sales + ops) / 4);
  const risk = Math.max(8, Math.round(50 - inventory * 0.55 + growth * 0.45 + hiring * 0.18));
  const agents = [
    { id: 'fin', name: 'Finance Agent', signal: `${finance}%`, action: finance > 72 ? 'Approve growth budget' : 'Cap burn rate' },
    { id: 'proc', name: 'Procurement Agent', signal: `${procurement}%`, action: procurement > 70 ? 'Forward buy inventory' : 'Delay purchase' },
    { id: 'sales', name: 'Sales Agent', signal: `${sales}%`, action: sales > 76 ? 'Expand campaign' : 'Target high-LTV segment' },
    { id: 'ops', name: 'Ops Agent', signal: `${ops}%`, action: ops > 74 ? 'Maintain SLA' : 'Reduce complexity' },
  ];

  return (
    <div className="demo-panel model-workbench">
      <div className="demo-intro">
        <h3>Multi-Agent Strategy War Room</h3>
        <p>Each agent optimizes a different business objective. The final recommendation is a negotiated operating plan, not a single black-box score.</p>
      </div>
      <div className="control-grid">
        <label>Growth push {growth}%<input type="range" min="0" max="30" value={growth} onChange={(event) => setGrowth(Number(event.target.value))} /></label>
        <label>Inventory buffer {inventory}%<input type="range" min="0" max="40" value={inventory} onChange={(event) => setInventory(Number(event.target.value))} /></label>
        <label>Hiring intensity {hiring}%<input type="range" min="0" max="20" value={hiring} onChange={(event) => setHiring(Number(event.target.value))} /></label>
      </div>
      <div className="demo-grid">
        <MetricTile label="Decision confidence" value={`${Math.min(score, 96)}%`} />
        <MetricTile label="Operating risk" value={`${risk}%`} />
        <MetricTile label="Recommended move" value={risk > 35 ? 'Protect margin' : 'Scale plan'} />
      </div>
      <ModelTable
        columns={[
          { key: 'name', label: 'Agent' },
          { key: 'signal', label: 'Signal' },
          { key: 'action', label: 'Action' },
        ]}
        rows={agents}
      />
    </div>
  );
}

function PricingDemo() {
  const [price, setPrice] = useState(999);
  const [demand, setDemand] = useState(1200);
  const [elasticity, setElasticity] = useState(1.4);
  const basePrice = 999;
  const demandShift = Math.max(120, Math.round(demand * (1 - ((price - basePrice) / basePrice) * elasticity)));
  const revenue = demandShift * price;
  const margin = Math.round(revenue * 0.31);
  const lift = Math.round(((revenue - demand * basePrice) / (demand * basePrice)) * 100);
  const recommendation = revenue > demand * basePrice ? 'Accept price' : 'Test smaller lift';
  const curve = [-15, -8, 0, 7, 14].map((change) => {
    const candidate = Math.round(basePrice * (1 + change / 100));
    const units = Math.max(100, Math.round(demand * (1 - (change / 100) * elasticity)));
    return {
      id: change,
      price: `Rs ${candidate}`,
      units: units.toLocaleString(),
      revenue: `Rs ${Math.round((candidate * units) / 100000)}L`,
    };
  });

  return (
    <div className="demo-panel model-workbench">
      <div className="demo-intro">
        <h3>Dynamic Pricing Model Lab</h3>
        <p>Designed like a pricing analyst's cockpit: elasticity, expected units, revenue lift, margin, and explainability in one view.</p>
      </div>
      <div className="control-grid">
        <label>Candidate price Rs {price}<input type="range" min="699" max="1499" value={price} onChange={(event) => setPrice(Number(event.target.value))} /></label>
        <label>Base demand {demand}<input type="range" min="400" max="2200" value={demand} onChange={(event) => setDemand(Number(event.target.value))} /></label>
        <label>Elasticity {elasticity.toFixed(1)}<input type="range" min="0.5" max="2.5" step="0.1" value={elasticity} onChange={(event) => setElasticity(Number(event.target.value))} /></label>
      </div>
      <div className="demo-grid">
        <MetricTile label="Predicted units" value={demandShift.toLocaleString()} />
        <MetricTile label="Revenue lift" value={`${lift > 0 ? '+' : ''}${lift}%`} />
        <MetricTile label="Gross margin" value={`Rs ${Math.round(margin / 100000)}L`} />
        <MetricTile label="Action" value={recommendation} />
      </div>
      <div className="split-demo">
        <ModelTable
          columns={[
            { key: 'price', label: 'Price' },
            { key: 'units', label: 'Units' },
            { key: 'revenue', label: 'Revenue' },
          ]}
          rows={curve}
        />
        <div className="driver-stack">
          <DriverBar label="Competitor gap" value={price > 1100 ? -1.7 : 0.8} />
          <DriverBar label="Demand elasticity" value={2.6 - elasticity} />
          <DriverBar label="Retargeting intent" value={1.9} tone="gold" />
        </div>
      </div>
    </div>
  );
}

function ReportingDemo() {
  const [generated, setGenerated] = useState(false);
  const [freshness, setFreshness] = useState(92);
  const sections = generated
    ? ['Revenue variance explained', 'Supplier delay risk flagged', 'SKU margin summary written', 'Executive action list ready']
    : ['Ingest ERP extract', 'Run SQL transforms', 'Score delay risk', 'Generate narrative'];
  const reportRows = [
    { id: 'rev', section: 'Revenue', status: generated ? 'Written' : 'Waiting', owner: 'Finance' },
    { id: 'ops', section: 'Operations', status: generated ? 'Risk flagged' : 'Queued', owner: 'Ops' },
    { id: 'sku', section: 'SKU margin', status: generated ? 'Complete' : 'Queued', owner: 'Merch' },
  ];

  return (
    <div className="demo-panel model-workbench">
      <div className="demo-intro">
        <h3>Generative BI Pipeline Control Room</h3>
        <p>A data product for recurring executive reporting: lineage, data freshness, predictive flags, and generated business narrative.</p>
      </div>
      <div className="control-grid">
        <label>Data freshness {freshness}%<input type="range" min="50" max="100" value={freshness} onChange={(event) => setFreshness(Number(event.target.value))} /></label>
        <button className="demo-button" type="button" onClick={() => setGenerated(!generated)}>
          {generated ? 'Reset pipeline' : 'Generate report'}
        </button>
      </div>
      <div className="demo-grid">
        <MetricTile label="Data quality" value={`${freshness}%`} />
        <MetricTile label="Delay risk model" value={generated ? 'Scored' : 'Ready'} />
        <MetricTile label="Narrative status" value={generated ? 'Published' : 'Draft'} />
      </div>
      <div className="pipeline-list">
        {sections.map((item, index) => (
          <div className="pipeline-step" key={item}>
            <span>{String(index + 1).padStart(2, '0')}</span>
            <strong>{item}</strong>
          </div>
        ))}
      </div>
      <ModelTable
        columns={[
          { key: 'section', label: 'Section' },
          { key: 'status', label: 'Status' },
          { key: 'owner', label: 'Owner' },
        ]}
        rows={reportRows}
      />
    </div>
  );
}

function SupplyChainDemo() {
  const [leadTime, setLeadTime] = useState(14);
  const [variance, setVariance] = useState(22);
  const [risk, setRisk] = useState(35);
  const disruption = Math.min(94, Math.round(leadTime * 1.7 + variance * 0.55 + risk * 0.8));
  const suppliers = [
    { id: 's1', supplier: 'Supplier A', late: `${Math.min(96, disruption)}%`, driver: 'Lead time', action: disruption > 65 ? 'Escalate' : 'Monitor' },
    { id: 's2', supplier: 'Supplier B', late: `${Math.max(18, disruption - 19)}%`, driver: 'Variance', action: disruption > 55 ? 'Dual source' : 'Normal' },
    { id: 's3', supplier: 'Supplier C', late: `${Math.max(12, disruption - 31)}%`, driver: 'Geo risk', action: 'Watchlist' },
  ];

  return (
    <div className="demo-panel model-workbench">
      <div className="demo-intro">
        <h3>Supplier Disruption Cockpit</h3>
        <p>Risk scoring UI built for procurement: supplier priority, likely driver, and the next operational move.</p>
      </div>
      <div className="control-grid">
        <label>Lead time days {leadTime}<input type="range" min="3" max="30" value={leadTime} onChange={(event) => setLeadTime(Number(event.target.value))} /></label>
        <label>Order variance {variance}%<input type="range" min="0" max="60" value={variance} onChange={(event) => setVariance(Number(event.target.value))} /></label>
        <label>Geo risk {risk}%<input type="range" min="0" max="80" value={risk} onChange={(event) => setRisk(Number(event.target.value))} /></label>
      </div>
      <div className="demo-grid">
        <MetricTile label="Disruption probability" value={`${disruption}%`} />
        <MetricTile label="Priority" value={disruption > 65 ? 'Escalate' : disruption > 40 ? 'Monitor' : 'Normal'} />
        <MetricTile label="SHAP driver" value={leadTime > variance ? 'Lead time' : 'Variance'} />
      </div>
      <div className="split-demo">
        <ModelTable
          columns={[
            { key: 'supplier', label: 'Supplier' },
            { key: 'late', label: 'Late risk' },
            { key: 'driver', label: 'Driver' },
            { key: 'action', label: 'Action' },
          ]}
          rows={suppliers}
        />
        <div className="driver-stack">
          <DriverBar label="Lead time contribution" value={leadTime / 8} />
          <DriverBar label="Order variance" value={variance / 18} />
          <DriverBar label="Geo risk exposure" value={risk / 24} tone="gold" />
        </div>
      </div>
    </div>
  );
}

function MarketingDemo({ type }) {
  const [search, setSearch] = useState(35);
  const [social, setSocial] = useState(25);
  const [retargeting, setRetargeting] = useState(20);
  const total = search + social + retargeting;
  const roas = ((search * 4.1 + social * 2.7 + retargeting * 5.2) / Math.max(total, 1)).toFixed(1);
  const winner = retargeting >= search && retargeting >= social ? 'Retargeting' : search >= social ? 'Search' : 'Social';
  const rows = [
    { id: 'search', channel: 'Search', spend: `${search}%`, roas: '4.1x', contribution: `${Math.round(search * 1.3)}%` },
    { id: 'social', channel: 'Social', spend: `${social}%`, roas: '2.7x', contribution: `${Math.round(social * 0.8)}%` },
    { id: 'retargeting', channel: 'Retargeting', spend: `${retargeting}%`, roas: '5.2x', contribution: `${Math.round(retargeting * 1.6)}%` },
  ];
  const efficiency = Math.round(Number(roas) * 21);

  return (
    <div className="demo-panel model-workbench">
      <div className="demo-intro">
        <h3>{type === 'mmm' ? 'MMM Budget Optimizer' : 'Marketing Attribution Command Center'}</h3>
        <p>{type === 'mmm' ? 'Estimate channel contribution after adstock and saturation, then reallocate budget to the next best rupee.' : 'Read CAC, LTV, ROAS, and payback together so channel decisions do not overfit last-click noise.'}</p>
      </div>
      <div className="control-grid">
        <label>Search {search}%<input type="range" min="0" max="70" value={search} onChange={(event) => setSearch(Number(event.target.value))} /></label>
        <label>Social {social}%<input type="range" min="0" max="70" value={social} onChange={(event) => setSocial(Number(event.target.value))} /></label>
        <label>Retargeting {retargeting}%<input type="range" min="0" max="70" value={retargeting} onChange={(event) => setRetargeting(Number(event.target.value))} /></label>
      </div>
      <div className="demo-grid">
        <MetricTile label="Blended ROAS" value={`${roas}x`} />
        <MetricTile label="Best channel" value={winner} />
        <MetricTile label="Efficiency score" value={`${efficiency}`} />
        <MetricTile label="Next move" value={type === 'mmm' ? 'Shift budget' : 'Review cohort'} />
      </div>
      <div className="split-demo">
        <ModelTable
          columns={[
            { key: 'channel', label: 'Channel' },
            { key: 'spend', label: 'Spend' },
            { key: 'roas', label: 'ROAS' },
            { key: 'contribution', label: 'Contribution' },
          ]}
          rows={rows}
        />
        <div className="driver-stack">
          <DriverBar label={type === 'mmm' ? 'Adstock carryover' : 'LTV quality'} value={type === 'mmm' ? 2.1 : 1.8} />
          <DriverBar label={type === 'mmm' ? 'Saturation penalty' : 'Payback speed'} value={type === 'mmm' ? -1.2 : 1.3} />
          <DriverBar label="Incremental lift" value={Number(roas) - 2.8} tone="gold" />
        </div>
      </div>
    </div>
  );
}

function ProjectDemo({ project }) {
  const title = project.title.toLowerCase();
  if (title.includes('multi-agent')) return <StrategyDemo />;
  if (title.includes('pricing')) return <PricingDemo />;
  if (title.includes('reporting')) return <ReportingDemo />;
  if (title.includes('supply chain')) return <SupplyChainDemo />;
  if (title.includes('mmm')) return <MarketingDemo type="mmm" />;
  return <MarketingDemo type="attribution" />;
}

function ProjectPage({ project }) {
  if (!project) {
    return (
      <main className="project-page">
        <a className="back-link" href="/#work">Back to portfolio</a>
        <h1>Project not found.</h1>
      </main>
    );
  }

  return (
    <main className="project-page">
      <a className="back-link" href="/#work">Back to portfolio</a>
      <section className="project-hero">
        <div>
          <div className="sec-label">{project.badge}</div>
          <h1>{project.title}</h1>
          <p>{project.summary}</p>
          <div className="project-impact">{project.impact}</div>
        </div>
        <div className="project-stack">
          {project.stack.map((item) => <span className="sk sm" key={item}>{item}</span>)}
        </div>
      </section>
      <section className="project-body">
        <div className="project-notes">
          <h2>What this project does</h2>
          {project.highlights.map((item) => <p key={item}>{item}</p>)}
          <a href={project.url} target="_blank" rel="noreferrer" className="pc-link external-link">Repository -&gt;</a>
        </div>
        <ProjectDemo project={project} />
      </section>
    </main>
  );
}

function Awards({ awards }) {
  return (
    <section id="awards" className="section">
      <div className="sec-label">Awards</div>
      <div className="awards-grid">
        {awards.map((award) => (
          <article className="award-card rv" key={award.name}>
            <span className="award-rank">{award.rank}</span>
            <h3 className="award-name">{award.name}</h3>
            <p className="award-desc">{award.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function Skills({ skills }) {
  const flattened = useMemo(() => skills.flatMap((group) => group.items), [skills]);

  return (
    <section id="skills">
      <div className="sec-label">Skills</div>
      <h2 className="skills-title rv">
        I don't just know<br /><em>the tools.</em><br />I know when to<br /><span>use them.</span>
      </h2>
      <div className="skill-cloud rv">
        {flattened.map((skill, index) => (
          <span className={`sk ${index % 5 === 0 ? 'lg' : index % 2 === 0 ? 'md' : 'sm'}`} key={skill}>{skill}</span>
        ))}
      </div>
    </section>
  );
}

function VideoCv({ video }) {
  return (
    <section id="videocv">
      <div className="sec-label">Video CV</div>
      <div className="video-layout">
        <div>
          <h2 className="video-title rv">{video.heading}</h2>
          <p className="video-copy rv">{video.description}</p>
          <div className="vc-tips rv">
            {video.tips.map((tip) => <div className="vc-tip" key={tip}>{tip}</div>)}
          </div>
        </div>
        <div className="video-frame rv">
          <div className="video-thumb" />
          <div className="video-overlay">
            <div className="play-btn"><div className="play-triangle" /></div>
            <div className="video-label">Video CV - {video.status}</div>
          </div>
          <div className="video-coming">Upload yours</div>
        </div>
      </div>
    </section>
  );
}

function Contact({ person }) {
  const [status, setStatus] = useState('');
  const [state, setState] = useState('');

  const onSubmit = async (event) => {
    event.preventDefault();
    setStatus('Sending...');
    setState('');

    const payload = Object.fromEntries(new FormData(event.currentTarget).entries());

    try {
      if (!API_URL) throw new Error('API URL is not configured.');
      const response = await fetch(`${API_URL}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.detail || 'Unable to send message.');
      event.currentTarget.reset();
      setStatus(result.message);
      setState('success');
    } catch (error) {
      setStatus(error.message || 'Unable to send message right now.');
      setState('error');
    }
  };

  return (
    <section id="contact">
      <div className="contact-bg-text" aria-hidden="true">Hire<br />Me.</div>
      <div className="contact-pre rv">Ready when you are</div>
      <h2 className="contact-head rv">Let's<br /><em>build</em><br /><span className="out2">together.</span></h2>
      <p className="contact-sub rv">
        Open to Data Scientist, AI/ML Engineer, Marketing Analyst, and Ops Automation roles. Remote, hybrid, or UK-based.
      </p>
      <div className="contact-grid">
        <div className="contact-row rv">
          <a href={`mailto:${person.email}`} className="contact-email">{person.email}</a>
          <a href={person.linkedin} target="_blank" rel="noreferrer" className="soc">LinkedIn</a>
          <a href={person.github} target="_blank" rel="noreferrer" className="soc">GitHub</a>
          <a href={`tel:${person.phone}`} className="soc">{person.phone}</a>
        </div>
        <form className="contact-form rv" onSubmit={onSubmit}>
          <label>Name<input name="name" type="text" required minLength="2" maxLength="80" /></label>
          <label>Email<input name="email" type="email" required /></label>
          <label>Message<textarea name="message" rows="5" required minLength="10" maxLength="2000" /></label>
          <button type="submit" className="hbtn-main">Send message</button>
          <p className={`form-status ${state}`} role="status">{status}</p>
        </form>
      </div>
    </section>
  );
}

function App() {
  const [profile, setProfile] = useState(fallbackProfile);
  const [loading, setLoading] = useState(true);
  const [path, setPath] = useState(window.location.pathname);

  useCursor();

  useEffect(() => {
    if (!API_URL) {
      setProfile(fallbackProfile);
      setLoading(false);
      return;
    }

    fetch(`${API_URL}/api/profile`)
      .then((response) => {
        if (!response.ok) throw new Error('Profile request failed');
        return response.json();
      })
      .then((data) => setProfile({ ...fallbackProfile, ...data }))
      .catch(() => setProfile(fallbackProfile))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const onPopState = () => setPath(window.location.pathname);
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  useReveal(profile);

  const projectSlug = path.startsWith('/projects/') ? path.replace('/projects/', '').replace(/\/$/, '') : '';
  const selectedProject = projectSlug
    ? (profile.projects || []).find((project) => slugify(project.title) === projectSlug)
    : null;

  return (
    <>
      <div className="cursor-dot" />
      <div className="cursor-ring" />
      <Nav person={profile.person} />
      {loading && <div className="loading">Loading portfolio...</div>}
      {projectSlug && loading ? (
        <main className="project-page"><h1>Loading project...</h1></main>
      ) : projectSlug ? (
        <ProjectPage project={selectedProject} />
      ) : (
        <main>
          <Hero person={profile.person} ticker={profile.ticker || []} />
          <Manifesto manifesto={profile.manifesto} numbers={profile.numbers || []} />
          <Story experience={profile.experience || []} />
          <Work projects={profile.projects || []} />
          <Awards awards={profile.awards || []} />
          <Skills skills={profile.skills || []} />
          <VideoCv video={profile.video} />
          <Contact person={profile.person} />
        </main>
      )}
      <footer>
        <span>(c) 2026 {profile.person.name}</span>
        <span>React frontend | FastAPI backend | Free-host ready</span>
      </footer>
    </>
  );
}

export default App;
