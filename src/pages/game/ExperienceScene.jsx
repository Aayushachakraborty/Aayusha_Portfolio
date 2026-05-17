import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SceneFrame from '../../components/game/SceneFrame';
import Character from '../../components/world/Character';
import { useGameStore } from '../../store/useGameStore';
import { playUiChime, startEngineLoop, stopEngineLoop } from '../../utils/gameAudio';

export default function ExperienceScene({ profile }) {
  const [active, setActive] = useState(profile.experience.items[0]);
  const setScene = useGameStore((state) => state.setScene);
  const isMuted = useGameStore((state) => state.isMuted);

  useEffect(() => {
    setScene(4);
    startEngineLoop(isMuted);
    return () => stopEngineLoop();
  }, [isMuted, setScene]);

  return (
    <SceneFrame className="experience-scene">
      <div className="night-sky" aria-hidden="true" />
      <Character />
      <section className="highway">
        {profile.experience.items.map((job) => (
          <button key={job.company} className="milestone" type="button" onClick={() => {
            playUiChime(isMuted);
            setActive(job);
          }}>
            <span>{job.period}</span>
            <strong>{job.company}</strong>
            <em>{job.impact}</em>
          </button>
        ))}
      </section>
      <aside className="story-panel experience-panel">
        <p className="panel-kicker">EXPERIENCE HIGHWAY</p>
        <h1>{active.role}</h1>
        <h2>{active.company}</h2>
        <p>{active.impact}</p>
        <ul>
          {active.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}
        </ul>
        <div className="chip-row">
          {active.tags.map((tag) => <span key={tag}>{tag}</span>)}
        </div>
        <Link className="game-link-next" to="/airport">Approach Airport</Link>
      </aside>
    </SceneFrame>
  );
}
