import { Check } from "lucide-react";
import { Container } from "./container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { ButtonLink } from "@/components/ui/button-link";
import { cn } from "@/lib/utils";

/** Sage checkmark + label row. */
export function CheckItem({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("flex items-start gap-2.5", className)}>
      <Check size={19} strokeWidth={2.4} className="mt-0.5 shrink-0 text-sage-500" />
      <span className="text-[15.5px] leading-snug text-ink-700">{children}</span>
    </div>
  );
}

/** Centered eyebrow + heading + optional lede. */
export function SectionIntro({
  eyebrow,
  title,
  children,
  align = "center",
  width = "660px",
  className,
}: {
  eyebrow: string;
  title?: React.ReactNode;
  children?: React.ReactNode;
  align?: "center" | "left";
  width?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(align === "center" ? "mx-auto text-center" : "text-left", className)}
      style={{ maxWidth: align === "center" ? width : undefined }}
    >
      <Eyebrow>{eyebrow}</Eyebrow>
      {title && (
        <h2 className="mt-3 font-display font-semibold text-ink-900" style={{ fontSize: "clamp(30px, 3.6vw, 44px)" }}>
          {title}
        </h2>
      )}
      {children && <p className="mt-4 text-[17px] leading-relaxed text-ink-600">{children}</p>}
    </div>
  );
}

/** The clay-tinted "same pricing on every product" strip. */
export function PricingStrip() {
  return (
    <section className="px-6 py-10">
      <Container>
        <div className="flex flex-col items-start justify-between gap-4 rounded-lg border border-clay-100 bg-clay-50 px-7 py-6 sm:flex-row sm:items-center">
          <p className="text-[16px] font-semibold text-ink-800">
            The same transparent interchange-plus pricing on every product.
          </p>
          <ButtonLink href="/pricing" variant="secondary" size="md" className="shrink-0">
            See pricing
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}
