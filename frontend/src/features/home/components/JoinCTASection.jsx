import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '../../../components/ui/Button';

export function JoinCTASection() {
  return (
    <section className="py-24 px-4 md:px-8">
      <div className="max-w-[1280px] mx-auto bg-navy dark:bg-surface-dark rounded-[32px] overflow-hidden relative shadow-2xl">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-amber/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-white/5 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/3 pointer-events-none"></div>
        
        <div className="relative z-10 px-8 py-20 md:py-24 flex flex-col items-center text-center max-w-3xl mx-auto">
          <span className="inline-block text-amber uppercase tracking-widest text-xs font-bold mb-6">
            Become a Member
          </span>
          <h2 className="font-heading font-black text-4xl md:text-5xl text-white leading-tight mb-6">
            Ready to build the future of technology in Tanzania?
          </h2>
          <p className="text-lg text-gray-300 mb-10 leading-relaxed">
            Join a community of passionate builders. Learn, collaborate, research, and innovate with the AI & Signal Processing Hub.
          </p>
          
          <Button size="lg" asChild className="group">
            <Link to="/join">
              Apply to Join Hub
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
