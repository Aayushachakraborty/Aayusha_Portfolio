import RevealOnScroll from '../shared/RevealOnScroll';

export default function Awards({ awards, reducedMotion }) {
  return (
    <section id="awards" className="section">
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
