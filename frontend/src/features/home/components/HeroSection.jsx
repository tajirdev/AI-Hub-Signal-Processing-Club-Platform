import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronRight } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Terminal3D } from './Terminal3D';

const DOMAINS = [
  "Signal Processing",
  "Machine Learning",
  "Data Science",
  "Computer Vision"
];

export function HeroSection() {
  const [domainIndex, setDomainIndex] = useState(0);
  const [typedText, setTypedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  
  useEffect(() => {
    const currentDomain = DOMAINS[domainIndex];
    let typingSpeed = isDeleting ? 40 : 80;
    
    if (!isDeleting && typedText === currentDomain) {
      typingSpeed = 2000; // Pause at end of word
      setTimeout(() => setIsDeleting(true), typingSpeed);
      return;
    } else if (isDeleting && typedText === '') {
      setIsDeleting(false);
      setDomainIndex((prev) => (prev + 1) % DOMAINS.length);
      return;
    }
    
    const timeout = setTimeout(() => {
      setTypedText(currentDomain.substring(0, typedText.length + (isDeleting ? -1 : 1)));
    }, typingSpeed);
    
    return () => clearTimeout(timeout);
  }, [typedText, isDeleting, domainIndex]);

  return (
    <section className="pt-32 pb-16 md:pt-40 md:pb-24 overflow-hidden relative">
      {/* Background glow elements */}
      <div className="absolute top-1/4 -left-[20%] w-[50%] h-[50%] rounded-full bg-navy/5 blur-[120px] pointer-events-none dark:bg-amber/5"></div>
      
      <div className="max-w-[1280px] mx-auto px-6 md:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-8">
          
          {/* Left Text */}
          <div className="flex-1 w-full flex flex-col items-start relative z-10">
            <Link to="/about" className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-navy/5 dark:bg-white/5 border border-navy/10 dark:border-white/10 text-xs font-semibold text-navy dark:text-gray-300 hover:bg-navy/10 dark:hover:bg-white/10 transition-colors mb-8">
              <span className="w-2 h-2 rounded-full bg-amber animate-pulse"></span>
              Join the 2026 Cohort
              <ChevronRight className="w-3.5 h-3.5 opacity-50" />
            </Link>
            
            <h1 className="font-heading font-black text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-navy dark:text-white leading-[1.1] mb-6 min-h-[100px] sm:min-h-[120px] md:min-h-[160px] lg:min-h-[200px]">
              Empowering Tanzania through <br className="hidden md:block"/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber to-amber-hover">
                {typedText}
              </span>
              <span className="inline-block w-1 h-[0.9em] ml-1 bg-amber animate-pulse align-middle"></span>
            </h1>
            
            <p className="text-base md:text-lg text-gray-600 dark:text-gray-400 mb-8 md:mb-10 max-w-lg leading-relaxed">
              We are a community of researchers, students, and engineers at Mbeya University of Science and Technology building real-world solutions.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
              <Button asChild size="lg" className="w-full sm:w-auto group">
                <Link to="/projects">
                  Explore Projects
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button variant="secondary" size="lg" asChild className="w-full sm:w-auto bg-white dark:bg-surface-dark dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-800">
                <Link to="/join">Become a Member</Link>
              </Button>
            </div>
          </div>
          
          {/* Right Terminal */}
          <div className="flex-1 w-full relative z-10">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-tr from-navy to-amber opacity-20 dark:opacity-10 blur-2xl rounded-[30px]"></div>
              <Terminal3D />
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}
