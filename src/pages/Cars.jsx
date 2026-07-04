// src/pages/Cars.jsx
// Vehicle browse page — left sidebar filters + 3-col grid.
// Data: live from localStorage (apex-driveos-cars) via useVehicles hook.
// Filters: brand, price range, fuel type, body type, transmission.
// Sort: price asc/desc, newest, brand A-Z.

import { useState, useMemo } from "react";
import { SlidersHorizontal, Search, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import PageLayout from "../components/layout/PageLayout";
import VehicleCard from "../components/cars/VehicleCard";
import VehicleFilters, {
  PRICE_RANGES,
} from "../components/cars/VehicleFilters";
import SectionHeading from "../components/ui/SectionHeading";
import { useVehicles } from "../hooks/useVehicles";

const SORT_OPTIONS = [
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "brand-az", label: "Brand: A–Z" },
  { value: "newest", label: "Newest First" },
];

const EMPTY_FILTERS = {
  brands: [],
  fuelTypes: [],
  bodyTypes: [],
  transmissions: [],
  priceRange: 0, // index into PRICE_RANGES
};

function Cars() {
  const { available } = useVehicles();

  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("price-asc");
  const [mobileFilters, setMobileFilters] = useState(false);

  // Derive unique brands from live data
  const brands = useMemo(
    () => [...new Set(available.map((v) => v.brand))].sort(),
    [available],
  );

  // Apply all filters + sort
  const filtered = useMemo(() => {
    let data = [...available];

    // Search
    if (search.trim()) {
      const q = search.toLowerCase();
      data = data.filter((v) =>
        `${v.brand} ${v.model} ${v.variant || ""} ${v.year || ""}`
          .toLowerCase()
          .includes(q),
      );
    }

    // Brand
    if (filters.brands.length > 0) {
      data = data.filter((v) => filters.brands.includes(v.brand));
    }

    // Price range
    if (filters.priceRange > 0) {
      const range = PRICE_RANGES[filters.priceRange];
      data = data.filter((v) => v.price >= range.min && v.price < range.max);
    }

    // Fuel type
    if (filters.fuelTypes.length > 0) {
      data = data.filter((v) => filters.fuelTypes.includes(v.fuelType));
    }

    // Body type
    if (filters.bodyTypes.length > 0) {
      data = data.filter((v) => filters.bodyTypes.includes(v.bodyType));
    }

    // Transmission
    if (filters.transmissions.length > 0) {
      data = data.filter((v) => filters.transmissions.includes(v.transmission));
    }

    // Sort
    switch (sortBy) {
      case "price-asc":
        data.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        data.sort((a, b) => b.price - a.price);
        break;
      case "brand-az":
        data.sort((a, b) => a.brand.localeCompare(b.brand));
        break;
      case "newest":
        data.sort((a, b) => (b.year || 0) - (a.year || 0));
        break;
    }

    return data;
  }, [available, search, filters, sortBy]);

  const handleFilterChange = (key, value) => {
    setFilters((f) => ({ ...f, [key]: value }));
  };

  const handleReset = () => {
    setFilters(EMPTY_FILTERS);
    setSearch("");
  };

  const activeFilterCount =
    filters.brands.length +
    filters.fuelTypes.length +
    filters.bodyTypes.length +
    filters.transmissions.length +
    (filters.priceRange > 0 ? 1 : 0);

  return (
    <PageLayout>
      {/* Page hero band */}
      <div
        className="py-16 mb-0"
        style={{
          background: "#0B1120",
          borderBottom: "1px solid rgba(212,175,55,0.08)",
        }}
      >
        <div className="container-site ">
          <SectionHeading
            label="Our Collection"
            title="Luxury Vehicles"
            subtitle={`${available.length} exceptional vehicles available`}
          />
        </div>
      </div>

      {/* Main layout */}
      <div className="container-site py-12 ">
        {/* Mobile toolbar */}
        <div className="lg:hidden flex items-center gap-3 my-6">
          {/* Search */}
          <div className="relative flex-1">
            <Search
              size={14}
              className="absolute right-3 top-1/2 -translate-y-1/2"
              style={{ color: "rgba(248,246,240,0.3)" }}
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search vehicles..."
              className="input-site pl-9 text-sm py-3 w-full"
            />
          </div>

          {/* Filter button */}
          <button
            onClick={() => setMobileFilters(true)}
            className="flex items-center gap-2 px-4 py-3 rounded-xl
                       text-xs font-semibold flex-shrink-0 transition-all
                       active:scale-95"
            style={{
              background:
                activeFilterCount > 0
                  ? "rgba(212,175,55,0.15)"
                  : "rgba(13,24,41,0.8)",
              border:
                activeFilterCount > 0
                  ? "1px solid rgba(212,175,55,0.4)"
                  : "1px solid rgba(212,175,55,0.15)",
              color: activeFilterCount > 0 ? "#D4AF37" : "#F8F6F0",
            }}
          >
            <SlidersHorizontal size={14} />
            Filters
            {activeFilterCount > 0 && (
              <span
                className="w-5 h-5 rounded-full flex items-center justify-center
                           text-[9px] font-bold"
                style={{ background: "#D4AF37", color: "#050A14" }}
              >
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        <div className="flex gap-8 py-12 items-start">
          {/* Sidebar filters */}
          <VehicleFilters
            filters={filters}
            brands={brands}
            onChange={handleFilterChange}
            onReset={handleReset}
            mobileOpen={mobileFilters}
            onMobileClose={() => setMobileFilters(false)}
          />

          {/* Right: search + sort + grid */}
          <div className="flex-1 min-w-0">
            {/* Desktop toolbar */}
            <div className="hidden lg:flex items-center gap-4 mb-8">
              {/* Search */}
              <div className="relative flex-1 max-w-xs">
                <Search
                  size={14}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: "rgba(248,246,240,0.3)" }}
                />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search brand, model..."
                  className="input-site pl-9 text-sm py-3 w-full"
                />
              </div>

              {/* Spacer */}
              <div className="flex-1" />

              {/* Result count */}
              <p
                className="text-xs flex-shrink-0"
                style={{ color: "rgba(248,246,240,0.4)" }}
              >
                {filtered.length} vehicle{filtered.length !== 1 ? "s" : ""}
              </p>

              {/* Sort */}
              <div className="relative flex-shrink-0">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="input-site text-xs py-2.5 pr-8 appearance-none
                             cursor-pointer"
                  style={{ minWidth: "180px" }}
                >
                  {SORT_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={13}
                  className="absolute right-3 top-1/2 -translate-y-1/2
                             pointer-events-none"
                  style={{ color: "rgba(248,246,240,0.4)" }}
                />
              </div>
            </div>

            {/* Mobile sort */}
            <div className="lg:hidden flex items-center justify-between mb-6">
              <p className="text-xs" style={{ color: "rgba(248,246,240,0.4)" }}>
                {filtered.length} vehicle{filtered.length !== 1 ? "s" : ""}
              </p>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="input-site text-xs py-2 pr-8 appearance-none cursor-pointer"
                  style={{ minWidth: "160px" }}
                >
                  {SORT_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={12}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
                  style={{ color: "rgba(248,246,240,0.4)" }}
                />
              </div>
            </div>

            {/* Vehicle grid */}
            <AnimatePresence mode="wait">
              {filtered.length === 0 ? (
                <motion.div
                  key="empty"
                  className="flex flex-col items-center justify-center py-28 text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5"
                    style={{
                      background: "rgba(212,175,55,0.06)",
                      border: "1px solid rgba(212,175,55,0.1)",
                    }}
                  >
                    <Search
                      size={24}
                      style={{ color: "rgba(212,175,55,0.3)" }}
                    />
                  </div>
                  <p
                    className="font-display text-xl mb-2"
                    style={{ color: "#F8F6F0" }}
                  >
                    No vehicles found
                  </p>
                  <p
                    className="text-sm mb-6"
                    style={{ color: "rgba(248,246,240,0.4)" }}
                  >
                    Try adjusting your filters or search term
                  </p>
                  <button onClick={handleReset} className="btn-ghost text-xs">
                    Clear Filters
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="grid"
                  className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {filtered.map((vehicle, i) => (
                    <VehicleCard key={vehicle.id} vehicle={vehicle} index={i} />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}

export default Cars;
