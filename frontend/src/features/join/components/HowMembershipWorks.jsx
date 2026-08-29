import { ScrollReveal } from '../../../components/ui/ScrollReveal';

export function HowMembershipWorks() {
  const steps = [
    { num: '01', title: 'Submit Application', desc: 'Fill out the form below with your academic details and motivation.' },
    { num: '02', title: 'Application Review', desc: 'Our leadership team will review your application within a week.' },
    { num: '03', title: 'Brief Interview', desc: 'A short informal chat to understand your goals and technical interests.' },
    { num: '04', title: 'Onboarding', desc: 'Welcome to the Hub! You will be placed in a subgroup and assigned a starter project.' }
  ];

  return (
    <section className="py-24 bg-gray-50 dark:bg-surface-dark overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <ScrollReveal animation="fade-up">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-heading font-black text-navy dark:text-white mb-6">
              How It Works
            </h2>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
          {/* Connector Line */}
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-gray-200 dark:bg-gray-800 -translate-y-1/2 z-0"></div>

          {steps.map((step, idx) => (
            <ScrollReveal key={idx} animation="slide-up" delay={idx * 150} className="relative z-10">
              <div className="bg-white dark:bg-[#0b172a] p-8 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm text-center h-full hover:-translate-y-2 transition-transform">
                <div className="w-12 h-12 mx-auto rounded-full bg-amber text-navy font-black flex items-center justify-center text-lg mb-6 shadow-lg shadow-amber/30">
                  {step.num}
                </div>
                <h3 className="text-lg font-bold text-navy dark:text-white mb-3">{step.title}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{step.desc}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
