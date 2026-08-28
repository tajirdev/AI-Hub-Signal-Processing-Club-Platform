import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Home, Search, AlertTriangle } from 'lucide-react';

export function NotFoundPage() {
  useEffect(() => {
    document.title = '404 - Page Not Found | AI & Signal Processing Hub';
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#061539] pt-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-[#ffba08]/10 text-[#ffba08] mb-8">
          <AlertTriangle className="w-12 h-12" />
        </div>
        
        <h1 className="text-6xl md:text-8xl font-black text-[#0a2472] dark:text-white mb-6 tracking-tight">
          404
        </h1>
        
        <h2 className="text-3xl md:text-4xl font-bold text-[#0a2472] dark:text-white mb-6">
          Page Not Found
        </h2>
        
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/"
            className="inline-flex items-center justify-center w-full sm:w-auto px-8 py-4 bg-[#0a2472] dark:bg-white text-white dark:text-[#0a2472] font-bold rounded-full hover:opacity-90 transition-opacity"
          >
            <Home className="w-5 h-5 mr-2" />
            Back to Home
          </Link>
          
          <Link
            to="/contact"
            className="inline-flex items-center justify-center w-full sm:w-auto px-8 py-4 bg-white dark:bg-white/10 text-[#0a2472] dark:text-white font-bold rounded-full border-2 border-gray-100 dark:border-white/20 hover:bg-gray-50 dark:hover:bg-white/20 transition-colors"
          >
            <Search className="w-5 h-5 mr-2" />
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
}
