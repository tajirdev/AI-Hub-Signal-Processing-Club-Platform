import { useEffect, useRef, useState } from 'react';

const DEFAULT_STATS = [
  { value: '250+', label: 'Members', icon: 'users' },
  { value: '7+', label: 'Sub Groups', icon: 'groups' },
  { value: '200+', label: 'Research', icon: 'book' },
  { value: '45 +', label: 'Project', icon: 'check' },
];

function parseNumericValue(value) {
  const numeric = Number.parseFloat(String(value).replace(/[^\d.]/g, ''));
  return Number.isFinite(numeric) ? numeric : 0;
}

function formatDisplayValue(rawValue, currentValue) {
  const suffix = String(rawValue).replace(/[\d.\s]/g, '');
  return `${Math.floor(currentValue)}${suffix}`;
}

function StatIcon({ type }) {
  const commonProps = {
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: '1.8',
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    'aria-hidden': 'true',
  };

  switch (type) {
    case 'users':
      return (
        <svg {...commonProps}>
          <path d="M16 19v-1a4 4 0 00-4-4H8a4 4 0 00-4 4v1" />
          <circle cx="10" cy="7" r="3" />
          <path d="M20 19v-1a4 4 0 00-3-3.87" />
          <path d="M16 3.13a4 4 0 010 7.75" />
        </svg>
      );
    case 'groups':
      return (
        <svg {...commonProps}>
          <path d="M5 18V8.5A1.5 1.5 0 016.5 7H10l2 2h5.5A1.5 1.5 0 0119 10.5V18" />
          <path d="M3 18h18" />
          <path d="M8 7V5.5A1.5 1.5 0 019.5 4h5A1.5 1.5 0 0116 5.5V7" />
        </svg>
      );
    case 'book':
      return (
        <svg {...commonProps}>
          <path d="M4 6.5A2.5 2.5 0 016.5 4H20v14.5H6.5A2.5 2.5 0 014 16V6.5z" />
          <path d="M4 16c0 1.1.9 2 2 2h14" />
          <path d="M8 8h8M8 11h8" />
        </svg>
      );
    case 'check':
      return (
        <svg {...commonProps}>
          <circle cx="12" cy="12" r="8" />
          <path d="M9 12l2 2 4-5" />
        </svg>
      );
    default:
      return null;
  }
}

function AnimatedStatValue({ value, startAnimating }) {
  const [displayValue, setDisplayValue] = useState(0);
  const targetValue = parseNumericValue(value);

  useEffect(() => {
    if (!startAnimating) return;

    let frameId;
    const duration = 1200;
    const startTime = performance.now();

    const update = (currentTime) => {
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(targetValue * eased);

      if (progress < 1) {
        frameId = requestAnimationFrame(update);
      }
    };

    frameId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(frameId);
  }, [startAnimating, targetValue]);

  return <>{formatDisplayValue(value, displayValue)}</>;
}

export default function StatsStrip({ items = DEFAULT_STATS, className = '' }) {
  const sectionRef = useRef(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const element = sectionRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasAnimated(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className={`stats-strip ${className}`.trim()} aria-label="Hub statistics">
      <div className="stats-shell">
        {items.map((item, index) => (
          <div
            key={`${item.label}-${item.value}`}
            className={`stat-item ${hasAnimated ? 'is-visible' : ''}`}
            style={{ animationDelay: `${index * 0.12}s` }}
          >
            <div className="stat-icon" aria-hidden="true">
              {item.icon ? <StatIcon type={item.icon} /> : item.iconElement}
            </div>

            <div className="stat-copy">
              <div className="stat-value">
                <AnimatedStatValue value={item.value} startAnimating={hasAnimated} />
              </div>
              <div className="stat-label">{item.label}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
