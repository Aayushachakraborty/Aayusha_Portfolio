import RevealOnScroll from '../shared/RevealOnScroll';
import Decoration from '../shared/Decoration';

export default function Awards({ awards, reducedMotion, decorations = [] }) {
  return (
    <section id="awards" className="section">
      {decorations.map((decoration) => <Decoration key={decoration.id} {...decoration} />)}
      <div className="sec-label">Awards</div>
      <div className="awards-grid">
        {awards.items?.map((award) => (
          <RevealOnScroll as="article" className="award-card" key={award.name} disabled={reducedMotion}>
            <span className="award-rank">{award.rank}</span>
            <h3 className="award-name">{award.name}</h3>
            <p className="award-desc">{award.description}</p>
          </RevealOnScroll>
        ))}
      </div>
    </section>
  );
}
