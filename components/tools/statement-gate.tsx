"use client";

import { useEffect, useState } from "react";
import StatementAnalyzer from "@/components/tools/statement-analyzer";

const PASSWORD = "BYTE";
const STORAGE_KEY = "ib-analyze-unlocked";

/**
 * Soft, client-side password gate for the internal Statement Analyzer.
 * Not a security boundary — the password lives in the bundle; it only keeps
 * the tool out of casual sight. The page is also noindex, so search engines
 * never surface it. Unlock is remembered for the browser session.
 */
export default function StatementGate() {
  const [unlocked, setUnlocked] = useState(false);
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    try {
      if (sessionStorage.getItem(STORAGE_KEY) === "1") setUnlocked(true);
    } catch {
      /* sessionStorage unavailable — stay locked */
    }
  }, []);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (value.trim() === PASSWORD) {
      try {
        sessionStorage.setItem(STORAGE_KEY, "1");
      } catch {
        /* ignore */
      }
      setUnlocked(true);
      setError(false);
    } else {
      setError(true);
    }
  }

  if (unlocked) return <StatementAnalyzer />;

  return (
    <div
      style={{
        minHeight: "80vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#FAF6EF",
        padding: 24,
        fontFamily: "'Hanken Grotesk', -apple-system, sans-serif",
      }}
    >
      <form
        onSubmit={submit}
        style={{
          width: "100%",
          maxWidth: 380,
          background: "#FFFFFF",
          border: "1px solid #E0D6C6",
          borderRadius: 20,
          boxShadow: "0 2px 4px rgba(58,42,28,.05),0 6px 16px rgba(58,42,28,.08)",
          padding: 32,
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontFamily: "'Newsreader', Georgia, serif",
            fontSize: 24,
            fontWeight: 600,
            letterSpacing: "-0.02em",
            color: "#2A211A",
          }}
        >
          Impecca<span style={{ color: "#C0623E" }}>byte</span>
        </div>
        <p style={{ color: "#635648", fontSize: 14, margin: "8px 0 22px", lineHeight: 1.5 }}>
          This tool is private. Enter the password to continue.
        </p>
        <input
          type="password"
          autoFocus
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setError(false);
          }}
          placeholder="Password"
          aria-label="Password"
          style={{
            width: "100%",
            boxSizing: "border-box",
            fontSize: 15,
            color: "#2A211A",
            background: "#FFFFFF",
            border: "1.5px solid " + (error ? "#B23A2E" : "#E0D6C6"),
            borderRadius: 10,
            padding: "10px 13px",
            outline: "none",
            textAlign: "center",
            letterSpacing: "0.08em",
          }}
        />
        {error && (
          <p style={{ color: "#8F2E24", fontSize: 13, margin: "10px 0 0" }}>
            Incorrect password. Try again.
          </p>
        )}
        <button
          type="submit"
          style={{
            marginTop: 18,
            width: "100%",
            fontFamily: "'Hanken Grotesk', -apple-system, sans-serif",
            fontWeight: 600,
            fontSize: 15,
            color: "#FFFFFF",
            background: "#C0623E",
            border: "1.5px solid transparent",
            borderRadius: 999,
            padding: "11px 18px",
            cursor: "pointer",
            boxShadow: "0 4px 14px rgba(192,98,62,.28)",
          }}
        >
          Unlock
        </button>
      </form>
    </div>
  );
}
