import { HeartPulse, Droplets, BookOpenCheck, ShieldAlert, Cpu } from 'lucide-react';
import { ScrollReveal } from '../../../components/ui/ScrollReveal';

export function Impact() {
  return (
    <section className="py-24 bg-navy dark:bg-[#040a18] text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="max-w-2xl">
            <ScrollReveal animation="fade-up">
              <h2 className="text-3xl md:text-5xl font-heading font-black mb-6">
                Why Does This Work Matter?
              </h2>
            </ScrollReveal>
            <ScrollReveal animation="fade-up" delay={100}>
              <p className="text-xl text-amber dark:text-amber font-bold italic mb-6">
                "We use technology as a tool for solving meaningful problems."
              </p>
            </ScrollReveal>
            <ScrollReveal animation="fade-up" delay={200}>
              <p className="text-gray-300 leading-relaxed">
                Our core philosophy is applying Artificial Intelligence and Signal Processing to real-world problems in Tanzania, East Africa, and beyond. We are committed to building technology for good.
              </p>
            </ScrollReveal>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ScrollReveal animation="scale-up" delay={0}>
            <ImpactCard icon={HeartPulse} title="Health Surveillance" desc="Predictive models and data analysis to monitor and respond to public health trends." />
          </ScrollReveal>
          <ScrollReveal animation="scale-up" delay={100}>
            <ImpactCard icon={ShieldAlert} title="AMR Surveillance" desc="Tracking antimicrobial resistance patterns to safeguard future medical treatments." />
          </ScrollReveal>
          <ScrollReveal animation="scale-up" delay={200}>
            <ImpactCard icon={Droplets} title="Water Quality" desc="Sensor networks and signal processing for real-time environmental monitoring." />
          </ScrollReveal>
          <ScrollReveal animation="scale-up" delay={300}>
            <ImpactCard icon={BookOpenCheck} title="Education" desc="Developing accessible technology tools to improve learning environments." />
          </ScrollReveal>
          <ScrollReveal animation="scale-up" delay={400}>
            <ImpactCard icon={Cpu} title="Low-Resource NLP" desc="Building Natural Language Processing solutions for underrepresented African languages." />
          </ScrollReveal>
        </div>

      </div>
    </section>
  );
}

function ImpactCard({ icon: Icon, title, desc }) {
  return (
    <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors h-full">
      <Icon className="w-8 h-8 text-amber dark:text-amber mb-4" />
      <h3 className="text-lg font-bold mb-2">{title}</h3>
      <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}
