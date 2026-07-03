// src/hooks/useCustomerAuth.js
// Customer authentication state management.
// Uses sessionStorage so session clears when browser tab closes.
// Mock auth: matches against apex-driveos-customers localStorage.
// Real auth: replace with Supabase signIn when backend sprint runs.

import { useState, useCallback } from "react";
import {
  loadFromLS,
  KEYS,
  getCustomerSession,
  setCustomerSession,
  clearCustomerSession,
} from "../utils/localStorage";

export function useCustomerAuth() {
  const [customer, setCustomer] = useState(() => getCustomerSession());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ── Mock sign in ──────────────────────────────────────────────────────────
  // Finds a customer by email in apex-driveos-customers localStorage.
  // Any password is accepted for this sprint (mock auth).
  // Returns: { success, error }
  const signIn = useCallback(async (email, password) => {
    setLoading(true);
    setError(null);

    // Simulate a small async delay (feels more real)
    await new Promise((r) => setTimeout(r, 600));

    const allCustomers = loadFromLS(KEYS.customers, []);
    const found = allCustomers.find(
      (c) => c.email?.toLowerCase() === email.toLowerCase(),
    );

    setLoading(false);

    if (!found) {
      const msg = "No account found with this email address.";
      setError(msg);
      return { success: false, error: msg };
    }

    // Mock: any password works — replace with real auth later
    const session = {
      id: found.id,
      customerId: found.customerId,
      name: found.name,
      email: found.email,
      status: found.status,
      createdAt: found.createdAt,
    };

    setCustomerSession(session);
    setCustomer(session);
    return { success: true };
  }, []);

  // ── Sign out ──────────────────────────────────────────────────────────────
  const signOut = useCallback(() => {
    clearCustomerSession();
    setCustomer(null);
  }, []);

  const isAuthenticated = !!customer;

  return {
    customer,
    isAuthenticated,
    loading,
    error,
    signIn,
    signOut,
  };
}
