import { useEffect, useRef, useState } from 'react';
import { cn } from '../../utils/cn';

export function ScrollReveal({ 
  children, 
  className, 
  animation = "fade-up", // options: fade-up, fade-in, slide-left, slide-right
  duration = "duration-700",
  delay = "delay-0",
  threshold = 0.1 
}) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const currentRef = ref.current;
    if (!currentRef) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { 
        threshold,
        rootMargin: '50px' // Start animation slightly before it comes into view
      }
    );

    observer.observe(currentRef);

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, [threshold]);

  const baseClasses = `transition-all ease-out transform-gpu ${duration} ${delay}`;
  
  const animations = {
    "fade-up": isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12",
    "fade-in": isVisible ? "opacity-100" : "opacity-0",
    "slide-left": isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-12",
    "slide-right": isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-12",
  };

  return (
    <div 
      ref={ref} 
      className={cn(baseClasses, animations[animation], className)}
    >
      {children}
    </div>
  );
}
