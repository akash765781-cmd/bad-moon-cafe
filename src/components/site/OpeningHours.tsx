import { useEffect, useState } from "react";
import { getOpenState, HOURS, timeLabel } from "@/lib/cafe";
import { SectionLabel } from "./ui";

export function OpenBadge({ className }: { className?: string }) {
  const [state, setState] = useState<{ open: boolean; label: string } | null>(null);

  useEffect(() => {
    const update = () => {
      const next = getOpenState();
      setState({ open: next.open, label: next.label });
    };
    update();
    const id = setInterval(update, 60_000);
    return () => clearInterval(id);
  }, []);

  if (!state) return null;

  return (
    <div className={className}>
      <span className="inline-flex items-center gap-2.5 rounded-full border border-stone-700/80 bg-stone-900/80 px-4 py-1.5 backdrop-blur-md shadow-[0_0_20px_rgba(0,0,0,0.5)]">
        <span className="relative flex size-2.5">
          <span
            className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${
              state.open ? "bg-emerald-400" : "bg-amber-400"
            }`}
          />
          <span
            className={`relative inline-flex size-2.5 rounded-full shadow-[0_0_10px_currentColor] ${
              state.open ? "bg-emerald-400 text-emerald-400" : "bg-amber-400 text-amber-400"
            }`}
          />
        </span>
        <span className="label-eyebrow text-stone-200 tracking-[0.16em]">
          {state.label}
        </span>
      </span>
    </div>
  );
}

export function OpeningHoursList() {
  const [todayShort, setTodayShort] = useState<string | null>(null);

  useEffect(() => {
    setTodayShort(getOpenState().today?.short ?? null);
  }, []);

  return (
    <div className="rounded-xl border border-stone-800/80 bg-stone-900/40 p-6 backdrop-blur-sm">
      <SectionLabel>Opening Hours</SectionLabel>
      <ul className="mt-6 divide-y divide-stone-800/70">
        {HOURS.map((h) => {
          const isToday = h.short === todayShort;
          return (
            <li
              key={h.day}
              className={`flex items-baseline justify-between gap-6 py-4 transition-colors ${
                isToday ? "text-amber-200 font-semibold" : "text-stone-400"
              }`}
            >
              <span className="flex items-center text-base">
                {h.day}
                {isToday && (
                  <span className="ml-3 rounded bg-amber-500/15 border border-amber-500/40 px-2 py-0.5 text-[0.625rem] font-bold uppercase tracking-[0.18em] text-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.2)]">
                    Today
                  </span>
                )}
              </span>
              <span className="font-display text-base">
                {timeLabel(h.open)} – {timeLabel(h.close)}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
