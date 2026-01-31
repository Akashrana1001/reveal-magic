import { useState, useEffect, useRef } from 'react';
import forestNight from '@/assets/forest-night.jpg';
import forestGolden from '@/assets/forest-golden.jpg';

const RevealEffect = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: -200, y: -200 });
  const [isInside, setIsInside] = useState(false);
  const revealSize = 180;

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
    const handleMouseLeave = () => setIsInside(false);

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
      {/* Base layer - dark forest (main visible image) */}
      <img
        src={forestNight}
        alt="Dark mystical forest"
        className="image-layer"
        style={{ filter: 'brightness(0.9)' }}
      />

      {/* Reveal layer - golden forest (hidden, shown through circle) */}
      <div
        className="absolute inset-0 transition-opacity duration-200"
        style={{
          opacity: isInside ? 1 : 0,
          clipPath: `circle(${revealSize}px at ${mousePos.x}px ${mousePos.y}px)`,
        }}
      >
        <img
          src={forestGolden}
          alt="Magical golden forest"
          className="image-layer"
        />
      </div>

      {/* Glow ring around reveal circle */}
      <div
        className="reveal-circle"
        style={{
          left: mousePos.x,
          top: mousePos.y,
          width: revealSize * 2,
          height: revealSize * 2,
          opacity: isInside ? 1 : 0,
          transition: 'opacity 0.3s ease',
        }}
      />

      {/* Custom cursor */}
      <div
        className="custom-cursor"
        style={{
          left: mousePos.x,
          top: mousePos.y,
          opacity: isInside ? 1 : 0,
          transition: 'opacity 0.2s ease',
        }}
      />

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
