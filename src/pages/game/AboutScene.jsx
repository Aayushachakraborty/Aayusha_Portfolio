import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import SceneFrame from '../../components/game/SceneFrame';
import Character from '../../components/world/Character';
import ParallaxCity from '../../components/world/ParallaxCity';
import Sign from '../../components/world/Sign';
import { useGameStore } from '../../store/useGameStore';
import { startEngineLoop, stopEngineLoop } from '../../utils/gameAudio';

export default function AboutScene({ profile, reducedMotion }) {
  const carRef = useRef(null);
  const setScene = useGameStore((state) => state.setScene);
  const isMuted = useGameStore((state) => state.isMuted);

  useEffect(() => {
    setScene(2);
    startEngineLoop(isMuted);
    return () => stopEngineLoop();
  }, [isMuted, setScene]);

  function handleMouseMove(event) {
    if (reducedMotion || !carRef.current) return;
    const progress = event.clientX / window.innerWidth;
    const travel = 4 + progress * 22;
    carRef.current.style.transform = `translate3d(${travel}vw, 0, 0)`;
  }

  return (
    <SceneFrame className="story-scene about-scene" >
      <section className="scroll-stage mouse-drive-stage" onMouseMove={handleMouseMove}>
        <div className="about-scroll-track">
          <ParallaxCity theme="sunrise">
            <div className="mouse-car-layer" ref={carRef}>
              <Character />
            </div>
            <div className="billboard-strip">
              <Sign title="4 YEARS XP">Production ML</Sign>
              <Sign title="SUPPLY CHAIN">Forecasting + risk</Sign>
              <Sign title="RL + ANOMALY">Decision systems</Sign>
            </div>
          </ParallaxCity>
        </div>
        <aside className="story-panel about-panel">
          <div className="about-social-rail" role="navigation" aria-label="Profile channels">
            <a href={profile.person.github} aria-label="GitHub profile">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.9a3.4 3.4 0 0 0-1-2.6c3.3-.4 6.8-1.6 6.8-7.3a5.7 5.7 0 0 0-1.6-4 5.3 5.3 0 0 0-.1-4s-1.3-.4-4.1 1.5a14.2 14.2 0 0 0-7.5 0C5.7-.4 4.4 0 4.4 0a5.3 5.3 0 0 0-.1 4 5.7 5.7 0 0 0-1.6 4c0 5.7 3.5 6.9 6.8 7.3a3.4 3.4 0 0 0-1 2.6V22" />
              </svg>
            </a>
            <a href={profile.person.linkedin} aria-label="LinkedIn profile">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6Z" />
                <path d="M2 9h4v12H2zM4 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
              </svg>
            </a>
            <a href={profile.person.resumeUrl} aria-label="Download resume">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
                <path d="M14 2v6h6M12 11v6m0 0 3-3m-3 3-3-3" />
              </svg>
            </a>
            <a href={`mailto:${profile.person.email}`} aria-label="Email Aayusha">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z" />
                <path d="m22 6-10 7L2 6" />
              </svg>
            </a>
          </div>
          <div className="about-dossier">
            <p className="panel-kicker">ABOUT // PLAYER DOSSIER</p>
            <div className="about-identity">
              <span className="avatar-sigil">AC</span>
              <div>
                <h1>{profile.person.name}</h1>
                <p>{profile.person.eyebrow}</p>
              </div>
            </div>
            <p className="about-bio">{profile.person.summary || '[PLACEHOLDER_BIO]'}</p>
            <div className="about-stat-grid">
              {profile.person.heroStats.map((stat) => (
                <div key={stat.label}>
                  <strong>{stat.value}</strong>
                  <span>{stat.label}</span>
                </div>
              ))}
            </div>
            <dl className="mini-facts">
              <div><dt>Base</dt><dd>{profile.person.location}</dd></div>
              <div><dt>Mission</dt><dd>Forecasting, MLOps, RL, anomaly detection</dd></div>
            </dl>
            <p className="mouse-drive-hint">Move your mouse across the city. The scene responds like a scanner.</p>
          </div>
          <div className="panel-actions">
            <a className="game-cta secondary" href={profile.person.resumeUrl}>
              <svg className="cta-icon" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 3v11m0 0 4-4m-4 4-4-4M5 17v3h14v-3" />
              </svg>
              Resume
            </a>
            <Link className="game-cta next-primary" to="/skills">Next: Skills District</Link>
          </div>
        </aside>
      </section>
    </SceneFrame>
  );
}
