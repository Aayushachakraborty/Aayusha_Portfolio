import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import SceneFrame from '../../components/game/SceneFrame';
import { useGameStore } from '../../store/useGameStore';
import { playStartSound, playUiChime } from '../../utils/gameAudio';

const themes = ['warehouse', 'financial', 'factory', 'server'];

export default function ProjectFlightScene({ profile }) {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [landed, setLanded] = useState(false);
  const setScene = useGameStore((state) => state.setScene);
  const visitProject = useGameStore((state) => state.visitProject);
  const isMuted = useGameStore((state) => state.isMuted);
  const project = useMemo(() => profile.projects.items.find((item) => item.slug === slug), [profile.projects.items, slug]);
  const projectIndex = profile.projects.items.findIndex((item) => item.slug === slug);
  const theme = themes[Math.max(projectIndex, 0) % themes.length];

  useEffect(() => {
    setScene(6);
    setLanded(false);
    playStartSound(isMuted);
    const id = window.setTimeout(() => setLanded(true), 2300);
    return () => window.clearTimeout(id);
  }, [isMuted, slug, setScene]);

  if (!project) {
    return (
      <SceneFrame className="project-flight-scene">
        <section className="story-panel">
          <h1>Flight not found</h1>
          <Link className="game-link-next" to="/airport">Back to Airport</Link>
        </section>
      </SceneFrame>
    );
  }

  function backToAirport() {
    playUiChime(isMuted);
    visitProject(project.slug);
    navigate('/airport');
  }

  return (
    <SceneFrame className={`project-flight-scene project-theme-${theme}`}>
      {!landed ? (
        <section className="plane-cutscene">
          <div className="plane" aria-hidden="true">
            <svg viewBox="0 0 360 170" role="img">
              <path className="plane-glow" d="M21 91 338 32 245 100 338 139 21 91Z" />
              <path className="plane-body" d="M22 88 240 68c29-3 58-14 86-32 9-6 22 3 17 14-14 29-42 53-82 71l76 20c11 3 13 18 3 24-5 3-11 3-17 1l-124-34-79 30c-13 5-27-7-23-21l8-26-82-11c-14-2-15-14-1-16Z" />
              <path className="plane-wing" d="M140 84 73 26c-10-9-4-25 10-25h27l104 76-74 7Z" />
              <path className="plane-wing" d="M159 112 84 160h42l93-39-60-9Z" />
              <path className="plane-window" d="M235 68c21-5 41-13 61-25" />
              <circle className="plane-window-dot" cx="195" cy="79" r="5" />
              <circle className="plane-window-dot" cx="215" cy="76" r="5" />
              <circle className="plane-window-dot" cx="235" cy="73" r="5" />
            </svg>
          </div>
          <p>NOW DEPARTING</p>
          <h1>{project.title}</h1>
          <button type="button" onClick={() => setLanded(true)}>SKIP</button>
        </section>
      ) : (
        <section className="case-study">
          <p className="panel-kicker">LANDED - CASE STUDY</p>
          <h1>{project.impact}</h1>
          <div className="case-grid-game">
            <article>
              <h2>Problem</h2>
              <p>{project.problem}</p>
            </article>
            <article>
              <h2>Approach</h2>
              <p>{project.approach}</p>
              <div className="architecture-diagram" aria-label="Architecture diagram">
                <span>Data</span><i /> <span>Model</span><i /> <span>API</span><i /> <span>Decision UI</span>
              </div>
            </article>
            <article>
              <h2>Outcome</h2>
              <p>{project.outcome}</p>
            </article>
          </div>
          <div className="chip-row">
            {project.stack.map((item) => <span key={item}>{item}</span>)}
          </div>
          <div className="case-actions">
            <Link className="game-cta" to={`/project/${project.slug}/demo`}>
              <span aria-hidden="true">OPEN</span>
              Live Demo
            </Link>
            <a className="game-cta ghost" href={project.repoUrl}>
              <span aria-hidden="true">GH</span>
              Code
            </a>
            <button className="game-link-next" type="button" onClick={backToAirport}>Back to Airport</button>
          </div>
        </section>
      )}
    </SceneFrame>
  );
}
