import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SceneFrame from '../../components/game/SceneFrame';
import Character from '../../components/world/Character';
import ParallaxCity from '../../components/world/ParallaxCity';
import Sign from '../../components/world/Sign';
import { useGameStore } from '../../store/useGameStore';
import { playUiChime, startEngineLoop, stopEngineLoop } from '../../utils/gameAudio';

const storefronts = ['PYTHON.SHOP', 'ML.LAB', 'TIME_SERIES.DOJO', 'RL.ARENA', 'MLOPS.GARAGE', 'SQL.DINER'];

export default function SkillsScene({ profile }) {
  const [active, setActive] = useState(profile.skills.groups[0]);
  const setScene = useGameStore((state) => state.setScene);
  const isMuted = useGameStore((state) => state.isMuted);

  useEffect(() => {
    setScene(3);
    startEngineLoop(isMuted);
    return () => stopEngineLoop();
  }, [isMuted, setScene]);

  return (
    <SceneFrame className="story-scene skills-game-scene">
      <ParallaxCity theme="dusk">
        <Character />
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
        <Link className="game-link-next" to="/experience">Ride to Experience Highway</Link>
      </aside>
    </SceneFrame>
  );
}
