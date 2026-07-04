// src/pages/Account.jsx
// Customer account portal — protected page.
// Redirects to /login if no session.
//
// TABS:
//   Overview    — welcome, stats, member since
//   My Vehicles — purchased vehicles (paid invoices)
//   Test Drives — booking history
//   Invoices    — invoice list filtered by customer
//
// DATA:
//   All filtered from localStorage by customer.id / customer.email

import { useState, useEffect, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Car,
  CalendarCheck,
  FileText,
  TrendingUp,
  Clock,
  CheckCircle2,
  XCircle,
  LogOut,
  ArrowRight,
  Package,
} from "lucide-react";
import PageLayout from "../components/layout/PageLayout";
import AccountSidebar from "../components/account/AccountSidebar";
import { useCustomerAuth } from "../hooks/useCustomerAuth";
import { loadFromLS, KEYS } from "../utils/localStorage";

// ── Status helpers ────────────────────────────────────────────────────────────
const BOOKING_STATUS = {
  pending: { label: "Pending", color: "#FBBF24", icon: Clock },
  approved: { label: "Approved", color: "#10B981", icon: CheckCircle2 },
  completed: { label: "Completed", color: "#38BDF8", icon: CheckCircle2 },
  rejected: { label: "Rejected", color: "#FB7185", icon: XCircle },
  cancelled: { label: "Cancelled", color: "#475569", icon: XCircle },
};

const INVOICE_STATUS = {
  draft: { label: "Draft", color: "#94A3B8" },
  sent: { label: "Sent", color: "#38BDF8" },
  paid: { label: "Paid", color: "#10B981" },
  partially_paid: { label: "Partial", color: "#A78BFA" },
  overdue: { label: "Overdue", color: "#FB7185" },
  cancelled: { label: "Cancelled", color: "#475569" },
  refunded: { label: "Refunded", color: "#FBBF24" },
};

// ── Stat card ─────────────────────────────────────────────────────────────────
function StatCard({ icon: Icon, label, value, color, index }) {
  return (
    <motion.div
      className="rounded-xl p-5 flex items-center gap-4"
      style={{
        background: "#0D1829",
        border: "1px solid rgba(212,175,55,0.1)",
      }}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
    >
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: `${color}12`, border: `1px solid ${color}25` }}
      >
        <Icon size={17} style={{ color }} />
      </div>
      <div>
        <p className="text-2xl font-extrabold font-display" style={{ color }}>
          {value}
        </p>
        <p
          className="text-[10px] font-semibold tracking-[0.15em] uppercase mt-0.5"
          style={{ color: "rgba(248,246,240,0.35)" }}
        >
          {label}
        </p>
      </div>
    </motion.div>
  );
}

// ── Empty state ───────────────────────────────────────────────────────────────
function EmptyTabState({ icon: Icon, title, subtitle, ctaLabel, ctaPath }) {
  return (
    <motion.div
      className="flex flex-col items-center justify-center py-20 text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5"
        style={{
          background: "rgba(212,175,55,0.06)",
          border: "1px solid rgba(212,175,55,0.1)",
        }}
      >
        <Icon size={24} style={{ color: "rgba(212,175,55,0.3)" }} />
      </div>
      <p
        className="font-display text-lg font-semibold mb-2"
        style={{ color: "#F8F6F0" }}
      >
        {title}
      </p>
      <p
        className="text-sm mb-6 max-w-xs"
        style={{ color: "rgba(248,246,240,0.4)" }}
      >
        {subtitle}
      </p>
      {ctaLabel && ctaPath && (
        <Link to={ctaPath} className="btn-gold text-xs">
          {ctaLabel}
          <ArrowRight size={13} />
        </Link>
      )}
    </motion.div>
  );
}

// ── Overview tab ──────────────────────────────────────────────────────────────
function OverviewTab({ customer, bookings, invoices }) {
  const purchases = invoices.filter((i) => i.status === "paid");
  const totalSpent = purchases.reduce((sum, i) => sum + (i.total || 0), 0);
  const pending = bookings.filter((b) => b.status === "pending").length;

  const stats = [
    {
      icon: Car,
      label: "Vehicles Purchased",
      value: purchases.length,
      color: "#D4AF37",
    },
    {
      icon: CalendarCheck,
      label: "Test Drives",
      value: bookings.length,
      color: "#38BDF8",
    },
    {
      icon: FileText,
      label: "Invoices",
      value: invoices.length,
      color: "#A78BFA",
    },
    {
      icon: TrendingUp,
      label: "Total Spent",
      value:
        totalSpent > 0 ? `AED ${(totalSpent / 1000000).toFixed(2)}M` : "AED 0",
      color: "#10B981",
    },
  ];

  return (
    <motion.div
      key="overview"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Welcome */}
      <div className="mb-8">
        <p className="label-luxury mb-2">Welcome Back</p>
        <h2
          className="font-display text-2xl font-semibold mb-2"
          style={{ color: "#F8F6F0" }}
        >
          Hello, {customer.name.split(" ")[0]}
        </h2>
        <p className="text-sm" style={{ color: "rgba(248,246,240,0.45)" }}>
          Member since{" "}
          {customer.createdAt
            ? new Date(customer.createdAt).toLocaleDateString("en-AE", {
                month: "long",
                year: "numeric",
              })
            : "recently"}
          {" · "}
          {customer.customerId}
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
        {stats.map((stat, i) => (
          <StatCard key={stat.label} {...stat} index={i} />
        ))}
      </div>

      {/* Pending bookings alert */}
      {pending > 0 && (
        <motion.div
          className="rounded-xl px-5 py-4 mb-8 flex items-center
                     justify-between gap-4"
          style={{
            background: "rgba(251,191,36,0.06)",
            border: "1px solid rgba(251,191,36,0.2)",
          }}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center gap-3">
            <Clock size={16} style={{ color: "#FBBF24", flexShrink: 0 }} />
            <p className="text-sm" style={{ color: "#F8F6F0" }}>
              You have{" "}
              <span style={{ color: "#FBBF24", fontWeight: 600 }}>
                {pending} pending test drive
                {pending > 1 ? "s" : ""}
              </span>{" "}
              awaiting confirmation.
            </p>
          </div>
          <button
            className="text-[11px] font-semibold uppercase tracking-[0.1em]
                       flex-shrink-0 transition-colors"
            style={{ color: "#FBBF24" }}
            onClick={() => {}}
          >
            View
          </button>
        </motion.div>
      )}

      {/* Quick links */}
      <div>
        <p className="label-luxury mb-4">Quick Actions</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { label: "Browse Collection", path: "/cars", icon: Car },
            {
              label: "Book Test Drive",
              path: "/test-drive",
              icon: CalendarCheck,
            },
            { label: "View Promotions", path: "/promotions", icon: TrendingUp },
          ].map((action) => (
            <Link
              key={action.path}
              to={action.path}
              className="flex items-center justify-between px-4 py-3.5
                         rounded-xl transition-all duration-200 group"
              style={{
                background: "#0D1829",
                border: "1px solid rgba(212,175,55,0.08)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "rgba(212,175,55,0.25)";
                e.currentTarget.style.background = "rgba(212,175,55,0.04)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(212,175,55,0.08)";
                e.currentTarget.style.background = "#0D1829";
              }}
            >
              <div className="flex items-center gap-3">
                <action.icon size={14} style={{ color: "#D4AF37" }} />
                <span
                  className="text-xs font-semibold"
                  style={{ color: "#F8F6F0" }}
                >
                  {action.label}
                </span>
              </div>
              <ArrowRight size={13} style={{ color: "rgba(212,175,55,0.4)" }} />
            </Link>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// ── My Vehicles tab ───────────────────────────────────────────────────────────
function VehiclesTab({ invoices }) {
  const purchases = invoices.filter((i) => i.status === "paid" && i.carName);

  if (purchases.length === 0) {
    return (
      <EmptyTabState
        icon={Car}
        title="No vehicles yet"
        subtitle="Your purchased vehicles will appear here once an invoice is marked as paid."
        ctaLabel="Browse Collection"
        ctaPath="/cars"
      />
    );
  }

  return (
    <motion.div
      key="vehicles"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
    >
      {purchases.map((inv, i) => (
        <motion.div
          key={inv.id}
          className="rounded-xl p-5 flex items-center gap-5"
          style={{
            background: "#0D1829",
            border: "1px solid rgba(212,175,55,0.1)",
          }}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.06 }}
        >
          {/* Car icon */}
          <div
            className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{
              background: "rgba(212,175,55,0.06)",
              border: "1px solid rgba(212,175,55,0.12)",
            }}
          >
            <Car size={22} style={{ color: "#D4AF37" }} />
          </div>

          <div className="flex-1 min-w-0">
            <p
              className="font-display text-lg font-semibold truncate"
              style={{ color: "#F8F6F0" }}
            >
              {inv.carName}
            </p>
            {inv.carPlate && (
              <p
                className="text-[10px] font-mono mt-0.5"
                style={{ color: "rgba(248,246,240,0.4)" }}
              >
                {inv.carPlate}
              </p>
            )}
            <div className="flex items-center gap-3 mt-2">
              <span className="text-xs font-bold" style={{ color: "#D4AF37" }}>
                AED {Number(inv.total || 0).toLocaleString()}
              </span>
              <span
                className="text-[10px]"
                style={{ color: "rgba(248,246,240,0.3)" }}
              >
                ·
              </span>
              <span
                className="text-[10px]"
                style={{ color: "rgba(248,246,240,0.4)" }}
              >
                {inv.invoiceId}
              </span>
              {inv.issuedDate && (
                <>
                  <span
                    className="text-[10px]"
                    style={{ color: "rgba(248,246,240,0.3)" }}
                  >
                    ·
                  </span>
                  <span
                    className="text-[10px]"
                    style={{ color: "rgba(248,246,240,0.4)" }}
                  >
                    {new Date(inv.issuedDate).toLocaleDateString("en-AE", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Paid badge */}
          <div
            className="flex-shrink-0 px-3 py-1.5 rounded-full text-[9px]
                       font-bold uppercase tracking-[0.15em]"
            style={{
              background: "rgba(16,185,129,0.1)",
              border: "1px solid rgba(16,185,129,0.2)",
              color: "#10B981",
            }}
          >
            Purchased
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}

// ── Test Drives tab ───────────────────────────────────────────────────────────
function TestDrivesTab({ bookings }) {
  if (bookings.length === 0) {
    return (
      <EmptyTabState
        icon={CalendarCheck}
        title="No test drives yet"
        subtitle="Book a test drive to experience our luxury vehicles firsthand."
        ctaLabel="Book a Test Drive"
        ctaPath="/test-drive"
      />
    );
  }

  return (
    <motion.div
      key="test-drives"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
    >
      {bookings.map((booking, i) => {
        const status = BOOKING_STATUS[booking.status] || BOOKING_STATUS.pending;
        const StatusIcon = status.icon;
        return (
          <motion.div
            key={booking.id}
            className="rounded-xl p-5"
            style={{
              background: "#0D1829",
              border: "1px solid rgba(212,175,55,0.1)",
            }}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.06 }}
          >
            <div className="flex items-start justify-between gap-4 mb-3">
              <div>
                <p
                  className="font-display text-base font-semibold"
                  style={{ color: "#F8F6F0" }}
                >
                  {booking.carName}
                </p>
                <p
                  className="text-[10px] font-mono mt-0.5"
                  style={{ color: "#D4AF37" }}
                >
                  {booking.bookingId}
                </p>
              </div>
              <div
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full
                           text-[9px] font-bold uppercase tracking-[0.1em]
                           flex-shrink-0"
                style={{
                  background: `${status.color}15`,
                  border: `1px solid ${status.color}30`,
                  color: status.color,
                }}
              >
                <StatusIcon size={10} />
                {status.label}
              </div>
            </div>

            <div className="flex items-center gap-4 flex-wrap">
              {[
                { label: "Date", value: booking.date },
                { label: "Time", value: booking.time },
                booking.exec && { label: "Sales Exec", value: booking.exec },
              ]
                .filter(Boolean)
                .map((info) => (
                  <div key={info.label}>
                    <p
                      className="text-[9px] font-bold tracking-[0.15em]
                                 uppercase mb-0.5"
                      style={{ color: "rgba(248,246,240,0.3)" }}
                    >
                      {info.label}
                    </p>
                    <p
                      className="text-xs font-semibold"
                      style={{ color: "rgba(248,246,240,0.7)" }}
                    >
                      {info.value}
                    </p>
                  </div>
                ))}
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}

// ── Invoices tab ──────────────────────────────────────────────────────────────
function InvoicesTab({ invoices }) {
  if (invoices.length === 0) {
    return (
      <EmptyTabState
        icon={FileText}
        title="No invoices yet"
        subtitle="Your invoices will appear here once they are created by our team."
        ctaLabel="Contact Us"
        ctaPath="/contact"
      />
    );
  }

  return (
    <motion.div
      key="invoices"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-3"
    >
      {invoices.map((inv, i) => {
        const status = INVOICE_STATUS[inv.status] || INVOICE_STATUS.draft;
        return (
          <motion.div
            key={inv.id}
            className="rounded-xl p-5 flex items-center justify-between gap-4"
            style={{
              background: "#0D1829",
              border: "1px solid rgba(212,175,55,0.1)",
            }}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <div className="flex items-center gap-4 min-w-0">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center
                           flex-shrink-0"
                style={{
                  background: "rgba(167,139,250,0.08)",
                  border: "1px solid rgba(167,139,250,0.15)",
                }}
              >
                <FileText size={15} style={{ color: "#A78BFA" }} />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p
                    className="text-sm font-bold font-mono"
                    style={{ color: "#D4AF37" }}
                  >
                    {inv.invoiceId}
                  </p>
                  <span
                    className="text-[9px] font-bold uppercase tracking-[0.1em]
                               px-2 py-0.5 rounded-full"
                    style={{
                      background: `${status.color}15`,
                      border: `1px solid ${status.color}25`,
                      color: status.color,
                    }}
                  >
                    {status.label}
                  </span>
                </div>
                <p
                  className="text-xs truncate mt-0.5"
                  style={{ color: "rgba(248,246,240,0.4)" }}
                >
                  {inv.carName || "Service Invoice"}
                  {inv.issuedDate && (
                    <span>
                      {" · "}
                      {new Date(inv.issuedDate).toLocaleDateString("en-AE", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  )}
                </p>
              </div>
            </div>

            {/* Amount */}
            <div className="text-right flex-shrink-0">
              <p
                className="font-display text-lg font-bold"
                style={{ color: "#F8F6F0" }}
              >
                AED {Number(inv.total || 0).toLocaleString()}
              </p>
              {inv.method && (
                <p
                  className="text-[10px] mt-0.5"
                  style={{ color: "rgba(248,246,240,0.35)" }}
                >
                  {inv.method}
                </p>
              )}
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
function Account() {
  const navigate = useNavigate();
  const { customer, isAuthenticated, signOut } = useCustomerAuth();
  const [activeTab, setActiveTab] = useState("overview");

  // Redirect if not logged in
  useEffect(() => {
    if (!isAuthenticated) navigate("/login", { replace: true });
  }, [isAuthenticated, navigate]);

  // Load customer data from localStorage
  const allBookings = useMemo(() => loadFromLS(KEYS.bookings, []), []);
  const allInvoices = useMemo(() => loadFromLS(KEYS.invoices, []), []);

  // Filter to this customer only
  const myBookings = useMemo(
    () =>
      allBookings
        .filter(
          (b) =>
            b.customerId === customer?.id ||
            b.customerName?.toLowerCase() === customer?.name?.toLowerCase(),
        )
        .sort(
          (a, b) =>
            new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date),
        ),
    [allBookings, customer],
  );

  const myInvoices = useMemo(
    () =>
      allInvoices
        .filter(
          (i) =>
            i.customerId === customer?.id ||
            i.customerEmail?.toLowerCase() === customer?.email?.toLowerCase(),
        )
        .sort(
          (a, b) =>
            new Date(b.issuedDate || b.createdAt) -
            new Date(a.issuedDate || a.createdAt),
        ),
    [allInvoices, customer],
  );

  const handleSignOut = () => {
    signOut();
    navigate("/", { replace: true });
  };

  if (!customer) return null;

  return (
    <PageLayout>
      {/* Page hero */}
      <div
        className="py-12"
        style={{
          background: "#0B1120",
          borderBottom: "1px solid rgba(212,175,55,0.08)",
        }}
      >
        <div className="container-site">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="label-luxury mb-2">My Account</p>
              <h1
                className="font-display text-2xl font-semibold"
                style={{ color: "#F8F6F0" }}
              >
                {customer.name}
              </h1>
            </div>

            {/* Mobile sign out */}
            <button
              onClick={handleSignOut}
              className="lg:hidden flex items-center gap-2 text-xs
                         font-semibold transition-colors"
              style={{ color: "rgba(248,246,240,0.4)" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#FB7185")}
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "rgba(248,246,240,0.4)")
              }
            >
              <LogOut size={14} />
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Main layout */}
      <div className="container-site py-12">
        <div className="flex flex-col lg:flex-row gap-8 py-12">
          {/* Sidebar */}
          <AccountSidebar
            customer={customer}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            onSignOut={handleSignOut}
          />

          {/* Tab content */}
          <div className="flex-1 min-w-0">
            <AnimatePresence mode="wait">
              {activeTab === "overview" && (
                <OverviewTab
                  key="overview"
                  customer={customer}
                  bookings={myBookings}
                  invoices={myInvoices}
                />
              )}
              {activeTab === "vehicles" && (
                <VehiclesTab key="vehicles" invoices={myInvoices} />
              )}
              {activeTab === "test-drives" && (
                <TestDrivesTab key="test-drives" bookings={myBookings} />
              )}
              {activeTab === "invoices" && (
                <InvoicesTab key="invoices" invoices={myInvoices} />
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}

export default Account;
