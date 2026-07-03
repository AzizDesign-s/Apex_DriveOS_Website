// src/components/layout/Navbar.jsx
// Transparent on hero, transitions to solid dark on scroll.
// GSAP ScrollTrigger handles the transparency change.
// Mobile: hamburger → full-screen overlay with staggered links.

import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronRight } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import logo from "../../assets/branding/apex-driveos-full-dark.svg";
import { useCustomerAuth } from "../../hooks/useCustomerAuth";

gsap.registerPlugin(ScrollTrigger);

const NAV_LINKS = [
  { label: "Collection", path: "/cars" },
  { label: "Promotions", path: "/promotions" },
  { label: "Test Drive", path: "/test-drive" },
  { label: "Contact", path: "/contact" },
];

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navRef = useRef(null);
  const location = useLocation();
  const { isAuthenticated, customer } = useCustomerAuth();

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  // GSAP scroll listener — transparent → solid
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <motion.nav
        ref={navRef}
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
        style={{
          background: scrolled ? "rgba(5,10,20,0.95)" : "transparent",
          backdropFilter: scrolled ? "blur(20px)" : "none",
          borderBottom: scrolled
            ? "1px solid rgba(212,175,55,0.08)"
            : "1px solid transparent",
        }}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="container-site">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              {/* <div className="flex flex-col">
                <span
                  className="font-display text-lg font-bold tracking-[0.08em]"
                  style={{ color: "#D4AF37" }}
                >
                  APEX DRIVEOS
                </span>
                <span
                  className="text-[8px] font-sans font-semibold tracking-[0.3em]
                             uppercase"
                  style={{ color: "rgba(248,246,240,0.4)" }}
                >
                  Luxury Automotive
                </span>
              </div> */}
              <img src={logo} alt="Apex DriveOS Logo" className="h-6 w-auto" />
            </Link>

            {/* Desktop nav links */}
            <div className="hidden lg:flex items-center gap-10">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="relative text-[11px] font-sans font-semibold
                             tracking-[0.2em] uppercase transition-colors duration-200"
                  style={{
                    color: isActive(link.path)
                      ? "#D4AF37"
                      : "rgba(248,246,240,0.7)",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive(link.path))
                      e.currentTarget.style.color = "#F8F6F0";
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive(link.path))
                      e.currentTarget.style.color = "rgba(248,246,240,0.7)";
                  }}
                >
                  {link.label}
                  {isActive(link.path) && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute -bottom-1 left-0 right-0 h-px"
                      style={{ background: "#D4AF37" }}
                    />
                  )}
                </Link>
              ))}
            </div>

            {/* Desktop CTA */}
            <div className="hidden lg:flex items-center gap-4">
              {isAuthenticated ? (
                <Link
                  to="/account"
                  className="flex items-center gap-2 text-[11px] font-semibold
                             tracking-[0.15em] uppercase transition-colors"
                  style={{ color: "#D4AF37" }}
                >
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center
                               text-[10px] font-bold"
                    style={{
                      background: "linear-gradient(135deg,#B8931F,#D4AF37)",
                      color: "#050A14",
                    }}
                  >
                    {customer?.name?.[0] || "C"}
                  </div>
                  My Account
                </Link>
              ) : (
                <Link to="/login" className="btn-ghost text-[11px] py-2.5 px-5">
                  Sign In
                </Link>
              )}
              <Link
                to="/test-drive"
                className="btn-gold text-[11px] py-2.5 px-6"
              >
                Book Test Drive
              </Link>
            </div>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden w-10 h-10 flex items-center justify-center
                         rounded-lg border transition-colors"
              style={{
                borderColor: "rgba(212,175,55,0.2)",
                color: "#F8F6F0",
              }}
              aria-label="Open menu"
            >
              <Menu size={18} />
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile full-screen overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 z-[100] flex flex-col"
            style={{ background: "#050A14" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Mobile header */}
            <div className="flex items-center justify-between px-6 h-20">
              {/* <span
                  className="font-display text-lg font-bold tracking-[0.08em]"
                  style={{ color: "#D4AF37" }}
                >
                  APEX DRIVEOS
                </span> */}
              <img src={logo} alt="Apex DriveOS Logo" className="h-6 w-auto" />
              <button
                onClick={() => setMobileOpen(false)}
                className="w-10 h-10 flex items-center justify-center rounded-lg
                           border transition-colors"
                style={{
                  borderColor: "rgba(212,175,55,0.2)",
                  color: "#F8F6F0",
                }}
                aria-label="Close menu"
              >
                <X size={18} />
              </button>
            </div>

            {/* Gold rule */}
            <div
              className="mx-6 h-px"
              style={{ background: "rgba(212,175,55,0.12)" }}
            />

            {/* Mobile links */}
            <div className="flex-1 flex flex-col justify-center px-6 gap-2">
              {NAV_LINKS.map((link, i) => (
                <motion.div
                  key={link.path}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 + 0.1, duration: 0.4 }}
                >
                  <Link
                    to={link.path}
                    className="flex items-center justify-between py-5
                               border-b group"
                    style={{ borderColor: "rgba(212,175,55,0.08)" }}
                  >
                    <span
                      className="font-display text-2xl"
                      style={{
                        color: isActive(link.path) ? "#D4AF37" : "#F8F6F0",
                      }}
                    >
                      {link.label}
                    </span>
                    <ChevronRight
                      size={18}
                      style={{ color: "rgba(212,175,55,0.4)" }}
                    />
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Mobile CTA */}
            <motion.div
              className="px-6 pb-12 flex flex-col gap-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              {isAuthenticated ? (
                <Link to="/account" className="btn-gold text-center">
                  My Account
                </Link>
              ) : (
                <>
                  <Link to="/login" className="btn-ghost text-center">
                    Sign In
                  </Link>
                  <Link to="/test-drive" className="btn-gold text-center">
                    Book Test Drive
                  </Link>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default Navbar;
