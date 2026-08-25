import { useState, useEffect, useRef } from 'react';
import { Users, BookOpen, Layers, Target } from 'lucide-react';
import { fetchStats } from '../../../services/endpoints';
import { cn } from '../../../utils/cn';

function AnimatedCounter({ endValue }) {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.disconnect();
      }
    });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible || endValue === 0) return;
    let startTimestamp = null;
    const duration = 2000; // 2 seconds animation
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // cubic ease-out
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(easeOut * endValue));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setCount(endValue);
      }
    };
    window.requestAnimationFrame(step);
  }, [isVisible, endValue]);

  return <span ref={ref}>{count}</span>;
}

export function StatsSection() {
  const [stats, setStats] = useState({ members: 0, subgroups: 0, research: 0, projects: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchStats().then(data => {
      setStats(data);
      setIsLoading(false);
    }).catch(() => {
      setStats({ members: 0, subgroups: 0, research: 0, projects: 0 });
      setIsLoading(false);
    });
  }, []);

  const items = [
    { label: 'Active Members', value: stats.members, icon: Users, delay: '0ms' },
    { label: 'Subgroups', value: stats.subgroups, icon: Layers, delay: '100ms' },
    { label: 'Research Papers', value: stats.research, icon: BookOpen, delay: '200ms' },
    { label: 'Projects Built', value: stats.projects, icon: Target, delay: '300ms' },
  ];

  return (
    <section className="py-16 md:py-20 bg-white dark:bg-surface-dark relative z-20">
      <div className="max-w-[1280px] mx-auto px-6 md:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-8">
          {items.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div 
                key={idx} 
                className={cn(
                  "flex flex-col items-center justify-center text-center px-4",
                  isLoading ? "opacity-0" : "animate-slide-up opacity-100"
                )}
                style={{ animationDelay: item.delay }}
              >
                <div className="w-14 h-14 rounded-2xl bg-amber/10 text-amber flex items-center justify-center mb-5">
                  <Icon className="w-7 h-7" />
                </div>
                <h3 className="font-heading font-black text-4xl md:text-5xl text-navy dark:text-white mb-3">
                  <AnimatedCounter endValue={item.value} />+
                </h3>
                <p className="text-gray-500 font-bold uppercase tracking-wider text-[11px] md:text-xs">
                  {item.label}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
