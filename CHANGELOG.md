# @argus-tv/plugin-sdk

## 0.2.1

### Patch Changes

- 34a6482: Set API_VERSION to "0.2" to match package major.minor (was wrongly left at "0.1" in 0.2.0).

## 0.2.0

### Minor Changes

- 88c5b7d: Require `build` (positive integer) on `PluginManifest` for version+build update identity.

### Patch Changes

- 88c5b7d: Duck-type `isArgusError` across plugin bundle boundaries; add `isExpectedArgusError`, `definePlugin`, and `mediaId` helpers.

## 0.1.1

### Patch Changes

- 2855602: Add runtime manifest-schema validation tests (Vitest + Ajv) covering the valid
  sample manifest and rejection of malformed manifests, and wire `npm test` into
  CI. No changes to the published contract.

## 0.1.0

### Minor Changes

- f62e1e8: Initial plugin contract skeleton (`apiVersion` 0.1): media model DTOs, the
  `ArgusPlugin` interface and `HostContext` services, `PluginManifest` type +
  `manifestJsonSchema`, `StreamDescriptor`/DRM types, the `ArgusError` taxonomy,
  and capability/timeout constants.
