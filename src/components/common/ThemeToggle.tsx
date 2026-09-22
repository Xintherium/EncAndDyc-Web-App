import React from 'react';
import { Sun, Moon } from 'lucide-react';

interface ThemeToggleProps {
  isDark: boolean;
  onToggle: () => void;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ isDark, onToggle }) => {
  return (
    <button
      onClick={onToggle}
      aria-label="Toggle theme"
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="fixed top-4 left-4 z-50 p-2 sm:p-2.5 rounded-full bg-white/70 dark:bg-stone-900/70 hover:bg-white dark:hover:bg-stone-800 border border-stone-200/80 dark:border-stone-800/80 shadow-xs backdrop-blur-md transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer text-stone-700 dark:text-stone-300"
    >
      {isDark ? (
        <Sun className="w-4 h-4 text-amber-300 animate-fade-in" />
      ) : (
        <Moon className="w-4 h-4 text-violet-500 animate-fade-in" />
      )}
    </button>
  );
};
