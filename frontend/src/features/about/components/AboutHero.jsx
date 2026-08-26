import { Activity } from 'lucide-react';
import { ScrollReveal } from '../../../components/ui/ScrollReveal';

export function AboutHero() {
  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden bg-gray-50 dark:bg-[#071225] text-center">
      {/* Subtle grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
      
      <div className="relative z-10 max-w-4xl mx-auto px-6">
        
        {/* Abstract mathematical/engineering visual elements - moved HIGHER so they don't overlap text */}
        <div className="absolute -top-16 left-4 md:left-20 animate-pulse text-gray-300 dark:text-white/10 font-mono text-sm md:text-base whitespace-nowrap">
          f(x) = ∫ e^(-st) f(t) dt
        </div>
        <div className="absolute -bottom-16 right-4 md:right-20 animate-pulse text-gray-300 dark:text-white/10 font-mono text-xs md:text-sm delay-700">
          [ 1  0 ]<br/>
          [ 0  1 ]
        </div>

        <ScrollReveal animation="fade-up" delay={0}>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-navy/5 dark:bg-white/5 border border-navy/10 dark:border-white/10 text-sm font-semibold tracking-wide text-navy dark:text-gray-300 mb-8">
            <Activity className="w-4 h-4 text-amber dark:text-amber" />
            <span>ABOUT THE HUB</span>
          </div>
        </ScrollReveal>
        
        <ScrollReveal animation="fade-up" delay={100}>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-heading font-black text-navy dark:text-white leading-tight tracking-tight mb-8">
            Building Technology <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber to-blue-600 dark:from-amber dark:to-orange-500">
              With Purpose.
            </span>
          </h1>
        </ScrollReveal>
        
        <ScrollReveal animation="fade-up" delay={200}>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 font-medium leading-relaxed max-w-2xl mx-auto">
            A student-led technical and research community at Mbeya University of Science and Technology.
          </p>
        </ScrollReveal>

      </div>
    </section>
  );
}
