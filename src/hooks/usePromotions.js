// src/hooks/usePromotions.js
// FIXED: BroadcastChannel sync + seed initialization

import { useState, useEffect } from "react";
import {
  loadFromLS,
  KEYS,
  onBroadcastMessage,
  initializeSeedData,
} from "../utils/localStorage";
import { promotions as seedPromotions } from "../data/mockData";

initializeSeedData({ [KEYS.promotions]: seedPromotions });

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

    const unsubscribe = onBroadcastMessage(({ key, data }) => {
      if (key === KEYS.promotions && Array.isArray(data)) {
        setPromotions(data);
        try {
          localStorage.setItem(KEYS.promotions, JSON.stringify(data));
        } catch {
          /* silent */
        }
      }
    });

    window.addEventListener("apex-driveos-promotions-updated", reload);
    window.addEventListener("storage", (e) => {
      if (e.key === KEYS.promotions) reload();
    });

    return () => {
      window.removeEventListener("apex-driveos-promotions-updated", reload);
      unsubscribe();
    };
  }, []);

  const active = promotions.filter((p) => getPromotionStatus(p) === "active");
  const upcoming = promotions.filter(
    (p) => getPromotionStatus(p) === "upcoming",
  );

  return { promotions, active, upcoming };
}
