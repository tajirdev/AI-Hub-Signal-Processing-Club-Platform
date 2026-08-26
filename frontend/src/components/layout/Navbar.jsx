import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, Moon, Sun, LogOut, User } from 'lucide-react';
import { cn } from '../../utils/cn';
import { useAuth } from '../../contexts/AuthContext';

const NAV_GROUPS = [
  { label: 'Home', href: '/' },
  {
    label: 'About',
    items: [
      { label: 'Mission', href: '/about#mission' },
      { label: 'History', href: '/about#history' },
      { label: 'Leadership', href: '/about#leadership' },
      { label: 'MUST affiliation', href: '/about#must-affiliation' },
    ],
  },
  { label: 'Members', href: '/members' },
  { label: 'Contact', href: '/contact' },
  {
    label: 'Initiatives',
    items: [
      { label: 'Sub-Groups', href: '/sub-groups' },
      { label: 'Research', href: '/research' },
      { label: 'Projects', href: '/projects' },
    ],
  },
  {
    label: 'Community',
    items: [
      { label: 'Events', href: '/events' },
      { label: 'Blog / News', href: '/blog' },
      { label: 'Resources', href: '/resources' },
    ],
  },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const location = useLocation();
  const { isAuthenticated, logout, user } = useAuth();

  useEffect(() => {
    // Check local storage or system preference on mount
    if (localStorage.getItem('theme-mode') === 'dark' || 
       (!localStorage.getItem('theme-mode') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      const t = setTimeout(() => setIsDarkTheme(true), 0);
      document.documentElement.classList.add('dark');
      return () => clearTimeout(t);
    }
  }, []);

  const toggleTheme = () => {
    if (isDarkTheme) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme-mode', 'light');
      setIsDarkTheme(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme-mode', 'dark');
      setIsDarkTheme(true);
    }
  };

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Close mobile menu on route change
    const t = setTimeout(() => {
      setMobileMenuOpen(false);
      setActiveDropdown(null);
    }, 0);
    return () => clearTimeout(t);
  }, [location.pathname]);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [mobileMenuOpen]);

  return (
    <>
      <nav className={cn(
        'fixed top-0 inset-x-0 z-50 transition-all duration-300',
        mobileMenuOpen 
          ? 'bg-transparent py-3' 
          : isScrolled 
            ? 'bg-white/90 dark:bg-[#071225]/90 backdrop-blur-md shadow-sm border-b border-gray-100 dark:border-gray-800 py-3' 
            : 'bg-transparent py-5'
      )}>
        <div className="max-w-[1280px] mx-auto px-6 md:px-8 flex items-center justify-between">
          
          {/* Brand */}
          <Link to="/" className="flex items-center gap-3 z-50">
            <div className="w-10 h-10 bg-navy rounded-xl flex items-center justify-center text-white font-heading font-black text-xl">
              AI
            </div>
            <div className="flex flex-col">
              <span className={cn("font-heading font-black text-lg leading-none", isScrolled ? "text-navy dark:text-white" : "text-navy dark:text-white")}>AI &</span>
              <span className="font-body text-xs text-gray-500 font-semibold tracking-wide">Signal Processing Hub</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-8">
            {NAV_GROUPS.map((group) => (
              <div 
                key={group.label} 
                className="relative group"
                onMouseEnter={() => setActiveDropdown(group.label)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                {group.href ? (
                  <Link 
                    to={group.href}
                    className={cn(
                      "font-body font-semibold text-[15px] transition-colors",
                      location.pathname === group.href ? "text-amber" : "text-navy hover:text-amber dark:text-gray-200 dark:hover:text-amber"
                    )}
                  >
                    {group.label}
                  </Link>
                ) : (
                  <button className="flex items-center gap-1 font-body font-semibold text-[15px] text-navy hover:text-amber dark:text-gray-200 dark:hover:text-amber transition-colors">
                    {group.label}
                    <ChevronDown className="w-4 h-4 opacity-50" />
                  </button>
                )}

                {/* Dropdown */}
                {group.items && (
                  <div className={cn(
                    "absolute top-full left-0 pt-4 transition-all duration-200 origin-top-left w-48",
                    activeDropdown === group.label ? "opacity-100 scale-100 visible" : "opacity-0 scale-95 invisible"
                  )}>
                    <div className="bg-white dark:bg-surface-dark border border-gray-100 dark:border-gray-800 rounded-xl shadow-medium p-2 flex flex-col gap-1">
                      {group.items.map(item => (
                        <Link 
                          key={item.label}
                          to={item.href}
                          className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-surface-darkAlt hover:text-amber rounded-lg transition-colors"
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="hidden lg:flex items-center gap-4">
            <button 
              onClick={toggleTheme}
              className="w-10 h-10 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle theme"
            >
              {isDarkTheme ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-surface-dark border border-gray-100 dark:border-gray-800">
                  <User className="w-4 h-4 text-navy dark:text-amber" />
                  <span className="text-sm font-bold text-navy dark:text-white truncate max-w-[100px]">
                    {user?.user_name || 'Member'}
                  </span>
                </div>
                <button 
                  onClick={logout}
                  className="p-2.5 rounded-full bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20 transition-colors"
                  aria-label="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/login" className="font-heading font-bold text-navy dark:text-white hover:text-amber dark:hover:text-amber transition-colors text-sm uppercase tracking-wider">
                  Sign In
                </Link>
                <Link to="/join" className="bg-amber hover:bg-amber-hover text-gray-900 font-heading font-bold uppercase tracking-wider text-sm px-6 py-2.5 rounded-full shadow-[0_4px_20px_rgba(255,186,8,0.25)] transition-all hover:-translate-y-0.5">
                  Join Us
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Toggle */}
          <div className="flex lg:hidden items-center gap-4 z-50">
            <button 
              onClick={toggleTheme}
              className="w-10 h-10 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {isDarkTheme ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-navy dark:text-white p-2"
            >
              {mobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div className={cn(
        "fixed inset-0 bg-white dark:bg-[#071225] z-40 lg:hidden flex flex-col pt-24 px-6 overflow-y-auto transition-transform duration-300",
        mobileMenuOpen ? "translate-x-0" : "translate-x-full"
      )}>
        <div className="flex flex-col gap-6 pb-20">
          {NAV_GROUPS.map((group) => (
            <div key={group.label} className="flex flex-col gap-3">
              {group.href ? (
                <Link 
                  to={group.href}
                  className="text-2xl font-heading font-bold text-navy dark:text-white"
                >
                  {group.label}
                </Link>
              ) : (
                <div className="text-2xl font-heading font-bold text-navy dark:text-white pb-2 border-b border-gray-100 dark:border-gray-800">
                  {group.label}
                </div>
              )}
              
              {group.items && (
                <div className="flex flex-col gap-4 pl-4 pt-2">
                  {group.items.map(item => (
                    <Link 
                      key={item.label}
                      to={item.href}
                      className="text-lg font-body text-gray-600 dark:text-gray-300"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
          
          <div className="mt-8 pt-8 border-t border-gray-100 dark:border-gray-800">
            {isAuthenticated ? (
                <div className="flex flex-col gap-3 px-2 mt-2">
                  <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-gray-50 dark:bg-surface-dark border border-gray-100 dark:border-gray-800">
                    <User className="w-5 h-5 text-navy dark:text-amber" />
                    <span className="font-bold text-navy dark:text-white">
                      {user?.user_name || 'Member'}
                    </span>
                  </div>
                  <button 
                    onClick={() => { logout(); setMobileMenuOpen(false); }}
                    className="w-full bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20 font-bold py-4 rounded-2xl transition-colors flex items-center justify-center gap-2"
                  >
                    <LogOut className="w-5 h-5" /> Sign Out
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <Link 
                    to="/login" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center w-full bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 text-navy dark:text-white font-heading font-bold uppercase tracking-wider py-4 rounded-xl text-lg transition-colors border border-gray-100 dark:border-gray-800"
                  >
                    Sign In
                  </Link>
                  <Link 
                    to="/join" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center w-full bg-amber hover:bg-amber-hover text-gray-900 font-heading font-bold uppercase tracking-wider py-4 rounded-xl text-lg transition-colors shadow-lg shadow-amber/10"
                  >
                    Join AI Hub
                  </Link>
                </div>
              )}
          </div>
        </div>
      </div>
    </>
  );
}
