import { describe, expect, it } from "vitest";
import { acceptOffer, canAfford, type CapabilityOffer, type CapabilityRequest } from "./index";

const request: CapabilityRequest = {
  requestId: "req-001",
  buyer: "agent:buyer",
  capabilityId: "cap:document-extract",
  input: { document: "invoice.pdf" },
  maxPrice: { amount: 2, currency: "USD" },
};

const offer: CapabilityOffer = {
  requestId: "req-001",
  provider: "agent:extractor",
  capabilityId: "cap:document-extract",
  price: { amount: 1, currency: "USD", unit: "request" },
  terms: { delivery: "sync", expiry: "2026-12-31T00:00:00Z" },
};

describe("agent capability market primitives", () => {
  it("accepts an affordable offer", () => {
    expect(canAfford(request, offer)).toBe(true);
    expect(acceptOffer(request, offer, "2026-10-06T00:00:00Z").status).toBe("accepted");
  });

  it("rejects an offer above the buyer limit", () => {
    expect(() =>
      acceptOffer(
        { ...request, maxPrice: { amount: 0.5, currency: "USD" } },
        offer,
      ),
    ).toThrow("offer_exceeds_buyer_limit");
  });

  it("prevents self-purchase", () => {
    expect(() =>
      acceptOffer(request, { ...offer, provider: request.buyer }),
    ).toThrow("buyer_provider_must_differ");
  });
});
