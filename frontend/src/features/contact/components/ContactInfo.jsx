import { MapPin, Mail, Phone, Link2 } from 'lucide-react';
import { ScrollReveal } from '../../../components/ui/ScrollReveal';

const GithubIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
);

const LinkedinIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
);

const InstagramIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
);

export function ContactInfo() {
  return (
    <div className="flex flex-col gap-8 h-full">
      <ScrollReveal animation="fade-up" delay={0}>
        <div className="bg-white dark:bg-[#0b172a] p-8 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <MapPin className="w-24 h-24" />
          </div>
          <div className="w-12 h-12 bg-blue-500/10 text-blue-500 rounded-2xl flex items-center justify-center mb-6">
            <MapPin className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-navy dark:text-white mb-2">Location</h3>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed font-medium">
            Mbeya University of Science and Technology (MUST)<br />
            Department of Electronics & Telecommunication Engineering<br />
            Mbeya, Tanzania
          </p>
        </div>
      </ScrollReveal>

      <ScrollReveal animation="fade-up" delay={100}>
        <div className="bg-white dark:bg-[#0b172a] p-8 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Mail className="w-24 h-24" />
          </div>
          <div className="w-12 h-12 bg-amber/10 text-amber rounded-2xl flex items-center justify-center mb-6">
            <Mail className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-navy dark:text-white mb-2">Email</h3>
          <a href="mailto:hello@mustSigniAI.ac.tz" className="text-gray-600 dark:text-gray-400 hover:text-amber dark:hover:text-amber transition-colors font-medium">
            hello@mustSigniAI.ac.tz
          </a>
        </div>
      </ScrollReveal>

      <ScrollReveal animation="fade-up" delay={200}>
        <div className="bg-white dark:bg-[#0b172a] p-8 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Phone className="w-24 h-24" />
          </div>
          <div className="w-12 h-12 bg-green-500/10 text-green-500 rounded-2xl flex items-center justify-center mb-6">
            <Phone className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-navy dark:text-white mb-2">Phone</h3>
          <div className="text-gray-600 dark:text-gray-400 leading-relaxed font-medium space-y-1">
            <p>+255 682 929 923</p>
            <p>+255 696 234 952</p>
            <p>+255 674 044 676</p>
            <p>+255 674 460 305</p>
          </div>
        </div>
      </ScrollReveal>

      <ScrollReveal animation="fade-up" delay={300}>
        <div className="bg-white dark:bg-[#0b172a] p-8 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm relative overflow-hidden group">
          <div className="w-12 h-12 bg-purple-500/10 text-purple-500 rounded-2xl flex items-center justify-center mb-6">
            <Link2 className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-navy dark:text-white mb-4">Connect With Us</h3>
          <div className="flex flex-wrap gap-4">
            <a href="https://www.linkedin.com/in/signi-ai-hub-816a623a6" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-100 dark:bg-surface-dark flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-navy hover:text-white dark:hover:bg-amber dark:hover:text-navy transition-colors">
              <LinkedinIcon className="w-5 h-5" />
            </a>
            <a href="https://github.com/AI-AND-SIGNAL-PROCESSING-HUB" target="_blank" rel="noopener noreferrer" className="w-auto px-4 h-10 rounded-full bg-gray-100 dark:bg-surface-dark flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-navy hover:text-white dark:hover:bg-amber dark:hover:text-navy transition-colors gap-2">
              <GithubIcon className="w-5 h-5" />
              <span className="text-sm font-semibold whitespace-nowrap"></span>
            </a>
            <a href="https://www.instagram.com/signiai_hub" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-100 dark:bg-surface-dark flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-navy hover:text-white dark:hover:bg-amber dark:hover:text-navy transition-colors">
              <InstagramIcon className="w-5 h-5" />
            </a>
          </div>
        </div>
      </ScrollReveal>
    </div>
  );
}
