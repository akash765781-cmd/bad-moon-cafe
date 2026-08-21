import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowRight,
  Check,
  Coffee,
  Crown,
  Heart,
  MapPin,
  Play,
  Plus,
  ShieldCheck,
  Smile,
  Sparkles,
  Star,
  Users,
  Utensils,
  X,
} from "lucide-react";
import { SiteFooter } from "@/components/site/SiteFooter";
import { MobileActionBar, SiteNav } from "@/components/site/SiteNav";
import { ReviewsSection } from "@/components/site/Reviews";
import { CtaLink, Reveal } from "@/components/site/ui";
import { CAFE, POPULAR_PICKS, MENU } from "@/lib/cafe";

import heroCupImg from "@/assets/hero-coffee-cup.jpg";
import comboImg from "@/assets/combo-coffee-cake.jpg";
import interiorImg from "@/assets/about-cafe-interior.jpg";
import topdownImg from "@/assets/about-latte-topdown.jpg";
import plantImg from "@/assets/about-plant-shadow.jpg";
import { OrderModal, type OrderItemPayload } from "@/components/site/OrderModal";

const TITLE = "Bad Moon Cafe — Cafe & Coffee | Good Coffee, Good Day";
const DESCRIPTION =
  "Step into Bad Moon Cafe, where every cup is crafted with passion and every moment feels like home. Premium coffee, fresh treats, and cozy vibes.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Home,
});

function Home() {
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [selectedOrderItem, setSelectedOrderItem] = useState<OrderItemPayload | null>(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [activeHeroSlide, setActiveHeroSlide] = useState(0);

  const handleOpenOrder = (item: { name: string; price?: string; description?: string }) => {
    setSelectedOrderItem({
      name: item.name,
      price: item.price || "£3.50",
      description: item.description || "",
    });
    setShowOrderModal(true);
  };

  return (
    <div className="min-h-screen bg-[#0d0a08] text-[#f5ede6] overflow-x-hidden pb-16 sm:pb-0">
      <SiteNav />


      {/* HERO SECTION - Exact Match from Screenshot */}
      <section className="relative overflow-hidden pt-6 pb-16 sm:pt-10 sm:pb-24 lg:pt-14 lg:pb-28">
        {/* Subtle warm amber ambient lighting */}
        <div
          className="pointer-events-none absolute left-1/4 top-10 h-[32rem] w-[32rem] rounded-full bg-caramel/10 blur-[130px]"
          aria-hidden="true"
        />

        <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
          <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-14">
            {/* Left Content */}
            <div className="z-10">
              <p className="font-script text-3xl text-caramel sm:text-4xl lg:text-[2.6rem]">
                Feel The Difference
              </p>

              <h1 className="mt-3 font-serif text-5xl font-normal leading-[1.08] tracking-tight text-white sm:text-6xl lg:text-[4.75rem]">
                Good Coffee
                <br />
                Good Day
              </h1>

              <p className="mt-6 max-w-lg text-base leading-relaxed text-stone-300 sm:text-lg">
                Step into Bad Moon Cafe, where every cup is crafted with passion and every
                moment feels like home.
              </p>

              <div className="mt-9 flex flex-wrap items-center gap-5">
                <CtaLink href="/menu" variant="caramel">
                  Explore Menu
                </CtaLink>

                <button
                  type="button"
                  onClick={() => setShowVideoModal(true)}
                  className="inline-flex items-center gap-3 text-sm font-medium text-stone-200 transition-all hover:text-caramel"
                >
                  <span className="flex size-10 items-center justify-center rounded-full border border-stone-600 bg-black/40 text-caramel transition-transform hover:scale-110 hover:border-caramel">
                    <Play className="size-4 fill-current ml-0.5" />
                  </span>
                  <span>Watch Our Story</span>
                </button>
              </div>

              {/* Carousel Indicators */}
              <div className="mt-12 flex items-center gap-2">
                {[0, 1, 2].map((i) => (
                  <button
                    key={i}
                    onClick={() => setActiveHeroSlide(i)}
                    aria-label={`Slide ${i + 1}`}
                    className={`h-2.5 rounded-full transition-all duration-300 ${
                      activeHeroSlide === i
                        ? "w-8 bg-caramel shadow-[0_0_10px_rgba(200,147,85,0.6)]"
                        : "w-2.5 bg-stone-700 hover:bg-stone-500"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Right Cinematic Hero Cup Image */}
            <div className="relative lg:pl-4">
              <div className="relative overflow-hidden rounded-3xl border border-caramel/20 p-2 shadow-[0_15px_50px_rgba(0,0,0,0.9)] bg-gradient-to-br from-caramel/15 via-transparent to-black/60">
                <img
                  src={heroCupImg}
                  alt="Hot cappuccino with rosette latte art on a wooden saucer with roasted coffee beans"
                  width={1200}
                  height={900}
                  className="aspect-[4/3] w-full rounded-2xl object-cover shadow-inner"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT US SECTION - "More Than Just a Coffee Shop" */}
      <section
        id="about"
        className="relative border-y border-caramel/15 bg-[#120d0a] py-20 sm:py-28"
      >
        {/* Botanical watermark background texture */}
        <div
          className="pointer-events-none absolute right-5 top-10 h-96 w-96 opacity-10 blur-sm"
          aria-hidden="true"
        />

        <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            {/* Left 3-Image Collage */}
            <div className="relative">
              {/* Main Interior Image */}
              <div className="overflow-hidden rounded-3xl border border-caramel/20 bg-[#1c1511] p-1.5 shadow-2xl">
                <img
                  src={interiorImg}
                  alt="Warm luxury cafe interior with wooden tables and amber lights"
                  width={900}
                  height={675}
                  loading="lazy"
                  className="aspect-[4/3] w-full rounded-2xl object-cover"
                />
              </div>

              {/* Top Right Latte Art Overlay */}
              <div className="absolute -top-6 -right-4 hidden w-44 overflow-hidden rounded-2xl border-4 border-[#120d0a] bg-[#1c1511] p-1 shadow-2xl sm:block lg:w-52">
                <img
                  src={topdownImg}
                  alt="Top-down view of latte art"
                  width={400}
                  height={400}
                  loading="lazy"
                  className="aspect-square w-full rounded-xl object-cover"
                />
              </div>

              {/* Bottom Right Eucalyptus Plant Overlay */}
              <div className="absolute -bottom-8 right-6 hidden w-36 overflow-hidden rounded-2xl border-4 border-[#120d0a] bg-[#1c1511] p-1 shadow-2xl sm:block lg:w-44">
                <img
                  src={plantImg}
                  alt="Minimalist plant shadow in vase"
                  width={400}
                  height={533}
                  loading="lazy"
                  className="aspect-[3/4] w-full rounded-xl object-cover"
                />
              </div>
            </div>

            {/* Right Story Content & Feature Points */}
            <div className="lg:pl-6">
              <p className="font-script text-3xl text-caramel sm:text-4xl">About Us</p>
              <h2 className="mt-2 font-serif text-3xl font-normal leading-[1.12] text-white sm:text-4xl lg:text-5xl">
                More Than Just
                <br />
                a Coffee Shop
              </h2>

              <p className="mt-5 text-base leading-relaxed text-stone-300 sm:text-lg">
                Bad Moon Cafe is a cozy escape from the ordinary. We serve premium coffee,
                delicious bites, and good vibes in every corner.
              </p>

              {/* Feature Points with Circular Icons */}
              <div className="mt-8 space-y-5">
                <div className="flex items-start gap-4">
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-full border border-caramel/40 bg-caramel/10 text-caramel shadow-[0_0_15px_rgba(200,147,85,0.2)]">
                    <Coffee className="size-5" />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-medium text-white">
                      Quality Coffee
                    </h3>
                    <p className="text-xs text-stone-400">Finest beans, expertly brewed</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-full border border-caramel/40 bg-caramel/10 text-caramel shadow-[0_0_15px_rgba(200,147,85,0.2)]">
                    <Sparkles className="size-5" />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-medium text-white">
                      Cozy Ambience
                    </h3>
                    <p className="text-xs text-stone-400">A warm place to relax</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-full border border-caramel/40 bg-caramel/10 text-caramel shadow-[0_0_15px_rgba(200,147,85,0.2)]">
                    <Smile className="size-5" />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-medium text-white">
                      Friendly Service
                    </h3>
                    <p className="text-xs text-stone-400">We treat you like family</p>
                  </div>
                </div>
              </div>

              <div className="mt-9 flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  onClick={() => setShowAboutModal(true)}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-caramel px-7 text-sm font-semibold text-espresso shadow-[0_4px_20px_rgba(200,147,85,0.3)] transition-all duration-300 hover:bg-caramel-hover hover:scale-[1.02] hover:shadow-[0_6px_25px_rgba(200,147,85,0.45)] active:scale-[0.98]"
                >
                  Learn More
                </button>
                <button
                  type="button"
                  onClick={() => setShowVideoModal(true)}
                  className="inline-flex items-center gap-2 text-xs font-semibold text-stone-300 transition-colors hover:text-caramel"
                >
                  <Play className="size-3.5 fill-current text-caramel" />
                  Watch Video Story
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* POPULAR PICKS SECTION - FULL DARK COFFEE THEME (NO WHITE BACKGROUND) */}
      <section id="menu" className="relative bg-[#0d0a08] py-20 sm:py-28">
        <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
          {/* Section Header */}
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="font-script text-3xl text-caramel sm:text-4xl">Our Menu</p>
              <h2 className="mt-1 font-serif text-3xl font-normal text-white sm:text-4xl lg:text-5xl">
                Popular Picks
              </h2>
              {/* Coffee bean icon divider line */}
              <div className="mt-3 flex items-center gap-3">
                <div className="h-px w-16 bg-caramel/40" />
                <Coffee className="size-4 text-caramel" />
                <div className="h-px w-16 bg-caramel/40" />
              </div>
            </div>

            <Link
              to="/menu"
              className="inline-flex items-center gap-2 text-sm font-semibold text-caramel transition-colors hover:text-caramel-hover"
            >
              View Full Menu
              <ArrowRight className="size-4" />
            </Link>
          </div>

          {/* 4 Cards Grid Matching Screenshot */}
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {POPULAR_PICKS.map((item) => (
              <div
                key={item.name}
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-caramel/20 bg-[#16110e] shadow-xl transition-all duration-300 hover:border-caramel/50 hover:bg-[#1c1511] hover:shadow-[0_10px_30px_rgba(0,0,0,0.8),0_0_20px_rgba(200,147,85,0.15)] hover:-translate-y-1.5"
              >
                {/* Crown Popular Badge */}
                <div className="absolute left-3 top-3 z-10 flex size-7 items-center justify-center rounded-full bg-black/60 text-caramel backdrop-blur-md border border-caramel/30">
                  <Crown className="size-3.5" />
                </div>

                {/* Product Image */}
                <div className="relative aspect-square overflow-hidden bg-stone-900">
                  <img
                    src={item.image}
                    alt={item.name}
                    width={500}
                    height={500}
                    loading="lazy"
                    className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                {/* Product Details */}
                <div className="flex flex-1 flex-col justify-between p-5">
                  <div>
                    <div className="flex items-baseline justify-between gap-2">
                      <h3 className="font-serif text-lg font-medium text-white group-hover:text-caramel transition-colors">
                        {item.name}
                      </h3>
                      <span className="font-serif text-base font-semibold text-caramel">
                        {item.price}
                      </span>
                    </div>
                    <p className="mt-2 text-xs leading-relaxed text-stone-400">
                      {item.description}
                    </p>
                  </div>

                  {/* Order Item Button */}
                  <div className="mt-5 flex items-center justify-between">
                    <span className="text-[0.65rem] text-stone-500 font-medium">Freshly Brewed</span>
                    <button
                      type="button"
                      onClick={() => handleOpenOrder(item)}
                      aria-label={`Order ${item.name}`}
                      className="inline-flex items-center gap-1.5 rounded-full bg-caramel px-3.5 py-1.5 text-xs font-bold text-espresso shadow-[0_2px_10px_rgba(200,147,85,0.3)] transition-all hover:bg-caramel-hover hover:scale-105 active:scale-95"
                    >
                      <Plus className="size-3.5 stroke-[2.5]" />
                      <span>Order</span>
                    </button>
                  </div>

                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SPECIAL OFFER SECTION - "Coffee & Treats Better Together" */}
      <section className="relative overflow-hidden border-y border-caramel/15 bg-[#120d0a] py-16 sm:py-20">
        {/* Subtle roasted coffee beans backdrop */}
        <div
          className="pointer-events-none absolute -left-20 top-0 h-96 w-96 rounded-full bg-caramel/10 blur-3xl"
          aria-hidden="true"
        />

        <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
            {/* Left Content */}
            <div>
              <p className="font-script text-3xl text-caramel sm:text-4xl">
                Special Offer
              </p>
              <h2 className="mt-2 font-serif text-3xl font-normal leading-[1.1] text-white sm:text-4xl lg:text-5xl">
                Coffee &amp; Treats
                <br />
                Better Together
              </h2>

              <p className="mt-4 text-base text-stone-300 sm:text-lg">
                Get 15% off on your first order.
              </p>

              <div className="mt-8">
                <CtaLink href="/menu" variant="caramel">
                  Order Now
                </CtaLink>
              </div>
            </div>

            {/* Right Image with 15% OFF Badge */}
            <div className="relative">
              <div className="relative overflow-hidden rounded-3xl border border-caramel/20 bg-[#1a1410] p-1.5 shadow-2xl">
                <img
                  src={comboImg}
                  alt="Hot cappuccino cup and chocolate fudge cake slice"
                  width={1200}
                  height={675}
                  loading="lazy"
                  className="aspect-[16/9] w-full rounded-2xl object-cover"
                />
              </div>

              {/* 15% OFF Circular Badge Matching Screenshot */}
              <div className="absolute -top-4 right-4 flex size-20 flex-col items-center justify-center rounded-full bg-caramel text-espresso shadow-[0_0_25px_rgba(200,147,85,0.6)] animate-pulse sm:size-24 sm:-top-5 sm:right-6">
                <span className="font-serif text-lg font-bold leading-none sm:text-xl">
                  15%
                </span>
                <span className="text-[0.65rem] font-bold uppercase tracking-wider leading-tight">
                  OFF
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* GALLERY / AMBIENCE SECTION */}
      <section id="gallery" className="relative bg-[#0d0a08] py-20 sm:py-28">
        <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
          <div className="text-center">
            <p className="font-script text-3xl text-caramel sm:text-4xl">Our Space</p>
            <h2 className="mt-1 font-serif text-3xl font-normal text-white sm:text-4xl lg:text-5xl">
              Cozy Moments at Bad Moon Cafe
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-sm text-stone-400">
              A serene haven designed for coffee lovers, remote workers, and friendly conversations.
            </p>
          </div>

          <div className="mt-14 grid gap-5 sm:grid-cols-3">
            <div className="sm:col-span-2 overflow-hidden rounded-2xl border border-caramel/20 bg-[#16110e] p-1.5 shadow-xl">
              <img
                src={interiorImg}
                alt="Cafe seating area"
                width={1200}
                height={800}
                loading="lazy"
                className="aspect-[16/10] w-full rounded-xl object-cover transition-transform duration-700 hover:scale-[1.02]"
              />
            </div>
            <div className="overflow-hidden rounded-2xl border border-caramel/20 bg-[#16110e] p-1.5 shadow-xl">
              <img
                src={heroCupImg}
                alt="Fresh brewed espresso"
                width={800}
                height={800}
                loading="lazy"
                className="aspect-square w-full rounded-xl object-cover transition-transform duration-700 hover:scale-[1.02]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* REVIEWS & TESTIMONIALS SECTION */}
      <ReviewsSection />

      {/* FOOTER & 4-ITEM CONTACT BAR */}
      <SiteFooter />
      <MobileActionBar />

      {/* About & Heritage Story Modal ("Learn More") */}
      {showAboutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-caramel/30 bg-[#140f0c] p-6 text-white shadow-2xl sm:p-8">
            <button
              onClick={() => setShowAboutModal(false)}
              className="absolute right-5 top-5 rounded-full p-2 text-stone-400 transition-colors hover:bg-stone-800 hover:text-white"
              aria-label="Close story modal"
            >
              <X className="size-5" />
            </button>

            <p className="font-script text-3xl text-caramel sm:text-4xl">Our Heritage & Story</p>
            <h3 className="font-serif text-2xl text-white sm:text-3xl">Welcome to {CAFE.name}</h3>

            <div className="mt-6 space-y-4 text-sm leading-relaxed text-stone-300">
              <p>
                Founded with a passionate belief that great coffee brings people together,{" "}
                <strong className="text-caramel">{CAFE.name}</strong> was born as a warm, welcoming
                haven in the heart of London.
              </p>
              <p>
                We source our specialty coffee beans from sustainable, single-origin family farms
                across Ethiopia, Colombia, and Guatemala. Every batch is precision-roasted to coax
                out nuanced notes of dark chocolate, berry sweetness, and toasted hazelnuts.
              </p>
            </div>

            {/* 3 Pillars */}
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-stone-800 bg-[#1c1511] p-4 text-center">
                <div className="mx-auto flex size-10 items-center justify-center rounded-full bg-caramel/10 text-caramel">
                  <Coffee className="size-5" />
                </div>
                <h4 className="mt-2 font-serif text-sm font-semibold text-white">Artisan Brews</h4>
                <p className="mt-1 text-xs text-stone-400">Freshly ground single-origin espresso & silky micro-foam.</p>
              </div>

              <div className="rounded-2xl border border-stone-800 bg-[#1c1511] p-4 text-center">
                <div className="mx-auto flex size-10 items-center justify-center rounded-full bg-caramel/10 text-caramel">
                  <Sparkles className="size-5" />
                </div>
                <h4 className="mt-2 font-serif text-sm font-semibold text-white">Cozy Haven</h4>
                <p className="mt-1 text-xs text-stone-400">Warm ambient lighting, board games & fast WiFi for creators.</p>
              </div>

              <div className="rounded-2xl border border-stone-800 bg-[#1c1511] p-4 text-center">
                <div className="mx-auto flex size-10 items-center justify-center rounded-full bg-caramel/10 text-caramel">
                  <Utensils className="size-5" />
                </div>
                <h4 className="mt-2 font-serif text-sm font-semibold text-white">Fresh Bakery</h4>
                <p className="mt-1 text-xs text-stone-400">Brioches, fluffy berry pancakes & gourmet cakes every day.</p>
              </div>
            </div>

            {/* Location & CTAs */}
            <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-stone-800/80 pt-6">
              <div className="flex items-center gap-2 text-xs text-stone-400">
                <MapPin className="size-4 text-caramel" />
                <span>{CAFE.address.line1}, {CAFE.address.city}</span>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <CtaLink href="/menu" variant="ink" onClick={() => setShowAboutModal(false)}>
                  Explore Menu
                </CtaLink>
                {CAFE.directionsUrl && (
                  <CtaLink href={CAFE.directionsUrl} external variant="caramel">
                    Get Directions
                  </CtaLink>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Video Modal ("Watch Our Story") */}
      {showVideoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-3xl rounded-2xl border border-caramel/30 bg-[#120d0a] p-6 shadow-2xl">
            <button
              onClick={() => setShowVideoModal(false)}
              className="absolute right-4 top-4 rounded-full p-2 text-stone-400 hover:bg-stone-800 hover:text-white"
              aria-label="Close video"
            >
              <X className="size-6" />
            </button>
            <p className="font-script text-3xl text-caramel">Our Story</p>
            <h3 className="font-serif text-2xl text-white">Crafting the Perfect Brew</h3>
            <div className="mt-4 aspect-video w-full overflow-hidden rounded-xl bg-stone-900 border border-caramel/20 flex items-center justify-center relative">
              <img
                src={interiorImg}
                alt="Story video cover"
                className="size-full object-cover brightness-50"
              />
              <div className="absolute text-center">
                <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-caramel text-espresso shadow-[0_0_30px_rgba(200,147,85,0.7)] animate-pulse">
                  <Play className="size-6 fill-current ml-1" />
                </div>
                <p className="mt-3 text-xs font-semibold uppercase tracking-widest text-caramel">
                  Bad Moon Cafe Journey Video
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Order Modal */}
      <OrderModal
        isOpen={showOrderModal}
        onClose={() => setShowOrderModal(false)}
        initialItem={selectedOrderItem}
      />
    </div>
  );
}


