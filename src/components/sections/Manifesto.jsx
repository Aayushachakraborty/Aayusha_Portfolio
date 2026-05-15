import RevealOnScroll from '../shared/RevealOnScroll';

export default function Manifesto({ manifesto, numbers, reducedMotion }) {
  return (
    <>
      <section id="manifesto">
        <div className="sec-label">{manifesto.eyebrow}</div>
        <div className="manifesto-layout">
          <RevealOnScroll as="h2" className="manifesto-big" disabled={reducedMotion}>
            {manifesto.heading?.[0]}<br /><em>{manifesto.heading?.[1]}</em><br /><span className="outline-dark">{manifesto.heading?.[2]}</span>
          </RevealOnScroll>
          <div className="manifesto-right">
            {manifesto.paragraphs?.map((paragraph) => (
              <RevealOnScroll as="p" className="manifesto-p" key={paragraph} disabled={reducedMotion}>
                {paragraph}
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>
      <section id="numbers" aria-label="Impact numbers">
        {numbers.items?.map((item) => (
          <RevealOnScroll as="div" className="num-item" key={item.label} disabled={reducedMotion}>
            <span className="num-big">{item.value}</span>
            <span className="num-desc">{item.label}</span>
          </RevealOnScroll>
        ))}
      </section>
    </>
  );
}
