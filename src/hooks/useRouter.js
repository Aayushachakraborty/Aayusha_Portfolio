import { useCallback, useEffect, useMemo, useState } from 'react';
import { ROUTES } from '../utils/constants';

function parseRoute(pathname) {
  if (pathname === ROUTES.home) return { view: 'home', slug: '' };
  if (pathname.startsWith(ROUTES.project)) {
    const projectPath = pathname.slice(ROUTES.project.length).replace(/\/$/, '');
    if (!projectPath) return { view: 'notfound', slug: '' };
    if (projectPath.endsWith('/demo')) {
      const slug = projectPath.slice(0, -'/demo'.length);
      return slug ? { view: 'projectDemo', slug } : { view: 'notfound', slug: '' };
    }
    return { view: 'project', slug: projectPath };
  }
  return { view: 'notfound', slug: '' };
}

export function useRouter() {
  const [pathname, setPathname] = useState(() => window.location.pathname);

  useEffect(() => {
    const onPopState = () => setPathname(window.location.pathname);
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const navigate = useCallback((path) => {
    if (path === window.location.pathname) return;
    window.history.pushState({}, '', path);
    setPathname(path);
  }, []);

  return useMemo(() => ({ ...parseRoute(pathname), navigate, pathname }), [navigate, pathname]);
}
