import { describe, it, expect } from "vitest";
import {
  PRODUCTS,
  SOLUTIONS,
  productOrder,
  isProductKey,
  isSolutionKey,
  type SolutionKey,
} from "@/lib/data";

/**
 * Regression guards for the dynamic-route slug lookups.
 *
 * `app/products/[key]` and `app/industries/[key]` used to index their record
 * with an unchecked cast — `PRODUCTS[key as ProductKey]`. Because every object
 * inherits from Object.prototype, `PRODUCTS.toString` is a *function*, which is
 * truthy, so `if (!p) notFound()` was skipped and the page threw further down:
 * `/products/toString` returned HTTP 500 on a public URL instead of 404.
 *
 * These guards must therefore reject inherited keys, not merely unknown ones.
 */
const PROTOTYPE_KEYS = [
  "toString",
  "constructor",
  "__proto__",
  "valueOf",
  "hasOwnProperty",
  "isPrototypeOf",
  "propertyIsEnumerable",
  "toLocaleString",
];

describe("isProductKey", () => {
  it("accepts every real product key", () => {
    for (const key of productOrder) expect(isProductKey(key), key).toBe(true);
  });

  it("rejects unknown slugs", () => {
    expect(isProductKey("nope")).toBe(false);
    expect(isProductKey("")).toBe(false);
  });

  it("rejects inherited Object.prototype keys", () => {
    for (const key of PROTOTYPE_KEYS) expect(isProductKey(key), key).toBe(false);
  });

  it("narrows so a guarded lookup always yields a real product", () => {
    for (const key of [...productOrder, ...PROTOTYPE_KEYS, "nope"]) {
      if (isProductKey(key)) expect(PRODUCTS[key].key).toBe(key);
    }
  });
});

describe("isSolutionKey", () => {
  const allSolutionKeys = Object.keys(SOLUTIONS) as SolutionKey[];

  it("accepts every real solution key", () => {
    for (const key of allSolutionKeys) expect(isSolutionKey(key), key).toBe(true);
  });

  it("rejects unknown slugs", () => {
    expect(isSolutionKey("nope")).toBe(false);
    expect(isSolutionKey("")).toBe(false);
  });

  it("rejects inherited Object.prototype keys", () => {
    for (const key of PROTOTYPE_KEYS) expect(isSolutionKey(key), key).toBe(false);
  });

  it("narrows so a guarded lookup always yields a real solution", () => {
    for (const key of [...allSolutionKeys, ...PROTOTYPE_KEYS, "nope"]) {
      if (isSolutionKey(key)) expect(SOLUTIONS[key].key).toBe(key);
    }
  });
});
