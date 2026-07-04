// src/pages/Login.jsx
// Customer-facing login page.
// Mock auth: matches against apex-gt-customers localStorage.
// Any password accepted for this sprint.
// Real auth: replace signIn in useCustomerAuth with Supabase when ready.

import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, AlertCircle, ArrowRight } from "lucide-react";
import { useCustomerAuth } from "../hooks/useCustomerAuth";

// ── Animated background gradient ──────────────────────────────────────────────
function AnimatedBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Base dark */}
      <div className="absolute inset-0" style={{ background: "#050A14" }} />

      {/* Animated gold orbs */}
      {[
        { size: 600, x: "10%", y: "20%", delay: 0 },
        { size: 400, x: "80%", y: "60%", delay: 2 },
        { size: 300, x: "50%", y: "80%", delay: 4 },
      ].map((orb, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full pointer-events-none"
          style={{
            width: orb.size,
            height: orb.size,
            left: orb.x,
            top: orb.y,
            transform: "translate(-50%, -50%)",
            background:
              "radial-gradient(circle, rgba(212,175,55,0.04) 0%, transparent 70%)",
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 8,
            delay: orb.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Subtle grid */}
      <svg className="absolute inset-0 w-full h-full" style={{ opacity: 0.03 }}>
        {[...Array(20)].map((_, i) => (
          <line
            key={`h${i}`}
            x1="0"
            y1={`${i * 5}%`}
            x2="100%"
            y2={`${i * 5}%`}
            stroke="#D4AF37"
            strokeWidth="0.5"
          />
        ))}
        {[...Array(20)].map((_, i) => (
          <line
            key={`v${i}`}
            x1={`${i * 5}%`}
            y1="0"
            x2={`${i * 5}%`}
            y2="100%"
            stroke="#D4AF37"
            strokeWidth="0.5"
          />
        ))}
      </svg>
    </div>
  );
}

function Login() {
  const navigate = useNavigate();
  const { signIn, isAuthenticated, loading, error } = useCustomerAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState("");

  // Already logged in — redirect to account
  useEffect(() => {
    if (isAuthenticated) navigate("/account", { replace: true });
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setLocalError("");

    if (!email.trim() || !password.trim()) {
      setLocalError("Please enter your email and password.");
      return;
    }

    const { success, error: signInError } = await signIn(email, password);
    if (success) {
      navigate("/account", { replace: true });
    } else {
      setLocalError(signInError || "Sign in failed.");
    }
  };

  const displayError = localError || error;

  return (
    <div className="min-h-screen flex items-center justify-center relative px-4">
      <AnimatedBackground />

      <motion.div
        className="relative z-10 w-full max-w-md"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Logo */}
        <div className="text-center mb-10">
          <Link to="/">
            <p
              className="font-display text-2xl font-bold tracking-[0.06em]"
              style={{ color: "#D4AF37" }}
            >
              APEX DRIVEOS
            </p>
            <p
              className="text-[10px] font-semibold tracking-[0.3em] uppercase mt-1"
              style={{ color: "rgba(248,246,240,0.3)" }}
            >
              Customer Portal
            </p>
          </Link>
        </div>

        {/* Card */}
        <div
          className="rounded-2xl p-8"
          style={{
            background: "rgba(13,24,41,0.9)",
            border: "1px solid rgba(212,175,55,0.15)",
            backdropFilter: "blur(20px)",
          }}
        >
          {/* Header */}
          <div className="mb-8">
            <h1
              className="font-display text-2xl font-semibold mb-2"
              style={{ color: "#F8F6F0" }}
            >
              Welcome Back
            </h1>
            <p className="text-sm" style={{ color: "rgba(248,246,240,0.45)" }}>
              Sign in to access your account, purchases, and bookings.
            </p>
          </div>

          {/* Error */}
          <AnimatePresence>
            {displayError && (
              <motion.div
                className="flex items-center gap-3 rounded-xl px-4 py-3 mb-6"
                style={{
                  background: "rgba(251,113,133,0.08)",
                  border: "1px solid rgba(251,113,133,0.2)",
                }}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <AlertCircle
                  size={14}
                  style={{ color: "#FB7185", flexShrink: 0 }}
                />
                <p className="text-xs" style={{ color: "#FB7185" }}>
                  {displayError}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div className="flex flex-col gap-2">
              <label
                className="text-[10px] font-bold tracking-[0.2em] uppercase"
                style={{ color: "rgba(248,246,240,0.45)" }}
              >
                Email Address
              </label>
              <div className="relative">
                <Mail
                  size={13}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2
                             pointer-events-none"
                  style={{ color: "rgba(248,246,240,0.25)" }}
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@email.com"
                  autoComplete="email"
                  className="input-site pl-10 w-full"
                  style={{
                    borderColor: displayError
                      ? "rgba(251,113,133,0.3)"
                      : undefined,
                  }}
                />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-2">
              <label
                className="text-[10px] font-bold tracking-[0.2em] uppercase"
                style={{ color: "rgba(248,246,240,0.45)" }}
              >
                Password
              </label>
              <div className="relative">
                <Lock
                  size={13}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2
                             pointer-events-none"
                  style={{ color: "rgba(248,246,240,0.25)" }}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="input-site pl-10 pr-12 w-full"
                  style={{
                    borderColor: displayError
                      ? "rgba(251,113,133,0.3)"
                      : undefined,
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2
                             transition-colors"
                  style={{ color: "rgba(248,246,240,0.3)" }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = "rgba(248,246,240,0.6)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = "rgba(248,246,240,0.3)")
                  }
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={loading}
              className="btn-gold w-full justify-center mt-2"
              style={{
                padding: "15px",
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
                  Signing In...
                </span>
              ) : (
                <>
                  Sign In
                  <ArrowRight size={14} />
                </>
              )}
            </motion.button>
          </form>

          {/* Mock auth note */}
          <div
            className="mt-6 rounded-xl px-4 py-3"
            style={{
              background: "rgba(212,175,55,0.04)",
              border: "1px solid rgba(212,175,55,0.1)",
            }}
          >
            <p
              className="text-[10px] leading-relaxed"
              style={{ color: "rgba(248,246,240,0.4)" }}
            >
              Enter the email address you used when booking a test drive or
              making an enquiry. Any password will work in this demo.
            </p>
          </div>
        </div>

        {/* Footer links */}
        <div className="flex items-center justify-between mt-6 px-1">
          <Link
            to="/"
            className="text-xs transition-colors"
            style={{ color: "rgba(248,246,240,0.35)" }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.color = "rgba(248,246,240,0.7)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.color = "rgba(248,246,240,0.35)")
            }
          >
            ← Back to Home
          </Link>
          <Link
            to="/contact"
            className="text-xs transition-colors"
            style={{ color: "rgba(248,246,240,0.35)" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#D4AF37")}
            onMouseLeave={(e) =>
              (e.currentTarget.style.color = "rgba(248,246,240,0.35)")
            }
          >
            Need help?
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

export default Login;
