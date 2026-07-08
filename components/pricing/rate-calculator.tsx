"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PillTabs } from "@/components/ui/tabs";
import { ButtonLink } from "@/components/ui/button-link";
import { calcBase, calcPresets, calcPresetLabels } from "@/lib/data";

type Mix = "inperson" | "online" | "mixed";

function tierFor(volume: number) {
  if (volume < 25000) return { name: "Starter", pct: 0.45, fee: 12 };
  if (volume < 100000) return { name: "Growth", pct: 0.32, fee: 10 };
  if (volume < 500000) return { name: "Scale", pct: 0.24, fee: 8 };
  return { name: "Enterprise", pct: 0.16, fee: 7 };
}

const fmt = (n: number) => n.toLocaleString("en-US", { maximumFractionDigits: 0 });

export function RateCalculator() {
  const [volume, setVolume] = React.useState(15000);
  const [mix, setMix] = React.useState<Mix>("mixed");

  const custom = volume >= 1_000_000;
  const base = calcBase[mix];
  const tier = tierFor(volume);
  const effPct = base + tier.pct;
  const monthly = (volume * effPct) / 100;

  // Range 0..6 maps to preset volumes.
  const sliderIndex = (() => {
    let idx = 0;
    for (let i = 0; i < calcPresets.length; i++) if (volume >= calcPresets[i]) idx = i;
    return idx;
  })();

  return (
    <Card tone="brand" padding="none" className="p-9 sm:p-10">
      <h3 className="text-center font-display font-semibold text-ink-900" style={{ fontSize: 24 }}>
        Estimate your rate
      </h3>
      <div className="mt-7 grid gap-8 md:grid-cols-2">
        {/* Controls */}
        <div>
          <Input
            label="Monthly card volume"
            type="number"
            min={0}
            prefix="$"
            value={volume}
            onChange={(e) => setVolume(Math.max(0, Number(e.target.value) || 0))}
          />
          <input
            type="range"
            min={0}
            max={6}
            step={1}
            value={sliderIndex}
            onChange={(e) => setVolume(calcPresets[Number(e.target.value)])}
            className="mt-5 w-full cursor-pointer"
            style={{ accentColor: "var(--clay-500)" }}
            aria-label="Volume preset"
          />
          <div className="mt-1.5 flex justify-between text-[10.5px] font-medium text-ink-400">
            {calcPresetLabels.map((l) => (
              <span key={l}>{l}</span>
            ))}
          </div>

          <p className="mt-6 mb-2 text-sm font-semibold text-ink-800">How do you take payments?</p>
          <PillTabs<Mix>
            value={mix}
            onValueChange={setMix}
            items={[
              { value: "inperson", label: "Mostly in person" },
              { value: "online", label: "Mostly online" },
              { value: "mixed", label: "A mix" },
            ]}
          />
        </div>

        {/* Result */}
        <div className="flex flex-col justify-center rounded-md border border-clay-100 bg-white p-6">
          {custom ? (
            <>
              <span className="inline-flex w-fit rounded-pill bg-clay-50 px-3 py-1 text-[12px] font-semibold text-clay-600">
                Enterprise volume
              </span>
              <p className="mt-3 font-display font-semibold text-ink-900" style={{ fontSize: 26 }}>
                Let's build a custom quote
              </p>
              <p className="mt-2 text-[14px] leading-relaxed text-ink-600">
                At $1M a month or more, you unlock custom interchange-plus pricing and dedicated support built
                around your book.
              </p>
              <ButtonLink href="/contact" variant="primary" size="md" className="mt-5 w-fit">
                Contact us for a custom quote
              </ButtonLink>
            </>
          ) : (
            <>
              <span className="inline-flex w-fit rounded-pill bg-clay-50 px-3 py-1 text-[12px] font-semibold text-clay-600">
                {tier.name} tier
              </span>
              <div className="mt-3 font-display font-semibold text-clay-600" style={{ fontSize: 42, lineHeight: 1 }}>
                ~{effPct.toFixed(2)}%
                <span className="ml-1 align-middle text-[20px] text-ink-400">+{tier.fee}¢</span>
              </div>
              <p className="mt-2 text-[13px] text-ink-500">
                est. interchange {base.toFixed(2)}% + your {tier.pct.toFixed(2)}% margin
              </p>
              <p className="mt-4 text-[14px] leading-relaxed text-ink-700">
                On ${fmt(volume)}/mo, roughly <strong className="text-ink-900">${fmt(monthly)}</strong> all-in.
              </p>
            </>
          )}
        </div>
      </div>
      <p className="mt-6 text-center text-[12.5px] leading-snug text-ink-400">
        Estimates only. Your exact interchange-plus rate depends on card mix, ticket size, and industry.
      </p>
    </Card>
  );
}
