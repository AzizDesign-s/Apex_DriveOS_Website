// src/components/account/AccountSidebar.jsx
// Left sidebar for the Account page.
// Shows: avatar, name, customer ID, nav tabs, sign out.

import { motion } from "framer-motion";
import { User, Car, CalendarCheck, FileText, LogOut } from "lucide-react";
import clsx from "clsx";

const NAV_ITEMS = [
  { id: "overview", label: "Overview", icon: User },
  { id: "vehicles", label: "My Vehicles", icon: Car },
  { id: "test-drives", label: "Test Drives", icon: CalendarCheck },
  { id: "invoices", label: "Invoices", icon: FileText },
];

function AccountSidebar({ customer, activeTab, onTabChange, onSignOut }) {
  const initials =
    customer?.name
      ?.split(" ")
      .map((w) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "C";

  return (
    <motion.aside
      className="w-full lg:w-64 flex-shrink-0"
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div
        className="rounded-2xl p-6 lg:sticky"
        style={{
          top: "104px",
          background: "#0D1829",
          border: "1px solid rgba(212,175,55,0.1)",
        }}
      >
        {/* Avatar + name */}
        <div className="flex lg:flex-col items-center lg:items-start gap-4 mb-6">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center
                       text-xl font-bold flex-shrink-0"
            style={{
              background: "linear-gradient(135deg,#B8931F,#D4AF37,#E8C84A)",
              color: "#050A14",
            }}
          >
            {initials}
          </div>
          <div className="min-w-0">
            <p
              className="font-display text-base font-semibold truncate"
              style={{ color: "#F8F6F0" }}
            >
              {customer?.name}
            </p>
            <p
              className="text-[10px] font-mono mt-0.5"
              style={{ color: "#D4AF37" }}
            >
              {customer?.customerId}
            </p>
            <span
              className="inline-block text-[9px] font-bold uppercase
                         tracking-[0.15em] px-2 py-0.5 rounded-full mt-1.5"
              style={{
                background: "rgba(16,185,129,0.1)",
                border: "1px solid rgba(16,185,129,0.2)",
                color: "#10B981",
              }}
            >
              {customer?.status || "Active"}
            </span>
          </div>
        </div>

        {/* Divider */}
        <div
          className="mb-4"
          style={{ height: "1px", background: "rgba(212,175,55,0.08)" }}
        />

        {/* Nav items */}
        <nav
          className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible
                        scrollbar-none pb-1 lg:pb-0"
        >
          {NAV_ITEMS.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl
                           text-left whitespace-nowrap lg:w-full transition-all
                           duration-200 flex-shrink-0 active:scale-[0.97]"
                style={{
                  background: isActive ? "rgba(212,175,55,0.1)" : "transparent",
                  border: isActive
                    ? "1px solid rgba(212,175,55,0.2)"
                    : "1px solid transparent",
                  color: isActive ? "#D4AF37" : "rgba(248,246,240,0.5)",
                }}
              >
                <item.icon size={15} style={{ flexShrink: 0 }} />
                <span className="text-xs font-semibold">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Divider */}
        <div
          className="my-4 hidden lg:block"
          style={{ height: "1px", background: "rgba(212,175,55,0.08)" }}
        />

        {/* Sign out */}
        <button
          onClick={onSignOut}
          className="hidden lg:flex items-center gap-3 px-3 py-2.5 rounded-xl
                     w-full text-left transition-all duration-200 active:scale-[0.97]"
          style={{ color: "rgba(248,246,240,0.35)" }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "#FB7185";
            e.currentTarget.style.background = "rgba(251,113,133,0.06)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "rgba(248,246,240,0.35)";
            e.currentTarget.style.background = "transparent";
          }}
        >
          <LogOut size={15} style={{ flexShrink: 0 }} />
          <span className="text-xs font-semibold">Sign Out</span>
        </button>
      </div>
    </motion.aside>
  );
}

export default AccountSidebar;
