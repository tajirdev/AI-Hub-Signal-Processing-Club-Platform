import { useEffect, useRef, useState } from 'react';

const TERMINAL_LINES = [
  { text: '$ pip install "AI_Hub[standard]"', delay: 400 },
  { text: 'Collecting AI_Hub', delay: 800 },
  { text: 'Downloading AI_Hub-1.0.0', delay: 1200 },
  { text: 'Installing collected packages...', delay: 1600 },
  { text: '████████████████████ 100%', delay: 2200, isProgress: true },
  { text: '✓ Successfully installed AI_Hub-1.0.0', delay: 2800, isSuccess: true },
];

export default function Terminal3D() {
  const containerRef = useRef(null);
  const [visibleLines, setVisibleLines] = useState([]);
  const [cursorVisible, setCursorVisible] = useState(true);
  const [tilt, setTilt] = useState({ x: 8, y: -12 });

  useEffect(() => {
    const timers = TERMINAL_LINES.map((line) =>
      setTimeout(() => {
        setVisibleLines((prev) => [...prev, line]);
      }, line.delay),
    );

    return () => timers.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCursorVisible((prev) => !prev);
    }, 530);

    return () => clearInterval(interval);
  }, []);

  const handleMouseMove = (event) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;

    setTilt({
      x: 8 + y * -18,
      y: -12 + x * 24,
    });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 8, y: -12 });
  };

  return (
    <div
      className="terminal-scene"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className="terminal-glow" aria-hidden="true" />
      <div
        className="terminal-3d"
        style={{
          transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        }}
      >
        <div className="terminal-shell">
          <div className="terminal-header">
            <div className="terminal-dots">
              <span className="dot red" />
              <span className="dot yellow" />
              <span className="dot green" />
            </div>
            <span className="terminal-title">AI HUB TERMINAL</span>
          </div>

          <div className="terminal-body">
            {visibleLines.map((line, index) => (
              <div
                key={line.text}
                className={`terminal-line ${line.isSuccess ? 'success' : ''} ${line.isProgress ? 'progress' : ''}`}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                {line.text}
              </div>
            ))}
            <div className="terminal-prompt">
              <span>$ </span>
              <span className={`terminal-cursor ${cursorVisible ? 'visible' : ''}`}>_</span>
            </div>
          </div>
        </div>

        <div className="terminal-edge terminal-edge-right" aria-hidden="true" />
        <div className="terminal-edge terminal-edge-bottom" aria-hidden="true" />
      </div>
    </div>
  );
}
