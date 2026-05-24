import { NavLink, Outlet, Link } from 'react-router-dom';
import { MessageSquare, Scale, Gauge, ArrowLeft, Circle } from 'lucide-react';
import { cn } from '../../lib/utils.js';

const NAV = [
  { to: '/ask', label: 'Ask', icon: MessageSquare, hint: 'Compliance Q&A' },
  { to: '/decisions', label: 'Decisions', icon: Scale, hint: 'Credit underwriting' },
  { to: '/evals', label: 'Evals', icon: Gauge, hint: 'RAG quality dashboard' },
];

export default function AppShell() {
  return (
    <div className="min-h-screen bg-ink-950 text-ink-50 flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-ink-800 bg-ink-900 flex flex-col">
        {/* Brand */}
        <Link to="/" className="px-5 py-5 flex items-center gap-3 border-b border-ink-800 hover:bg-ink-800/40 transition-colors">
          <div className="w-8 h-8 rounded-md bg-ink-600 flex items-center justify-center font-display text-gold-500 font-semibold">
            L
          </div>
          <div>
            <div className="font-display font-medium text-[15px] leading-none">LoanLens</div>
            <div className="text-2xs text-ink-300 mt-1 tracking-wide uppercase">Compliance copilot</div>
          </div>
        </Link>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV.map(({ to, label, icon: Icon, hint }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                cn(
                  'flex items-start gap-3 px-3 py-2.5 rounded-md transition-colors group',
                  isActive
                    ? 'bg-ink-800 text-ink-50'
                    : 'text-ink-200 hover:bg-ink-800/50 hover:text-ink-50'
                )
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    size={16}
                    className={cn('mt-0.5 shrink-0', isActive ? 'text-gold-500' : 'text-ink-300 group-hover:text-ink-50')}
                  />
                  <div className="min-w-0">
                    <div className="text-sm font-medium leading-tight">{label}</div>
                    <div className="text-2xs text-ink-300 mt-0.5">{hint}</div>
                  </div>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Footer / officer chip */}
        <div className="border-t border-ink-800 p-4">
          <Link
            to="/"
            className="flex items-center gap-2 text-xs text-ink-300 hover:text-ink-50 transition-colors mb-3"
          >
            <ArrowLeft size={12} /> Back to overview
          </Link>
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-ink-700 flex items-center justify-center text-2xs font-medium text-ink-100">
              PM
            </div>
            <div className="min-w-0">
              <div className="text-xs font-medium leading-tight">Priya Menon</div>
              <div className="text-2xs text-ink-300 flex items-center gap-1.5 mt-0.5">
                <Circle size={6} className="fill-approve text-approve" />
                Officer · Live
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 min-w-0 overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  );
}
