import React from 'react';

const LogoZindi = () => (
  <svg height="36" viewBox="0 0 120 40" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M10,10 L30,10 L15,30 L35,30" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    <text x="45" y="28" fontSize="22" fontWeight="900" letterSpacing="2">ZINDI</text>
  </svg>
);

const LogoInstaDeep = () => (
  <svg height="36" viewBox="0 0 160 40" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M10,20 C10,10 20,10 20,20 C20,30 30,30 30,20 C30,10 40,10 40,20" stroke="currentColor" strokeWidth="3" strokeLinecap="round" fill="none"/>
    <text x="46" y="28" fontSize="20" fontWeight="700">InstaDeep</text>
  </svg>
);

const LogoDSA = () => (
  <svg height="36" viewBox="0 0 140 40" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <circle cx="20" cy="20" r="10" stroke="currentColor" strokeWidth="3" fill="none" strokeDasharray="4 2"/>
    <circle cx="20" cy="20" r="4" fill="currentColor"/>
    <text x="40" y="27" fontSize="20" fontWeight="800">DSA Africa</text>
  </svg>
);

const LogoIndaba = () => (
  <svg height="36" viewBox="0 0 150 40" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M20,5 L35,20 L20,35 L5,20 Z" stroke="currentColor" strokeWidth="3" fill="none"/>
    <path d="M20,12 L28,20 L20,28 L12,20 Z" fill="currentColor"/>
    <text x="45" y="27" fontSize="18" fontWeight="bold">DL Indaba</text>
  </svg>
);

const LogoAerobotics = () => (
  <svg height="36" viewBox="0 0 150 40" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M20,10 Q30,5 30,20 Q30,35 20,30 Q10,35 10,20 Q10,5 20,10" stroke="currentColor" strokeWidth="2" fill="none"/>
    <circle cx="20" cy="20" r="3" fill="currentColor"/>
    <text x="42" y="26" fontSize="18" fontWeight="600" letterSpacing="1">Aerobotics</text>
  </svg>
);

const LogoGoogleAfrica = () => (
  <svg height="36" viewBox="0 0 160 40" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M25,20 A10,10 0 1,1 25,10 L25,15 A5,5 0 1,0 25,25 L25,20 Z" fill="currentColor"/>
    <text x="40" y="27" fontSize="19" fontWeight="bold" fontFamily="sans-serif">Google <tspan fontWeight="normal">Africa</tspan></text>
  </svg>
);

const LogoAISaturdays = () => (
  <svg height="36" viewBox="0 0 150 40" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <rect x="5" y="10" width="24" height="20" rx="4" stroke="currentColor" strokeWidth="2.5" fill="none"/>
    <line x1="5" y1="16" x2="29" y2="16" stroke="currentColor" strokeWidth="2.5"/>
    <line x1="10" y1="6" x2="10" y2="12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
    <line x1="24" y1="6" x2="24" y2="12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
    <text x="38" y="27" fontSize="18" fontWeight="900" fontStyle="italic">AI6</text>
    <text x="75" y="27" fontSize="14" fontWeight="500">Lagos</text>
  </svg>
);

const LogoAlliance = () => (
  <svg height="36" viewBox="0 0 150 40" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M15,15 L25,5 L35,15 M25,5 L25,35" stroke="currentColor" strokeWidth="3" strokeLinecap="round" fill="none"/>
    <path d="M5,25 L15,35 L25,25" stroke="currentColor" strokeWidth="3" strokeLinecap="round" fill="none"/>
    <text x="45" y="27" fontSize="18" fontWeight="bold">Alliance4AI</text>
  </svg>
);

const LogoBboxx = () => (
  <svg height="36" viewBox="0 0 120 40" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <rect x="5" y="10" width="20" height="20" stroke="currentColor" strokeWidth="3" fill="none"/>
    <rect x="10" y="15" width="10" height="10" fill="currentColor"/>
    <text x="35" y="27" fontSize="20" fontWeight="900" letterSpacing="-0.5">Bboxx</text>
  </svg>
);

const LogoMara = () => (
  <svg height="36" viewBox="0 0 110 40" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M5,30 L15,10 L25,25 L35,10 L45,30" stroke="currentColor" strokeWidth="4" strokeLinejoin="round" strokeLinecap="round" fill="none"/>
    <text x="55" y="27" fontSize="19" fontWeight="800">MARA</text>
  </svg>
);

const LogoCelo = () => (
  <svg height="36" viewBox="0 0 130 40" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <circle cx="15" cy="20" r="8" stroke="currentColor" strokeWidth="3" fill="none"/>
    <circle cx="25" cy="20" r="8" stroke="currentColor" strokeWidth="3" fill="none"/>
    <text x="42" y="27" fontSize="19" fontWeight="bold">Celo Africa</text>
  </svg>
);

const LogoAndela = () => (
  <svg height="36" viewBox="0 0 130 40" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M10,30 L20,10 L30,30" stroke="currentColor" strokeWidth="4" strokeLinejoin="round" fill="none"/>
    <line x1="15" y1="22" x2="25" y2="22" stroke="currentColor" strokeWidth="4"/>
    <text x="40" y="27" fontSize="20" fontWeight="900">Andela</text>
  </svg>
);

// We need enough logos to fill the screen twice for seamless scrolling
const ROW_1 = [
  LogoInstaDeep,
  LogoZindi,
  LogoDSA,
  LogoIndaba,
  LogoAerobotics,
  LogoAndela,
];

const ROW_2 = [
  LogoGoogleAfrica,
  LogoAISaturdays,
  LogoAlliance,
  LogoBboxx,
  LogoMara,
  LogoCelo,
];

export function SponsorsSection() {
  return (
    <section className="py-20 md:py-28 overflow-hidden">
      <div className="max-w-[1280px] mx-auto px-6 md:px-8 text-center mb-14">
        <h2 className="text-gray-600 dark:text-gray-400 text-xl md:text-2xl font-medium mb-1">
          Join some of
        </h2>
        <p className="text-gray-900 dark:text-white text-3xl md:text-5xl font-black font-heading tracking-tight">
          the best AI brands in Africa
        </p>
      </div>
      
      {/* Marquees */}
      <div className="relative w-full flex flex-col gap-10 md:gap-14 overflow-hidden">
        {/* Fade gradients on edges */}
        <div className="absolute inset-y-0 left-0 w-24 md:w-48 bg-gradient-to-r from-gray-50 dark:from-[#071225] to-transparent z-10 pointer-events-none"></div>
        <div className="absolute inset-y-0 right-0 w-24 md:w-48 bg-gradient-to-l from-gray-50 dark:from-[#071225] to-transparent z-10 pointer-events-none"></div>
        
        {/* Row 1 - Scroll Left */}
        <div className="flex animate-marquee-left whitespace-nowrap items-center w-max">
          {[...ROW_1, ...ROW_1, ...ROW_1].map((Logo, i) => (
            <div key={i} className="flex items-center justify-center mx-10 md:mx-16 text-gray-800 hover:text-black dark:text-gray-400 dark:hover:text-white transition-colors duration-300">
              <Logo />
            </div>
          ))}
        </div>

        {/* Row 2 - Scroll Right */}
        <div className="flex animate-marquee-right whitespace-nowrap items-center w-max">
          {[...ROW_2, ...ROW_2, ...ROW_2].map((Logo, i) => (
            <div key={i} className="flex items-center justify-center mx-10 md:mx-16 text-gray-800 hover:text-black dark:text-gray-400 dark:hover:text-white transition-colors duration-300">
              <Logo />
            </div>
          ))}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes marqueeLeft {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-33.33333%); }
        }
        @keyframes marqueeRight {
          0% { transform: translateX(-33.33333%); }
          100% { transform: translateX(0%); }
        }
        .animate-marquee-left {
          animation: marqueeLeft 35s linear infinite;
        }
        .animate-marquee-right {
          animation: marqueeRight 35s linear infinite;
        }
        
        /* Pause on hover */
        .animate-marquee-left:hover, .animate-marquee-right:hover {
          animation-play-state: paused;
        }
      `}} />
    </section>
  );
}
