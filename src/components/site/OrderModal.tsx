import { useState, useEffect } from "react";
import {
  AlertCircle,
  AlertTriangle,
  Check,
  CheckCircle2,
  Coffee,
  Minus,
  Plus,
  Search,
  ShoppingBag,
  Sparkles,
  X,
} from "lucide-react";

import { trackFormSubmission } from "@/lib/analytics";
import { TrackOrderModal } from "./TrackOrderModal";

export interface OrderItemPayload {
  name: string;
  price?: string;
  description?: string;
}

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialItem?: OrderItemPayload | null;
}

interface FormErrors {
  name?: string;
  phone?: string;
  email?: string;
}

interface FormTouched {
  name?: boolean;
  phone?: boolean;
  email?: boolean;
}

export function OrderModal({ isOpen, onClose, initialItem }: OrderModalProps) {
  const [selectedItem, setSelectedItem] = useState<OrderItemPayload>(
    initialItem || { name: "Artisan Cappuccino", price: "£3.80" },
  );
  const [quantity, setQuantity] = useState(1);
  const [orderType, setOrderType] = useState<"Dine-in" | "Takeaway" | "Delivery">("Takeaway");
  const [tableOrAddress, setTableOrAddress] = useState("");
  const [notes, setNotes] = useState("");

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const [touched, setTouched] = useState<FormTouched>({});
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [createdOrderId, setCreatedOrderId] = useState<string | null>(null);
  const [showTrackModal, setShowTrackModal] = useState(false);

  useEffect(() => {
    if (initialItem) {
      setSelectedItem(initialItem);
      setQuantity(1);
    }
  }, [initialItem]);

  if (!isOpen && !showTrackModal) return null;

  if (showTrackModal) {
    return <TrackOrderModal isOpen={showTrackModal} onClose={() => setShowTrackModal(false)} />;
  }

  const parsePrice = (priceStr?: string): number => {
    if (!priceStr) return 3.5;
    const num = parseFloat(priceStr.replace(/[^0-9.]/g, ""));
    return isNaN(num) || num <= 0 ? 3.5 : num;
  };

  const unitPriceNum = parsePrice(selectedItem.price);
  const totalPriceFormatted = `£${(unitPriceNum * quantity).toFixed(2)}`;

  const validateField = (fieldName: "name" | "phone" | "email", value: string): string => {
    switch (fieldName) {
      case "name":
        if (!value.trim()) return "Full name is required.";
        if (value.trim().length < 2) return "Name must be at least 2 characters.";
        return "";
      case "phone": {
        const clean = value.replace(/[\s\-\(\)\+]/g, "");
        if (!clean) return "Mobile number is required.";
        if (!/^\d+$/.test(clean)) return "Mobile number must only contain digits.";
        if (clean.length < 10 || clean.length > 15)
          return "Please enter a valid 10 to 15 digit phone number.";
        return "";
      }
      case "email": {
        const trimmed = value.trim();
        if (!trimmed) return "Email address is required.";
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(trimmed)) return "Please enter a valid email (e.g. name@example.com).";
        return "";
      }

      default:
        return "";
    }
  };

  const handleInputChange = (fieldName: "name" | "phone" | "email", val: string) => {
    if (fieldName === "name") setName(val);
    if (fieldName === "phone") setPhone(val);
    if (fieldName === "email") setEmail(val);

    if (touched[fieldName] || submitAttempted) {
      const err = validateField(fieldName, val);
      setFormErrors((prev) => ({ ...prev, [fieldName]: err }));
    }
  };

  const handleBlur = (fieldName: "name" | "phone" | "email", _optionalVal?: string) => {
    setTouched((prev) => ({ ...prev, [fieldName]: true }));
    const val = fieldName === "name" ? name : fieldName === "phone" ? phone : email;
    const err = validateField(fieldName, val);
    setFormErrors((prev) => ({ ...prev, [fieldName]: err }));
  };

  const handleOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitAttempted(true);


    const nameErr = validateField("name", name);
    const phoneErr = validateField("phone", phone);
    const emailErr = validateField("email", email);

    setFormErrors({
      name: nameErr,
      phone: phoneErr,
      email: emailErr,
    });

    if (nameErr || phoneErr || emailErr) {
      return;
    }

    const createdSubmission = trackFormSubmission({
      type: "order",
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
      details: {
        item: selectedItem.name,
        unitPrice: selectedItem.price || "£3.50",
        quantity,
        totalAmount: totalPriceFormatted,
        orderType,
        tableOrAddress: tableOrAddress.trim() || (orderType === "Dine-in" ? "Dine-in Table" : "Counter Pickup"),
        notes: notes.trim() || "None",
      },
    });

    setCreatedOrderId(createdSubmission.id);
    setOrderSuccess(true);
  };

  const resetForm = () => {
    setOrderSuccess(false);
    setCreatedOrderId(null);
    onClose();
    setName("");
    setPhone("");
    setEmail("");
    setTableOrAddress("");
    setNotes("");
    setQuantity(1);
    setFormErrors({});
    setTouched({});
    setSubmitAttempted(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/80 p-4 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-caramel/40 bg-[#140f0c] p-6 shadow-2xl sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={resetForm}
          className="absolute right-4 top-4 rounded-full p-2 text-stone-400 transition-colors hover:bg-stone-800 hover:text-white"
          aria-label="Close modal"
        >
          <X className="size-5" />
        </button>

        {orderSuccess ? (
          <div className="py-6 text-center space-y-4">
            <CheckCircle2 className="mx-auto size-14 text-emerald-400 animate-bounce" />
            <div>
              <h3 className="font-serif text-2xl font-semibold text-white">Order Received!</h3>
              <p className="mt-1 text-xs text-stone-300">
                Thank you, <strong className="text-white">{name}</strong>. We are preparing your fresh{" "}
                <strong className="text-caramel">{quantity}x {selectedItem.name}</strong> ({totalPriceFormatted}).
              </p>
            </div>

            {createdOrderId && (
              <div className="rounded-xl border border-caramel/30 bg-black/40 p-3 text-xs">
                <span className="text-stone-400 text-[0.7rem] uppercase tracking-wider">Your Order ID:</span>
                <p className="font-mono text-sm font-bold text-caramel mt-0.5">{createdOrderId}</p>
                <p className="text-[0.65rem] text-stone-500 mt-1">
                  Save this ID or use your mobile number ({phone}) to track or cancel.
                </p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setShowTrackModal(true);
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 rounded-full bg-caramel px-5 py-2.5 text-xs font-bold text-espresso shadow-md hover:bg-caramel-hover transition-all"
              >
                <Search className="size-3.5" />
                <span>Track / Cancel Order</span>
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="w-full sm:w-auto rounded-full border border-stone-700 bg-[#1c1511] px-5 py-2.5 text-xs font-medium text-stone-300 hover:text-white transition-all"
              >
                Done
              </button>
            </div>
          </div>
        ) : (

          <div>
            <div className="flex items-center gap-2">
              <span className="flex size-7 items-center justify-center rounded-full bg-caramel/20 text-caramel">
                <ShoppingBag className="size-4" />
              </span>
              <p className="font-script text-2xl text-caramel">Order Online</p>
            </div>
            <h3 className="mt-1 font-serif text-2xl font-semibold text-white sm:text-3xl">
              Place Your Order
            </h3>

            {/* Selected Item Card */}
            <div className="mt-4 flex items-center justify-between rounded-2xl border border-caramel/30 bg-[#1c1511] p-4">
              <div>
                <h4 className="font-serif text-base font-bold text-white sm:text-lg">
                  {selectedItem.name}
                </h4>
                {selectedItem.description && (
                  <p className="mt-0.5 line-clamp-1 text-xs text-stone-400 max-w-xs">
                    {selectedItem.description}
                  </p>
                )}
                <span className="mt-1 inline-block text-xs font-semibold text-caramel">
                  {selectedItem.price} each
                </span>
              </div>

              {/* Quantity Counter */}
              <div className="flex items-center gap-2 rounded-xl border border-stone-700 bg-black/40 p-1">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="flex size-7 items-center justify-center rounded-lg text-stone-300 hover:bg-stone-800 hover:text-white"
                  title="Decrease"
                >
                  <Minus className="size-3.5" />
                </button>
                <span className="w-5 text-center text-sm font-bold text-white">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="flex size-7 items-center justify-center rounded-lg text-stone-300 hover:bg-stone-800 hover:text-white"
                  title="Increase"
                >
                  <Plus className="size-3.5" />
                </button>
              </div>
            </div>

            <form onSubmit={handleOrderSubmit} className="mt-5 space-y-4">
              {/* Top Alert Banner if errors exist upon submit attempt */}
              {submitAttempted && Object.keys(formErrors).length > 0 && (
                <div className="flex items-start gap-2.5 rounded-xl border border-rose-500/60 bg-rose-950/40 p-3.5 text-xs text-rose-200 shadow-[0_0_15px_rgba(244,63,94,0.2)] animate-in fade-in">
                  <AlertCircle className="size-4 shrink-0 text-rose-400 mt-0.5" />
                  <div>
                    <p className="font-semibold text-rose-300">Please correct the highlighted errors:</p>
                    <p className="mt-0.5 text-[0.7rem] text-rose-200/80">Name, Mobile Number, and Email must be filled correctly.</p>
                  </div>

                </div>
              )}

              {/* 1. Customer Full Name & Mobile */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-medium text-stone-300">
                      Full Name <span className="text-rose-400 font-bold">*</span>
                    </label>
                    {touched.name && !formErrors.name && name.trim() && (
                      <span className="flex items-center gap-1 text-[0.65rem] font-medium text-emerald-400">
                        <Check className="size-3" /> Valid
                      </span>
                    )}
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="Akash Deep"
                    value={name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    onBlur={() => handleBlur("name", name)}
                    className={`mt-1 w-full rounded-lg border bg-[#1c1511] px-3 py-2 text-sm text-white placeholder:text-stone-500 focus:outline-none transition-all ${
                      formErrors.name
                        ? "border-rose-500 bg-rose-950/20 shadow-[0_0_8px_rgba(244,63,94,0.3)]"
                        : touched.name && name.trim()
                        ? "border-emerald-500/60"
                        : "border-stone-700/80 focus:border-caramel"
                    }`}
                  />
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
                    {touched.phone && !formErrors.phone && phone.trim() && (
                      <span className="flex items-center gap-1 text-[0.65rem] font-medium text-emerald-400">
                        <Check className="size-3" /> Valid
                      </span>
                    )}
                  </div>
                  <input
                    type="tel"
                    required
                    placeholder="9876543210"
                    value={phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    onBlur={() => handleBlur("phone", phone)}
                    className={`mt-1 w-full rounded-lg border bg-[#1c1511] px-3 py-2 text-sm text-white placeholder:text-stone-500 focus:outline-none transition-all ${
                      formErrors.phone
                        ? "border-rose-500 bg-rose-950/20 shadow-[0_0_8px_rgba(244,63,94,0.3)]"
                        : touched.phone && phone.trim()
                        ? "border-emerald-500/60"
                        : "border-stone-700/80 focus:border-caramel"
                    }`}
                  />
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
                  {touched.email && !formErrors.email && email.trim() && (
                    <span className="flex items-center gap-1 text-[0.65rem] font-medium text-emerald-400">
                      <Check className="size-3" /> Valid
                    </span>
                  )}
                </div>
                <input
                  type="email"
                  required
                  placeholder="akash@example.com"
                  value={email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  onBlur={() => handleBlur("email", email)}
                  className={`mt-1 w-full rounded-lg border bg-[#1c1511] px-3 py-2 text-sm text-white placeholder:text-stone-500 focus:outline-none transition-all ${
                    formErrors.email
                      ? "border-rose-500 bg-rose-950/20 shadow-[0_0_8px_rgba(244,63,94,0.3)]"
                      : touched.email && email.trim()
                      ? "border-emerald-500/60"
                      : "border-stone-700/80 focus:border-caramel"
                  }`}
                />
                {formErrors.email && (
                  <p className="mt-1 flex items-center gap-1 text-[0.7rem] font-medium text-rose-400 animate-in fade-in">
                    <AlertCircle className="size-3.5 shrink-0" />
                    <span>{formErrors.email}</span>
                  </p>
                )}
              </div>

              {/* 3. Order Type & Table/Address */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-medium text-stone-300">Order Type</label>
                  <select
                    value={orderType}
                    onChange={(e) => setOrderType(e.target.value as any)}
                    className="mt-1 w-full rounded-lg border border-stone-700/80 bg-[#1c1511] px-3 py-2 text-xs text-white focus:border-caramel focus:outline-none"
                  >
                    <option value="Takeaway">🛍️ Takeaway</option>
                    <option value="Dine-in">☕ Dine-in Table</option>
                    <option value="Delivery">🚚 Local Delivery</option>
                  </select>

                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-300">
                    {orderType === "Dine-in" ? "Table Number" : "Notes / Pickup Name"}
                  </label>
                  <input
                    type="text"
                    placeholder={orderType === "Dine-in" ? "e.g. Table 5" : "e.g. Counter Pickup"}
                    value={tableOrAddress}
                    onChange={(e) => setTableOrAddress(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-stone-700/80 bg-[#1c1511] px-3 py-2 text-xs text-white placeholder:text-stone-500 focus:border-caramel focus:outline-none"
                  />
                </div>
              </div>

              {/* 4. Special Instructions */}
              <div>
                <label className="block text-xs font-medium text-stone-300">
                  Special Instructions (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Oat milk, extra hot, less sugar"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-stone-700/80 bg-[#1c1511] px-3 py-2 text-xs text-white placeholder:text-stone-500 focus:border-caramel focus:outline-none"
                />
              </div>

              {/* Total Summary & Submit */}
              <div className="pt-2">
                <div className="mb-3 flex items-center justify-between rounded-xl bg-black/40 px-4 py-2.5 text-sm">
                  <span className="text-stone-400">Total Payable:</span>
                  <span className="font-serif text-lg font-bold text-caramel">{totalPriceFormatted}</span>
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-caramel py-3 text-sm font-bold text-espresso shadow-[0_4px_20px_rgba(200,147,85,0.3)] transition-all hover:bg-caramel-hover active:scale-[0.98]"
                >
                  <Coffee className="size-4" />
                  <span>Confirm &amp; Place Order ({totalPriceFormatted})</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
