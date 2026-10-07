# Taarho Agent Market

Agent-to-agent capability exchange substrate.

The first layer is deliberately narrow:

- agents publish machine-readable capabilities;
- agents discover capabilities from other agents;
- agents negotiate a capability purchase directly with the provider agent;
- providers return signed-style receipts that can be verified without a central marketplace;
- humans are not part of the transaction loop.

This package is transport-neutral. A2A, HTTP, MCP-adjacent gateways, or other transports can be added around these primitives later.

## Design rule

**Agent discovers agent → agent requests capability → provider quotes → buyer accepts → provider delivers → both retain a receipt.**

No central broker is required by the core model.
