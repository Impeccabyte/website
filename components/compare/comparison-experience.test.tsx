// @vitest-environment jsdom
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ComparisonExperience } from "@/components/compare/comparison-experience";
import { COMPETITORS, competitorOrder } from "@/lib/compare";

const pill = (name: string) => screen.getByRole("button", { name });
const liveRegion = () => document.querySelector('[role="status"]')!;

let replaceState: ReturnType<typeof vi.spyOn>;

beforeEach(() => {
  // Switching is a shallow URL swap, so replaceState is the observable side effect.
  replaceState = vi.spyOn(window.history, "replaceState").mockImplementation(() => {});
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe("ComparisonExperience", () => {
  it("renders every competitor as a pill", () => {
    render(<ComparisonExperience initial="square" variant="hub" />);
    for (const slug of competitorOrder) {
      expect(pill(COMPETITORS[slug].name)).toBeTruthy();
    }
  });

  it("marks only the initial competitor as pressed", () => {
    render(<ComparisonExperience initial="shopify" variant="hub" />);
    expect(pill("Shopify").getAttribute("aria-pressed")).toBe("true");
    expect(pill("Square").getAttribute("aria-pressed")).toBe("false");
    expect(pill("Toast").getAttribute("aria-pressed")).toBe("false");
  });

  it("moves the pressed state when another pill is clicked", async () => {
    const user = userEvent.setup();
    render(<ComparisonExperience initial="square" variant="hub" />);

    await user.click(pill("Toast"));

    expect(pill("Toast").getAttribute("aria-pressed")).toBe("true");
    expect(pill("Square").getAttribute("aria-pressed")).toBe("false");
  });

  it("shallow-updates the URL to the selected competitor", async () => {
    const user = userEvent.setup();
    render(<ComparisonExperience initial="square" variant="hub" />);

    await user.click(pill("Shopify"));

    expect(replaceState).toHaveBeenCalledTimes(1);
    expect(replaceState).toHaveBeenCalledWith(null, "", "/compare/shopify");
  });

  // Guards the deliberate choice of replaceState over pushState: Back should leave the
  // page rather than walking back through three tabs.
  it("never pushes history entries", async () => {
    const pushState = vi.spyOn(window.history, "pushState");
    const user = userEvent.setup();
    render(<ComparisonExperience initial="square" variant="hub" />);

    await user.click(pill("Shopify"));
    await user.click(pill("Toast"));

    expect(pushState).not.toHaveBeenCalled();
    expect(replaceState).toHaveBeenCalledTimes(2);
  });

  it("treats clicking the already-active pill as a no-op", async () => {
    const user = userEvent.setup();
    render(<ComparisonExperience initial="square" variant="hub" />);

    await user.click(pill("Square"));

    expect(replaceState).not.toHaveBeenCalled();
    expect(pill("Square").getAttribute("aria-pressed")).toBe("true");
  });

  it("names the active competitor in the live region", async () => {
    const user = userEvent.setup();
    render(<ComparisonExperience initial="square" variant="hub" />);
    expect(liveRegion().textContent).toContain("Square");

    await user.click(pill("Toast"));

    expect(liveRegion().textContent).toContain("Toast");
  });

  /**
   * The accessibility fix this component received: the live region must be a PERSISTENT
   * node, not the keyed block that remounts on switch. A region that is itself
   * remounted arrives pre-populated in a single commit, and several screen readers only
   * announce mutations within an existing region — so the announcement would be
   * unreliable. Asserting node identity survives the swap is what pins that.
   */
  it("keeps the same live-region node across a switch", async () => {
    const user = userEvent.setup();
    render(<ComparisonExperience initial="square" variant="hub" />);
    const before = liveRegion();

    await user.click(pill("Shopify"));

    expect(liveRegion()).toBe(before);
    expect(before.getAttribute("aria-live")).toBe("polite");
  });

  it("keeps a generic h1 on the hub and lets the block name the competitor", () => {
    render(<ComparisonExperience initial="square" variant="hub" />);

    expect(screen.getByRole("heading", { level: 1 }).textContent).toContain("honest");
    expect(
      screen.getByRole("heading", { level: 2, name: "Impeccabyte vs. Square" })
    ).toBeTruthy();
  });

  // On a competitor route the h1 already reads "Impeccabyte vs. {name}", so the block
  // suppresses its own h2 — the line must appear exactly once, not twice.
  it("names the competitor in the h1 without repeating it below", () => {
    render(<ComparisonExperience initial="square" variant="competitor" />);

    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe(
      "Impeccabyte vs. Square"
    );
    expect(screen.getAllByText("Impeccabyte vs. Square")).toHaveLength(1);
  });

  it("retitles the h1 when switching on a competitor route", async () => {
    const user = userEvent.setup();
    render(<ComparisonExperience initial="square" variant="competitor" />);

    await user.click(pill("Toast"));

    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe(
      "Impeccabyte vs. Toast"
    );
  });
});
