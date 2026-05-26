## 1. Manifest and Declaration Configuration

- [x] 1.1 Implement Decision 3: Host Permission Migration and add declarativeNetRequest to permissions in `manifest.json`. Upgrade Manifest Version to 3 by renaming `browser_action` to `action` and changing `manifest_version` to `3`. Verify by checking that the manifest parses successfully and complies with Manifest V3 schema using `npm run build-chrome` without any bundler/compiler errors.
- [x] 1.2 Implement Decision 2: Declarative Header Stripping with `declarativeNetRequest` to satisfy Header Stripping with declarativeNetRequest by creating `rules.json` at the project root. Configure a static ruleset to remove `X-Frame-Options`, `frame-options`, and `Content-Security-Policy` headers from `sub_frame` and `xmlhttprequest` requests. Verify that `rules.json` contains valid JSON and conforms to the declarativeNetRequest schema.

## 2. Background Service Worker Implementation

- [x] 2.1 Implement Decision 1: Service Worker Wrapper (`background-wrapper.js`) by creating `background-wrapper.js` at the project root. This service worker must use `importScripts` to load `data/internal_libs/dictionaries_data.js` and `data/background/background.js` sequentially. Verify by checking that the wrapper file is correctly referenced in `manifest.json` under `background.service_worker`.
- [x] 2.2 Refactor background script for Background Service Worker Integration, satisfying Decision 4: Adapt Background Script for Service Worker Context. Modify `data/background/background.js` to replace any global references to `window` or `document` with safe checks using `navigator.userAgent` and type assertions. Verify by reviewing the script to ensure no runtime errors are thrown when executed in a windowless worker context.

## 3. Build and Packaging Verification

- [x] 3.1 Verify that the updated extension builds successfully for both Chrome and Firefox targets. Run `npm run build-chrome` and `npm run build-firefox` to package the extensions, and verify that the zip files are created correctly in `chrome_build/` and `firefox_build/` directories.
