import { useEffect, useState } from 'react';
import Navbar from './components/navbar.jsx';
import Hero from './components/hero.jsx';
import StatsStrip from './components/StatsStrip.jsx';
import Footer from './components/footer.jsx';
import './App.css';
import './components/StatsStrip.css';

function App() {
  const [isDarkTheme, setIsDarkTheme] = useState(() => {
    if (typeof window === 'undefined') {
      return false;
    }

    const savedTheme = localStorage.getItem('theme-mode');

    if (savedTheme) {
      return savedTheme === 'dark';
    }

    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    localStorage.setItem('theme-mode', isDarkTheme ? 'dark' : 'light');
  }, [isDarkTheme]);

  return (
    <div className={`app-shell ${isDarkTheme ? 'theme-dark' : ''}`}>
      <Navbar isDarkTheme={isDarkTheme} setIsDarkTheme={setIsDarkTheme} />
      <main>
        <Hero />
        <StatsStrip />
      </main>
      <Footer />
    </div>
  );
}

export default App;
