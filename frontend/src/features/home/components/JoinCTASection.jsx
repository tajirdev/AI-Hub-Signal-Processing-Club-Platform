import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { ScrollReveal } from '../../../components/ui/ScrollReveal';

export function JoinCTASection() {
  return (
    <section className="py-20 md:py-28 px-4 md:px-8">
      <div className="max-w-3xl mx-auto flex flex-col items-center text-center">
        <ScrollReveal animation="fade-up" delay={0}>
        <span className="inline-block text-[#0a2472] dark:text-[#ffba08] uppercase tracking-widest text-xs font-bold mb-4 md:mb-6">
          Become a Member
        </span>
        </ScrollReveal>
        <ScrollReveal animation="fade-up" delay={100}>
        <h2 className="font-heading font-black text-3xl sm:text-4xl md:text-5xl break-words hyphens-auto text-[#0a2472] dark:text-white leading-tight mb-6">
          Ready to build the future of technology in Tanzania?
        </h2>
        </ScrollReveal>
        <ScrollReveal animation="fade-up" delay={200}>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-10 leading-relaxed">
          Join a community of passionate builders. Learn, collaborate, research, and innovate with the AI & Signal Processing Hub.
        </p>
        </ScrollReveal>
        
        <ScrollReveal animation="scale-up" delay={300}>
        <Button size="lg" asChild className="group">
          <Link to="/join">
            Apply to Join Hub
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </Button>
        </ScrollReveal>
      </div>
    </section>
  );
}
