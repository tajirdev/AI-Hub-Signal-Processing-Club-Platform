import { useEffect, useState } from 'react';

const NAV_GROUPS = [
  { label: 'Home', href: '/' },
  {
    label: 'About',
    href: '/about',
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
    href: '/initiatives',
    items: [
      { label: 'Sub-Groups', href: '/sub-groups' },
      { label: 'Research', href: '/research' },
      { label: 'Projects', href: '/projects' },
    ],
  },
  {
    label: 'Community',
    href: '/community',
    items: [
      { label: 'Events', href: '/events' },
      { label: 'Blog / News', href: '/blog' },
      { label: 'Resources', href: '/resources' },
    ],
  },
];

export default function Navbar({ isDarkTheme, setIsDarkTheme }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const toggleDropdown = (label) => {
    setOpenDropdown((current) => (current === label ? null : label));
  };

  return (
    <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <div className="navbar-inner">
        <a href="/" className="navbar-brand">
          <img src="/logo.png" alt="AI Hub Logo" className="navbar-logo-img" />
          <div className="navbar-brand-text">
            <span className="brand-ai">AI &</span>
            <span className="brand-sub">Signal Processing Hub</span>
          </div>
        </a>

        <div className={`navbar-links ${menuOpen ? 'open' : ''}`}>
          <div className="navbar-menu">
            {NAV_GROUPS.map((group) => {
              const hasDropdown = Array.isArray(group.items) && group.items.length > 0;
              const isOpen = openDropdown === group.label;

              return (
                <div
                  key={group.label}
                  className={`nav-group ${hasDropdown ? 'has-dropdown' : ''} ${isOpen ? 'open' : ''}`}
                >
                  {hasDropdown ? (
                    <button
                      type="button"
                      className="nav-toggle"
                      aria-expanded={isOpen}
                      onClick={() => toggleDropdown(group.label)}
                    >
                      <span>{group.label}</span>
                      <span className="nav-caret">▾</span>
                    </button>
                  ) : (
                    <a
                      href={group.href}
                      className="nav-link"
                      onClick={() => setMenuOpen(false)}
                    >
                      {group.label}
                    </a>
                  )}

                  {hasDropdown && (
                    <div className="nav-dropdown">
                      <a
                        href={group.href}
                        className="nav-dropdown-link nav-dropdown-heading"
                        onClick={() => {
                          setMenuOpen(false);
                          setOpenDropdown(null);
                        }}
                      >
                        {group.label}
                      </a>
                      {group.items.map((item) => (
                        <a
                          key={item.label}
                          href={item.href}
                          className="nav-dropdown-link"
                          onClick={() => {
                            setMenuOpen(false);
                            setOpenDropdown(null);
                          }}
                        >
                          {item.label}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="navbar-actions">
          <button
            type="button"
            className={`theme-toggle ${isDarkTheme ? 'is-dark' : ''}`}
            aria-label={isDarkTheme ? 'Switch to light mode' : 'Switch to dark mode'}
            onClick={() => setIsDarkTheme((current) => !current)}
          >
            <span className="theme-toggle-track">
              <span className="theme-toggle-thumb" />
            </span>
            <span className="theme-toggle-text">{isDarkTheme ? 'Dark' : 'Light'}</span>
          </button>

          <a href="/join" className="btn-join-nav">
            Join Us
          </a>
          <button
            type="button"
            className="navbar-toggle"
            aria-label="Toggle menu"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>
    </nav>
  );
}
