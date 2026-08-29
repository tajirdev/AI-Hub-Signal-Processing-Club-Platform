import { useState } from 'react';
import { Link } from 'react-router-dom';
import { subscribeNewsletter } from '../../services/endpoints';
import { Mail, MapPin, ArrowRight } from 'lucide-react';

const SocialIcon = ({ children, viewBox = "0 0 24 24" }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="16" 
    height="16" 
    viewBox={viewBox} 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    {children}
  </svg>
);

export function Footer() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setMessage('');
    setError('');
    
    try {
      const res = await subscribeNewsletter(email);
      setMessage(res.message);
      setEmail('');
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to subscribe. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  const currentYear = new Date().getFullYear();

  return (
    <footer className="px-4 md:px-8 pb-8 pt-20">
      <div className="max-w-[1280px] mx-auto bg-navy dark:bg-surface-dark rounded-[28px] p-8 md:p-16 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 relative z-10">
          
          <div className="lg:col-span-4 flex flex-col gap-6">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-navy font-heading font-black text-3xl">
                S
              </div>
              <div className="flex flex-col justify-center">
                <span className="font-heading font-black text-2xl leading-none text-white tracking-wide">SigniAI</span>
              </div>
            </Link>
            <p className="text-gray-300/80 text-sm leading-relaxed max-w-xs">
              Empowering technologists to solve real-world challenges through collaborative excellence in AI and Signal Processing.
            </p>
            
            <div className="mt-4">
              <h4 className="font-heading font-bold text-sm tracking-wider uppercase mb-3 text-amber">Stay Updated</h4>
              {message ? (
                <div className="bg-green-500/10 border border-green-500/20 text-green-400 px-4 py-3 rounded-lg text-sm font-medium">
                  {message}
                </div>
              ) : (
                <form className="flex flex-col gap-2" onSubmit={handleSubscribe}>
                <div className="flex">
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email address" 
                    required
                    disabled={loading}
                    className="bg-white/10 border border-white/20 rounded-l-lg px-4 py-3 text-sm outline-none focus:border-amber w-full text-white placeholder:text-white/40 disabled:opacity-50"
                  />
                <button 
                    type="submit" 
                    disabled={loading}
                    className="bg-amber hover:bg-amber-hover disabled:bg-amber/50 disabled:cursor-not-allowed text-navy px-4 rounded-r-lg transition-colors flex items-center justify-center"
                  >
                    {loading ? <span className="w-5 h-5 border-2 border-navy/30 border-t-navy rounded-full animate-spin" /> : <ArrowRight className="w-5 h-5" />}
                  </button>
                </div>
                {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
              </form>
              )}
              </div>
          </div>

          <div className="lg:col-span-3 lg:col-start-6 flex flex-col gap-4">
            <h4 className="font-heading font-bold text-sm tracking-wider uppercase mb-2 text-white">Platform</h4>
            <div className="flex flex-col gap-3 text-sm text-gray-400">
              <Link to="/about" className="hover:text-amber transition-colors">About Us</Link>
              <Link to="/projects" className="hover:text-amber transition-colors">Projects Archive</Link>
              <Link to="/research" className="hover:text-amber transition-colors">Research Publications</Link>
              <Link to="/sub-groups" className="hover:text-amber transition-colors">Technical Subgroups</Link>
              <Link to="/members" className="hover:text-amber transition-colors">Member Directory</Link>
            </div>
          </div>

          <div className="lg:col-span-4 flex flex-col gap-8">
            <div className="flex flex-col gap-4">
              <h4 className="font-heading font-bold text-sm tracking-wider uppercase mb-2 text-white">Community</h4>
              <div className="flex flex-col gap-3 text-sm text-gray-400">
                <Link to="/events" className="hover:text-amber transition-colors">Upcoming Events</Link>
                <Link to="/blog" className="hover:text-amber transition-colors">Blog & News</Link>
                <Link to="/join" className="hover:text-amber transition-colors flex items-center gap-2">
                  Apply to Join <span className="w-2 h-2 rounded-full bg-amber inline-block"></span>
                </Link>
              </div>
            </div>

            <div className="flex flex-col gap-3 text-sm text-gray-400">
              <a href="mailto:contact@SigniAI.co.tz" className="flex items-center gap-3 hover:text-white transition-colors">
                <Mail className="w-4 h-4 text-amber" />
                <span>contact@SigniAI.co.tz</span>
              </a>
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-amber shrink-0 mt-0.5" />
                <span>Mbeya University of Science and Technology (MUST)<br/>Tanzania</span>
              </div>
            </div>
          </div>

        </div>

        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          <p className="text-xs text-gray-500 font-medium">
            &copy; {currentYear} SigniAI. All rights reserved.
          </p>
          
          <div className="flex flex-wrap items-center gap-4">
            <a href="https://www.linkedin.com/in/signi-ai-hub-816a623a6" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-white/5 hover:bg-amber flex items-center justify-center text-gray-400 hover:text-navy transition-all">
              <SocialIcon>
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                <rect x="2" y="9" width="4" height="12" />
                <circle cx="4" cy="4" r="2" />
              </SocialIcon>
            </a>
            <a href="https://github.com/AI-AND-SIGNAL-PROCESSING-HUB" target="_blank" rel="noopener noreferrer" className="px-4 h-9 rounded-full bg-white/5 hover:bg-amber flex items-center justify-center text-gray-400 hover:text-navy transition-all gap-2">
              <SocialIcon>
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" /></SocialIcon>
             
            </a>
            <a href="https://www.instagram.com/signiai_hub" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-white/5 hover:bg-amber flex items-center justify-center text-gray-400 hover:text-navy transition-all">
              <SocialIcon>
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </SocialIcon>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
