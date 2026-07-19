# Agent guide — argus-plugin-sdk

Instructions for AI agents and contributors working in this repository. This is
the **contract package** (`@argus-tv/plugin-sdk`) that the Argus host and every
plugin depend on. See the host repo (`argus`) for product context, especially
[ARCHITECTURE.md](https://github.com/antoine-lombardo/argus/blob/main/docs/ARCHITECTURE.md),
[PACKAGING.md](https://github.com/antoine-lombardo/argus/blob/main/docs/PACKAGING.md),
and [ADR 0001](https://github.com/antoine-lombardo/argus/blob/main/docs/adr/0001-plugin-contract-ts-interfaces.md).

## What this repo is

- **Types-first contract**: media model, `ArgusPlugin`, `HostContext`,
  `PluginManifest` + `manifestJsonSchema`, `StreamDescriptor`, error taxonomy,
  and capability/timeout constants. Exported from `src/`.
- **No runtime SDK coupling**: consumers use it as a dev/build dependency and
  bundle their own runtime deps. Keep it dependency-light and side-effect free.
- Published to npm as **`@argus-tv/plugin-sdk`** (public, scoped to the
  `@argus-tv` org).

## Dev commands

```bash
npm ci            # install (CI-exact); use npm install when changing deps
npm run typecheck # tsc --noEmit over src + test (compile-time contract check)
npm test          # vitest: runtime manifest-schema validation (Ajv)
npm run build     # emit dist/ (JS + .d.ts)
```

Two contract tests, keep both green when changing the contract:

- `test/fixtures/sample-plugin.ts` must type-check against `ArgusPlugin`
  (compile-time). Update it when the interface changes.
- `test/manifest.test.ts` validates a sample manifest against
  `manifestJsonSchema` at runtime. Update it when the manifest schema changes.

Note: Ajv is only importable via its named export under this repo's strict
`verbatimModuleSyntax` config — `import { Ajv2020 } from "ajv/dist/2020.js"`.

## Releasing / publishing a new version — READ THIS

Versioning and publishing are **automated with [Changesets](https://github.com/changesets/changesets)
+ GitHub Actions**. **Do not** hand-edit `version` in `package.json`, run
`npm publish` manually, or create git tags by hand. The pipeline does it.

**To ship a change that should be released:**

1. Make your code change (and update the fixture/docs as needed).
2. **Add a changeset** describing it and the semver bump:

   ```bash
   npm run changeset
   ```

   Pick `patch` / `minor` / `major`, write a one-line summary. This creates a
   file under `.changeset/`. **Commit it with your change.**
   - **`API_VERSION` = package major.minor** (e.g. `0.2.3` → `"0.2"`). Enforced
     by `test/api-version.test.ts`.
   - While the contract is `0.x`: **minor** = contract changed → bump package
     minor **and** set `API_VERSION` to the new `X.Y`. **patch** = no contract
     change → leave `API_VERSION` alone.
   - On `1.x+`: **major** = contract break (bump `API_VERSION`); **minor/patch**
     stay on the same `API_VERSION` major.minor line only when the contract
     shape is unchanged (prefer still matching package `X.Y` if you cut a new
     minor line for the host lockstep).
   - **Host lockstep** ([ADR 0009](https://github.com/antoine-lombardo/argus/blob/main/docs/adr/0009-host-sdk-minor-lockstep.md)):
     host `argus@X.Y.*` pins `@argus-tv/plugin-sdk@~X.Y.0`. Plugins set
     `manifest.apiVersion` to that same `X.Y` (import `API_VERSION`).
3. Open a PR / push to `main`. On `main`, the **Release** workflow
   (`.github/workflows/release.yml`) opens or updates a **"Version Packages"**
   PR that applies the bump + updates `CHANGELOG.md`.
4. **Merging the "Version Packages" PR publishes** to npm automatically:
   `changeset publish` runs with provenance under the **`next`** dist-tag.

**Install/consume:** match the host major.minor
([ADR 0009](https://github.com/antoine-lombardo/argus/blob/main/docs/adr/0009-host-sdk-minor-lockstep.md)):
`npm i -D @argus-tv/plugin-sdk@~0.2.0` for host `0.2.x`. (Historical docs may
mention a `next` dist-tag for `0.x`; prefer an explicit `~X.Y.0` pin.)

### Publishing rules & gotchas

- After publishing a **minor**, remind host maintainers (or open a follow-up) to
  bump `argus` to the same `X.Y` and update the tilde pin — lockstep is required
  ([ADR 0009](https://github.com/antoine-lombardo/argus/blob/main/docs/adr/0009-host-sdk-minor-lockstep.md)).
- **`0.x` publishConfig.tag:** package still sets `publishConfig.tag` to `next`
  when present; prefer documenting/`~X.Y.0` pins for consumers over relying on
  dist-tags alone. When stabilizing to `1.0.0`, remove/adjust `publishConfig.tag`.
- **Secrets/permissions** (already configured; only revisit if publishing fails):
  `NPM_TOKEN` repo secret (granular automation token for `@argus-tv`), and the
  repo setting *Allow GitHub Actions to create and approve pull requests*.
- **Provenance** requires `id-token: write` (set in the release workflow) — keep
  it.
- **Lockfile:** if you change deps, run `npm install`, commit the updated
  `package-lock.json`, and make sure `npm ci` passes (CI uses it). Note the
  `overrides` pin on `@types/node` that keeps `npm ci` consistent — don't remove
  it without re-verifying `npm ci`.
- **No changeset = no release.** A change with no changeset merges without ever
  publishing. If a change is user-visible to plugin authors, it needs one.

## Keep docs in sync

If you change the contract or the release process, update this file, the
`README.md` here, and the host repo's
[PACKAGING.md](https://github.com/antoine-lombardo/argus/blob/main/docs/PACKAGING.md)
+ [IMPLEMENTATION-PLAN.md](https://github.com/antoine-lombardo/argus/blob/main/docs/IMPLEMENTATION-PLAN.md)
in the same change. Contract-shape decisions get an ADR in the host repo's
`docs/adr/`.
