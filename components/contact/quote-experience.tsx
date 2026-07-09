"use client";

import * as React from "react";
import { useActionState } from "react";
import Script from "next/script";
import { Check, FileUp, MapPin, Clock } from "lucide-react";
import { Container } from "@/components/site/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ButtonLink } from "@/components/ui/button-link";
import { INDUSTRY_OPTIONS, VOLUME_OPTIONS } from "@/lib/quote-options";
import { submitQuote, type QuoteFormState } from "@/app/contact/actions";

const STEPS = [
  "Tell us about your business",
  "We build a custom interchange-plus quote",
  "You approve it, and we get you set up",
];

const initialState: QuoteFormState = { status: "idle" };
const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

export function QuoteExperience() {
  const [fileName, setFileName] = React.useState<string | null>(null);
  const [state, formAction, pending] = useActionState(submitQuote, initialState);

  // Turnstile tokens are single-use; reset the widget after a failed attempt,
  // but not for field-validation errors, since those never consume the token.
  React.useEffect(() => {
    if (state.status === "error" && !state.fieldErrors) {
      (window as unknown as { turnstile?: { reset: () => void } }).turnstile?.reset();
    }
  }, [state]);

  const fieldErrors = state.status === "error" ? state.fieldErrors : undefined;

  if (state.status === "success") {
    return (
      <section className="px-6 py-24">
        <Container width="narrow" className="text-center">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-round bg-sage-500 text-white">
            <Check size={34} strokeWidth={2.4} />
          </span>
          <h1 className="mt-6 font-display font-semibold text-ink-900" style={{ fontSize: "clamp(30px,4vw,44px)" }}>
            Your request is in.
          </h1>
          <p className="mx-auto mt-4 max-w-[480px] text-[17px] leading-relaxed text-ink-600">
            Thanks — our team will reach out within one business day with a custom interchange-plus quote. Keep
            an eye on your inbox.
          </p>
          <ButtonLink href="/" variant="secondary" size="lg" className="mt-8">
            Back to home
          </ButtonLink>
        </Container>
      </section>
    );
  }

  return (
    <section className="px-6 pb-24 pt-16">
      <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" strategy="afterInteractive" />
      <Container>
        <div className="grid gap-14 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          {/* Left column */}
          <div>
            <Eyebrow>Get a quote</Eyebrow>
            <h1 className="mt-4 font-display font-semibold text-ink-900" style={{ fontSize: "clamp(32px,4vw,48px)", lineHeight: 1.05 }}>
              See your rate in one business day.
            </h1>
            <p className="mt-5 text-[18px] leading-relaxed text-ink-600">
              Tell us a little about your business and we'll build a custom interchange-plus quote — no
              obligation, no pressure.
            </p>

            <ol className="mt-8 flex flex-col gap-4">
              {STEPS.map((step, i) => (
                <li key={step} className="flex items-center gap-3.5">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-round bg-clay-50 font-mono text-[14px] font-semibold text-clay-600">
                    {i + 1}
                  </span>
                  <span className="text-[15.5px] text-ink-700">{step}</span>
                </li>
              ))}
            </ol>

            <Card padding="none" elevation="sm" className="mt-8 p-5">
              <div className="flex items-start gap-3">
                <MapPin size={18} className="mt-0.5 shrink-0 text-clay-500" />
                <span className="text-[14.5px] text-ink-700">
                  1606 Headway Circle Ste. 9317, Austin, TX 78754
                </span>
              </div>
              <div className="mt-3 flex items-start gap-3">
                <Clock size={18} className="mt-0.5 shrink-0 text-clay-500" />
                <span className="text-[14.5px] text-ink-700">Monday – Friday, 9–6 CT</span>
              </div>
            </Card>
          </div>

          {/* Right column — form */}
          <Card elevation="raised" padding="none" className="p-7 sm:p-8">
            <h2 className="font-display font-semibold text-ink-900" style={{ fontSize: 26 }}>
              Request your quote
            </h2>
            <form className="mt-6 flex flex-col gap-5" action={formAction}>
              <Input label="Business name" name="business_name" required placeholder="Saffron & Co"
                error={fieldErrors?.businessName} />

              <div className="grid gap-5 sm:grid-cols-2">
                <Select label="Industry" name="industry" required options={INDUSTRY_OPTIONS} defaultValue="" />
                <Select label="Monthly volume" name="monthly_volume" required options={VOLUME_OPTIONS} defaultValue="" />
              </div>

              <Input
                label="Current processor"
                name="current_processor"
                placeholder="e.g. Square, Stripe, none yet"
                hint="Optional — helps us beat your current rate"
              />

              {/* File upload — submitted as "statement" */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-ink-800">
                  Recent merchant statement (PDF, optional)
                </label>
                <label className="flex cursor-pointer items-center gap-3 rounded-md border-[1.5px] border-dashed border-ink-300 bg-ink-50 px-4 py-3.5 transition-colors hover:border-clay-400 hover:bg-clay-50">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-clay-50 text-clay-600">
                    <FileUp size={18} />
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-[14.5px] font-medium text-ink-800">
                      {fileName ?? "Upload your latest statement (PDF)"}
                    </span>
                    <span className="block text-[12.5px] text-ink-500">
                      Optional — helps us build a full assessment
                    </span>
                  </span>
                  <input
                    type="file"
                    name="statement"
                    accept="application/pdf,.pdf"
                    className="sr-only"
                    onChange={(e) => setFileName(e.target.files?.[0]?.name ?? null)}
                  />
                </label>
                {fieldErrors?.statement && (
                  <span className="text-xs text-brick-500">{fieldErrors.statement}</span>
                )}
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <Input label="Email" name="email" required type="email" placeholder="you@business.com"
                  error={fieldErrors?.email} />
                <Input label="Phone" name="phone" type="tel" placeholder="(512) 555-0199" />
              </div>

              {/* Honeypot — hidden from users, tempting to bots */}
              <input
                type="text"
                name="company_website"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                className="absolute left-[-9999px] h-0 w-0 opacity-0"
              />

              {TURNSTILE_SITE_KEY && (
                <div className="cf-turnstile" data-sitekey={TURNSTILE_SITE_KEY} data-theme="light" />
              )}

              {state.status === "error" && (
                <p aria-live="polite" className="text-[13.5px] font-medium text-brick-500">
                  {state.message}
                </p>
              )}

              <Button type="submit" variant="primary" size="lg" block disabled={pending}>
                {pending ? "Sending…" : "Request quote"}
              </Button>
              <p className="text-center text-[12.5px] leading-snug text-ink-400">
                No obligation. We'll never sell your info. Approval subject to underwriting.
              </p>
            </form>
          </Card>
        </div>
      </Container>
    </section>
  );
}
