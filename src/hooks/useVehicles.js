// src/hooks/useVehicles.js
// FIXED: BroadcastChannel sync + seed initialization

import { useState, useEffect } from "react";
import {
  loadFromLS,
  saveToLS,
  KEYS,
  onBroadcastMessage,
  initializeSeedData,
} from "../utils/localStorage";
import {
  cars as seedCars,
  promotions as seedPromotions,
} from "../data/mockData";

// Initialize seed data on first load
initializeSeedData({
  [KEYS.cars]: seedCars,
  [KEYS.promotions]: seedPromotions,
});

export function useVehicles() {
  const [vehicles, setVehicles] = useState(() =>
    loadFromLS(KEYS.cars, seedCars),
  );

  useEffect(() => {
    // Same-origin event (admin on same port — future)
    const onSameOrigin = () => setVehicles(loadFromLS(KEYS.cars, seedCars));

    // Cross-port BroadcastChannel sync (admin on different port)
    const unsubscribe = onBroadcastMessage(({ key, data }) => {
      if (key === KEYS.cars && Array.isArray(data)) {
        setVehicles(data);
        // Also persist to this origin's localStorage
        try {
          localStorage.setItem(KEYS.cars, JSON.stringify(data));
        } catch {
          /* silent */
        }
      }
    });

    window.addEventListener("apex-driveos-cars-updated", onSameOrigin);
    window.addEventListener("storage", (e) => {
      if (e.key === KEYS.cars) onSameOrigin();
    });

    return () => {
      window.removeEventListener("apex-driveos-cars-updated", onSameOrigin);
      unsubscribe();
    };
  }, []);

  const available = vehicles.filter(
    (v) => v.status === "available" || v.status === "interested",
  );

  const featured = [...available].sort((a, b) => b.price - a.price).slice(0, 3);

  return { vehicles, available, featured };
}
