import { useEffect } from "react";
import { useRouterState } from "@tanstack/react-router";
import {
  trackClick,
  trackPageView,
} from "@/lib/analytics";


/**
 * Hook to automatically track page navigation and user interactions across Bad Moon Cafe.
 */
export function useAnalyticsTracker() {
  const routerState = useRouterState();
  const pathname = routerState?.location?.pathname || "/";

  // 1. Track Page Views on pathname or hash changes
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Track this page view
    trackPageView(pathname, document.title);
  }, [pathname]);


  // 2. Global Event Delegation for Interactive Element Clicks
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleGlobalClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target) return;

      // Do not track clicks that happen inside the admin panel dashboard
      if (window.location.pathname.startsWith("/admin")) return;

      // Find closest interactive element
      const interactiveEl = target.closest<HTMLElement>(
        "button, a, [role='button'], input[type='submit'], [data-track]"
      );
      if (!interactiveEl) return;

      // Determine text label
      const explicitLabel = interactiveEl.getAttribute("data-track") || interactiveEl.getAttribute("aria-label");
      let text = explicitLabel || interactiveEl.innerText || (interactiveEl as HTMLInputElement).value || "";
      text = text.replace(/\s+/g, " ").trim();

      // Determine target/destination
      const href = interactiveEl.getAttribute("href") || "";
      const tagName = interactiveEl.tagName.toLowerCase();

      // Categorize action
      let category: "CTA" | "Navigation" | "Menu" | "Reservation" | "Social" | "Contact" | "Interaction" = "Interaction";

      const lowerText = text.toLowerCase();
      const lowerHref = href.toLowerCase();

      if (lowerText.includes("book") || lowerText.includes("reserve") || lowerText.includes("table")) {
        category = "Reservation";
      } else if (lowerHref.includes("menu") || lowerText.includes("menu") || lowerText.includes("order")) {
        category = "Menu";
      } else if (lowerHref.startsWith("tel:") || lowerHref.startsWith("mailto:") || lowerText.includes("direction") || lowerHref.includes("maps")) {
        category = "Contact";
      } else if (lowerHref.includes("instagram") || lowerHref.includes("facebook") || lowerHref.includes("twitter")) {
        category = "Social";
      } else if (tagName === "button" || lowerText.includes("get") || lowerText.includes("explore") || lowerText.includes("join") || lowerText.includes("post")) {
        category = "CTA";
      } else if (tagName === "a") {
        category = "Navigation";
      }

      if (!text && href) {
        text = href;
      }

      if (text) {
        trackClick({
          element: text.slice(0, 75),
          text: text.slice(0, 100),
          category,
          target: href || tagName,
          path: window.location.pathname,
        });
      }
    };

    window.addEventListener("click", handleGlobalClick, { capture: true });
    return () => {
      window.removeEventListener("click", handleGlobalClick, { capture: true });
    };
  }, []);
}
