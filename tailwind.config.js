// tailwind.config.js
// Apex DriveOS Customer Website — Tailwind configuration
// Dark luxury design system with Playfair Display + Inter

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // ── Brand palette ────────────────────────────────────────
        gold: {
          DEFAULT: "#D4AF37",
          light: "#E8C84A",
          dark: "#B8931F",
          dim: "rgba(212,175,55,0.12)",
        },
        // ── Background layers ────────────────────────────────────
        site: {
          bg: "#050A14", // deepest background
          surface: "#0B1120", // section backgrounds
          card: "#0D1829", // card surfaces
          border: "rgba(212,175,55,0.12)",
        },
        // ── Text ─────────────────────────────────────────────────
        cream: "#F8F6F0", // warm white — primary text
        muted: "#94A3B8",
        subtle: "#475569",
      },
      fontFamily: {
        display: ["Playfair Display", "Georgia", "serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      fontSize: {
        // Display sizes for hero headlines
        "display-2xl": [
          "clamp(3rem,8vw,6rem)",
          { lineHeight: "1.05", letterSpacing: "-0.02em" },
        ],
        "display-xl": [
          "clamp(2.5rem,6vw,4.5rem)",
          { lineHeight: "1.08", letterSpacing: "-0.02em" },
        ],
        "display-lg": [
          "clamp(2rem,4vw,3rem)",
          { lineHeight: "1.1", letterSpacing: "-0.01em" },
        ],
        "display-md": ["clamp(1.5rem,3vw,2.25rem)", { lineHeight: "1.15" }],
      },
      letterSpacing: {
        luxury: "0.25em",
        widest2: "0.35em",
      },
      backgroundImage: {
        "gold-gradient": "linear-gradient(135deg, #B8931F, #D4AF37, #E8C84A)",
        "gold-shimmer":
          "linear-gradient(90deg, transparent, rgba(212,175,55,0.3), transparent)",
        "dark-vignette":
          "radial-gradient(ellipse at center, transparent 40%, #050A14 100%)",
        "hero-overlay":
          "linear-gradient(to right, rgba(5,10,20,0.85) 40%, rgba(5,10,20,0.3) 100%)",
        "hero-overlay-sm":
          "linear-gradient(to bottom, rgba(5,10,20,0.5) 0%, rgba(5,10,20,0.9) 100%)",
      },
      boxShadow: {
        "gold-glow": "0 0 40px rgba(212,175,55,0.15)",
        "gold-sm": "0 0 20px rgba(212,175,55,0.1)",
        "card-dark": "0 4px 24px rgba(0,0,0,0.4)",
        "card-hover":
          "0 8px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(212,175,55,0.15)",
      },
      animation: {
        shimmer: "shimmer 2.5s infinite",
        float: "float 6s ease-in-out infinite",
        "pulse-gold": "pulseGold 2s ease-in-out infinite",
        "scroll-hint": "scrollHint 1.5s ease-in-out infinite",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        pulseGold: {
          "0%, 100%": { opacity: 1 },
          "50%": { opacity: 0.6 },
        },
        scrollHint: {
          "0%, 100%": { transform: "translateY(0)", opacity: 1 },
          "50%": { transform: "translateY(6px)", opacity: 0.5 },
        },
      },
      transitionTimingFunction: {
        luxury: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [],
};
