import HomePage from '../HomePage';
import Nav from '../../components/layout/Nav';
import Footer from '../../components/layout/Footer';
import { useNavigate } from 'react-router-dom';

export default function ResumeScene({ profile, reducedMotion }) {
  const navigate = useNavigate();

  return (
    <>
      <Nav person={profile.person} view="home" navigate={navigate} />
      <HomePage profile={profile} navigate={navigate} reducedMotion={reducedMotion} />
      <Footer person={profile.person} />
    </>
  );
}
