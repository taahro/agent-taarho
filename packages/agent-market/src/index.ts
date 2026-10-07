export type AgentId = string;
export type CapabilityId = string;

export interface Capability {
  id: CapabilityId;
  name: string;
  description: string;
  version: string;
  provider: AgentId;
  inputSchema?: Record<string, unknown>;
  outputSchema?: Record<string, unknown>;
  price?: {
    amount: number;
    currency: string;
    unit: string;
  };
}

export interface AgentCard {
  id: AgentId;
  name: string;
  endpoint: string;
  capabilities: Capability[];
  acceptsAgentPurchases: boolean;
}

export interface CapabilityRequest {
  requestId: string;
  buyer: AgentId;
  capabilityId: CapabilityId;
  input: Record<string, unknown>;
  maxPrice?: {
    amount: number;
    currency: string;
  };
}

export interface CapabilityOffer {
  requestId: string;
  provider: AgentId;
  capabilityId: CapabilityId;
  price: {
    amount: number;
    currency: string;
    unit: string;
  };
  terms: {
    delivery: string;
    expiry: string;
  };
}

export interface CapabilityReceipt {
  receiptId: string;
  requestId: string;
  buyer: AgentId;
  provider: AgentId;
  capabilityId: CapabilityId;
  status: "accepted" | "delivered" | "failed";
  price: {
    amount: number;
    currency: string;
    unit: string;
  };
  issuedAt: string;
}

export function canAfford(
  request: CapabilityRequest,
  offer: CapabilityOffer,
): boolean {
  if (!request.maxPrice) return true;
  return (
    request.maxPrice.currency === offer.price.currency &&
    request.maxPrice.amount >= offer.price.amount
  );
}

export function acceptOffer(
  request: CapabilityRequest,
  offer: CapabilityOffer,
  now = new Date().toISOString(),
): CapabilityReceipt {
  if (request.requestId !== offer.requestId) {
    throw new Error("request_id_mismatch");
  }
  if (request.capabilityId !== offer.capabilityId) {
    throw new Error("capability_id_mismatch");
  }
  if (request.buyer === offer.provider) {
    throw new Error("buyer_provider_must_differ");
  }
  if (!canAfford(request, offer)) {
    throw new Error("offer_exceeds_buyer_limit");
  }

  return {
    receiptId: crypto.randomUUID(),
    requestId: request.requestId,
    buyer: request.buyer,
    provider: offer.provider,
    capabilityId: request.capabilityId,
    status: "accepted",
    price: offer.price,
    issuedAt: now,
  };
}
