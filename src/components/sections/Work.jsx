import { useMemo, useState } from 'react';
import RevealOnScroll from '../shared/RevealOnScroll';

export default function Work({ projects, navigate, reducedMotion }) {
  const [activeTag, setActiveTag] = useState('All');
  const tagOptions = useMemo(() => {
    const tags = new Set();
    projects.items?.forEach((project) => project.tags?.forEach((tag) => tags.add(tag)));
    return ['All', ...Array.from(tags)];
  }, [projects.items]);

  const visibleProjects = useMemo(() => {
    if (activeTag === 'All') return projects.items || [];
    return (projects.items || []).filter((project) => project.tags?.includes(activeTag));
  }, [activeTag, projects.items]);

  return (
    <section id="work">
      <div className="work-header">
        <div>
          <div className="sec-label">Selected work</div>
          <h2 className="work-title">Projects with<br /><em>business teeth.</em></h2>
        </div>
      </div>
      <div className="filter-row" role="tablist" aria-label="Project tech filter">
        {tagOptions.map((tag) => (
          <button
            key={tag}
            type="button"
            className={`filter-chip ${activeTag === tag ? 'active' : ''}`}
            onClick={() => setActiveTag(tag)}
          >
            {tag}
          </button>
        ))}
      </div>
      <div className="proj-grid">
        {visibleProjects.map((project, index) => (
          <RevealOnScroll as="article" className={`pc pc${(index % 6) + 1}`} key={project.slug} disabled={reducedMotion}>
            <img className="pc-image" src={project.image} alt="" loading="lazy" decoding="async" />
            <div className="pc-content">
              <div className="pc-num">
                <span>{project.number}{index === 0 ? ' - Featured' : ''}</span>
                <span className="pc-badge">{project.badge}</span>
              </div>
              <h3 className="pc-title">{project.title}</h3>
              <div className="pc-impact">{project.impact}</div>
              <p className="pc-desc">{project.summary}</p>
              <div className="pc-stack">
                {project.stack?.map((item) => <span className="pcs" key={item}>{item}</span>)}
              </div>
              <a
                href={`/projects/${project.slug}`}
                className="pc-link"
                onClick={(event) => {
                  event.preventDefault();
                  navigate(`/projects/${project.slug}`);
                  window.scrollTo({ top: 0, behavior: 'auto' });
                }}
              >
                Open project -&gt;
              </a>
            </div>
          </RevealOnScroll>
        ))}
      </div>
    </section>
  );
}
