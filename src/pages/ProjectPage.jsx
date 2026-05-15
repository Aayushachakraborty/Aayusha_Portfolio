import { Suspense } from 'react';
import { demos } from '../components/demos/demoRegistry';
import { useDocumentMeta } from '../hooks/useDocumentMeta';
import { formatReadTime } from '../utils/format';

function CaseStudyBlock({ eyebrow, headline, body }) {
  return (
    <div className="case-block">
      <div className="sec-label">{eyebrow}</div>
      <h2>{headline}</h2>
      <p>{body}</p>
    </div>
  );
}

export default function ProjectPage({ project, navigate, meta }) {
  const Demo = project ? demos[project.demo] : null;
  const readTime = project
    ? formatReadTime(project.summary, project.problem, project.approach, project.outcome, ...(project.highlights || []))
    : '';
  const isDatanirnaya = project?.demo === 'datanirnaya';

  useDocumentMeta({
    title: project ? `${project.title} — Aayusha Chakraborty` : meta.title,
    description: project?.summary || meta.description,
    ogImage: project?.image || meta.ogImage,
  });

  if (!project) return null;

  return (
    <main className="project-page" id="main-content">
      <a
        className="back-link"
        href="/"
        onClick={(event) => {
          event.preventDefault();
          navigate('/');
        }}
      >
        Back to portfolio
      </a>
      <section className="project-hero">
        <div>
          <div className="sec-label">{project.badge}</div>
          <h1>{project.title}</h1>
          <p>{project.summary}</p>
          <div className="project-meta-row">
            <div className="project-impact">{project.impact}</div>
            <span className="read-time">{readTime}</span>
          </div>
        </div>
        <div className="project-stack project-side">
          <img className="project-image" src={project.image} alt="" loading="lazy" decoding="async" />
          <div className="project-stack-tags">
            {project.stack?.map((item) => <span className="sk sm" key={item}>{item}</span>)}
          </div>
        </div>
      </section>
      <section className="case-grid">
        <CaseStudyBlock eyebrow="Problem" headline={project.problem} body={project.summary} />
        <CaseStudyBlock eyebrow="Approach" headline={project.approach} body={(project.highlights || []).join(' · ')} />
        <CaseStudyBlock eyebrow="Outcome" headline={project.outcome} body={project.impact} />
      </section>
      <section className="project-body">
        <div className="project-notes">
          <h2>What this project does</h2>
          {project.highlights?.map((item) => <p key={item}>{item}</p>)}
          <a href={project.repoUrl} target="_blank" rel="noreferrer" className="pc-link external-link">Repository -&gt;</a>
        </div>
        {isDatanirnaya ? (
          <div className="demo-teaser">
            <div className="demo-teaser-viewport" aria-hidden="true">
              <Suspense fallback={<div className="demo-panel"><p>Loading demo…</p></div>}>
                {Demo ? <Demo type={project.demo} /> : <div className="demo-panel"><p>Demo unavailable.</p></div>}
              </Suspense>
            </div>
            <div className="demo-teaser-overlay">
              <div className="demo-teaser-copy">
                <span className="demo-teaser-label">Interactive Dashboard</span>
                <h3>View demo</h3>
                <p>Open the live supply chain workspace on its own page for the full interactive experience.</p>
              </div>
              <a
                href={`/projects/${project.slug}/demo`}
                target="_blank"
                rel="noreferrer"
                className="hbtn-main"
              >
                View demo
              </a>
            </div>
          </div>
        ) : (
          <Suspense fallback={<div className="demo-panel"><p>Loading demo…</p></div>}>
            {Demo ? <Demo type={project.demo} /> : <div className="demo-panel"><p>Demo unavailable.</p></div>}
          </Suspense>
        )}
      </section>
    </main>
  );
}
