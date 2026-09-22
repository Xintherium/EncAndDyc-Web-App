import React, { useState, useEffect } from 'react';
import { HeroScreen } from './components/screens/HeroScreen';
import { PromptFlow } from './components/screens/PromptFlow';
import { CustomCursor } from './components/common/CustomCursor';
import { AmbientBackground } from './components/common/AmbientBackground';
import { ThemeToggle } from './components/common/ThemeToggle';

export const App: React.FC = () => {
  const [screen, setScreen] = useState<'hero' | 'flow'>('hero');

  // Dark mode state with localStorage persistence
  const [isDark, setIsDark] = useState<boolean>(() => {
    const saved = localStorage.getItem('rsa_theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('rsa_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('rsa_theme', 'light');
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark(prev => !prev);

  return (
    <div className="relative min-h-screen bg-stone-50 text-stone-900 dark:bg-stone-950 dark:text-stone-100 transition-colors duration-500 overflow-x-hidden">
      {/* Immersive Floating Background Mesh */}
      <AmbientBackground />

      {/* Smooth Ambient Custom Cursor */}
      <CustomCursor />

      {/* Small Dark Mode Toggle in the Top Left Corner */}
      <ThemeToggle isDark={isDark} onToggle={toggleTheme} />

      {/* Active Screen View */}
      {screen === 'hero' ? (
        <HeroScreen onStart={() => setScreen('flow')} />
      ) : (
        <PromptFlow onBackToHome={() => setScreen('hero')} />
      )}
    </div>
  );
};

export default App;
