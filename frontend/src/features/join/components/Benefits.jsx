import { Server, GraduationCap, Code, FileSignature } from 'lucide-react';
import { ScrollReveal } from '../../../components/ui/ScrollReveal';

export function Benefits() {
  const benefits = [
    {
      title: "Compute Resources",
      desc: "Get access to specialized hardware and cloud compute for training machine learning models.",
      icon: Server,
    },
    {
      title: "Mentorship",
      desc: "Learn directly from senior members, researchers, and faculty advisors.",
      icon: GraduationCap,
    },
    {
      title: "Open Source Projects",
      desc: "Contribute to real-world codebases that you can put on your resume or portfolio.",
      icon: Code,
    },
    {
      title: "Research Publications",
      desc: "Co-author academic papers and present your findings at tech conferences.",
      icon: FileSignature,
    }
  ];

  return (
    <section className="py-24 bg-navy dark:bg-[#040a18] text-white overflow-hidden relative">
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <ScrollReveal animation="fade-up">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-heading font-black mb-6">
              Membership Benefits
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto text-lg">
              We provide the environment and resources you need to accelerate your engineering journey.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {benefits.map((benefit, idx) => {
            const Icon = benefit.icon;
            return (
              <ScrollReveal key={idx} animation="scale-up" delay={idx * 100}>
                <div className="flex gap-6 p-8 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors h-full">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-amber/20 text-amber flex items-center justify-center">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-3">{benefit.title}</h3>
                    <p className="text-gray-400 leading-relaxed">{benefit.desc}</p>
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
