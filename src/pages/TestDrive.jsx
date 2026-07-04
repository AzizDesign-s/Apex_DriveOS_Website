// src/pages/TestDrive.jsx
// Sprint 5 — Test Drive Booking page.
//
// CROSS-MODULE WRITES (on submit):
//   apex-driveos-bookings  — new booking record (status: pending)
//   apex-driveos-customers — create/find customer (source: Website)
//   apex-driveos-leads     — new lead (status: new_inquiry, source: Website)
//
// PRE-FILL:
//   ?car=:id in URL pre-selects the vehicle

import { useState, useEffect, useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Car,
  Calendar,
  Clock,
  User,
  Mail,
  Phone,
  MessageSquare,
  CheckCircle2,
  ArrowRight,
  ChevronDown,
  AlertCircle,
} from "lucide-react";
import PageLayout from "../components/layout/PageLayout";
import SectionHeading from "../components/ui/SectionHeading";
import { useVehicles } from "../hooks/useVehicles";
import { loadFromLS, saveToLS, KEYS } from "../utils/localStorage";
import {
  TIME_SLOTS,
  COUNTRY_CODES,
  generateBookingId,
  generateCustomerId,
  generateLeadId,
} from "../data/mockData";

// ── Form field wrapper ────────────────────────────────────────────────────────
function Field({ label, required, error, children }) {
  return (
    <div className="flex flex-col gap-2">
      <label
        className="text-[10px] font-bold tracking-[0.2em] uppercase"
        style={{ color: "rgba(248,246,240,0.5)" }}
      >
        {label}
        {required && (
          <span style={{ color: "#D4AF37", marginLeft: "4px" }}>*</span>
        )}
      </label>
      {children}
      {error && (
        <div className="flex items-center gap-1.5">
          <AlertCircle size={11} style={{ color: "#FB7185" }} />
          <p className="text-[10px]" style={{ color: "#FB7185" }}>
            {error}
          </p>
        </div>
      )}
    </div>
  );
}

// ── Success screen ────────────────────────────────────────────────────────────
function SuccessScreen({ bookingRef, carName, date, time, onReset }) {
  return (
    <motion.div
      className="flex flex-col items-center text-center py-20 max-w-lg mx-auto"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Animated checkmark */}
      <motion.div
        className="w-20 h-20 rounded-full flex items-center justify-center mb-8"
        style={{
          background: "rgba(16,185,129,0.1)",
          border: "1px solid rgba(16,185,129,0.25)",
        }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
      >
        <CheckCircle2 size={36} style={{ color: "#10B981" }} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <p className="label-luxury mb-3">Booking Confirmed</p>
        <h2
          className="font-display text-3xl font-semibold mb-4"
          style={{ color: "#F8F6F0" }}
        >
          Your Test Drive is Booked
        </h2>
        <p
          className="text-sm leading-relaxed mb-8"
          style={{ color: "rgba(248,246,240,0.5)" }}
        >
          Our team will contact you within 24 hours to confirm your appointment.
          Please arrive 10 minutes before your scheduled time.
        </p>
      </motion.div>

      {/* Booking summary card */}
      <motion.div
        className="w-full rounded-2xl p-6 mb-8 text-left"
        style={{
          background: "#0D1829",
          border: "1px solid rgba(212,175,55,0.15)",
        }}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        {/* Reference */}
        <div
          className="flex items-center justify-between mb-5 pb-4"
          style={{ borderBottom: "1px solid rgba(212,175,55,0.1)" }}
        >
          <p
            className="text-[9px] font-bold tracking-[0.2em] uppercase"
            style={{ color: "rgba(248,246,240,0.35)" }}
          >
            Booking Reference
          </p>
          <p
            className="font-mono text-sm font-bold"
            style={{ color: "#D4AF37" }}
          >
            {bookingRef}
          </p>
        </div>

        {/* Summary rows */}
        {[
          { label: "Vehicle", value: carName },
          { label: "Date", value: date },
          { label: "Time", value: time },
          { label: "Location", value: "Sheikh Zayed Road, Dubai" },
        ].map((row) => (
          <div
            key={row.label}
            className="flex items-center justify-between py-2"
          >
            <span
              className="text-xs"
              style={{ color: "rgba(248,246,240,0.4)" }}
            >
              {row.label}
            </span>
            <span
              className="text-xs font-semibold"
              style={{ color: "#F8F6F0" }}
            >
              {row.value}
            </span>
          </div>
        ))}
      </motion.div>

      {/* Actions */}
      <motion.div
        className="flex flex-wrap gap-3 justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <Link to="/cars" className="btn-gold">
          Browse More Vehicles
          <ArrowRight size={15} />
        </Link>
        <button onClick={onReset} className="btn-ghost">
          Book Another
        </button>
      </motion.div>
    </motion.div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
function TestDrive() {
  const [searchParams] = useSearchParams();
  const preselectedCarId = searchParams.get("car");

  const { vehicles } = useVehicles();

  // Only bookable vehicles
  const bookableVehicles = useMemo(
    () =>
      vehicles.filter(
        (v) => v.status === "available" || v.status === "interested",
      ),
    [vehicles],
  );

  const EMPTY = {
    carId: preselectedCarId || "",
    firstName: "",
    lastName: "",
    email: "",
    mobileCode: "+971",
    mobile: "",
    date: "",
    time: "",
    notes: "",
  };

  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null); // { bookingRef, carName, date, time }

  // Pre-select car from URL param
  useEffect(() => {
    if (preselectedCarId) {
      setForm((f) => ({ ...f, carId: preselectedCarId }));
    }
  }, [preselectedCarId]);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  // Selected car object
  const selectedCar = useMemo(
    () => vehicles.find((v) => String(v.id) === String(form.carId)) || null,
    [vehicles, form.carId],
  );

  // Min date — today
  const today = new Date().toISOString().split("T")[0];

  // ── Validation ──────────────────────────────────────────────────────────────
  const validate = () => {
    const e = {};
    if (!form.carId) e.carId = "Please select a vehicle";
    if (!form.firstName.trim()) e.firstName = "Required";
    if (!form.lastName.trim()) e.lastName = "Required";
    if (!form.email.trim()) e.email = "Required";
    else if (!/^\S+@\S+\.\S+$/.test(form.email))
      e.email = "Enter a valid email address";
    if (!form.mobile.trim()) e.mobile = "Required";
    if (!form.date) e.date = "Please select a date";
    if (!form.time) e.time = "Please select a time";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // ── Submit ──────────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!validate()) return;

    setLoading(true);

    // Simulate brief async (feels real)
    await new Promise((r) => setTimeout(r, 800));

    const now = new Date().toISOString();
    const carName = selectedCar
      ? `${selectedCar.brand} ${selectedCar.model}`
      : "Unknown Vehicle";
    const fullName = `${form.firstName.trim()} ${form.lastName.trim()}`;

    // ── 1. Find or create Customer ──────────────────────────────────────────
    const allCustomers = loadFromLS(KEYS.customers, []);
    let customer = allCustomers.find(
      (c) => c.email?.toLowerCase() === form.email.toLowerCase(),
    );

    if (!customer) {
      customer = {
        id: Date.now(),
        customerId: generateCustomerId(allCustomers),
        name: fullName,
        email: form.email.trim(),
        mobileCode: form.mobileCode,
        mobile: form.mobile.trim(),
        whatsappCode: form.mobileCode,
        whatsapp: form.mobile.trim(),
        dob: "",
        source: "Website",
        instagram: "",
        facebook: "",
        status: "prospect",
        notes: `Created via website test drive booking. Vehicle: ${carName}.`,
        createdAt: now.split("T")[0],
        purchases: [],
        inquiries: [
          {
            type: "test_drive",
            car: carName,
            status: "Pending",
            note: "Booked via website",
            date: new Date().toLocaleDateString("en-AE", {
              month: "short",
              year: "numeric",
            }),
          },
        ],
      };
      const updatedCustomers = [customer, ...allCustomers];
      saveToLS(KEYS.customers, updatedCustomers);
    }

    // ── 2. Create Booking ────────────────────────────────────────────────────
    const allBookings = loadFromLS(KEYS.bookings, []);
    const bookingId = generateBookingId(allBookings);
    const booking = {
      id: Date.now() + 1,
      bookingId,
      customerId: customer.id,
      customerName: fullName,
      carId: selectedCar?.id || null,
      carName,
      carPlate: selectedCar?.plate || "",
      exec: "",
      date: form.date,
      time: form.time,
      status: "pending",
      notes: form.notes.trim() || "",
      source: "Website",
      createdAt: now,
    };
    saveToLS(KEYS.bookings, [booking, ...allBookings]);

    // ── 3. Create Lead ───────────────────────────────────────────────────────
    const allLeads = loadFromLS(KEYS.leads, []);
    const leadId = generateLeadId(allLeads);
    const lead = {
      id: Date.now() + 2,
      leadId,
      name: fullName,
      email: form.email.trim(),
      phone: form.mobile.trim(),
      mobileCode: form.mobileCode,
      source: "Website",
      status: "new_inquiry",
      interestedCarId: selectedCar?.id || null,
      interestedCarName: selectedCar
        ? `${selectedCar.brand} ${selectedCar.model}`
        : "",
      interestedCarPlate: selectedCar?.plate || "",
      interestedCarImage: selectedCar?.photos?.[0]?.url || null,
      assignedExec: "",
      followUpDate: null,
      notes: `Website test drive booking. Date: ${form.date} at ${form.time}.${form.notes ? ` Notes: ${form.notes}` : ""}`,
      customerId: customer.id,
      convertedAt: null,
      depositAmount: null,
      reservationExpiry: null,
      createdAt: now,
      updatedAt: now,
    };
    saveToLS(KEYS.leads, [lead, ...allLeads]);

    setLoading(false);
    setSuccess({
      bookingRef: bookingId,
      carName,
      date: form.date,
      time: form.time,
    });
  };

  const handleReset = () => {
    setForm(EMPTY);
    setErrors({});
    setSuccess(null);
  };

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <PageLayout>
      {/* Page hero */}
      <div
        className="py-16"
        style={{
          background: "#0B1120",
          borderBottom: "1px solid rgba(212,175,55,0.08)",
        }}
      >
        <div className="container-site">
          <SectionHeading
            label="Experience the Drive"
            title="Book a Test Drive"
            subtitle="Schedule a private test drive at our Dubai showroom. Our team will ensure an unforgettable experience."
          />
        </div>
      </div>

      {/* Content */}
      <div className="container-site py-16">
        <AnimatePresence mode="wait">
          {/* ── Success state ── */}
          {success ? (
            <motion.div
              key="success"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <SuccessScreen
                bookingRef={success.bookingRef}
                carName={success.carName}
                date={success.date}
                time={success.time}
                onReset={handleReset}
              />
            </motion.div>
          ) : (
            /* ── Form ── */
            <motion.div
              key="form"
              className="grid grid-cols-1 lg:grid-cols-5 gap-12 py-12"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              {/* ── Left: Form (3 cols) ── */}
              <div className="lg:col-span-3 space-y-8">
                {/* Section: Vehicle Selection */}
                <div>
                  <div className="flex items-center gap-2 mb-6">
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center"
                      style={{
                        background: "rgba(212,175,55,0.1)",
                        border: "1px solid rgba(212,175,55,0.2)",
                      }}
                    >
                      <Car size={13} style={{ color: "#D4AF37" }} />
                    </div>
                    <p
                      className="text-xs font-bold tracking-[0.2em] uppercase"
                      style={{ color: "#F8F6F0" }}
                    >
                      Select Vehicle
                    </p>
                  </div>

                  <Field label="Vehicle" required error={errors.carId}>
                    <div className="relative">
                      <select
                        value={form.carId}
                        onChange={(e) => set("carId", e.target.value)}
                        className="input-site pr-10 appearance-none cursor-pointer"
                        style={{
                          borderColor: errors.carId
                            ? "rgba(251,113,133,0.4)"
                            : undefined,
                        }}
                      >
                        <option value="">Choose a vehicle...</option>
                        {bookableVehicles.map((v) => (
                          <option key={v.id} value={String(v.id)}>
                            {v.brand} {v.model}
                            {v.year ? ` (${v.year})` : ""}
                            {" — "}
                            AED {Number(v.price).toLocaleString()}
                          </option>
                        ))}
                      </select>
                      <ChevronDown
                        size={14}
                        className="absolute right-3 top-1/2 -translate-y-1/2
                                   pointer-events-none"
                        style={{ color: "rgba(248,246,240,0.35)" }}
                      />
                    </div>
                  </Field>

                  {/* Selected car preview */}
                  <AnimatePresence>
                    {selectedCar && (
                      <motion.div
                        className="mt-4 flex items-center gap-4 rounded-xl p-4"
                        style={{
                          background: "rgba(13,24,41,0.8)",
                          border: "1px solid rgba(212,175,55,0.12)",
                        }}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25 }}
                      >
                        {/* Car image */}
                        {selectedCar.photos?.[0]?.url ? (
                          <img
                            src={selectedCar.photos[0].url}
                            alt={selectedCar.model}
                            className="w-20 h-14 object-cover rounded-lg flex-shrink-0"
                          />
                        ) : (
                          <div
                            className="w-20 h-14 rounded-lg flex items-center
                                       justify-center flex-shrink-0"
                            style={{ background: "rgba(212,175,55,0.06)" }}
                          >
                            <Car
                              size={20}
                              style={{ color: "rgba(212,175,55,0.3)" }}
                            />
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="label-luxury mb-0.5">
                            {selectedCar.brand}
                          </p>
                          <p
                            className="font-display text-base font-semibold truncate"
                            style={{ color: "#F8F6F0" }}
                          >
                            {selectedCar.model}
                          </p>
                          <p
                            className="font-display text-sm font-bold"
                            style={{ color: "#D4AF37" }}
                          >
                            AED {Number(selectedCar.price).toLocaleString()}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Divider */}
                <div
                  style={{ height: "1px", background: "rgba(212,175,55,0.08)" }}
                />

                {/* Section: Personal Details */}
                <div>
                  <div className="flex items-center gap-2 mb-6">
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center"
                      style={{
                        background: "rgba(212,175,55,0.1)",
                        border: "1px solid rgba(212,175,55,0.2)",
                      }}
                    >
                      <User size={13} style={{ color: "#D4AF37" }} />
                    </div>
                    <p
                      className="text-xs font-bold tracking-[0.2em] uppercase"
                      style={{ color: "#F8F6F0" }}
                    >
                      Your Details
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <Field label="First Name" required error={errors.firstName}>
                      <input
                        type="text"
                        value={form.firstName}
                        onChange={(e) => set("firstName", e.target.value)}
                        placeholder="Ahmed"
                        className="input-site"
                        style={{
                          borderColor: errors.firstName
                            ? "rgba(251,113,133,0.4)"
                            : undefined,
                        }}
                      />
                    </Field>

                    <Field label="Last Name" required error={errors.lastName}>
                      <input
                        type="text"
                        value={form.lastName}
                        onChange={(e) => set("lastName", e.target.value)}
                        placeholder="Al-Rashid"
                        className="input-site"
                        style={{
                          borderColor: errors.lastName
                            ? "rgba(251,113,133,0.4)"
                            : undefined,
                        }}
                      />
                    </Field>

                    <Field label="Email Address" required error={errors.email}>
                      <div className="relative">
                        <Mail
                          size={13}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2
                                     pointer-events-none"
                          style={{ color: "rgba(248,246,240,0.3)" }}
                        />
                        <input
                          type="email"
                          value={form.email}
                          onChange={(e) => set("email", e.target.value)}
                          placeholder="name@email.com"
                          className="input-site "
                          style={{
                            borderColor: errors.email
                              ? "rgba(251,113,133,0.4)"
                              : undefined,
                          }}
                        />
                      </div>
                    </Field>

                    <Field label="Mobile Number" required error={errors.mobile}>
                      <div className="flex gap-2">
                        <div className="relative flex-shrink-0">
                          <select
                            value={form.mobileCode}
                            onChange={(e) => set("mobileCode", e.target.value)}
                            className="input-site pr-7 appearance-none cursor-pointer"
                            style={{ width: "90px" }}
                          >
                            {COUNTRY_CODES.map((c) => (
                              <option key={c.code} value={c.code}>
                                {c.flag} {c.code}
                              </option>
                            ))}
                          </select>
                          <ChevronDown
                            size={11}
                            className="absolute right-2 top-1/2 -translate-y-1/2
                                       pointer-events-none"
                            style={{ color: "rgba(248,246,240,0.3)" }}
                          />
                        </div>
                        <div className="relative flex-1">
                          <Phone
                            size={13}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2
                                       pointer-events-none"
                            style={{ color: "rgba(248,246,240,0.3)" }}
                          />
                          <input
                            type="tel"
                            value={form.mobile}
                            onChange={(e) => set("mobile", e.target.value)}
                            placeholder="50 123 4567"
                            className="input-site pl-10 w-full"
                            style={{
                              borderColor: errors.mobile
                                ? "rgba(251,113,133,0.4)"
                                : undefined,
                            }}
                          />
                        </div>
                      </div>
                    </Field>
                  </div>
                </div>

                {/* Divider */}
                <div
                  style={{ height: "1px", background: "rgba(212,175,55,0.08)" }}
                />

                {/* Section: Date & Time */}
                <div>
                  <div className="flex items-center gap-2 mb-6">
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center"
                      style={{
                        background: "rgba(212,175,55,0.1)",
                        border: "1px solid rgba(212,175,55,0.2)",
                      }}
                    >
                      <Calendar size={13} style={{ color: "#D4AF37" }} />
                    </div>
                    <p
                      className="text-xs font-bold tracking-[0.2em] uppercase"
                      style={{ color: "#F8F6F0" }}
                    >
                      Preferred Date & Time
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <Field label="Date" required error={errors.date}>
                      <input
                        type="date"
                        value={form.date}
                        onChange={(e) => set("date", e.target.value)}
                        min={today}
                        className="input-site"
                        style={{
                          colorScheme: "dark",
                          borderColor: errors.date
                            ? "rgba(251,113,133,0.4)"
                            : undefined,
                        }}
                      />
                    </Field>

                    <Field label="Time Slot" required error={errors.time}>
                      <div className="relative">
                        <Clock
                          size={13}
                          className="absolute right-3 top-1/2 -translate-y-1/2
                                     pointer-events-none"
                          style={{ color: "rgba(248,246,240)" }}
                        />
                        <select
                          value={form.time}
                          onChange={(e) => set("time", e.target.value)}
                          className="input-site pl-10 pr-9 appearance-none cursor-pointer"
                          style={{
                            borderColor: errors.time
                              ? "rgba(251,113,133,0.4)"
                              : undefined,
                          }}
                        >
                          <option value="">Select time...</option>
                          {TIME_SLOTS.map((slot) => (
                            <option key={slot} value={slot}>
                              {slot}
                            </option>
                          ))}
                        </select>
                        <ChevronDown
                          size={13}
                          className="absolute right-3 top-1/2 -translate-y-1/2
                                     pointer-events-none"
                          style={{ color: "rgba(248,246,240,0.35)" }}
                        />
                      </div>
                    </Field>
                  </div>
                </div>

                {/* Divider */}
                <div
                  style={{ height: "1px", background: "rgba(212,175,55,0.08)" }}
                />

                {/* Section: Notes */}
                <div>
                  <div className="flex items-center gap-2 mb-6">
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center"
                      style={{
                        background: "rgba(212,175,55,0.1)",
                        border: "1px solid rgba(212,175,55,0.2)",
                      }}
                    >
                      <MessageSquare size={13} style={{ color: "#D4AF37" }} />
                    </div>
                    <p
                      className="text-xs font-bold tracking-[0.2em] uppercase"
                      style={{ color: "#F8F6F0" }}
                    >
                      Additional Notes
                    </p>
                  </div>

                  <Field label="Message (Optional)">
                    <textarea
                      value={form.notes}
                      onChange={(e) => set("notes", e.target.value)}
                      placeholder="Any special requests, accessibility requirements, or questions..."
                      rows={4}
                      className="input-site resize-none"
                    />
                  </Field>
                </div>

                {/* Submit button */}
                <motion.button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="btn-gold w-full justify-center"
                  style={{
                    padding: "16px",
                    fontSize: "12px",
                    opacity: loading ? 0.7 : 1,
                    cursor: loading ? "not-allowed" : "pointer",
                  }}
                  whileTap={loading ? {} : { scale: 0.98 }}
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <motion.span
                        className="w-4 h-4 rounded-full border-2 inline-block"
                        style={{
                          borderColor: "rgba(5,10,20,0.3)",
                          borderTopColor: "#050A14",
                        }}
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 0.8,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      />
                      Processing...
                    </span>
                  ) : (
                    <>
                      Confirm Booking
                      <ArrowRight size={15} />
                    </>
                  )}
                </motion.button>

                <p
                  className="text-[10px] text-center"
                  style={{ color: "rgba(248,246,240,0.3)" }}
                >
                  By submitting, you agree to be contacted by our team regarding
                  your test drive appointment.
                </p>
              </div>

              {/* ── Right: Info panel (2 cols) ── */}
              <div className="lg:col-span-2">
                <div
                  className="rounded-2xl p-6 sticky"
                  style={{
                    top: "104px",
                    background: "#0D1829",
                    border: "1px solid rgba(212,175,55,0.1)",
                  }}
                >
                  <p className="label-luxury mb-4">What to Expect</p>

                  {/* Steps */}
                  <div className="space-y-5 mb-8">
                    {[
                      {
                        step: "01",
                        title: "Confirmation",
                        desc: "Our team contacts you within 24 hours to confirm your appointment.",
                      },
                      {
                        step: "02",
                        title: "Arrival",
                        desc: "Arrive 10 minutes early at our Sheikh Zayed Road showroom.",
                      },
                      {
                        step: "03",
                        title: "Experience",
                        desc: "Your dedicated sales executive will guide you through the vehicle.",
                      },
                      {
                        step: "04",
                        title: "The Drive",
                        desc: "Enjoy a private test drive on our curated route through Dubai.",
                      },
                    ].map((item, i) => (
                      <div key={item.step} className="flex items-start gap-4">
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center
                                     flex-shrink-0 font-mono text-[11px] font-bold"
                          style={{
                            background: "rgba(212,175,55,0.08)",
                            border: "1px solid rgba(212,175,55,0.15)",
                            color: "#D4AF37",
                          }}
                        >
                          {item.step}
                        </div>
                        <div>
                          <p
                            className="text-xs font-semibold mb-1"
                            style={{ color: "#F8F6F0" }}
                          >
                            {item.title}
                          </p>
                          <p
                            className="text-[11px] leading-relaxed"
                            style={{ color: "rgba(248,246,240,0.45)" }}
                          >
                            {item.desc}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Divider */}
                  <div
                    className="mb-6"
                    style={{
                      height: "1px",
                      background: "rgba(212,175,55,0.08)",
                    }}
                  />

                  {/* Showroom info */}
                  <p className="label-luxury mb-4">Showroom</p>
                  <div className="space-y-3">
                    {[
                      {
                        label: "Address",
                        value: "Sheikh Zayed Road, Dubai, UAE",
                      },
                      {
                        label: "Hours",
                        value: "Mon – Sat · 9:00 AM – 8:00 PM",
                      },
                      { label: "Phone", value: "+971 4 XXX XXXX" },
                    ].map((info) => (
                      <div key={info.label}>
                        <p
                          className="text-[9px] font-bold tracking-[0.15em] uppercase mb-0.5"
                          style={{ color: "rgba(248,246,240,0.3)" }}
                        >
                          {info.label}
                        </p>
                        <p
                          className="text-xs"
                          style={{ color: "rgba(248,246,240,0.6)" }}
                        >
                          {info.value}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageLayout>
  );
}

export default TestDrive;
