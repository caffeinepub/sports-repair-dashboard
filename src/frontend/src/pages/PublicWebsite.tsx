import {
  Activity,
  CheckCircle,
  Clock,
  Link,
  Menu,
  MessageCircle,
  Phone,
  Shield,
  Star,
  Users,
  Wrench,
  X,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

const WHATSAPP_NUMBER = "91XXXXXXXXXX";
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`;

const services = [
  {
    icon: Activity,
    title: "Badminton Restringing",
    description:
      "Professional restringing with top-quality strings. All tension levels available for beginners to pros.",
  },
  {
    icon: Shield,
    title: "Cricket Bat Repair",
    description:
      "Bat binding, handle repair, toe guard, and full bat refurbishment by experienced technicians.",
  },
  {
    icon: Wrench,
    title: "Grip Replacement",
    description:
      "New grip installation for rackets, bats, and handles. All brands and sizes available.",
  },
  {
    icon: Zap,
    title: "Racket Repair",
    description:
      "Frame cracks, grommet replacement, and full racket restoration for all racket sports.",
  },
  {
    icon: Link,
    title: "Bat Binding",
    description:
      "Professional binding tape application for all types of cricket and tennis bats.",
  },
  {
    icon: CheckCircle,
    title: "Full Inspection",
    description:
      "Complete equipment health check and service recommendation to extend the life of your gear.",
  },
];

const trustItems = [
  {
    icon: Shield,
    title: "Trusted Experts",
    text: "10+ years of sports equipment repair experience",
  },
  {
    icon: Clock,
    title: "Quick Turnaround",
    text: "Most repairs done within 24 hours",
  },
  {
    icon: Star,
    title: "Quality Assured",
    text: "Only premium strings and materials used",
  },
  {
    icon: Users,
    title: "100+ Happy Customers",
    text: "Serving individuals and sports shops",
  },
];

const quickLinks = [
  { label: "Home", href: "#home" },
  { label: "Services", href: "#services" },
  { label: "Why Choose Us", href: "#why-us" },
  { label: "Contact", href: "#contact" },
];

export function PublicWebsite() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMobileMenuOpen(false);
  }

  return (
    <div
      id="home"
      className="min-h-screen bg-white font-sans"
      style={{ scrollBehavior: "smooth" }}
    >
      {/* ═══════════════════════════════ NAVBAR ═══════════════════════════════ */}
      <header className="sticky top-0 z-50 bg-white border-b border-[#E5E7EB] shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, #0B5E86 0%, #0E6F7A 100%)",
              }}
            >
              <Wrench className="h-5 w-5 text-white" />
            </div>
            <div>
              <span
                className="font-bold text-base leading-tight block"
                style={{ color: "#0B5E86" }}
              >
                ACE Sports Repair
              </span>
              <span className="text-[10px] text-[#6B7280] leading-tight block">
                Professional Equipment Service
              </span>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            {["Home", "Services", "Why Us", "Contact"].map((item) => (
              <button
                key={item}
                type="button"
                onClick={() =>
                  scrollTo(
                    item === "Why Us"
                      ? "why-us"
                      : item === "Contact"
                        ? "contact"
                        : item.toLowerCase(),
                  )
                }
                data-ocid={`nav.${item.toLowerCase().replace(/ /g, "_")}.link`}
                className="text-sm font-medium text-[#374151] hover:text-[#0B5E86] transition-colors"
              >
                {item}
              </button>
            ))}
          </nav>

          {/* Desktop CTA */}
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noreferrer"
            data-ocid="nav.whatsapp.button"
            className="hidden md:inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold text-white transition-all hover:opacity-90 hover:shadow-md"
            style={{ background: "#2FAE5E" }}
          >
            <MessageCircle className="h-4 w-4" />
            WhatsApp Us
          </a>

          {/* Mobile hamburger */}
          <button
            type="button"
            className="md:hidden text-[#374151] p-1"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            data-ocid="nav.mobile_menu.button"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden border-t border-[#E5E7EB] bg-white px-4 py-4 space-y-3"
          >
            {["Home", "Services", "Why Us", "Contact"].map((item) => (
              <button
                key={item}
                type="button"
                onClick={() =>
                  scrollTo(
                    item === "Why Us"
                      ? "why-us"
                      : item === "Contact"
                        ? "contact"
                        : item.toLowerCase(),
                  )
                }
                className="block w-full text-left text-sm font-medium text-[#374151] py-1.5"
              >
                {item}
              </button>
            ))}
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold text-white"
              style={{ background: "#2FAE5E" }}
            >
              <MessageCircle className="h-4 w-4" />
              WhatsApp Us
            </a>
          </motion.div>
        )}
      </header>

      {/* ═══════════════════════════════ HERO ═══════════════════════════════ */}
      <section
        id="hero"
        className="relative min-h-[90vh] flex items-center overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, #0B1F33 0%, #0B5E86 40%, #0E6F7A 70%, #1a8c5c 100%)",
        }}
      >
        {/* Decorative blobs */}
        <div
          className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full opacity-10 blur-3xl"
          style={{ background: "#2FAE5E" }}
        />
        <div
          className="absolute bottom-1/3 left-1/3 w-64 h-64 rounded-full opacity-10 blur-2xl"
          style={{ background: "#0B5E86" }}
        />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-20 grid lg:grid-cols-2 gap-12 items-center">
          {/* Text */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-6"
              style={{ background: "rgba(47,174,94,0.2)", color: "#7DEDB8" }}
            >
              <CheckCircle className="h-3.5 w-3.5" />
              Professional • Trusted • Fast
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-white leading-[1.05] mb-6">
              EXPERT{" "}
              <span
                className="block"
                style={{
                  background: "linear-gradient(90deg, #7DEDB8, #2FAE5E)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                SPORTS
              </span>
              EQUIPMENT
              <br />
              REPAIR
            </h1>
            <p className="text-white/75 text-lg leading-relaxed mb-8 max-w-md">
              Professional restringing, bat binding, grip replacement & more. We
              restore your gear to peak performance.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noreferrer"
                data-ocid="hero.book_repair.button"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-bold text-white shadow-lg transition-all hover:opacity-90 hover:shadow-xl hover:-translate-y-0.5"
                style={{ background: "#2FAE5E" }}
              >
                <MessageCircle className="h-4 w-4" />
                Book a Repair
              </a>
              <button
                type="button"
                onClick={() => scrollTo("services")}
                data-ocid="hero.view_services.button"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-bold text-white border-2 border-white/30 hover:border-white/60 hover:bg-white/10 transition-all"
              >
                View Services
              </button>
            </div>
          </motion.div>

          {/* Right visual */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
            className="hidden lg:flex items-center justify-center"
          >
            <div className="relative">
              {/* Central icon display */}
              <div
                className="w-72 h-72 rounded-full flex items-center justify-center"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.12)",
                }}
              >
                <div
                  className="w-52 h-52 rounded-full flex items-center justify-center"
                  style={{
                    background: "rgba(255,255,255,0.08)",
                    border: "1px solid rgba(255,255,255,0.15)",
                  }}
                >
                  <Wrench
                    className="h-24 w-24 text-white/90"
                    strokeWidth={1.5}
                  />
                </div>
              </div>
              {/* Floating badge — top right */}
              <div
                className="absolute -top-4 -right-4 w-20 h-20 rounded-2xl flex flex-col items-center justify-center text-white shadow-xl"
                style={{ background: "#2FAE5E" }}
              >
                <span className="text-xl font-black leading-none">10+</span>
                <span className="text-[9px] font-semibold uppercase tracking-wide mt-0.5 text-center leading-tight">
                  Years Exp
                </span>
              </div>
              {/* Floating badge — bottom left */}
              <div
                className="absolute -bottom-4 -left-4 w-24 h-16 rounded-2xl flex flex-col items-center justify-center text-white shadow-xl"
                style={{
                  background: "linear-gradient(135deg, #0B5E86, #0E6F7A)",
                }}
              >
                <span className="text-lg font-black leading-none">24hr</span>
                <span className="text-[9px] font-semibold uppercase tracking-wide mt-0.5">
                  Turnaround
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Scroll cue */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{
              repeat: Number.POSITIVE_INFINITY,
              duration: 1.8,
              ease: "easeInOut",
            }}
            className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center pt-2"
          >
            <div className="w-1 h-2 bg-white/60 rounded-full" />
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════ SERVICES ═══════════════════════════════ */}
      <section
        id="services"
        className="py-20"
        style={{ background: "#F3F6F9" }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <p
              className="text-xs font-bold uppercase tracking-[0.2em] mb-3"
              style={{ color: "#2FAE5E" }}
            >
              What We Do
            </p>
            <h2
              className="text-3xl sm:text-4xl font-black uppercase"
              style={{ color: "#0B5E86" }}
            >
              Our Services
            </h2>
            <div
              className="mx-auto mt-4 h-1 w-16 rounded-full"
              style={{ background: "linear-gradient(90deg, #0B5E86, #2FAE5E)" }}
            />
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((svc, i) => (
              <motion.div
                key={svc.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.07 }}
                data-ocid={`services.item.${i + 1}`}
                className="bg-white rounded-2xl p-6 border border-[#E5E7EB] shadow-sm hover:shadow-md hover:-translate-y-1 transition-all group cursor-default"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                  style={{
                    background:
                      "linear-gradient(135deg, #e8f5ee 0%, #daeef6 100%)",
                  }}
                >
                  <svc.icon
                    className="h-5 w-5"
                    style={{ color: "#0B5E86" }}
                    strokeWidth={2}
                  />
                </div>
                <h3
                  className="font-bold text-base mb-2"
                  style={{ color: "#111827" }}
                >
                  {svc.title}
                </h3>
                <p className="text-sm leading-relaxed text-[#6B7280]">
                  {svc.description}
                </p>
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-semibold mt-4 transition-colors hover:opacity-80"
                  style={{ color: "#2FAE5E" }}
                >
                  Book This Service →
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════ WHY CHOOSE US ═══════════════════════════════ */}
      <section id="why-us" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <p
              className="text-xs font-bold uppercase tracking-[0.2em] mb-3"
              style={{ color: "#2FAE5E" }}
            >
              Our Advantage
            </p>
            <h2
              className="text-3xl sm:text-4xl font-black uppercase"
              style={{ color: "#0B5E86" }}
            >
              Why Choose Us
            </h2>
            <div
              className="mx-auto mt-4 h-1 w-16 rounded-full"
              style={{ background: "linear-gradient(90deg, #0B5E86, #2FAE5E)" }}
            />
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {trustItems.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                data-ocid={`why_us.item.${i + 1}`}
                className="text-center group"
              >
                <div
                  className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center transition-all group-hover:scale-105"
                  style={{
                    background:
                      "linear-gradient(135deg, #e8f5ee 0%, #daeef6 100%)",
                  }}
                >
                  <item.icon
                    className="h-7 w-7"
                    style={{ color: "#0E6F7A" }}
                    strokeWidth={1.75}
                  />
                </div>
                <h3
                  className="font-bold text-base mb-2"
                  style={{ color: "#111827" }}
                >
                  {item.title}
                </h3>
                <p className="text-sm text-[#6B7280] leading-relaxed">
                  {item.text}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Trust badges strip */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-16 flex flex-wrap justify-center gap-4"
          >
            {[
              "⭐ Top Rated",
              "✅ Certified Technicians",
              "🏆 10+ Years Experience",
              "📦 All Brands Supported",
              "📱 WhatsApp Support",
            ].map((badge) => (
              <span
                key={badge}
                className="px-4 py-2 rounded-full text-xs font-semibold border border-[#E5E7EB] text-[#374151] bg-[#F9FAFB]"
              >
                {badge}
              </span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════ CTA BAND ═══════════════════════════════ */}
      <section
        id="contact"
        className="py-20 relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, #0B1F33 0%, #0B5E86 50%, #0E6F7A 100%)",
        }}
      >
        {/* Decorative circle */}
        <div
          className="absolute right-0 top-0 w-96 h-96 rounded-full opacity-10 -translate-y-1/2 translate-x-1/2"
          style={{ background: "#2FAE5E" }}
        />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl sm:text-4xl font-black uppercase text-white mb-4">
              Ready to get back in the game?
            </h2>
            <p className="text-white/70 text-lg mb-8">
              Contact us on WhatsApp for instant quotes and booking. Fast
              response guaranteed.
            </p>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noreferrer"
              data-ocid="cta.whatsapp.button"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-full font-bold text-white text-base shadow-2xl transition-all hover:opacity-90 hover:scale-105"
              style={{ background: "#2FAE5E" }}
            >
              <MessageCircle className="h-5 w-5" />
              Send us a WhatsApp
              <span className="opacity-70 text-sm font-normal">
                +91 XXXXXXXXXX
              </span>
            </a>
            {/* Contact pills */}
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <div
                className="flex items-center gap-2 px-4 py-2 rounded-full text-sm text-white/80"
                style={{ background: "rgba(255,255,255,0.1)" }}
              >
                <Phone className="h-4 w-4" />
                +91 XXXXXXXXXX
              </div>
              <div
                className="flex items-center gap-2 px-4 py-2 rounded-full text-sm text-white/80"
                style={{ background: "rgba(255,255,255,0.1)" }}
              >
                <MessageCircle className="h-4 w-4" />
                WhatsApp Available
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════ FOOTER ═══════════════════════════════ */}
      <footer className="pt-12 pb-6" style={{ background: "#0B1F33" }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-3 gap-10 pb-10 border-b border-white/10">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2.5 mb-4">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{
                    background:
                      "linear-gradient(135deg, #0B5E86 0%, #2FAE5E 100%)",
                  }}
                >
                  <Wrench className="h-5 w-5 text-white" />
                </div>
                <span className="font-bold text-white text-base">
                  ACE Sports Repair
                </span>
              </div>
              <p className="text-sm text-white/50 leading-relaxed">
                Professional sports equipment repair and maintenance. Trusted by
                players and sports shops alike.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
                Quick Links
              </h4>
              <ul className="space-y-2.5">
                {quickLinks.map((link) => (
                  <li key={link.label}>
                    <button
                      type="button"
                      onClick={() =>
                        scrollTo(
                          link.href === "#why-us"
                            ? "why-us"
                            : link.href.replace("#", ""),
                        )
                      }
                      data-ocid={`footer.${link.label.toLowerCase().replace(/ /g, "_")}.link`}
                      className="text-sm text-white/50 hover:text-white transition-colors"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
                Contact
              </h4>
              <ul className="space-y-3">
                <li className="flex items-center gap-2.5 text-sm text-white/50">
                  <Phone className="h-4 w-4 text-[#2FAE5E] shrink-0" />
                  +91 XXXXXXXXXX
                </li>
                <li className="flex items-center gap-2.5 text-sm text-white/50">
                  <MessageCircle className="h-4 w-4 text-[#2FAE5E] shrink-0" />
                  WhatsApp Available
                </li>
                <li className="mt-4">
                  <a
                    href={WHATSAPP_URL}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold text-white transition-all hover:opacity-80"
                    style={{ background: "#2FAE5E" }}
                  >
                    <MessageCircle className="h-3.5 w-3.5" />
                    Chat on WhatsApp
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/30">
            <span>
              © {new Date().getFullYear()} ACE Sports Repair. Built with love
              using{" "}
              <a
                href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
                className="text-white/50 hover:text-white transition-colors"
                target="_blank"
                rel="noreferrer"
              >
                caffeine.ai
              </a>
            </span>
            <button
              type="button"
              onClick={() => {
                window.location.hash = "admin";
              }}
              data-ocid="footer.admin_login.link"
              className="text-white/20 hover:text-white/50 transition-colors text-[10px] bg-transparent border-none cursor-pointer p-0"
            >
              Admin Login
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
