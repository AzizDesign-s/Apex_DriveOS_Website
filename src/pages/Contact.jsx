// src/pages/Contact.jsx
// Customer contact page.
// Left: contact form. Right: showroom info + map placeholder.
//
// ON SUBMIT:
//   Creates a notification in apex-driveos-notifications so the
//   admin sees the enquiry live in the Notifications panel.

import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  ChevronDown,
  User,
  MessageSquare,
  Send,
} from "lucide-react";
import PageLayout from "../components/layout/PageLayout";
import SectionHeading from "../components/ui/SectionHeading";
import { loadFromLS, saveToLS, KEYS } from "../utils/localStorage";
import { COUNTRY_CODES } from "../data/mockData";

// ── Create notification in admin panel ───────────────────────────────────────
const createAdminNotification = ({ name, email, subject, message }) => {
  try {
    const existing = loadFromLS(KEYS.notifications, []);
    const notif = {
      id: Date.now(),
      type: "customer",
      priority: "medium",
      title: `New Enquiry: ${subject}`,
      message: `${name} (${email}) sent an enquiry: "${message.slice(0, 80)}${message.length > 80 ? "…" : ""}"`,
      link: "/notifications",
      linkLabel: "View Enquiry",
      meta: { name, email, subject, message, source: "Website Contact Form" },
      isRead: false,
      isPinned: false,
      createdAt: new Date().toISOString(),
    };
    saveToLS(KEYS.notifications, [notif, ...existing]);
  } catch {
    /* silent */
  }
};

// ── Subjects ─────────────────────────────────────────────────────────────────
const SUBJECTS = [
  "Vehicle Enquiry",
  "Test Drive Request",
  "Pricing & Finance",
  "Trade-In Valuation",
  "After-Sales Support",
  "General Enquiry",
  "Other",
];

// ── Field wrapper ─────────────────────────────────────────────────────────────
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

// ── Info row ──────────────────────────────────────────────────────────────────
function InfoRow({ icon: Icon, label, value, href }) {
  const content = (
    <div className="flex items-start gap-4">
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{
          background: "rgba(212,175,55,0.08)",
          border: "1px solid rgba(212,175,55,0.15)",
        }}
      >
        <Icon size={15} style={{ color: "#D4AF37" }} />
      </div>
      <div>
        <p
          className="text-[9px] font-bold tracking-[0.2em] uppercase mb-1"
          style={{ color: "rgba(248,246,240,0.35)" }}
        >
          {label}
        </p>
        <p className="text-sm" style={{ color: "#F8F6F0" }}>
          {value}
        </p>
      </div>
    </div>
  );

  if (href) {
    return (
      <a
        href={href}
        className="block transition-opacity hover:opacity-70"
        target={href.startsWith("http") ? "_blank" : undefined}
        rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
      >
        {content}
      </a>
    );
  }
  return <div>{content}</div>;
}

// ── Success screen ────────────────────────────────────────────────────────────
function SuccessMessage({ name, onReset }) {
  return (
    <motion.div
      className="flex flex-col items-center text-center py-16"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      <motion.div
        className="w-16 h-16 rounded-full flex items-center justify-center mb-6"
        style={{
          background: "rgba(16,185,129,0.1)",
          border: "1px solid rgba(16,185,129,0.25)",
        }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.15, type: "spring", stiffness: 200 }}
      >
        <CheckCircle2 size={30} style={{ color: "#10B981" }} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
      >
        <p className="label-luxury mb-3">Message Received</p>
        <h3
          className="font-display text-2xl font-semibold mb-3"
          style={{ color: "#F8F6F0" }}
        >
          Thank You, {name}
        </h3>
        <p
          className="text-sm leading-relaxed mb-8 max-w-sm mx-auto"
          style={{ color: "rgba(248,246,240,0.5)" }}
        >
          Your message has been received. A member of our team will be in touch
          within 24 hours.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Link to="/cars" className="btn-gold">
            Browse Collection
            <ArrowRight size={14} />
          </Link>
          <button onClick={onReset} className="btn-ghost">
            Send Another
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Map placeholder ───────────────────────────────────────────────────────────
function MapPlaceholder() {
  return (
    <div
      className="relative rounded-2xl overflow-hidden"
      style={{
        height: "240px",
        background: "#0A1628",
        border: "1px solid rgba(212,175,55,0.1)",
      }}
    >
      {/* Grid lines mimicking a map */}
      <svg className="absolute inset-0 w-full h-full" style={{ opacity: 0.15 }}>
        {/* Horizontal lines */}
        {[...Array(8)].map((_, i) => (
          <line
            key={`h${i}`}
            x1="0"
            y1={`${(i + 1) * 12.5}%`}
            x2="100%"
            y2={`${(i + 1) * 12.5}%`}
            stroke="#D4AF37"
            strokeWidth="0.5"
          />
        ))}
        {/* Vertical lines */}
        {[...Array(8)].map((_, i) => (
          <line
            key={`v${i}`}
            x1={`${(i + 1) * 12.5}%`}
            y1="0"
            x2={`${(i + 1) * 12.5}%`}
            y2="100%"
            stroke="#D4AF37"
            strokeWidth="0.5"
          />
        ))}
        {/* Sheikh Zayed Road line */}
        <line
          x1="50%"
          y1="0"
          x2="50%"
          y2="100%"
          stroke="#D4AF37"
          strokeWidth="2"
          strokeOpacity="0.4"
        />
      </svg>

      {/* Location pin */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          className="flex flex-col items-center"
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center
                       shadow-gold-glow"
            style={{
              background: "#D4AF37",
            }}
          >
            <MapPin size={18} style={{ color: "#050A14" }} />
          </div>
          <div
            className="w-3 h-3 rounded-full mt-1"
            style={{ background: "rgba(212,175,55,0.3)" }}
          />
        </motion.div>
      </div>

      {/* Label */}
      <div className="absolute bottom-4 left-0 right-0 text-center">
        <span
          className="text-[10px] font-bold tracking-[0.2em] uppercase
                     px-3 py-1.5 rounded-full"
          style={{
            background: "rgba(5,10,20,0.8)",
            border: "1px solid rgba(212,175,55,0.2)",
            color: "#D4AF37",
          }}
        >
          Sheikh Zayed Road · Dubai
        </span>
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
function Contact() {
  const EMPTY = {
    firstName: "",
    lastName: "",
    email: "",
    mobileCode: "+971",
    mobile: "",
    subject: "",
    message: "",
  };

  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const validate = () => {
    const e = {};
    if (!form.firstName.trim()) e.firstName = "Required";
    if (!form.lastName.trim()) e.lastName = "Required";
    if (!form.email.trim()) e.email = "Required";
    else if (!/^\S+@\S+\.\S+$/.test(form.email))
      e.email = "Enter a valid email address";
    if (!form.subject) e.subject = "Please select a subject";
    if (!form.message.trim()) e.message = "Required";
    else if (form.message.trim().length < 10)
      e.message = "Please provide a bit more detail (min 10 characters)";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 700));

    createAdminNotification({
      name: `${form.firstName.trim()} ${form.lastName.trim()}`,
      email: form.email.trim(),
      subject: form.subject,
      message: form.message.trim(),
    });

    setLoading(false);
    setSuccess(true);
  };

  const handleReset = () => {
    setForm(EMPTY);
    setErrors({});
    setSuccess(false);
  };

  return (
    <PageLayout>
      {/* ── Hero band ── */}
      <div
        className="py-16"
        style={{
          background: "#0B1120",
          borderBottom: "1px solid rgba(212,175,55,0.08)",
        }}
      >
        <div className="container-site ">
          <SectionHeading
            label="Get in Touch"
            title="Contact Us"
            subtitle="Our team of specialists is here to assist you. Reach out and we'll respond within 24 hours."
          />
        </div>
      </div>

      {/* ── Content ── */}
      <div className="container-site py-12">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-16 py-12">
          {/* ── Left: Form (3 cols) ── */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              {success ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <SuccessMessage name={form.firstName} onReset={handleReset} />
                </motion.div>
              ) : (
                <motion.div
                  key="form"
                  className="space-y-6"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  {/* Name row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <Field label="First Name" required error={errors.firstName}>
                      <div className="relative">
                        <User
                          size={13}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2
                                     pointer-events-none"
                          style={{ color: "rgba(248,246,240,0.25)" }}
                        />
                        <input
                          type="text"
                          value={form.firstName}
                          onChange={(e) => set("firstName", e.target.value)}
                          placeholder="Ahmed"
                          className="input-site pl-10"
                          style={{
                            borderColor: errors.firstName
                              ? "rgba(251,113,133,0.4)"
                              : undefined,
                          }}
                        />
                      </div>
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
                  </div>

                  {/* Email */}
                  <Field label="Email Address" required error={errors.email}>
                    <div className="relative">
                      <Mail
                        size={13}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2
                                   pointer-events-none"
                        style={{ color: "rgba(248,246,240,0.25)" }}
                      />
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) => set("email", e.target.value)}
                        placeholder="name@email.com"
                        className="input-site pl-10"
                        style={{
                          borderColor: errors.email
                            ? "rgba(251,113,133,0.4)"
                            : undefined,
                        }}
                      />
                    </div>
                  </Field>

                  {/* Mobile */}
                  <Field label="Mobile Number">
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
                          style={{ color: "rgba(248,246,240,0.25)" }}
                        />
                        <input
                          type="tel"
                          value={form.mobile}
                          onChange={(e) => set("mobile", e.target.value)}
                          placeholder="50 123 4567"
                          className="input-site pl-10 w-full"
                        />
                      </div>
                    </div>
                  </Field>

                  {/* Subject */}
                  <Field label="Subject" required error={errors.subject}>
                    <div className="relative">
                      <select
                        value={form.subject}
                        onChange={(e) => set("subject", e.target.value)}
                        className="input-site pr-10 appearance-none cursor-pointer"
                        style={{
                          borderColor: errors.subject
                            ? "rgba(251,113,133,0.4)"
                            : undefined,
                        }}
                      >
                        <option value="">Select a subject...</option>
                        {SUBJECTS.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                      <ChevronDown
                        size={13}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2
                                   pointer-events-none"
                        style={{ color: "rgba(248,246,240,0.3)" }}
                      />
                    </div>
                  </Field>

                  {/* Message */}
                  <Field label="Message" required error={errors.message}>
                    <div className="relative">
                      <MessageSquare
                        size={13}
                        className="absolute right-3.5 top-4 pointer-events-none"
                        style={{ color: "rgba(248,246,240,0.25)" }}
                      />
                      <textarea
                        value={form.message}
                        onChange={(e) => set("message", e.target.value)}
                        placeholder="Tell us how we can help you..."
                        rows={5}
                        className="input-site pl-10 resize-none"
                        style={{
                          borderColor: errors.message
                            ? "rgba(251,113,133,0.4)"
                            : undefined,
                        }}
                      />
                    </div>
                    <p
                      className="text-[10px] text-right"
                      style={{
                        color:
                          form.message.length > 400
                            ? "#FB7185"
                            : "rgba(248,246,240,0.25)",
                      }}
                    >
                      {form.message.length} / 500
                    </p>
                  </Field>

                  {/* Submit */}
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
                        Sending...
                      </span>
                    ) : (
                      <>
                        Send Message
                        <Send size={14} />
                      </>
                    )}
                  </motion.button>

                  <p
                    className="text-[10px] text-center"
                    style={{ color: "rgba(248,246,240,0.25)" }}
                  >
                    We respond to all enquiries within 24 hours during business
                    days.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ── Right: Info panel (2 cols) ── */}
          <div className="lg:col-span-2 space-y-8">
            {/* Contact info card */}
            <div
              className="rounded-2xl p-6"
              style={{
                background: "#0D1829",
                border: "1px solid rgba(212,175,55,0.1)",
              }}
            >
              <p className="label-luxury mb-6">Showroom Information</p>

              <div className="space-y-5">
                <InfoRow
                  icon={MapPin}
                  label="Address"
                  value="Sheikh Zayed Road, Dubai, UAE"
                />
                <InfoRow
                  icon={Phone}
                  label="Phone"
                  value="+971 4 XXX XXXX"
                  href="tel:+97141234567"
                />
                <InfoRow
                  icon={Mail}
                  label="Email"
                  value="info@apexdriveos.ae"
                  href="mailto:info@apexdriveos.ae"
                />
                <InfoRow
                  icon={Clock}
                  label="Business Hours"
                  value="Monday – Saturday · 9:00 AM – 8:00 PM"
                />
              </div>
            </div>

            {/* Map placeholder */}
            <MapPlaceholder />

            {/* Quick links */}
            <div
              className="rounded-2xl p-6"
              style={{
                background: "rgba(212,175,55,0.03)",
                border: "1px solid rgba(212,175,55,0.08)",
              }}
            >
              <p className="label-luxury mb-4">Quick Links</p>
              <div className="space-y-3">
                {[
                  { label: "Browse Our Collection", path: "/cars" },
                  { label: "Book a Test Drive", path: "/test-drive" },
                  { label: "View Current Offers", path: "/promotions" },
                ].map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className="flex items-center justify-between py-2.5 px-3
                               rounded-xl transition-all duration-200 group"
                    style={{ border: "1px solid rgba(212,175,55,0.08)" }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background =
                        "rgba(212,175,55,0.06)";
                      e.currentTarget.style.borderColor =
                        "rgba(212,175,55,0.2)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "transparent";
                      e.currentTarget.style.borderColor =
                        "rgba(212,175,55,0.08)";
                    }}
                  >
                    <span
                      className="text-sm"
                      style={{ color: "rgba(248,246,240,0.7)" }}
                    >
                      {link.label}
                    </span>
                    <ArrowRight
                      size={13}
                      style={{ color: "#D4AF37", opacity: 0.6 }}
                    />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}

export default Contact;
