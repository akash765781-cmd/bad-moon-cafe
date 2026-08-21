import { useState } from "react";
import { AlertCircle, Check, ExternalLink, Heart, MessageSquarePlus, Quote, Sparkles, Star, ThumbsUp, X } from "lucide-react";
import { CAFE, REVIEWS, type ReviewItem } from "@/lib/cafe";
import { SectionLabel } from "./ui";
import { trackFormSubmission } from "@/lib/analytics";

interface ReviewErrors {
  author?: string;
  email?: string;
  phone?: string;
  comment?: string;
}


interface ReviewTouched {
  author?: boolean;
  email?: boolean;
  phone?: boolean;
  comment?: boolean;
  role?: boolean;
}

export function ReviewsSection() {
  const [reviewsList, setReviewsList] = useState<ReviewItem[]>(REVIEWS);
  const [likedIds, setLikedIds] = useState<Record<string, boolean>>({});
  const [showModal, setShowModal] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [touched, setTouched] = useState<ReviewTouched>({});
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(5);
  const [formAuthor, setFormAuthor] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formRole, setFormRole] = useState("Coffee Lover");
  const [formComment, setFormComment] = useState("");
  const [reviewErrors, setReviewErrors] = useState<ReviewErrors>({});

  const handleLike = (id: string) => {
    setLikedIds((prev) => {
      const isLiked = prev[id];
      setReviewsList((list) =>
        list.map((r) =>
          r.id === id ? { ...r, likes: isLiked ? r.likes - 1 : r.likes + 1 } : r,
        ),
      );
      return { ...prev, [id]: !isLiked };
    });
  };

  const validateField = (field: string, value: string): string => {
    switch (field) {
      case "author":
        if (!value.trim()) return "Full Name is required.";
        if (value.trim().length < 2) return "Name must be at least 2 characters.";
        return "";
      case "phone": {
        const cleanPhone = value.replace(/[\s\-\(\)]/g, "");
        if (!value.trim()) return "Mobile Number is required.";
        if (!/^\+?[0-9]{10,15}$/.test(cleanPhone)) return "Invalid Mobile: Enter a valid 10-digit number.";
        return "";
      }
      case "email":
        if (!value.trim()) return "Email Address is required.";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim())) return "Invalid Email: Format must be name@example.com.";
        return "";

      case "comment":
        if (!value.trim()) return "Review message is required.";
        if (value.trim().length < 5) return "Review message must be at least 5 characters.";
        return "";
      default:
        return "";
    }
  };

  const handleInputChange = (field: "author" | "email" | "phone" | "comment" | "role", value: string) => {
    if (field === "author") setFormAuthor(value);
    if (field === "email") setFormEmail(value);
    if (field === "phone") setFormPhone(value);
    if (field === "comment") setFormComment(value);
    if (field === "role") setFormRole(value);

    const isFieldTouched = field === "author" ? touched.author : field === "phone" ? touched.phone : field === "email" ? touched.email : field === "comment" ? touched.comment : touched.role;

    if (isFieldTouched || submitAttempted) {
      const err = validateField(field, value);
      setReviewErrors((prev) => ({ ...prev, [field]: err || undefined }));
    }
  };

  const handleBlur = (field: string, value: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const err = validateField(field, value);
    setReviewErrors((prev) => ({ ...prev, [field]: err || undefined }));
  };

  const validateAll = () => {
    const errors: ReviewErrors = {};
    const aErr = validateField("author", formAuthor);
    if (aErr) errors.author = aErr;
    const pErr = validateField("phone", formPhone);
    if (pErr) errors.phone = pErr;
    const eErr = validateField("email", formEmail);
    if (eErr) errors.email = eErr;
    const cErr = validateField("comment", formComment);
    if (cErr) errors.comment = cErr;

    setReviewErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitAttempted(true);
    setTouched({
      author: true,
      email: true,
      phone: true,
      comment: true,
    });

    if (!validateAll()) {
      return;
    }

    const newReview: ReviewItem = {
      id: Date.now().toString(),
      author: formAuthor.trim(),
      role: formRole.trim() || "Verified Guest",
      rating,
      date: "Just now",
      comment: formComment.trim(),
      avatarBg: "from-amber-600 to-yellow-800",
      likes: 0,
    };

    // Save to Admin Analytics Submissions
    trackFormSubmission({
      type: "review",
      name: formAuthor.trim(),
      email: formEmail.trim(),
      phone: formPhone.trim(),
      details: {
        rating,
        role: formRole.trim() || "Verified Guest",
        comment: formComment.trim(),
      },
    });

    setReviewsList([newReview, ...reviewsList]);
    setSubmitted(true);

    setTimeout(() => {
      setSubmitted(false);
      setShowModal(false);
      setFormAuthor("");
      setFormEmail("");
      setFormPhone("");
      setFormComment("");
      setRating(5);
      setReviewErrors({});
      setTouched({});
      setSubmitAttempted(false);
    }, 2000);
  };




  return (
    <section id="reviews" className="relative scroll-mt-20 bg-[#0d0a08] py-20 sm:py-28">
      {/* Background glow */}
      <div
        className="pointer-events-none absolute right-1/4 top-1/3 h-96 w-96 rounded-full bg-caramel/10 blur-[130px]"
        aria-hidden="true"
      />

      <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
        {/* Header */}
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <SectionLabel>What Our Guests Say</SectionLabel>
            <h2 className="mt-1 font-serif text-3xl font-normal text-white sm:text-4xl lg:text-5xl">
              Customer Reviews
            </h2>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1 rounded-full border border-caramel/30 bg-caramel/10 px-3.5 py-1 text-sm font-semibold text-caramel">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="size-3.5 fill-current" />
                  ))}
                </div>
                <span className="ml-1 text-white">{CAFE.rating}</span>
                <span className="text-xs text-stone-400">/ 5.0</span>
              </div>
              <span className="text-xs text-stone-400">
                Based on <strong className="text-stone-200">{CAFE.reviewCount}+ Google reviews</strong>
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setShowModal(true)}
              className="inline-flex items-center gap-2 rounded-full border border-caramel/40 bg-[#16110e] px-5 py-2.5 text-xs font-semibold text-caramel transition-all duration-300 hover:border-caramel hover:bg-caramel/15 hover:scale-105"
            >
              <MessageSquarePlus className="size-4" />
              Write a Review
            </button>

            {CAFE.reviewsUrl && (
              <a
                href={CAFE.reviewsUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center gap-2 rounded-full bg-caramel px-5 py-2.5 text-xs font-semibold text-espresso shadow-[0_4px_16px_rgba(200,147,85,0.3)] transition-all duration-300 hover:bg-caramel-hover hover:scale-105"
              >
                <span>Google Reviews</span>
                <ExternalLink className="size-3.5" />
              </a>
            )}
          </div>
        </div>

        {/* Reviews Cards Grid */}
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {reviewsList.map((review) => {
            const isLiked = likedIds[review.id];
            const initials = review.author
              .split(" ")
              .map((n) => n[0])
              .join("")
              .slice(0, 2)
              .toUpperCase();

            return (
              <div
                key={review.id}
                className="group relative flex flex-col justify-between rounded-2xl border border-caramel/20 bg-[#140f0c] p-6 shadow-xl transition-all duration-300 hover:border-caramel/50 hover:bg-[#1a1410] hover:shadow-[0_10px_30px_rgba(0,0,0,0.8),0_0_20px_rgba(200,147,85,0.1)] hover:-translate-y-1"
              >
                {/* Header inside card */}
                <div>
                  <div className="flex items-start justify-between">
                    {/* Stars */}
                    <div className="flex items-center gap-1 text-amber-400">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} className="size-4 fill-current" />
                      ))}
                    </div>

                    <Quote className="size-6 text-caramel/30 transition-colors group-hover:text-caramel/60" />
                  </div>

                  {/* Comment */}
                  <p className="mt-4 text-sm leading-relaxed text-stone-300">
                    &ldquo;{review.comment}&rdquo;
                  </p>
                </div>

                {/* Footer inside card */}
                <div className="mt-6 flex items-center justify-between border-t border-stone-800/80 pt-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex size-10 items-center justify-center rounded-full bg-gradient-to-br ${review.avatarBg} text-xs font-bold text-white shadow-md`}
                    >
                      {initials}
                    </div>
                    <div>
                      <h4 className="font-serif text-sm font-medium text-white">{review.author}</h4>
                      <p className="text-[0.7rem] text-stone-400">{review.role}</p>
                    </div>
                  </div>

                  {/* Helpful Button */}
                  <button
                    type="button"
                    onClick={() => handleLike(review.id)}
                    aria-label={`Like review by ${review.author}`}
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs transition-all ${isLiked
                        ? "bg-caramel/20 text-caramel font-semibold"
                        : "text-stone-400 hover:bg-stone-800 hover:text-stone-200"
                      }`}
                  >
                    <ThumbsUp className={`size-3.5 ${isLiked ? "fill-current" : ""}`} />
                    <span>{review.likes}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Write a Review Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-2xl border border-caramel/30 bg-[#140f0c] p-6 text-white shadow-2xl sm:p-8">
            <button
              onClick={() => setShowModal(false)}
              className="absolute right-4 top-4 rounded-full p-2 text-stone-400 transition-colors hover:bg-stone-800 hover:text-white"
              aria-label="Close review modal"
            >
              <X className="size-5" />
            </button>

            {submitted ? (
              <div className="py-10 text-center">
                <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 animate-bounce">
                  <Check className="size-7 stroke-[3]" />
                </div>
                <h3 className="mt-4 font-serif text-2xl text-white">Thank You!</h3>
                <p className="mt-2 text-sm text-stone-300">
                  Your review has been submitted and added to {CAFE.name}. We appreciate your support!
                </p>
              </div>
            ) : (
              <div>
                <SectionLabel>Share Your Experience</SectionLabel>
                <h3 className="font-serif text-2xl text-white sm:text-3xl">Write a Review</h3>
                <p className="mt-1 text-xs text-stone-400">
                  Tell others what you enjoyed about your visit to {CAFE.name}.
                </p>

                <form onSubmit={handleSubmitReview} className="mt-6 space-y-4">
                  {/* Top Alert Banner if errors exist upon submit attempt */}
                  {submitAttempted && Object.keys(reviewErrors).length > 0 && (
                    <div className="flex items-start gap-2.5 rounded-xl border border-rose-500/60 bg-rose-950/40 p-3.5 text-xs text-rose-200 shadow-[0_0_15px_rgba(244,63,94,0.2)] animate-in fade-in duration-200">
                      <AlertCircle className="size-4 shrink-0 text-rose-400 mt-0.5" />
                      <div>
                        <p className="font-semibold text-rose-300">Please correct the highlighted errors:</p>
                        <p className="mt-0.5 text-[0.7rem] text-rose-200/80">All fields with * are compulsory and must be valid.</p>

                      </div>
                    </div>
                  )}

                  {/* Star Rating selector */}
                  <div>
                    <label className="block text-xs font-medium text-stone-300">
                      Your Rating <span className="text-rose-400 font-bold">*</span>
                    </label>
                    <div className="mt-2 flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(rating)}
                          className="p-1 transition-transform hover:scale-125"
                          aria-label={`${star} star rating`}
                        >
                          <Star
                            className={`size-6 ${
                              star <= (hoverRating || rating)
                                ? "fill-amber-400 text-amber-400"
                                : "text-stone-600"
                            }`}
                          />
                        </button>
                      ))}
                      <span className="ml-2 text-xs font-semibold text-caramel">
                        {rating} out of 5 stars
                      </span>
                    </div>
                  </div>

                  {/* 1. Full Name & Mobile Number */}
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <div className="flex items-center justify-between">
                        <label className="block text-xs font-medium text-stone-300">
                          Full Name <span className="text-rose-400 font-bold">*</span>
                        </label>
                        {touched.author && !reviewErrors.author && formAuthor.trim() && (
                          <span className="flex items-center gap-1 text-[0.65rem] font-medium text-emerald-400">
                            <Check className="size-3" /> Valid
                          </span>
                        )}
                      </div>
                      <input
                        type="text"
                        required
                        placeholder="Alex Morgan"
                        value={formAuthor}
                        onChange={(e) => handleInputChange("author", e.target.value)}
                        onBlur={() => handleBlur("author", formAuthor)}
                        className={`mt-1 w-full rounded-lg border bg-[#1c1511] px-3.5 py-2 text-sm text-white placeholder:text-stone-500 focus:outline-none transition-all ${
                          reviewErrors.author
                            ? "border-rose-500 bg-rose-950/20 shadow-[0_0_8px_rgba(244,63,94,0.3)]"
                            : touched.author && formAuthor.trim()
                            ? "border-emerald-500/60"
                            : "border-stone-700/80 focus:border-caramel"
                        }`}
                      />
                      {reviewErrors.author && (
                        <p className="mt-1 flex items-center gap-1 text-[0.7rem] font-medium text-rose-400 animate-in fade-in">
                          <AlertCircle className="size-3.5 shrink-0" />
                          <span>{reviewErrors.author}</span>
                        </p>
                      )}
                    </div>

                    <div>
                      <div className="flex items-center justify-between">
                        <label className="block text-xs font-medium text-stone-300">
                          Mobile Number <span className="text-rose-400 font-bold">*</span>
                        </label>
                        {touched.phone && !reviewErrors.phone && formPhone.trim() && (
                          <span className="flex items-center gap-1 text-[0.65rem] font-medium text-emerald-400">
                            <Check className="size-3" /> Valid
                          </span>
                        )}
                      </div>
                      <input
                        type="tel"
                        required
                        placeholder="9876543210"
                        value={formPhone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        onBlur={() => handleBlur("phone", formPhone)}
                        className={`mt-1 w-full rounded-lg border bg-[#1c1511] px-3.5 py-2 text-sm text-white placeholder:text-stone-500 focus:outline-none transition-all ${
                          reviewErrors.phone
                            ? "border-rose-500 bg-rose-950/20 shadow-[0_0_8px_rgba(244,63,94,0.3)]"
                            : touched.phone && formPhone.trim()
                            ? "border-emerald-500/60"
                            : "border-stone-700/80 focus:border-caramel"
                        }`}
                      />
                      {reviewErrors.phone && (
                        <p className="mt-1 flex items-center gap-1 text-[0.7rem] font-medium text-rose-400 animate-in fade-in">
                          <AlertCircle className="size-3.5 shrink-0" />
                          <span>{reviewErrors.phone}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  {/* 2. Email Address & Date of Birth */}
                  {/* 2. Email Address */}
                  <div>
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-medium text-stone-300">
                        Email Address <span className="text-rose-400 font-bold">*</span>
                      </label>
                      {touched.email && !reviewErrors.email && formEmail.trim() && (
                        <span className="flex items-center gap-1 text-[0.65rem] font-medium text-emerald-400">
                          <Check className="size-3" /> Valid
                        </span>
                      )}
                    </div>
                    <input
                      type="email"
                      required
                      placeholder="alex@example.com"
                      value={formEmail}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      onBlur={() => handleBlur("email", formEmail)}
                      className={`mt-1 w-full rounded-lg border bg-[#1c1511] px-3.5 py-2 text-sm text-white placeholder:text-stone-500 focus:outline-none transition-all ${
                        reviewErrors.email
                          ? "border-rose-500 bg-rose-950/20 shadow-[0_0_8px_rgba(244,63,94,0.3)]"
                          : touched.email && formEmail.trim()
                          ? "border-emerald-500/60"
                          : "border-stone-700/80 focus:border-caramel"
                      }`}
                    />
                    {reviewErrors.email && (
                      <p className="mt-1 flex items-center gap-1 text-[0.7rem] font-medium text-rose-400 animate-in fade-in">
                        <AlertCircle className="size-3.5 shrink-0" />
                        <span>{reviewErrors.email}</span>
                      </p>
                    )}
                  </div>


                  {/* 3. Review Comment */}
                  <div>
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-medium text-stone-300">
                        Your Review <span className="text-rose-400 font-bold">*</span>
                      </label>
                      {touched.comment && !reviewErrors.comment && formComment.trim() && (
                        <span className="flex items-center gap-1 text-[0.65rem] font-medium text-emerald-400">
                          <Check className="size-3" /> Valid
                        </span>
                      )}
                    </div>
                    <textarea
                      required
                      rows={3}
                      placeholder="What did you order? How was the service and coffee?"
                      value={formComment}
                      onChange={(e) => handleInputChange("comment", e.target.value)}
                      onBlur={() => handleBlur("comment", formComment)}
                      className={`mt-1 w-full rounded-lg border bg-[#1c1511] px-3.5 py-2 text-sm text-white placeholder:text-stone-500 focus:outline-none resize-none transition-all ${
                        reviewErrors.comment
                          ? "border-rose-500 bg-rose-950/20 shadow-[0_0_8px_rgba(244,63,94,0.3)]"
                          : touched.comment && formComment.trim()
                          ? "border-emerald-500/60"
                          : "border-stone-700/80 focus:border-caramel"
                      }`}
                    />
                    {reviewErrors.comment && (
                      <p className="mt-1 flex items-center gap-1 text-[0.7rem] font-medium text-rose-400 animate-in fade-in">
                        <AlertCircle className="size-3.5 shrink-0" />
                        <span>{reviewErrors.comment}</span>
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="mt-4 w-full rounded-full bg-caramel py-3 font-semibold text-espresso shadow-[0_4px_20px_rgba(200,147,85,0.4)] transition-all hover:bg-caramel-hover hover:shadow-[0_6px_25px_rgba(200,147,85,0.6)] active:scale-[0.99]"
                  >
                    Post Review
                  </button>
                </form>

              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
