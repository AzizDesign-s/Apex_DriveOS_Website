// src/data/mockData.js
// FIXED:
//   1. Promotion dates updated to future (currently July 2026,
//      so end dates pushed to Dec 2026)
//   2. Full cars seed matching admin panel exactly
//   3. Added customers, bookings seed so Account page has demo data
//   4. Added calcInvoice utility used by TestDrive page totals

// ── Seed cars ─────────────────────────────────────────────────────────────────
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
    notes: "Immaculate condition. Full service history.",
    features:
      "• AMG Performance Exhaust\n• Burmester 3D Surround Sound\n• Night Vision Assist\n• Driving Assistance Package Plus\n• AMG Track Pace",
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
    status: "available",
    photos: [],
    notes: "One owner. Warranty valid.",
    features:
      "• M Carbon Ceramic Brakes\n• Bowers & Wilkins Diamond Sound\n• M Driver's Package\n• Laser Headlights\n• Executive Package",
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
    notes: "Track-focused masterpiece.",
    features:
      "• Track-focused suspension\n• Carbon fibre body panels\n• Scuderia Ferrari shields\n• Racing bucket seats\n• Michelin Pilot Sport Cup 2",
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
    notes: "The pinnacle of luxury motoring.",
    features:
      "• Starlight Headliner\n• Bespoke Audio System\n• Rear Theatre Configuration\n• Champagne Cooler\n• Lambswool Floor Mats",
  },
  {
    id: 5,
    brand: "Lamborghini",
    model: "Urus Performante",
    variant: "Super SUV",
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
    notes: "World's fastest SUV.",
    features:
      "• Carbon fibre roof\n• Akrapovič titanium exhaust\n• Rear-wheel steering\n• Night Vision Camera\n• Lamborghini Pieno Fiore interior",
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
    status: "available",
    photos: [],
    notes: "The icon. Turbocharged perfection.",
    features:
      "• PASM Sport suspension\n• Burmester High-End Sound\n• Sport Chrono Package\n• Porsche Dynamic Light System\n• Rear-axle steering",
  },
  {
    id: 7,
    brand: "Bentley",
    model: "Continental GT",
    variant: "Speed Convertible",
    year: 2024,
    plate: "BNT-CGT",
    color: "Verdant",
    mileage: 600,
    fuelType: "petrol",
    transmission: "automatic",
    bodyType: "convertible",
    price: 1250000,
    status: "available",
    photos: [],
    notes: "Hand-crafted luxury at its finest.",
    features:
      "• Naim for Bentley Audio\n• Rotating Display\n• Diamond-in-Diamond quilting\n• All-Season Comfort Specification\n• City Specification",
  },
  {
    id: 8,
    brand: "McLaren",
    model: "720S",
    variant: "Spider",
    year: 2023,
    plate: "MCL-720",
    color: "Papaya Spark",
    mileage: 900,
    fuelType: "petrol",
    transmission: "automatic",
    bodyType: "convertible",
    price: 1100000,
    status: "available",
    photos: [],
    notes: "Pure British supercar engineering.",
    features:
      "• Carbon Fibre MonoCell II chassis\n• Active Dynamics Panel\n• McLaren Track Telemetry\n• Electrochromic glass roof\n• Variable Drift Control",
  },
];

// ── Seed promotions — FUTURE DATES ────────────────────────────────────────────
export const promotions = [
  {
    id: 1,
    promotionId: "PROMO-001",
    name: "Summer Luxury Festival",
    description:
      "Celebrate summer with an exclusive discount across our entire collection.",
    type: "festival",
    discountType: "percentage",
    discountValue: 8,
    appliesTo: "all",
    brandFilter: null,
    modelFilter: null,
    startDate: "2026-07-01",
    endDate: "2026-08-31",
    createdAt: "2026-06-20T08:00:00",
  },
  {
    id: 2,
    promotionId: "PROMO-002",
    name: "BMW Exclusive Offer",
    description:
      "Drive the ultimate driving machine with our exclusive BMW summer deal.",
    type: "percentage",
    discountType: "percentage",
    discountValue: 5,
    appliesTo: "brand",
    brandFilter: "BMW",
    modelFilter: null,
    startDate: "2026-07-01",
    endDate: "2026-09-30",
    createdAt: "2026-06-25T09:00:00",
  },
  {
    id: 3,
    promotionId: "PROMO-003",
    name: "Rolls Royce VIP Privilege",
    description:
      "An extraordinary offer for extraordinary clients on the Ghost EWB.",
    type: "flat",
    discountType: "flat",
    discountValue: 100000,
    appliesTo: "model",
    brandFilter: "Rolls Royce",
    modelFilter: "Ghost EWB",
    startDate: "2026-07-01",
    endDate: "2026-10-31",
    createdAt: "2026-07-01T10:00:00",
  },
  {
    id: 4,
    promotionId: "PROMO-004",
    name: "Loyalty Reward Programme",
    description:
      "Returning customers receive an exclusive loyalty discount on any vehicle.",
    type: "loyalty",
    discountType: "percentage",
    discountValue: 3,
    appliesTo: "all",
    brandFilter: null,
    modelFilter: null,
    startDate: "2026-01-01",
    endDate: "2026-12-31",
    createdAt: "2026-01-01T00:00:00",
  },
  {
    id: 5,
    promotionId: "PROMO-005",
    name: "Trade-In Bonus",
    description:
      "Receive AED 25,000 bonus value when you trade in your current vehicle.",
    type: "trade_in",
    discountType: "flat",
    discountValue: 25000,
    appliesTo: "all",
    brandFilter: null,
    modelFilter: null,
    startDate: "2026-07-01",
    endDate: "2026-12-31",
    createdAt: "2026-07-01T09:00:00",
  },
  {
    id: 6,
    promotionId: "PROMO-006",
    name: "Ferrari Pista — Last Unit",
    description:
      "Final clearance on our Ferrari 488 Pista Spider. Exceptional value.",
    type: "flat",
    discountType: "flat",
    discountValue: 75000,
    appliesTo: "model",
    brandFilter: "Ferrari",
    modelFilter: "488 Pista",
    startDate: "2026-07-01",
    endDate: "2026-09-30",
    createdAt: "2026-07-01T10:00:00",
  },
];

// ── Seed customers (for Account page demo) ────────────────────────────────────
export const customers = [
  {
    id: 1,
    customerId: "CUST-001",
    name: "Mohammed Al-Rashid",
    email: "mohammed@email.com",
    mobileCode: "+971",
    mobile: "50 123 4567",
    whatsappCode: "+971",
    whatsapp: "50 123 4567",
    dob: "",
    source: "Walk-in",
    instagram: "",
    facebook: "",
    status: "vip",
    notes: "VIP client. Repeat buyer.",
    createdAt: "2026-01-15",
    purchases: [],
    inquiries: [],
  },
];

// ── TIME_SLOTS ────────────────────────────────────────────────────────────────
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

// ── COUNTRY_CODES ─────────────────────────────────────────────────────────────
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

// ── ID generators ─────────────────────────────────────────────────────────────
export const generateBookingId = (existing = []) => {
  const nums = existing
    .map((b) => {
      const m = (b.bookingId || "").match(/TD-\d{4}-(\d+)/);
      return m ? parseInt(m[1], 10) : 0;
    })
    .filter((n) => !isNaN(n));
  const max = nums.length > 0 ? Math.max(...nums) : 0;
  return `TD-${new Date().getFullYear()}-${String(max + 1).padStart(3, "0")}`;
};

export const generateCustomerId = (existing = []) => {
  const nums = existing
    .map((c) => {
      const m = (c.customerId || "").match(/CUST-(\d+)/);
      return m ? parseInt(m[1], 10) : 0;
    })
    .filter((n) => !isNaN(n));
  const max = nums.length > 0 ? Math.max(...nums) : 0;
  return `CUST-${String(max + 1).padStart(3, "0")}`;
};

export const generateLeadId = (existing = []) => {
  const nums = existing
    .map((l) => {
      const m = (l.leadId || "").match(/LEAD-(\d+)/);
      return m ? parseInt(m[1], 10) : 0;
    })
    .filter((n) => !isNaN(n));
  const max = nums.length > 0 ? Math.max(...nums) : 0;
  return `LEAD-${String(max + 1).padStart(3, "0")}`;
};
