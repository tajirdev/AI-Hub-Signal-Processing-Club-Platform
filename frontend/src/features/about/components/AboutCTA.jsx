import { Link } from 'react-router-dom';
import { Button } from '../../../components/ui/Button';
import { ScrollReveal } from '../../../components/ui/ScrollReveal';

export function AboutCTA() {
  return (
    <section className="py-24 bg-navy dark:bg-[#040a18] text-white text-center relative overflow-hidden">
      {/* Decorative background blur */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-amber/20 dark:bg-amber/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <ScrollReveal animation="fade-up">
          <h2 className="text-3xl sm:text-4xl md:text-6xl break-words hyphens-auto font-heading font-black mb-6">
            Build With Us.
          </h2>
        </ScrollReveal>
        <ScrollReveal animation="fade-up" delay={100}>
          <p className="text-lg md:text-xl text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed">
            Whether you're interested in research, engineering, software, AI, signal processing or simply learning something new, there is a place for you to contribute.
          </p>
        </ScrollReveal>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <ScrollReveal animation="scale-up" delay={200} className="w-full sm:w-auto">
            <Button asChild size="lg" className="w-full sm:w-auto bg-[#FFB347] hover:bg-[#FFA012] text-white shadow-[0_8px_20px_rgba(255,179,71,0.4)] hover:-translate-y-0.5 transition-all rounded-2xl py-4 font-body font-bold text-base normal-case tracking-normal px-8">
              <Link to="/join">Join the Hub</Link>
            </Button>
          </ScrollReveal>
          <ScrollReveal animation="scale-up" delay={300} className="w-full sm:w-auto">
            <Button asChild variant="outline" size="lg" className="w-full sm:w-auto border-white/20 text-white hover:bg-white/10 font-bold text-lg px-8 py-4">
              <Link to="/projects">Explore Projects</Link>
            </Button>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
