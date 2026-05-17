import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ProjectDemoPage from '../ProjectDemoPage';

export default function GameDemoScene({ profile }) {
  const { slug } = useParams();
  const navigate = useNavigate();
  const project = useMemo(() => profile.projects.items.find((item) => item.slug === slug), [profile.projects.items, slug]);

  return (
    <ProjectDemoPage
      project={project}
      navigate={navigate}
      meta={profile.meta}
    />
  );
}
