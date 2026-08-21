import { useEffect, useState } from 'react';
import Terminal3D from './Terminal3D.jsx';

const WORDS = ['IGNITE', 'YOUR', 'AI', 'JOURNEY'];

export default function Hero() {
  const [revealedWords, setRevealedWords] = useState(0);
  const [aiPromptOpen, setAiPromptOpen] = useState(false);

  useEffect(() => {
    if (revealedWords >= WORDS.length) return;

    const timer = setTimeout(() => {
      setRevealedWords((count) => count + 1);
    }, 180);

    return () => clearTimeout(timer);
  }, [revealedWords]);

  return (
    <section className="hero" id="home">
      <div className="hero-bg" aria-hidden="true">
        <div className="hero-orb hero-orb-1" />
        <div className="hero-orb hero-orb-2" />
        <div className="hero-grid" />
      </div>

      <div className="hero-content">
        <div className="hero-text">
          <h1 className="hero-headline">
            {WORDS.map((word, index) => (
              <span
                key={word}
                className={`hero-word ${index < revealedWords ? 'visible' : ''}`}
                style={{ transitionDelay: `${index * 0.08}s` }}
              >
                {word}
              </span>
            ))}
          </h1>

          <p className="hero-description">
            Empowering the next generation of technologists to solve real-world challenges
            in Tanzania through collaborative excellence in AI and Signal Processing.
          </p>

          <div className="hero-actions">
            <a href="#join" className="btn btn-primary">
              <span>Join Us</span>
            </a>
            <a href="#work" className="btn btn-secondary">
              <span>View Work</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M5 12h14M13 6l6 6-6 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          </div>

          <button
            type="button"
            className={`hero-ai-prompt ${aiPromptOpen ? 'open' : ''}`}
            onClick={() => setAiPromptOpen((open) => !open)}
          >
            <span className="ai-icon" aria-hidden="true">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path
                  d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.86 9.86 0 01-4.255-.964L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <span className="ai-label">Ask Our AI About Us</span>
          </button>

          {aiPromptOpen && (
            <div className="ai-chat-preview">
              <div className="ai-message ai-message-bot">
                Hi! I&apos;m the AI Hub assistant. Ask me about our projects, events, or how to join.
              </div>
              <div className="ai-input-row">
                <input type="text" placeholder="Type your question..." />
                <button type="button">Send</button>
              </div>
            </div>
          )}
        </div>

        <div className="hero-terminal">
          <Terminal3D />
        </div>
      </div>
    </section>
  );
}
