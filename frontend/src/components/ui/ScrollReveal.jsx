import { useEffect, useRef, useState } from 'react';

export function ScrollReveal({ 
  children, 
  className = "", 
  animation = "fade-up", // fade-up, fade-in, scale-up, slide-left, slide-right
  delay = 0,
  duration = 700,
  threshold = 0.1,
  once = false
}) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once && ref.current) {
            observer.unobserve(ref.current);
          }
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { threshold }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [threshold, once]);

  // Base styles based on animation type
  const getStyles = () => {
    const base = {
      transitionDuration: `${duration}ms`,
      transitionDelay: `${isVisible ? delay : 0}ms`,
      transitionProperty: 'opacity, transform',
      transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)'
    };

    if (isVisible) {
      return {
        ...base,
        opacity: 1,
        transform: 'translate(0, 0) scale(1)',
      };
    }

    // Initial hidden states
    switch (animation) {
      case 'fade-up':
        return { ...base, opacity: 0, transform: 'translateY(40px)' };
      case 'slide-up':
        return { ...base, opacity: 0, transform: 'translateY(80px)' };
      case 'fade-in':
        return { ...base, opacity: 0, transform: 'translate(0, 0)' };
      case 'scale-up':
        return { ...base, opacity: 0, transform: 'scale(0.95)' };
      case 'slide-left':
        return { ...base, opacity: 0, transform: 'translateX(40px)' };
      case 'slide-right':
        return { ...base, opacity: 0, transform: 'translateX(-40px)' };
      default:
        return { ...base, opacity: 0, transform: 'translateY(40px)' };
    }
  };

  return (
    <div ref={ref} className={className} style={getStyles()}>
      {children}
    </div>
  );
}
