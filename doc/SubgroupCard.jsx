import { useState } from "react";
import { Waves, Cpu, Sparkles, Crown, ArrowRight, Sun, Moon } from "lucide-react";

const BRAND = {
  navy: "#0a2472",
  navyDark: "#061539",
  amber: "#ffba08",
};

// Swap this for real subgroup data. Each entry needs: id, name, slug,
// description, leader, icon (a lucide-react component), and pattern
// ("wave" | "circuit" | "node") for the cover art.
const GROUPS = [
  {
    id: "signal-processing",
    name: "Signal Processing Group",
    slug: "signal-processing",
    description:
      "Digital filters, spectral analysis, and real-time DSP, from audio pipelines to RF systems.",
    leader: "Baraka Mushi",
    icon: Waves,
    pattern: "wave",
  },
  {
    id: "machine-learning",
    name: "Machine Learning Group",
    slug: "machine-learning",
    description:
      "Neural networks and applied ML. Weekly paper reads, then building the thing the paper described.",
    leader: "Neema Kessy",
    icon: Sparkles,
    pattern: "node",
  },
  {
    id: "embedded-iot",
    name: "Embedded Systems Group",
    slug: "embedded-iot",
    description:
      "Microcontrollers and sensor networks. ESP32 builds, PCB layout, and firmware.",
    leader: "Elias Mwakalinga",
    icon: Cpu,
    pattern: "circuit",
  },
];

function CoverArt({ pattern, uid }) {
  const bgId = `cover-bg-${uid}`;
  return (
    <svg width="100%" height="100%" viewBox="0 0 400 150" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id={bgId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={BRAND.navy} />
          <stop offset="100%" stopColor={BRAND.navyDark} />
        </linearGradient>
      </defs>
      <rect width="400" height="150" fill={`url(#${bgId})`} />

      {pattern === "wave" && (
        <g fill="none" stroke={BRAND.amber}>
          <path
            d="M-10,90 C40,40 90,140 140,90 C190,40 240,140 290,90 C340,40 390,140 410,90"
            strokeWidth="2"
            opacity="0.55"
          />
          <path
            d="M-10,118 C40,78 90,158 140,118 C190,78 240,158 290,118 C340,78 390,158 410,118"
            strokeWidth="1.5"
            opacity="0.3"
          />
          <path
            d="M-10,58 C40,18 90,98 140,58 C190,18 240,98 290,58 C340,18 390,98 410,58"
            stroke="#ffffff"
            strokeWidth="1"
            opacity="0.15"
          />
        </g>
      )}

      {pattern === "circuit" && (
        <g fill="none" stroke={BRAND.amber} strokeWidth="1.5" opacity="0.45">
          <path d="M20,25 H130 V65 H210" />
          <path d="M20,125 H95 V90 H190 V50 H390" />
          <path d="M260,20 V70 H330 V115 H400" />
          <g fill={BRAND.amber} stroke="none" opacity="0.85">
            <circle cx="130" cy="25" r="3" />
            <circle cx="210" cy="65" r="3" />
            <circle cx="190" cy="90" r="3" />
            <circle cx="330" cy="70" r="3" />
            <circle cx="95" cy="125" r="3" />
          </g>
        </g>
      )}

      {pattern === "node" && (
        <g>
          <g stroke={BRAND.amber} strokeWidth="1" opacity="0.35">
            <line x1="40" y1="40" x2="130" y2="85" />
            <line x1="130" y1="85" x2="215" y2="30" />
            <line x1="215" y1="30" x2="300" y2="95" />
            <line x1="300" y1="95" x2="375" y2="50" />
            <line x1="130" y1="85" x2="190" y2="125" />
            <line x1="215" y1="30" x2="270" y2="115" />
          </g>
          <g fill={BRAND.amber}>
            <circle cx="40" cy="40" r="4" opacity="0.7" />
            <circle cx="130" cy="85" r="5" opacity="0.9" />
            <circle cx="215" cy="30" r="4" opacity="0.7" />
            <circle cx="300" cy="95" r="5" opacity="0.9" />
            <circle cx="375" cy="50" r="4" opacity="0.7" />
            <circle cx="190" cy="125" r="3" opacity="0.5" />
            <circle cx="270" cy="115" r="3" opacity="0.5" />
          </g>
        </g>
      )}
    </svg>
  );
}

function SubgroupCard({ group, theme }) {
  const dark = theme === "dark";
  const Icon = group.icon;

  return (
    <div
      className="relative w-full rounded-3xl overflow-hidden shadow-xl transition-transform duration-300 hover:-translate-y-1"
      style={{
        backgroundColor: dark ? BRAND.navyDark : "#ffffff",
        border: dark ? "1px solid rgba(255,255,255,0.07)" : "1px solid rgba(10,36,114,0.08)",
      }}
    >
      {/* Cover image */}
      <div className="h-28 w-full overflow-hidden">
        <CoverArt pattern={group.pattern} uid={group.id} />
      </div>

      {/* Subgroup icon, overlapping the seam, left-aligned */}
      <div
        className="absolute left-6 top-28 -translate-y-8 w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg"
        style={{
          backgroundColor: BRAND.navy,
          border: `4px solid ${dark ? BRAND.navyDark : "#ffffff"}`,
        }}
      >
        <Icon className="w-7 h-7" style={{ color: BRAND.amber }} />
      </div>

      {/* Body */}
      <div className="px-6 pt-10 pb-6">
        <h3 className="text-lg font-bold" style={{ color: dark ? "#ffffff" : BRAND.navy }}>
          {group.name}
        </h3>

        <span
          className="inline-block mt-2 rounded-full px-3 py-1 text-xs font-mono backdrop-blur-md"
          style={{
            backgroundColor: dark ? "rgba(255,255,255,0.08)" : "rgba(10,36,114,0.06)",
            color: dark ? BRAND.amber : BRAND.navy,
            border: `1px solid ${dark ? "rgba(255,186,8,0.25)" : "rgba(10,36,114,0.15)"}`,
          }}
        >
          /{group.slug}
        </span>

        <p
          className="mt-3 text-sm leading-relaxed"
          style={{ color: dark ? "rgba(255,255,255,0.65)" : "rgba(10,36,114,0.62)" }}
        >
          {group.description}
        </p>

        <div
          className="mt-4 flex items-center gap-2.5 pt-4"
          style={{ borderTop: `1px solid ${dark ? "rgba(255,255,255,0.08)" : "rgba(10,36,114,0.08)"}` }}
        >
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: "rgba(255,186,8,0.15)" }}
          >
            <Crown className="w-3.5 h-3.5" style={{ color: BRAND.amber }} />
          </div>
          <span className="text-sm font-medium" style={{ color: dark ? "#ffffff" : BRAND.navy }}>
            Led by {group.leader}
          </span>
        </div>

        <button
          className="mt-5 w-full rounded-full py-3 text-sm font-semibold flex items-center justify-center gap-1.5 transition-opacity hover:opacity-90"
          style={{
            background: `linear-gradient(135deg, ${BRAND.navy}, ${BRAND.amber})`,
            color: "#ffffff",
          }}
        >
          Join Us
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export default function SubgroupCardShowcase() {
  const [theme, setTheme] = useState("dark");
  const dark = theme === "dark";

  return (
    <div
      className="min-h-screen w-full transition-colors duration-300 p-6 sm:p-10"
      style={{ backgroundColor: dark ? "#050b1f" : "#f4f6fb" }}
    >
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-xl font-bold" style={{ color: dark ? "#ffffff" : BRAND.navy }}>
              Club Subgroups
            </h2>
            <p
              className="text-sm mt-1"
              style={{ color: dark ? "rgba(255,255,255,0.5)" : "rgba(10,36,114,0.55)" }}
            >
              AI Hub & Signal Processing Club
            </p>
          </div>
          <button
            onClick={() => setTheme(dark ? "light" : "dark")}
            className="w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300"
            style={{
              backgroundColor: dark ? "rgba(255,255,255,0.08)" : "rgba(10,36,114,0.06)",
              color: dark ? BRAND.amber : BRAND.navy,
            }}
            aria-label="Toggle theme"
          >
            {dark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {GROUPS.map((group) => (
            <SubgroupCard key={group.id} group={group} theme={theme} />
          ))}
        </div>
      </div>
    </div>
  );
}
