# argus-plugin-sdk

The **Argus** plugin contract: TypeScript types, the manifest JSON Schema, and
contract tests that every provider plugin implements. Published as
`@argus-tv/plugin-sdk`.

Argus plugins run **in-process** and expose a **TypeScript interface**
(see [ADR 0001](https://github.com/antoine-lombardo/argus/blob/main/docs/adr/0001-plugin-contract-ts-interfaces.md)).
A plugin bundle default-exports an object implementing `ArgusPlugin`; the host
holds a typed reference and calls its methods directly.

> Status: **Phase 3 — consumed by the host kernel.** `API_VERSION` is the
> package **major.minor** (currently `0.2`). Releases are `0.x` until the
> contract stabilizes.

## Install

```bash
npm install --save-dev @argus-tv/plugin-sdk@~0.2.0
```

The SDK is **types-first** plus a tiny shared runtime (`ArgusError`,
`definePlugin`, `mediaId`). Plugins depend on it at **build** time and
**bundle** any SDK runtime they import into their `index.js`. Host I/O is
**not** in this package — it is injected as `HostContext` by the host.

> Host code must use `isArgusError` (duck-typing). Do not use `instanceof
> ArgusError` across plugin bundle boundaries — each plugin inlines its own
> class copy.

## What's in here

| Area | Exports |
|------|---------|
| Plugin contract | `ArgusPlugin`, `PluginModule`, `definePlugin` |
| Host services | `HostContext`, `HttpClient`, `SecureStore`, `KeyValueStore`, `Logger`, `SettingsAccess` |
| Manifest | `PluginManifest` (includes required `version` + `build`), `manifestJsonSchema` |
| Media model | `MediaItem`, `MediaDetails`, `MediaId`, `mediaId`, … |
| Playback | `StreamDescriptor`, `DrmInfo`, `Subtitle` |
| Discovery | `SearchOptions`, `Row` |
| Auth / library | `AuthState`, `LoginFlow`, `Progress` |
| Errors | `ArgusError`, `isArgusError`, `isExpectedArgusError` |
| Constants | `API_VERSION`, `DEFAULT_TIMEOUTS` |

## Minimal plugin shape

```ts
import type { ArgusPlugin } from "@argus-tv/plugin-sdk";
import { API_VERSION } from "@argus-tv/plugin-sdk";

const plugin: ArgusPlugin = {
  manifest: {
    id: "com.example.provider",
    name: "Example Provider",
    version: "0.1.0",
    build: 1,
    apiVersion: API_VERSION,
    entry: "index.js",
    capabilities: ["search"],
    permissions: ["network"],
    platforms: ["tvos", "androidtv"],
  },
  async initialize(ctx) {
    ctx.log.info("ready");
  },
  async search(query, _opts, _signal) {
    return [];
  },
};

export default plugin;
```

Capability-gated methods are optional: their presence must match the
`capabilities` declared in the manifest. All methods are async and should honor
the `AbortSignal` and the deadlines in `DEFAULT_TIMEOUTS`.

## Develop

```bash
npm install
npm run typecheck   # tsc --noEmit over src + test (compile-time contract check)
npm test            # vitest: runtime manifest-schema validation
npm run build       # emit dist/ (JS + .d.ts)
```

Two layers of contract tests:

- **Compile-time:** `test/fixtures/sample-plugin.ts` must type-check against
  `ArgusPlugin`; a breaking contract change fails `typecheck`.
- **Runtime:** `test/manifest.test.ts` validates a sample manifest against
  `manifestJsonSchema` with Ajv (accepts valid, rejects malformed).

## Releasing

Versioning and publishing are automated with
[Changesets](https://github.com/changesets/changesets) + GitHub Actions:

1. **With each meaningful change**, add a changeset:

   ```bash
   npm run changeset
   ```

   Pick a bump (`patch`/`minor`/`major`) and write a short summary. Commit the
   generated file in `.changeset/`.
2. On push to `main`, the **Release** workflow opens (or updates) a
   *"Version Packages"* PR that bumps the version and updates `CHANGELOG.md`.
3. **Merging that PR publishes** to npm under the `next` dist-tag, with
   [npm provenance](https://docs.npmjs.com/generating-provenance-statements).

While the contract is `0.x`, everything ships as `next`. To cut a stable
release later, remove `publishConfig.tag` (or set it to `latest`) and bump to
`1.0.0`.

**One-time setup:** add an `NPM_TOKEN` (granular automation token for the
`@argus-tv` org) as a repository secret, and enable *Settings → Actions →
General → Allow GitHub Actions to create and approve pull requests*.

## License

MIT
