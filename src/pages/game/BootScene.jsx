import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Volume2, VolumeX } from 'lucide-react';
import SceneFrame from '../../components/game/SceneFrame';
import { useGameStore } from '../../store/useGameStore';
import {
  playFrontEnter,
  playFrontHover,
  startFrontAmbient,
  stopFrontAmbient,
} from '../../utils/gameAudio';

const scrambleChars = '!<>-_/[]{}=+*^?#________ABCDEF0123456789';
const orbitalTags = [
  ['forecasting', 30, 285, 'cyan'],
  ['supply chains', 80, 330, 'violet'],
  ['reinforcement learning', 132, 292, 'pink'],
  ['anomaly detection', 184, 334, 'amber'],
  ['mlops', 236, 286, 'cyan'],
  ['time series', 288, 326, 'violet'],
  ['decision intelligence', 338, 300, 'pink'],
];
const constellationStops = [
  ['now', null, 10, 62],
  ['the city', '/about', 26, 54],
  ['skills', '/skills', 42, 59],
  ['the highway', '/experience', 58, 48],
  ['the gate', '/airport', 75, 55],
  ['home', '/contact', 91, 42],
];
const questChapters = [
  ['the city', 'meet the person behind the models'],
  ['skills district', 'walk past the tools and systems'],
  ['the highway', 'follow the work from 2021 to now'],
  ['the gate', 'board four project missions'],
];

function useReducedMotionQuery() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  return reduced;
}

function useCompactScreen() {
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    const query = window.matchMedia('(max-width: 768px)');
    const update = () => setCompact(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  return compact;
}

function useDecodedText(finalText, delay, duration, reducedMotion) {
  const [text, setText] = useState(reducedMotion ? finalText : '');

  useEffect(() => {
    if (reducedMotion) {
      setText(finalText);
      return undefined;
    }

    let frame = 0;
    let startTime = 0;
    let delayId;

    const tick = (now) => {
      if (!startTime) startTime = now;
      const progress = Math.min(1, (now - startTime) / duration);
      const locked = Math.floor(progress * finalText.length);

      if (frame % 4 === 0) {
        setText(finalText.split('').map((char, index) => {
          if (index < locked || char === ' ') return char;
          return scrambleChars[Math.floor(Math.random() * scrambleChars.length)];
        }).join(''));
      }

      frame += 1;
      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        setText(finalText);
      }
    };

    delayId = window.setTimeout(() => requestAnimationFrame(tick), delay);
    return () => window.clearTimeout(delayId);
  }, [delay, duration, finalText, reducedMotion]);

  return text;
}

function CodeRainCanvas({ reducedMotion }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (reducedMotion) return undefined;
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext('2d');
    if (!ctx) return undefined;
    const pool = 'ABCDEF0123456789{}<>[]/\\|+=:; python def model fit train sklearn torch mlflow ARIMA RL ';
    let drops = [];
    let columns = 0;
    let hidden = document.hidden;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.25);
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      columns = Math.floor(window.innerWidth / 18);
      drops = Array.from({ length: columns }, () => Math.random() * window.innerHeight / 14);
    };

    const draw = () => {
      if (hidden) return;
      ctx.fillStyle = 'rgba(5, 5, 16, 0.08)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#00d4ff';
      ctx.font = '14px "JetBrains Mono", monospace';
      for (let i = 0; i < columns; i += 1) {
        const char = pool[Math.floor(Math.random() * pool.length)];
        ctx.fillText(char, i * 14, drops[i] * 14);
        drops[i] += 1;
        if (drops[i] * 14 > canvas.height && Math.random() > 0.975) drops[i] = 0;
      }
    };

    const onVisibility = () => { hidden = document.hidden; };
    resize();
    const id = window.setInterval(draw, 90);
    window.addEventListener('resize', resize);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      window.clearInterval(id);
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [reducedMotion]);

  return <canvas ref={canvasRef} className="code-rain-canvas" aria-hidden="true" />;
}

function NeuralCanvas({ mouseRef, reducedMotion }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (reducedMotion) return undefined;
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext('2d');
    if (!ctx) return undefined;
    let particles = [];
    let raf = 0;
    let hidden = document.hidden;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.25);
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.min(52, Math.floor(window.innerWidth / 28));
      particles = Array.from({ length: Math.max(30, count) }, () => ({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: Math.random() * 0.8 - 0.4,
        vy: Math.random() * 0.8 - 0.4,
      }));
    };

    const draw = () => {
      if (!hidden) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const mouse = mouseRef.current;
        particles.forEach((p) => {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const distance = Math.hypot(dx, dy);
          if (distance < 200 && distance > 1) {
            p.vx += (dx / distance) * 0.015;
            p.vy += (dy / distance) * 0.015;
          }
          p.x += p.vx;
          p.y += p.vy;
          p.vx *= 0.992;
          p.vy *= 0.992;
          if (p.x < 0 || p.x > window.innerWidth) p.vx *= -1;
          if (p.y < 0 || p.y > window.innerHeight) p.vy *= -1;
        });

        for (let i = 0; i < particles.length; i += 1) {
          for (let j = i + 1; j < particles.length; j += 1) {
            const a = particles[i];
            const b = particles[j];
            const distance = Math.hypot(a.x - b.x, a.y - b.y);
            if (distance < 140) {
              ctx.strokeStyle = `rgba(0, 212, 255, ${(1 - distance / 140) * 0.5})`;
              ctx.lineWidth = 1;
              ctx.beginPath();
              ctx.moveTo(a.x, a.y);
              ctx.lineTo(b.x, b.y);
              ctx.stroke();
            }
          }
        }

        particles.forEach((p) => {
          const distance = Math.hypot(mouse.x - p.x, mouse.y - p.y);
          ctx.shadowColor = '#00d4ff';
          ctx.shadowBlur = distance < 150 ? 8 : 2;
          ctx.fillStyle = distance < 150 ? '#b9f5ff' : '#00d4ff';
          ctx.beginPath();
          ctx.arc(p.x, p.y, distance < 150 ? 2.4 : 1.7, 0, Math.PI * 2);
          ctx.fill();
        });
        ctx.shadowBlur = 0;
      }
      raf = requestAnimationFrame(draw);
    };

    const onVisibility = () => { hidden = document.hidden; };
    resize();
    raf = requestAnimationFrame(draw);
    window.addEventListener('resize', resize);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [mouseRef, reducedMotion]);

  return <canvas ref={canvasRef} className="neural-canvas" aria-hidden="true" />;
}

function Constellation({ onJump, onHover }) {
  return (
    <nav className="boot-constellation" aria-label="Quiet scene shortcuts">
      <svg viewBox="0 0 100 68" preserveAspectRatio="none" aria-hidden="true">
        <polyline points={constellationStops.map(([, , x, y]) => `${x},${y}`).join(' ')} />
      </svg>
      {constellationStops.map(([label, path, x, y], index) => (
        <button
          className={index === 0 ? 'is-active' : ''}
          key={label}
          type="button"
          aria-label={`Skip to: ${label}`}
          onClick={() => onJump(path)}
          onMouseEnter={onHover}
          onFocus={onHover}
          style={{ left: `${x}%`, top: `${y}%` }}
        >
          <span>{label}</span>
        </button>
      ))}
    </nav>
  );
}

export default function BootScene({ profile }) {
  const navigate = useNavigate();
  const reducedMotion = useReducedMotionQuery();
  const compactScreen = useCompactScreen();
  const simplifiedMotion = reducedMotion || compactScreen;
  const start = useGameStore((state) => state.start);
  const isMuted = useGameStore((state) => state.isMuted);
  const setMuted = useGameStore((state) => state.setMuted);
  const [debugEnabled] = useState(() => new URLSearchParams(window.location.search).get('debug') === '1');
  const [fps, setFps] = useState(60);
  const [nearStart, setNearStart] = useState(false);
  const mouseRef = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const tiltRef = useRef(null);
  const buttonRef = useRef(null);
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const startedRef = useRef(false);
  const nearStartRef = useRef(false);
  const lastChimeRef = useRef(0);
  const firstName = useDecodedText('AAYUSHA', 400, 1100, simplifiedMotion);
  const lastName = useDecodedText('CHAKRABORTY', 700, 1400, simplifiedMotion);

  useEffect(() => {
    if (window.localStorage.getItem('aayusha.sound') === 'on') {
      setMuted(false);
      startFrontAmbient();
    }

    return () => stopFrontAmbient();
  }, [setMuted]);

  useEffect(() => {
    const onKey = (event) => {
      if (event.code === 'Space') {
        event.preventDefault();
        handleStart();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isMuted]);

  useEffect(() => {
    let ringX = mouseRef.current.x;
    let ringY = mouseRef.current.y;
    let buttonX = 0;
    let buttonY = 0;
    let tiltX = 0;
    let tiltY = 0;
    let frames = 0;
    let lastFps = performance.now();
    let raf = 0;

    const loop = (now) => {
      frames += 1;
      if (debugEnabled && now - lastFps >= 1000) {
        setFps(Math.round((frames * 1000) / (now - lastFps)));
        frames = 0;
        lastFps = now;
      }

      const mouse = mouseRef.current;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mouse.x}px, ${mouse.y}px, 0)`;
      }
      ringX += (mouse.x - ringX) * 0.18;
      ringY += (mouse.y - ringY) * 0.18;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
      }

      if (!simplifiedMotion && tiltRef.current) {
        const targetX = ((mouse.y - window.innerHeight / 2) / (window.innerHeight / 2)) * -6;
        const targetY = ((mouse.x - window.innerWidth / 2) / (window.innerWidth / 2)) * 6;
        tiltX += (targetX - tiltX) * 0.08;
        tiltY += (targetY - tiltY) * 0.08;
        tiltRef.current.style.transform = `perspective(1200px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
      }

      if (buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = mouse.x - cx;
        const dy = mouse.y - cy;
        const distance = Math.hypot(dx, dy);
        const targetX = distance < 160 && !simplifiedMotion ? dx * 0.3 : 0;
        const targetY = distance < 160 && !simplifiedMotion ? dy * 0.3 : 0;
        buttonX += (targetX - buttonX) * 0.15;
        buttonY += (targetY - buttonY) * 0.15;
        buttonRef.current.style.transform = `translate3d(${buttonX}px, ${buttonY}px, 0)`;
        const nextNearStart = distance < 160;
        if (nextNearStart !== nearStartRef.current) {
          nearStartRef.current = nextNearStart;
          setNearStart(nextNearStart);
          if (nextNearStart) playHoverChime();
        }
      }

      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [debugEnabled, isMuted, simplifiedMotion]);

  useEffect(() => {
    const onMove = (event) => {
      const x = event.clientX;
      const y = event.clientY;
      mouseRef.current = { x, y };
      document.documentElement.style.setProperty('--mx', `${(x / window.innerWidth) * 100}%`);
      document.documentElement.style.setProperty('--my', `${(y / window.innerHeight) * 100}%`);

      if (!simplifiedMotion && window.innerWidth >= 768 && Math.random() < 0.14) {
        const particle = document.createElement('span');
        particle.className = 'cursor-trail-particle';
        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;
        particle.style.setProperty('--tx', `${Math.random() * 28 - 14}px`);
        particle.style.setProperty('--ty', `${Math.random() * 28 - 14}px`);
        document.body.appendChild(particle);
        window.setTimeout(() => particle.remove(), 820);
      }
    };

    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, [simplifiedMotion]);

  function playHoverChime() {
    const now = performance.now();
    if (now - lastChimeRef.current < 200) return;
    lastChimeRef.current = now;
    playFrontHover(isMuted);
  }

  function handleSoundToggle() {
    playHoverChime();
    if (isMuted) {
      setMuted(false);
      window.localStorage.setItem('aayusha.sound', 'on');
      startFrontAmbient();
      window.setTimeout(() => playFrontHover(false), 80);
    } else {
      setMuted(true);
      window.localStorage.setItem('aayusha.sound', 'off');
      stopFrontAmbient();
    }
  }

  function transitionTo(path) {
    if (startedRef.current) return;
    startedRef.current = true;
    playFrontEnter(isMuted);
    stopFrontAmbient();
    if (buttonRef.current) buttonRef.current.classList.add('start-exit');
    start();
    document.body.classList.add('screen-flash');
    window.setTimeout(() => {
      navigate(path);
      window.setTimeout(() => document.body.classList.remove('screen-flash'), 120);
    }, 260);
  }

  function handleStart() {
    transitionTo('/world');
  }

  function handleJourneyJump(path) {
    if (!path) return;
    transitionTo(path);
  }

  return (
    <SceneFrame className={`boot-scene boot-v2 ${nearStart ? 'cursor-near-start' : ''}`}>
      <CodeRainCanvas reducedMotion={simplifiedMotion} />
      <NeuralCanvas mouseRef={mouseRef} reducedMotion={simplifiedMotion} />
      <div className="boot-v2-grid" aria-hidden="true" />
      <div className="boot-v2-radial" aria-hidden="true" />
      <div className="boot-v2-scan" aria-hidden="true" />
      <div className="boot-v2-vignette" aria-hidden="true" />

      <div className="boot-minimal-mark">
        <span className="pulse-dot" aria-hidden="true" />
        <span>aayusha · 2026</span>
      </div>
      <div className="boot-minimal-actions" role="navigation" aria-label="front page controls">
        <button className={isMuted ? '' : 'sound-on'} type="button" onClick={handleSoundToggle} onMouseEnter={playHoverChime} onFocus={playHoverChime}>
          {isMuted ? <VolumeX aria-hidden="true" /> : <Volume2 aria-hidden="true" />}
          <span>{isMuted ? 'sound on' : 'sound off'}</span>
        </button>
        <span aria-hidden="true" />
        <Link to="/resume" onMouseEnter={playHoverChime} onFocus={playHoverChime}>skip</Link>
      </div>
      {debugEnabled && <div className="boot-debug-fps">fps {fps}</div>}

      <section className="boot-v2-stage" ref={tiltRef}>
        <p className="boot-whisper top">hey, welcome to aayusha&apos;s world.</p>
        <div className="orbital-tags" aria-hidden="true">
          {orbitalTags.map(([tag, angle, distance, color], index) => (
            <span
              key={tag}
              className={`orbital-tag tag-${color}`}
              style={{
                '--angle': `${angle}deg`,
                '--distance': `${distance}px`,
                '--delay': `${1800 + index * 80}ms`,
              }}
              onMouseEnter={playHoverChime}
            >
              {tag}
            </span>
          ))}
        </div>
        <h1 className="decoder-name" aria-label={profile.person.name} data-text={profile.person.name}>
          <span aria-hidden="true">{firstName}</span>
          <span aria-hidden="true">{lastName}</span>
        </h1>
        <p className="boot-v2-subtitle">a small quest through data, decisions, and systems that learned to move.</p>
        <div className="quest-prologue" aria-label="What is inside this portfolio journey">
          <p>inside the world: a city, a skills district, a long road, and four missions waiting at the gate.</p>
          <ul>
            {questChapters.map(([place, hint]) => (
              <li key={place} onMouseEnter={playHoverChime}>
                <strong>{place}</strong>
                <span>{hint}</span>
              </li>
            ))}
          </ul>
        </div>
        <button
          ref={buttonRef}
          className="enter-world-button"
          type="button"
          onClick={handleStart}
          onMouseEnter={playHoverChime}
          onFocus={playHoverChime}
          aria-label="Enter the portfolio experience"
        >
          <span aria-hidden="true">start the quest</span>
          <i className="corner-a" aria-hidden="true" />
          <i className="corner-b" aria-hidden="true" />
        </button>
        <p className="boot-whisper bottom">press [space] or click to begin · skip anytime</p>
      </section>

      <Constellation onJump={handleJourneyJump} onHover={playHoverChime} />

      <div className="audio-bars" aria-hidden="true">
        {Array.from({ length: 60 }).map((_, index) => (
          <span
            key={index}
            style={{
              '--h': `${10 + (index * 17) % 31}px`,
              '--d': `${(index % 8) * 0.1}s`,
              '--dur': `${0.6 + (index % 7) * 0.1}s`,
            }}
          />
        ))}
      </div>

      <div className="cursor-dot-v2" ref={dotRef} aria-hidden="true" />
      <div className="cursor-ring-v2" ref={ringRef} aria-hidden="true" />
    </SceneFrame>
  );
}
