import React, { useState } from 'react';
import { HeroScreen } from './components/screens/HeroScreen';
import { PromptFlow } from './components/screens/PromptFlow';

export const App: React.FC = () => {
  const [screen, setScreen] = useState<'hero' | 'flow'>('hero');

  if (screen === 'hero') {
    return <HeroScreen onStart={() => setScreen('flow')} />;
  }

  return <PromptFlow onBackToHome={() => setScreen('hero')} />;
};

export default App;
