## Context

The extension "My Dictionary" currently uses Manifest V2. It relies on a persistent background page that loads two scripts sequentially: `data/internal_libs/dictionaries_data.js` and `data/background/background.js`. The background page uses the blocking `chrome.webRequest` API to strip `X-Frame-Options` and `Content-Security-Policy` headers from dictionary website responses, which allows these pages to load inside iframes.

Because Chrome is phasing out Manifest V2 support, we must upgrade the extension to Manifest V3. This migration introduces changes in background scripts (replaced by service workers), header-stripping mechanisms (replaced by `declarativeNetRequest`), and permission declarations.

## Goals / Non-Goals

**Goals:**

- Successfully upgrade `manifest.json` to Manifest V3 structure.
- Replace the persistent background scripts with a Service Worker using a wrapper that retains sequential script imports.
- Migrate header stripping from the blocking `webRequest` API to static `declarativeNetRequest` rules.
- Adapt background initialization and browser-detection code to run successfully in a non-windowed Service Worker environment.
- Maintain existing extension functionality and compatibility for both Chrome and Firefox (using Manifest V3, which modern Firefox supports).

**Non-Goals:**

- Redesigning the extension popup, options page, or adding unrelated user-facing features.
- Introducing a bundler or compiler (e.g. Webpack, Vite, TypeScript), keeping the project vanilla HTML, CSS, and JS as required.

## Decisions

### Decision 1: Service Worker Wrapper (`background-wrapper.js`)

- **Rationale**: Manifest V3 does not support a `"scripts"` array under `"background"`. Instead, it only supports a single `"service_worker"` script. To avoid merging `data/internal_libs/dictionaries_data.js` and `data/background/background.js` into one file (which would complicate code organization), we will create a root-level `background-wrapper.js` Service Worker. This file will use the Service Worker `importScripts` API to load the required files sequentially in the correct order.
- **Alternatives Considered**: Bundling both files into a single script, but this would violate the "No Bundler/Transpiler" design rule.

### Decision 2: Declarative Header Stripping with `declarativeNetRequest`

- **Rationale**: Blocking `webRequest` is deprecated and unsupported in standard Manifest V3 extensions. We will define static rules in `rules.json` under the `declarativeNetRequest` API. These rules will match `sub_frame` and `xmlhttprequest` resources across all URLs and strip the `X-Frame-Options`, `frame-options`, and `Content-Security-Policy` headers.
- **Alternatives Considered**: Using `declarativeNetRequest.updateSessionRules` inside the background script, but static rules configured in the manifest are more declarative, run faster, and execute without waking up the Service Worker.

### Decision 3: Host Permission Migration

- **Rationale**: In Manifest V3, host permissions like `<all_urls>` are declared separately under `"host_permissions"` instead of `"permissions"`. We will adjust `manifest.json` to move `<all_urls>` and add `"declarativeNetRequest"` to `"permissions"`, while removing `"webRequest"` and `"webRequestBlocking"`.

### Decision 4: Adapt Background Script for Service Worker Context

- **Rationale**: Service Workers do not have access to the global `window` or `document` objects. The existing browser-detection logic in `data/background/background.js` (which accesses `window.chrome` and `InstallTrigger`) will crash. We will refactor this logic to safely use `navigator.userAgent` and checks for `typeof chrome !== 'undefined'` to determine the browser environment.

## Implementation Contract

- **Behavior**: Upon installation or update, the extension opens the store page in a new tab. When dictionary pages are loaded in the extension's iframe, their framing security headers (`X-Frame-Options`, `frame-options`, and `Content-Security-Policy`) are stripped, allowing pages to load correctly without blocking.
- **Interface / Data Shape**:
  - `manifest.json`: Upgrade to `manifest_version: 3`. Rename `browser_action` to `action`. Include `declarative_net_request` referring to `rules.json`.
  - `background-wrapper.js`: Contains `importScripts('data/internal_libs/dictionaries_data.js', 'data/background/background.js');`.
  - `rules.json`: Static declarative rules array containing rules of type `modifyHeaders` with `responseHeaders` operations to `remove` the targeted headers.
  - `data/background/background.js`: Uses window-free browser detection and initializes default storage data when installed.
- **Failure Modes**:
  - Service worker fails to load/initialize due to reference errors on `window`. *Mitigation*: Ensure no references to global `window` or `InstallTrigger` exist in the imported scripts in the Service Worker context.
- **Acceptance Criteria**:
  - Both Chrome and Firefox builds (`npm run build-chrome` and `npm run build-firefox`) compile and package successfully.
  - Loading the unpacked folder in Chrome starts an active background Service Worker.
  - Selecting text and triggering the iframe loads the chosen dictionaries without X-Frame-Options or Content-Security-Policy blocks.
- **Scope Boundaries**:
  - In Scope: Migration of manifest, background execution model, and request-header interception to Manifest V3.
  - Out of Scope: Upgrading of content scripts or options UI to external libraries or TypeScript.

## Risks / Trade-offs

- **[Risk] Service Worker Ephemerality**: In-memory variables in a Service Worker are wiped out when the service worker becomes idle and terminates.
  - *Mitigation*: The background logic is stateless and stores all persistent configurations in `chrome.storage.sync`, which remains intact across Service Worker lifecycles.
- **[Risk] Wide Application of Header Stripping**: Stripping frame headers globally for all sub_frame requests could have unexpected security implications if not tightly bound.
  - *Mitigation*: The rules are limited only to `sub_frame` and `xmlhttprequest` requested by the extension itself or within the extension's iframe context, leaving normal browser tabs unaffected.
