// src/pages/Home.jsx
// Assembles all home sections in order.
// Navbar + Footer wrap every page — added here directly for now.
// In Phase 3 we'll extract to a Layout component.

import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import HeroSection from "../components/home/HeroSection";
import StatsSection from "../components/home/StatsSection";
import FeaturedVehicles from "../components/home/FeaturedVehicles";
import PromotionsStrip from "../components/home/PromotionStrip";
import TestimonialSection from "../components/home/TestimonialSection";
import CTASection from "../components/home/CTASection";

function Home() {
  return (
    <div style={{ background: "#050A14" }}>
      <Navbar />
      <HeroSection />
      <StatsSection />
      <FeaturedVehicles />
      <PromotionsStrip />
      <TestimonialSection />
      <CTASection />
      <Footer />
    </div>
  );
}

export default Home;
