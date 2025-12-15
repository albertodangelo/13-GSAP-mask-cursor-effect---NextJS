"use client";
import styles from "./page.module.scss";
import { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";

export default function Home() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isTouching, setIsTouching] = useState(false);
  const maskRef = useRef(null);
  
  // Prüfe ob mobile Device und füge Touch-Listener hinzu
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    // Touch-Events mit { passive: false } für preventDefault
    const container = document.querySelector('[data-touch-container]');
    if (container) {
      container.addEventListener('touchmove', handleTouchMove, { passive: false });
    }
    
    return () => {
      window.removeEventListener('resize', checkMobile);
      if (container) {
        container.removeEventListener('touchmove', handleTouchMove);
      }
    };
  }, [isMobile, isTouching]);
  
  const updateMaskPosition = (x, y) => {
    if (maskRef.current) {
      const size = (isMobile && isTouching) || isHovered ? 400 : 40;
      gsap.to(maskRef.current, {
        duration: 0.3,
        ease: "back.out(1.7)",
        css: {
          WebkitMaskPosition: `${x - size/2}px ${y - size/2}px`,
          maskPosition: `${x - size/2}px ${y - size/2}px`,
          WebkitMaskSize: `${size}px`,
          maskSize: `${size}px`
        }
      });
    }
  };
  
  const handleMouseMove = (e) => {
    if (isMobile) return;
    
    const newX = e.clientX;
    const newY = e.clientY;
    setMousePosition({ x: newX, y: newY });
    updateMaskPosition(newX, newY);
  };
  
  const handleTouchStart = (e) => {
    if (!isMobile) return;
    setIsTouching(true);
    const touch = e.touches[0];
    const x = touch.clientX;
    const y = touch.clientY;
    setMousePosition({ x, y });
    updateMaskPosition(x, y);
  };
  
  const handleTouchMove = (e) => {
    if (!isMobile) return;
    e.preventDefault();
    const touch = e.touches[0];
    const x = touch.clientX;
    const y = touch.clientY;
    setMousePosition({ x, y });
    updateMaskPosition(x, y);
  };
  
  const handleTouchEnd = () => {
    if (!isMobile) return;
    setIsTouching(false);
    if (maskRef.current) {
      gsap.to(maskRef.current, {
        duration: 0.3,
        ease: "back.out(1.7)",
        css: {
          WebkitMaskSize: `40px`,
          maskSize: `40px`
        }
      });
    }
  };

  const { x, y } = mousePosition;

  return (
    <div 
      data-touch-container
      onMouseMove={handleMouseMove}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      style={{ 
        width: '100vw', 
        height: '100vh', 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        zIndex: -1 
      }}
    >
      <main className={styles.main}>
      <nav>
        <img src="./logo.png" alt="Logo" />
      </nav>
        {/* <div style={{ position: 'fixed', top: 10, left: 10, background: 'white', padding: '10px', zIndex: 1000 }}>
          Mouse: {x}, {y} | Hovered: {isHovered ? 'Yes' : 'No'}
        </div> */}

        <div 
          ref={maskRef}
          className={styles.mask}
        >
          <p 
            onMouseEnter={() => setIsHovered(true)} 
            onMouseLeave={() => setIsHovered(false)}
          >
            Ich unterstütze Sie dabei: <a className={styles.mailto} href="mailto:info@dangelodesign.ch">dangelodesign.ch</a>
          </p>
        </div>
        
        <div className={styles.body}>
          <p>
          Begeistern Sie Ihre Kunden durch starke Effekte und dynamische Animationen auf Ihrem <span>digitalen Auftritt</span>.
          </p>
        </div>
      </main>
    </div>
  );
}
