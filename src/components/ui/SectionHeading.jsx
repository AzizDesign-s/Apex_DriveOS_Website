// src/components/ui/SectionHeading.jsx

import { motion } from "framer-motion";

function SectionHeading({
  label, // small gold label above (e.g. "Featured Collection")
  title, // Playfair Display headline
  subtitle, // optional subline in muted text
  centered = false,
  light = false, // if true, uses cream text instead of white
  className = "",
}) {
  return (
    <motion.div
      className={`${centered ? "text-center" : ""} ${className}`}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
    >
      {label && (
        <p className="label-luxury mb-4" style={{ color: "#D4AF37" }}>
          {label}
        </p>
      )}

      {/* Gold rule under label */}
      {label && !centered && <div className="gold-rule mb-5" />}
      {label && centered && (
        <div
          className="mx-auto mb-5"
          style={{
            width: "60px",
            height: "1px",
            background:
              "linear-gradient(90deg, transparent, #D4AF37, transparent)",
          }}
        />
      )}

      <h2
        className="font-display"
        style={{
          fontSize: "clamp(2rem, 4vw, 3rem)",
          lineHeight: 1.1,
          letterSpacing: "-0.01em",
          color: light ? "#F8F6F0" : "#F8F6F0",
          fontWeight: 600,
        }}
      >
        {title}
      </h2>

      {subtitle && (
        <p
          className="mt-4 text-base leading-relaxed max-w-xl"
          style={{
            color: "rgba(248,246,240,0.55)",
            marginLeft: centered ? "auto" : undefined,
            marginRight: centered ? "auto" : undefined,
          }}
        >
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}

export default SectionHeading;
