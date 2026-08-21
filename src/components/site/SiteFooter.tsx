import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Check, Clock, Coffee, Facebook, Instagram, Loader2, Lock, Mail, MapPin, Phone, ShieldCheck } from "lucide-react";
import { CAFE } from "@/lib/cafe";
import { trackFormSubmission } from "@/lib/analytics";

export function SiteFooter() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address");
      return;
    }
    setError(null);
    setLoading(true);

    // Save to Admin Analytics
    trackFormSubmission({
      type: "newsletter",
      name: email.split("@")[0] || "Subscriber",
      email: email.trim(),
      details: { source: "Footer Newsletter Form" },
    });

    setTimeout(() => {
      setLoading(false);
      setSubscribed(true);
      setEmail("");
      setTimeout(() => {
        setSubscribed(false);
      }, 6000);
    }, 600);
  };

  return (
    <footer id="contact" className="relative border-t border-caramel/20 bg-[#0a0806] text-stone-300">
      {/* 4-Item Quick Contact Bar from Screenshot */}
      <div className="border-b border-caramel/15 bg-[#120d0a] px-5 py-10 sm:px-8">
        <div className="mx-auto grid max-w-[1280px] grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Visit Us */}
          <div className="flex items-start gap-4">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-full border border-caramel/30 bg-caramel/10 text-caramel">
              <MapPin className="size-5" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-caramel">Visit Us</p>
              <p className="mt-1 text-sm text-stone-300">
                <a
                  href={CAFE.directionsUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="hover:text-caramel transition-colors"
                >
                  {CAFE.address.line1},<br />
                  {CAFE.address.line2}, {CAFE.address.city}
                </a>
              </p>
            </div>
          </div>

          {/* Opening Hours */}
          <div className="flex items-start gap-4">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-full border border-caramel/30 bg-caramel/10 text-caramel">
              <Clock className="size-5" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-caramel">Opening Hours</p>
              <p className="mt-1 text-sm text-stone-300">
                Mon – Sun<br />
                8:00 AM – 10:00 PM
              </p>
            </div>
          </div>

          {/* Call Us */}
          <div className="flex items-start gap-4">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-full border border-caramel/30 bg-caramel/10 text-caramel">
              <Phone className="size-5" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-caramel">Call Us</p>
              <p className="mt-1 text-sm text-stone-300">
                <a href={`tel:${CAFE.phoneRaw ?? CAFE.phone}`} className="hover:text-caramel transition-colors">
                  {CAFE.phone}
                </a>
              </p>
            </div>
          </div>

          {/* Email Us */}
          <div className="flex items-start gap-4">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-full border border-caramel/30 bg-caramel/10 text-caramel">
              <Mail className="size-5" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-caramel">Email Us</p>
              <p className="mt-1 text-sm text-stone-300">
                <a href={`mailto:${CAFE.email}`} className="hover:text-caramel transition-colors">
                  {CAFE.email}
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Brand info */}
      <div className="mx-auto max-w-[1280px] px-5 py-14 sm:px-8">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-full border border-caramel/40 bg-caramel/10 text-caramel">
                <Coffee className="size-4" />
              </div>
              <p className="font-serif text-2xl text-white">
                {CAFE.name}
              </p>
            </div>
            <p className="mt-4 text-xs font-semibold tracking-widest text-caramel">{CAFE.tagline}</p>
            <p className="mt-3 text-sm leading-relaxed text-stone-400">
              Where every cup is crafted with passion and every moment feels like home. Step into warmth and aroma.
            </p>

            {/* Social Media Pills in Brand Column */}
            <div className="mt-5 flex items-center gap-2.5">
              <a
                href={CAFE.socials.instagram.url}
                target="_blank"
                rel="noreferrer noopener"
                className="flex size-8 items-center justify-center rounded-full border border-caramel/30 bg-[#16110e] text-caramel transition-all hover:bg-caramel hover:text-espresso hover:scale-110"
                aria-label="Instagram @akash_d7631"
              >
                <Instagram className="size-4" />
              </a>
              <a
                href={CAFE.socials.facebook.url}
                target="_blank"
                rel="noreferrer noopener"
                className="flex size-8 items-center justify-center rounded-full border border-caramel/30 bg-[#16110e] text-caramel transition-all hover:bg-caramel hover:text-espresso hover:scale-110"
                aria-label="Facebook facebook.com"
              >
                <Facebook className="size-4" />
              </a>
            </div>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-caramel">Navigation</p>
            <ul className="mt-5 space-y-2.5 text-sm text-stone-400">
              <li>
                <Link to="/" className="transition-colors hover:text-caramel">
                  Home
                </Link>
              </li>
              <li>
                <a href="/#about" className="transition-colors hover:text-caramel">
                  About Us
                </a>
              </li>
              <li>
                <Link to="/menu" className="transition-colors hover:text-caramel">
                  Our Menu
                </Link>
              </li>
              <li>
                <a href="/#gallery" className="transition-colors hover:text-caramel">
                  Gallery
                </a>
              </li>
              <li>
                <a href="/#reviews" className="transition-colors hover:text-caramel">
                  Reviews
                </a>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-caramel">Specialties</p>
            <ul className="mt-5 space-y-2.5 text-sm text-stone-400">
              <li className="hover:text-stone-200 transition-colors">Single Origin Espresso</li>
              <li className="hover:text-stone-200 transition-colors">Artisan Caramel Latte</li>
              <li className="hover:text-stone-200 transition-colors">Iced Chocolate Frappe</li>
              <li className="hover:text-stone-200 transition-colors">Fresh Berry Pancakes</li>
            </ul>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-caramel">Newsletter</p>
            <p className="mt-4 text-sm text-stone-400">
              Subscribe for exclusive secret menu releases, promotions, and brewing tips.
            </p>

            {subscribed ? (
              <div className="mt-4 flex items-center gap-2.5 rounded-2xl border border-emerald-500/40 bg-emerald-950/40 px-4 py-3 text-xs text-emerald-300 animate-in fade-in slide-in-from-bottom-2">
                <div className="flex size-5 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-black">
                  <Check className="size-3 stroke-[3]" />
                </div>
                <span>You're on the list! Welcome to {CAFE.name}.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="mt-4 space-y-2">
                <div className="flex gap-2">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (error) setError(null);
                    }}
                    placeholder="Enter your email"
                    className="w-full rounded-full border border-stone-700 bg-[#16110e] px-4 py-2 text-xs text-white placeholder:text-stone-500 focus:border-caramel focus:outline-none transition-colors"
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center justify-center min-w-[64px] rounded-full bg-caramel px-4 py-2 text-xs font-semibold text-espresso hover:bg-caramel-hover transition-all disabled:opacity-70 hover:scale-105 active:scale-95"
                  >
                    {loading ? <Loader2 className="size-3.5 animate-spin" /> : "Join"}
                  </button>
                </div>
                {error && (
                  <p className="text-[0.7rem] text-rose-400 pl-2">{error}</p>
                )}
              </form>
            )}
          </div>
        </div>

        {/* Bottom Bar with Social Links in the Center Empty Space */}
        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-stone-800/80 pt-8 text-xs text-stone-500 sm:flex-row">
          <p>© {new Date().getFullYear()} {CAFE.name} Cafe &amp; Coffee. All rights reserved.</p>

          {/* Social Links in the Center Space */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href={CAFE.socials.instagram.url}
              target="_blank"
              rel="noreferrer noopener"
              className="flex items-center gap-2 rounded-full border border-caramel/30 bg-[#16110e] px-3.5 py-1 text-xs text-stone-300 shadow-sm transition-all duration-300 hover:border-caramel hover:bg-caramel/15 hover:text-caramel hover:scale-105"
            >
              <Instagram className="size-3.5 text-caramel" />
              <span>{CAFE.socials.instagram.handle}</span>
            </a>
            <a
              href={CAFE.socials.facebook.url}
              target="_blank"
              rel="noreferrer noopener"
              className="flex items-center gap-2 rounded-full border border-caramel/30 bg-[#16110e] px-3.5 py-1 text-xs text-stone-300 shadow-sm transition-all duration-300 hover:border-caramel hover:bg-caramel/15 hover:text-caramel hover:scale-105"
            >
              <Facebook className="size-3.5 text-caramel" />
              <span>{CAFE.socials.facebook.handle}</span>
            </a>
          </div>

          <div className="flex items-center gap-4">
            <p>Handcrafted with Passion • London, UK</p>
            <span className="text-stone-700">|</span>
            <Link
              to="/admin"
              className="inline-flex items-center gap-1 text-stone-500 transition-colors hover:text-caramel"
              title="Staff & Admin Portal"
            >
              <Lock className="size-3 text-caramel/70" />
              <span>Admin Portal</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>

  );
}
