import { Target, Eye } from 'lucide-react';
import { ScrollReveal } from '../../../components/ui/ScrollReveal';

export function MissionVision() {
  return (
    <section id="mission" className="py-24 bg-gray-50 dark:bg-[#071225] border-y border-gray-100 dark:border-gray-800 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Mission */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 items-start mb-24">
          <div className="md:col-span-4 flex items-center gap-4 text-amber dark:text-amber">
            <ScrollReveal animation="fade-in">
              <Target className="w-8 h-8" />
            </ScrollReveal>
            <ScrollReveal animation="slide-right" delay={100}>
              <h2 className="text-2xl font-heading font-black tracking-widest uppercase">Our Mission</h2>
            </ScrollReveal>
          </div>
          <div className="md:col-span-8">
            <ScrollReveal animation="fade-up" delay={200}>
              <p className="text-2xl md:text-4xl font-heading font-medium text-navy dark:text-white leading-tight">
                To pioneer cutting-edge <span className="text-amber dark:text-amber font-black">research</span> and <span className="text-amber dark:text-amber font-black">innovation</span> in Artificial Intelligence and Signal Processing, empowering the next generation of technologists to solve <span className="text-amber dark:text-amber font-black">real-world challenges</span> through <span className="text-amber dark:text-amber font-black">collaborative excellence</span>.
              </p>
            </ScrollReveal>
          </div>
        </div>

        {/* Vision */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 items-start">
          <div className="md:col-span-4 flex items-center gap-4 text-blue-600 dark:text-blue-400">
            <ScrollReveal animation="fade-in">
              <Eye className="w-8 h-8" />
            </ScrollReveal>
            <ScrollReveal animation="slide-right" delay={100}>
              <h2 className="text-2xl font-heading font-black tracking-widest uppercase">Our Vision</h2>
            </ScrollReveal>
          </div>
          <div className="md:col-span-8">
            <ScrollReveal animation="fade-up" delay={200}>
              <p className="text-2xl md:text-4xl font-heading font-medium text-navy dark:text-white leading-tight">
                To become a global leader in AI and Signal Processing innovation, fostering a vibrant ecosystem where <span className="text-blue-600 dark:text-blue-400 font-black">creativity meets technology</span>, and where every member contributes to <span className="text-blue-600 dark:text-blue-400 font-black">transforming industries and society</span>.
              </p>
            </ScrollReveal>
          </div>
        </div>

      </div>
    </section>
  );
}
