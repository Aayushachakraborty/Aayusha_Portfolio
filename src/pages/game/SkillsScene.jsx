import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import SceneFrame from '../../components/game/SceneFrame';
import Character from '../../components/world/Character';
import ParallaxCity from '../../components/world/ParallaxCity';
import Sign from '../../components/world/Sign';
import { useGameStore } from '../../store/useGameStore';
import { playUiChime } from '../../utils/gameAudio';

const storefronts = ['PYTHON.SHOP', 'ML.LAB', 'TIME_SERIES.DOJO', 'RL.ARENA', 'MLOPS.GARAGE', 'SQL.DINER'];

export default function SkillsScene({ profile }) {
  const [active, setActive] = useState(profile.skills.groups[0]);
  const carRef = useRef(null);
  const setScene = useGameStore((state) => state.setScene);
  const isMuted = useGameStore((state) => state.isMuted);

  useEffect(() => {
    setScene(3);
  }, [setScene]);

  function handleMouseMove(event) {
    if (!carRef.current) return;
    const progress = event.clientX / window.innerWidth;
    const travel = 4 + progress * 22;
    carRef.current.style.transform = `translate3d(${travel}vw, 0, 0)`;
  }

  return (
    <SceneFrame className="story-scene skills-game-scene" >
      <section className="mouse-drive-stage skills-drive-stage" onMouseMove={handleMouseMove}>
        <div className="skills-scroll-track">
          <ParallaxCity theme="dusk">
            <div className="mouse-car-layer" ref={carRef}>
              <Character />
            </div>
            <div className="neon-storefronts">
              {storefronts.map((name, index) => (
                <Sign key={name} title={name} onClick={() => {
                  playUiChime(isMuted);
                  setActive(profile.skills.groups[index % profile.skills.groups.length]);
                }}>
                  {profile.skills.groups[index % profile.skills.groups.length].name}
                </Sign>
              ))}
            </div>
          </ParallaxCity>
        </div>
      </section>
      <aside className="story-panel floating-skill-panel">
        <p className="panel-kicker">SKILLS DISTRICT</p>
        <h1>{active.name}</h1>
        <div className="skill-bars">
          {active.items.map((skill) => (
            <div key={skill.name}>
              <span>{skill.name}</span>
              <i data-scale={skill.scale} />
            </div>
          ))}
        </div>
        <p className="mouse-drive-hint">Move your mouse to cruise past storefronts. Click neon signs to unlock modules.</p>
        <div className="panel-actions">
          <Link className="game-cta next-primary" to="/experience">Next: Experience Highway</Link>
        </div>
      </aside>
    </SceneFrame>
  );
}
