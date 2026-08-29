import { Cpu, Activity, Lightbulb, Code, Plus, Equal } from 'lucide-react';
import { ScrollReveal } from '../../../components/ui/ScrollReveal';

export function FocusAreas() {
  return (
    <section className="py-24 bg-navy dark:bg-[#040a18] text-white relative overflow-hidden">
      {/* Decorative tech background */}
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
      <div className="absolute right-0 top-0 w-1/2 h-full bg-gradient-to-l from-amber/20 to-transparent pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <ScrollReveal animation="fade-up">
            <h2 className="text-3xl md:text-5xl font-heading font-black mb-6">
              Beyond Just AI
            </h2>
          </ScrollReveal>
          <ScrollReveal animation="fade-up" delay={100}>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              We operate at the intersection of intelligence and infrastructure, blending software algorithms with hardware engineering to create complete systems.
            </p>
          </ScrollReveal>
        </div>

        {/* The Equation */}
        <div className="flex flex-wrap justify-center items-center gap-4 md:gap-8 mb-20">
          <ScrollReveal animation="scale-up" delay={0}>
            <FocusBadge icon={Cpu} label="AI" />
          </ScrollReveal>
          
          <ScrollReveal animation="fade-in" delay={100}>
            <Plus className="text-gray-500 w-6 h-6" />
          </ScrollReveal>
          
          <ScrollReveal animation="scale-up" delay={200}>
            <FocusBadge icon={Activity} label="Signal Processing" />
          </ScrollReveal>
          
          <ScrollReveal animation="fade-in" delay={300}>
            <Plus className="text-gray-500 w-6 h-6" />
          </ScrollReveal>
          
          <ScrollReveal animation="scale-up" delay={400}>
            <FocusBadge icon={Code} label="Computing" />
          </ScrollReveal>
          
          <ScrollReveal animation="fade-in" delay={500}>
            <Plus className="text-gray-500 w-6 h-6" />
          </ScrollReveal>
          
          <ScrollReveal animation="scale-up" delay={600}>
            <FocusBadge icon={Lightbulb} label="Research" />
          </ScrollReveal>
          
          <ScrollReveal animation="fade-in" delay={700}>
            <Equal className="text-amber dark:text-amber w-6 h-6 md:ml-4" />
          </ScrollReveal>
          
          <ScrollReveal animation="scale-up" delay={800}>
            <div className="px-6 py-3 rounded-full bg-amber dark:bg-amber text-navy font-black text-xl tracking-wide shadow-[0_0_30px_rgba(255,179,71,0.3)] md:ml-4 animate-pulse">
              REAL-WORLD IMPACT
            </div>
          </ScrollReveal>
        </div>

      </div>
    </section>
  );
}

function FocusBadge({ icon: Icon, label }) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center backdrop-blur-md">
        <Icon className="w-8 h-8 text-blue-400" />
      </div>
      <span className="font-heading font-bold text-sm tracking-widest uppercase text-gray-300">{label}</span>
    </div>
  );
}
