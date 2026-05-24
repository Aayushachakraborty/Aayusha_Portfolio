import { Routes, Route, Navigate } from 'react-router-dom';
import AppShell from './components/layout/AppShell.jsx';
import Landing from './pages/Landing.jsx';
import Ask from './pages/Ask.jsx';
import Decisions from './pages/Decisions.jsx';
import Evals from './pages/Evals.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route element={<AppShell />}>
        <Route path="/ask" element={<Ask />} />
        <Route path="/decisions" element={<Decisions />} />
        <Route path="/evals" element={<Evals />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
