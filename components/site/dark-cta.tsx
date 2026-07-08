import { Container } from "./container";
import { ButtonLink } from "@/components/ui/button-link";

/** The warm espresso closing CTA repeated at the foot of every page. */
export function DarkCTA({
  titleA,
  titleEm,
  body,
  primary,
  secondary,
}: {
  titleA: string;
  titleEm: string;
  body: string;
  primary: { label: string; href: string };
  secondary: { label: string; href: string };
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
              <ButtonLink href={primary.href} variant="accent" size="lg">
                {primary.label}
              </ButtonLink>
              <ButtonLink href={secondary.href} variant="dark-secondary" size="lg">
                {secondary.label}
              </ButtonLink>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
