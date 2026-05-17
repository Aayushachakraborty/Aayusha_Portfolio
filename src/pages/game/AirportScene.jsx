import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SceneFrame from '../../components/game/SceneFrame';
import Character from '../../components/world/Character';
import { useGameStore } from '../../store/useGameStore';
import { playUiChime, stopEngineLoop } from '../../utils/gameAudio';

export default function AirportScene({ profile }) {
  const navigate = useNavigate();
  const visitedProjects = useGameStore((state) => state.visitedProjects);
  const selectProject = useGameStore((state) => state.selectProject);
  const setScene = useGameStore((state) => state.setScene);
  const isMuted = useGameStore((state) => state.isMuted);

  useEffect(() => {
    setScene(5);
    stopEngineLoop();
  }, [setScene]);

  function board(project) {
    playUiChime(isMuted);
    selectProject(project.slug);
    navigate(`/project/${project.slug}`);
  }

  return (
    <SceneFrame className="airport-scene">
      <div className="airport-terminal" aria-hidden="true">
        <Character mode="walk" />
      </div>
      <section className="departure-board" aria-label="Project departure board">
        <div className="board-head">
          <span>FLIGHT</span>
          <span>DESTINATION</span>
          <span>STATUS</span>
          <span>GATE</span>
        </div>
        {profile.projects.items.slice(0, 4).map((project, index) => (
          <button key={project.slug} type="button" className="board-row" onClick={() => board(project)}>
            <span>{['DN01', 'TS02', 'RL03', 'AD04'][index] || `PX0${index + 1}`}</span>
            <strong>{project.title}</strong>
            <span>{visitedProjects.includes(project.slug) ? 'VISITED' : 'BOARDING'}</span>
            <span>A{index + 1}</span>
          </button>
        ))}
        <Link className={`board-row final ${visitedProjects.length ? '' : 'disabled'}`} to={visitedProjects.length ? '/contact' : '/airport'}>
          <span>HQ99</span>
          <strong>FINAL DESTINATION - CONTACT HQ</strong>
          <span>{visitedProjects.length ? 'READY' : 'LOCKED'}</span>
          <span>H1</span>
        </Link>
      </section>
    </SceneFrame>
  );
}
