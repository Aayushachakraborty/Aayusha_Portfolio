import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SceneFrame from '../../components/game/SceneFrame';
import { useGameStore } from '../../store/useGameStore';
import { playStartSound, playUiChime } from '../../utils/gameAudio';

const scrambleChars = '!<>-_/[]{}=+*^?#________ABCDEF0123456789';
const terminalLines = [
  '> initializing portfolio.exe...',
  '> loading neural_layers [OK]',
  '> mlflow_server: CONNECTED',
  '> forecasting_engine: CALIBRATED',
  '> 4yr xp [VERIFIED]',
  '> 12 models [DEPLOYED]',
  '> awaiting recruiter input_',
];
const orbitalTags = [
  ['PyTorch', 30, 310, 'cyan'],
  ['MLflow', 60, 355, 'violet'],
  ['Forecasting', 90, 285, 'pink'],
  ['FastAPI', 120, 340, 'amber'],
  ['Recharts', 150, 300, 'cyan'],
  ['Reinforcement Learning', 210, 370, 'violet'],
  ['Python', 240, 300, 'pink'],
  ['SQL', 270, 350, 'amber'],
  ['Anomaly Detection', 330, 320, 'cyan'],
];
const stats = [
  { value: 4, suffix: '', label: 'YEARS XP' },
  { value: 12, suffix: '', label: 'MODELS SHIPPED' },
  { value: 2400000, suffix: '', label: 'SKUs FORECASTED' },
  { value: 23, suffix: '%', label: 'STOCKOUT DOWN' },
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

function useCounter(target, delay, duration, reducedMotion) {
  const [value, setValue] = useState(reducedMotion ? target : 0);

  useEffect(() => {
    if (reducedMotion) {
      setValue(target);
      return undefined;
    }

    let startTime = 0;
    let raf = 0;
    const easeOut = (t) => 1 - Math.pow(1 - t, 3);
    const delayId = window.setTimeout(() => {
      const tick = (now) => {
        if (!startTime) startTime = now;
        const progress = Math.min(1, (now - startTime) / duration);
        setValue(Math.round(target * easeOut(progress)));
        if (progress < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }, delay);

    return () => {
      window.clearTimeout(delayId);
      cancelAnimationFrame(raf);
    };
  }, [delay, duration, reducedMotion, target]);

  return value;
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

function StatCounter({ stat, reducedMotion }) {
  const value = useCounter(stat.value, 2000, 1800, reducedMotion);
  const formatted = value > 10000 ? value.toLocaleString('en-IN') : value.toString();
  return (
    <div className="boot-v2-stat">
      <strong>{formatted}{stat.suffix}</strong>
      <span>{stat.label}</span>
    </div>
  );
}

function renderTerminalLine(line) {
  const highlighted = ['[OK]', 'CONNECTED', 'CALIBRATED', '[VERIFIED]', '[DEPLOYED]'];
  const match = highlighted.find((token) => line.includes(token));
  if (!match) return line;
  const [before, after] = line.split(match);
  return (
    <>
      {before}<span>{match}</span>{after}
    </>
  );
}

export default function BootScene({ profile }) {
  const navigate = useNavigate();
  const reducedMotion = useReducedMotionQuery();
  const start = useGameStore((state) => state.start);
  const toggleMute = useGameStore((state) => state.toggleMute);
  const isMuted = useGameStore((state) => state.isMuted);
  const [terminalCount, setTerminalCount] = useState(0);
  const [mouseHud, setMouseHud] = useState({ x: 0, y: 0 });
  const [clock, setClock] = useState('');
  const [fps, setFps] = useState(60);
  const [nearStart, setNearStart] = useState(false);
  const mouseRef = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const tiltRef = useRef(null);
  const buttonRef = useRef(null);
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const startedRef = useRef(false);
  const mouseHudRef = useRef({ x: 0, y: 0 });
  const nearStartRef = useRef(false);
  const firstName = useDecodedText('AAYUSHA', 400, 1100, reducedMotion);
  const lastName = useDecodedText('CHAKRABORTY', 700, 1400, reducedMotion);
  const build = useMemo(() => 'PORTFOLIO_V4.0.7', []);

  useEffect(() => {
    const tick = () => {
      setClock(new Intl.DateTimeFormat('en-IN', {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }).format(new Date()));
    };
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    setTerminalCount(0);
    const startId = window.setTimeout(() => {
      const id = window.setInterval(() => {
        setTerminalCount((count) => {
          if (count >= terminalLines.length) {
            window.clearInterval(id);
            return count;
          }
          return count + 1;
        });
      }, 350);
    }, 2600);
    return () => window.clearTimeout(startId);
  }, []);

  useEffect(() => {
    const onKey = (event) => {
      if (event.code === 'Space') {
        event.preventDefault();
        handleStart();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

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
      if (now - lastFps >= 1000) {
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

      if (!reducedMotion && tiltRef.current) {
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
        const targetX = distance < 160 && !reducedMotion ? dx * 0.3 : 0;
        const targetY = distance < 160 && !reducedMotion ? dy * 0.3 : 0;
        buttonX += (targetX - buttonX) * 0.15;
        buttonY += (targetY - buttonY) * 0.15;
        buttonRef.current.style.transform = `translate3d(${buttonX}px, ${buttonY}px, 0)`;
        const nextNearStart = distance < 160;
        if (nextNearStart !== nearStartRef.current) {
          nearStartRef.current = nextNearStart;
          setNearStart(nextNearStart);
          if (nextNearStart) playUiChime(isMuted);
        }
      }

      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [isMuted, reducedMotion]);

  useEffect(() => {
    const onMove = (event) => {
      const x = event.clientX;
      const y = event.clientY;
      mouseRef.current = { x, y };
      mouseHudRef.current = { x: Math.round(x), y: Math.round(y) };
      document.documentElement.style.setProperty('--mx', `${(x / window.innerWidth) * 100}%`);
      document.documentElement.style.setProperty('--my', `${(y / window.innerHeight) * 100}%`);

      if (!reducedMotion && window.innerWidth >= 768 && Math.random() < 0.14) {
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
  }, [reducedMotion]);

  useEffect(() => {
    const id = window.setInterval(() => setMouseHud(mouseHudRef.current), 120);
    return () => window.clearInterval(id);
  }, []);

  function handleStart() {
    if (startedRef.current) return;
    startedRef.current = true;
    playStartSound(isMuted);
    if (buttonRef.current) buttonRef.current.classList.add('start-exit');
    start();
    document.body.classList.add('screen-flash');
    window.setTimeout(() => {
      navigate('/world');
      window.setTimeout(() => document.body.classList.remove('screen-flash'), 120);
    }, 260);
  }

  return (
    <SceneFrame className={`boot-scene boot-v2 ${nearStart ? 'cursor-near-start' : ''}`}>
      <CodeRainCanvas reducedMotion={reducedMotion} />
      <NeuralCanvas mouseRef={mouseRef} reducedMotion={reducedMotion} />
      <div className="boot-v2-grid" aria-hidden="true" />
      <div className="boot-v2-radial" aria-hidden="true" />
      <div className="boot-v2-scan" aria-hidden="true" />
      <div className="boot-v2-vignette" aria-hidden="true" />

      <div className="boot-corner-hud top-left">
        <p>// SYSTEM <span><i /> ONLINE</span></p>
        <p>// SESSION <strong>{build}</strong></p>
      </div>
      <div className="boot-corner-hud top-right">
        <p>LOCAL TIME // <strong>{clock}</strong></p>
        <p>COORDS // <strong>28.61N - 77.21E</strong></p>
        <Link to="/resume">[SKIP TO RESUME]</Link>
      </div>
      <div className="boot-corner-hud bottom-left">
        <p>// MOUSE <strong>[ {mouseHud.x}, {mouseHud.y} ]</strong></p>
      </div>
      <div className="boot-corner-hud bottom-right">
        <p>FPS // <strong>{fps}</strong></p>
        <button type="button" onClick={toggleMute}>SFX // <strong>{isMuted ? 'MUTE' : 'ON'}</strong></button>
      </div>

      <div className="boot-terminal-v2" aria-live="polite">
        {terminalLines.slice(0, terminalCount).map((line) => (
          <p key={line}>{renderTerminalLine(line)}</p>
        ))}
      </div>

      <div className="boot-side-stats" aria-hidden="true">
        {[
          ['ML_FORECASTING', 95],
          ['MLOPS', 85],
          ['RL_AGENTS', 78],
          ['ANOMALY_DET', 88],
        ].map(([label, value]) => (
          <p key={label}><span>{label}</span><i><b style={{ width: `${value}%` }} /></i></p>
        ))}
      </div>

      <section className="boot-v2-stage" ref={tiltRef}>
        <p className="boot-profile-pill">// PLAYER_PROFILE.LOADED</p>
        <div className="orbital-tags" aria-hidden="true">
          {orbitalTags.map(([tag, angle, distance, color], index) => (
            <span
              key={tag}
              className={`orbital-tag tag-${color}`}
              style={{
                '--angle': `${angle}deg`,
                '--distance': `${distance}px`,
                '--delay': `${2400 + index * 80}ms`,
              }}
            >
              {tag}
            </span>
          ))}
        </div>
        <h1 className="decoder-name" aria-label={profile.person.name} data-text={profile.person.name}>
          <span aria-hidden="true">{firstName}</span>
          <span aria-hidden="true">{lastName}</span>
        </h1>
        <p className="boot-v2-subtitle">data_scientist.exe - supply chain x e-commerce x production ML</p>
        <div className="boot-v2-stats">
          {stats.map((stat) => <StatCounter key={stat.label} stat={stat} reducedMotion={reducedMotion} />)}
        </div>
        <button
          ref={buttonRef}
          className="press-start press-start-v2"
          type="button"
          onClick={handleStart}
          aria-label="Begin portfolio quest"
        >
          <span aria-hidden="true">PRESS START</span>
          <i className="corner-a" aria-hidden="true" />
          <i className="corner-b" aria-hidden="true" />
        </button>
      </section>

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
