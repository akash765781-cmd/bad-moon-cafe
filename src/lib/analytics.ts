/**
 * Bad Moon Cafe - Analytics, Click Tracking & Admin Management System
 * Supports SSR-safe local persistence, real-time dispatch, and admin auth.
 */

export type FormSubmissionType = "reservation" | "review" | "newsletter" | "contact" | "order";
export type SubmissionStatus = "new" | "confirmed" | "preparing" | "completed" | "reviewed" | "archived" | "cancelled";


export interface FormSubmission {
  id: string;
  type: FormSubmissionType;
  name: string;
  email?: string;
  phone?: string;
  details: Record<string, any>;
  status: SubmissionStatus;
  createdAt: string;
  timestamp: number;
}

export interface PageViewEvent {
  id: string;
  path: string;
  title: string;
  referrer: string;
  device: "Desktop" | "Mobile" | "Tablet";
  browser: string;
  sessionId: string;
  timestamp: number;
  createdAt: string;
}

export interface ClickEvent {
  id: string;
  element: string;
  text: string;
  category: "CTA" | "Navigation" | "Menu" | "Reservation" | "Social" | "Contact" | "Interaction";
  target?: string;
  path: string;
  sessionId: string;
  timestamp: number;
  createdAt: string;
}

export interface AdminAuthSession {
  isAuthenticated: boolean;
  username: string;
  token: string;
  loginTime: number;
}

const STORAGE_KEYS = {
  PAGE_VIEWS: "cafe_analytics_pageviews_v1",
  CLICKS: "cafe_analytics_clicks_v1",
  SUBMISSIONS: "cafe_form_submissions_v1",
  AUTH: "cafe_admin_auth_v1",
  SESSION: "cafe_visitor_session_id_v1",
  SEEDED: "cafe_analytics_seeded_v1",
  SITE_STATUS: "cafe_site_status_v1",
};

/**
 * Site Online / Offline Control
 * Default is true (Site is Active/ON)
 */
export function isSiteOnline(): boolean {
  if (typeof window === "undefined") return true;
  try {
    const val = localStorage.getItem(STORAGE_KEYS.SITE_STATUS);
    return val !== "offline";
  } catch {
    return true;
  }
}

export function setSiteOnline(online: boolean): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEYS.SITE_STATUS, online ? "online" : "offline");
    window.dispatchEvent(new CustomEvent("cafe_site_status_changed", { detail: { online } }));
    window.dispatchEvent(new Event("storage"));
  } catch (e) {
    console.error("Error updating site status:", e);
  }
}


// Safe helper for localStorage
function safeGetItem<T>(key: string, defaultValue: T): T {
  if (typeof window === "undefined") return defaultValue;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : defaultValue;
  } catch (e) {
    console.error("Error reading localStorage key:", key, e);
    return defaultValue;
  }
}

function safeSetItem<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new CustomEvent("cafe_analytics_change", { detail: { key } }));
  } catch (e) {
    console.error("Error writing localStorage key:", key, e);
  }
}

// Session Generator
export function getOrCreateSessionId(): string {
  if (typeof window === "undefined") return "ssr-session";
  let sessionId = sessionStorage.getItem(STORAGE_KEYS.SESSION);
  if (!sessionId) {
    sessionId = "sess_" + Math.random().toString(36).substring(2, 9) + "_" + Date.now().toString(36);
    sessionStorage.setItem(STORAGE_KEYS.SESSION, sessionId);
  }
  return sessionId;
}

// Detect Device
function detectDevice(): "Desktop" | "Mobile" | "Tablet" {
  if (typeof window === "undefined") return "Desktop";
  const ua = navigator.userAgent;
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) return "Tablet";
  if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated/i.test(ua)) return "Mobile";
  return "Desktop";
}

function detectBrowser(): string {
  if (typeof window === "undefined") return "Unknown";
  const ua = navigator.userAgent;
  if (ua.includes("Chrome") && !ua.includes("Edg")) return "Chrome";
  if (ua.includes("Safari") && !ua.includes("Chrome")) return "Safari";
  if (ua.includes("Firefox")) return "Firefox";
  if (ua.includes("Edg")) return "Edge";
  return "Other";
}

// -------------------------------------------------------------
// Admin Authentication (username: akash, password: akash98728)
// -------------------------------------------------------------
const ADMIN_USER = "akash";
const ADMIN_PASS = "akash98728";

export function adminLogin(username: string, password: string): { success: boolean; message: string } {
  if (username.trim().toLowerCase() === ADMIN_USER.toLowerCase() && password === ADMIN_PASS) {
    const session: AdminAuthSession = {
      isAuthenticated: true,
      username: ADMIN_USER,
      token: "bmc_adm_" + Math.random().toString(36).substring(2, 12) + Date.now(),
      loginTime: Date.now(),
    };
    safeSetItem(STORAGE_KEYS.AUTH, session);
    return { success: true, message: "Welcome back, Akash!" };
  }
  return { success: false, message: "Invalid username or password. Please check your credentials." };
}

export function adminLogout(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEYS.AUTH);
  window.dispatchEvent(new CustomEvent("cafe_analytics_change", { detail: { key: STORAGE_KEYS.AUTH } }));
}

export function getAdminSession(): AdminAuthSession {
  return safeGetItem<AdminAuthSession>(STORAGE_KEYS.AUTH, {
    isAuthenticated: false,
    username: "",
    token: "",
    loginTime: 0,
  });
}

// -------------------------------------------------------------
// Tracking Actions
// -------------------------------------------------------------

export function trackPageView(path: string, title?: string): void {
  if (typeof window === "undefined") return;
  // Exclude admin dashboard from public traffic stats
  if (path.startsWith("/admin")) return;

  const views = safeGetItem<PageViewEvent[]>(STORAGE_KEYS.PAGE_VIEWS, []);
  const event: PageViewEvent = {
    id: "pv_" + Date.now() + "_" + Math.random().toString(36).substring(2, 6),
    path: path || window.location.pathname,
    title: title || document.title || "Bad Moon Cafe",
    referrer: document.referrer ? new URL(document.referrer, window.location.origin).pathname : "Direct / Organic",
    device: detectDevice(),
    browser: detectBrowser(),
    sessionId: getOrCreateSessionId(),
    timestamp: Date.now(),
    createdAt: new Date().toISOString(),
  };

  // Keep last 1500 views
  const updated = [event, ...views].slice(0, 1500);
  safeSetItem(STORAGE_KEYS.PAGE_VIEWS, updated);
}

export function trackClick(data: {
  element: string;
  text?: string;
  category?: ClickEvent["category"];
  target?: string;
  path?: string;
}): void {
  if (typeof window === "undefined") return;
  // Exclude clicks made inside admin panel
  if (window.location.pathname.startsWith("/admin")) return;

  const clicks = safeGetItem<ClickEvent[]>(STORAGE_KEYS.CLICKS, []);
  const event: ClickEvent = {
    id: "clk_" + Date.now() + "_" + Math.random().toString(36).substring(2, 6),
    element: data.element,
    text: (data.text || data.element).slice(0, 100),
    category: data.category || "Interaction",
    target: data.target || "",
    path: data.path || window.location.pathname,
    sessionId: getOrCreateSessionId(),
    timestamp: Date.now(),
    createdAt: new Date().toISOString(),
  };

  // Keep last 1500 clicks
  const updated = [event, ...clicks].slice(0, 1500);
  safeSetItem(STORAGE_KEYS.CLICKS, updated);
}

export function trackFormSubmission(submission: {
  type: FormSubmissionType;
  name: string;
  email?: string;
  phone?: string;
  details?: Record<string, any>;
}): FormSubmission {
  const submissions = safeGetItem<FormSubmission[]>(STORAGE_KEYS.SUBMISSIONS, []);
  const newSubmission: FormSubmission = {
    id: "sub_" + Date.now() + "_" + Math.random().toString(36).substring(2, 6),
    type: submission.type,
    name: submission.name,
    email: submission.email || "",
    phone: submission.phone || "",
    details: submission.details || {},
    status: "new",
    createdAt: new Date().toISOString(),
    timestamp: Date.now(),
  };

  const updated = [newSubmission, ...submissions];
  safeSetItem(STORAGE_KEYS.SUBMISSIONS, updated);

  if (submission.type === "order" && typeof window !== "undefined") {
    try {
      localStorage.setItem("cafe_latest_order_id", newSubmission.id);
    } catch {
      // ignore
    }
  }

  // Also log as a high-value click interaction
  trackClick({
    element: `Form Submit: ${submission.type.toUpperCase()}`,
    text: `Submitted ${submission.type} (${submission.name})`,
    category: "CTA",
  });

  return newSubmission;
}

// -------------------------------------------------------------
// Data Retrieval & Management for Admin Dashboard & Tracking
// -------------------------------------------------------------

export function getAllSubmissions(): FormSubmission[] {
  return safeGetItem<FormSubmission[]>(STORAGE_KEYS.SUBMISSIONS, []);
}

export function getLatestCustomerOrder(): FormSubmission | null {
  if (typeof window === "undefined") return null;
  const submissions = getAllSubmissions();
  try {
    const latestId = localStorage.getItem("cafe_latest_order_id");
    if (latestId) {
      const found = submissions.find((s) => s.id === latestId);
      if (found) return found;
    }
  } catch {
    // ignore
  }
  const orders = submissions.filter((s) => s.type === "order");
  return orders[0] || null;
}


export function updateSubmissionStatus(
  id: string,
  status: SubmissionStatus,
  extraDetails?: Record<string, any>,
): void {
  const submissions = getAllSubmissions();
  const updated = submissions.map((s) => {
    if (s.id === id) {
      return {
        ...s,
        status,
        details: extraDetails ? { ...s.details, ...extraDetails } : s.details,
      };
    }
    return s;
  });
  safeSetItem(STORAGE_KEYS.SUBMISSIONS, updated);
}

/**
 * Customer Order Tracking: Search by Order ID or Mobile Number
 */
export function findOrderByIdOrPhone(query: string): FormSubmission | null {
  if (!query || !query.trim()) return null;
  const submissions = getAllSubmissions();
  const q = query.trim().toLowerCase();
  const cleanPhone = q.replace(/[\s\-\(\)\+]/g, "");

  // 1. Check exact or partial ID match (orders first, then reservations)
  const idMatch = submissions.find(
    (s) => s.id.toLowerCase() === q || s.id.toLowerCase().includes(q) || s.id.slice(-6).toLowerCase() === q,
  );
  if (idMatch) return idMatch;

  // 2. Check by mobile phone
  if (cleanPhone.length >= 7) {
    const phoneMatches = submissions.filter((s) => {
      const sPhone = (s.phone || "").replace(/[\s\-\(\)\+]/g, "");
      return sPhone.includes(cleanPhone) || cleanPhone.includes(sPhone);
    });
    // Return newest match
    if (phoneMatches.length > 0) {
      return phoneMatches.sort((a, b) => b.timestamp - a.timestamp)[0] || null;
    }
  }

  return null;
}

/**
 * Cancel an order (by Customer or by Cafe/Admin)
 */
export function cancelOrder(
  id: string,
  cancelledBy: "customer" | "cafe",
  reason?: string,
): boolean {
  const submissions = getAllSubmissions();
  const target = submissions.find((s) => s.id === id);
  if (!target) return false;

  const cancellationDetails = {
    cancelledBy,
    cancelledAt: new Date().toISOString(),
    cancellationReason:
      reason ||
      (cancelledBy === "customer"
        ? "Cancelled by customer via order tracker"
        : "Cancelled by Bad Moon Cafe management"),
  };

  updateSubmissionStatus(id, "cancelled", cancellationDetails);

  if (typeof window !== "undefined") {
    try {
      const noticePayload = {
        id,
        orderItem: target.details?.["item"] || "Order",
        totalAmount: target.details?.["totalAmount"] || "",
        cancelledBy,
        cancellationReason: cancellationDetails.cancellationReason,
        cancelledAt: cancellationDetails.cancelledAt,
        dismissed: false,
      };
      localStorage.setItem("cafe_customer_cancellation_notice", JSON.stringify(noticePayload));
    } catch {
      // ignore
    }
  }

  window.dispatchEvent(
    new CustomEvent("cafe_order_cancelled", {
      detail: { id, cancelledBy, cancellationDetails, orderItem: target.details?.["item"] },
    }),
  );
  return true;
}

export interface CustomerCancellationNotice {
  id: string;
  orderItem?: string | undefined;
  totalAmount?: string | undefined;
  cancelledBy: "customer" | "cafe";
  cancellationReason?: string | undefined;
  cancelledAt?: string | undefined;
  dismissed?: boolean | undefined;
}


export function getCustomerCancellationNotice(): CustomerCancellationNotice | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem("cafe_customer_cancellation_notice");
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CustomerCancellationNotice;
    if (parsed && !parsed.dismissed) {
      return parsed;
    }
  } catch {
    // ignore
  }
  return null;
}

export function dismissCustomerCancellationNotice(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem("cafe_customer_cancellation_notice");
  } catch {
    // ignore
  }
}


export function deleteSubmission(id: string): void {
  const submissions = getAllSubmissions();
  const updated = submissions.filter((s) => s.id !== id);
  safeSetItem(STORAGE_KEYS.SUBMISSIONS, updated);
}


export function getAllPageViews(): PageViewEvent[] {
  return safeGetItem<PageViewEvent[]>(STORAGE_KEYS.PAGE_VIEWS, []);
}

export function getAllClicks(): ClickEvent[] {
  return safeGetItem<ClickEvent[]>(STORAGE_KEYS.CLICKS, []);
}

export function deleteClick(id: string): void {
  const clicks = getAllClicks();
  safeSetItem(
    STORAGE_KEYS.CLICKS,
    clicks.filter((c) => c.id !== id),
  );
}

export function clearAllAnalyticsData(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEYS.PAGE_VIEWS);
  localStorage.removeItem(STORAGE_KEYS.CLICKS);
  localStorage.removeItem(STORAGE_KEYS.SUBMISSIONS);
  localStorage.removeItem(STORAGE_KEYS.SEEDED);
  window.dispatchEvent(new CustomEvent("cafe_analytics_change", { detail: { key: "all_cleared" } }));
}

// -------------------------------------------------------------
// Seed Initial Realistic Data for Bad Moon Cafe
// -------------------------------------------------------------
export function seedSampleData(force = false): void {
  if (typeof window === "undefined") return;
  const isSeeded = localStorage.getItem(STORAGE_KEYS.SEEDED);
  if (isSeeded && !force) return;

  const now = Date.now();
  const dayMs = 24 * 60 * 60 * 1000;

  // Realistic sample submissions
  const sampleSubmissions: FormSubmission[] = [
    {
      id: "sub_demo_1",
      type: "reservation",
      name: "Marcus Vance",
      email: "marcus.vance@londonbiz.co.uk",
      phone: "+44 7911 123456",
      details: {
        date: new Date(now + dayMs * 1).toISOString().split("T")[0],
        time: "19:00",
        guests: "4",
        notes: "Anniversary table near window if possible",
      },
      status: "new",
      createdAt: new Date(now - 1000 * 60 * 35).toISOString(),
      timestamp: now - 1000 * 60 * 35,
    },
    {
      id: "sub_demo_2",
      type: "review",
      name: "Sophia Turner",
      email: "sophia.t@gmail.com",
      phone: "+44 7700 900123",
      details: {
        rating: 5,
        role: "Specialty Coffee Enthusiast",
        comment: "The single origin Ethiopian brew paired with their berry pancakes is unbeatable in Borough!",
      },
      status: "reviewed",
      createdAt: new Date(now - 1000 * 60 * 120).toISOString(),
      timestamp: now - 1000 * 60 * 120,
    },
    {
      id: "sub_demo_3",
      type: "reservation",
      name: "James Oliver",
      email: "james.oliver@techstart.io",
      phone: "+44 7822 554433",
      details: {
        date: new Date(now + dayMs * 2).toISOString().split("T")[0],
        time: "14:30",
        guests: "2",
        notes: "Quiet corner for remote work & coffee",
      },
      status: "confirmed",
      createdAt: new Date(now - 1000 * 60 * 340).toISOString(),
      timestamp: now - 1000 * 60 * 340,
    },
    {
      id: "sub_demo_4",
      type: "newsletter",
      name: "Elena Rostova",
      email: "elena.rostova@designstudio.uk",
      phone: "",
      details: { source: "Footer Newsletter Form" },
      status: "confirmed",
      createdAt: new Date(now - 1000 * 60 * 520).toISOString(),
      timestamp: now - 1000 * 60 * 520,
    },
    {
      id: "sub_demo_5",
      type: "review",
      name: "David Chen",
      email: "david.c@citylegal.co.uk",
      phone: "",
      details: {
        rating: 5,
        role: "Local Architect",
        comment: "Warm ambience, cozy lighting, and friendly baristas. My daily morning ritual.",
      },
      status: "reviewed",
      createdAt: new Date(now - dayMs * 1).toISOString(),
      timestamp: now - dayMs * 1,
    },
    {
      id: "sub_demo_6",
      type: "reservation",
      name: "Amara Patel",
      email: "amara.patel@creativehub.com",
      phone: "+44 7944 667788",
      details: {
        date: new Date(now + dayMs * 3).toISOString().split("T")[0],
        time: "18:00",
        guests: "5+",
        notes: "Board game evening with friends",
      },
      status: "new",
      createdAt: new Date(now - dayMs * 1.5).toISOString(),
      timestamp: now - dayMs * 1.5,
    },
    {
      id: "sub_demo_7",
      type: "newsletter",
      name: "Liam Gallagher",
      email: "liam.g@musicpost.co.uk",
      phone: "",
      details: { source: "Footer Newsletter Form" },
      status: "confirmed",
      createdAt: new Date(now - dayMs * 2).toISOString(),
      timestamp: now - dayMs * 2,
    },
  ];

  // Realistic sample click tracking events
  const actionsPool = [
    { element: "Book a Table", category: "Reservation", path: "/", target: "#modal-booking" },
    { element: "Explore Menu", category: "Menu", path: "/", target: "/menu" },
    { element: "Add to Cart: Artisan Caramel Latte", category: "CTA", path: "/", target: "Cart" },
    { element: "Get Directions (Google Maps)", category: "Contact", path: "/", target: "https://maps.google.com" },
    { element: "Write a Review", category: "Interaction", path: "/", target: "#modal-review" },
    { element: "Watch Our Story Video", category: "Interaction", path: "/", target: "#modal-video" },
    { element: "Instagram Profile", category: "Social", path: "/", target: "https://instagram.com/akash_d7631" },
    { element: "Phone Call Button", category: "Contact", path: "/", target: "tel:02073780184" },
    { element: "View Full Menu", category: "Menu", path: "/", target: "/menu" },
    { element: "Join Newsletter Button", category: "CTA", path: "/", target: "#newsletter" },
    { element: "Special Offer: Order Now", category: "CTA", path: "/", target: "/menu" },
    { element: "Add to Cart: Single Origin Espresso", category: "CTA", path: "/", target: "Cart" },
    { element: "Facebook Page", category: "Social", path: "/", target: "https://facebook.com" },
  ];

  const sampleClicks: ClickEvent[] = [];
  for (let i = 0; i < 94; i++) {
    const action = actionsPool[i % actionsPool.length] ?? {
      element: "Book a Table",
      category: "Reservation" as const,
      path: "/",
      target: "#modal-booking",
    };
    const timeOffset = Math.floor(Math.random() * (7 * dayMs));
    sampleClicks.push({
      id: "clk_seed_" + i,
      element: action.element,
      text: action.element,
      category: action.category as ClickEvent["category"],
      target: action.target,
      path: action.path,
      sessionId: "sess_user_" + (i % 28),
      timestamp: now - timeOffset,
      createdAt: new Date(now - timeOffset).toISOString(),
    });
  }

  // Realistic sample page views
  const pagesPool = [
    { path: "/", title: "Bad Moon Cafe — Good Coffee, Good Day" },
    { path: "/menu", title: "Menu — Bad Moon Cafe | Artisan Coffee & Treats" },
    { path: "/#about", title: "About Us — Bad Moon Cafe Heritage" },
    { path: "/#gallery", title: "Cozy Space & Gallery — Bad Moon Cafe" },
    { path: "/#reviews", title: "Customer Reviews — Bad Moon Cafe" },
  ];

  const devices: ("Desktop" | "Mobile" | "Tablet")[] = ["Mobile", "Desktop", "Mobile", "Mobile", "Desktop", "Tablet"];
  const browsers = ["Chrome", "Safari", "Safari", "Chrome", "Firefox", "Edge"];
  const referrers = ["Direct / Organic", "Google Search", "Instagram", "Google Maps", "Direct / Organic", "Facebook"];

  const samplePageViews: PageViewEvent[] = [];
  for (let i = 0; i < 280; i++) {
    const page = pagesPool[i % pagesPool.length] ?? {
      path: "/",
      title: "Bad Moon Cafe — Good Coffee, Good Day",
    };
    const timeOffset = Math.floor(Math.random() * (7 * dayMs));
    const device = devices[i % devices.length] ?? "Mobile";
    const browser = browsers[i % browsers.length] ?? "Chrome";
    const referrer = referrers[i % referrers.length] ?? "Direct / Organic";

    samplePageViews.push({
      id: "pv_seed_" + i,
      path: page.path,
      title: page.title,
      referrer,
      device,
      browser,
      sessionId: "sess_user_" + (i % 65),
      timestamp: now - timeOffset,
      createdAt: new Date(now - timeOffset).toISOString(),
    });
  }


  // Save to storage
  const existingSubmissions = safeGetItem<FormSubmission[]>(STORAGE_KEYS.SUBMISSIONS, []);
  if (existingSubmissions.length === 0 || force) {
    safeSetItem(STORAGE_KEYS.SUBMISSIONS, sampleSubmissions);
  }

  const existingClicks = safeGetItem<ClickEvent[]>(STORAGE_KEYS.CLICKS, []);
  if (existingClicks.length === 0 || force) {
    safeSetItem(STORAGE_KEYS.CLICKS, sampleClicks);
  }

  const existingViews = safeGetItem<PageViewEvent[]>(STORAGE_KEYS.PAGE_VIEWS, []);
  if (existingViews.length === 0 || force) {
    safeSetItem(STORAGE_KEYS.PAGE_VIEWS, samplePageViews);
  }

  localStorage.setItem(STORAGE_KEYS.SEEDED, "true");
}

// -------------------------------------------------------------
// Export Utilities (CSV / JSON)
// -------------------------------------------------------------
export function exportSubmissionsToCsv(submissions: FormSubmission[]): void {
  if (typeof window === "undefined") return;
  const headers = ["ID", "Type", "Status", "Customer Name", "Mobile Phone", "Email Address", "Details", "Date Submitted"];
  const rows = submissions.map((s) => {
    let detailsSummary = "";
    if (s.type === "order") {
      const q = s.details?.["quantity"] || 1;
      const it = s.details?.["item"] || "Item";
      const amt = s.details?.["totalAmount"] || s.details?.["unitPrice"] || "";
      const ot = s.details?.["orderType"] || "Takeaway";
      const nt = s.details?.["notes"];
      detailsSummary = `${q}x ${it} (${amt}) - ${ot}${nt && nt !== "None" ? ` (Notes: ${nt})` : ""}`;
    } else if (s.type === "reservation") {
      detailsSummary = `${s.details?.["guests"] || 2} guests on ${s.details?.["date"]} at ${s.details?.["time"]}`;
    } else if (s.type === "review") {
      detailsSummary = `${s.details?.["rating"]}★: "${s.details?.["comment"] || ""}"`;
    } else {
      detailsSummary = JSON.stringify(s.details);
    }

    if (s.status === "cancelled") {
      const by = s.details?.["cancelledBy"] === "customer" ? "Customer" : "Cafe";
      detailsSummary += ` [CANCELLED BY ${by.toUpperCase()}]`;
    }




    return [
      `"${s.id}"`,
      `"${s.type}"`,
      `"${s.status}"`,
      `"${s.name.replace(/"/g, '""')}"`,
      `"${(s.phone || "").replace(/"/g, '""')}"`,
      `"${(s.email || "").replace(/"/g, '""')}"`,
      `"${detailsSummary.replace(/"/g, '""')}"`,
      `"${new Date(s.timestamp).toLocaleString()}"`,
    ];
  });



  const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `bad_moon_cafe_submissions_${Date.now()}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}


export function exportClicksToCsv(clicks: ClickEvent[]): void {
  if (typeof window === "undefined") return;
  const headers = ["ID", "Element Clicked", "Category", "Target", "Page Path", "Session ID", "Date Time"];
  const rows = clicks.map((c) => [
    `"${c.id}"`,
    `"${c.element.replace(/"/g, '""')}"`,
    `"${c.category}"`,
    `"${(c.target || "").replace(/"/g, '""')}"`,
    `"${c.path}"`,
    `"${c.sessionId}"`,
    `"${new Date(c.timestamp).toLocaleString()}"`,
  ]);

  const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `bad_moon_cafe_clicks_${Date.now()}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportAllDataAsJson(): void {
  if (typeof window === "undefined") return;
  const payload = {
    exportedAt: new Date().toISOString(),
    cafe: "Bad Moon Cafe London",
    submissions: getAllSubmissions(),
    pageViews: getAllPageViews(),
    clicks: getAllClicks(),
  };

  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(payload, null, 2));
  const link = document.createElement("a");
  link.setAttribute("href", dataStr);
  link.setAttribute("download", `bad_moon_cafe_complete_analytics_${Date.now()}.json`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
