import { Network, GraduationCap, Building2, Globe2 } from 'lucide-react';
import { ScrollReveal } from '../../../components/ui/ScrollReveal';

export function Collaboration() {
  return (
    <section className="py-24 bg-white dark:bg-surface-dark overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <div className="mb-16">
          <ScrollReveal animation="fade-up">
            <h2 className="text-3xl md:text-5xl font-heading font-black text-navy dark:text-white mb-6">
              Collaboration & Community
            </h2>
          </ScrollReveal>
          <ScrollReveal animation="fade-up" delay={100}>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
              Technology becomes more powerful when people with different skills work together.
            </p>
          </ScrollReveal>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <ScrollReveal animation="slide-up" delay={0}>
            <CollabNode icon={GraduationCap} title="Students" desc="Peer-to-peer learning and cross-disciplinary projects." />
          </ScrollReveal>
          <ScrollReveal animation="slide-up" delay={150}>
            <CollabNode icon={Building2} title="Faculty" desc="Guidance from department educators and university leadership." />
          </ScrollReveal>
          <ScrollReveal animation="slide-up" delay={300}>
            <CollabNode icon={Globe2} title="Institutions" desc="Academic partnerships and shared research initiatives." />
          </ScrollReveal>
          <ScrollReveal animation="slide-up" delay={450}>
            <CollabNode icon={Network} title="Industry" desc="Connecting with technical communities and external partners." />
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}

function CollabNode({ icon: Icon, title, desc }) {
  return (
    <div className="flex flex-col items-center p-8 rounded-3xl bg-gray-50 dark:bg-[#0b172a] border border-gray-100 dark:border-gray-800 hover:-translate-y-2 transition-transform duration-300">
      <div className="w-16 h-16 rounded-2xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-6">
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="text-xl font-bold text-navy dark:text-white mb-3">{title}</h3>
      <p className="text-gray-600 dark:text-gray-400 text-sm">{desc}</p>
    </div>
  );
}
