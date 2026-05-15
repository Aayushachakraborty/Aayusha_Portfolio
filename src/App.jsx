import { useEffect } from 'react';
import Nav from './components/layout/Nav';
import Footer from './components/layout/Footer';
import Cursor from './components/shared/Cursor';
import ErrorBoundary from './components/shared/ErrorBoundary';
import LoadingBadge from './components/shared/LoadingBadge';
import HomePage from './pages/HomePage';
import ProjectPage from './pages/ProjectPage';
import ProjectDemoPage from './pages/ProjectDemoPage';
import NotFoundPage from './pages/NotFoundPage';
import { useProfile } from './hooks/useProfile';
import { useReducedMotion } from './hooks/useReducedMotion';
import { useRouter } from './hooks/useRouter';
import { slugify } from './utils/slug';
import './styles/print.css';

function AppShell() {
  const { profile, loading, error, source } = useProfile();
  const reducedMotion = useReducedMotion();
  const { view, slug, navigate } = useRouter();

  useEffect(() => {
    const saved = localStorage.getItem('theme') || 'dark';
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

  const selectedProject = profile.projects.items?.find((project) => project.slug === slug || slugify(project.title) === slug);

  return (
    <>
      <a href="#main-content" className="skip-link">Skip to content</a>
      <Cursor enabled={!reducedMotion} />
      <Nav person={profile.person} view={view} navigate={navigate} />
      <LoadingBadge loading={loading} source={source} error={error} />
      {view === 'project' && selectedProject ? (
        <ProjectPage project={selectedProject} navigate={navigate} meta={profile.meta} />
      ) : view === 'projectDemo' && selectedProject ? (
        <ProjectDemoPage project={selectedProject} navigate={navigate} meta={profile.meta} />
      ) : view === 'project' || view === 'projectDemo' || view === 'notfound' ? (
        <NotFoundPage navigate={navigate} meta={profile.meta} />
      ) : (
        <HomePage profile={profile} navigate={navigate} reducedMotion={reducedMotion} />
      )}
      <Footer person={profile.person} />
    </>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AppShell />
    </ErrorBoundary>
  );
}
