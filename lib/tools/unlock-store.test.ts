import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import {
  isUnlocked,
  isUnlockedOnServer,
  markUnlocked,
  subscribeToUnlock,
  resetUnlockForTests,
} from "@/lib/tools/unlock-store";

/** Minimal sessionStorage stand-in; the vitest env is "node", which has none. */
function installStorage(impl?: Partial<Storage>) {
  const data = new Map<string, string>();
  const store = {
    getItem: (k: string) => data.get(k) ?? null,
    setItem: (k: string, v: string) => void data.set(k, v),
    removeItem: (k: string) => void data.delete(k),
    ...impl,
  } as Storage;
  vi.stubGlobal("sessionStorage", store);
  return store;
}

/** A storage that throws on every access, as private-mode browsers can. */
function installBlockedStorage() {
  return installStorage({
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
}

beforeEach(() => {
  installStorage();
  resetUnlockForTests();
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("unlock store", () => {
  it("starts locked", () => {
    expect(isUnlocked()).toBe(false);
  });

  it("is always locked on the server, so SSR never reveals the tool", () => {
    markUnlocked();
    expect(isUnlocked()).toBe(true);
    expect(isUnlockedOnServer()).toBe(false);
  });

  it("unlocks and persists to sessionStorage", () => {
    markUnlocked();
    expect(isUnlocked()).toBe(true);
    expect(sessionStorage.getItem("ib-analyze-unlocked")).toBe("1");
  });

  it("reads an unlock persisted by an earlier page load", () => {
    sessionStorage.setItem("ib-analyze-unlocked", "1");
    expect(isUnlocked()).toBe(true);
  });

  it("notifies subscribers so useSyncExternalStore re-renders on unlock", () => {
    const seen: boolean[] = [];
    subscribeToUnlock(() => seen.push(isUnlocked()));
    markUnlocked();
    expect(seen).toEqual([true]);
  });

  it("stops notifying after unsubscribe", () => {
    let calls = 0;
    const unsubscribe = subscribeToUnlock(() => calls++);
    unsubscribe();
    markUnlocked();
    expect(calls).toBe(0);
  });

  // The regression this guards: sessionStorage throwing must not make the gate
  // impossible to open. Before, submit() called setUnlocked(true) unconditionally;
  // the in-memory flag preserves that behaviour.
  it("still unlocks when sessionStorage throws (private mode)", () => {
    installBlockedStorage();
    resetUnlockForTests();
    expect(isUnlocked()).toBe(false);
    markUnlocked();
    expect(isUnlocked()).toBe(true);
  });

  it("notifies subscribers even when storage is blocked", () => {
    installBlockedStorage();
    resetUnlockForTests();
    let calls = 0;
    subscribeToUnlock(() => calls++);
    markUnlocked();
    expect(calls).toBe(1);
  });
});
