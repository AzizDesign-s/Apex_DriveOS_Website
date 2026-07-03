// src/data/mockData.js
// Website copy of admin mock data.
// Cars use the same shape as the admin panel so localStorage
// reads work correctly when both apps run in the same browser.
// Promotions are also copied here as fallback seed data.

// ── Seed cars (fallback when apex-driveos-cars is empty) ──────────────────────────
// These match the admin panel seed data exactly.
// Images are null — the elegant placeholder renders instead.
// When real photos are added via admin, they appear here automatically.

export const cars = [
  {
    id: 1,
    brand: "Mercedes",
    model: "AMG GT 63S",
    variant: "4-Door Coupe",
    year: 2024,
    plate: "AXG-2024",
    color: "Obsidian Black",
    mileage: 1200,
    fuelType: "petrol",
    transmission: "automatic",
    bodyType: "coupe",
    price: 680000,
    status: "available",
    photos: [],
    notes: "",
    features:
      "• AMG Performance Exhaust\n• Burmester 3D Surround Sound\n• Night Vision Assist\n• Driving Assistance Package",
  },
  {
    id: 2,
    brand: "BMW",
    model: "M8 Competition",
    variant: "Gran Coupe",
    year: 2024,
    plate: "BMW-M8X",
    color: "Frozen Marina Bay Blue",
    mileage: 800,
    fuelType: "petrol",
    transmission: "automatic",
    bodyType: "coupe",
    price: 520000,
    status: "reserved",
    photos: [],
    notes: "",
    features:
      "• M Carbon Ceramic Brakes\n• Bowers & Wilkins Diamond Surround Sound\n• M Driver's Package\n• Laser Headlights",
  },
  {
    id: 3,
    brand: "Ferrari",
    model: "488 Pista",
    variant: "Spider",
    year: 2023,
    plate: "FER-488",
    color: "Rosso Corsa",
    mileage: 350,
    fuelType: "petrol",
    transmission: "automatic",
    bodyType: "convertible",
    price: 950000,
    status: "available",
    photos: [],
    notes: "",
    features:
      "• Track-focused suspension\n• Carbon fibre body panels\n• Scuderia Ferrari shields\n• Racing bucket seats",
  },
  {
    id: 4,
    brand: "Rolls Royce",
    model: "Ghost EWB",
    variant: "Extended Wheelbase",
    year: 2024,
    plate: "RRG-2024",
    color: "Andalusian White",
    mileage: 500,
    fuelType: "petrol",
    transmission: "automatic",
    bodyType: "sedan",
    price: 1890000,
    status: "available",
    photos: [],
    notes: "",
    features:
      "• Starlight Headliner\n• Bespoke Audio System\n• Rear Theatre Configuration\n• Champagne Cooler",
  },
  {
    id: 5,
    brand: "Lamborghini",
    model: "Urus Performante",
    variant: "SUV",
    year: 2024,
    plate: "LMB-URS",
    color: "Grigio Lynx",
    mileage: 200,
    fuelType: "petrol",
    transmission: "automatic",
    bodyType: "suv",
    price: 820000,
    status: "available",
    photos: [],
    notes: "",
    features:
      "• Carbon fibre roof\n• Akrapovič titanium exhaust\n• Rear-wheel steering\n• Night Vision Camera",
  },
  {
    id: 6,
    brand: "Porsche",
    model: "911 Turbo S",
    variant: "Cabriolet",
    year: 2024,
    plate: "PCH-911",
    color: "GT Silver Metallic",
    mileage: 1800,
    fuelType: "petrol",
    transmission: "automatic",
    bodyType: "convertible",
    price: 620000,
    status: "maintenance",
    photos: [],
    notes: "",
    features:
      "• PASM Sport suspension\n• Burmester High-End Surround Sound\n• Sport Chrono Package\n• Porsche Dynamic Light System",
  },
];

// ── Promotions seed (fallback when apex-driveos-promotions is empty) ───────────────
export const promotions = [
  {
    id: 1,
    promotionId: "PROMO-001",
    name: "Eid Al-Adha Special",
    description: "Celebrate Eid with an exclusive discount on all vehicles.",
    type: "festival",
    discountType: "percentage",
    discountValue: 8,
    appliesTo: "all",
    brandFilter: null,
    modelFilter: null,
    startDate: "2026-06-01",
    endDate: "2026-06-30",
  },
  {
    id: 2,
    promotionId: "PROMO-002",
    name: "BMW Summer Drive",
    description: "Exclusive summer offer on all BMW models.",
    type: "percentage",
    discountType: "percentage",
    discountValue: 5,
    appliesTo: "brand",
    brandFilter: "BMW",
    modelFilter: null,
    startDate: "2026-06-01",
    endDate: "2026-07-31",
  },
  {
    id: 6,
    promotionId: "PROMO-006",
    name: "Trade-In Bonus",
    description: "AED 25,000 bonus when trading in any vehicle.",
    type: "trade_in",
    discountType: "flat",
    discountValue: 25000,
    appliesTo: "all",
    brandFilter: null,
    modelFilter: null,
    startDate: "2026-06-15",
    endDate: "2026-08-15",
  },
];

// ── TIME_SLOTS (for test drive booking form) ──────────────────────────────────
export const TIME_SLOTS = [
  "09:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "01:00 PM",
  "02:00 PM",
  "03:00 PM",
  "04:00 PM",
  "05:00 PM",
  "06:00 PM",
];

// ── COUNTRY_CODES (for phone input) ──────────────────────────────────────────
export const COUNTRY_CODES = [
  { code: "+971", flag: "🇦🇪", country: "UAE" },
  { code: "+966", flag: "🇸🇦", country: "Saudi Arabia" },
  { code: "+974", flag: "🇶🇦", country: "Qatar" },
  { code: "+965", flag: "🇰🇼", country: "Kuwait" },
  { code: "+973", flag: "🇧🇭", country: "Bahrain" },
  { code: "+968", flag: "🇴🇲", country: "Oman" },
  { code: "+44", flag: "🇬🇧", country: "UK" },
  { code: "+1", flag: "🇺🇸", country: "USA" },
  { code: "+91", flag: "🇮🇳", country: "India" },
  { code: "+49", flag: "🇩🇪", country: "Germany" },
];

// ── Booking ID generator ──────────────────────────────────────────────────────
export const generateBookingId = (existing = []) => {
  const nums = existing
    .map((b) => {
      const match = (b.bookingId || "").match(/TD-\d{4}-(\d+)/);
      return match ? parseInt(match[1], 10) : 0;
    })
    .filter((n) => !isNaN(n));
  const max = nums.length > 0 ? Math.max(...nums) : 0;
  const year = new Date().getFullYear();
  return `TD-${year}-${String(max + 1).padStart(3, "0")}`;
};

// ── Customer ID generator ─────────────────────────────────────────────────────
export const generateCustomerId = (existing = []) => {
  const nums = existing
    .map((c) => {
      const match = (c.customerId || "").match(/CUST-(\d+)/);
      return match ? parseInt(match[1], 10) : 0;
    })
    .filter((n) => !isNaN(n));
  const max = nums.length > 0 ? Math.max(...nums) : 0;
  return `CUST-${String(max + 1).padStart(3, "0")}`;
};

// ── Lead ID generator ─────────────────────────────────────────────────────────
export const generateLeadId = (existing = []) => {
  const nums = existing
    .map((l) => {
      const match = (l.leadId || "").match(/LEAD-(\d+)/);
      return match ? parseInt(match[1], 10) : 0;
    })
    .filter((n) => !isNaN(n));
  const max = nums.length > 0 ? Math.max(...nums) : 0;
  return `LEAD-${String(max + 1).padStart(3, "0")}`;
};
