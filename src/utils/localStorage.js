// src/utils/localStorage.js
// Shared localStorage key constants and helpers.
// These keys MATCH the admin panel exactly — this is the
// data bridge between the two apps when running locally.

// ── Shared keys (written by admin, read by website) ──────────────────────────
export const KEYS = {
  cars: "apex-driveos-cars",
  customers: "apex-driveos-customers",
  bookings: "apex-driveos-bookings",
  invoices: "apex-driveos-invoices",
  promotions: "apex-driveos-promotions",
  notifications: "apex-driveos-notifications",
  leads: "apex-driveos-leads",
};

// ── Website-only keys ─────────────────────────────────────────────────────────
export const SITE_KEYS = {
  customerSession: "apex-customer-session",
};

// ── Generic loader ────────────────────────────────────────────────────────────
export const loadFromLS = (key, fallback = []) => {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch {
    return fallback;
  }
};

// ── Generic writer ────────────────────────────────────────────────────────────
export const saveToLS = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    window.dispatchEvent(new CustomEvent(`${key}-updated`, { detail: data }));
  } catch {
    /* silent — localStorage can be disabled in some browsers */
  }
};

// ── Customer session ──────────────────────────────────────────────────────────
export const getCustomerSession = () => {
  try {
    const saved = sessionStorage.getItem(SITE_KEYS.customerSession);
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
};

export const setCustomerSession = (customer) => {
  try {
    sessionStorage.setItem(SITE_KEYS.customerSession, JSON.stringify(customer));
  } catch {
    /* silent */
  }
};

export const clearCustomerSession = () => {
  try {
    sessionStorage.removeItem(SITE_KEYS.customerSession);
  } catch {
    /* silent */
  }
};
