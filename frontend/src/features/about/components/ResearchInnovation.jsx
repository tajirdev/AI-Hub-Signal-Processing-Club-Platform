import { FileText, ArrowRight } from 'lucide-react';
import { ScrollReveal } from '../../../components/ui/ScrollReveal';

export function ResearchInnovation() {
  return (
    <section className="py-24 bg-gray-50 dark:bg-surface-dark border-b border-gray-100 dark:border-gray-800 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          <div className="order-2 lg:order-1">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4 pt-8">
                <ScrollReveal animation="slide-up" delay={0}>
                  <PhaseCard step="1" title="Explore" desc="Identifying knowledge gaps." />
                </ScrollReveal>
                <ScrollReveal animation="slide-up" delay={200}>
                  <PhaseCard step="2" title="Experiment" desc="Testing hypotheses." />
                </ScrollReveal>
              </div>
              <div className="space-y-4">
                <ScrollReveal animation="slide-up" delay={100}>
                  <PhaseCard step="3" title="Build" desc="Developing prototypes." />
                </ScrollReveal>
                <ScrollReveal animation="slide-up" delay={300}>
                  <PhaseCard step="4" title="Validate" desc="Proving real-world viability." />
                </ScrollReveal>
                <ScrollReveal animation="slide-up" delay={500}>
                  <PhaseCard step="5" title="Share" desc="Publishing findings." className="bg-amber/10 dark:bg-amber/10 border-amber/20 dark:border-amber/20" />
                </ScrollReveal>
              </div>
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <ScrollReveal animation="slide-left" delay={0}>
              <h2 className="text-3xl md:text-5xl font-heading font-black text-navy dark:text-white mb-6">
                Research & Innovation
              </h2>
            </ScrollReveal>
            <ScrollReveal animation="slide-left" delay={100}>
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                We don't just consume technology. We investigate, experiment, and create.
              </p>
            </ScrollReveal>
            <ScrollReveal animation="fade-up" delay={200}>
              <div className="space-y-4 text-gray-600 dark:text-gray-400 leading-relaxed mb-8">
                <p>
                  The Hub features a dedicated Research Team committed to advancing the boundaries of applied technology. 
                  Our research directly targets critical challenges across the African continent and globally.
                </p>
                <p>
                  Key areas of investigation include:
                </p>
                <ul className="list-disc pl-6 space-y-2 font-medium text-navy dark:text-gray-300">
                  <li>AI for health surveillance</li>
                  <li>Antimicrobial resistance (AMR) surveillance</li>
                  <li>Natural Language Processing for low-resource African languages</li>
                  <li>Advanced signal processing applications</li>
                </ul>
              </div>
            </ScrollReveal>
            
            <ScrollReveal animation="fade-in" delay={300}>
              <a href="/research" className="inline-flex items-center gap-2 text-amber dark:text-amber font-bold hover:underline group">
                <FileText className="w-5 h-5" />
                View our Publications
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </ScrollReveal>
          </div>

        </div>
      </div>
    </section>
  );
}

function PhaseCard({ step, title, desc, className = "bg-white dark:bg-[#0b172a] border-gray-100 dark:border-gray-800" }) {
  return (
    <div className={`p-6 rounded-2xl border shadow-sm ${className}`}>
      <span className="text-xs font-black text-gray-400 dark:text-gray-500 mb-2 block">PHASE 0{step}</span>
      <h4 className="font-bold text-navy dark:text-white mb-1">{title}</h4>
      <p className="text-sm text-gray-500 dark:text-gray-400">{desc}</p>
    </div>
  );
}
