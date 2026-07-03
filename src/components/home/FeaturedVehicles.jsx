// src/components/home/FeaturedVehicles.jsx
// 3 featured vehicles (highest price available).
// Editorial horizontal card layout — image left, details right.
// GSAP: cards slide in from left staggered on scroll.

import { useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, Gauge, Zap, Calendar } from "lucide-react";
import { useVehicles } from "../../hooks/useVehicles";
import SectionHeading from "../ui/SectionHeading";
import clsx from "clsx";

gsap.registerPlugin(ScrollTrigger);

// Fallback images per brand when no photo uploaded
const BRAND_IMAGES = {
  Mercedes:
    "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=800&q=80",
  BMW: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&q=80",
  Ferrari:
    "https://images.unsplash.com/photo-1592198084033-aade902d1aae?w=800&q=80",
  "Rolls Royce":
    "https://images.unsplash.com/photo-1631295868223-63265b40d9e4?w=800&q=80",
  Lamborghini:
    "https://images.unsplash.com/photo-1544169785-be38eb42ce11?w=800&q=80",
  Porsche:
    "https://images.unsplash.com/photo-1580274455191-1c62238fa333?w=800&q=80",
  Audi: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&q=80",
  Bentley:
    "https://images.unsplash.com/photo-1621371307059-0df8cee09d06?w=800&q=80",
};

const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1614200179396-2bdb77ebf81b?w=800&q=80";

function getVehicleImage(vehicle) {
  // Real photo uploaded via admin takes priority
  if (vehicle.photos?.length > 0 && vehicle.photos[0]?.url) {
    return vehicle.photos[0].url;
  }
  // Brand fallback
  return BRAND_IMAGES[vehicle.brand] || DEFAULT_IMAGE;
}

const STATUS_CONFIG = {
  available: { label: "Available", color: "#10B981" },
  interested: { label: "Interested", color: "#FBBF24" },
  reserved: { label: "Reserved", color: "#38BDF8" },
};

function FeaturedCard({ vehicle, index }) {
  const cardRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, x: -60 },
        {
          opacity: 1,
          x: 0,
          duration: 0.9,
          ease: "power3.out",
          delay: index * 0.15,
          scrollTrigger: {
            trigger: cardRef.current,
            start: "top 85%",
            once: true,
          },
        },
      );
    });
    return () => ctx.revert();
  }, [index]);

  const image = getVehicleImage(vehicle);
  const status = STATUS_CONFIG[vehicle.status] || STATUS_CONFIG.available;
  const isAvailable = vehicle.status === "available";

  return (
    <div
      ref={cardRef}
      className="group grid grid-cols-1 lg:grid-cols-2 rounded-2xl overflow-hidden
                 site-card site-card-hover opacity-0"
      style={{ minHeight: "300px" }}
    >
      {/* Image side */}
      <div className="relative overflow-hidden" style={{ minHeight: "260px" }}>
        <img
          src={image}
          alt={`${vehicle.brand} ${vehicle.model}`}
          className="w-full h-full object-cover transition-transform duration-700
                     group-hover:scale-105"
          style={{ minHeight: "260px" }}
          onError={(e) => {
            e.target.src = DEFAULT_IMAGE;
          }}
        />
        {/* Status badge */}
        <div
          className="absolute top-4 left-4 px-3 py-1.5 rounded-full text-[9px]
                     font-bold uppercase tracking-[0.15em]"
          style={{
            background: `${status.color}20`,
            border: `1px solid ${status.color}40`,
            color: status.color,
          }}
        >
          {status.label}
        </div>
        {/* Price overlay on mobile */}
        <div
          className="absolute bottom-0 left-0 right-0 p-4 lg:hidden"
          style={{
            background:
              "linear-gradient(to top, rgba(5,10,20,0.95), transparent)",
          }}
        >
          <p
            className="font-display text-xl font-bold"
            style={{ color: "#D4AF37" }}
          >
            AED {Number(vehicle.price).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Details side */}
      <div className="flex flex-col justify-between p-8">
        <div>
          {/* Brand label */}
          <p className="label-luxury mb-3">{vehicle.brand}</p>

          {/* Model */}
          <h3
            className="font-display text-2xl font-semibold mb-1"
            style={{ color: "#F8F6F0", lineHeight: 1.2 }}
          >
            {vehicle.model}
          </h3>
          {vehicle.variant && (
            <p
              className="text-sm mb-6"
              style={{ color: "rgba(248,246,240,0.45)" }}
            >
              {vehicle.variant}
            </p>
          )}

          {/* Specs row */}
          <div className="flex items-center gap-6 mb-8">
            {vehicle.year && (
              <div className="flex items-center gap-2">
                <Calendar size={13} style={{ color: "#D4AF37" }} />
                <span
                  className="text-xs"
                  style={{ color: "rgba(248,246,240,0.6)" }}
                >
                  {vehicle.year}
                </span>
              </div>
            )}
            {vehicle.mileage !== undefined && (
              <div className="flex items-center gap-2">
                <Gauge size={13} style={{ color: "#D4AF37" }} />
                <span
                  className="text-xs"
                  style={{ color: "rgba(248,246,240,0.6)" }}
                >
                  {Number(vehicle.mileage).toLocaleString()} km
                </span>
              </div>
            )}
            {vehicle.fuelType && (
              <div className="flex items-center gap-2">
                <Zap size={13} style={{ color: "#D4AF37" }} />
                <span
                  className="text-xs capitalize"
                  style={{ color: "rgba(248,246,240,0.6)" }}
                >
                  {vehicle.fuelType}
                </span>
              </div>
            )}
          </div>
        </div>

        <div>
          {/* Price — hidden on mobile (shown in image overlay) */}
          <div className="hidden lg:block mb-6">
            <p
              className="text-[10px] font-semibold tracking-[0.2em] uppercase mb-1"
              style={{ color: "rgba(248,246,240,0.35)" }}
            >
              Starting Price
            </p>
            <p
              className="font-display text-3xl font-bold"
              style={{ color: "#D4AF37" }}
            >
              AED {Number(vehicle.price).toLocaleString()}
            </p>
          </div>

          {/* CTAs */}
          <div className="flex items-center gap-3">
            <Link
              to={`/cars/${vehicle.id}`}
              className="btn-gold flex-1 justify-center"
              style={{ padding: "12px 20px", fontSize: "11px" }}
            >
              View Details
            </Link>
            {isAvailable && (
              <Link
                to={`/test-drive?car=${vehicle.id}`}
                className="btn-ghost flex-shrink-0"
                style={{ padding: "11px 16px", fontSize: "11px" }}
              >
                <ArrowRight size={14} />
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function FeaturedVehicles() {
  const { featured } = useVehicles();

  if (featured.length === 0) return null;

  return (
    <section className="py-28" style={{ background: "#050A14" }}>
      <div className="container-site">
        <div className="flex items-end justify-between mb-14 gap-6 flex-wrap">
          <SectionHeading
            label="Featured Collection"
            title="Handpicked for Excellence"
            subtitle="Our curated selection of the most exceptional vehicles available today."
          />
          <Link
            to="/cars"
            className="flex items-center gap-2 text-[11px] font-semibold
                       tracking-[0.15em] uppercase transition-colors flex-shrink-0"
            style={{ color: "#D4AF37" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#E8C84A")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#D4AF37")}
          >
            View All
            <ArrowRight size={13} />
          </Link>
        </div>

        <div className="flex flex-col gap-6">
          {featured.map((vehicle, i) => (
            <FeaturedCard key={vehicle.id} vehicle={vehicle} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default FeaturedVehicles;
