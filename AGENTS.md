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
   - While the contract is `0.x`: breaking changes are `minor`, everything else
     is `patch` (semver's 0.x rule). Bump `apiVersion` in `src/capabilities.ts`
     only on a contract-breaking change.
3. Open a PR / push to `main`. On `main`, the **Release** workflow
   (`.github/workflows/release.yml`) opens or updates a **"Version Packages"**
   PR that applies the bump + updates `CHANGELOG.md`.
4. **Merging the "Version Packages" PR publishes** to npm automatically:
   `changeset publish` runs with provenance under the **`next`** dist-tag.

**Install/consume:** `npm i -D @argus-tv/plugin-sdk@next` (the `next` tag is the
current `0.x` line; `latest` is reserved for the first stable `1.0.0`).

### Publishing rules & gotchas

- **`0.x` → `next` dist-tag** via `publishConfig.tag` in `package.json`. When
  stabilizing to `1.0.0`, remove/adjust `publishConfig.tag` and drop the `next`
  guidance from docs.
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
