import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SceneFrame from '../../components/game/SceneFrame';
import Character from '../../components/world/Character';
import { useGameStore } from '../../store/useGameStore';

export default function ContactScene({ profile }) {
  const navigate = useNavigate();
  const restart = useGameStore((state) => state.restart);
  const setScene = useGameStore((state) => state.setScene);

  useEffect(() => setScene(7), [setScene]);

  function handleRestart() {
    restart();
    document.body.classList.add('rewind-flash');
    window.setTimeout(() => {
      document.body.classList.remove('rewind-flash');
      navigate('/');
    }, 760);
  }

  return (
    <SceneFrame className="contact-hq-scene">
      <div className="hq-horizon" aria-hidden="true" />
      <Character mode="walk" />
      <section className="contact-card-game">
        <p className="panel-kicker">HOME BASE</p>
        <h1>Let's build decision systems that operators can trust.</h1>
        <div className="contact-links-game">
          <a href={`mailto:${profile.person.email}`}><span aria-hidden="true">MAIL</span>{profile.person.email}</a>
          <a href={profile.person.linkedin}><span aria-hidden="true">IN</span>LinkedIn</a>
          <a href={profile.person.github}><span aria-hidden="true">GH</span>GitHub</a>
          <a href={profile.person.resumeUrl}>Download Resume</a>
        </div>
        <button className="press-start restart" type="button" onClick={handleRestart}>
          <span aria-hidden="true">REWIND</span>
          RESTART QUEST
        </button>
      </section>
    </SceneFrame>
  );
}
