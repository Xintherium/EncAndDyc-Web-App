import React, { useEffect, useState } from 'react';

export const CustomCursor: React.FC = () => {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [trailingPos, setTrailingPos] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if device has fine pointer (mouse)
    if (!window.matchMedia('(pointer: fine)').matches) return;

    let animationFrameId: number;
    let targetX = -100;
    let targetY = -100;

    const handleMouseMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
      setPos({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);

      // Check if hovering over interactive element
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'BUTTON' ||
          target.tagName === 'INPUT' ||
          target.tagName === 'A' ||
          target.closest('button') ||
          target.closest('input') ||
          target.closest('a') ||
          target.classList.contains('cursor-pointer'))
      ) {
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    // Smooth trailing lerp loop
    let currentX = -100;
    let currentY = -100;

    const loop = () => {
      currentX += (targetX - currentX) * 0.18;
      currentY += (targetY - currentY) * 0.18;
      setTrailingPos({ x: currentX, y: currentY });
      animationFrameId = requestAnimationFrame(loop);
    };
    animationFrameId = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden hidden md:block">
      {/* Trailing Soft Halo Ring */}
      <div
        className={`fixed rounded-full border border-violet-400/40 dark:border-violet-400/50 bg-violet-400/10 dark:bg-violet-400/15 backdrop-blur-[1px] transition-transform duration-150 ease-out will-change-transform ${
          isHovered ? 'scale-150 border-violet-500/60 bg-violet-400/20' : 'scale-100'
        }`}
        style={{
          width: 34,
          height: 34,
          transform: `translate3d(${trailingPos.x - 17}px, ${trailingPos.y - 17}px, 0)`,
        }}
      />

      {/* Center Precise Dot */}
      <div
        className={`fixed rounded-full bg-violet-600 dark:bg-violet-400 transition-all duration-75 will-change-transform ${
          isHovered ? 'scale-75 opacity-70' : 'scale-100 opacity-90'
        }`}
        style={{
          width: 6,
          height: 6,
          transform: `translate3d(${pos.x - 3}px, ${pos.y - 3}px, 0)`,
        }}
      />
    </div>
  );
};
