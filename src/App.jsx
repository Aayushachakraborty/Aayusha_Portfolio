import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { BrowserRouter, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import ErrorBoundary from './components/shared/ErrorBoundary';
import LoadingBadge from './components/shared/LoadingBadge';
import DoorIntro from './components/shared/DoorIntro';
import GameHud from './components/game/GameHud';
import NotFoundPage from './pages/NotFoundPage';
import { useProfile } from './hooks/useProfile';
import { useReducedMotion } from './hooks/useReducedMotion';
import { useGameStore } from './store/useGameStore';
import { getSceneIndex } from './utils/gameScenes';
import { startSceneAmbient, stopSceneAmbient } from './utils/gameAudio';
import './styles/print.css';

const BootScene = lazy(() => import('./pages/game/BootScene'));
const WorldEntryScene = lazy(() => import('./pages/game/WorldEntryScene'));
const AboutScene = lazy(() => import('./pages/game/AboutScene'));
const SkillsScene = lazy(() => import('./pages/game/SkillsScene'));
const ExperienceScene = lazy(() => import('./pages/game/ExperienceScene'));
const AirportScene = lazy(() => import('./pages/game/AirportScene'));
const ProjectFlightScene = lazy(() => import('./pages/game/ProjectFlightScene'));
const ContactScene = lazy(() => import('./pages/game/ContactScene'));
const ResumeScene = lazy(() => import('./pages/game/ResumeScene'));
const GameDemoScene = lazy(() => import('./pages/game/GameDemoScene'));
const SCROLL_WORLD_PATHS = ['/', '/world', '/about', '/skills', '/experience', '/airport', '/contact'];
const WORLD_CHAPTERS = [
  { path: '/', eyebrow: 'Entry', title: 'Data Miracles', tag: 'open the door' },
  { path: '/world', eyebrow: 'World 01', title: 'Drop In', tag: 'camera initialized' },
  { path: '/about', eyebrow: 'World 02', title: 'City Run', tag: 'meet the player' },
  { path: '/skills', eyebrow: 'World 03', title: 'Skills District', tag: 'unlock modules' },
  { path: '/experience', eyebrow: 'World 04', title: 'Mission Highway', tag: 'career timeline' },
  { path: '/airport', eyebrow: 'World 05', title: 'Project Airport', tag: 'choose a flight' },
  { path: '/contact', eyebrow: 'World 06', title: 'Home Base', tag: 'make contact' },
];
const GUIDE_LINES = {
  '/': ['Psst. The door opens into the data world.', 'Scroll when you are ready. I will guide you.'],
  '/world': ['Camera drop complete. Keep moving.', 'This is the portal between pages.'],
  '/about': ['City route unlocked. Meet the player behind the models.', 'The dossier has the origin story.'],
  '/skills': ['Tap neon signs to switch modules.', 'This district is where the tools glow.'],
  '/experience': ['Follow the highway. Each cloud is a mission log.', 'Work history, but make it playable.'],
  '/airport': ['Pick a flight to enter a project.', 'The departure board is the project selector.'],
  '/contact': ['Home base reached. Time to send a signal.', 'You made it through the world.'],
};

function getSceneAudioKey(pathname) {
  if (pathname.includes('/demo')) return 'demo';
  if (pathname.startsWith('/project/')) return 'project';
  if (pathname === '/world') return 'world';
  if (pathname === '/about') return 'about';
  if (pathname === '/skills') return 'skills';
  if (pathname === '/experience') return 'experience';
  if (pathname === '/airport') return 'airport';
  if (pathname === '/contact') return 'contact';
  if (pathname === '/resume') return 'resume';
  return '';
}

function getWorldScrollIndex(pathname) {
  return SCROLL_WORLD_PATHS.findIndex((path) => path === pathname);
}

function getWorldBackdropKey(pathname) {
  if (pathname === '/') return 'boot';
  return getSceneAudioKey(pathname) || 'free';
}

function DataGuideSticker({ chapter, pathname, reducedMotion }) {
  const [lineIndex, setLineIndex] = useState(0);
  const stickerRef = useRef(null);
  const lines = GUIDE_LINES[pathname] || ['Scroll to travel through the world.'];
  const line = lines[lineIndex % lines.length];

  useEffect(() => {
    setLineIndex(0);
  }, [pathname]);

  useEffect(() => {
    if (reducedMotion) return undefined;

    const onPointerMove = (event) => {
      if (!stickerRef.current) return;
      const x = (event.clientX / window.innerWidth - 0.5) * 18;
      const y = (event.clientY / window.innerHeight - 0.5) * 14;
      stickerRef.current.style.setProperty('--guide-x', `${x}px`);
      stickerRef.current.style.setProperty('--guide-y', `${y}px`);
    };

    window.addEventListener('pointermove', onPointerMove);
    return () => window.removeEventListener('pointermove', onPointerMove);
  }, [reducedMotion]);

  return (
    <button
      ref={stickerRef}
      className="data-guide-sticker"
      type="button"
      onClick={() => setLineIndex((index) => index + 1)}
      aria-label={`Data guide says: ${line}`}
    >
      <span className="guide-speech">
        <em>{chapter.eyebrow}</em>
        <strong>{line}</strong>
      </span>
      <span className="guide-avatar" aria-hidden="true">
        <svg viewBox="0 0 180 210" role="img">
          <defs>
            <linearGradient id="guideHair" x1="0" x2="1">
              <stop offset="0" stopColor="#1e1242" />
              <stop offset="1" stopColor="#07111f" />
            </linearGradient>
            <linearGradient id="guideDress" x1="0" x2="1">
              <stop offset="0" stopColor="#00d4ff" />
              <stop offset="1" stopColor="#7c5cff" />
            </linearGradient>
          </defs>
          <ellipse className="guide-shadow" cx="92" cy="193" rx="48" ry="9" />
          <path className="guide-hair-back" d="M45 72c0-34 22-55 52-55 34 0 55 23 54 59-1 34-14 58-8 91H45c8-30 0-59 0-95Z" />
          <path className="guide-arm guide-arm-left" d="M65 112c-16 6-27 19-34 38" />
          <path className="guide-arm guide-arm-right" d="M119 112c17 4 29 15 38 31" />
          <path className="guide-body" d="M58 178c4-41 15-70 34-70s33 29 38 70H58Z" />
          <path className="guide-jacket" d="M74 114c7 17 12 38 14 64M110 114c-7 18-11 39-13 64" />
          <circle className="guide-face" cx="96" cy="72" r="36" />
          <path className="guide-hair-front" d="M58 68c8-30 28-42 55-36 17 4 28 14 33 30-22 2-42-3-60-16-5 13-14 21-28 22Z" />
          <circle className="guide-eye" cx="83" cy="75" r="4" />
          <circle className="guide-eye" cx="110" cy="75" r="4" />
          <path className="guide-smile" d="M86 91c8 7 19 7 27 0" />
          <path className="guide-laptop" d="M54 151h76l14 34H68Z" />
          <path className="guide-laptop-glow" d="M74 166h48" />
          <path className="guide-spark spark-a" d="M39 45l5 10 10 5-10 5-5 10-5-10-10-5 10-5 5-10Z" />
          <path className="guide-spark spark-b" d="M148 24l3 7 7 3-7 3-3 7-3-7-7-3 7-3 3-7Z" />
        </svg>
      </span>
    </button>
  );
}

function ScrollWorldController({ reducedMotion }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [transitionDirection, setTransitionDirection] = useState('');
  const [compactScreen, setCompactScreen] = useState(false);
  const lastMoveRef = useRef(0);
  const touchStartRef = useRef(null);
  const scrollIndex = getWorldScrollIndex(location.pathname);
  const enabled = scrollIndex >= 0;
  const showWorldUi = enabled && !compactScreen;
  const backdropKey = getWorldBackdropKey(location.pathname);
  const activeChapter = WORLD_CHAPTERS[Math.max(scrollIndex, 0)] || WORLD_CHAPTERS[0];

  useEffect(() => {
    const query = window.matchMedia('(max-width: 768px)');
    const update = () => setCompactScreen(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    if (!enabled || compactScreen) return undefined;

    const goToScene = (direction) => {
      const now = window.performance.now();
      const nextIndex = scrollIndex + direction;
      if (nextIndex < 0 || nextIndex >= SCROLL_WORLD_PATHS.length) return false;
      if (now - lastMoveRef.current < 900) return true;

      lastMoveRef.current = now;
      setTransitionDirection(direction > 0 ? 'down' : 'up');
      navigate(SCROLL_WORLD_PATHS[nextIndex]);
      window.setTimeout(() => setTransitionDirection(''), 620);
      return true;
    };

    const onWheel = (event) => {
      if (event.ctrlKey || Math.abs(event.deltaY) < 26) return;
      if (goToScene(event.deltaY > 0 ? 1 : -1)) event.preventDefault();
    };

    const onTouchStart = (event) => {
      touchStartRef.current = event.touches[0]?.clientY ?? null;
    };

    const onTouchEnd = (event) => {
      if (touchStartRef.current === null) return;
      const endY = event.changedTouches[0]?.clientY ?? touchStartRef.current;
      const delta = touchStartRef.current - endY;
      touchStartRef.current = null;
      if (Math.abs(delta) < 44) return;
      if (goToScene(delta > 0 ? 1 : -1)) event.preventDefault();
    };

    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchend', onTouchEnd, { passive: false });

    return () => {
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, [compactScreen, enabled, navigate, scrollIndex]);

  return (
    <>
      <div className={`world-scroll-backdrop scene-${backdropKey} ${transitionDirection ? `is-moving-${transitionDirection}` : ''}`} aria-hidden="true" />
      {showWorldUi && (
        <>
          <aside className="world-chapter-rail" aria-label="World chapters">
            {WORLD_CHAPTERS.map((chapter, index) => (
              <button
                className={index === scrollIndex ? 'active' : ''}
                key={chapter.path}
                type="button"
                onClick={() => navigate(chapter.path)}
                aria-label={`Go to ${chapter.title}`}
              >
                <span>{String(index + 1).padStart(2, '0')}</span>
                <strong>{chapter.title}</strong>
              </button>
            ))}
          </aside>
          <div className="world-chapter-title" key={activeChapter.path} aria-hidden="true">
            <span>{activeChapter.eyebrow}</span>
            <strong>{activeChapter.title}</strong>
            <em>{activeChapter.tag}</em>
          </div>
          <div className="world-progress-ring" aria-hidden="true" style={{ '--progress': `${((scrollIndex + 1) / WORLD_CHAPTERS.length) * 360}deg` }}>
            <span>{String(scrollIndex + 1).padStart(2, '0')}</span>
          </div>
          <DataGuideSticker chapter={activeChapter} pathname={location.pathname} reducedMotion={reducedMotion} />
        </>
      )}
      {showWorldUi && !reducedMotion && (
        <div className="world-scroll-hint" aria-hidden="true">
          <span />
          <strong>{scrollIndex === SCROLL_WORLD_PATHS.length - 1 ? 'scroll up' : 'scroll'}</strong>
        </div>
      )}
    </>
  );
}

function AnimatedRoutes({ profile, reducedMotion }) {
  const location = useLocation();
  const setScene = useGameStore((state) => state.setScene);
  const isMuted = useGameStore((state) => state.isMuted);
  const previousSceneIndex = useRef(getSceneIndex(location.pathname));
  const currentSceneIndex = getSceneIndex(location.pathname);
  const slideDirection = currentSceneIndex >= previousSceneIndex.current ? 1 : -1;

  useEffect(() => {
    setScene(currentSceneIndex);
    previousSceneIndex.current = currentSceneIndex;
  }, [currentSceneIndex, setScene]);

  useEffect(() => {
    const sceneAudioKey = getSceneAudioKey(location.pathname);
    if (!sceneAudioKey) {
      stopSceneAmbient();
      return undefined;
    }
    startSceneAmbient(sceneAudioKey, isMuted);
    return undefined;
  }, [isMuted, location.pathname]);

  return (
    <>
      <GameHud />
      <AnimatePresence mode="wait" initial={false} custom={slideDirection}>
        <motion.div
          className="route-slide"
          key={location.pathname}
          custom={slideDirection}
          initial={reducedMotion ? { opacity: 0 } : { opacity: 0, x: `${slideDirection * 18}vw` }}
          animate={reducedMotion ? { opacity: 1 } : { opacity: 1, x: 0 }}
          exit={reducedMotion ? { opacity: 0 } : { opacity: 0, x: `${slideDirection * -18}vw` }}
          transition={{ duration: reducedMotion ? 0.18 : 0.52, ease: [0.16, 1, 0.3, 1] }}
        >
          <Suspense fallback={<div className="game-loader">Loading scene...</div>}>
            <Routes location={location}>
              <Route path="/" element={<BootScene profile={profile} />} />
              <Route path="/world" element={<WorldEntryScene />} />
              <Route path="/about" element={<AboutScene profile={profile} reducedMotion={reducedMotion} />} />
              <Route path="/skills" element={<SkillsScene profile={profile} />} />
              <Route path="/experience" element={<ExperienceScene profile={profile} />} />
              <Route path="/airport" element={<AirportScene profile={profile} />} />
              <Route path="/project/:slug" element={<ProjectFlightScene profile={profile} />} />
              <Route path="/project/:slug/demo" element={<GameDemoScene profile={profile} />} />
              <Route path="/contact" element={<ContactScene profile={profile} />} />
              <Route path="/resume" element={<ResumeScene profile={profile} reducedMotion={reducedMotion} />} />
              <Route path="*" element={<NotFoundPage navigate={() => {}} meta={profile.meta} />} />
            </Routes>
          </Suspense>
        </motion.div>
      </AnimatePresence>
    </>
  );
}

function AppShell() {
  const { profile, loading, error, source } = useProfile();
  const reducedMotion = useReducedMotion();
  const location = useLocation();

  useEffect(() => {
    const saved = localStorage.getItem('theme');
    const systemTheme = window.matchMedia?.('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    const theme = saved || systemTheme;
    document.documentElement.setAttribute('data-theme', theme);
    if (!saved) localStorage.setItem('theme', theme);
  }, []);

  useEffect(() => {
    document.body.classList.toggle('reduced-motion', reducedMotion);
    return () => document.body.classList.remove('reduced-motion');
  }, [reducedMotion]);

  useEffect(() => {
    const scriptId = 'person-jsonld';
    let script = document.getElementById(scriptId);
    if (!script) {
      script = document.createElement('script');
      script.type = 'application/ld+json';
      script.id = scriptId;
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(profile.meta.jsonLd);
  }, [profile.meta.jsonLd]);

  return (
    <>
      <a href="#main-content" className="skip-link">Skip to content</a>
      <LoadingBadge loading={loading} source={source} error={error} />
      <ScrollWorldController reducedMotion={reducedMotion} />
      {location.pathname === '/' && <DoorIntro reducedMotion={reducedMotion} />}
      <AnimatedRoutes profile={profile} reducedMotion={reducedMotion} />
    </>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AppShell />
      </BrowserRouter>
    </ErrorBoundary>
  );
}
