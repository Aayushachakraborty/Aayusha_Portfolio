import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import ErrorBoundary from './components/shared/ErrorBoundary';
import LoadingBadge from './components/shared/LoadingBadge';
import GameHud from './components/game/GameHud';
import NotFoundPage from './pages/NotFoundPage';
import { useProfile } from './hooks/useProfile';
import { useReducedMotion } from './hooks/useReducedMotion';
import { useGameStore } from './store/useGameStore';
import { getSceneIndex } from './utils/gameScenes';
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

function AnimatedRoutes({ profile, reducedMotion }) {
  const location = useLocation();
  const setScene = useGameStore((state) => state.setScene);

  useEffect(() => {
    setScene(getSceneIndex(location.pathname));
  }, [location.pathname, setScene]);

  return (
    <>
      <GameHud />
      <AnimatePresence mode="wait">
        <Suspense fallback={<div className="game-loader">Loading scene...</div>}>
          <Routes location={location} key={location.pathname}>
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
      </AnimatePresence>
    </>
  );
}

function AppShell() {
  const { profile, loading, error, source } = useProfile();
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const saved = 'dark';
    document.documentElement.setAttribute('data-theme', saved);
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
