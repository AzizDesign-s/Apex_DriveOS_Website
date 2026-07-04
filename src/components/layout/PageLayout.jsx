// src/components/layout/PageLayout.jsx
// Shared layout wrapper for all non-home pages.
// Handles: Navbar, Footer, page entrance animation,
// and the top padding needed to clear the fixed Navbar.

import { motion } from "framer-motion";
import Navbar from "./Navbar";
import Footer from "./Footer";

function PageLayout({ children, fullWidth = false }) {
  return (
    <div style={{ background: "#050A14", minHeight: "100vh" }}>
      <Navbar />

      {/* Page entrance */}
      <motion.main
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        style={{ paddingTop: "80px" }} // clear fixed navbar
      >
        {children}
      </motion.main>

      <Footer />
    </div>
  );
}

export default PageLayout;
