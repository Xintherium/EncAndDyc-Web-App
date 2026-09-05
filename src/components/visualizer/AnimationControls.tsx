import React from 'react';
import { Play, Pause, SkipForward, SkipBack, RotateCcw, Gauge } from 'lucide-react';

interface AnimationControlsProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
  onNext: () => void;
  onPrev: () => void;
  onRestart: () => void;
  speed: number;
  onSpeedChange: (speed: number) => void;
  canGoNext: boolean;
  canGoPrev: boolean;
}

export const AnimationControls: React.FC<AnimationControlsProps> = ({
  isPlaying,
  onTogglePlay,
  onNext,
  onPrev,
  onRestart,
  speed,
  onSpeedChange,
  canGoNext,
  canGoPrev,
}) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 p-3 sm:p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
      {/* Primary playback buttons */}
      <div className="flex items-center space-x-2">
        <button
          onClick={onRestart}
          title="Restart Visualization"
          className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        <button
          onClick={onPrev}
          disabled={!canGoPrev}
          title="Previous Step"
          className="flex items-center space-x-1 px-3 py-2 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 disabled:opacity-40 disabled:pointer-events-none transition-colors"
        >
          <SkipBack className="w-4 h-4" />
          <span className="hidden sm:inline">Back</span>
        </button>

        <button
          onClick={onTogglePlay}
          title={isPlaying ? 'Pause Animation' : 'Auto-Play Pipeline'}
          className={`flex items-center space-x-1.5 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold text-white shadow-sm transition-all ${
            isPlaying
              ? 'bg-amber-600 hover:bg-amber-700 shadow-amber-600/20'
              : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/20'
          }`}
        >
          {isPlaying ? (
            <>
              <Pause className="w-4 h-4 fill-current" />
              <span>Pause</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current" />
              <span>Auto Play</span>
            </>
          )}
        </button>

        <button
          onClick={onNext}
          disabled={!canGoNext}
          title="Next Step"
          className="flex items-center space-x-1 px-3 py-2 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 disabled:opacity-40 disabled:pointer-events-none transition-colors"
        >
          <span className="hidden sm:inline">Next</span>
          <SkipForward className="w-4 h-4" />
        </button>
      </div>

      {/* Speed control */}
      <div className="flex items-center space-x-1.5 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-lg border border-slate-200 dark:border-slate-750 text-xs">
        <Gauge className="w-3.5 h-3.5 text-slate-500 ml-1.5" />
        <span className="text-[11px] font-medium text-slate-500 mr-1 hidden sm:inline">Speed:</span>
        {[
          { label: '0.5x', value: 0.5 },
          { label: '1x', value: 1.0 },
          { label: '2x', value: 2.0 },
        ].map((s) => (
          <button
            key={s.label}
            onClick={() => onSpeedChange(s.value)}
            className={`px-2 py-1 rounded font-mono text-xs font-medium transition-all ${
              speed === s.value
                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>
    </div>
  );
};
