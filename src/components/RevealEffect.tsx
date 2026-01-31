import { useState, useEffect, useRef, useCallback } from 'react';
import forestNight from '@/assets/forest-night.jpg';
import forestGolden from '@/assets/forest-golden.jpg';

const RevealEffect = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: -300, y: -300 });
  const [smoothPos, setSmoothPos] = useState({ x: -300, y: -300 });
  const [isInside, setIsInside] = useState(false);
  const animationRef = useRef<number>();
  const revealSize = 160;

  // Smooth lerp animation
  const lerp = (start: number, end: number, factor: number) => {
    return start + (end - start) * factor;
  };

  const animate = useCallback(() => {
    setSmoothPos(prev => ({
      x: lerp(prev.x, mousePos.x, 0.12),
      y: lerp(prev.y, mousePos.y, 0.12),
    }));
    animationRef.current = requestAnimationFrame(animate);
  }, [mousePos]);

  useEffect(() => {
    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [animate]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePos({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      }
    };

    const handleMouseEnter = () => setIsInside(true);
    const handleMouseLeave = () => {
      setIsInside(false);
      setMousePos({ x: -300, y: -300 });
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
      container.addEventListener('mouseenter', handleMouseEnter);
      container.addEventListener('mouseleave', handleMouseLeave);
    }

    return () => {
      if (container) {
        container.removeEventListener('mousemove', handleMouseMove);
        container.removeEventListener('mouseenter', handleMouseEnter);
        container.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, []);

  return (
    <div ref={containerRef} className="reveal-container">
      {/* Base layer - dark forest */}
      <img
        src={forestNight}
        alt="Dark mystical forest"
        className="image-layer"
        style={{ filter: 'brightness(0.85)' }}
      />

      {/* Blur overlay around the reveal area */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(circle ${revealSize + 80}px at ${smoothPos.x}px ${smoothPos.y}px, transparent 0%, transparent ${revealSize - 20}px, rgba(0,0,0,0.3) ${revealSize + 40}px, transparent ${revealSize + 80}px)`,
          opacity: isInside ? 1 : 0,
          transition: 'opacity 0.4s ease-out',
        }}
      />

      {/* Reveal layer - golden forest */}
      <div
        className="absolute inset-0"
        style={{
          opacity: isInside ? 1 : 0,
          clipPath: `circle(${revealSize}px at ${smoothPos.x}px ${smoothPos.y}px)`,
          transition: 'opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <img
          src={forestGolden}
          alt="Magical golden forest"
          className="image-layer"
          style={{ filter: 'brightness(1.05) saturate(1.1)' }}
        />
      </div>

      {/* Outer glow ring */}
      <div
        className="absolute pointer-events-none rounded-full"
        style={{
          left: smoothPos.x,
          top: smoothPos.y,
          width: revealSize * 2 + 40,
          height: revealSize * 2 + 40,
          transform: 'translate(-50%, -50%)',
          background: 'transparent',
          boxShadow: `
            0 0 60px 10px hsl(45 90% 55% / 0.15),
            0 0 100px 30px hsl(45 90% 55% / 0.08),
            inset 0 0 60px 10px hsl(45 90% 55% / 0.05)
          `,
          border: '1px solid hsl(45 90% 55% / 0.2)',
          opacity: isInside ? 1 : 0,
          transition: 'opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      />

      {/* Inner glow ring */}
      <div
        className="absolute pointer-events-none rounded-full"
        style={{
          left: smoothPos.x,
          top: smoothPos.y,
          width: revealSize * 2,
          height: revealSize * 2,
          transform: 'translate(-50%, -50%)',
          border: '2px solid hsl(45 90% 55% / 0.35)',
          boxShadow: `
            0 0 30px 5px hsl(45 90% 55% / 0.2),
            inset 0 0 40px 10px hsl(45 90% 55% / 0.1)
          `,
          opacity: isInside ? 1 : 0,
          transition: 'opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      />

      {/* Custom cursor - follows faster */}
      <div
        className="fixed pointer-events-none z-[100] rounded-full"
        style={{
          left: smoothPos.x,
          top: smoothPos.y,
          width: 12,
          height: 12,
          background: 'hsl(45 90% 55%)',
          transform: 'translate(-50%, -50%)',
          boxShadow: '0 0 20px 5px hsl(45 90% 55% / 0.5)',
          opacity: isInside ? 1 : 0,
          transition: 'opacity 0.3s ease',
        }}
      />

      {/* Animated particles around cursor */}
      {isInside && (
        <div
          className="absolute pointer-events-none"
          style={{
            left: smoothPos.x,
            top: smoothPos.y,
            transform: 'translate(-50%, -50%)',
          }}
        >
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full animate-pulse"
              style={{
                width: 4,
                height: 4,
                background: 'hsl(45 90% 60%)',
                boxShadow: '0 0 10px 2px hsl(45 90% 55% / 0.6)',
                transform: `rotate(${i * 60}deg) translateX(${revealSize + 30}px)`,
                opacity: 0.7,
                animationDelay: `${i * 0.1}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* Hero text overlay */}
      <div className="hero-text animate-fade-up">
        <h1 className="hero-title">
          Discover the <span className="text-primary">Hidden</span> World
        </h1>
        <p className="hero-subtitle">
          Move your cursor to reveal the magic beneath the surface
        </p>
      </div>
    </div>
  );
};

export default RevealEffect;
