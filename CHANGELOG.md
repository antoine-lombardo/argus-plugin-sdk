# @argus-tv/plugin-sdk

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
