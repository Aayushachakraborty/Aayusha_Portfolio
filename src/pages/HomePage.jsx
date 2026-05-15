import Hero from '../components/sections/Hero';
import Manifesto from '../components/sections/Manifesto';
import Story from '../components/sections/Story';
import Work from '../components/sections/Work';
import Awards from '../components/sections/Awards';
import Skills from '../components/sections/Skills';
import VideoCv from '../components/sections/VideoCv';
import Contact from '../components/sections/Contact';
import { useDocumentMeta } from '../hooks/useDocumentMeta';

export default function HomePage({ profile, navigate, reducedMotion }) {
  const decorations = profile.decorations?.items || [];

  useDocumentMeta({
    title: profile.meta.title,
    description: profile.meta.description,
    ogImage: profile.meta.ogImage,
  });

  return (
    <main id="main-content">
      <Hero person={profile.person} ticker={profile.ticker} reducedMotion={reducedMotion} decorations={decorations.filter((item) => item.section === 'hero')} />
      <Manifesto manifesto={profile.manifesto} numbers={profile.numbers} reducedMotion={reducedMotion} />
      <Story experience={profile.experience} reducedMotion={reducedMotion} decorations={decorations.filter((item) => item.section === 'story')} />
      <Work projects={profile.projects} navigate={navigate} reducedMotion={reducedMotion} decorations={decorations.filter((item) => item.section === 'work')} />
      <Awards awards={profile.awards} reducedMotion={reducedMotion} decorations={decorations.filter((item) => item.section === 'awards')} />
      <Skills skills={profile.skills} reducedMotion={reducedMotion} decorations={decorations.filter((item) => item.section === 'skills')} />
      <VideoCv video={profile.video} reducedMotion={reducedMotion} />
      <Contact person={profile.person} decorations={decorations.filter((item) => item.section === 'contact')} />
    </main>
  );
}
