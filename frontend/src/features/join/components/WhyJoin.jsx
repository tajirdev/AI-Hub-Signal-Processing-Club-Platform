import { Rocket, Target, Users } from 'lucide-react';
import { ScrollReveal } from '../../../components/ui/ScrollReveal';

export function WhyJoin() {
  const reasons = [
    {
      title: "Hands-on Experience",
      desc: "Stop reading tutorials. Start building systems that run in the real world.",
      icon: Rocket,
      color: "text-blue-500",
      bg: "bg-blue-500/10"
    },
    {
      title: "Meaningful Impact",
      desc: "Work on health, agriculture, and infrastructure projects that matter.",
      icon: Target,
      color: "text-amber",
      bg: "bg-amber/10"
    },
    {
      title: "Elite Network",
      desc: "Connect with researchers, top students, and industry professionals.",
      icon: Users,
      color: "text-purple-500",
      bg: "bg-purple-500/10"
    }
  ];

  return (
    <section className="py-24 bg-gray-50 dark:bg-[#071225] border-y border-gray-100 dark:border-gray-800 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <ScrollReveal animation="fade-up">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-heading font-black text-navy dark:text-white mb-6">
              Why Join The Hub?
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg">
              We bridge the gap between classroom theory and real-world engineering.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reasons.map((reason, idx) => {
            const Icon = reason.icon;
            return (
              <ScrollReveal key={idx} animation="slide-up" delay={idx * 150}>
                <div className="bg-white dark:bg-[#0b172a] rounded-3xl p-8 border border-gray-100 dark:border-gray-800 hover:shadow-xl transition-shadow h-full">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${reason.bg} ${reason.color}`}>
                    <Icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-bold text-navy dark:text-white mb-3">{reason.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{reason.desc}</p>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
