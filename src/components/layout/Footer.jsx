// src/components/layout/Footer.jsx

import { Link } from "react-router-dom";
import { Phone, Mail, MapPin } from "lucide-react";
import logo from "../../assets/branding/apex-driveos-full-dark.svg";

const LINKS = {
  Collection: [
    { label: "Browse All Cars", path: "/cars" },
    { label: "Promotions", path: "/promotions" },
    { label: "Book Test Drive", path: "/test-drive" },
  ],
  Company: [
    { label: "Contact Us", path: "/contact" },
    { label: "My Account", path: "/account" },
  ],
};

function Footer() {
  return (
    <footer
      style={{
        background: "#030710",
        borderTop: "1px solid rgba(212,175,55,0.1)",
      }}
    >
      <div className="container-site  ">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 py-20">
          {/* Brand column */}
          <div className="lg:col-span-2">
            {/* <p
              className="font-display text-2xl font-bold tracking-[0.06em] mb-2"
              style={{ color: "#D4AF37" }}
            >
              APEX DRIVEOS
            </p>
            <p
              className="text-[10px] font-semibold tracking-[0.3em] uppercase mb-6"
              style={{ color: "rgba(248,246,240,0.3)" }}
            >
              Luxury Automotive · Dubai, UAE
            </p> */}
            <img
              src={logo}
              alt="Apex DriveOS Logo"
              className="h-8 w-auto mb-4"
            />
            <p
              className="text-sm leading-relaxed max-w-sm mb-8"
              style={{ color: "rgba(248,246,240,0.5)" }}
            >
              The Middle East's premier destination for the world's most
              exclusive automobiles. Where luxury meets performance.
            </p>

            {/* Contact info */}
            <div className="space-y-3">
              {[
                { icon: MapPin, text: "Sheikh Zayed Road, Dubai, UAE" },
                { icon: Phone, text: "+971 4 XXX XXXX" },
                { icon: Mail, text: "info@apexdriveos.ae" },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-3">
                  <Icon size={13} style={{ color: "#D4AF37", flexShrink: 0 }} />
                  <span
                    className="text-xs"
                    style={{ color: "rgba(248,246,240,0.5)" }}
                  >
                    {text}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(LINKS).map(([title, links]) => (
            <div key={title}>
              <p
                className="text-[9px] font-bold tracking-[0.3em] uppercase mb-6"
                style={{ color: "#D4AF37" }}
              >
                {title}
              </p>
              <div className="space-y-4">
                {links.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className="block text-sm transition-colors duration-200"
                    style={{ color: "rgba(248,246,240,0.5)" }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.color = "#F8F6F0")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.color = "rgba(248,246,240,0.5)")
                    }
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div
          className="my-16 pt-8 flex flex-col sm:flex-row items-center
                     justify-between gap-4"
          style={{ borderTop: "1px solid rgba(212,175,55,0.08)" }}
        >
          <p className="text-[11px]" style={{ color: "rgba(248,246,240,0.3)" }}>
            © {new Date().getFullYear()} Apex DriveOS · AjiX Technologies. All
            rights reserved.
          </p>

          {/* Social icons */}
          {/* <div className="flex items-center gap-4">
            {[Instagram, Twitter].map((Icon, i) => (
              <button
                key={i}
                className="w-8 h-8 rounded-lg flex items-center justify-center
                           transition-all duration-200 active:scale-95"
                style={{
                  border: "1px solid rgba(212,175,55,0.15)",
                  color: "rgba(248,246,240,0.4)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "rgba(212,175,55,0.4)";
                  e.currentTarget.style.color = "#D4AF37";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "rgba(212,175,55,0.15)";
                  e.currentTarget.style.color = "rgba(248,246,240,0.4)";
                }}
              >
                <Icon size={14} />
              </button>
            ))}
          </div> */}
        </div>
      </div>
    </footer>
  );
}

export default Footer;
