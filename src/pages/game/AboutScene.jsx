import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import SceneFrame from '../../components/game/SceneFrame';
import Character from '../../components/world/Character';
import ParallaxCity from '../../components/world/ParallaxCity';
import Sign from '../../components/world/Sign';
import { useGameStore } from '../../store/useGameStore';
import { getGsap } from '../../utils/scrollTrigger';
import { startEngineLoop, stopEngineLoop } from '../../utils/gameAudio';

export default function AboutScene({ profile, reducedMotion }) {
  const trackRef = useRef(null);
  const setScene = useGameStore((state) => state.setScene);
  const isMuted = useGameStore((state) => state.isMuted);

  useEffect(() => {
    setScene(2);
    startEngineLoop(isMuted);
    return () => stopEngineLoop();
  }, [isMuted, setScene]);

  useEffect(() => {
    if (reducedMotion || !trackRef.current) return undefined;
    const { gsap, ScrollTrigger } = getGsap();
    const ctx = gsap.context(() => {
      gsap.to('.about-scroll-track', {
        xPercent: -18,
        ease: 'none',
        scrollTrigger: {
          trigger: trackRef.current,
          start: 'top top',
          end: '+=900',
          scrub: 0.6,
          pin: true,
        },
      });
    }, trackRef);
    return () => {
      ctx.revert();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [reducedMotion]);

  return (
    <SceneFrame className="story-scene about-scene">
      <section className="scroll-stage" ref={trackRef}>
        <div className="about-scroll-track">
          <ParallaxCity theme="sunrise">
            <Character />
            <div className="billboard-strip">
              <Sign title="4 YEARS XP">Production ML</Sign>
              <Sign title="SUPPLY CHAIN">Forecasting + risk</Sign>
              <Sign title="RL + ANOMALY">Decision systems</Sign>
            </div>
          </ParallaxCity>
        </div>
        <aside className="story-panel about-panel">
          <p className="panel-kicker">ABOUT</p>
          <h1>{profile.person.name}</h1>
          <p>{profile.person.summary || '[PLACEHOLDER_BIO]'}</p>
          <dl className="mini-facts">
            <div><dt>Location</dt><dd>{profile.person.location}</dd></div>
            <div><dt>Education</dt><dd>Data science, analytics, and business systems</dd></div>
            <div><dt>Focus</dt><dd>Forecasting, MLOps, RL, anomaly detection</dd></div>
          </dl>
          <a className="game-cta" href={profile.person.resumeUrl}>
            <span aria-hidden="true">DL</span>
            Download Resume
          </a>
          <Link className="game-link-next" to="/skills">Continue Journey</Link>
        </aside>
      </section>
    </SceneFrame>
  );
}
