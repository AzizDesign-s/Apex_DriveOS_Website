// src/components/home/StatsSection.jsx
// Animated count-up numbers on scroll.
// Dark band across full width.

import { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useVehicles } from "../../hooks/useVehicles";

gsap.registerPlugin(ScrollTrigger);

function CountUp({ target, suffix = "", duration = 2 }) {
  const [count, setCount] = useState(0);
  const [triggered, setTriggered] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: ref.current,
        start: "top 85%",
        once: true,
        onEnter: () => {
          setTriggered(true);
          gsap.to(
            { val: 0 },
            {
              val: target,
              duration,
              ease: "power2.out",
              onUpdate: function () {
                setCount(Math.round(this.targets()[0].val));
              },
            },
          );
        },
      });
    });
    return () => ctx.revert();
  }, [target, duration]);

  return (
    <span ref={ref}>
      {triggered ? count : 0}
      {suffix}
    </span>
  );
}

function StatsSection() {
  const { vehicles, available } = useVehicles();

  const brands = [...new Set(vehicles.map((v) => v.brand))].length;

  const stats = [
    { value: available.length || 20, suffix: "+", label: "Available Vehicles" },
    { value: brands || 12, suffix: "+", label: "Luxury Brands" },
    { value: 500, suffix: "+", label: "Satisfied Clients" },
    { value: 5, suffix: "+", label: "Years of Excellence" },
  ];

  return (
    <section
      className="py-20"
      style={{
        background: "#030710",
        borderTop: "1px solid rgba(212,175,55,0.08)",
        borderBottom: "1px solid rgba(212,175,55,0.08)",
      }}
    >
      <div className="container-site">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-0">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className="text-center lg:text-left py-4"
              style={{
                borderRight:
                  i < stats.length - 1
                    ? "1px solid rgba(212,175,55,0.08)"
                    : "none",
                paddingLeft: i > 0 ? "2rem" : 0,
                paddingRight: i < stats.length - 1 ? "2rem" : 0,
              }}
            >
              <p
                className="font-display text-4xl lg:text-5xl font-bold mb-2"
                style={{ color: "#D4AF37" }}
              >
                <CountUp target={stat.value} suffix={stat.suffix} />
              </p>
              <p
                className="text-[10px] font-semibold tracking-[0.2em] uppercase"
                style={{ color: "rgba(248,246,240,0.4)" }}
              >
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default StatsSection;
