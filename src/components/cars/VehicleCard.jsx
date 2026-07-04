// src/components/cars/VehicleCard.jsx
// Grid card for the /cars browse page.
// Shows: image, brand, model, year, mileage, fuel, price,
// status badge, and two action buttons.
// Hover: image zoom + card lift (CSS transition).

import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Gauge, Calendar, Zap, ArrowRight } from "lucide-react";
import clsx from "clsx";

// ── Brand fallback images (same as FeaturedVehicles) ─────────────────────────
const BRAND_IMAGES = {
  Mercedes:
    "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=600&q=80",
  BMW: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=600&q=80",
  Ferrari:
    "https://images.unsplash.com/photo-1592198084033-aade902d1aae?w=600&q=80",
  "Rolls Royce":
    "https://images.unsplash.com/photo-1631295868223-63265b40d9e4?w=600&q=80",
  Lamborghini:
    "https://images.unsplash.com/photo-1544169785-be38eb42ce11?w=600&q=80",
  Porsche:
    "https://images.unsplash.com/photo-1580274455191-1c62238fa333?w=600&q=80",
  Audi: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=600&q=80",
  Bentley:
    "https://images.unsplash.com/photo-1621371307059-0df8cee09d06?w=600&q=80",
  McLaren:
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",
  "Aston Martin":
    "https://images.unsplash.com/photo-1617196034183-421b4040ed20?w=600&q=80",
};

const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1614200179396-2bdb77ebf81b?w=600&q=80";

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

function VehicleCard({ vehicle, index = 0 }) {
  const image =
    vehicle.photos?.length > 0 && vehicle.photos[0]?.url
      ? vehicle.photos[0].url
      : BRAND_IMAGES[vehicle.brand] || DEFAULT_IMAGE;

  const status = STATUS_CONFIG[vehicle.status] || STATUS_CONFIG.available;
  const isAvailable = vehicle.status === "available";

  return (
    <motion.div
      className="group flex flex-col rounded-2xl overflow-hidden site-card
                 site-card-hover"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ delay: (index % 3) * 0.08, duration: 0.5 }}
    >
      {/* Image */}
      <div className="relative overflow-hidden" style={{ height: "200px" }}>
        <img
          src={image}
          alt={`${vehicle.brand} ${vehicle.model}`}
          className="w-full h-full object-cover transition-transform
                     duration-700 group-hover:scale-105"
          onError={(e) => {
            e.target.src = DEFAULT_IMAGE;
          }}
        />

        {/* Status badge */}
        <div
          className="absolute top-3 left-3 px-2.5 py-1 rounded-full
                     text-[9px] font-bold uppercase tracking-[0.15em]"
          style={{
            background: status.bg,
            border: `1px solid ${status.color}40`,
            color: status.color,
          }}
        >
          {status.label}
        </div>

        {/* Year badge */}
        {vehicle.year && (
          <div
            className="absolute top-3 right-3 px-2.5 py-1 rounded-full
                       text-[9px] font-bold"
            style={{
              background: "rgba(5,10,20,0.8)",
              border: "1px solid rgba(248,246,240,0.1)",
              color: "rgba(248,246,240,0.7)",
            }}
          >
            {vehicle.year}
          </div>
        )}

        {/* Hover CTA overlay */}
        <div
          className="absolute inset-0 flex items-center justify-center
                     opacity-0 group-hover:opacity-100 transition-opacity
                     duration-300"
          style={{ background: "rgba(5,10,20,0.6)" }}
        >
          <Link
            to={`/cars/${vehicle.id}`}
            className="btn-gold text-[11px]"
            style={{ padding: "10px 20px" }}
          >
            View Details
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5">
        {/* Brand */}
        <p className="label-luxury mb-1.5">{vehicle.brand}</p>

        {/* Model */}
        <h3
          className="font-display text-lg font-semibold mb-1 leading-tight"
          style={{ color: "#F8F6F0" }}
        >
          {vehicle.model}
        </h3>

        {vehicle.variant && (
          <p
            className="text-xs mb-4"
            style={{ color: "rgba(248,246,240,0.4)" }}
          >
            {vehicle.variant}
          </p>
        )}

        {/* Specs row */}
        <div className="flex items-center gap-4 mb-5">
          {vehicle.mileage !== undefined && (
            <div className="flex items-center gap-1.5">
              <Gauge size={11} style={{ color: "#D4AF37" }} />
              <span
                className="text-[10px]"
                style={{ color: "rgba(248,246,240,0.5)" }}
              >
                {Number(vehicle.mileage).toLocaleString()} km
              </span>
            </div>
          )}
          {vehicle.fuelType && (
            <div className="flex items-center gap-1.5">
              <Zap size={11} style={{ color: "#D4AF37" }} />
              <span
                className="text-[10px] capitalize"
                style={{ color: "rgba(248,246,240,0.5)" }}
              >
                {vehicle.fuelType}
              </span>
            </div>
          )}
          {vehicle.transmission && (
            <div className="flex items-center gap-1.5">
              <span
                className="text-[10px] capitalize"
                style={{ color: "rgba(248,246,240,0.5)" }}
              >
                {vehicle.transmission}
              </span>
            </div>
          )}
        </div>

        {/* Price + CTA */}
        <div
          className="flex items-center justify-between mt-auto pt-4"
          style={{ borderTop: "1px solid rgba(212,175,55,0.1)" }}
        >
          <div>
            <p
              className="text-[9px] font-semibold tracking-[0.15em]
                         uppercase mb-0.5"
              style={{ color: "rgba(248,246,240,0.3)" }}
            >
              Price
            </p>
            <p
              className="font-display text-xl font-bold"
              style={{ color: "#D4AF37" }}
            >
              AED {Number(vehicle.price).toLocaleString()}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {isAvailable && (
              <Link
                to={`/test-drive?car=${vehicle.id}`}
                className="text-[10px] font-semibold tracking-[0.1em]
                           uppercase transition-colors"
                style={{ color: "rgba(248,246,240,0.4)" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#D4AF37")}
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "rgba(248,246,240,0.4)")
                }
              >
                Test Drive
              </Link>
            )}
            <Link
              to={`/cars/${vehicle.id}`}
              className="w-8 h-8 rounded-lg flex items-center justify-center
                         transition-all duration-200 active:scale-95"
              style={{
                background: "rgba(212,175,55,0.1)",
                border: "1px solid rgba(212,175,55,0.2)",
                color: "#D4AF37",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(212,175,55,0.2)";
                e.currentTarget.style.borderColor = "rgba(212,175,55,0.4)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(212,175,55,0.1)";
                e.currentTarget.style.borderColor = "rgba(212,175,55,0.2)";
              }}
              aria-label={`View ${vehicle.brand} ${vehicle.model}`}
            >
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default VehicleCard;
