import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  AlertTriangle,
  ArrowLeft,
  Ban,
  Calendar,
  Check,
  Clock,
  Coffee,
  Download,
  Eye,
  EyeOff,
  Globe,
  Inbox,
  Lock,
  LogOut,
  Mail,
  MousePointerClick,
  Phone,
  Power,
  PowerOff,
  RefreshCw,
  Search,
  ShoppingBag,
  Star,
  Trash2,
  User,
  Users,
  X,
} from "lucide-react";

import {
  adminLogin,
  adminLogout,
  cancelOrder,
  clearAllAnalyticsData,
  deleteClick,
  deleteSubmission,
  exportClicksToCsv,
  exportSubmissionsToCsv,
  getAdminSession,
  getAllClicks,
  getAllPageViews,
  getAllSubmissions,
  isSiteOnline,
  setSiteOnline,
  updateSubmissionStatus,
  type ClickEvent,
  type FormSubmission,
  type FormSubmissionType,
  type PageViewEvent,
  type SubmissionStatus,
} from "@/lib/analytics";


import { CAFE } from "@/lib/cafe";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin Panel — Bad Moon Cafe" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: SimpleAdminPage,
});

type TabType = "submissions" | "clicks" | "views";

function SimpleAdminPage() {
  const [auth, setAuth] = useState(() => getAdminSession());
  const [usernameInput, setUsernameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Dashboard state
  const [siteOnline, setSiteOnlineState] = useState(() => isSiteOnline());
  const [activeTab, setActiveTab] = useState<TabType>("submissions");
  const [submissions, setSubmissions] = useState<FormSubmission[]>([]);
  const [pageViews, setPageViews] = useState<PageViewEvent[]>([]);
  const [clicks, setClicks] = useState<ClickEvent[]>([]);
  const [selectedSubmission, setSelectedSubmission] = useState<FormSubmission | null>(null);

  // Submissions search & filters
  const [typeFilter, setTypeFilter] = useState<"all" | FormSubmissionType | "cancelled">("all");
  const [searchQuery, setSearchQuery] = useState("");


  // Toast notice
  const [notice, setNotice] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setNotice(msg);
    setTimeout(() => setNotice(null), 3000);
  };

  const loadData = () => {
    if (typeof window === "undefined") return;
    setAuth(getAdminSession());
    setSiteOnlineState(isSiteOnline());
    setSubmissions(getAllSubmissions());
    setPageViews(getAllPageViews());
    setClicks(getAllClicks());
  };

  useEffect(() => {
    loadData();

    const onChange = () => loadData();
    window.addEventListener("cafe_analytics_change", onChange);
    window.addEventListener("cafe_site_status_changed", onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener("cafe_analytics_change", onChange);
      window.removeEventListener("cafe_site_status_changed", onChange);
      window.removeEventListener("storage", onChange);
    };
  }, []);

  // Handle Site ON / OFF Toggle
  const handleToggleSiteStatus = () => {
    const nextStatus = !siteOnline;
    setSiteOnline(nextStatus);
    setSiteOnlineState(nextStatus);
    showToast(
      nextStatus
        ? "🟢 Website is now LIVE (ONLINE)"
        : "🔴 Website is now STOPPED (OFFLINE)"
    );

  };


  // Handle Login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    const res = adminLogin(usernameInput, passwordInput);
    if (res.success) {
      setAuth(getAdminSession());
      loadData();
      showToast("Logged in as Akash");
    } else {
      setLoginError(res.message);
    }
  };

  // Handle Logout
  const handleLogout = () => {
    adminLogout();
    setAuth({ isAuthenticated: false, username: "", token: "", loginTime: 0 });
    showToast("Logged out");
  };

  // Handle Reset All Data
  const handleResetData = () => {
    if (window.confirm("Are you sure you want to reset all data (views, clicks, submissions) to 0?")) {
      clearAllAnalyticsData();
      loadData();
      setSelectedSubmission(null);
      showToast("All data has been reset to 0!");
    }
  };

  // Filtered Submissions
  const filteredSubmissions = useMemo(() => {
    return submissions.filter((s) => {
      if (typeFilter === "cancelled") {
        if (s.status !== "cancelled") return false;
      } else if (typeFilter !== "all" && s.type !== typeFilter) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const nameMatch = s.name.toLowerCase().includes(q);
        const emailMatch = (s.email || "").toLowerCase().includes(q);
        const phoneMatch = (s.phone || "").toLowerCase().includes(q);
        const detailsMatch = JSON.stringify(s.details).toLowerCase().includes(q);
        if (!nameMatch && !emailMatch && !phoneMatch && !detailsMatch) return false;
      }
      return true;
    });
  }, [submissions, typeFilter, searchQuery]);


  // Top Clicked Summary
  const topClicks = useMemo(() => {
    const map: Record<string, number> = {};
    clicks.forEach((c) => {
      const name = c.element || "Other";
      map[name] = (map[name] || 0) + 1;
    });
    return Object.entries(map)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }, [clicks]);

  // Page Views Breakdown
  const pageViewsSummary = useMemo(() => {
    const map: Record<string, number> = {};
    pageViews.forEach((v) => {
      const path = v.path || "/";
      map[path] = (map[path] || 0) + 1;
    });
    return Object.entries(map)
      .map(([path, count]) => ({ path, count }))
      .sort((a, b) => b.count - a.count);
  }, [pageViews]);

  // Unique Visitors count
  const uniqueVisitors = useMemo(() => {
    const set = new Set(pageViews.map((v) => v.sessionId));
    return set.size;
  }, [pageViews]);

  // =========================================================================
  // SIMPLE LOGIN SCREEN
  // =========================================================================
  if (!auth.isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0d0a08] px-4 text-[#f5ede6]">
        <div className="w-full max-w-sm rounded-2xl border border-stone-800 bg-[#16110e] p-7 shadow-2xl">
          <div className="text-center">
            <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-caramel/15 text-caramel">
              <Coffee className="size-6" />
            </div>
            <h1 className="mt-3 font-serif text-2xl font-semibold text-white">Admin Login</h1>
            <p className="mt-1 text-xs text-stone-400">Bad Moon Cafe Control Panel</p>
          </div>

          {loginError && (
            <div className="mt-4 flex items-center gap-2 rounded-lg bg-rose-950/50 p-2.5 text-xs text-rose-300 border border-rose-800/50">
              <AlertCircle className="size-4 shrink-0 text-rose-400" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} autoComplete="off" className="mt-5 space-y-3.5">
            <div>
              <label className="block text-xs font-medium text-stone-300">Username</label>
              <div className="mt-1 flex items-center rounded-lg border border-stone-700 bg-[#1f1712] px-3 py-2">
                <User className="mr-2 size-4 text-caramel" />
                <input
                  type="text"
                  required
                  autoComplete="off"
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  placeholder="Username"
                  className="w-full bg-transparent text-sm text-white focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-300">Password</label>
              <div className="mt-1 flex items-center rounded-lg border border-stone-700 bg-[#1f1712] px-3 py-2">
                <Lock className="mr-2 size-4 text-caramel" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="new-password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="Password"
                  className="w-full bg-transparent text-sm text-white focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-stone-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            <div className="rounded-xl border border-stone-800 bg-[#120d0a] p-3 text-xs text-stone-300 flex items-center justify-between">
              <div>
                <p className="text-[0.65rem] font-semibold uppercase tracking-wider text-stone-400">Admin Login Credentials</p>
                <p className="mt-0.5 font-mono text-xs text-stone-200">
                  User: <span className="text-caramel font-bold">akash</span> | Pass: <span className="text-caramel font-bold">akash98728</span>
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setUsernameInput("akash");
                  setPasswordInput("akash98728");
                }}
                className="shrink-0 rounded-lg border border-caramel/40 bg-caramel/15 px-2.5 py-1 text-[0.7rem] font-bold text-caramel hover:bg-caramel hover:text-espresso transition-all active:scale-95"
                title="Click to fill credentials into form"
              >
                Auto Fill
              </button>
            </div>

            <button
              type="submit"
              className="mt-2 w-full rounded-lg bg-caramel py-2.5 text-sm font-semibold text-espresso hover:bg-caramel-hover transition-colors"
            >
              Sign In
            </button>
          </form>

          <div className="mt-5 text-center">
            <Link to="/" className="inline-flex items-center gap-1 text-xs text-stone-400 hover:text-caramel">
              <ArrowLeft className="size-3" /> Back to Cafe Website
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // SIMPLE ADMIN DASHBOARD
  // =========================================================================
  return (
    <div className="min-h-screen bg-[#0d0a08] text-[#f5ede6]">
      {/* Simple Toast Notice */}
      {notice && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-2 rounded-lg bg-emerald-900/90 border border-emerald-600 px-4 py-2 text-xs font-medium text-white shadow-xl animate-in fade-in">
          <Check className="size-3.5 text-emerald-400" />
          <span>{notice}</span>
        </div>
      )}

      {/* 1. SIMPLE TOP NAVBAR */}
      <header className="border-b border-stone-800 bg-[#140f0c] px-4 py-3 sm:px-6">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-8 items-center justify-center rounded-lg bg-caramel/20 text-caramel">
              <Coffee className="size-4" />
            </div>
            <div>
              <h1 className="font-serif text-base font-semibold text-white leading-tight">
                {CAFE.name} Admin
              </h1>
              <p className="text-[0.65rem] text-stone-400">Logged in as: akash</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Quick Site ON / OFF Toggle Button in Header */}
            <button
              type="button"
              onClick={handleToggleSiteStatus}
              title={siteOnline ? "Click to Stop / Turn OFF Site" : "Click to Start / Turn ON Site"}
              className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-bold transition-all ${
                siteOnline
                  ? "border-emerald-500/60 bg-emerald-950/40 text-emerald-300 hover:bg-emerald-900/50 shadow-[0_0_12px_rgba(16,185,129,0.25)]"
                  : "border-rose-500/60 bg-rose-950/40 text-rose-300 hover:bg-rose-900/50 shadow-[0_0_12px_rgba(244,63,94,0.25)]"
              }`}
            >
              {siteOnline ? (
                <>
                  <span className="size-2 rounded-full bg-emerald-400 animate-ping" />
                  <Power className="size-3.5 text-emerald-400" />
                  <span>Site: ON</span>
                </>
              ) : (
                <>
                  <span className="size-2 rounded-full bg-rose-400 animate-ping" />
                  <PowerOff className="size-3.5 text-rose-400" />
                  <span>Site: OFF</span>
                </>
              )}
            </button>

            <Link
              to="/"
              className="inline-flex items-center gap-1.5 rounded-lg border border-stone-700 bg-[#1c1511] px-3 py-1.5 text-xs text-stone-200 hover:border-caramel hover:text-caramel transition-colors"
            >
              <Globe className="size-3.5" />
              <span className="hidden sm:inline">Website</span>
            </Link>

            <button
              type="button"
              onClick={() => exportSubmissionsToCsv(submissions)}
              title="Download Submissions CSV"
              className="inline-flex items-center gap-1.5 rounded-lg border border-stone-700 bg-[#1c1511] px-3 py-1.5 text-xs text-stone-200 hover:border-caramel hover:text-caramel transition-colors"
            >
              <Download className="size-3.5" />
              <span className="hidden sm:inline">Export CSV</span>
            </button>

            <button
              type="button"
              onClick={handleResetData}
              title="Reset all views, clicks, and submissions to 0"
              className="inline-flex items-center gap-1.5 rounded-lg border border-rose-900/50 bg-rose-950/30 px-3 py-1.5 text-xs text-rose-300 hover:bg-rose-900/40 transition-colors"
            >
              <Trash2 className="size-3.5 text-rose-400" />
              <span>Reset Data</span>
            </button>

            <button
              type="button"
              onClick={handleLogout}
              title="Logout"
              className="inline-flex items-center gap-1.5 rounded-lg border border-stone-700 bg-[#1c1511] px-3 py-1.5 text-xs text-stone-300 hover:text-white transition-colors"
            >
              <LogOut className="size-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* 2. SIMPLE MAIN CONTENT */}
      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 space-y-6">
        {/* WEBSITE ON / OFF CONTROL BANNER */}
        <div
          className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border p-4 sm:p-5 transition-all ${
            siteOnline
              ? "border-emerald-500/40 bg-gradient-to-r from-emerald-950/30 to-[#140f0c] shadow-[0_0_30px_rgba(16,185,129,0.12)]"
              : "border-rose-500/50 bg-gradient-to-r from-rose-950/40 to-[#140f0c] shadow-[0_0_30px_rgba(244,63,94,0.18)]"
          }`}
        >
          <div className="flex items-center gap-3.5">
            <div
              className={`flex size-12 shrink-0 items-center justify-center rounded-2xl border transition-all ${
                siteOnline
                  ? "border-emerald-500/50 bg-emerald-500/20 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                  : "border-rose-500/50 bg-rose-500/20 text-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.3)]"
              }`}
            >
              {siteOnline ? <Power className="size-6" /> : <PowerOff className="size-6" />}
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-serif text-base font-semibold text-white">
                  Website Status:
                </span>
                {siteOnline ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/50 bg-emerald-950/60 px-2.5 py-0.5 text-xs font-bold text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                    <span className="size-2 rounded-full bg-emerald-400 animate-ping" />
                    ONLINE / ACTIVE
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-500/50 bg-rose-950/60 px-2.5 py-0.5 text-xs font-bold text-rose-400 shadow-[0_0_10px_rgba(244,63,94,0.2)]">
                    <span className="size-2 rounded-full bg-rose-400 animate-ping" />
                    OFFLINE / STOPPED
                  </span>
                )}

              </div>
              <p className="mt-1 text-xs text-stone-400">
                {siteOnline
                  ? "Customers can currently visit the website, book tables, view the menu, and write reviews."
                  : "The website is currently STOPPED. Visitors will see the Maintenance notice. Only you (Admin) can access this panel."}
              </p>
            </div>
          </div>

          {/* Toggle Switch Button */}
          <div className="flex shrink-0 items-center">
            <button
              type="button"
              onClick={handleToggleSiteStatus}
              className={`inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold text-white transition-all active:scale-95 shadow-lg ${
                siteOnline
                  ? "bg-rose-600 hover:bg-rose-500 shadow-[0_0_20px_rgba(225,29,72,0.35)]"
                  : "bg-emerald-600 hover:bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.4)]"
              }`}
            >
              {siteOnline ? (
                <>
                  <PowerOff className="size-4" />
                  <span>Turn OFF Site (Stop Website)</span>
                </>
              ) : (
                <>
                  <Power className="size-4" />
                  <span>Turn ON Site (Start Website)</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* 4 SIMPLE STAT CARDS */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-xl border border-stone-800 bg-[#140f0c] p-4">
            <div className="flex items-center justify-between text-xs text-stone-400">
              <span>Page Views</span>
              <Eye className="size-4 text-blue-400" />
            </div>
            <p className="mt-2 font-serif text-2xl font-bold text-white">{pageViews.length}</p>
            <p className="mt-0.5 text-[0.65rem] text-stone-500">Website visits</p>
          </div>

          <div className="rounded-xl border border-stone-800 bg-[#140f0c] p-4">
            <div className="flex items-center justify-between text-xs text-stone-400">
              <span>Total Clicks</span>
              <MousePointerClick className="size-4 text-amber-400" />
            </div>
            <p className="mt-2 font-serif text-2xl font-bold text-white">{clicks.length}</p>
            <p className="mt-0.5 text-[0.65rem] text-stone-500">Button &amp; link clicks</p>
          </div>

          <div className="rounded-xl border border-emerald-500/40 bg-[#121c14] p-4 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
            <div className="flex items-center justify-between text-xs text-emerald-400">
              <span>Customer Orders</span>
              <ShoppingBag className="size-4 text-emerald-400" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="font-serif text-2xl font-bold text-emerald-400">
                {submissions.filter((s) => s.type === "order").length}
              </span>
              {submissions.filter((s) => s.type === "order" && s.status === "new").length > 0 && (
                <span className="rounded bg-emerald-500/20 px-1.5 py-0.5 text-[0.65rem] font-bold text-emerald-300">
                  {submissions.filter((s) => s.type === "order" && s.status === "new").length} New
                </span>
              )}
            </div>
            <p className="mt-0.5 text-[0.65rem] text-emerald-200/70">Online orders from menu</p>
          </div>

          <div className="rounded-xl border border-caramel/40 bg-[#18120e] p-4">
            <div className="flex items-center justify-between text-xs text-caramel">
              <span>Bookings &amp; Reviews</span>
              <Inbox className="size-4 text-caramel" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="font-serif text-2xl font-bold text-caramel">
                {submissions.filter((s) => s.type !== "order").length}
              </span>
              {submissions.filter((s) => s.type !== "order" && s.status === "new").length > 0 && (
                <span className="rounded bg-rose-500/20 px-1.5 py-0.5 text-[0.65rem] font-bold text-rose-400">
                  {submissions.filter((s) => s.type !== "order" && s.status === "new").length} New
                </span>
              )}
            </div>
            <p className="mt-0.5 text-[0.65rem] text-stone-400">Table reservations &amp; feedback</p>
          </div>
        </div>


        {/* SIMPLE TABS */}
        <div className="mt-6 flex border-b border-stone-800">
          <button
            type="button"
            onClick={() => setActiveTab("submissions")}
            className={`flex items-center gap-2 border-b-2 px-4 py-2.5 text-xs font-semibold transition-colors ${
              activeTab === "submissions"
                ? "border-caramel text-caramel"
                : "border-transparent text-stone-400 hover:text-white"
            }`}
          >
            <Inbox className="size-4" />
            <span>Form Submissions ({submissions.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("clicks")}
            className={`flex items-center gap-2 border-b-2 px-4 py-2.5 text-xs font-semibold transition-colors ${
              activeTab === "clicks"
                ? "border-caramel text-caramel"
                : "border-transparent text-stone-400 hover:text-white"
            }`}
          >
            <MousePointerClick className="size-4" />
            <span>Button Clicks ({clicks.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("views")}
            className={`flex items-center gap-2 border-b-2 px-4 py-2.5 text-xs font-semibold transition-colors ${
              activeTab === "views"
                ? "border-caramel text-caramel"
                : "border-transparent text-stone-400 hover:text-white"
            }`}
          >
            <Eye className="size-4" />
            <span>Page Views ({pageViews.length})</span>
          </button>
        </div>

        {/* ================================================================= */}
        {/* TAB 1: FORM SUBMISSIONS (Simple Table) */}
        {/* ================================================================= */}
        {activeTab === "submissions" && (
          <div className="mt-5 space-y-4">
            {/* Filters row */}
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              {/* Type pills */}
              <div className="flex flex-wrap items-center gap-1.5 text-xs">
                {(
                  [
                    { id: "all", label: `All (${submissions.length})` },
                    { id: "order", label: `🛍️ Orders (${submissions.filter((s) => s.type === "order").length})` },
                    { id: "reservation", label: `📅 Bookings (${submissions.filter((s) => s.type === "reservation").length})` },
                    { id: "review", label: `⭐ Reviews (${submissions.filter((s) => s.type === "review").length})` },
                    { id: "newsletter", label: `✉️ Newsletter (${submissions.filter((s) => s.type === "newsletter").length})` },
                    { id: "cancelled", label: `🚫 Cancelled (${submissions.filter((s) => s.status === "cancelled").length})` },
                  ] as const

                ).map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setTypeFilter(t.id)}
                    className={`rounded-lg px-3 py-1.5 font-medium transition-colors ${
                      typeFilter === t.id
                        ? "bg-caramel text-espresso font-semibold shadow-md"
                        : "bg-[#16110e] text-stone-300 hover:text-white border border-stone-800"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {/* Search box */}
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-stone-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search name, phone, item..."
                  className="w-full sm:w-56 rounded-lg border border-stone-700 bg-[#16110e] pl-8 pr-3 py-1.5 text-xs text-white placeholder:text-stone-500 focus:border-caramel focus:outline-none"
                />
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto rounded-xl border border-stone-800 bg-[#140f0c]">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-stone-800 bg-[#18120e] text-[0.65rem] uppercase tracking-wider text-stone-400">
                  <tr>
                    <th className="px-4 py-3">Type</th>
                    <th className="px-4 py-3">Customer Name</th>
                    <th className="px-4 py-3">Mobile Number</th>
                    <th className="px-4 py-3">Email Address</th>
                    <th className="px-4 py-3">Order / Booking Details</th>
                    <th className="px-4 py-3">Submitted At</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-800/60 text-stone-300">
                  {filteredSubmissions.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-10 text-center text-stone-500">
                        {submissions.length === 0
                          ? "No submissions or orders yet. Order from the menu or fill any form to see it live."
                          : "No submissions matched your search."}
                      </td>
                    </tr>
                  ) : (
                    filteredSubmissions.map((sub) => (
                      <tr key={sub.id} className="hover:bg-stone-900/40 transition-colors">
                        <td className="px-4 py-3">
                          {sub.type === "order" ? (
                            <span className="inline-flex items-center gap-1 rounded px-2 py-0.5 text-[0.65rem] font-bold uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                              <ShoppingBag className="size-3" /> ORDER
                            </span>
                          ) : sub.type === "reservation" ? (
                            <span className="rounded px-2 py-0.5 text-[0.65rem] font-bold uppercase bg-caramel/20 text-caramel border border-caramel/40">
                              📅 BOOKING
                            </span>
                          ) : sub.type === "review" ? (
                            <span className="rounded px-2 py-0.5 text-[0.65rem] font-bold uppercase bg-amber-500/20 text-amber-400 border border-amber-500/40">
                              ⭐ REVIEW
                            </span>
                          ) : (
                            <span className="rounded px-2 py-0.5 text-[0.65rem] font-bold uppercase bg-purple-500/20 text-purple-400 border border-purple-500/40">
                              ✉️ NEWSLETTER
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 font-semibold text-white">{sub.name}</td>
                        <td className="px-4 py-3">
                          {sub.phone ? (
                            <a href={`tel:${sub.phone}`} className="inline-flex items-center gap-1 text-caramel hover:underline font-medium">
                              <Phone className="size-3" />
                              <span>{sub.phone}</span>
                            </a>
                          ) : (
                            <span className="text-stone-500">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          {sub.email ? (
                            <a href={`mailto:${sub.email}`} className="inline-flex items-center gap-1 text-stone-300 hover:text-white">
                              <Mail className="size-3" />
                              <span>{sub.email}</span>
                            </a>
                          ) : (
                            <span className="text-stone-500">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3 max-w-xs text-stone-300">
                          {sub.type === "order" && (
                            <div className="space-y-0.5">
                              <span className="inline-block font-semibold text-emerald-400">
                                🛍️ {sub.details?.["quantity"] || 1}x {sub.details?.["item"]} ({sub.details?.["totalAmount"] || sub.details?.["unitPrice"]})
                              </span>
                              <div className="text-[0.65rem] text-stone-400">
                                <span className="text-caramel font-medium">{sub.details?.["orderType"] || "Takeaway"}</span>
                                {sub.details?.["tableOrAddress"] && ` • ${sub.details?.["tableOrAddress"]}`}
                                {sub.details?.["notes"] && sub.details?.["notes"] !== "None" && (
                                  <span className="text-stone-300"> • &ldquo;{sub.details?.["notes"]}&rdquo;</span>
                                )}
                              </div>
                            </div>
                          )}
                          {sub.type === "reservation" && (
                            <span className="inline-block rounded bg-stone-900/80 px-2 py-1 text-[0.7rem] border border-stone-800">
                              📅 <strong>{sub.details?.["date"]}</strong> at ⏰ <strong>{sub.details?.["time"]}</strong> ({sub.details?.["guests"]} guests)
                            </span>
                          )}
                          {sub.type === "review" && (
                            <span>
                              {sub.details?.["rating"] || 5}★: &ldquo;{(sub.details?.["comment"] || "").slice(0, 35)}&rdquo;
                            </span>
                          )}
                          {sub.type === "newsletter" && <span>Newsletter Subscriber</span>}

                          {/* Live Cancelled Indicator */}
                          {sub.status === "cancelled" && (
                            <div className="mt-1.5 inline-flex items-center gap-1 rounded bg-rose-950/80 border border-rose-500/50 px-2 py-0.5 text-[0.65rem] text-rose-300 font-bold">
                              <AlertTriangle className="size-3 text-rose-400 shrink-0" />
                              <span>
                                {sub.details?.["cancelledBy"] === "customer"
                                  ? "Cancelled by Customer"
                                  : "Cancelled by Cafe"}
                              </span>
                            </div>
                          )}

                        </td>
                        <td className="px-4 py-3 text-[0.7rem] text-stone-400">
                          {new Date(sub.timestamp).toLocaleDateString()} {new Date(sub.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </td>
                        <td className="px-4 py-3">
                          <select
                            value={sub.status}
                            onChange={(e) => {
                              const newStatus = e.target.value as SubmissionStatus;
                              if (newStatus === "cancelled") {
                                cancelOrder(sub.id, "cafe", "Cancelled by Admin via Dashboard");
                              } else {
                                updateSubmissionStatus(sub.id, newStatus);
                              }
                              loadData();
                              showToast(`Status updated to ${newStatus}`);
                            }}
                            className={`rounded border px-2 py-1 text-[0.65rem] uppercase font-bold focus:outline-none ${
                              sub.status === "completed"
                                ? "border-emerald-500/50 bg-emerald-950/40 text-emerald-400"
                                : sub.status === "preparing"
                                ? "border-amber-500/50 bg-amber-950/40 text-amber-400"
                                : sub.status === "confirmed"
                                ? "border-blue-500/50 bg-blue-950/40 text-blue-400"
                                : sub.status === "cancelled"
                                ? "border-rose-500/50 bg-rose-950/40 text-rose-400 font-extrabold"
                                : "border-stone-700 bg-[#1c1511] text-white"
                            }`}
                          >
                            <option value="new">NEW</option>
                            <option value="preparing">PREPARING</option>
                            <option value="completed">COMPLETED</option>
                            <option value="confirmed">CONFIRMED</option>
                            <option value="reviewed">REVIEWED</option>
                            <option value="cancelled">CANCELLED</option>
                            <option value="archived">ARCHIVED</option>
                          </select>
                        </td>

                        <td className="px-4 py-3 text-right">
                          <button
                            type="button"
                            onClick={() => setSelectedSubmission(sub)}
                            className="rounded bg-stone-800 px-2 py-1 text-[0.7rem] text-stone-200 hover:bg-caramel hover:text-espresso mr-1.5 transition-colors"
                          >
                            View
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (window.confirm("Delete this submission?")) {
                                deleteSubmission(sub.id);
                                loadData();
                                showToast("Submission deleted");
                              }
                            }}
                            className="rounded p-1 text-stone-500 hover:text-rose-400 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}


        {/* ================================================================= */}
        {/* TAB 2: BUTTON CLICKS (Simple Ranking & Stream) */}
        {/* ================================================================= */}
        {activeTab === "clicks" && (
          <div className="mt-5 space-y-6">
            {/* Top Clicks Summary */}
            <div className="rounded-xl border border-stone-800 bg-[#140f0c] p-4">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-caramel">
                Most Clicked Buttons on Website
              </h2>
              <div className="mt-3 space-y-2">
                {topClicks.length === 0 ? (
                  <p className="text-xs text-stone-500 py-3">No clicks recorded yet.</p>
                ) : (
                  topClicks.map((item, idx) => {
                    const max = topClicks[0]?.count || 1;
                    const pct = Math.round((item.count / max) * 100);
                    return (
                      <div key={item.name} className="flex items-center justify-between gap-4 text-xs">
                        <div className="flex items-center gap-2 min-w-[160px]">
                          <span className="text-stone-500 font-mono text-[0.7rem]">#{idx + 1}</span>
                          <span className="font-medium text-white">{item.name}</span>
                        </div>
                        <div className="h-2 flex-1 rounded-full bg-stone-800 overflow-hidden">
                          <div className="h-full bg-caramel rounded-full" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="font-bold text-caramel min-w-[50px] text-right">
                          {item.count} {item.count === 1 ? "click" : "clicks"}
                        </span>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Click Log Table */}
            <div className="rounded-xl border border-stone-800 bg-[#140f0c] overflow-x-auto">
              <div className="px-4 py-3 border-b border-stone-800 flex items-center justify-between">
                <h2 className="text-xs font-semibold uppercase tracking-wider text-stone-400">
                  Recent Clicks Log
                </h2>
                <button
                  type="button"
                  onClick={() => exportClicksToCsv(clicks)}
                  className="text-xs text-caramel hover:underline"
                >
                  Export Clicks (CSV)
                </button>
              </div>

              <table className="w-full text-left text-xs">
                <thead className="border-b border-stone-800 bg-[#18120e] text-[0.65rem] uppercase tracking-wider text-stone-400">
                  <tr>
                    <th className="px-4 py-2.5">Button / Element</th>
                    <th className="px-4 py-2.5">Category</th>
                    <th className="px-4 py-2.5">Target / Link</th>
                    <th className="px-4 py-2.5">Page Path</th>
                    <th className="px-4 py-2.5">Date &amp; Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-800/60 text-stone-300">
                  {clicks.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-stone-500">
                        No clicks recorded yet.
                      </td>
                    </tr>
                  ) : (
                    clicks.slice(0, 50).map((c) => (
                      <tr key={c.id} className="hover:bg-stone-900/40">
                        <td className="px-4 py-2.5 font-medium text-white">{c.element}</td>
                        <td className="px-4 py-2.5">
                          <span className="rounded bg-stone-800 px-2 py-0.5 text-[0.65rem] text-stone-300">
                            {c.category}
                          </span>
                        </td>
                        <td className="px-4 py-2.5 font-mono text-[0.7rem] text-stone-400 truncate max-w-[200px]">
                          {c.target || "—"}
                        </td>
                        <td className="px-4 py-2.5 font-mono text-stone-400">{c.path}</td>
                        <td className="px-4 py-2.5 text-stone-500">
                          {new Date(c.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 3: PAGE VIEWS (Simple Breakdown & Log) */}
        {/* ================================================================= */}
        {activeTab === "views" && (
          <div className="mt-5 space-y-6">
            {/* Views Breakdown by Page */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-stone-800 bg-[#140f0c] p-4">
                <h2 className="text-xs font-semibold uppercase tracking-wider text-caramel">
                  Views by Page URL
                </h2>
                <div className="mt-3 space-y-2">
                  {pageViewsSummary.length === 0 ? (
                    <p className="text-xs text-stone-500 py-3">No page views recorded yet.</p>
                  ) : (
                    pageViewsSummary.map((item) => (
                      <div key={item.path} className="flex justify-between items-center text-xs py-1 border-b border-stone-800/50">
                        <span className="font-mono text-stone-200">{item.path}</span>
                        <span className="font-bold text-white">{item.count} views</span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="rounded-xl border border-stone-800 bg-[#140f0c] p-4">
                <h2 className="text-xs font-semibold uppercase tracking-wider text-caramel">
                  Traffic Summary
                </h2>
                <div className="mt-3 space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-stone-800/50">
                    <span className="text-stone-400">Total Page Hits:</span>
                    <span className="font-bold text-white">{pageViews.length}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-stone-800/50">
                    <span className="text-stone-400">Unique Visitor Sessions:</span>
                    <span className="font-bold text-white">{uniqueVisitors}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-stone-400">Average Views per Visitor:</span>
                    <span className="font-bold text-white">
                      {uniqueVisitors > 0 ? (pageViews.length / uniqueVisitors).toFixed(1) : "0"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Full Page Views Log */}
            <div className="rounded-xl border border-stone-800 bg-[#140f0c] overflow-x-auto">
              <div className="px-4 py-3 border-b border-stone-800">
                <h2 className="text-xs font-semibold uppercase tracking-wider text-stone-400">
                  Page Views Audit History
                </h2>
              </div>
              <table className="w-full text-left text-xs">
                <thead className="border-b border-stone-800 bg-[#18120e] text-[0.65rem] uppercase tracking-wider text-stone-400">
                  <tr>
                    <th className="px-4 py-2.5">Page Path</th>
                    <th className="px-4 py-2.5">Page Title</th>
                    <th className="px-4 py-2.5">Device</th>
                    <th className="px-4 py-2.5">Date &amp; Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-800/60 text-stone-300">
                  {pageViews.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-stone-500">
                        No page views recorded yet.
                      </td>
                    </tr>
                  ) : (
                    pageViews.slice(0, 50).map((pv) => (
                      <tr key={pv.id} className="hover:bg-stone-900/40">
                        <td className="px-4 py-2.5 font-mono text-caramel">{pv.path}</td>
                        <td className="px-4 py-2.5 text-white truncate max-w-xs">{pv.title}</td>
                        <td className="px-4 py-2.5 text-stone-400">{pv.device}</td>
                        <td className="px-4 py-2.5 text-stone-500">
                          {new Date(pv.timestamp).toLocaleDateString()} {new Date(pv.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* 3. SIMPLE SUBMISSION DETAILS MODAL */}
      {selectedSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="relative w-full max-w-md rounded-2xl border border-stone-700 bg-[#16110e] p-6 text-white shadow-2xl">
            <button
              onClick={() => setSelectedSubmission(null)}
              className="absolute right-4 top-4 rounded-full p-1 text-stone-400 hover:text-white"
            >
              <X className="size-5" />
            </button>

            <div className="flex items-center gap-2.5">
              <span className="rounded bg-caramel/20 px-2 py-0.5 text-xs font-bold uppercase text-caramel">
                {selectedSubmission.type}
              </span>
              <h2 className="font-serif text-lg font-semibold text-white">{selectedSubmission.name}</h2>
            </div>

            <div className="mt-4 space-y-2 rounded-xl bg-black/40 p-3.5 text-xs">
              <div className="flex justify-between">
                <span className="text-stone-400">Date Submitted:</span>
                <span>{new Date(selectedSubmission.timestamp).toLocaleString()}</span>
              </div>
              {selectedSubmission.phone && (
                <div className="flex justify-between">
                  <span className="text-stone-400">Mobile Number:</span>
                  <a href={`tel:${selectedSubmission.phone}`} className="text-caramel font-semibold underline">
                    {selectedSubmission.phone}
                  </a>
                </div>
              )}
              {selectedSubmission.email && (
                <div className="flex justify-between">
                  <span className="text-stone-400">Email Address:</span>
                  <a href={`mailto:${selectedSubmission.email}`} className="text-caramel font-semibold underline">
                    {selectedSubmission.email}
                  </a>
                </div>
              )}
            </div>


            {/* Custom Details */}
            <div className="mt-3 space-y-1.5 rounded-xl bg-[#1f1712] p-3.5 text-xs">
              <p className="font-semibold text-stone-300">Submitted Details:</p>

              {/* Cancellation Alert Banner */}
              {selectedSubmission.status === "cancelled" && (
                <div className="rounded-xl border border-rose-500/60 bg-rose-950/40 p-3.5 text-xs text-rose-200 space-y-1">
                  <div className="flex items-center gap-2">
                    <Ban className="size-4 text-rose-400 shrink-0" />
                    <span className="font-bold text-rose-300">
                      {selectedSubmission.details?.["cancelledBy"] === "customer"
                        ? "Order Cancelled by Customer"
                        : "Order Cancelled by Cafe Management"}
                    </span>

                  </div>
                  {selectedSubmission.details?.["cancelledAt"] && (
                    <p className="text-[0.7rem] text-stone-300">
                      <strong>Cancelled At:</strong> {new Date(selectedSubmission.details["cancelledAt"]).toLocaleString()}
                    </p>
                  )}
                  {selectedSubmission.details?.["cancellationReason"] && (
                    <p className="text-[0.7rem] text-rose-300/80">
                      <strong>Reason:</strong> {selectedSubmission.details["cancellationReason"]}
                    </p>
                  )}
                </div>
              )}

              {selectedSubmission.type === "order" && (
                <div className="space-y-2 text-stone-200">
                  <div className="rounded-lg bg-emerald-950/30 border border-emerald-500/30 p-2.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-emerald-400">Item Ordered:</span>
                      <span className="font-serif text-sm font-bold text-white">
                        {selectedSubmission.details?.["totalAmount"] || selectedSubmission.details?.["unitPrice"]}
                      </span>
                    </div>
                    <p className="mt-1 font-semibold text-white">
                      🛍️ {selectedSubmission.details?.["quantity"] || 1}x {selectedSubmission.details?.["item"]}
                    </p>
                    <p className="text-[0.7rem] text-stone-400">
                      Unit price: {selectedSubmission.details?.["unitPrice"]} each
                    </p>
                  </div>

                  <div className="space-y-1 pt-1">
                    <p><strong>Order Type:</strong> <span className="text-caramel font-semibold">{selectedSubmission.details?.["orderType"]}</span></p>
                    <p><strong>Table / Address:</strong> {selectedSubmission.details?.["tableOrAddress"]}</p>
                    {selectedSubmission.details?.["notes"] && selectedSubmission.details?.["notes"] !== "None" && (
                      <p className="rounded bg-black/40 p-2 text-stone-300">
                        <strong>Special Instructions:</strong> {selectedSubmission.details?.["notes"]}
                      </p>
                    )}
                  </div>

                  {/* Status update buttons */}
                  <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-stone-800">
                    <button
                      type="button"
                      onClick={() => {
                        updateSubmissionStatus(selectedSubmission.id, "preparing");
                        loadData();
                        setSelectedSubmission({ ...selectedSubmission, status: "preparing" });
                        showToast("Status updated to: PREPARING");
                      }}
                      className="rounded-lg bg-amber-600/80 px-2.5 py-1 text-[0.7rem] font-bold text-white hover:bg-amber-500 transition-colors"
                    >
                      🍳 Mark Preparing
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        updateSubmissionStatus(selectedSubmission.id, "completed");
                        loadData();
                        setSelectedSubmission({ ...selectedSubmission, status: "completed" });
                        showToast("Status updated to: COMPLETED");
                      }}
                      className="rounded-lg bg-emerald-600 px-2.5 py-1 text-[0.7rem] font-bold text-white hover:bg-emerald-500 transition-colors"
                    >
                      ✅ Mark Completed
                    </button>

                    {selectedSubmission.status !== "cancelled" && (
                      <button
                        type="button"
                        onClick={() => {
                          if (window.confirm("Cancel this order from cafe side? Customer will be notified.")) {
                            cancelOrder(selectedSubmission.id, "cafe", "Cancelled by Cafe Management");
                            loadData();
                            setSelectedSubmission({
                              ...selectedSubmission,
                              status: "cancelled",
                              details: {
                                ...selectedSubmission.details,
                                cancelledBy: "cafe",
                                cancelledAt: new Date().toISOString(),
                                cancellationReason: "Cancelled by Cafe Management",
                              },
                            });
                            showToast("Order Cancelled by Cafe");
                          }
                        }}
                        className="rounded-lg border border-rose-600/50 bg-rose-950/40 px-2.5 py-1 text-[0.7rem] font-bold text-rose-300 hover:bg-rose-900/50 hover:text-white transition-colors"
                      >
                        🚫 Cancel Order
                      </button>
                    )}
                  </div>
                </div>
              )}


              {selectedSubmission.type === "reservation" && (
                <div className="space-y-1 text-stone-200">
                  <p><strong>Reserved Date:</strong> {selectedSubmission.details?.["date"]}</p>
                  <p><strong>Reserved Time:</strong> {selectedSubmission.details?.["time"]}</p>
                  <p><strong>Guests:</strong> {selectedSubmission.details?.["guests"]}</p>
                </div>
              )}
              {selectedSubmission.type === "review" && (
                <div className="space-y-1 text-stone-200">
                  <p><strong>Rating:</strong> {selectedSubmission.details?.["rating"]} / 5 Stars</p>
                  <p className="italic bg-black/30 p-2 rounded text-stone-300">
                    &ldquo;{selectedSubmission.details?.["comment"]}&rdquo;
                  </p>
                </div>
              )}
              {selectedSubmission.type === "newsletter" && (
                <p>Newsletter Email: {selectedSubmission.email}</p>
              )}
            </div>



            {/* Actions */}
            <div className="mt-5 flex items-center justify-between gap-3 border-t border-stone-800 pt-4">
              <button
                type="button"
                onClick={() => {
                  deleteSubmission(selectedSubmission.id);
                  loadData();
                  setSelectedSubmission(null);
                  showToast("Deleted");
                }}
                className="text-xs text-rose-400 hover:underline"
              >
                Delete
              </button>

              <div className="flex gap-2">
                {selectedSubmission.phone && (
                  <a
                    href={`tel:${selectedSubmission.phone}`}
                    className="rounded-lg bg-caramel px-3.5 py-1.5 text-xs font-semibold text-espresso hover:bg-caramel-hover"
                  >
                    Call Customer
                  </a>
                )}
                <button
                  type="button"
                  onClick={() => setSelectedSubmission(null)}
                  className="rounded-lg border border-stone-700 px-3.5 py-1.5 text-xs text-stone-300 hover:text-white"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
