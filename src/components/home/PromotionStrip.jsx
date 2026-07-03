// src/components/home/PromotionsStrip.jsx
// Horizontal scroll strip of active promotions.
// Gold gradient fade on left/right edges.

import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Tag, ArrowRight, Clock } from "lucide-react";
import { usePromotions, getPromotionStatus } from "../../hooks/usePromotions";
import SectionHeading from "../ui/SectionHeading";

const TYPE_COLORS = {
  festival: "#A78BFA",
  percentage: "#D4AF37",
  flat: "#38BDF8",
  trade_in: "#FBBF24",
  finance: "#10B981",
  loyalty: "#FB7185",
  employee: "#94A3B8",
};

function PromotionCard({ promotion, index }) {
  const daysLeft = Math.ceil(
    (new Date(promotion.endDate) - new Date()) / (1000 * 60 * 60 * 24),
  );
  const color = TYPE_COLORS[promotion.type] || "#D4AF37";

  const discountLabel =
    promotion.discountType === "percentage"
      ? `${promotion.discountValue}%`
      : `AED ${Number(promotion.discountValue).toLocaleString()}`;

  return (
    <motion.div
      className="flex-shrink-0 w-72 site-card site-card-hover p-6 flex flex-col gap-4"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
    >
      {/* Type badge */}
      <div className="flex items-center gap-2">
        <Tag size={12} style={{ color }} />
        <span
          className="text-[9px] font-bold uppercase tracking-[0.2em]"
          style={{ color }}
        >
          {promotion.type.replace("_", " ")}
        </span>
      </div>

      {/* Discount hero */}
      <div>
        <p className="font-display text-3xl font-bold mb-1" style={{ color }}>
          {discountLabel}
          {promotion.discountType === "percentage" && (
            <span
              className="text-base font-normal ml-1"
              style={{ color: "rgba(248,246,240,0.4)" }}
            >
              off
            </span>
          )}
        </p>
        <p className="text-sm font-semibold" style={{ color: "#F8F6F0" }}>
          {promotion.name}
        </p>
      </div>

      {/* Description */}
      <p
        className="text-xs leading-relaxed"
        style={{ color: "rgba(248,246,240,0.5)" }}
      >
        {promotion.description}
      </p>

      {/* Footer: days left + CTA */}
      <div
        className="flex items-center justify-between mt-auto pt-4"
        style={{ borderTop: "1px solid rgba(212,175,55,0.1)" }}
      >
        <div className="flex items-center gap-1.5">
          <Clock size={11} style={{ color: "rgba(248,246,240,0.3)" }} />
          <span
            className="text-[10px]"
            style={{ color: "rgba(248,246,240,0.35)" }}
          >
            {daysLeft}d left
          </span>
        </div>
        <Link
          to="/promotions"
          className="flex items-center gap-1 text-[10px] font-semibold
                     uppercase tracking-[0.1em] transition-colors"
          style={{ color }}
        >
          Learn more
          <ArrowRight size={11} />
        </Link>
      </div>
    </motion.div>
  );
}

function PromotionsStrip() {
  const { active } = usePromotions();

  if (active.length === 0) return null;

  return (
    <section className="py-28" style={{ background: "#0B1120" }}>
      <div className="container-site mb-12">
        <div className="flex items-end justify-between gap-6 flex-wrap">
          <SectionHeading
            label="Current Offers"
            title="Exclusive Promotions"
            subtitle="Limited-time offers on our finest vehicles."
          />
          <Link
            to="/promotions"
            className="flex items-center gap-2 text-[11px] font-semibold
                       tracking-[0.15em] uppercase flex-shrink-0 transition-colors"
            style={{ color: "#D4AF37" }}
          >
            View All <ArrowRight size={13} />
          </Link>
        </div>
      </div>

      {/* Horizontal scroll with fade edges */}
      <div className="relative container-site">
        {/* Left fade */}
        <div
          className="absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
          style={{
            background: "linear-gradient(to right, #0B1120, transparent)",
          }}
        />
        {/* Right fade */}
        <div
          className="absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
          style={{
            background: "linear-gradient(to left, #0B1120, transparent)",
          }}
        />

        <div className="flex gap-4 overflow-x-auto scrollbar-none pb-4 py-10 ">
          {active.map((promo, i) => (
            <PromotionCard key={promo.id} promotion={promo} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default PromotionsStrip;
