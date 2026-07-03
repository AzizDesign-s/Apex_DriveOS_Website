// src/hooks/useVehicles.js
// Live vehicle data from localStorage (shared with admin panel).
// Falls back to seed data if localStorage is empty.

import { useState, useEffect } from "react";
import { loadFromLS, KEYS } from "../utils/localStorage";
import { cars as seedCars } from "../data/mockData";

export function useVehicles() {
  const [vehicles, setVehicles] = useState(() =>
    loadFromLS(KEYS.cars, seedCars),
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Reload when admin updates inventory
    const reload = () => setVehicles(loadFromLS(KEYS.cars, seedCars));
    window.addEventListener("apex-driveos-cars-updated", reload);
    window.addEventListener("storage", (e) => {
      if (e.key === KEYS.cars) reload();
    });
    return () => {
      window.removeEventListener("apex-driveos-cars-updated", reload);
      window.removeEventListener("storage", reload);
    };
  }, []);

  // Only show vehicles customers can buy or be interested in
  const available = vehicles.filter(
    (v) => v.status === "available" || v.status === "interested",
  );

  // Featured: the 3 most expensive available vehicles
  const featured = [...available].sort((a, b) => b.price - a.price).slice(0, 3);

  return { vehicles, available, featured, loading };
}
