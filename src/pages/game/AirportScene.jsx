import { useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SceneFrame from '../../components/game/SceneFrame';
import Character from '../../components/world/Character';
import { useGameStore } from '../../store/useGameStore';
import { playUiChime, startEngineLoop, stopEngineLoop } from '../../utils/gameAudio';

export default function AirportScene({ profile }) {
  const navigate = useNavigate();
  const carRef = useRef(null);
  const visitedProjects = useGameStore((state) => state.visitedProjects);
  const selectProject = useGameStore((state) => state.selectProject);
  const setScene = useGameStore((state) => state.setScene);
  const isMuted = useGameStore((state) => state.isMuted);

  useEffect(() => {
    setScene(5);
    startEngineLoop(isMuted);
    return () => stopEngineLoop();
  }, [isMuted, setScene]);

  function handleMouseMove(event) {
    if (!carRef.current) return;
    const progress = event.clientX / window.innerWidth;
    const travel = 2 + progress * 30;
    carRef.current.style.transform = `translate3d(${travel}vw, 0, 0)`;
  }

  function board(project) {
    playUiChime(isMuted);
    selectProject(project.slug);
    navigate(`/project/${project.slug}`);
  }

  return (
    <SceneFrame className="airport-scene" onMouseMove={handleMouseMove}>
      <div className="airport-terminal" aria-hidden="true">
        <div className="sky-flight flight-one">
          <span className="sky-plane-body" />
          <span className="sky-plane-wing" />
          <span className="sky-plane-tail" />
        </div>
        <div className="sky-flight flight-two">
          <span className="sky-plane-body" />
          <span className="sky-plane-wing" />
          <span className="sky-plane-tail" />
        </div>
        <div className="airport-skyline">
          <span className="terminal-block terminal-a" />
          <span className="terminal-block terminal-b" />
          <span className="terminal-block terminal-c" />
          <span className="control-tower" />
        </div>
        <div className="airport-plane">
          <span className="plane-body" />
          <span className="plane-wing" />
          <span className="plane-tail" />
        </div>
        <div className="gate-markers">
          <span>GATE A1</span>
          <span>GATE A2</span>
          <span>GATE A3</span>
        </div>
        <div className="runway">
          <span className="runway-line" />
          <span className="taxi-line" />
          <span className="runway-lights" />
        </div>
        <div className="airport-car-layer" ref={carRef}>
          <Character />
        </div>
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
