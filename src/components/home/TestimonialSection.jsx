// src/components/home/TestimonialSection.jsx
// Static testimonials — seed data.

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import SectionHeading from "../ui/SectionHeading";

const TESTIMONIALS = [
  {
    name: "Mohammed Al-Rashid",
    role: "CEO · Al-Rashid Group",
    quote:
      "An unparalleled experience from start to finish. The team at Apex DriveOS understood exactly what I was looking for and delivered beyond expectations. My Rolls Royce Ghost is simply magnificent.",
    vehicle: "Rolls Royce Ghost EWB",
    avatar: "M",
    bg: "linear-gradient(135deg,#B8931F,#D4AF37)",
  },
  {
    name: "Sarah Johnson",
    role: "Managing Director · Johnson Ventures",
    quote:
      "I've purchased luxury vehicles from dealers across Europe and the UAE. Apex DriveOS is in a different league — the attention to detail, the white-glove service, and the quality of their inventory is extraordinary.",
    vehicle: "Mercedes AMG GT 63S",
    avatar: "S",
    bg: "linear-gradient(135deg,#1a6b4a,#10B981)",
  },
  {
    name: "Khalid Al-Mansoori",
    role: "Entrepreneur",
    quote:
      "My third purchase from Apex DriveOS. Every time I come back, the experience gets better. The Lamborghini Urus Performante I purchased last month is everything they promised and more.",
    vehicle: "Lamborghini Urus Performante",
    avatar: "K",
    bg: "linear-gradient(135deg,#1e3a8a,#38BDF8)",
  },
];

function Stars() {
  return (
    <div className="flex items-center gap-1 mb-4">
      {[...Array(5)].map((_, i) => (
        <Star key={i} size={12} fill="#D4AF37" color="#D4AF37" />
      ))}
    </div>
  );
}

function TestimonialSection() {
  return (
    <section className="py-28" style={{ background: "#050A14" }}>
      <div className="container-site">
        <div className="text-center mb-16">
          <SectionHeading
            label="Client Testimonials"
            title="Words From Our Clients"
            centered
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={t.name}
              className="site-card site-card-hover p-8 flex flex-col"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: i * 0.12, duration: 0.6 }}
            >
              <Stars />

              <blockquote
                className="font-display text-base italic leading-relaxed mb-8 flex-1"
                style={{ color: "rgba(248,246,240,0.7)" }}
              >
                "{t.quote}"
              </blockquote>

              <div
                className="flex items-center gap-3 pt-6"
                style={{ borderTop: "1px solid rgba(212,175,55,0.1)" }}
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center
                             text-sm font-bold flex-shrink-0"
                  style={{ background: t.bg, color: "#050A14" }}
                >
                  {t.avatar}
                </div>
                <div>
                  <p
                    className="text-sm font-semibold"
                    style={{ color: "#F8F6F0" }}
                  >
                    {t.name}
                  </p>
                  <p
                    className="text-[10px]"
                    style={{ color: "rgba(248,246,240,0.4)" }}
                  >
                    {t.role}
                  </p>
                  <p
                    className="text-[10px] mt-0.5"
                    style={{ color: "#D4AF37" }}
                  >
                    {t.vehicle}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default TestimonialSection;
