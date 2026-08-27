import { Sparkles, ArrowDown } from 'lucide-react';
import { ScrollReveal } from '../../../components/ui/ScrollReveal';

export function JoinHero() {
  const scrollToForm = () => {
    // The form is at the bottom, so we can scroll smoothly to the bottom or to a specific id if we add one.
    // For now, smooth scrolling down.
    document.getElementById('application-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden bg-white dark:bg-surface-dark text-center">
      {/* Background patterns */}
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#1f2937_1px,transparent_1px)] [background-size:20px_20px] opacity-50"></div>
      
      <div className="relative z-10 max-w-4xl mx-auto px-6">
        <ScrollReveal animation="fade-up" delay={0}>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber/10 dark:bg-amber/10 border border-amber/20 dark:border-amber/20 text-sm font-semibold tracking-wide text-amber dark:text-amber mb-8">
            <Sparkles className="w-4 h-4" />
            <span>APPLICATIONS ARE OPEN</span>
          </div>
        </ScrollReveal>
        
        <ScrollReveal animation="fade-up" delay={100}>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-heading font-black text-navy dark:text-white leading-tight tracking-tight mb-8">
            Start Your Journey <br className="hidden md:block" />
            <span className="text-amber">
              With The Hub.
            </span>
          </h1>
        </ScrollReveal>
        
        <ScrollReveal animation="fade-up" delay={200}>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 font-medium leading-relaxed max-w-2xl mx-auto mb-10">
            Join a community of ambitious students building real-world solutions in Artificial Intelligence, Signal Processing, and Software Engineering.
          </p>
        </ScrollReveal>

        <ScrollReveal animation="fade-up" delay={300}>
          <button 
            onClick={scrollToForm}
            className="inline-flex items-center gap-2 bg-navy hover:bg-navy-soft dark:bg-white dark:hover:bg-gray-100 text-white dark:text-navy px-8 py-4 rounded-2xl font-bold transition-transform hover:-translate-y-1 shadow-xl"
          >
            Apply Now
            <ArrowDown className="w-5 h-5 animate-bounce" />
          </button>
        </ScrollReveal>

      </div>
    </section>
  );
}
