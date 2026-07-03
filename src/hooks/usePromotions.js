// src/hooks/usePromotions.js
// Live promotions from localStorage (shared with admin panel).

import { useState, useEffect } from "react";
import { loadFromLS, KEYS } from "../utils/localStorage";
import { promotions as seedPromotions } from "../data/mockData";

// ── Status helper (same logic as admin's getPromotionStatus) ─────────────────
export const getPromotionStatus = (promotion) => {
  const today = new Date();
  const start = new Date(promotion.startDate);
  const end = new Date(promotion.endDate);
  if (today < start) return "upcoming";
  if (today > end) return "expired";
  return "active";
};

export function usePromotions() {
  const [promotions, setPromotions] = useState(() =>
    loadFromLS(KEYS.promotions, seedPromotions),
  );

  useEffect(() => {
    const reload = () =>
      setPromotions(loadFromLS(KEYS.promotions, seedPromotions));
    window.addEventListener("apex-driveos-promotions-updated", reload);
    window.addEventListener("storage", (e) => {
      if (e.key === KEYS.promotions) reload();
    });
    return () => {
      window.removeEventListener("apex-driveos-promotions-updated", reload);
      window.removeEventListener("storage", reload);
    };
  }, []);

  const active = promotions.filter((p) => getPromotionStatus(p) === "active");
  const upcoming = promotions.filter(
    (p) => getPromotionStatus(p) === "upcoming",
  );

  return { promotions, active, upcoming };
}
