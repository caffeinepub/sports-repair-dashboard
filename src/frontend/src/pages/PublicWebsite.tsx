import {
  Activity,
  CalendarCheck,
  CheckCircle,
  Clock,
  Loader2,
  Lock,
  Menu,
  MessageCircle,
  Phone,
  Search,
  Shield,
  Star,
  Users,
  Wrench,
  X,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import type { BookingRecord, BookingWithId } from "../hooks/useActor";
import { useActor } from "../hooks/useActor";

const WHATSAPP_NUMBER = "919440790818";
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
    icon: CalendarCheck,
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

const SERVICE_TYPES = [
  "Badminton Restringing",
  "Cricket Bat Repair",
  "Grip Replacement",
  "Racket Repair",
  "Bat Binding",
  "Full Inspection",
  "Other",
];

const quickLinks = [
  { label: "Home", href: "#home" },
  { label: "Services", href: "#services" },
  { label: "Why Choose Us", href: "#why-us" },
  { label: "Book Repair", href: "#booking" },
  { label: "Check Status", href: "#check-status" },
  { label: "Contact", href: "#contact" },
];

function statusBadge(status: string) {
  const styles: Record<string, string> = {
    pending: "bg-amber-100 text-amber-700 border border-amber-200",
    confirmed: "bg-blue-100 text-blue-700 border border-blue-200",
    "in-progress": "bg-purple-100 text-purple-700 border border-purple-200",
    completed: "bg-emerald-100 text-emerald-700 border border-emerald-200",
    cancelled: "bg-red-100 text-red-700 border border-red-200",
  };
  const cls =
    styles[status] ?? "bg-gray-100 text-gray-700 border border-gray-200";
  return (
    <span
      className={`px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${cls}`}
    >
      {status}
    </span>
  );
}

function formatDate(dateStr: string): string {
  if (!dateStr) return "—";
  try {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

export function PublicWebsite() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Booking form state
  const [bookingName, setBookingName] = useState("");
  const [bookingMobile, setBookingMobile] = useState("");
  const [bookingService, setBookingService] = useState("");
  const [bookingEquipment, setBookingEquipment] = useState("");
  const [bookingDate, setBookingDate] = useState("");
  const [bookingNotes, setBookingNotes] = useState("");
  const [bookingSubmitting, setBookingSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState<bigint | null>(null);
  const [bookingError, setBookingError] = useState("");

  // Status check state
  const [statusMobile, setStatusMobile] = useState("");
  const [statusLoading, setStatusLoading] = useState(false);
  const [statusResults, setStatusResults] = useState<BookingWithId[] | null>(
    null,
  );
  const [statusError, setStatusError] = useState("");

  const { actor } = useActor();

  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMobileMenuOpen(false);
  }

  async function handleBookingSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!bookingName.trim() || !bookingMobile.trim() || !bookingService) {
      setBookingError("Please fill in all required fields.");
      return;
    }
    if (!actor) {
      setBookingError("Service temporarily unavailable. Please try again.");
      return;
    }
    setBookingSubmitting(true);
    setBookingError("");
    try {
      const record: BookingRecord = {
        customerName: bookingName.trim(),
        customerMobile: bookingMobile.trim(),
        serviceType: bookingService,
        equipmentDetails: bookingEquipment.trim(),
        preferredDate: bookingDate,
        notes: bookingNotes.trim(),
        bookingStatus: "pending",
        createdAt: BigInt(Date.now()),
      };
      const id = await actor.createBooking(record);
      setBookingSuccess(id);
      setBookingName("");
      setBookingMobile("");
      setBookingService("");
      setBookingEquipment("");
      setBookingDate("");
      setBookingNotes("");
    } catch {
      setBookingError("Failed to submit booking. Please try WhatsApp instead.");
    } finally {
      setBookingSubmitting(false);
    }
  }

  async function handleStatusCheck(e: React.FormEvent) {
    e.preventDefault();
    if (!statusMobile.trim()) return;
    if (!actor) {
      setStatusError("Service temporarily unavailable. Please try again.");
      return;
    }
    setStatusLoading(true);
    setStatusError("");
    setStatusResults(null);
    try {
      const results = await actor.getBookingsByMobile(statusMobile.trim());
      setStatusResults(results as BookingWithId[]);
    } catch {
      setStatusError("Failed to fetch bookings. Please try again.");
    } finally {
      setStatusLoading(false);
    }
  }

  const navItems = [
    { label: "Home", id: "home" },
    { label: "Services", id: "services" },
    { label: "Why Us", id: "why-us" },
    { label: "Book Repair", id: "booking" },
    { label: "Check Status", id: "check-status" },
    { label: "Contact", id: "contact" },
  ];

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
            <img
              src="/logo-icon.svg"
              alt="CF Sports Repair icon"
              className="h-10 w-10 flex-shrink-0"
            />
            <span
              className="font-extrabold text-lg leading-tight hidden sm:block"
              style={{
                background: "linear-gradient(135deg,#1565C0,#0097A7,#43A047)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              CF Sports
              <br />
              <span
                className="text-sm font-bold tracking-widest"
                style={{
                  background: "linear-gradient(135deg,#0097A7,#43A047)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                REPAIR
              </span>
            </span>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-5">
            {navItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => scrollTo(item.id)}
                data-ocid={`nav.${item.id.replace(/-/g, "_")}.link`}
                className="text-sm font-medium text-[#374151] hover:text-[#0B5E86] transition-colors"
              >
                {item.label}
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

          {/* Desktop Admin Login */}
          <button
            type="button"
            onClick={() => {
              window.location.hash = "admin";
            }}
            data-ocid="nav.admin_login.button"
            className="hidden md:inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium border border-[#0B5E86] text-[#0B5E86] hover:bg-[#0B5E86] hover:text-white transition-all"
          >
            <Lock className="h-3.5 w-3.5" />
            Admin Login
          </button>

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
            {navItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => scrollTo(item.id)}
                className="block w-full text-left text-sm font-medium text-[#374151] py-1.5"
              >
                {item.label}
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
            <button
              type="button"
              onClick={() => {
                window.location.hash = "admin";
                setMobileMenuOpen(false);
              }}
              data-ocid="nav.mobile_admin_login.button"
              className="flex items-center gap-2 w-full text-left px-4 py-2.5 rounded-full text-sm font-medium border border-[#0B5E86] text-[#0B5E86] hover:bg-[#0B5E86] hover:text-white transition-all"
            >
              <Lock className="h-3.5 w-3.5" />
              Admin Login
            </button>
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
            {/* Hero logo — full CF Sports Repair brand mark */}
            <div className="mb-7 flex justify-center lg:justify-start">
              <img
                src="/logo.svg"
                alt="CF Sports Repair"
                className="w-auto drop-shadow-lg"
                style={{ height: "80px", maxWidth: "320px" }}
              />
            </div>
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
              <button
                type="button"
                onClick={() => scrollTo("booking")}
                data-ocid="hero.book_repair.button"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-bold text-white shadow-lg transition-all hover:opacity-90 hover:shadow-xl hover:-translate-y-0.5"
                style={{ background: "#2FAE5E" }}
              >
                <CalendarCheck className="h-4 w-4" />
                Book a Repair
              </button>
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
                  <img
                    src="/logo-icon.svg"
                    alt="CF Sports Repair Logo"
                    className="w-44 h-44 object-contain"
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
                <button
                  type="button"
                  onClick={() => scrollTo("booking")}
                  className="inline-flex items-center gap-1 text-xs font-semibold mt-4 transition-colors hover:opacity-80"
                  style={{ color: "#2FAE5E" }}
                >
                  Book This Service →
                </button>
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

      {/* ═══════════════════════════════ BOOKING FORM ═══════════════════════════════ */}
      <section id="booking" className="py-20" style={{ background: "#F3F6F9" }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <p
              className="text-xs font-bold uppercase tracking-[0.2em] mb-3"
              style={{ color: "#2FAE5E" }}
            >
              Schedule a Repair
            </p>
            <h2
              className="text-3xl sm:text-4xl font-black uppercase"
              style={{ color: "#0B5E86" }}
            >
              Book Your Repair Online
            </h2>
            <div
              className="mx-auto mt-4 h-1 w-16 rounded-full"
              style={{ background: "linear-gradient(90deg, #0B5E86, #2FAE5E)" }}
            />
            <p className="mt-4 text-[#6B7280] text-sm">
              Fill in the form below and we'll confirm your booking shortly.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="bg-white rounded-2xl shadow-lg border border-[#E5E7EB] p-8"
            data-ocid="booking.panel"
          >
            {bookingSuccess !== null ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8"
                data-ocid="booking.success_state"
              >
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{ background: "#e8f5ee" }}
                >
                  <CheckCircle
                    className="h-8 w-8"
                    style={{ color: "#2FAE5E" }}
                  />
                </div>
                <h3
                  className="text-xl font-bold mb-2"
                  style={{ color: "#111827" }}
                >
                  Booking Submitted!
                </h3>
                <p className="text-[#374151] mb-1">
                  Your booking ID is{" "}
                  <span className="font-bold" style={{ color: "#0B5E86" }}>
                    #{String(bookingSuccess).padStart(4, "0")}
                  </span>
                </p>
                <p className="text-sm text-[#6B7280] mb-6">
                  Use your mobile number below to check status.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    type="button"
                    onClick={() => {
                      setBookingSuccess(null);
                    }}
                    className="px-6 py-2.5 rounded-full text-sm font-semibold border-2 transition-all hover:bg-[#f3f6f9]"
                    style={{ borderColor: "#0B5E86", color: "#0B5E86" }}
                  >
                    Book Another Repair
                  </button>
                  <button
                    type="button"
                    onClick={() => scrollTo("check-status")}
                    className="px-6 py-2.5 rounded-full text-sm font-semibold text-white transition-all hover:opacity-90"
                    style={{ background: "#2FAE5E" }}
                    data-ocid="booking.check_status.button"
                  >
                    Check Booking Status
                  </button>
                </div>
              </motion.div>
            ) : (
              <form
                onSubmit={handleBookingSubmit}
                className="space-y-5"
                data-ocid="booking.section"
              >
                <div className="grid sm:grid-cols-2 gap-5">
                  {/* Customer Name */}
                  <div>
                    <label
                      htmlFor="booking-name"
                      className="block text-sm font-semibold text-[#374151] mb-1.5"
                    >
                      Customer Name <span style={{ color: "#E53E3E" }}>*</span>
                    </label>
                    <input
                      id="booking-name"
                      type="text"
                      required
                      value={bookingName}
                      onChange={(e) => setBookingName(e.target.value)}
                      placeholder="Your full name"
                      data-ocid="booking.input"
                      className="w-full px-4 py-2.5 rounded-xl border border-[#D1D5DB] text-sm text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#0B5E86]/30 focus:border-[#0B5E86] transition-all"
                    />
                  </div>
                  {/* Mobile */}
                  <div>
                    <label
                      htmlFor="booking-mobile"
                      className="block text-sm font-semibold text-[#374151] mb-1.5"
                    >
                      Mobile Number <span style={{ color: "#E53E3E" }}>*</span>
                    </label>
                    <input
                      id="booking-mobile"
                      type="tel"
                      required
                      value={bookingMobile}
                      onChange={(e) => setBookingMobile(e.target.value)}
                      placeholder="10-digit mobile number"
                      data-ocid="booking.input"
                      className="w-full px-4 py-2.5 rounded-xl border border-[#D1D5DB] text-sm text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#0B5E86]/30 focus:border-[#0B5E86] transition-all"
                    />
                  </div>
                </div>

                {/* Service Type */}
                <div>
                  <label
                    htmlFor="booking-service"
                    className="block text-sm font-semibold text-[#374151] mb-1.5"
                  >
                    Service Type <span style={{ color: "#E53E3E" }}>*</span>
                  </label>
                  <select
                    id="booking-service"
                    required
                    value={bookingService}
                    onChange={(e) => setBookingService(e.target.value)}
                    data-ocid="booking.select"
                    className="w-full px-4 py-2.5 rounded-xl border border-[#D1D5DB] text-sm text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#0B5E86]/30 focus:border-[#0B5E86] transition-all bg-white"
                  >
                    <option value="">Select a service...</option>
                    {SERVICE_TYPES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Equipment Details */}
                <div>
                  <label
                    htmlFor="booking-equipment"
                    className="block text-sm font-semibold text-[#374151] mb-1.5"
                  >
                    Equipment Details
                  </label>
                  <input
                    id="booking-equipment"
                    type="text"
                    value={bookingEquipment}
                    onChange={(e) => setBookingEquipment(e.target.value)}
                    placeholder="e.g. Yonex Arcsaber 7 Pro"
                    data-ocid="booking.input"
                    className="w-full px-4 py-2.5 rounded-xl border border-[#D1D5DB] text-sm text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#0B5E86]/30 focus:border-[#0B5E86] transition-all"
                  />
                </div>

                {/* Preferred Date */}
                <div>
                  <label
                    htmlFor="booking-date"
                    className="block text-sm font-semibold text-[#374151] mb-1.5"
                  >
                    Preferred Date
                  </label>
                  <input
                    id="booking-date"
                    type="date"
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    data-ocid="booking.input"
                    className="w-full px-4 py-2.5 rounded-xl border border-[#D1D5DB] text-sm text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#0B5E86]/30 focus:border-[#0B5E86] transition-all"
                  />
                </div>

                {/* Notes */}
                <div>
                  <label
                    htmlFor="booking-notes"
                    className="block text-sm font-semibold text-[#374151] mb-1.5"
                  >
                    Notes / Special Instructions
                  </label>
                  <textarea
                    id="booking-notes"
                    value={bookingNotes}
                    onChange={(e) => setBookingNotes(e.target.value)}
                    placeholder="Any special requirements or details..."
                    rows={3}
                    data-ocid="booking.textarea"
                    className="w-full px-4 py-2.5 rounded-xl border border-[#D1D5DB] text-sm text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#0B5E86]/30 focus:border-[#0B5E86] transition-all resize-none"
                  />
                </div>

                {bookingError && (
                  <p
                    className="text-sm font-medium"
                    style={{ color: "#E53E3E" }}
                    data-ocid="booking.error_state"
                  >
                    {bookingError}
                  </p>
                )}

                <div className="flex flex-col sm:flex-row gap-3 pt-1">
                  <button
                    type="submit"
                    disabled={bookingSubmitting}
                    data-ocid="booking.submit_button"
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white shadow transition-all hover:opacity-90 disabled:opacity-60"
                    style={{
                      background:
                        "linear-gradient(135deg, #0B5E86 0%, #0E6F7A 100%)",
                    }}
                  >
                    {bookingSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <CalendarCheck className="h-4 w-4" />
                        Submit Booking Request
                      </>
                    )}
                  </button>
                  <a
                    href={WHATSAPP_URL}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
                    style={{ background: "#2FAE5E" }}
                  >
                    <MessageCircle className="h-4 w-4" />
                    WhatsApp Instead
                  </a>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════ CHECK STATUS ═══════════════════════════════ */}
      <section id="check-status" className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <p
              className="text-xs font-bold uppercase tracking-[0.2em] mb-3"
              style={{ color: "#2FAE5E" }}
            >
              Track Your Repair
            </p>
            <h2
              className="text-3xl sm:text-4xl font-black uppercase"
              style={{ color: "#0B5E86" }}
            >
              Check Your Booking Status
            </h2>
            <div
              className="mx-auto mt-4 h-1 w-16 rounded-full"
              style={{ background: "linear-gradient(90deg, #0B5E86, #2FAE5E)" }}
            />
            <p className="mt-4 text-[#6B7280] text-sm">
              Enter your mobile number to see your booking status.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <form
              onSubmit={handleStatusCheck}
              className="bg-white rounded-2xl shadow-lg border border-[#E5E7EB] p-8 mb-6"
              data-ocid="check_status.section"
            >
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="tel"
                  value={statusMobile}
                  onChange={(e) => setStatusMobile(e.target.value)}
                  placeholder="Enter your mobile number"
                  data-ocid="check_status.search_input"
                  required
                  className="flex-1 px-4 py-3 rounded-xl border border-[#D1D5DB] text-sm text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#0B5E86]/30 focus:border-[#0B5E86] transition-all"
                />
                <button
                  type="submit"
                  disabled={statusLoading}
                  data-ocid="check_status.primary_button"
                  className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 disabled:opacity-60 shrink-0"
                  style={{
                    background:
                      "linear-gradient(135deg, #0B5E86 0%, #0E6F7A 100%)",
                  }}
                >
                  {statusLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Search className="h-4 w-4" />
                  )}
                  Check Status
                </button>
              </div>
            </form>

            {statusError && (
              <p
                className="text-sm font-medium text-center mb-4"
                style={{ color: "#E53E3E" }}
                data-ocid="check_status.error_state"
              >
                {statusError}
              </p>
            )}

            {statusResults !== null && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                {statusResults.length === 0 ? (
                  <div
                    className="bg-white rounded-2xl shadow-lg border border-[#E5E7EB] p-10 text-center"
                    data-ocid="check_status.empty_state"
                  >
                    <div
                      className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
                      style={{ background: "#F3F6F9" }}
                    >
                      <Search className="h-6 w-6 text-[#9CA3AF]" />
                    </div>
                    <p className="font-semibold text-[#374151] mb-1">
                      No bookings found
                    </p>
                    <p className="text-sm text-[#6B7280]">
                      No bookings found for this number. Please check the number
                      and try again.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {statusResults.map((booking, i) => (
                      <motion.div
                        key={String(booking.id)}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.07 }}
                        data-ocid={`check_status.item.${i + 1}`}
                        className="bg-white rounded-2xl shadow-sm border border-[#E5E7EB] p-6"
                      >
                        <div className="flex items-start justify-between gap-4 flex-wrap">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span
                                className="font-bold text-base"
                                style={{ color: "#0B5E86" }}
                              >
                                #{String(booking.id).padStart(4, "0")}
                              </span>
                              {statusBadge(booking.bookingStatus)}
                            </div>
                            <p className="font-semibold text-[#111827]">
                              {booking.serviceType}
                            </p>
                            {booking.equipmentDetails && (
                              <p className="text-sm text-[#6B7280] mt-0.5">
                                {booking.equipmentDetails}
                              </p>
                            )}
                          </div>
                          {booking.preferredDate && (
                            <div className="text-right shrink-0">
                              <p className="text-xs text-[#9CA3AF] mb-0.5">
                                Preferred Date
                              </p>
                              <p className="text-sm font-semibold text-[#374151]">
                                {formatDate(booking.preferredDate)}
                              </p>
                            </div>
                          )}
                        </div>
                        {booking.notes && (
                          <p className="mt-3 text-xs text-[#6B7280] border-t border-[#E5E7EB] pt-3">
                            Note: {booking.notes}
                          </p>
                        )}
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
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
                +91 94407 90818
              </span>
            </a>
            {/* Contact pills */}
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <div
                className="flex items-center gap-2 px-4 py-2 rounded-full text-sm text-white/80"
                style={{ background: "rgba(255,255,255,0.1)" }}
              >
                <Phone className="h-4 w-4" />
                +91 94407 90818
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
                <img
                  src="/logo-icon.svg"
                  alt="CF Sports Repair"
                  className="w-10 h-10"
                />
                <span className="font-bold text-white text-base">
                  CF Sports Repair
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
                            : link.href === "#check-status"
                              ? "check-status"
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
                  +91 94407 90818
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
              © {new Date().getFullYear()} CF Sports Repair. Built with love
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
              className="text-white/60 hover:text-white transition-colors text-xs bg-transparent border-none cursor-pointer p-0 flex items-center gap-1"
            >
              <Lock className="h-3 w-3" />
              Admin Login
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
