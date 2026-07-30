/**
 * Unlock state for the internal Statement Analyzer gate, held outside React.
 *
 * sessionStorage is an external store, so the gate reads it through
 * useSyncExternalStore rather than copying it into state with a mount effect. That
 * keeps the server render locked (via the server snapshot) with no hydration
 * mismatch, and avoids the extra render an effect-then-setState causes on mount.
 *
 * Not a security boundary — see components/tools/statement-gate.tsx.
 */
const STORAGE_KEY = "ib-analyze-unlocked";

let listeners: (() => void)[] = [];

/** Fallback for browsers where sessionStorage throws (private mode, blocked storage):
 *  unlocking still works, it just will not survive a reload. */
let unlockedInMemory = false;

export function subscribeToUnlock(onStoreChange: () => void) {
  listeners = [...listeners, onStoreChange];
  return () => {
    listeners = listeners.filter((l) => l !== onStoreChange);
  };
}

/** Client snapshot. Returns a primitive, so it is safe to call on every render. */
export function isUnlocked(): boolean {
  if (unlockedInMemory) return true;
  try {
    return sessionStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

/** Server snapshot — always locked, so SSR never reveals the tool. */
export function isUnlockedOnServer(): boolean {
  return false;
}

export function markUnlocked(): void {
  unlockedInMemory = true;
  try {
    sessionStorage.setItem(STORAGE_KEY, "1");
  } catch {
    /* storage blocked — the in-memory flag carries this session */
  }
  for (const notify of listeners) notify();
}

/** Test seam: clears both the in-memory flag and the stored value. */
export function resetUnlockForTests(): void {
  unlockedInMemory = false;
  listeners = [];
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    /* nothing to clear */
  }
}
