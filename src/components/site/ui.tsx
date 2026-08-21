import type { ReactNode } from "react";
import { useReveal } from "@/hooks/use-reveal";
import { cn } from "@/lib/utils";

export function SectionLabel({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <p className={cn("font-script text-3xl sm:text-4xl text-caramel tracking-normal", className)}>
      {children}
    </p>
  );
}

export function Reveal({
  children,
  className,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "section" | "li" | "figure" | "article";
}) {
  const { ref, className: revealClass } = useReveal<HTMLDivElement>();
  return (
    <Tag ref={ref as never} className={cn(revealClass, className)}>
      {children}
    </Tag>
  );
}

const base =
  "inline-flex items-center justify-center gap-2 min-h-11 px-7 text-sm font-semibold rounded-full transition-all duration-300 active:scale-[0.98]";

const variants = {
  accent:
    "bg-caramel text-espresso hover:bg-caramel-hover shadow-[0_4px_20px_rgba(200,147,85,0.3)] hover:shadow-[0_6px_25px_rgba(200,147,85,0.45)] hover:scale-[1.02]",
  caramel:
    "bg-caramel text-espresso hover:bg-caramel-hover shadow-[0_4px_20px_rgba(200,147,85,0.3)] hover:shadow-[0_6px_25px_rgba(200,147,85,0.45)] hover:scale-[1.02]",
  ink: "bg-[#18120e] border border-caramel/30 text-caramel hover:border-caramel hover:bg-[#221a14] hover:scale-[1.02]",
  outline:
    "border border-caramel/40 text-caramel hover:border-caramel hover:bg-caramel/10 hover:text-caramel-hover",
  ghostLight:
    "border border-white/30 text-white hover:bg-white/10 hover:border-white/60",
} as const;

type Variant = keyof typeof variants;

export function CtaLink({
  href,
  children,
  variant = "caramel",
  className,
  external,
  ...rest
}: {
  href: string;
  children: ReactNode;
  variant?: Variant;
  className?: string;
  external?: boolean;
} & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "className">) {
  return (
    <a
      href={href}
      className={cn(base, variants[variant], className)}
      {...(external ? { target: "_blank", rel: "noreferrer noopener" } : {})}
      {...rest}
    >
      {children}
    </a>
  );
}

export function Rule({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "h-px w-full bg-gradient-to-r from-transparent via-caramel/25 to-transparent",
        className,
      )}
      aria-hidden="true"
    />
  );
}
