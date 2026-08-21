import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Coffee, MapPin, ShoppingBag } from "lucide-react";
import { MenuCategoryBlock } from "@/components/site/MenuList";
import { OrderModal, type OrderItemPayload } from "@/components/site/OrderModal";
import { SiteFooter } from "@/components/site/SiteFooter";
import { MobileActionBar, SiteNav } from "@/components/site/SiteNav";
import { CtaLink } from "@/components/site/ui";
import { CAFE, MENU } from "@/lib/cafe";

export const Route = createFileRoute("/menu")({
  head: () => ({
    meta: [
      { title: "Menu — Bad Moon Cafe | Coffee, Bakery & Treats" },
      {
        name: "description",
        content:
          "Artisan coffee, iced frappes, fluffy berry pancakes, and decadent desserts at Bad Moon Cafe.",
      },
      { property: "og:title", content: "Menu — Bad Moon Cafe" },
      {
        property: "og:description",
        content:
          "Artisan coffee, bakery, frappes, and desserts at Bad Moon Cafe.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/menu" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/menu" }],
  }),
  component: MenuPage,
});

function MenuPage() {
  const [selectedOrderItem, setSelectedOrderItem] = useState<OrderItemPayload | null>(null);
  const [showOrderModal, setShowOrderModal] = useState(false);

  const handleOrderItem = (item: OrderItemPayload) => {
    setSelectedOrderItem(item);
    setShowOrderModal(true);
  };

  return (
    <div className="relative min-h-screen bg-[#0d0a08] text-[#f5ede6] overflow-x-hidden pb-16 sm:pb-0">
      <SiteNav />

      {/* Ambient background glow */}
      <div
        className="pointer-events-none absolute -left-20 top-20 h-96 w-96 rounded-full bg-caramel/10 blur-[130px]"
        aria-hidden="true"
      />

      <main className="relative z-10">
        <section className="mx-auto max-w-[1280px] px-5 pb-14 pt-8 sm:px-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-caramel transition-colors hover:text-caramel-hover"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            Back to Home
          </Link>
          <div className="mt-8 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="font-script text-3xl sm:text-4xl text-caramel">Our Full Selection</p>
              <h1 className="mt-2 max-w-3xl font-serif text-4xl font-normal leading-[1.08] text-white sm:text-6xl">
                Crafted Coffee, Bakery &amp; Treats
              </h1>
              <p className="mt-4 max-w-xl text-base text-stone-300 sm:text-lg">
                Freshly brewed and prepared daily with single-origin beans and premium artisan ingredients.
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                handleOrderItem({
                  name: "Artisan Cappuccino",
                  price: "£3.80",
                  description: "Rich espresso with silky textured steamed milk.",
                })
              }
              className="inline-flex items-center gap-2 rounded-full bg-caramel px-6 py-3 text-sm font-bold text-espresso shadow-[0_4px_20px_rgba(200,147,85,0.3)] transition-all hover:bg-caramel-hover hover:scale-105 active:scale-95"
            >
              <ShoppingBag className="size-4" />
              <span>Order Online Now</span>
            </button>
          </div>
        </section>

        <section className="mx-auto max-w-[1280px] px-5 pb-24 sm:px-8">
          <div className="grid gap-8 md:grid-cols-2">
            {MENU.map((category) => (
              <MenuCategoryBlock
                key={category.title}
                category={category}
                onOrderItem={handleOrderItem}
              />
            ))}
          </div>

          <div className="mt-16 rounded-3xl border border-caramel/25 bg-[#140f0c] p-8 shadow-2xl backdrop-blur-sm sm:p-10">
            <p className="font-script text-3xl text-caramel">Visit Us</p>
            <h2 className="mt-1 font-serif text-3xl font-normal text-white sm:text-4xl">
              Come and enjoy the aroma today.
            </h2>
            <p className="mt-3 max-w-lg text-stone-400">
              {CAFE.address.line1}, {CAFE.address.line2}, {CAFE.address.city}{" "}
              {CAFE.address.postcode}. Open daily from 8:00 AM to 10:00 PM.
            </p>
            <CtaLink href={CAFE.directionsUrl} external variant="caramel" className="mt-7">
              <MapPin className="size-4" aria-hidden="true" />
              Get Directions
            </CtaLink>
          </div>
        </section>
      </main>

      {/* Order Modal */}
      <OrderModal
        isOpen={showOrderModal}
        onClose={() => setShowOrderModal(false)}
        initialItem={selectedOrderItem}
      />

      <SiteFooter />
      <MobileActionBar />
    </div>
  );
}

