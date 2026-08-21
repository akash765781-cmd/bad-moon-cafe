import { Coffee, Lock, Mail, MapPin, Phone } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { CAFE } from "@/lib/cafe";

export function MaintenanceNotice() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-[#0a0705] px-4 py-12 text-white selection:bg-caramel/30 selection:text-white">
      {/* Ambient background glows */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/4 -translate-x-1/2 -translate-y-1/2 h-[450px] w-[450px] rounded-full bg-caramel/15 blur-[140px]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute bottom-10 right-1/4 h-72 w-72 rounded-full bg-amber-600/10 blur-[100px]"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto w-full max-w-xl text-center">
        {/* Animated Brand Icon */}
        <div className="relative mx-auto mb-6 flex size-20 items-center justify-center rounded-3xl border border-caramel/40 bg-gradient-to-br from-[#241a14] to-[#120d0a] shadow-[0_0_40px_rgba(200,147,85,0.25)]">
          <Coffee className="size-9 text-caramel animate-pulse" />
          <span className="absolute -bottom-1 -right-1 flex size-5 items-center justify-center rounded-full bg-rose-500 text-[0.65rem] font-bold text-white shadow-lg ring-2 ring-[#0a0705]">
            !
          </span>
        </div>

        {/* Offline Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-rose-500/40 bg-rose-950/40 px-4 py-1.5 text-xs font-semibold text-rose-300 shadow-[0_0_15px_rgba(244,63,94,0.2)] mb-4">
          <span className="size-2 rounded-full bg-rose-500 animate-ping" />
          <span>Site Offline (Under Maintenance)</span>
        </div>


        {/* Headings */}
        <h1 className="font-serif text-3xl font-bold tracking-tight text-white sm:text-5xl">
          We&apos;ll Be Right Back!
        </h1>
        <p className="mt-2 font-script text-2xl text-caramel sm:text-3xl">
          {CAFE.name}
        </p>

        <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-stone-300 sm:text-base">
          Our website is temporarily turned <strong>OFF</strong> by the administrator for scheduled maintenance. We are brewing something fresh and will be back online shortly!
        </p>

        {/* Contact info card while offline */}
        <div className="mt-8 rounded-2xl border border-stone-800 bg-[#140f0c]/90 p-5 text-left text-xs shadow-2xl backdrop-blur-md">
          <p className="text-[0.7rem] font-bold uppercase tracking-wider text-caramel">
            Need to reach us in the meantime?
          </p>

          <div className="mt-3.5 space-y-2.5 text-stone-300">
            <div className="flex items-center gap-3">
              <Phone className="size-4 text-caramel shrink-0" />
              <span>Call us: <a href={`tel:${CAFE.phone}`} className="text-white hover:underline font-semibold">{CAFE.phone}</a></span>
            </div>

            <div className="flex items-center gap-3">
              <Mail className="size-4 text-caramel shrink-0" />
              <span>Email: <a href={`mailto:${CAFE.email}`} className="text-white hover:underline font-semibold">{CAFE.email}</a></span>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="size-4 text-caramel shrink-0 mt-0.5" />
              <span>Address: {CAFE.address.line1}, {CAFE.address.line2}, {CAFE.address.city} {CAFE.address.postcode}</span>
            </div>

          </div>
        </div>

        {/* Admin Login Link */}
        <div className="mt-10 pt-6 border-t border-stone-800/80 flex items-center justify-center">
          <Link
            to="/admin"
            className="inline-flex items-center gap-2 rounded-full border border-stone-800 bg-[#16110e] px-4 py-2 text-xs font-medium text-stone-400 transition-all hover:border-caramel/50 hover:bg-[#1f1712] hover:text-white"
          >
            <Lock className="size-3.5 text-caramel" />
            <span>Admin Portal Login (Turn Site ON)</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
