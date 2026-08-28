import { useState, useEffect, useRef } from 'react';
import { cn } from '../../../utils/cn';

export function Terminal3D() {
  const [step, setStep] = useState(0);
  const [typedText, setTypedText] = useState('');
  const [rotation, setRotation] = useState({ x: 5, y: -10 });
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef(null);

  const commands = [
    { text: 'pip install "AI_Hub[standard]"', type: 'input' },
    { text: 'Installing components...', type: 'process', delay: 800 },
    { text: 'Building wheels...', type: 'process', delay: 1200 },
    { text: 'Successfully installed AI_Hub-1.0.0', type: 'success', delay: 600 },
    { text: 'python run AI_HUB', type: 'input', delay: 800 },
    { text: 'Empowering the next generation of technologists to solve real-world challenges in Tanzania through collaborative excellence in AI and Signal Processing.', type: 'mission', delay: 1000 }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    
    let timeout;
    let charIndex = 0;

    const runStep = () => {
      if (step >= commands.length) return;
      
      const current = commands[step];
      
      if (current.type === 'input') {
        const typeChar = () => {
          if (charIndex < current.text.length) {
            setTypedText(current.text.slice(0, charIndex + 1));
            charIndex++;
            timeout = setTimeout(typeChar, 40);
          } else {
            timeout = setTimeout(() => {
              setStep(s => s + 1);
              setTypedText('');
            }, current.delay || 500);
          }
        };
        typeChar();
      } else {
        timeout = setTimeout(() => {
          setStep(s => s + 1);
        }, current.delay || 500);
      }
    };

    runStep();

    return () => clearTimeout(timeout);
  }, [step, isVisible]);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Calculate distance from center (-1 to 1)
    const normalizedX = (e.clientX - centerX) / (rect.width / 2);
    const normalizedY = (e.clientY - centerY) / (rect.height / 2);
    
    // Limit rotation to max 15 degrees
    setRotation({
      x: -normalizedY * 15,
      y: normalizedX * 15
    });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    // Return to default resting position
    setRotation({ x: 5, y: -10 });
  };

  return (
    <div 
      className="w-full max-w-lg mx-auto md:max-w-none md:ml-auto perspective-[1000px] z-20"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div 
        className={cn(
          "bg-[#0f172a] rounded-xl border border-gray-800 shadow-2xl overflow-hidden transform-gpu",
          isHovered ? "transition-none" : "transition-transform duration-700 ease-out"
        )}
        style={{
          transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`
        }}
      >
        
        {/* Terminal Header */}
        <div className="bg-[#1e293b] px-3 py-2 md:px-4 md:py-3 flex items-center gap-2 border-b border-gray-800">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-red-500"></div>
            <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-amber-500"></div>
            <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-green-500"></div>
          </div>
          <div className="flex-1 text-center text-[10px] md:text-xs font-mono text-gray-400">user@SigniAI:~</div>
        </div>

        {/* Terminal Body */}
        <div className="p-4 md:p-6 font-mono text-xs md:text-sm leading-relaxed min-h-[240px] max-h-[280px] md:min-h-[320px] md:max-h-[380px] overflow-y-auto">
          {commands.slice(0, step).map((cmd, i) => (
            <div key={i} className="mb-2 md:mb-3">
              {cmd.type === 'input' && (
                <div className="flex">
                  <span className="text-green-400 mr-2">$</span>
                  <span className="text-gray-100">{cmd.text}</span>
                </div>
              )}
              {cmd.type === 'process' && <div className="text-gray-400">{cmd.text}</div>}
              {cmd.type === 'success' && <div className="text-blue-400">{cmd.text}</div>}
              {cmd.type === 'mission' && (
                <div className="mt-3 md:mt-4 p-3 md:p-4 border border-amber/30 bg-amber/5 rounded text-amber-soft font-semibold leading-relaxed animate-fade-in text-[11px] md:text-sm">
                  "{cmd.text}"
                </div>
              )}
            </div>
          ))}
          
          {step < commands.length && commands[step].type === 'input' && (
            <div className="flex">
              <span className="text-green-400 mr-2">$</span>
              <span className="text-gray-100">{typedText}</span>
              <span className="w-2 h-4 bg-gray-400 ml-1 animate-pulse"></span>
            </div>
          )}
          
          {step >= commands.length && (
            <div className="flex mt-2">
              <span className="text-green-400 mr-2">$</span>
              <span className="w-2 h-4 bg-gray-400 animate-pulse"></span>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
