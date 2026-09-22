import React from 'react';

export const AmbientBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 transition-colors duration-500">
      {/* Pastel Violet Floating Orb */}
      <div className="absolute -top-32 -left-32 w-96 h-96 sm:w-[32rem] sm:h-[32rem] bg-violet-200/40 dark:bg-violet-900/20 rounded-full blur-3xl animate-float-slow" />

      {/* Pastel Mint/Emerald Orb */}
      <div className="absolute top-1/3 -right-24 w-80 h-80 sm:w-[28rem] sm:h-[28rem] bg-emerald-200/35 dark:bg-emerald-900/15 rounded-full blur-3xl animate-float-slower" />

      {/* Pastel Amber/Peach Orb */}
      <div className="absolute -bottom-32 left-1/4 w-96 h-96 sm:w-[30rem] sm:h-[30rem] bg-amber-200/30 dark:bg-amber-900/15 rounded-full blur-3xl animate-float-slow" />

      {/* Subtle Grid Dot Texture */}
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#262626_1px,transparent_1px)] [background-size:24px_24px] opacity-40" />
    </div>
  );
};
