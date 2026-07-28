import { Container } from "./container";
import { ButtonLink } from "@/components/ui/button-link";
import { ChatLink } from "@/components/ui/chat-link";

/**
 * One closing-CTA button.
 *
 * `chat: true` opens the Intercom messenger instead of navigating; `href` stays
 * required and is the fallback the click follows whenever the messenger isn't
 * available. See components/ui/chat-link.tsx.
 */
export type CTA = { label: string; href: string; chat?: boolean };

function CTAButton({
  cta,
  variant,
}: {
  cta: CTA;
  variant: "accent" | "dark-secondary";
}) {
  const Component = cta.chat ? ChatLink : ButtonLink;
  return (
    <Component href={cta.href} variant={variant} size="lg">
      {cta.label}
    </Component>
  );
}

/** The warm espresso closing CTA repeated at the foot of every page. */
export function DarkCTA({
  titleA,
  titleEm,
  body,
  primary,
  secondary,
  footnote,
}: {
  titleA: string;
  titleEm: string;
  body: string;
  primary: CTA;
  secondary: CTA;
  /** Quiet legal line rendered under the card (e.g. the /integrations trademark notice). */
  footnote?: React.ReactNode;
}) {
  return (
    <section className="px-6 py-24">
      <Container>
        <div className="relative overflow-hidden rounded-lg bg-surface-dark px-8 py-16 text-center sm:px-14 sm:py-[72px]">
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(80% 130% at 50% -25%, rgba(224,160,77,0.22), transparent 62%)",
            }}
          />
          <div className="relative mx-auto max-w-[720px]">
            <h2
              className="font-display font-semibold text-[#FBF6EE]"
              style={{ fontSize: "clamp(32px, 4vw, 50px)", lineHeight: 1.08 }}
            >
              {titleA} <span className="em-amber">{titleEm}</span>
            </h2>
            <p className="mx-auto mt-5 max-w-[560px] text-[18px] leading-relaxed text-[rgba(246,238,226,0.8)]">
              {body}
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <CTAButton cta={primary} variant="accent" />
              <CTAButton cta={secondary} variant="dark-secondary" />
            </div>
          </div>
        </div>
        {footnote && (
          <p className="mx-auto mt-5 max-w-[760px] text-center text-[12px] leading-relaxed text-ink-400">
            {footnote}
          </p>
        )}
      </Container>
    </section>
  );
}
