import React, { useEffect, useState, useRef } from 'react';

export default function CustomCursor() {
  const [isHovered, setIsHovered] = useState(false);
  const [cursorLabel, setCursorLabel] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  const dotRef = useRef(null);
  const ringRef = useRef(null);
  
  // Track mouse coordinates
  const mouse = useRef({ x: 0, y: 0 });
  const ringPos = useRef({ x: 0, y: 0 });
  const dotPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    // Show cursor on first mouse move
    const handleMouseMove = (e) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    // Spring animation loop using requestAnimationFrame
    let animFrameId;
    const updatePosition = () => {
      // 1. Dot follows cursor immediately
      dotPos.current.x += (mouse.current.x - dotPos.current.x);
      dotPos.current.y += (mouse.current.y - dotPos.current.y);

      // 2. Ring follows with smooth inertia (spring delay)
      ringPos.current.x += (mouse.current.x - ringPos.current.x) * 0.15;
      ringPos.current.y += (mouse.current.y - ringPos.current.y) * 0.15;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${dotPos.current.x}px, ${dotPos.current.y}px, 0) translate3d(-50%, -50%, 0)`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0) translate3d(-50%, -50%, 0)`;
      }

      animFrameId = requestAnimationFrame(updatePosition);
    };

    animFrameId = requestAnimationFrame(updatePosition);

    // Handle hover states dynamically for all interactive DOM elements
    const handleMouseOver = (e) => {
      const target = e.target;
      if (!target) return;

      const clickable = target.closest('a, button, [role="button"], .grid-item, .lang-btn, .filter-btn, .overlay-close-btn, .modal-close-btn, .fullscreen-menu-link');
      
      if (clickable) {
        setIsHovered(true);
        if (clickable.classList.contains('grid-item')) {
          setCursorLabel('PLAY');
        } else if (clickable.classList.contains('modal-visit-btn')) {
          setCursorLabel('GO');
        } else if (clickable.classList.contains('overlay-close-btn') || clickable.classList.contains('modal-close-btn')) {
          setCursorLabel('✕');
        } else {
          setCursorLabel('');
        }
      } else {
        setIsHovered(false);
        setCursorLabel('');
      }
    };

    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('mouseover', handleMouseOver);
      cancelAnimationFrame(animFrameId);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <>
      {/* Outer Spring Ring */}
      <div 
        ref={ringRef} 
        className={`custom-cursor-ring ${isHovered ? 'hovered' : ''}`}
      >
        {cursorLabel && <span className="cursor-label">{cursorLabel}</span>}
      </div>

      {/* Inner Central Dot */}
      <div 
        ref={dotRef} 
        className={`custom-cursor-dot ${isHovered ? 'hovered' : ''}`}
      />
    </>
  );
}
