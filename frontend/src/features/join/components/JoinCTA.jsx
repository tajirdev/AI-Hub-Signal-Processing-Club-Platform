import { ArrowUp } from 'lucide-react';
import { ScrollReveal } from '../../../components/ui/ScrollReveal';

export function JoinCTA() {
  const scrollToForm = () => {
    document.getElementById('application-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="py-24 bg-navy dark:bg-[#040a18] text-white text-center relative overflow-hidden">
      {/* Decorative background blur */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber/20 dark:bg-amber/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <ScrollReveal animation="fade-up">
          <h2 className="text-4xl md:text-5xl font-heading font-black mb-6">
            Ready to Build?
          </h2>
        </ScrollReveal>
        <ScrollReveal animation="fade-up" delay={100}>
          <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
            Stop waiting for the perfect time. Join the AI & Signal Processing Hub today and start building the future of technology in Africa.
          </p>
        </ScrollReveal>

        <ScrollReveal animation="scale-up" delay={200}>
          <button 
            onClick={scrollToForm}
            className="inline-flex items-center gap-2 bg-[#FFB347] hover:bg-[#FFA012] text-white shadow-[0_8px_20px_rgba(255,179,71,0.4)] hover:-translate-y-0.5 transition-all rounded-2xl py-4 px-8 font-body font-bold text-lg normal-case tracking-normal"
          >
            Go to Application Form
            <ArrowUp className="w-5 h-5 ml-2" />
          </button>
        </ScrollReveal>
      </div>
    </section>
  );
}
