import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useGameStore } from '../../store/useGameStore';
import { GAME_SCENES, getSceneByPath } from '../../utils/gameScenes';

function useIstClock() {
  const [time, setTime] = useState('');

  useEffect(() => {
    const tick = () => {
      setTime(new Intl.DateTimeFormat('en-IN', {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }).format(new Date()));
    };
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  return time;
}

export default function GameHud() {
  const location = useLocation();
  const time = useIstClock();
  const isMuted = useGameStore((state) => state.isMuted);
  const toggleMute = useGameStore((state) => state.toggleMute);
  const scene = getSceneByPath(location.pathname);

  if (location.pathname === '/' || location.pathname === '/resume') return null;

  return (
    <header className="game-hud" aria-label="Game status">
      <div className="hud-left">
        <span className="hud-dot" aria-hidden="true" />
        <span>{scene.hud}</span>
      </div>
      <nav className="hud-right" aria-label="Game controls">
        <span>{time} IST</span>
        <button className="hud-icon-button" type="button" onClick={toggleMute} aria-label={isMuted ? 'Unmute audio' : 'Mute audio'}>
          <span aria-hidden="true">{isMuted ? 'SFX-' : 'SFX+'}</span>
          <span>{isMuted ? 'MUTE' : 'SOUND'}</span>
        </button>
        <Link to="/resume">SKIP TO RESUME</Link>
      </nav>
      <div className="scene-progress" aria-label="Scene progress">
        {GAME_SCENES.map((item) => (
          <span
            key={item.label}
            className={item.label === scene.label ? 'active' : ''}
            title={item.label}
            aria-hidden="true"
          />
        ))}
      </div>
    </header>
  );
}
