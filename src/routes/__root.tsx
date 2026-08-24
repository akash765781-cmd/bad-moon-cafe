import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useLocation,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { AlertTriangle, Ban, Check, Search, X } from "lucide-react";

import appCss from "../styles.css?url";
import { useAnalyticsTracker } from "../hooks/useAnalytics";
import {
  dismissCustomerCancellationNotice,
  getCustomerCancellationNotice,
  isSiteOnline,
  type CustomerCancellationNotice,
} from "../lib/analytics";
import { CAFE } from "../lib/cafe";
import { MaintenanceNotice } from "../components/site/MaintenanceNotice";
import { TrackOrderModal } from "../components/site/TrackOrderModal";




function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Bad Moon Cafe London — Cafe & Coffee" },
      {
        name: "description",
        content:
          "Bad Moon Cafe London: artisan coffee, fresh treats, and cozy vibes in Borough, London.",
      },
      { property: "og:site_name", content: "Bad Moon Cafe" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Alex+Brush&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap",
      },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
      { rel: "icon", href: "/favicon.png", type: "image/png" },
    ],
  }),

  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <HeadContent />
      </head>
      <body className="min-h-screen bg-background text-foreground antialiased selection:bg-terracotta/30 selection:text-cream">
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const location = useLocation();
  const [online, setOnline] = useState(true);
  const [activeCancellation, setActiveCancellation] = useState<CustomerCancellationNotice | null>(null);

  const [showTrackModal, setShowTrackModal] = useState(false);
  const [trackQuery, setTrackQuery] = useState("");

  useAnalyticsTracker();

  useEffect(() => {
    // Initial check for site status and unread cancellation notice
    setOnline(isSiteOnline());
    const storedNotice = getCustomerCancellationNotice();
    if (storedNotice) {
      setActiveCancellation(storedNotice);
    }

    const handleStatusChange = () => {
      setOnline(isSiteOnline());
      const notice = getCustomerCancellationNotice();
      if (notice) {
        setActiveCancellation(notice);
      }
    };

    const handleOrderCancelled = (e: Event) => {
      const customEvent = e as CustomEvent<{
        id: string;
        cancelledBy: "customer" | "cafe";
        cancellationDetails?: { cancellationReason?: string; cancelledAt?: string };
        orderItem?: string;
      }>;
      if (customEvent.detail) {
        setActiveCancellation({
          id: customEvent.detail.id,
          cancelledBy: customEvent.detail.cancelledBy,
          cancellationReason: customEvent.detail.cancellationDetails?.cancellationReason,
          cancelledAt: customEvent.detail.cancellationDetails?.cancelledAt,
          orderItem: customEvent.detail.orderItem,
        });
      }
    };

    window.addEventListener("cafe_site_status_changed", handleStatusChange);
    window.addEventListener("cafe_order_cancelled", handleOrderCancelled);
    window.addEventListener("storage", handleStatusChange);
    return () => {
      window.removeEventListener("cafe_site_status_changed", handleStatusChange);
      window.removeEventListener("cafe_order_cancelled", handleOrderCancelled);
      window.removeEventListener("storage", handleStatusChange);
    };
  }, []);

  const handleDismissNotice = () => {
    dismissCustomerCancellationNotice();
    setActiveCancellation(null);
  };

  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <QueryClientProvider client={queryClient}>
      <>
        <Outlet />

          {/* Real-time Order Cancellation Notification Popup for Customer Screen */}
          {activeCancellation && !isAdminRoute && (
            <div className="fixed top-20 right-4 z-50 max-w-md w-[calc(100%-2rem)] sm:w-auto rounded-3xl border border-rose-500/80 bg-[#160e0a]/95 p-4 sm:p-5 text-white shadow-[0_10px_40px_rgba(244,63,94,0.45)] backdrop-blur-xl animate-in slide-in-from-top-5 duration-300">
              <div className="flex items-start gap-3.5">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-rose-900/50 border border-rose-500/60 text-rose-400 shadow-inner">
                  <Ban className="size-5 stroke-[2.5]" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <div className="inline-flex items-center gap-1.5 rounded-full border border-rose-500/50 bg-rose-950/80 px-2.5 py-0.5 text-[0.65rem] font-extrabold uppercase tracking-wider text-rose-300">
                      <span className="size-1.5 rounded-full bg-rose-400 animate-ping" />
                      {activeCancellation.cancelledBy === "cafe"
                        ? "Order Cancelled by Cafe"
                        : "Order Cancelled by You"}
                    </div>
                    <button
                      type="button"
                      onClick={handleDismissNotice}
                      className="rounded-full p-1 text-stone-400 hover:text-white transition-colors"
                      aria-label="Close notification"
                    >
                      <X className="size-4" />
                    </button>
                  </div>

                  <h4 className="mt-1.5 font-serif text-sm sm:text-base font-bold text-white">
                    {activeCancellation.cancelledBy === "cafe"
                      ? "Your order has been cancelled by the cafe."
                      : "Your order cancellation is confirmed."}
                  </h4>

                  <p className="mt-1 text-xs text-stone-300 leading-relaxed">
                    {activeCancellation.cancelledBy === "cafe" ? (
                      <>
                        Bad Moon Cafe has cancelled Order <strong className="text-caramel font-mono">#{activeCancellation.id.slice(-6)}</strong>
                        {activeCancellation.orderItem ? ` (${activeCancellation.orderItem})` : ""}. We apologize for the inconvenience.
                      </>
                    ) : (
                      <>
                        Order <strong className="text-caramel font-mono">#{activeCancellation.id.slice(-6)}</strong> was cancelled upon your request.
                      </>
                    )}
                  </p>

                  {/* Actions */}
                  <div className="mt-3.5 flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setTrackQuery(activeCancellation.id);
                        setShowTrackModal(true);
                        handleDismissNotice();
                      }}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-caramel px-3.5 py-2 text-xs font-bold text-espresso hover:bg-caramel-hover transition-all shadow-sm active:scale-95"
                    >
                      <Search className="size-3.5" />
                      <span>Track Order</span>
                    </button>

                    <a
                      href={`tel:${CAFE.phone}`}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-stone-700 bg-stone-900/80 px-3 py-2 text-xs font-medium text-stone-200 hover:text-white transition-colors"
                    >
                      <span>Call: {CAFE.phone}</span>
                    </a>

                    <button
                      type="button"
                      onClick={handleDismissNotice}
                      className="rounded-xl border border-stone-800 bg-[#1c1511] px-3 py-2 text-xs font-medium text-stone-400 hover:text-white transition-colors ml-auto"
                    >
                      Done
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}


          {/* Track Modal Opened via Notification */}
          <TrackOrderModal
            isOpen={showTrackModal}
            onClose={() => setShowTrackModal(false)}
            initialQuery={trackQuery}
          />
        </>
    </QueryClientProvider>
  );
}



