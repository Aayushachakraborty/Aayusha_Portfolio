import DownloadCvButton from '../shared/DownloadCvButton';
import Decoration from '../shared/Decoration';
import { useReveal } from '../../hooks/useReveal';
import { useCountUp } from '../../hooks/useCountUp';
import { useMagnetic } from '../../hooks/useMagnetic';

function CountStat({ stat, index, start }) {
  const value = useCountUp(stat.value, 1400, start, index * 200);

  return (
    <div>
      <span className="hs-num">{value}</span>
      <span className="hs-label">{stat.label}</span>
    </div>
  );
}

export default function Hero({ person, ticker, reducedMotion, decorations = [] }) {
  const headline = person.headline || [];
  const tickerItems = [...(ticker.items || []), ...(ticker.items || [])];
  const { ref: statsRef, visible: statsVisible } = useReveal({ disabled: reducedMotion });
  const heroButtonMagnetic = useMagnetic(!reducedMotion);

  return (
    <section id="hero">
      {decorations.map((decoration) => <Decoration key={decoration.id} {...decoration} />)}

      <div className="ring-wrap" aria-hidden="true">
        <svg className={`ring-text ${reducedMotion ? 'ring-still' : ''}`} viewBox="0 0 200 200">
          <defs>
            <path id="circlePath" d="M 100,100 m -74,0 a 74,74 0 1,1 148,0 a 74,74 0 1,1 -148,0" />
          </defs>
          <text>
            <textPath href="#circlePath">DATA SCIENTIST - AI ENGINEER - OPS AUTOMATION - </textPath>
          </text>
        </svg>
      </div>

      <div className="hero-inner">
        <div className="hero-overline">{person.eyebrow}</div>
        <h1 className="hero-headline">
          {headline[0]}<br />
          <span className="outline">{headline[1]}</span><br />
          {headline[2]} <span className="italic">{headline[3]}</span>
        </h1>
        <p className="hero-tagline">{person.summary}</p>
        <div className="hero-bottom-row">
          <div ref={statsRef} className="hero-stats" aria-label="Hero metrics">
            {(person.heroStats || []).map((stat, index) => (
              <CountStat key={stat.label} stat={stat} index={index} start={statsVisible} />
            ))}
          </div>
          <div className="hero-cta-group">
            <div
              className="magnetic-wrap"
              onMouseMove={heroButtonMagnetic.onMouseMove}
              onMouseLeave={heroButtonMagnetic.onMouseLeave}
              style={heroButtonMagnetic.style}
            >
              <DownloadCvButton href={person.resumeUrl} />
            </div>
            <a href="#work" className="hbtn-ghost">See my work</a>
          </div>
        </div>
      </div>

      <div className="ticker-wrap" aria-hidden={reducedMotion}>
        <div className={`ticker-track ${reducedMotion ? 'ticker-still' : ''}`}>
          {tickerItems.map((item, index) => (
            <span className={`ticker-item ${index % 3 === 2 ? 'accent' : ''}`} key={`${item}-${index}`}>
              {item}<span className="ticker-sep">x</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
