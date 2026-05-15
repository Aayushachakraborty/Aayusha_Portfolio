import RevealOnScroll from '../shared/RevealOnScroll';

export default function VideoCv({ video, reducedMotion }) {
  return (
    <section id="videocv">
      <div className="sec-label">Video CV</div>
      <div className="video-layout">
        <div>
          <RevealOnScroll as="h2" className="video-title" disabled={reducedMotion}>{video.heading}</RevealOnScroll>
          <RevealOnScroll as="p" className="video-copy" disabled={reducedMotion}>{video.description}</RevealOnScroll>
          <RevealOnScroll as="div" className="vc-tips" disabled={reducedMotion}>
            {video.tips?.map((tip) => <div className="vc-tip" key={tip}>{tip}</div>)}
          </RevealOnScroll>
        </div>
        <RevealOnScroll as="div" className="video-frame" disabled={reducedMotion}>
          <div className="video-thumb" />
          <div className="video-overlay">
            <div className="play-btn"><div className="play-triangle" /></div>
            <div className="video-label">{video.status}</div>
          </div>
          <div className="video-coming">Coming Soon</div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
