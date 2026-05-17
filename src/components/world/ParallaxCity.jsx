import Building from './Building';
import Cloud from './Cloud';
import Lamppost from './Lamppost';

export default function ParallaxCity({ theme = 'sunrise', children }) {
  return (
    <div className={`parallax-city city-${theme}`}>
      <div className="sky-layer">
        <Cloud className="cloud-a" />
        <Cloud className="cloud-b" />
      </div>
      <div className="skyline skyline-back">
        <Building variant="medium" hue="violet" />
        <Building variant="skyscraper" hue="cyan" />
        <Building variant="short" hue="amber" />
        <Building variant="medium" hue="violet" />
        <Building variant="skyscraper" hue="cyan" />
      </div>
      <div className="skyline skyline-front">
        <Building variant="short" hue="cyan" />
        <Building variant="medium" hue="amber" />
        <Building variant="skyscraper" hue="violet" />
        <Building variant="medium" hue="cyan" />
        <Lamppost />
        <Building variant="short" hue="amber" />
      </div>
      {children}
      <div className="road">
        <span />
      </div>
    </div>
  );
}
