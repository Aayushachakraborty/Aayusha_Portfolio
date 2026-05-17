import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import SceneFrame from '../../components/game/SceneFrame';
import Character from '../../components/world/Character';
import CloudCard from '../../components/world/CloudCard';
import { useGameStore } from '../../store/useGameStore';
import { playUiChime, startEngineLoop, stopEngineLoop } from '../../utils/gameAudio';

export default function ExperienceScene({ profile }) {
  const [active, setActive] = useState(profile.experience.items[0]);
  const carRef = useRef(null);
  const setScene = useGameStore((state) => state.setScene);
  const isMuted = useGameStore((state) => state.isMuted);

  useEffect(() => {
    setScene(4);
    startEngineLoop(isMuted);
    return () => stopEngineLoop();
  }, [isMuted, setScene]);

  function handleMouseMove(event) {
    if (!carRef.current) return;
    const progress = event.clientX / window.innerWidth;
    const travel = 4 + progress * 22;
    carRef.current.style.transform = `translate3d(${travel}vw, 0, 0)`;
  }

  return (
    <SceneFrame className="experience-scene">
      <div className="night-sky" aria-hidden="true" />
      <div className="office-backdrop" aria-hidden="true">
        <div className="experience-bg-cloud bg-cloud-1" />
        <div className="experience-bg-cloud bg-cloud-2" />
        <div className="experience-bg-cloud bg-cloud-3" />
        <div className="experience-bg-cloud bg-cloud-4" />
        <div className="experience-bg-cloud bg-cloud-5" />
        <div className="experience-bg-cloud bg-cloud-6" />
        <div className="office-cloud cloud-one" />
        <div className="office-cloud cloud-two" />
        <div className="office-towers">
          <span className="tower tower-a" data-label="OPS" />
          <span className="tower tower-b" data-label="OFFICE" />
          <span className="tower tower-c" data-label="DATA HQ" />
          <span className="tower tower-d" data-label="ML LAB" />
        </div>
        <div className="office-road"><span /></div>
      </div>
      <section className="experience-drive-stage" onMouseMove={handleMouseMove}>
        <div className="mouse-car-layer" ref={carRef}>
          <Character />
        </div>
      </section>
      <section className="highway" aria-label="Experience milestones">
        {profile.experience.items.map((job) => (
          <CloudCard key={job.company} as="button" className="milestone" type="button" onClick={() => {
            playUiChime(isMuted);
            setActive(job);
          }}>
            <span>{job.period}</span>
            <strong>{job.company}</strong>
          </CloudCard>
        ))}
      </section>
      <aside className="story-panel experience-panel">
        <div className="experience-dossier">
          <p className="panel-kicker">EXPERIENCE // MISSION LOG</p>
          <h1>{active.role}</h1>
          <h2>{active.company}</h2>
          <p className="experience-impact">{active.impact}</p>
          <div className="experience-points">
            {active.bullets.map((bullet) => <p key={bullet}>{bullet}</p>)}
          </div>
          <div className="chip-row">
            {active.tags.map((tag) => <span key={tag}>{tag}</span>)}
          </div>
        </div>
        <div className="panel-actions">
          <Link className="game-cta next-primary" to="/airport">Next: Airport</Link>
        </div>
      </aside>
    </SceneFrame>
  );
}
