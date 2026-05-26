## Why

The Chrome Web Store is phasing out support for Manifest V2 extensions. To ensure the "My Dictionary" extension continues to run, receive updates, and remain compatible with modern Chromium-based browsers, it must be upgraded to Manifest V3.

## What Changes

- Update `manifest.json` from `manifest_version: 2` to `manifest_version: 3`.
- Replace the background scripts array in `manifest.json` with a single Service Worker (`background-wrapper.js`) that imports the necessary files.
- Replace `browser_action` with `action` in `manifest.json`.
- Migrate blocking webRequest handlers to the `declarativeNetRequest` API (`rules.json`) to dynamically strip `X-Frame-Options` and `Content-Security-Policy` headers.
- Move host permission `<all_urls>` from `permissions` to `host_permissions` in `manifest.json`.
- Refactor browser-detection logic in the background script (`data/background/background.js`) to not rely on the global `window` object since it is not defined in service workers.

## Non-Goals (optional)

- Fully migrating Firefox compatibility to MV3 (Firefox continues to support MV2 and has distinct MV3 migration paths; our focus is upgrading Chrome/Chromium compatibility).
- Redesigning the user interface or adding new features unrelated to the Manifest V3 transition.

## Capabilities

### New Capabilities

- `manifest-v3-migration`: Upgrade the manifest, persistent background scripts, permissions, and network interceptors to Manifest V3 standards.

### Modified Capabilities

(none)

## Impact

- Affected specs:
  - New spec: `openspec/specs/manifest-v3-migration/spec.md`
- Affected code:
  - New:
    - `background-wrapper.js`
    - `rules.json`
  - Modified:
    - `manifest.json`
    - `data/background/background.js`
  - Removed:
    (none)
