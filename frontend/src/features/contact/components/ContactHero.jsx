import { MessageSquare, ArrowDown } from 'lucide-react';
import { ScrollReveal } from '../../../components/ui/ScrollReveal';

export function ContactHero() {
  const scrollDown = () => {
    window.scrollBy({ top: window.innerHeight * 0.7, behavior: 'smooth' });
  };

  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden bg-white dark:bg-surface-dark text-center">
      {/* Background patterns */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      
      <div className="relative z-10 max-w-4xl mx-auto px-6">
        <ScrollReveal animation="fade-up" delay={0}>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 dark:bg-blue-500/10 border border-blue-500/20 dark:border-blue-500/20 text-sm font-semibold tracking-wide text-blue-600 dark:text-blue-400 mb-8">
            <MessageSquare className="w-4 h-4" />
            <span>GET IN TOUCH</span>
          </div>
        </ScrollReveal>
        
        <ScrollReveal animation="fade-up" delay={100}>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-heading font-black text-navy dark:text-white leading-tight tracking-tight mb-8">
            Let's Talk <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">
              Innovation.
            </span>
          </h1>
        </ScrollReveal>
        
        <ScrollReveal animation="fade-up" delay={200}>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 font-medium leading-relaxed max-w-2xl mx-auto mb-10">
            Have a question about the Hub? Want to partner on a research project or sponsor our next hackathon? We would love to hear from you.
          </p>
        </ScrollReveal>

        <ScrollReveal animation="fade-up" delay={300}>
          <button 
            onClick={scrollDown}
            className="inline-flex items-center gap-2 bg-navy hover:bg-navy-soft dark:bg-white dark:hover:bg-gray-100 text-white dark:text-navy px-8 py-4 rounded-2xl font-bold transition-transform hover:-translate-y-1 shadow-xl"
          >
            Reach Out
            <ArrowDown className="w-5 h-5 animate-bounce" />
          </button>
        </ScrollReveal>
      </div>
    </section>
  );
}
