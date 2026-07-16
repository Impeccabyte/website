import { Check, X, ThumbsUp, ThumbsDown } from "lucide-react";

/**
 * The "who this is actually right for" split — a sage "works well for" list and a
 * muted "probably not right if" list. Shared by the Surcharge and Cash Discount pages.
 */
export function FitPanels({ worksFor, notFor }: { worksFor: string[]; notFor: string[] }) {
  return (
    <div className="grid gap-[18px] md:grid-cols-2">
      <div className="rounded-lg border border-sage-100 bg-sage-50 p-7">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-round bg-sage-100 text-sage-600">
            <ThumbsUp size={16} strokeWidth={2.1} />
          </span>
          <p className="text-[15px] font-bold text-ink-900">Works well for</p>
        </div>
        <ul className="mt-5 space-y-3.5">
          {worksFor.map((item) => (
            <li key={item} className="flex items-start gap-2.5">
              <Check size={18} strokeWidth={2.4} className="mt-0.5 shrink-0 text-sage-500" />
              <span className="text-[15px] leading-snug text-ink-700">{item}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="rounded-lg border border-border-default bg-white p-7">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-round bg-ink-100 text-ink-500">
            <ThumbsDown size={16} strokeWidth={2.1} />
          </span>
          <p className="text-[15px] font-bold text-ink-900">Probably not right if</p>
        </div>
        <ul className="mt-5 space-y-3.5">
          {notFor.map((item) => (
            <li key={item} className="flex items-start gap-2.5">
              <X size={18} strokeWidth={2.4} className="mt-0.5 shrink-0 text-ink-400" />
              <span className="text-[15px] leading-snug text-ink-600">{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
