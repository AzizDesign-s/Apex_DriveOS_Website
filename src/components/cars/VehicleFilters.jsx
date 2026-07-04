// src/components/cars/VehicleFilters.jsx
// Sticky left sidebar filter panel.
// Desktop: always visible. Mobile: hidden behind filter button
// (toggled by parent Cars.jsx via isOpen + onClose props).

import { motion, AnimatePresence } from "framer-motion";
import { X, SlidersHorizontal } from "lucide-react";
import clsx from "clsx";

const FUEL_TYPES = ["petrol", "diesel", "electric", "hybrid"];
const BODY_TYPES = ["coupe", "sedan", "suv", "convertible", "hatchback"];
const TRANSMISSIONS = ["automatic", "manual"];

const PRICE_RANGES = [
  { label: "Any Price", min: 0, max: Infinity },
  { label: "Under AED 500K", min: 0, max: 500000 },
  { label: "AED 500K – 1M", min: 500000, max: 1000000 },
  { label: "AED 1M – 2M", min: 1000000, max: 2000000 },
  { label: "Above AED 2M", min: 2000000, max: Infinity },
];

// ── Filter section wrapper ────────────────────────────────────────────────────
function FilterSection({ title, children }) {
  return (
    <div className="mb-7">
      <p
        className="text-[9px] font-bold tracking-[0.25em] uppercase mb-3"
        style={{ color: "#D4AF37" }}
      >
        {title}
      </p>
      {children}
    </div>
  );
}

// ── Checkbox pill ─────────────────────────────────────────────────────────────
function CheckPill({ label, checked, onChange }) {
  return (
    <button
      onClick={onChange}
      className="flex items-center gap-2 py-1.5 text-left w-full
                 transition-colors duration-150 group"
    >
      <div
        className="w-4 h-4 rounded flex items-center justify-center
                   flex-shrink-0 transition-all duration-150"
        style={{
          background: checked ? "#D4AF37" : "transparent",
          border: checked
            ? "1px solid #D4AF37"
            : "1px solid rgba(212,175,55,0.25)",
        }}
      >
        {checked && (
          <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
            <path
              d="M1 3L3 5L7 1"
              stroke="#050A14"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </div>
      <span
        className="text-xs capitalize transition-colors"
        style={{ color: checked ? "#F8F6F0" : "rgba(248,246,240,0.5)" }}
      >
        {label}
      </span>
    </button>
  );
}

function FilterContent({ filters, brands, onChange, onReset }) {
  return (
    <div>
      {/* Header */}
      <div
        className="flex items-center justify-between mb-6 pb-4"
        style={{ borderBottom: "1px solid rgba(212,175,55,0.1)" }}
      >
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={14} style={{ color: "#D4AF37" }} />
          <span
            className="text-xs font-semibold tracking-[0.15em] uppercase"
            style={{ color: "#F8F6F0" }}
          >
            Filters
          </span>
        </div>
        {/* Active filter count */}
        {(filters.brands.length > 0 ||
          filters.fuelTypes.length > 0 ||
          filters.bodyTypes.length > 0 ||
          filters.priceRange !== 0) && (
          <button
            onClick={onReset}
            className="text-[10px] font-semibold transition-colors"
            style={{ color: "rgba(212,175,55,0.6)" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#D4AF37")}
            onMouseLeave={(e) =>
              (e.currentTarget.style.color = "rgba(212,175,55,0.6)")
            }
          >
            Clear all
          </button>
        )}
      </div>

      {/* Price Range */}
      <FilterSection title="Price Range">
        <div className="space-y-1">
          {PRICE_RANGES.map((range, i) => (
            <CheckPill
              key={range.label}
              label={range.label}
              checked={filters.priceRange === i}
              onChange={() => onChange("priceRange", i)}
            />
          ))}
        </div>
      </FilterSection>

      {/* Brand */}
      {brands.length > 0 && (
        <FilterSection title="Brand">
          <div className="space-y-1">
            {brands.map((brand) => (
              <CheckPill
                key={brand}
                label={brand}
                checked={filters.brands.includes(brand)}
                onChange={() => {
                  const next = filters.brands.includes(brand)
                    ? filters.brands.filter((b) => b !== brand)
                    : [...filters.brands, brand];
                  onChange("brands", next);
                }}
              />
            ))}
          </div>
        </FilterSection>
      )}

      {/* Fuel Type */}
      <FilterSection title="Fuel Type">
        <div className="space-y-1">
          {FUEL_TYPES.map((fuel) => (
            <CheckPill
              key={fuel}
              label={fuel}
              checked={filters.fuelTypes.includes(fuel)}
              onChange={() => {
                const next = filters.fuelTypes.includes(fuel)
                  ? filters.fuelTypes.filter((f) => f !== fuel)
                  : [...filters.fuelTypes, fuel];
                onChange("fuelTypes", next);
              }}
            />
          ))}
        </div>
      </FilterSection>

      {/* Body Type */}
      <FilterSection title="Body Type">
        <div className="space-y-1">
          {BODY_TYPES.map((body) => (
            <CheckPill
              key={body}
              label={body}
              checked={filters.bodyTypes.includes(body)}
              onChange={() => {
                const next = filters.bodyTypes.includes(body)
                  ? filters.bodyTypes.filter((b) => b !== body)
                  : [...filters.bodyTypes, body];
                onChange("bodyTypes", next);
              }}
            />
          ))}
        </div>
      </FilterSection>

      {/* Transmission */}
      <FilterSection title="Transmission">
        <div className="space-y-1">
          {TRANSMISSIONS.map((trans) => (
            <CheckPill
              key={trans}
              label={trans}
              checked={filters.transmissions.includes(trans)}
              onChange={() => {
                const next = filters.transmissions.includes(trans)
                  ? filters.transmissions.filter((t) => t !== trans)
                  : [...filters.transmissions, trans];
                onChange("transmissions", next);
              }}
            />
          ))}
        </div>
      </FilterSection>
    </div>
  );
}

function VehicleFilters({
  filters,
  brands,
  onChange,
  onReset,
  // Mobile drawer controls
  mobileOpen,
  onMobileClose,
}) {
  return (
    <>
      {/* ── Desktop sidebar — always visible ── */}
      <aside
        className="hidden lg:block w-56 flex-shrink-0 sticky"
        style={{ top: "104px", alignSelf: "flex-start" }}
      >
        <div
          className="rounded-2xl p-5"
          style={{
            background: "#0D1829",
            border: "1px solid rgba(212,175,55,0.1)",
          }}
        >
          <FilterContent
            filters={filters}
            brands={brands}
            onChange={onChange}
            onReset={onReset}
          />
        </div>
      </aside>

      {/* ── Mobile bottom drawer ── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-40 lg:hidden"
              style={{ background: "rgba(5,10,20,0.8)" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onMobileClose}
            />

            {/* Drawer */}
            <motion.div
              className="fixed bottom-0 left-0 right-0 z-50 lg:hidden
                         rounded-t-3xl overflow-y-auto"
              style={{
                background: "#0D1829",
                border: "1px solid rgba(212,175,55,0.15)",
                maxHeight: "80vh",
              }}
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              {/* Drag handle */}
              <div className="flex justify-center pt-3 pb-1">
                <div
                  className="w-10 h-1 rounded-full"
                  style={{ background: "rgba(212,175,55,0.2)" }}
                />
              </div>

              {/* Close button */}
              <div className="flex justify-end px-5 pb-2">
                <button
                  onClick={onMobileClose}
                  className="w-8 h-8 flex items-center justify-center rounded-lg
                             transition-colors"
                  style={{ color: "rgba(248,246,240,0.5)" }}
                >
                  <X size={16} />
                </button>
              </div>

              <div className="px-5 pb-8">
                <FilterContent
                  filters={filters}
                  brands={brands}
                  onChange={onChange}
                  onReset={onReset}
                />
                <button
                  onClick={onMobileClose}
                  className="btn-gold w-full justify-center mt-4"
                >
                  Show Results
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export { PRICE_RANGES };
export default VehicleFilters;
