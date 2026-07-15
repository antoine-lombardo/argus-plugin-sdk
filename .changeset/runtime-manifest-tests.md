---
"@argus-tv/plugin-sdk": patch
---

Add runtime manifest-schema validation tests (Vitest + Ajv) covering the valid
sample manifest and rejection of malformed manifests, and wire `npm test` into
CI. No changes to the published contract.
