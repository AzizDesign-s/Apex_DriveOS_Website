// src/pages/CarDetail.jsx
// Individual vehicle detail page.
//
// SECTIONS:
//   1. Image gallery — main image + thumbnail strip
//   2. Vehicle identity — brand label, model, variant, status
//   3. Quick specs grid — year, mileage, fuel, transmission, color, body
//   4. Price + availability
//   5. Description / condition notes
//   6. Features list
//   7. Related vehicles — same brand, up to 3 cards
//   8. Sticky CTA bar — always visible at bottom of screen
//
// DATA:
//   Reads from apex-driveos-cars localStorage via useVehicles hook.
//   Matches by vehicle.id from URL param (:id).
//   If vehicle not found: shows elegant 404 state.
//
// GSAP:
//   Vehicle name animates in on load (character by character).
//   Specs grid items stagger in on scroll.

import { useState, useEffect, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Gauge,
  Zap,
  Settings,
  Palette,
  Car,
  ArrowRight,
  Share2,
  Heart,
  CheckCircle2,
  Phone,
} from "lucide-react";
import PageLayout from "../components/layout/PageLayout";
import VehicleCard from "../components/cars/VehicleCard";
import { useVehicles } from "../hooks/useVehicles";

gsap.registerPlugin(ScrollTrigger);

// ── Brand fallback images ─────────────────────────────────────────────────────
const BRAND_IMAGES = {
  Mercedes:
    "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=1200&q=85",
  BMW: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=1200&q=85",
  Ferrari:
    "https://images.unsplash.com/photo-1592198084033-aade902d1aae?w=1200&q=85",
  "Rolls Royce":
    "https://images.unsplash.com/photo-1631295868223-63265b40d9e4?w=1200&q=85",
  Lamborghini:
    "https://images.unsplash.com/photo-1544169785-be38eb42ce11?w=1200&q=85",
  Porsche:
    "https://images.unsplash.com/photo-1580274455191-1c62238fa333?w=1200&q=85",
  Audi: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=1200&q=85",
  Bentley:
    "https://images.unsplash.com/photo-1621371307059-0df8cee09d06?w=1200&q=85",
  McLaren:
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=85",
  "Aston Martin":
    "https://images.unsplash.com/photo-1617196034183-421b4040ed20?w=1200&q=85",
};

const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1614200179396-2bdb77ebf81b?w=1200&q=85";

function getVehicleImages(vehicle) {
  // Real uploaded photos take priority
  if (vehicle.photos?.length > 0) {
    const urls = vehicle.photos.map((p) => p?.url).filter(Boolean);
    if (urls.length > 0) return urls;
  }
  // Brand fallback — single image
  return [BRAND_IMAGES[vehicle.brand] || DEFAULT_IMAGE];
}

const STATUS_CONFIG = {
  available: {
    label: "Available",
    color: "#10B981",
    bg: "rgba(16,185,129,0.12)",
  },
  interested: {
    label: "Interested",
    color: "#FBBF24",
    bg: "rgba(251,191,36,0.12)",
  },
  reserved: {
    label: "Reserved",
    color: "#38BDF8",
    bg: "rgba(56,189,248,0.12)",
  },
};

// ── Image Gallery ─────────────────────────────────────────────────────────────
function ImageGallery({ images, vehicleName }) {
  const [active, setActive] = useState(0);

  const handlePrev = () =>
    setActive((p) => (p - 1 + images.length) % images.length);
  const handleNext = () => setActive((p) => (p + 1) % images.length);

  return (
    <div className="flex flex-col gap-3">
      {/* Main image */}
      <div
        className="relative rounded-2xl overflow-hidden"
        style={{ height: "clamp(280px, 50vw, 560px)" }}
      >
        <AnimatePresence mode="wait">
          <motion.img
            key={active}
            src={images[active]}
            alt={vehicleName}
            className="w-full h-full object-cover"
            initial={{ opacity: 0, scale: 1.03 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.4 }}
            onError={(e) => {
              e.target.src = DEFAULT_IMAGE;
            }}
          />
        </AnimatePresence>

        {/* Navigation arrows — only if multiple images */}
        {images.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10
                         rounded-full flex items-center justify-center
                         transition-all duration-200 active:scale-95"
              style={{
                background: "rgba(5,10,20,0.7)",
                border: "1px solid rgba(212,175,55,0.2)",
                color: "#F8F6F0",
              }}
              aria-label="Previous image"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10
                         rounded-full flex items-center justify-center
                         transition-all duration-200 active:scale-95"
              style={{
                background: "rgba(5,10,20,0.7)",
                border: "1px solid rgba(212,175,55,0.2)",
                color: "#F8F6F0",
              }}
              aria-label="Next image"
            >
              <ChevronRight size={18} />
            </button>

            {/* Dot indicators */}
            <div
              className="absolute bottom-4 left-1/2 -translate-x-1/2
                            flex items-center gap-1.5"
            >
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  className="rounded-full transition-all duration-200"
                  style={{
                    width: i === active ? "20px" : "6px",
                    height: "6px",
                    background:
                      i === active ? "#D4AF37" : "rgba(248,246,240,0.3)",
                  }}
                  aria-label={`Image ${i + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Thumbnails — only if multiple images */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className="flex-shrink-0 rounded-xl overflow-hidden
                         transition-all duration-200"
              style={{
                width: "80px",
                height: "56px",
                border:
                  i === active ? "2px solid #D4AF37" : "2px solid transparent",
                opacity: i === active ? 1 : 0.5,
              }}
            >
              <img
                src={img}
                alt={`Thumbnail ${i + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = DEFAULT_IMAGE;
                }}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Spec tile ─────────────────────────────────────────────────────────────────
function SpecTile({ icon: Icon, label, value, index }) {
  return (
    <motion.div
      className="rounded-xl p-4 flex items-center gap-3"
      style={{
        background: "#0D1829",
        border: "1px solid rgba(212,175,55,0.1)",
      }}
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.06, duration: 0.4 }}
    >
      <div
        className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
        style={{ background: "rgba(212,175,55,0.08)" }}
      >
        <Icon size={15} style={{ color: "#D4AF37" }} />
      </div>
      <div>
        <p
          className="text-[9px] font-bold tracking-[0.15em] uppercase mb-0.5"
          style={{ color: "rgba(248,246,240,0.35)" }}
        >
          {label}
        </p>
        <p
          className="text-xs font-semibold capitalize"
          style={{ color: "#F8F6F0" }}
        >
          {value || "—"}
        </p>
      </div>
    </motion.div>
  );
}

// ── 404 / Not Found state ─────────────────────────────────────────────────────
function VehicleNotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-40 text-center">
      <div
        className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6"
        style={{
          background: "rgba(212,175,55,0.06)",
          border: "1px solid rgba(212,175,55,0.1)",
        }}
      >
        <Car size={32} style={{ color: "rgba(212,175,55,0.3)" }} />
      </div>
      <p className="font-display text-2xl mb-2" style={{ color: "#F8F6F0" }}>
        Vehicle Not Found
      </p>
      <p className="text-sm mb-8" style={{ color: "rgba(248,246,240,0.4)" }}>
        This vehicle may have been sold or removed from the collection.
      </p>
      <Link to="/cars" className="btn-gold">
        Browse Collection
      </Link>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
function CarDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { vehicles } = useVehicles();
  const titleRef = useRef(null);

  // Find vehicle by id
  const vehicle = vehicles.find((v) => String(v.id) === String(id));

  // Related vehicles — same brand, not this vehicle, max 3
  const related = vehicles
    .filter(
      (v) =>
        v.brand === vehicle?.brand &&
        String(v.id) !== String(id) &&
        v.status !== "sold" &&
        v.status !== "maintenance",
    )
    .slice(0, 3);

  // GSAP title animation
  useEffect(() => {
    if (!vehicle || !titleRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        titleRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out", delay: 0.2 },
      );
    });
    return () => ctx.revert();
  }, [vehicle]);

  const images = vehicle ? getVehicleImages(vehicle) : [];
  const status = vehicle
    ? STATUS_CONFIG[vehicle.status] || STATUS_CONFIG.available
    : null;
  const isAvailable = vehicle?.status === "available";
  const canBook =
    vehicle?.status === "available" || vehicle?.status === "interested";

  // Parse features into array
  const featuresList = vehicle?.features
    ? vehicle.features
        .split("\n")
        .map((f) => f.replace(/^[•\-]\s*/, "").trim())
        .filter(Boolean)
    : [];

  return (
    <PageLayout>
      {!vehicle ? (
        <div className="container-site py-20">
          <VehicleNotFound />
        </div>
      ) : (
        <>
          {/* Breadcrumb */}
          <div
            className="py-4"
            style={{ borderBottom: "1px solid rgba(212,175,55,0.06)" }}
          >
            <div className="container-site">
              <div
                className="flex items-center gap-2 text-xs"
                style={{ color: "rgba(248,246,240,0.4)" }}
              >
                <Link
                  to="/cars"
                  className="transition-colors hover:text-gold"
                  style={{ color: "rgba(248,246,240,0.4)" }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = "#D4AF37")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = "rgba(248,246,240,0.4)")
                  }
                >
                  Collection
                </Link>
                <ChevronRight size={12} style={{ opacity: 0.4 }} />
                <span style={{ color: "rgba(248,246,240,0.4)" }}>
                  {vehicle.brand}
                </span>
                <ChevronRight size={12} style={{ opacity: 0.4 }} />
                <span style={{ color: "#F8F6F0" }}>{vehicle.model}</span>
              </div>
            </div>
          </div>

          {/* Main content */}
          <div className="container-site py-12 pb-32">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-16">
              {/* ── Left: Gallery ── */}
              <div>
                <ImageGallery
                  images={images}
                  vehicleName={`${vehicle.brand} ${vehicle.model}`}
                />
              </div>

              {/* ── Right: Details ── */}
              <div className="flex flex-col">
                {/* Status + share */}
                <div className="flex items-center justify-between mb-4">
                  <div
                    className="inline-flex items-center gap-2 px-3 py-1.5
                               rounded-full text-[10px] font-bold uppercase
                               tracking-[0.15em]"
                    style={{
                      background: status.bg,
                      border: `1px solid ${status.color}40`,
                      color: status.color,
                    }}
                  >
                    <CheckCircle2 size={11} />
                    {status.label}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      className="w-8 h-8 rounded-lg flex items-center justify-center
                                 transition-all duration-200 active:scale-95"
                      style={{
                        background: "rgba(13,24,41,0.8)",
                        border: "1px solid rgba(212,175,55,0.15)",
                        color: "rgba(248,246,240,0.5)",
                      }}
                      onClick={() => {
                        navigator
                          .share?.({
                            title: `${vehicle.brand} ${vehicle.model}`,
                            url: window.location.href,
                          })
                          .catch(() => {
                            navigator.clipboard?.writeText(
                              window.location.href,
                            );
                          });
                      }}
                      aria-label="Share"
                    >
                      <Share2 size={13} />
                    </button>
                  </div>
                </div>

                {/* Brand */}
                <p className="label-luxury mb-2">{vehicle.brand}</p>

                {/* Model — GSAP animated */}
                <h1
                  ref={titleRef}
                  className="font-display font-semibold mb-1 opacity-0"
                  style={{
                    fontSize: "clamp(2rem, 5vw, 3.5rem)",
                    lineHeight: 1.05,
                    letterSpacing: "-0.01em",
                    color: "#F8F6F0",
                  }}
                >
                  {vehicle.model}
                </h1>

                {vehicle.variant && (
                  <p
                    className="text-sm mb-6"
                    style={{ color: "rgba(248,246,240,0.4)" }}
                  >
                    {vehicle.variant}
                  </p>
                )}

                {/* Price */}
                <div
                  className="flex items-end gap-3 mb-8 pb-8"
                  style={{ borderBottom: "1px solid rgba(212,175,55,0.1)" }}
                >
                  <div>
                    <p
                      className="text-[9px] font-bold tracking-[0.2em] uppercase mb-1"
                      style={{ color: "rgba(248,246,240,0.35)" }}
                    >
                      Listed Price
                    </p>
                    <p
                      className="font-display font-bold"
                      style={{
                        fontSize: "clamp(1.8rem, 4vw, 2.5rem)",
                        color: "#D4AF37",
                        lineHeight: 1,
                      }}
                    >
                      AED {Number(vehicle.price).toLocaleString()}
                    </p>
                  </div>
                  {/* Plate */}
                  {vehicle.plate && (
                    <div
                      className="mb-1 px-3 py-1.5 rounded-lg text-xs font-bold
                                 font-mono tracking-wider"
                      style={{
                        background: "rgba(248,246,240,0.06)",
                        border: "1px solid rgba(248,246,240,0.1)",
                        color: "rgba(248,246,240,0.5)",
                      }}
                    >
                      {vehicle.plate}
                    </div>
                  )}
                </div>

                {/* Specs grid */}
                <p className="label-luxury mb-4">Specifications</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
                  {[
                    { icon: Calendar, label: "Year", value: vehicle.year },
                    {
                      icon: Gauge,
                      label: "Mileage",
                      value:
                        vehicle.mileage !== undefined
                          ? `${Number(vehicle.mileage).toLocaleString()} km`
                          : null,
                    },
                    { icon: Zap, label: "Fuel Type", value: vehicle.fuelType },
                    {
                      icon: Settings,
                      label: "Transmission",
                      value: vehicle.transmission,
                    },
                    { icon: Palette, label: "Colour", value: vehicle.color },
                    { icon: Car, label: "Body Type", value: vehicle.bodyType },
                  ]
                    .filter((s) => s.value)
                    .map((spec, i) => (
                      <SpecTile key={spec.label} {...spec} index={i} />
                    ))}
                </div>

                {/* Condition / notes */}
                {vehicle.notes && (
                  <div className="mb-8">
                    <p className="label-luxury mb-3">Description</p>
                    <p
                      className="text-sm leading-relaxed"
                      style={{ color: "rgba(248,246,240,0.6)" }}
                    >
                      {vehicle.notes}
                    </p>
                  </div>
                )}

                {/* Features */}
                {featuresList.length > 0 && (
                  <div className="mb-8">
                    <p className="label-luxury mb-4">Key Features</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {featuresList.map((feature, i) => (
                        <motion.div
                          key={i}
                          className="flex items-start gap-2.5"
                          initial={{ opacity: 0, x: -8 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: i * 0.04 }}
                        >
                          <div
                            className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5"
                            style={{ background: "#D4AF37" }}
                          />
                          <span
                            className="text-xs leading-relaxed"
                            style={{ color: "rgba(248,246,240,0.6)" }}
                          >
                            {feature}
                          </span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Enquiry note — desktop only (mobile has sticky bar) */}
                <div
                  className="hidden lg:flex items-start gap-3 rounded-xl p-4"
                  style={{
                    background: "rgba(212,175,55,0.04)",
                    border: "1px solid rgba(212,175,55,0.1)",
                  }}
                >
                  <Phone
                    size={14}
                    style={{ color: "#D4AF37", flexShrink: 0, marginTop: 2 }}
                  />
                  <p
                    className="text-xs leading-relaxed"
                    style={{ color: "rgba(248,246,240,0.5)" }}
                  >
                    Interested in this vehicle? Our team is available 6 days a
                    week to answer your questions and arrange a private viewing.
                    <Link
                      to="/contact"
                      className="ml-1 underline transition-colors"
                      style={{ color: "#D4AF37" }}
                    >
                      Contact us
                    </Link>
                  </p>
                </div>
              </div>
            </div>

            {/* Related vehicles */}
            {related.length > 0 && (
              <div className="mt-24">
                <div className="flex items-end justify-between mb-10 gap-4 flex-wrap">
                  <div>
                    <p className="label-luxury mb-3">
                      More from {vehicle.brand}
                    </p>
                    <h2
                      className="font-display text-2xl font-semibold"
                      style={{ color: "#F8F6F0" }}
                    >
                      Related Vehicles
                    </h2>
                  </div>
                  <Link
                    to={`/cars?brand=${vehicle.brand}`}
                    className="flex items-center gap-1.5 text-[11px] font-semibold
                               tracking-[0.1em] uppercase flex-shrink-0 transition-colors"
                    style={{ color: "#D4AF37" }}
                  >
                    View All {vehicle.brand}
                    <ArrowRight size={13} />
                  </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {related.map((v, i) => (
                    <VehicleCard key={v.id} vehicle={v} index={i} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ── Sticky CTA bar ── */}
          <motion.div
            className="fixed bottom-0 left-0 right-0 z-40"
            style={{
              background: "rgba(5,10,20,0.95)",
              backdropFilter: "blur(20px)",
              borderTop: "1px solid rgba(212,175,55,0.12)",
            }}
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            transition={{ delay: 0.6, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="container-site py-4">
              <div className="flex items-center justify-between gap-4 flex-wrap">
                {/* Vehicle summary */}
                <div className="min-w-0">
                  <p
                    className="text-xs font-semibold truncate"
                    style={{ color: "#F8F6F0" }}
                  >
                    {vehicle.brand} {vehicle.model}
                  </p>
                  <p
                    className="font-display text-lg font-bold"
                    style={{ color: "#D4AF37", lineHeight: 1.1 }}
                  >
                    AED {Number(vehicle.price).toLocaleString()}
                  </p>
                </div>

                {/* CTAs */}
                <div className="flex items-center gap-3 flex-shrink-0">
                  <Link
                    to="/contact"
                    className="btn-ghost text-[11px]"
                    style={{ padding: "10px 20px" }}
                  >
                    Make Enquiry
                  </Link>
                  {canBook ? (
                    <Link
                      to={`/test-drive?car=${vehicle.id}`}
                      className="btn-gold text-[11px]"
                      style={{ padding: "10px 24px" }}
                    >
                      Book Test Drive
                    </Link>
                  ) : (
                    <div
                      className="px-6 py-2.5 rounded text-[11px] font-bold
                                 uppercase tracking-[0.15em]"
                      style={{
                        background: "rgba(56,189,248,0.1)",
                        border: "1px solid rgba(56,189,248,0.3)",
                        color: "#38BDF8",
                      }}
                    >
                      Reserved
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </PageLayout>
  );
}

export default CarDetail;
