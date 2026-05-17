import { useTheme } from '../../hooks/useTheme';

export default function ThemeToggle() {
  const { theme, toggle } = useTheme();

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggle}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
    >
      <span className="theme-icon">{theme === 'dark' ? 'LIGHT' : 'DARK'}</span>
    </button>
  );
}
