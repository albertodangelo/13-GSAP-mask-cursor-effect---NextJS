"use client";
import styles from "./page.module.scss";
import { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";

export default function Home() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const maskRef = useRef(null);
  
  const handleMouseMove = (e) => {
    const newX = e.clientX;
    const newY = e.clientY;
    setMousePosition({ x: newX, y: newY });
    
    // GSAP Animation für die Mask-Position
    if (maskRef.current) {
      const size = isHovered ? 400 : 40;
      gsap.to(maskRef.current, {
        duration: 0.3,
        ease: "back.out(1.7)",
        css: {
          WebkitMaskPosition: `${newX - size/2}px ${newY - size/2}px`,
          maskPosition: `${newX - size/2}px ${newY - size/2}px`,
          WebkitMaskSize: `${size}px`,
          maskSize: `${size}px`
        }
      });
    }
  };

  const { x, y } = mousePosition;

  return (
    <div 
      onMouseMove={handleMouseMove}
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
        <div style={{ position: 'fixed', top: 10, left: 10, background: 'white', padding: '10px', zIndex: 1000 }}>
          Mouse: {x}, {y} | Hovered: {isHovered ? 'Yes' : 'No'}
        </div>

        <div 
          ref={maskRef}
          className={styles.mask}
        >
          <p 
            onMouseEnter={() => setIsHovered(true)} 
            onMouseLeave={() => setIsHovered(false)}
          >
            Ein visueller Effekt für den Cursor für Entwickler, die noch nicht von KI ersetzt wurden.
          </p>
        </div>
        
        <div className={styles.body}>
          <p>
          Wichtig für einen <span>digital Designer</span> sind hohe Qualitätsstandards und erfolgreich Umsetzung von digitalen Nutzererfahrungen.
          </p>
        </div>
      </main>
    </div>
  );
}
