import { useEffect, useState } from 'react';
import OpenToWorkPill from '../shared/OpenToWorkPill';
import ThemeToggle from '../shared/ThemeToggle';
import { useMagnetic } from '../../hooks/useMagnetic';
import { useReducedMotion } from '../../hooks/useReducedMotion';

export default function Nav({ person, view, navigate }) {
  const [solid, setSolid] = useState(view !== 'home');
  const [open, setOpen] = useState(false);
  const reducedMotion = useReducedMotion();
  const contactMagnetic = useMagnetic(!reducedMotion);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 60 || view !== 'home');
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, [view]);

  function goToSection(sectionId) {
    setOpen(false);

    const scroll = () => {
      const node = document.getElementById(sectionId);
      if (node) node.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    if (view === 'home') {
      window.history.replaceState({}, '', `/#${sectionId}`);
      scroll();
      return;
    }

    navigate('/');
    window.setTimeout(scroll, 60);
  }

  const brandParts = (person.brand || 'A.Chakraborty').split('.');

  return (
    <nav className={solid ? 'solid' : ''}>
      <a
        href="/"
        className="nmark"
        onClick={(event) => {
          event.preventDefault();
          navigate('/');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      >
        {brandParts[0] || 'A'}<span>.</span>{brandParts[1] || 'Chakraborty'}
      </a>

      <button className="menu-btn" type="button" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="site-nav-links">
        Menu
      </button>

      <div className={`nright ${open ? 'open' : ''}`} id="site-nav-links">
        <button type="button" className="nlink link-reset" onClick={() => goToSection('story')}>Story</button>
        <button type="button" className="nlink link-reset" onClick={() => goToSection('work')}>Work</button>
        <button type="button" className="nlink link-reset" onClick={() => goToSection('awards')}>Awards</button>
        <button type="button" className="nlink link-reset" onClick={() => goToSection('skills')}>Skills</button>
        <ThemeToggle />
        <OpenToWorkPill label={person.availabilityShort || person.availability} onClick={() => goToSection('contact')} />
        <div className="magnetic-wrap" onMouseMove={contactMagnetic.onMouseMove} onMouseLeave={contactMagnetic.onMouseLeave} style={contactMagnetic.style}>
          <a href={`mailto:${person.email}`} className="ncta">Email</a>
        </div>
      </div>
    </nav>
  );
}
