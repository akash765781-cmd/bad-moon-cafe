import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  AlertCircle,
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  Coffee,
  Menu as MenuIcon,
  Phone,
  Search,
  ShoppingBag,
  Sparkles,
  User,
  Users,
  X,
} from "lucide-react";
import { CAFE } from "@/lib/cafe";
import { cn } from "@/lib/utils";
import { trackFormSubmission } from "@/lib/analytics";
import { TrackOrderModal } from "./TrackOrderModal";


const LINKS = [

  { label: "Home", href: "/#" },
  { label: "About", href: "/#about" },
  { label: "Menu", href: "/#menu" },
  { label: "Gallery", href: "/#gallery" },
  { label: "Reviews", href: "/#reviews" },
  { label: "Contact", href: "/#contact" },
];

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  date?: string;
}


interface FormTouched {
  name?: boolean;
  email?: boolean;
  phone?: boolean;
  date?: boolean;
}

export function SiteNav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showTrackModal, setShowTrackModal] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [touched, setTouched] = useState<FormTouched>({});
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    time: "18:00",
    guests: "2",
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Real-time single field validator
  const validateField = (name: string, value: string): string => {
    switch (name) {
      case "name":
        if (!value.trim()) return "Full name is required.";
        if (value.trim().length < 2) return "Name must be at least 2 characters.";
        return "";
      case "phone": {
        const cleanPhone = value.replace(/[\s\-\(\)]/g, "");
        if (!value.trim()) return "Mobile number is required.";
        if (!/^\+?[0-9]{10,15}$/.test(cleanPhone)) return "Invalid Mobile: Enter a valid 10-digit number (e.g. 9876543210).";
        return "";
      }
      case "email":
        if (!value.trim()) return "Email address is required.";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim())) return "Invalid Email: Format must be name@example.com.";
        return "";
      case "date": {
        if (!value) return "Reservation date is required.";

        const booking = new Date(value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (isNaN(booking.getTime()) || booking < today) return "Invalid Date: Reservation date cannot be in the past.";
        return "";
      }
      default:
        return "";
    }
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    const nextFormData = { ...formData, [field]: value };
    setFormData(nextFormData);

    // Live validation if touched or already attempted submit
    const isFieldTouched = field === "name" ? touched.name : field === "phone" ? touched.phone : field === "email" ? touched.email : field === "date" ? touched.date : false;

    if (isFieldTouched || submitAttempted) {
      const errorMsg = validateField(field, value);
      setFormErrors((prev) => ({
        ...prev,
        [field]: errorMsg || undefined,
      }));
    }
  };

  const handleBlur = (field: keyof typeof formData) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const errorMsg = validateField(field, formData[field]);
    setFormErrors((prev) => ({
      ...prev,
      [field]: errorMsg || undefined,
    }));
  };

  // Full form validator on submit
  const validateAll = () => {
    const errors: FormErrors = {};
    const nErr = validateField("name", formData.name);
    if (nErr) errors.name = nErr;
    const pErr = validateField("phone", formData.phone);
    if (pErr) errors.phone = pErr;
    const eErr = validateField("email", formData.email);
    if (eErr) errors.email = eErr;
    const dateErr = validateField("date", formData.date);
    if (dateErr) errors.date = dateErr;

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitAttempted(true);
    setTouched({
      name: true,
      email: true,
      phone: true,
      date: true,
    });

    if (!validateAll()) {
      return;
    }

    // Track Form Submission for Admin Panel
    trackFormSubmission({
      type: "reservation",
      name: formData.name.trim(),
      phone: formData.phone.trim(),
      email: formData.email.trim(),
      details: {
        date: formData.date,
        time: formData.time || "18:00",
        guests: formData.guests || "2",
      },
    });

    setBookingSuccess(true);
    setTimeout(() => {
      setBookingSuccess(false);
      setShowBookingModal(false);
      setFormData({
        name: "",
        email: "",
        phone: "",
        date: "",
        time: "18:00",
        guests: "2",
      });
      setFormErrors({});
      setTouched({});
      setSubmitAttempted(false);
    }, 2200);
  };





  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 transition-all duration-300",
          scrolled
            ? "border-b border-caramel/20 bg-[#0d0a08]/92 shadow-[0_4px_30px_rgba(0,0,0,0.8)] backdrop-blur-md"
            : "bg-transparent",
        )}
      >
        <div className="mx-auto flex h-20 w-full max-w-[1280px] items-center justify-between px-5 sm:px-8">
          {/* Logo */}
          <Link
            to="/"
            className="group flex items-center gap-3"
            aria-label={`${CAFE.name} — home`}
          >
            <div className="flex size-10 items-center justify-center rounded-full border border-caramel/40 bg-caramel/10 text-caramel transition-transform duration-300 group-hover:scale-105">
              <Coffee className="size-5" />
            </div>
            <div>
              <span className="font-serif text-xl font-medium tracking-tight text-white sm:text-2xl">
                {CAFE.name}
              </span>
              <span className="block text-[0.625rem] font-semibold tracking-[0.24em] text-caramel/90">
                {CAFE.tagline}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav aria-label="Main" className="hidden items-center gap-8 lg:flex">
            {LINKS.map((l) => (
              <a
                key={l.label}
                href={l.href}
                className="text-sm font-medium text-stone-300 transition-colors hover:text-caramel"
              >
                {l.label}
              </a>
            ))}
          </nav>

          {/* Action CTAs */}
          <div className="hidden items-center gap-3 sm:flex">
            <button
              type="button"
              onClick={() => setShowTrackModal(true)}
              className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-full border border-caramel/50 bg-[#16110e] px-4 text-xs font-semibold text-caramel transition-all duration-300 hover:border-caramel hover:bg-caramel hover:text-espresso shadow-md active:scale-[0.98]"
              title="Track or Cancel your order"
            >
              <Search className="size-3.5" />
              <span>Track Order</span>
            </button>

            <button
              type="button"
              onClick={() => setShowBookingModal(true)}
              className="inline-flex min-h-10 items-center justify-center rounded-full bg-caramel px-5 text-xs font-semibold text-espresso shadow-[0_4px_18px_rgba(200,147,85,0.35)] transition-all duration-300 hover:bg-caramel-hover hover:shadow-[0_6px_22px_rgba(200,147,85,0.5)] hover:scale-[1.02] active:scale-[0.98]"
            >
              Book a Table
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            className="inline-flex size-10 items-center justify-center rounded-lg border border-caramel/20 bg-[#16110e] text-caramel hover:border-caramel/40 lg:hidden"
          >
            {open ? <X className="size-5" /> : <MenuIcon className="size-5" />}
            <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        {open && (
          <nav
            id="mobile-nav"
            aria-label="Mobile"
            className="border-b border-caramel/20 bg-[#0d0a08]/98 px-5 pb-6 pt-2 backdrop-blur-xl lg:hidden"
          >
            <ul className="divide-y divide-stone-800/80">
              {LINKS.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="flex min-h-12 items-center font-serif text-lg text-stone-200 transition-colors hover:text-caramel"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
              <li className="pt-4 space-y-2">
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    setShowTrackModal(true);
                  }}
                  className="w-full flex items-center justify-center gap-2 rounded-full border border-caramel/50 bg-[#16110e] py-3 text-center text-sm font-semibold text-caramel"
                >
                  <Search className="size-4" />
                  <span>Track / Cancel Order</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    setShowBookingModal(true);
                  }}
                  className="w-full rounded-full bg-caramel py-3 text-center text-sm font-semibold text-espresso"
                >
                  Book a Table
                </button>
              </li>
            </ul>
          </nav>
        )}
      </header>

      {/* Track Order Modal */}
      <TrackOrderModal
        isOpen={showTrackModal}
        onClose={() => setShowTrackModal(false)}
      />


      {/* Book a Table Interactive Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-2xl border border-caramel/30 bg-[#140f0c] p-6 text-white shadow-2xl sm:p-8">
            <button
              onClick={() => setShowBookingModal(false)}
              className="absolute right-4 top-4 rounded-full p-2 text-stone-400 transition-colors hover:bg-stone-800 hover:text-white"
              aria-label="Close modal"
            >
              <X className="size-5" />
            </button>

            {bookingSuccess ? (
              <div className="py-10 text-center">
                <CheckCircle2 className="mx-auto size-16 text-emerald-400 animate-bounce" />
                <h3 className="mt-4 font-serif text-2xl text-white">Table Reserved!</h3>
                <p className="mt-2 text-sm text-stone-300">
                  We look forward to welcoming you to {CAFE.name}. A confirmation has been sent to your email.
                </p>
              </div>
            ) : (
              <div>
                <p className="font-script text-3xl text-caramel">Reserve a Spot</p>
                <h3 className="font-serif text-2xl text-white sm:text-3xl">Book a Table</h3>
                <p className="mt-1 text-xs text-stone-400">
                  Enjoy cozy ambience and freshly brewed coffee with friends or family.
                </p>

                <form onSubmit={handleBookingSubmit} className="mt-6 space-y-4">
                  {/* Top Alert Banner if errors exist upon submit attempt */}
                  {submitAttempted && Object.keys(formErrors).length > 0 && (
                    <div className="flex items-start gap-2.5 rounded-xl border border-rose-500/60 bg-rose-950/40 p-3.5 text-xs text-rose-200 shadow-[0_0_15px_rgba(244,63,94,0.2)] animate-in fade-in duration-200">
                      <AlertCircle className="size-4 shrink-0 text-rose-400 mt-0.5" />
                      <div>
                        <p className="font-semibold text-rose-300">Please correct the highlighted errors:</p>
                        <p className="mt-0.5 text-[0.7rem] text-rose-200/80">Make sure all compulsory fields are filled correctly.</p>

                      </div>
                    </div>
                  )}

                  {/* 1. Full Name & Mobile Number */}
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <div className="flex items-center justify-between">
                        <label className="block text-xs font-medium text-stone-300">
                          Full Name <span className="text-rose-400 font-bold">*</span>
                        </label>
                        {touched.name && !formErrors.name && formData.name.trim() && (
                          <span className="flex items-center gap-1 text-[0.65rem] font-medium text-emerald-400">
                            <Check className="size-3" /> Valid
                          </span>
                        )}
                      </div>
                      <div
                        className={`mt-1 flex items-center rounded-lg border px-3 py-2 transition-all ${
                          formErrors.name
                            ? "border-rose-500 bg-rose-950/20 shadow-[0_0_8px_rgba(244,63,94,0.3)]"
                            : touched.name && formData.name.trim()
                            ? "border-emerald-500/60 bg-[#1c1511]"
                            : "border-stone-700/80 bg-[#1c1511]"
                        }`}
                      >
                        <User className={`mr-2 size-4 ${formErrors.name ? "text-rose-400" : "text-caramel"}`} />
                        <input
                          type="text"
                          required
                          placeholder="Akash Deep"
                          value={formData.name}
                          onChange={(e) => handleInputChange("name", e.target.value)}
                          onBlur={() => handleBlur("name")}
                          className="w-full bg-transparent text-sm text-white focus:outline-none placeholder:text-stone-500"
                        />
                      </div>
                      {formErrors.name && (
                        <p className="mt-1 flex items-center gap-1 text-[0.7rem] font-medium text-rose-400 animate-in fade-in">
                          <AlertCircle className="size-3.5 shrink-0" />
                          <span>{formErrors.name}</span>
                        </p>
                      )}
                    </div>

                    <div>
                      <div className="flex items-center justify-between">
                        <label className="block text-xs font-medium text-stone-300">
                          Mobile Number <span className="text-rose-400 font-bold">*</span>
                        </label>
                        {touched.phone && !formErrors.phone && formData.phone.trim() && (
                          <span className="flex items-center gap-1 text-[0.65rem] font-medium text-emerald-400">
                            <Check className="size-3" /> Valid
                          </span>
                        )}
                      </div>
                      <div
                        className={`mt-1 flex items-center rounded-lg border px-3 py-2 transition-all ${
                          formErrors.phone
                            ? "border-rose-500 bg-rose-950/20 shadow-[0_0_8px_rgba(244,63,94,0.3)]"
                            : touched.phone && formData.phone.trim()
                            ? "border-emerald-500/60 bg-[#1c1511]"
                            : "border-stone-700/80 bg-[#1c1511]"
                        }`}
                      >
                        <Phone className={`mr-2 size-4 ${formErrors.phone ? "text-rose-400" : "text-caramel"}`} />
                        <input
                          type="tel"
                          required
                          placeholder="9876543210"
                          value={formData.phone}
                          onChange={(e) => handleInputChange("phone", e.target.value)}
                          onBlur={() => handleBlur("phone")}
                          className="w-full bg-transparent text-sm text-white focus:outline-none placeholder:text-stone-500"
                        />
                      </div>
                      {formErrors.phone && (
                        <p className="mt-1 flex items-center gap-1 text-[0.7rem] font-medium text-rose-400 animate-in fade-in">
                          <AlertCircle className="size-3.5 shrink-0" />
                          <span>{formErrors.phone}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  {/* 2. Email Address */}
                  <div>
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-medium text-stone-300">
                        Email Address <span className="text-rose-400 font-bold">*</span>
                      </label>
                      {touched.email && !formErrors.email && formData.email.trim() && (
                        <span className="flex items-center gap-1 text-[0.65rem] font-medium text-emerald-400">
                          <Check className="size-3" /> Valid
                        </span>
                      )}
                    </div>
                    <div
                      className={`mt-1 flex items-center rounded-lg border px-3 py-2 transition-all ${
                        formErrors.email
                          ? "border-rose-500 bg-rose-950/20 shadow-[0_0_8px_rgba(244,63,94,0.3)]"
                          : touched.email && formData.email.trim()
                          ? "border-emerald-500/60 bg-[#1c1511]"
                          : "border-stone-700/80 bg-[#1c1511]"
                      }`}
                    >
                      <input
                        type="email"
                        required
                        placeholder="akash@example.com"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        onBlur={() => handleBlur("email")}
                        className="w-full bg-transparent text-sm text-white focus:outline-none placeholder:text-stone-500"
                      />
                    </div>
                    {formErrors.email && (
                      <p className="mt-1 flex items-center gap-1 text-[0.7rem] font-medium text-rose-400 animate-in fade-in">
                        <AlertCircle className="size-3.5 shrink-0" />
                        <span>{formErrors.email}</span>
                      </p>
                    )}
                  </div>


                  {/* 3. Reservation Date, Time & Guests */}
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div>
                      <div className="flex items-center justify-between">
                        <label className="block text-xs font-medium text-stone-300">
                          Booking Date <span className="text-rose-400 font-bold">*</span>
                        </label>
                        {touched.date && !formErrors.date && formData.date && (
                          <span className="flex items-center gap-1 text-[0.65rem] font-medium text-emerald-400">
                            <Check className="size-3" /> Valid
                          </span>
                        )}
                      </div>
                      <div
                        className={`mt-1 flex items-center rounded-lg border px-3 py-2 transition-all ${
                          formErrors.date
                            ? "border-rose-500 bg-rose-950/20 shadow-[0_0_8px_rgba(244,63,94,0.3)]"
                            : touched.date && formData.date
                            ? "border-emerald-500/60 bg-[#1c1511]"
                            : "border-stone-700/80 bg-[#1c1511]"
                        }`}
                      >
                        <Calendar className={`mr-2 size-4 ${formErrors.date ? "text-rose-400" : "text-caramel"}`} />
                        <input
                          type="date"
                          required
                          value={formData.date}
                          onChange={(e) => handleInputChange("date", e.target.value)}
                          onBlur={() => handleBlur("date")}
                          className="w-full bg-transparent text-xs text-white focus:outline-none"
                        />
                      </div>
                      {formErrors.date && (
                        <p className="mt-1 flex items-center gap-1 text-[0.7rem] font-medium text-rose-400 animate-in fade-in">
                          <AlertCircle className="size-3.5 shrink-0" />
                          <span>{formErrors.date}</span>
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-stone-300">
                        Time <span className="text-rose-400 font-bold">*</span>
                      </label>
                      <div className="mt-1 flex items-center rounded-lg border border-stone-700/80 bg-[#1c1511] px-3 py-2">
                        <Clock className="mr-2 size-4 text-caramel" />
                        <input
                          type="time"
                          required
                          value={formData.time}
                          onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                          className="w-full bg-transparent text-xs text-white focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-stone-300">
                        Guests <span className="text-rose-400 font-bold">*</span>
                      </label>
                      <div className="mt-1 flex items-center rounded-lg border border-stone-700/80 bg-[#1c1511] px-3 py-2">
                        <Users className="mr-2 size-4 text-caramel" />
                        <select
                          value={formData.guests}
                          onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
                          className="w-full bg-transparent text-xs text-white focus:outline-none"
                        >
                          <option value="1" className="bg-[#1c1511]">1 Person</option>
                          <option value="2" className="bg-[#1c1511]">2 People</option>
                          <option value="3" className="bg-[#1c1511]">3 People</option>
                          <option value="4" className="bg-[#1c1511]">4 People</option>
                          <option value="5+" className="bg-[#1c1511]">5+ People</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="mt-6 w-full rounded-full bg-caramel py-3 font-semibold text-espresso shadow-[0_4px_20px_rgba(200,147,85,0.4)] transition-all hover:bg-caramel-hover hover:shadow-[0_6px_25px_rgba(200,147,85,0.6)] active:scale-[0.99]"
                  >
                    Confirm Table Reservation
                  </button>
                </form>

              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export function MobileActionBar() {
  const [showTrack, setShowTrack] = useState(false);

  return (
    <>
      <nav
        aria-label="Quick actions"
        className="fixed bottom-0 left-0 right-0 z-50 grid grid-cols-4 border-t border-caramel/20 bg-[#0d0a08]/95 shadow-[0_-4px_25px_rgba(0,0,0,0.8)] backdrop-blur-lg sm:hidden"
      >
        <Link
          to="/menu"
          className="flex min-h-14 flex-col items-center justify-center gap-1 text-[0.65rem] font-bold uppercase tracking-[0.1em] text-stone-300 transition-colors hover:text-caramel"
        >
          <Coffee className="size-4 text-caramel" aria-hidden="true" />
          Menu
        </Link>
        <button
          type="button"
          onClick={() => setShowTrack(true)}
          className="flex min-h-14 flex-col items-center justify-center gap-1 border-l border-stone-800/80 text-[0.65rem] font-bold uppercase tracking-[0.1em] text-stone-300 transition-colors hover:text-caramel"
        >
          <Search className="size-4 text-caramel" aria-hidden="true" />
          Track
        </button>
        <a
          href={CAFE.directionsUrl}
          target="_blank"
          rel="noreferrer noopener"
          className="flex min-h-14 flex-col items-center justify-center gap-1 border-x border-stone-800/80 text-[0.65rem] font-bold uppercase tracking-[0.1em] text-stone-300 transition-colors hover:text-caramel"
        >
          <Sparkles className="size-4 text-caramel" aria-hidden="true" />
          Visit
        </a>
        <Link
          to="/"
          hash="about"
          className="flex min-h-14 flex-col items-center justify-center bg-caramel text-[0.65rem] font-bold uppercase tracking-[0.1em] text-espresso shadow-[0_0_20px_rgba(200,147,85,0.4)]"
        >
          About
        </Link>
      </nav>

      <TrackOrderModal isOpen={showTrack} onClose={() => setShowTrack(false)} />
    </>
  );
}

