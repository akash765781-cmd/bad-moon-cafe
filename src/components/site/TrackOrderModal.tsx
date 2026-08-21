import { useState, useEffect, useMemo } from "react";
import {
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  Ban,
  Check,
  CheckCircle2,
  Clock,
  Coffee,
  Copy,
  FileText,
  MapPin,
  Package,
  Phone,
  RefreshCw,
  Search,
  ShoppingBag,
  Sparkles,
  User,
  Utensils,
  X,
} from "lucide-react";
import {
  cancelOrder,
  findOrderByIdOrPhone,
  getAllSubmissions,
  getLatestCustomerOrder,
  type FormSubmission,
} from "@/lib/analytics";
import { CAFE } from "@/lib/cafe";

interface TrackOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialQuery?: string;
  initialMode?: "track" | "cancel";
}

export function TrackOrderModal({
  isOpen,
  onClose,
  initialQuery = "",
  initialMode = "track",
}: TrackOrderModalProps) {
  const [activeTab, setActiveTab] = useState<"track" | "cancel">(initialMode);
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [currentOrder, setCurrentOrder] = useState<FormSubmission | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [cancelReason, setCancelReason] = useState("Placed order by mistake");
  const [customReason, setCustomReason] = useState("");
  const [cancelSuccessMsg, setCancelSuccessMsg] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState(false);
  const [isAutoLoaded, setIsAutoLoaded] = useState(false);

  // Retrieve recent orders for quick-select
  const recentOrders = useMemo(() => {
    if (typeof window === "undefined" || !isOpen) return [];
    const all = getAllSubmissions();
    return all.filter((s) => s.type === "order").slice(0, 5);
  }, [isOpen]);

  const performSearch = (q: string) => {
    if (!q || !q.trim()) return;
    const result = findOrderByIdOrPhone(q);
    setCurrentOrder(result);
    setHasSearched(true);
    setCancelSuccessMsg(null);
  };

  // Auto-choose and autofill recent order when opening
  useEffect(() => {
    if (!isOpen) {
      setIsAutoLoaded(false);
      return;
    }

    if (initialQuery) {
      setSearchQuery(initialQuery);
      performSearch(initialQuery);
      setIsAutoLoaded(false);
    } else {
      // Auto-choose latest order placed on this device / cafe session
      const latestOrder = getLatestCustomerOrder();
      if (latestOrder) {
        setSearchQuery(latestOrder.id);
        setCurrentOrder(latestOrder);
        setHasSearched(true);
        setIsAutoLoaded(true);
      } else {
        setCurrentOrder(null);
        setHasSearched(false);
        setIsAutoLoaded(false);
      }
    }
  }, [initialQuery, isOpen]);

  useEffect(() => {
    if (initialMode) {
      setActiveTab(initialMode);
    }
  }, [initialMode, isOpen]);

  // Live listen for order updates
  useEffect(() => {
    const handleUpdate = () => {
      if (searchQuery.trim()) {
        const result = findOrderByIdOrPhone(searchQuery);
        if (result) setCurrentOrder(result);
      }
    };
    window.addEventListener("cafe_analytics_change", handleUpdate);
    window.addEventListener("cafe_order_cancelled", handleUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      window.removeEventListener("cafe_analytics_change", handleUpdate);
      window.removeEventListener("cafe_order_cancelled", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, [searchQuery]);

  if (!isOpen) return null;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(searchQuery);
  };

  const handleCopyId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handleExecuteCancellation = () => {
    if (!currentOrder) return;
    const finalReason =
      cancelReason === "Other" && customReason.trim()
        ? customReason.trim()
        : cancelReason;

    const success = cancelOrder(currentOrder.id, "customer", finalReason);
    if (success) {
      const updated = findOrderByIdOrPhone(currentOrder.id);
      setCurrentOrder(updated);
      setCancelSuccessMsg("Order Cancelled Successfully");
    }
  };


  const isCancelled = currentOrder?.status === "cancelled";
  const isCompleted = currentOrder?.status === "completed";
  const isPreparing = currentOrder?.status === "preparing";
  const isNew = currentOrder?.status === "new" || currentOrder?.status === "confirmed";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/85 p-3.5 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-xl overflow-hidden rounded-3xl border border-caramel/40 bg-[#130e0b] p-5 shadow-2xl sm:p-7 text-stone-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-2 text-stone-400 transition-colors hover:bg-stone-800 hover:text-white"
          aria-label="Close modal"
        >
          <X className="size-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-full bg-caramel/20 text-caramel">
            <ShoppingBag className="size-4" />
          </span>
          <p className="font-script text-2xl text-caramel">Bad Moon Cafe</p>
        </div>
        <h2 className="mt-1 font-serif text-2xl font-semibold text-white sm:text-3xl">
          Order Management Portal
        </h2>
        <p className="mt-0.5 text-xs text-stone-400">
          Track live kitchen status or manage cancellation of your order.
        </p>

        {/* OPTION SWITCHER: TRACK ORDER vs CANCEL ORDER */}
        <div className="mt-4 grid grid-cols-2 gap-1.5 rounded-2xl border border-stone-800 bg-black/50 p-1">
          <button
            type="button"
            onClick={() => setActiveTab("track")}
            className={`flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold transition-all ${
              activeTab === "track"
                ? "bg-caramel text-espresso shadow-md"
                : "text-stone-400 hover:text-white"
            }`}
          >
            <Search className="size-3.5" />
            <span>1. Track Order Status</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("cancel")}
            className={`flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold transition-all ${
              activeTab === "cancel"
                ? "bg-rose-600 text-white shadow-md"
                : "text-stone-400 hover:text-rose-400"
            }`}
          >
            <Ban className="size-3.5" />
            <span>2. Cancel Order</span>
          </button>
        </div>

        {/* SEARCH BAR (ORDER ID OR PHONE NUMBER) */}
        <form onSubmit={handleSearchSubmit} className="mt-4">
          <label className="block text-[0.7rem] font-bold uppercase tracking-wider text-stone-400 mb-1.5">
            Look Up Order (Order ID or Mobile Number):
          </label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-stone-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="e.g. sub_17... or 9876543210"
                className="w-full rounded-xl border border-stone-700 bg-[#1c1511] pl-10 pr-3 py-2.5 text-xs text-white placeholder:text-stone-500 focus:border-caramel focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="rounded-xl bg-caramel px-5 py-2.5 text-xs font-bold text-espresso hover:bg-caramel-hover transition-all shadow-md active:scale-95 shrink-0"
            >
              Search
            </button>
          </div>
        </form>

        {/* RECENT ORDERS QUICK TAGS / SWITCHER */}
        {recentOrders.length > 0 && (
          <div className="mt-3 rounded-xl border border-stone-800/80 bg-black/30 p-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[0.65rem] font-semibold text-stone-400">
                {isAutoLoaded ? "⚡ Auto-loaded your recent order:" : "Recent Orders on this device:"}
              </span>
              {currentOrder && (
                <button
                  type="button"
                  onClick={() => {
                    setCurrentOrder(null);
                    setSearchQuery("");
                    setHasSearched(false);
                    setIsAutoLoaded(false);
                  }}
                  className="text-[0.65rem] text-caramel hover:underline"
                >
                  Search another
                </button>
              )}
            </div>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {recentOrders.map((ord) => {
                const isSelected = currentOrder?.id === ord.id;
                return (
                  <button
                    key={ord.id}
                    type="button"
                    onClick={() => {
                      setSearchQuery(ord.id);
                      performSearch(ord.id);
                      setIsAutoLoaded(false);
                    }}
                    className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[0.68rem] transition-all ${
                      isSelected
                        ? "border border-caramel bg-caramel/20 text-caramel font-bold shadow-sm"
                        : "border border-stone-800 bg-[#1c1511] text-stone-400 hover:border-stone-700 hover:text-white"
                    }`}
                  >
                    <span>🛍️ {ord.details?.["item"] || "Order"}</span>
                    <span className="font-mono text-[0.6rem] opacity-70">({ord.id.slice(-6)})</span>
                    {ord.status === "cancelled" && (
                      <span className="rounded bg-rose-500/20 px-1 py-0.2 text-[0.55rem] text-rose-400 font-bold">
                        Cancelled
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* NOT FOUND ALERT */}
        {hasSearched && !currentOrder && (
          <div className="mt-5 rounded-2xl border border-stone-800 bg-[#1c1511] p-6 text-center">
            <AlertCircle className="mx-auto size-10 text-stone-500" />
            <p className="mt-2 font-serif text-base font-semibold text-white">
              No Order Found
            </p>
            <p className="mt-1 text-xs text-stone-400 max-w-sm mx-auto">
              We couldn&apos;t find an order matching &ldquo;{searchQuery}&rdquo;. Please verify your phone number or Order ID.
            </p>
          </div>
        )}

        {/* ORDER DETAILS & ACTION CARD */}
        {currentOrder && (

          <div className="mt-5 space-y-4 max-h-[60vh] overflow-y-auto pr-1">
            {/* SUCCESS BANNER UPON CANCELLATION */}
            {cancelSuccessMsg && (
              <div className="flex items-center gap-2 rounded-2xl border border-rose-500/60 bg-rose-950/60 p-3.5 text-xs text-rose-200 shadow-xl animate-in fade-in">
                <CheckCircle2 className="size-5 text-rose-400 shrink-0" />
                <span className="font-semibold">{cancelSuccessMsg}</span>
              </div>
            )}

            {/* MAIN ORDER SUMMARY CARD */}
            <div
              className={`rounded-2xl border p-4 sm:p-5 transition-all ${
                isCancelled
                  ? "border-rose-500/50 bg-rose-950/20"
                  : isCompleted
                  ? "border-emerald-500/50 bg-emerald-950/20"
                  : isPreparing
                  ? "border-amber-500/50 bg-amber-950/20"
                  : "border-caramel/40 bg-[#1a130f]"
              }`}
            >
              {/* TOP ROW: ORDER ID, DATE & STATUS */}
              <div className="flex flex-wrap items-start justify-between gap-2 border-b border-stone-800/80 pb-3.5">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[0.65rem] font-bold uppercase tracking-wider text-stone-400">
                      Order ID:
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopyId(currentOrder.id)}
                      className="inline-flex items-center gap-1 rounded bg-black/40 px-1.5 py-0.5 text-xs font-mono font-bold text-caramel hover:text-white transition-colors"
                      title="Click to copy Order ID"
                    >
                      <span>{currentOrder.id}</span>
                      {copiedId ? <Check className="size-3 text-emerald-400" /> : <Copy className="size-3" />}
                    </button>
                  </div>
                  <p className="mt-0.5 text-[0.68rem] text-stone-400">
                    Placed on {new Date(currentOrder.timestamp).toLocaleDateString()} at{" "}
                    {new Date(currentOrder.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>

                {/* STATUS BADGE */}
                <div>
                  {isCancelled ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-500/60 bg-rose-950/80 px-3 py-1 text-xs font-bold text-rose-300 shadow-sm">
                      <Ban className="size-3.5 text-rose-400" /> CANCELLED
                    </span>
                  ) : isCompleted ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/60 bg-emerald-950/80 px-3 py-1 text-xs font-bold text-emerald-300 shadow-sm">
                      <Check className="size-3.5 text-emerald-400" /> COMPLETED / READY
                    </span>
                  ) : isPreparing ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/60 bg-amber-950/80 px-3 py-1 text-xs font-bold text-amber-300 shadow-sm animate-pulse">
                      <Coffee className="size-3.5 text-amber-400" /> IN PREPARATION
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-500/60 bg-blue-950/80 px-3 py-1 text-xs font-bold text-blue-300 shadow-sm">
                      <Clock className="size-3.5 text-blue-400" /> ORDER RECEIVED
                    </span>
                  )}
                </div>
              </div>

              {/* ------------------------------------------------------------- */}
              {/* TAB 1 CONTENT: TRACK ORDER TIMELINE */}
              {/* ------------------------------------------------------------- */}
              {activeTab === "track" && (
                <div className="mt-4 space-y-4">
                  {/* Visual Stepper Timeline */}
                  {!isCancelled ? (
                    <div className="space-y-2">
                      <div className="grid grid-cols-3 gap-2 text-center text-xs">
                        <div
                          className={`rounded-xl p-2.5 border transition-all ${
                            isNew || isPreparing || isCompleted
                              ? "border-emerald-500/60 bg-emerald-950/30 text-emerald-300 font-bold"
                              : "border-stone-800 text-stone-500"
                          }`}
                        >
                          <CheckCircle2 className="mx-auto size-5 mb-1 text-emerald-400" />
                          <span>1. Order Placed</span>
                        </div>

                        <div
                          className={`rounded-xl p-2.5 border transition-all ${
                            isPreparing
                              ? "border-amber-500/70 bg-amber-950/40 text-amber-300 font-bold shadow-[0_0_12px_rgba(245,158,11,0.2)] animate-pulse"
                              : isCompleted
                              ? "border-emerald-500/60 bg-emerald-950/30 text-emerald-300 font-bold"
                              : "border-stone-800 text-stone-500"
                          }`}
                        >
                          <Coffee className="mx-auto size-5 mb-1 text-amber-400" />
                          <span>2. Preparing</span>
                        </div>

                        <div
                          className={`rounded-xl p-2.5 border transition-all ${
                            isCompleted
                              ? "border-emerald-500/70 bg-emerald-950/40 text-emerald-300 font-bold shadow-[0_0_12px_rgba(16,185,129,0.2)]"
                              : "border-stone-800 text-stone-500"
                          }`}
                        >
                          <Check className="mx-auto size-5 mb-1 text-emerald-400" />
                          <span>3. Ready / Served</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-[0.68rem] text-stone-400 pt-1">
                        <span>Status: {isCompleted ? "Order is ready for you!" : isPreparing ? "Barista is brewing your coffee..." : "Received by cafe staff"}</span>
                        <span className="text-caramel font-semibold">Avg. Prep: ~8-12 mins</span>
                      </div>
                    </div>
                  ) : (
                    /* Cancellation Banner in Track Mode */
                    <div className="rounded-xl border border-rose-500/40 bg-rose-950/40 p-3.5 text-xs text-rose-200">
                      <div className="flex items-start gap-2.5">
                        <AlertTriangle className="size-5 text-rose-400 shrink-0 mt-0.5" />
                        <div className="space-y-1">
                          <p className="font-bold text-rose-300 text-sm">
                            {currentOrder.details?.["cancelledBy"] === "customer"
                              ? "Order Cancelled by Customer"
                              : "Order Cancelled by Bad Moon Cafe"}
                          </p>
                          <p className="text-[0.72rem] text-rose-200/80 leading-relaxed font-medium">
                            {currentOrder.details?.["cancelledBy"] === "customer"
                              ? "This order was cancelled upon your request."
                              : "Your order has been cancelled by the cafe. We apologize for the inconvenience. Please contact us or place a new order."}
                          </p>
                          {currentOrder.details?.["cancelledAt"] && (
                            <p className="text-[0.65rem] text-stone-400">
                              Cancelled at: {new Date(currentOrder.details["cancelledAt"]).toLocaleString()}
                            </p>
                          )}
                          {currentOrder.details?.["cancellationReason"] && (
                            <p className="text-[0.65rem] text-rose-300/90">
                              Reason: {currentOrder.details["cancellationReason"]}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                  )}

                  {/* ORDER RECEIPT BREAKDOWN */}
                  <div className="rounded-xl border border-stone-800 bg-black/40 p-3.5 text-xs space-y-2">
                    <div className="flex items-center justify-between border-b border-stone-800 pb-2">
                      <span className="font-bold text-stone-300">Order Items:</span>
                      <span className="font-serif text-sm font-bold text-caramel">
                        {currentOrder.details?.["totalAmount"] || currentOrder.details?.["unitPrice"]}
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-white">
                      <span className="font-semibold text-emerald-400">
                        🛍️ {currentOrder.details?.["quantity"] || 1}x {currentOrder.details?.["item"] || "Menu Item"}
                      </span>
                      <span className="text-[0.7rem] text-stone-400">
                        {currentOrder.details?.["unitPrice"]} each
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-stone-800/60 text-[0.72rem]">
                      <div>
                        <span className="text-stone-400 block">Customer:</span>
                        <span className="font-medium text-white">{currentOrder.name}</span>
                      </div>
                      <div>
                        <span className="text-stone-400 block">Contact:</span>
                        <a href={`tel:${currentOrder.phone}`} className="font-medium text-caramel hover:underline">
                          {currentOrder.phone || "—"}
                        </a>
                      </div>
                      <div>
                        <span className="text-stone-400 block">Order Type:</span>
                        <span className="font-medium text-white">{currentOrder.details?.["orderType"] || "Takeaway"}</span>
                      </div>
                      <div>
                        <span className="text-stone-400 block">Location/Table:</span>
                        <span className="font-medium text-white">{currentOrder.details?.["tableOrAddress"] || "Counter"}</span>
                      </div>
                    </div>

                    {currentOrder.details?.["notes"] && currentOrder.details?.["notes"] !== "None" && (
                      <div className="rounded-lg bg-[#18120e] p-2 text-[0.7rem] text-stone-300 border border-stone-800">
                        <strong>Special Note:</strong> {currentOrder.details?.["notes"]}
                      </div>
                    )}
                  </div>

                  {/* QUICK SWITCH TO CANCEL BUTTON IF ACTIVE */}
                  {!isCancelled && !isCompleted && (
                    <div className="pt-1">
                      <button
                        type="button"
                        onClick={() => setActiveTab("cancel")}
                        className="w-full flex items-center justify-center gap-2 rounded-xl border border-rose-600/40 bg-rose-950/20 py-2.5 text-xs font-bold text-rose-300 hover:bg-rose-900/30 hover:text-white transition-all"
                      >
                        <Ban className="size-3.5 text-rose-400" />
                        <span>Need to Cancel this Order?</span>
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* ------------------------------------------------------------- */}
              {/* TAB 2 CONTENT: CANCEL ORDER PORTAL */}
              {/* ------------------------------------------------------------- */}
              {activeTab === "cancel" && (
                <div className="mt-4 space-y-4">
                  {isCancelled ? (
                    <div className="rounded-2xl border border-rose-500/60 bg-rose-950/30 p-5 text-center space-y-3.5 shadow-lg animate-in fade-in">
                      <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-rose-900/40 border border-rose-500/50 text-rose-400">
                        <Ban className="size-8" />
                      </div>

                      <div>
                        <div className="inline-flex items-center gap-1.5 rounded-full border border-rose-500/50 bg-rose-950/80 px-3 py-1 text-xs font-extrabold text-rose-300 mb-2">
                          <Ban className="size-3.5" /> ORDER STATUS: CANCELLED
                        </div>
                        <h4 className="font-serif text-xl font-bold text-white">
                          Order Cancellation Confirmed
                        </h4>
                        <p className="mt-1 text-xs text-rose-200/90 leading-relaxed max-w-md mx-auto font-medium">
                          {currentOrder.details?.["cancelledBy"] === "customer"
                            ? "Your order has been cancelled upon your request."
                            : "Your order has been cancelled by the cafe. We apologize for the inconvenience."}
                        </p>
                      </div>

                      {/* Details Box */}
                      <div className="rounded-xl bg-black/40 border border-stone-800 p-3 text-xs text-left space-y-1 text-stone-300">
                        <div className="flex justify-between">
                          <span className="text-stone-400">Cancelled By:</span>
                          <span className="font-semibold text-rose-300">
                            {currentOrder.details?.["cancelledBy"] === "customer" ? "Customer (You)" : "Bad Moon Cafe"}
                          </span>
                        </div>
                        {currentOrder.details?.["cancelledAt"] && (
                          <div className="flex justify-between">
                            <span className="text-stone-400">Cancelled Time:</span>
                            <span>{new Date(currentOrder.details["cancelledAt"]).toLocaleString()}</span>
                          </div>
                        )}
                        {currentOrder.details?.["cancellationReason"] && (
                          <div className="flex justify-between">
                            <span className="text-stone-400">Reason:</span>
                            <span className="text-stone-200">{currentOrder.details["cancellationReason"]}</span>
                          </div>
                        )}
                      </div>

                      {/* Action Buttons: DONE and CANCEL ANOTHER */}
                      <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={onClose}
                          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-caramel px-6 py-2.5 text-xs font-bold text-espresso shadow-md hover:bg-caramel-hover transition-all active:scale-95"
                        >
                          <Check className="size-4 stroke-[3]" />
                          <span>Done</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setCurrentOrder(null);
                            setSearchQuery("");
                            setHasSearched(false);
                          }}
                          className="w-full sm:w-auto rounded-full border border-stone-700 bg-[#1c1511] px-5 py-2.5 text-xs font-medium text-stone-300 hover:text-white transition-all"
                        >
                          Cancel Another Order
                        </button>
                      </div>
                    </div>
                  ) : isCompleted ? (
                    <div className="rounded-xl border border-stone-700 bg-stone-900/60 p-4 text-center space-y-2">
                      <CheckCircle2 className="mx-auto size-8 text-emerald-400" />
                      <h4 className="font-serif text-base font-bold text-white">
                        Order Already Completed
                      </h4>
                      <p className="text-xs text-stone-400">
                        This order has already been prepared/served and cannot be cancelled online. If you need help, please contact the cafe counter.
                      </p>
                      <button
                        type="button"
                        onClick={onClose}
                        className="mt-2 rounded-full bg-stone-800 px-5 py-2 text-xs font-semibold text-white hover:bg-stone-700 transition-all"
                      >
                        Done
                      </button>
                    </div>
                  ) : (
                    /* CANCELLATION FORM */
                    <div className="rounded-xl border border-rose-500/40 bg-rose-950/20 p-4 space-y-3.5">
                      <div className="flex items-center gap-2 text-rose-300 border-b border-rose-500/20 pb-2">
                        <AlertTriangle className="size-4 text-rose-400 shrink-0" />
                        <h4 className="text-xs font-bold uppercase tracking-wider">
                          Confirm Order Cancellation:
                        </h4>
                      </div>

                      <div className="text-xs text-stone-300 space-y-1">
                        <p>
                          Cancelling: <strong className="text-white">{currentOrder.details?.["quantity"] || 1}x {currentOrder.details?.["item"]}</strong>
                        </p>
                        <p>
                          Total Bill: <strong className="text-caramel">{currentOrder.details?.["totalAmount"]}</strong>
                        </p>
                      </div>

                      {/* Reason Select */}
                      <div>
                        <label className="block text-[0.7rem] font-semibold text-stone-300 mb-1">
                          Please select a reason for cancellation:
                        </label>
                        <select
                          value={cancelReason}
                          onChange={(e) => setCancelReason(e.target.value)}
                          className="w-full rounded-lg border border-stone-700 bg-[#1c1511] px-3 py-2 text-xs text-white focus:border-rose-500 focus:outline-none"
                        >
                          <option value="Placed order by mistake">Placed order by mistake</option>
                          <option value="Need to change items/quantity">Need to change items / quantity</option>
                          <option value="Waiting time too long">Waiting time too long</option>
                          <option value="Change of plans">Change of plans</option>
                          <option value="Other">Other Reason</option>
                        </select>
                      </div>

                      {cancelReason === "Other" && (
                        <div>
                          <input
                            type="text"
                            value={customReason}
                            onChange={(e) => setCustomReason(e.target.value)}
                            placeholder="Enter specific reason..."
                            className="w-full rounded-lg border border-stone-700 bg-[#1c1511] px-3 py-2 text-xs text-white focus:border-rose-500 focus:outline-none"
                          />
                        </div>
                      )}

                      {/* ACTION BUTTONS */}
                      <div className="pt-2 flex items-center gap-2">
                        <button
                          type="button"
                          onClick={handleExecuteCancellation}
                          className="flex-1 rounded-xl bg-rose-600 py-2.5 text-xs font-bold text-white hover:bg-rose-500 transition-all shadow-md active:scale-95 flex items-center justify-center gap-1.5"
                        >
                          <Ban className="size-3.5" />
                          <span>Confirm &amp; Cancel Order</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setActiveTab("track")}
                          className="rounded-xl border border-stone-700 bg-[#1c1511] px-4 py-2.5 text-xs font-medium text-stone-300 hover:text-white transition-all"
                        >
                          Keep Order
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}


            </div>

            {/* HELPLINE FOOTER */}
            <div className="rounded-xl bg-black/30 border border-stone-800/80 p-3 flex items-center justify-between text-[0.7rem] text-stone-400">
              <span className="flex items-center gap-1.5">
                <Phone className="size-3 text-caramel" />
                <span>Need immediate help? Call Cafe:</span>
              </span>
              <a
                href={`tel:${CAFE.phone}`}
                className="font-semibold text-caramel hover:underline"
              >
                {CAFE.phone}
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
