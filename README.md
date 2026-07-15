# argus-plugin-sdk

The **Argus** plugin contract: TypeScript types, the manifest JSON Schema, and
contract tests that every provider plugin implements. Published as
`@argus-tv/plugin-sdk`.

Argus plugins run **in-process** and expose a **TypeScript interface**
(see [ADR 0001](https://github.com/antoine-lombardo/argus/blob/main/docs/adr/0001-plugin-contract-ts-interfaces.md)).
A plugin bundle default-exports an object implementing `ArgusPlugin`; the host
holds a typed reference and calls its methods directly.

> Status: **Phase 1 — contract skeleton.** Types-first; the API version is `0.1`
> and may change until a host consumes it end-to-end. Releases are `0.x` and
> published under the **`next`** npm dist-tag until the contract stabilizes.

## Install

```bash
npm install --save-dev @argus-tv/plugin-sdk@next
```

The SDK provides **types only** — plugins depend on it at build time and bundle
their own runtime dependencies (no runtime SDK coupling).

## What's in here

| Area | Types |
|------|-------|
| Plugin contract | `ArgusPlugin`, `PluginModule` |
| Host services | `HostContext`, `HttpClient`, `SecureStore`, `KeyValueStore`, `Logger`, `SettingsAccess` |
| Manifest | `PluginManifest`, `manifestJsonSchema` |
| Media model | `MediaItem`, `MediaDetails`, `MediaId`, `Season`, `Episode`, `LiveEvent`, `Artwork`, `Person` |
| Playback | `StreamDescriptor`, `DrmInfo`, `Subtitle` |
| Discovery | `SearchOptions`, `Row` |
| Auth | `AuthState`, `LoginFlow` |
| Library | `Progress` |
| Errors | `ArgusError`, `ArgusErrorCode`, `isArgusError` |
| Constants | `API_VERSION`, `DEFAULT_TIMEOUTS` |

## Minimal plugin shape

```ts
import type { ArgusPlugin } from "@argus-tv/plugin-sdk";

const plugin: ArgusPlugin = {
  manifest: {
    id: "com.example.provider",
    name: "Example Provider",
    version: "0.1.0",
    apiVersion: "0.1",
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
npm run build       # emit dist/ (JS + .d.ts)
```

`test/fixtures/sample-plugin.ts` is a fixture that must type-check against
`ArgusPlugin`; a breaking contract change fails `typecheck`.

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
