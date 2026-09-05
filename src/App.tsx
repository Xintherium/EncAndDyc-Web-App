import React, { useState, useEffect } from 'react';
import { TabId } from './types/rsa';
import { Header } from './components/layout/Header';
import { HeroIntro } from './components/layout/HeroIntro';
import { Footer } from './components/layout/Footer';
import { RSAVisualizer } from './components/visualizer/RSAVisualizer';
import { HowItWorks } from './components/pages/HowItWorks';
import { Mathematics } from './components/pages/Mathematics';

export const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<TabId>('visualizer');
  const [isDark, setIsDark] = useState<boolean>(() => {
    const saved = localStorage.getItem('rsa_theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const [showHero, setShowHero] = useState<boolean>(true);
  const [resetKey, setResetKey] = useState<number>(0);

  // Sync dark class on document element
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('rsa_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('rsa_theme', 'light');
    }
  }, [isDark]);

  const handleToggleTheme = () => {
    setIsDark(prev => !prev);
  };

  const handleResetToDemo = () => {
    setCurrentTab('visualizer');
    setResetKey(prev => prev + 1);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 transition-colors duration-200">
      {/* App Header */}
      <Header
        currentTab={currentTab}
        onTabChange={(tab) => {
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        isDark={isDark}
        onToggleTheme={handleToggleTheme}
        onResetToDemo={handleResetToDemo}
      />

      {/* Main Container */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        {/* Hero Intro only displayed on visualizer tab or when active */}
        {showHero && currentTab === 'visualizer' && (
          <div className="relative">
            <HeroIntro
              onExplore={() => {
                const el = document.getElementById('visualizer-workspace');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              onLoadExample={handleResetToDemo}
            />
            <button
              onClick={() => setShowHero(false)}
              className="absolute top-3 right-3 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 px-2 py-1 rounded bg-white/60 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700"
              title="Dismiss Intro Banner"
            >
              ✕ Hide
            </button>
          </div>
        )}

        {/* Tab content router */}
        <div id="visualizer-workspace">
          {currentTab === 'visualizer' && <RSAVisualizer key={resetKey} />}
          {currentTab === 'how-it-works' && <HowItWorks />}
          {currentTab === 'mathematics' && <Mathematics />}
        </div>
      </div>

      {/* App Footer */}
      <Footer />
    </div>
  );
};

export default App;
