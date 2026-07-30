// @vitest-environment jsdom
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import StatementGate from "@/components/tools/statement-gate";
import { resetUnlockForTests } from "@/lib/tools/unlock-store";

/**
 * The real analyzer imports a "use server" module (and the Anthropic SDK through it),
 * which has no business loading in a component test. The gate's contract is only
 * "reveal the tool once unlocked", so a stand-in is enough and keeps this test about
 * the gate rather than the analyzer.
 */
vi.mock("@/components/tools/statement-analyzer", () => ({
  default: () => <div data-testid="analyzer">analyzer</div>,
}));

const PASSWORD = "BYTE";

const analyzer = () => screen.queryByTestId("analyzer");
const passwordBox = () => screen.getByLabelText("Password");
const unlockButton = () => screen.getByRole("button", { name: "Unlock" });

beforeEach(() => {
  resetUnlockForTests();
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe("StatementGate", () => {
  it("starts locked, showing the prompt and not the tool", () => {
    render(<StatementGate />);
    expect(screen.getByText(/this tool is private/i)).toBeTruthy();
    expect(analyzer()).toBeNull();
  });

  it("rejects a wrong password and stays locked", async () => {
    const user = userEvent.setup();
    render(<StatementGate />);

    await user.type(passwordBox(), "nope");
    await user.click(unlockButton());

    expect(screen.getByText(/incorrect password/i)).toBeTruthy();
    expect(analyzer()).toBeNull();
  });

  // The whole point of the useSyncExternalStore rewrite: submitting has to actually
  // flip the rendered output, not just the store.
  it("reveals the tool on the correct password", async () => {
    const user = userEvent.setup();
    render(<StatementGate />);

    await user.type(passwordBox(), PASSWORD);
    await user.click(unlockButton());

    expect(analyzer()).toBeTruthy();
    expect(screen.queryByText(/this tool is private/i)).toBeNull();
  });

  it("submits on Enter as well as the button", async () => {
    const user = userEvent.setup();
    render(<StatementGate />);

    await user.type(passwordBox(), `${PASSWORD}{Enter}`);

    expect(analyzer()).toBeTruthy();
  });

  it("ignores surrounding whitespace", async () => {
    const user = userEvent.setup();
    render(<StatementGate />);

    await user.type(passwordBox(), `  ${PASSWORD}  `);
    await user.click(unlockButton());

    expect(analyzer()).toBeTruthy();
  });

  it("clears the error as soon as the user edits the field again", async () => {
    const user = userEvent.setup();
    render(<StatementGate />);

    await user.type(passwordBox(), "nope");
    await user.click(unlockButton());
    expect(screen.getByText(/incorrect password/i)).toBeTruthy();

    await user.type(passwordBox(), "x");
    expect(screen.queryByText(/incorrect password/i)).toBeNull();
  });

  // A remount stands in for a reload within the same tab: the unlock is persisted in
  // sessionStorage, so the gate must come back already open.
  it("stays unlocked across a remount", async () => {
    const user = userEvent.setup();
    render(<StatementGate />);
    await user.type(passwordBox(), PASSWORD);
    await user.click(unlockButton());
    expect(analyzer()).toBeTruthy();

    cleanup();
    render(<StatementGate />);

    expect(analyzer()).toBeTruthy();
    expect(screen.queryByText(/this tool is private/i)).toBeNull();
  });

  it("opens immediately when an earlier visit already unlocked it", () => {
    sessionStorage.setItem("ib-analyze-unlocked", "1");
    render(<StatementGate />);
    expect(analyzer()).toBeTruthy();
  });

  /**
   * The regression that motivated extracting the store. The old code called
   * setUnlocked(true) unconditionally, so a browser where sessionStorage throws
   * (private mode, blocked storage) could still open the tool. A naive
   * useSyncExternalStore conversion would have made the password permanently dead
   * in those browsers.
   */
  it("still unlocks when sessionStorage throws", async () => {
    vi.stubGlobal("sessionStorage", {
      getItem: () => {
        throw new Error("blocked");
      },
      setItem: () => {
        throw new Error("blocked");
      },
      removeItem: () => {
        throw new Error("blocked");
      },
    });
    resetUnlockForTests();

    const user = userEvent.setup();
    render(<StatementGate />);
    expect(analyzer()).toBeNull();

    await user.type(passwordBox(), PASSWORD);
    await user.click(unlockButton());

    expect(analyzer()).toBeTruthy();
  });
});
