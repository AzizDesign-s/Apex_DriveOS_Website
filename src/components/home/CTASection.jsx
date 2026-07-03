// src/components/home/CTASection.jsx
// Full-width CTA section above footer.

import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

function CTASection() {
  return (
    <section
      className="py-32 relative overflow-hidden"
      style={{ background: "#030710" }}
    >
      {/* Subtle gold glow background */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                   w-96 h-96 rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(212,175,55,0.06) 0%, transparent 70%)",
        }}
      />

      <div className="container-site relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <p className="label-luxury mb-6">Begin Your Journey</p>

          <h2
            className="font-display mb-6"
            style={{
              fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
              color: "#F8F6F0",
              fontWeight: 600,
            }}
          >
            Find Your <span style={{ color: "#D4AF37" }}>Perfect Vehicle</span>
          </h2>

          <p
            className="text-lg max-w-xl mx-auto mb-12"
            style={{ color: "rgba(248,246,240,0.5)" }}
          >
            Browse our exclusive collection or book a private test drive
            experience at your convenience.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link to="/cars" className="btn-gold">
              Browse Collection
              <ArrowRight size={15} />
            </Link>
            <Link to="/test-drive" className="btn-ghost">
              Book Test Drive
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default CTASection;
