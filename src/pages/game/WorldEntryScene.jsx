import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SceneFrame from '../../components/game/SceneFrame';
import Character from '../../components/world/Character';
import ParallaxCity from '../../components/world/ParallaxCity';
import { useGameStore } from '../../store/useGameStore';

export default function WorldEntryScene() {
  const navigate = useNavigate();
  const setScene = useGameStore((state) => state.setScene);

  useEffect(() => {
    setScene(1);
    const id = window.setTimeout(() => navigate('/about'), 1050);
    return () => window.clearTimeout(id);
  }, [navigate, setScene]);

  return (
    <SceneFrame className="world-entry">
      <ParallaxCity theme="sunrise">
        <div className="drop-camera">
          <p>camera drop initialized</p>
          <h1>World Entry</h1>
        </div>
        <Character />
      </ParallaxCity>
      <Link className="scene-skip" to="/about">SKIP</Link>
    </SceneFrame>
  );
}
