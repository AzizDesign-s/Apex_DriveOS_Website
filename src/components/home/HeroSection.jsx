// src/components/home/HeroSection.jsx
// Full-viewport hero with GSAP text animation + scroll indicator.
// Vehicle background: high-quality Unsplash image.
// On mobile: gradient covers more of the image for readability.

import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

// Hero background — cinematic Rolls Royce image
const HERO_IMAGE =
  "https://images.unsplash.com/photo-1631295868223-63265b40d9e4?w=1920&q=85";

function HeroSection() {
  const headlineRef = useRef(null);
  const sublineRef = useRef(null);
  const ctaRef = useRef(null);
  const labelRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Staggered entrance timeline
      const tl = gsap.timeline({ delay: 0.3 });

      // Label slides down
      tl.fromTo(
        labelRef.current,
        { opacity: 0, y: -16 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
      );

      // Headline words animate in one by one
      const words = headlineRef.current?.querySelectorAll(".hero-word");
      if (words?.length) {
        tl.fromTo(
          words,
          { opacity: 0, y: 40, rotateX: -15 },
          {
            opacity: 1,
            y: 0,
            rotateX: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: "power3.out",
          },
          "-=0.2",
        );
      }

      // Subline fades in
      tl.fromTo(
        sublineRef.current,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" },
        "-=0.4",
      );

      // CTAs appear
      tl.fromTo(
        ctaRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
        "-=0.3",
      );
    });

    return () => ctx.revert();
  }, []);

  const headline = "Drive Beyond Ordinary";
  const words = headline.split(" ");

  return (
    <section
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{ background: "#050A14" }}
    >
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src={HERO_IMAGE}
          alt="Luxury Vehicle"
          className="w-full h-full object-cover object-center"
          style={{ opacity: 0.55 }}
        />
        {/* Gradient overlay — desktop: left-heavy, mobile: bottom-heavy */}
        <div
          className="absolute inset-0 hidden sm:block"
          style={{
            background:
              "linear-gradient(to right, rgba(5,10,20,0.92) 35%, rgba(5,10,20,0.4) 70%, rgba(5,10,20,0.6) 100%)",
          }}
        />
        <div
          className="absolute inset-0 sm:hidden"
          style={{
            background:
              "linear-gradient(to bottom, rgba(5,10,20,0.5) 0%, rgba(5,10,20,0.95) 75%)",
          }}
        />
        {/* Bottom fade to connect with next section */}
        <div
          className="absolute bottom-0 left-0 right-0 h-40"
          style={{
            background: "linear-gradient(to top, #050A14, transparent)",
          }}
        />
      </div>

      {/* Content */}
      <div className="container-site relative z-10 pt-32 pb-24">
        <div className="max-w-3xl">
          {/* Label */}
          <p ref={labelRef} className="label-luxury mb-6 opacity-0">
            AjiX Technologies · Apex DriveOS
          </p>

          {/* Gold rule */}
          <motion.div
            className="gold-rule mb-8"
            initial={{ scaleX: 0, originX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.5, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          />

          {/* Headline — word by word */}
          <h1
            ref={headlineRef}
            className="font-display mb-6"
            style={{
              fontSize: "clamp(3rem, 8vw, 6.5rem)",
              lineHeight: 1.0,
              letterSpacing: "-0.02em",
              color: "#F8F6F0",
              fontWeight: 600,
              perspective: "1000px",
            }}
          >
            {words.map((word, i) => (
              <span
                key={i}
                className="hero-word inline-block mr-[0.2em] opacity-0"
                style={{
                  // Last word in gold
                  color: i === words.length - 1 ? "#D4AF37" : "#F8F6F0",
                }}
              >
                {word}
              </span>
            ))}
          </h1>

          {/* Subline */}
          <p
            ref={sublineRef}
            className="text-lg leading-relaxed mb-12 max-w-xl opacity-0"
            style={{ color: "rgba(248,246,240,0.6)" }}
          >
            The Middle East's premier luxury automotive experience. Discover an
            exclusive collection of the world's finest vehicles — curated for
            those who demand perfection.
          </p>

          {/* CTAs */}
          <div
            ref={ctaRef}
            className="flex flex-wrap items-center gap-4 opacity-0"
          >
            <Link to="/cars" className="btn-gold">
              Explore Collection
            </Link>
            <Link to="/test-drive" className="btn-ghost">
              Book Test Drive
            </Link>
          </div>

          {/* Stats strip below CTAs */}
          <motion.div
            className="flex items-center gap-8 mt-16 pt-8"
            style={{ borderTop: "1px solid rgba(212,175,55,0.1)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4, duration: 0.8 }}
          >
            {[
              { value: "50+", label: "Luxury Vehicles" },
              { value: "15+", label: "Premium Brands" },
              { value: "500+", label: "Happy Clients" },
            ].map((stat) => (
              <div key={stat.label}>
                <p
                  className="font-display text-2xl font-bold"
                  style={{ color: "#D4AF37" }}
                >
                  {stat.value}
                </p>
                <p
                  className="text-[10px] font-semibold tracking-[0.2em] uppercase mt-1"
                  style={{ color: "rgba(248,246,240,0.4)" }}
                >
                  {stat.label}
                </p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2
                   flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 0.6 }}
      >
        <span
          className="text-[9px] font-semibold tracking-[0.3em] uppercase"
          style={{ color: "rgba(248,246,240,0.3)" }}
        >
          Scroll
        </span>
        <ChevronDown
          size={16}
          className="animate-scroll-hint"
          style={{ color: "#D4AF37" }}
        />
      </motion.div>
    </section>
  );
}

export default HeroSection;
