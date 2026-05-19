import { Suspense } from 'react';
import { demos } from '../components/demos/demoRegistry';
import { useDocumentMeta } from '../hooks/useDocumentMeta';

export default function ProjectDemoPage({ project, navigate, meta }) {
  const Demo = project ? demos[project.demo] : null;

  useDocumentMeta({
    title: project ? `${project.title} Demo — Aayusha Chakraborty` : meta.title,
    description: project?.summary || meta.description,
    ogImage: project?.image || meta.ogImage,
  });

  if (!project) return null;

  return (
    <main className="project-demo-page" id="main-content">
      <div className="project-demo-head">
        <a
          className="back-link"
          href={`/projects/${project.slug}`}
          onClick={(event) => {
            event.preventDefault();
            navigate(`/projects/${project.slug}`);
          }}
        >
          Back to project
        </a>
        <div className="sec-label">Live Demo</div>
        <h1>{project.title}</h1>
        <p>{project.impact}</p>
      </div>

      <section className="project-demo-shell">
        <Suspense fallback={<div className="demo-panel"><p>Loading demo…</p></div>}>
          {Demo ? <Demo type={project.demo} /> : <div className="demo-panel"><p>Demo not ready.</p></div>}
        </Suspense>
      </section>
    </main>
  );
}
