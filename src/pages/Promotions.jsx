// src/pages/Promotions.jsx
// Customer-facing promotions page.
// Reads live from apex-gt-promotions localStorage.
// More visual than the admin PromotionCard — bigger discount hero,
// applicability chip, countdown timer, enquiry CTA.

import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Tag,
  Clock,
  Calendar,
  Car,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Sparkles,
} from "lucide-react";
import PageLayout from "../components/layout/PageLayout";
import SectionHeading from "../components/ui/SectionHeading";
import { usePromotions, getPromotionStatus } from "../hooks/usePromotions";

// ── Type config ───────────────────────────────────────────────────────────────
const TYPE_CONFIG = {
  festival: { label: "Festival Offer", color: "#A78BFA" },
  percentage: { label: "Percentage Discount", color: "#D4AF37" },
  flat: { label: "Flat Discount", color: "#38BDF8" },
  trade_in: { label: "Trade-In Bonus", color: "#FBBF24" },
  finance: { label: "Finance Discount", color: "#10B981" },
  loyalty: { label: "Loyalty Reward", color: "#FB7185" },
  employee: { label: "Employee Discount", color: "#94A3B8" },
};

// ── Status config ─────────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  active: {
    label: "Active Now",
    icon: CheckCircle2,
    color: "#10B981",
    bg: "rgba(16,185,129,0.1)",
    border: "rgba(16,185,129,0.2)",
  },
  upcoming: {
    label: "Coming Soon",
    icon: Clock,
    color: "#38BDF8",
    bg: "rgba(56,189,248,0.1)",
    border: "rgba(56,189,248,0.2)",
  },
  expired: {
    label: "Expired",
    icon: XCircle,
    color: "#475569",
    bg: "rgba(71,85,105,0.1)",
    border: "rgba(71,85,105,0.2)",
  },
};

// ── Countdown display ─────────────────────────────────────────────────────────
function useCountdown(endDate) {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const calc = () => {
      const diff = new Date(endDate).getTime() - Date.now();
      if (diff <= 0) {
        setTimeLeft("Expired");
        return;
      }
      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      if (d > 0) setTimeLeft(`${d}d ${h}h remaining`);
      else if (h > 0) setTimeLeft(`${h}h ${m}m remaining`);
      else setTimeLeft(`${m}m remaining`);
    };
    calc();
    const interval = setInterval(calc, 60000);
    return () => clearInterval(interval);
  }, [endDate]);

  return timeLeft;
}

// ── Individual promotion card ─────────────────────────────────────────────────
function PromotionCard({ promotion, index }) {
  const status = getPromotionStatus(promotion);
  const statusConfig = STATUS_CONFIG[status] || STATUS_CONFIG.expired;
  const typeConfig = TYPE_CONFIG[promotion.type] || TYPE_CONFIG.percentage;
  const StatusIcon = statusConfig.icon;
  const countdown = useCountdown(promotion.endDate);
  const isActive = status === "active";
  const isExpired = status === "expired";

  const discountDisplay =
    promotion.discountType === "percentage"
      ? { value: `${promotion.discountValue}%`, suffix: "OFF" }
      : {
          value: `AED ${Number(promotion.discountValue).toLocaleString()}`,
          suffix: "OFF",
        };

  const applicabilityText =
    promotion.appliesTo === "all"
      ? "All Vehicles"
      : promotion.appliesTo === "brand"
        ? `All ${promotion.brandFilter} Models`
        : `${promotion.brandFilter} ${promotion.modelFilter}`;

  return (
    <motion.article
      className="flex flex-col rounded-2xl overflow-hidden group"
      style={{
        background: "#0D1829",
        border: `1px solid ${
          isActive ? "rgba(212,175,55,0.15)" : "rgba(255,255,255,0.06)"
        }`,
        opacity: isExpired ? 0.6 : 1,
      }}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: isExpired ? 0.6 : 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ delay: (index % 3) * 0.1, duration: 0.55 }}
      whileHover={!isExpired ? { y: -4, transition: { duration: 0.25 } } : {}}
    >
      {/* ── Color accent bar ── */}
      <div
        className="h-1 w-full"
        style={{
          background: isActive ? typeConfig.color : "rgba(255,255,255,0.06)",
        }}
      />

      <div className="flex flex-col flex-1 p-6">
        {/* ── Header: type badge + status ── */}
        <div className="flex items-start justify-between gap-3 mb-5">
          <span
            className="text-[9px] font-bold uppercase tracking-[0.2em] px-2.5 py-1
                       rounded-full"
            style={{
              background: `${typeConfig.color}15`,
              border: `1px solid ${typeConfig.color}30`,
              color: typeConfig.color,
            }}
          >
            {typeConfig.label}
          </span>

          <div
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full flex-shrink-0"
            style={{
              background: statusConfig.bg,
              border: `1px solid ${statusConfig.border}`,
            }}
          >
            <StatusIcon size={10} style={{ color: statusConfig.color }} />
            <span
              className="text-[9px] font-bold uppercase tracking-[0.1em]"
              style={{ color: statusConfig.color }}
            >
              {statusConfig.label}
            </span>
          </div>
        </div>

        {/* ── Promotion name ── */}
        <h3
          className="font-display text-lg font-semibold mb-2 leading-tight"
          style={{ color: "#F8F6F0" }}
        >
          {promotion.name}
        </h3>

        {/* ── Description ── */}
        {promotion.description && (
          <p
            className="text-sm leading-relaxed mb-5"
            style={{ color: "rgba(248,246,240,0.5)" }}
          >
            {promotion.description}
          </p>
        )}

        {/* ── Discount hero ── */}
        <div
          className="flex items-center justify-center py-8 rounded-xl mb-5"
          style={{
            background: isActive
              ? `${typeConfig.color}08`
              : "rgba(255,255,255,0.02)",
            border: `1px solid ${
              isActive ? `${typeConfig.color}15` : "rgba(255,255,255,0.04)"
            }`,
          }}
        >
          <div className="text-center">
            <p
              className="font-display font-bold leading-none"
              style={{
                fontSize: "clamp(2.5rem, 8vw, 4rem)",
                color: isActive ? typeConfig.color : "rgba(248,246,240,0.2)",
              }}
            >
              {discountDisplay.value}
            </p>
            <p
              className="text-[10px] font-bold tracking-[0.3em] uppercase mt-1"
              style={{
                color: isActive
                  ? `${typeConfig.color}80`
                  : "rgba(248,246,240,0.15)",
              }}
            >
              {discountDisplay.suffix}
            </p>
          </div>
        </div>

        {/* ── Meta: applicability + dates ── */}
        <div className="space-y-2.5 mb-5">
          <div className="flex items-center gap-2.5">
            <Car
              size={12}
              style={{ color: "rgba(248,246,240,0.25)", flexShrink: 0 }}
            />
            <span
              className="text-xs"
              style={{ color: "rgba(248,246,240,0.5)" }}
            >
              {applicabilityText}
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <Calendar
              size={12}
              style={{ color: "rgba(248,246,240,0.25)", flexShrink: 0 }}
            />
            <span
              className="text-xs"
              style={{ color: "rgba(248,246,240,0.5)" }}
            >
              {new Date(promotion.startDate).toLocaleDateString("en-AE", {
                day: "numeric",
                month: "short",
              })}
              {" – "}
              {new Date(promotion.endDate).toLocaleDateString("en-AE", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </span>
          </div>

          {isActive && (
            <div className="flex items-center gap-2.5">
              <Clock size={12} style={{ color: "#D4AF37", flexShrink: 0 }} />
              <span
                className="text-xs font-semibold"
                style={{ color: "#D4AF37" }}
              >
                {countdown}
              </span>
            </div>
          )}
        </div>

        {/* ── CTA ── */}
        <div
          className="mt-auto pt-4"
          style={{ borderTop: "1px solid rgba(212,175,55,0.08)" }}
        >
          {isActive ? (
            <div className="flex gap-2">
              <Link
                to="/cars"
                className="flex-1 btn-gold text-center justify-center"
                style={{ padding: "10px 16px", fontSize: "11px" }}
              >
                Browse Vehicles
              </Link>
              <Link
                to="/contact"
                className="btn-ghost flex-shrink-0"
                style={{ padding: "10px 16px", fontSize: "11px" }}
              >
                Enquire
              </Link>
            </div>
          ) : status === "upcoming" ? (
            <Link
              to="/contact"
              className="w-full flex items-center justify-center gap-2
                         btn-ghost text-center"
              style={{ padding: "10px 16px", fontSize: "11px" }}
            >
              Register Interest
              <ArrowRight size={13} />
            </Link>
          ) : (
            <p
              className="text-center text-xs py-2"
              style={{ color: "rgba(248,246,240,0.25)" }}
            >
              This promotion has ended
            </p>
          )}
        </div>
      </div>
    </motion.article>
  );
}

// ── Hero stats strip ──────────────────────────────────────────────────────────
function PromotionHeroStats({ promotions }) {
  const active = promotions.filter(
    (p) => getPromotionStatus(p) === "active",
  ).length;
  const upcoming = promotions.filter(
    (p) => getPromotionStatus(p) === "upcoming",
  ).length;

  return (
    <div className="flex items-center gap-8 mt-8">
      {[
        { value: active, label: "Active Offers", color: "#10B981" },
        { value: upcoming, label: "Coming Soon", color: "#38BDF8" },
        { value: promotions.length, label: "Total Offers", color: "#D4AF37" },
      ].map((stat) => (
        <div key={stat.label} className="text-center sm:text-left">
          <p
            className="font-display text-3xl font-bold"
            style={{ color: stat.color }}
          >
            {stat.value}
          </p>
          <p
            className="text-[10px] font-semibold tracking-[0.2em] uppercase mt-0.5"
            style={{ color: "rgba(248,246,240,0.35)" }}
          >
            {stat.label}
          </p>
        </div>
      ))}
    </div>
  );
}

// ── Filter tabs ───────────────────────────────────────────────────────────────
function FilterTabs({ active, onChange, counts }) {
  const tabs = [
    { id: "all", label: "All Offers" },
    { id: "active", label: "Active Now" },
    { id: "upcoming", label: "Coming Soon" },
    { id: "expired", label: "Expired" },
  ];

  return (
    <div
      className="flex items-center gap-1 p-1 rounded-xl overflow-x-auto scrollbar-none"
      style={{
        background: "#0D1829",
        border: "1px solid rgba(212,175,55,0.1)",
        width: "fit-content",
      }}
    >
      {tabs.map((tab) => {
        const isActive = active === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs
                       font-semibold whitespace-nowrap transition-all duration-200
                       active:scale-[0.97]"
            style={{
              background: isActive ? "#D4AF37" : "transparent",
              color: isActive ? "#050A14" : "rgba(248,246,240,0.5)",
            }}
          >
            {tab.label}
            {counts[tab.id] > 0 && (
              <span
                className="text-[9px] font-bold w-5 h-5 rounded-full flex
                           items-center justify-center"
                style={{
                  background: isActive
                    ? "rgba(5,10,20,0.2)"
                    : "rgba(212,175,55,0.1)",
                  color: isActive ? "#050A14" : "#D4AF37",
                }}
              >
                {counts[tab.id]}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

// ── Empty state ───────────────────────────────────────────────────────────────
function EmptyState({ filter }) {
  return (
    <motion.div
      className="flex flex-col items-center justify-center py-28 text-center
                 col-span-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5"
        style={{
          background: "rgba(212,175,55,0.06)",
          border: "1px solid rgba(212,175,55,0.1)",
        }}
      >
        <Tag size={24} style={{ color: "rgba(212,175,55,0.3)" }} />
      </div>
      <p className="font-display text-xl mb-2" style={{ color: "#F8F6F0" }}>
        {filter === "all" ? "No promotions yet" : `No ${filter} promotions`}
      </p>
      <p className="text-sm" style={{ color: "rgba(248,246,240,0.4)" }}>
        {filter === "all"
          ? "Check back soon for exclusive offers."
          : "Try a different filter to see other offers."}
      </p>
    </motion.div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
function Promotions() {
  const { promotions } = usePromotions();
  const [filter, setFilter] = useState("all");

  const counts = useMemo(
    () => ({
      all: promotions.length,
      active: promotions.filter((p) => getPromotionStatus(p) === "active")
        .length,
      upcoming: promotions.filter((p) => getPromotionStatus(p) === "upcoming")
        .length,
      expired: promotions.filter((p) => getPromotionStatus(p) === "expired")
        .length,
    }),
    [promotions],
  );

  const filtered = useMemo(() => {
    if (filter === "all") return promotions;
    return promotions.filter((p) => getPromotionStatus(p) === filter);
  }, [promotions, filter]);

  // Sort: active first, then upcoming, then expired
  const sorted = useMemo(() => {
    const order = { active: 0, upcoming: 1, expired: 2 };
    return [...filtered].sort(
      (a, b) =>
        (order[getPromotionStatus(a)] ?? 3) -
        (order[getPromotionStatus(b)] ?? 3),
    );
  }, [filtered]);

  return (
    <PageLayout>
      {/* ── Hero band ── */}
      <div
        className="py-16"
        style={{
          background: "#0B1120",
          borderBottom: "1px solid rgba(212,175,55,0.08)",
        }}
      >
        <div className="container-site">
          <div className="flex items-end justify-between gap-8 flex-wrap">
            <div>
              <SectionHeading
                label="Exclusive Offers"
                title="Current Promotions"
                subtitle="Limited-time offers on our finest vehicles. Book a test drive to take advantage of these exclusive deals."
              />
              <PromotionHeroStats promotions={promotions} />
            </div>

            {/* Sparkle decoration */}
            <motion.div
              className="hidden lg:flex items-center justify-center w-32 h-32
                         rounded-full flex-shrink-0"
              style={{
                background: "rgba(212,175,55,0.04)",
                border: "1px solid rgba(212,175,55,0.1)",
              }}
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles size={32} style={{ color: "rgba(212,175,55,0.3)" }} />
            </motion.div>
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="container-site py-12">
        {/* Filter tabs */}
        <div className="flex items-center justify-between gap-4 mb-10 flex-wrap py-12">
          <FilterTabs active={filter} onChange={setFilter} counts={counts} />
          <p className="text-xs" style={{ color: "rgba(248,246,240,0.35)" }}>
            {sorted.length} offer{sorted.length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Cards grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={filter}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {sorted.length === 0 ? (
              <EmptyState filter={filter} />
            ) : (
              sorted.map((promo, i) => (
                <PromotionCard key={promo.id} promotion={promo} index={i} />
              ))
            )}
          </motion.div>
        </AnimatePresence>

        {/* Bottom CTA */}
        {counts.active > 0 && (
          <motion.div
            className="my-20 rounded-2xl p-10 text-center"
            style={{
              background:
                "linear-gradient(135deg, rgba(212,175,55,0.06), rgba(212,175,55,0.02))",
              border: "1px solid rgba(212,175,55,0.12)",
            }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="label-luxury mb-4">Don't Miss Out</p>
            <h3
              className="font-display text-2xl font-semibold mb-3"
              style={{ color: "#F8F6F0" }}
            >
              Ready to Take Advantage?
            </h3>
            <p
              className="text-sm mb-8 max-w-md mx-auto"
              style={{ color: "rgba(248,246,240,0.5)" }}
            >
              Book a test drive today and let our team apply the best available
              promotion to your purchase.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link to="/test-drive" className="btn-gold">
                Book Test Drive
                <ArrowRight size={15} />
              </Link>
              <Link to="/contact" className="btn-ghost">
                Speak to a Specialist
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </PageLayout>
  );
}

export default Promotions;
