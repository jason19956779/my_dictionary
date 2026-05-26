# manifest-v3-migration

## Requirements

### Requirement: Upgrade Manifest Version to 3

The extension manifest (`manifest.json`) MUST use Manifest V3 format by setting `manifest_version` to `3`. The deprecated `browser_action` key SHALL be renamed to `action`. Broad host permissions like `<all_urls>` MUST be moved from `permissions` to `host_permissions`. The `declarativeNetRequest` permission MUST be added to `permissions` while deprecated blocking webRequest permissions are removed.

#### Scenario: Manifest validation and action loading
- **WHEN** the extension is loaded or parsed by a Chromium-based browser
- **THEN** the browser accepts it as a valid Manifest V3 extension, and the action icon/popup loads successfully


<!-- @trace
source: upgrade-to-manifest-v3
updated: 2026-05-26
code:
  - .opencode/commands/spectra-drift.md
  - .opencode/commands/spectra-propose.md
  - background-wrapper.js
  - data/background/background.js
  - AGENTS.md
  - .spectra.yaml
  - .opencode/commands/spectra-commit.md
  - chrome_config.js
  - .opencode/commands/spectra-ingest.md
  - .opencode/skills/spectra-propose/SKILL.md
  - .opencode/commands/spectra-discuss.md
  - .opencode/commands/spectra-apply.md
  - .opencode/skills/spectra-ingest/SKILL.md
  - firefox_config.cjs
  - .opencode/commands/spectra-archive.md
  - .opencode/skills/spectra-audit/SKILL.md
  - .opencode/skills/spectra-apply/SKILL.md
  - package.json
  - .opencode/commands/spectra-debug.md
  - .opencode/skills/spectra-debug/SKILL.md
  - .opencode/skills/spectra-archive/SKILL.md
  - .opencode/commands/spectra-ask.md
  - chrome_config.cjs
  - firefox_config.js
  - .opencode/skills/spectra-commit/SKILL.md
  - .opencode/skills/spectra-ask/SKILL.md
  - .opencode/skills/spectra-drift/SKILL.md
  - .opencode/skills/spectra-discuss/SKILL.md
  - rules.json
  - _metadata/generated_indexed_rulesets/_ruleset1
  - manifest.json
  - .opencode/commands/spectra-audit.md
-->

---
### Requirement: Background Service Worker Integration

The extension's background environment SHALL run in a non-persistent Service Worker instead of a persistent background page. The Service Worker SHALL import `data/internal_libs/dictionaries_data.js` and `data/background/background.js`. The background code MUST NOT attempt to access the global `window` object and SHALL use `self` or standard API-based platform checks for browser detection.

#### Scenario: Service Worker startup and browser detection
- **WHEN** the background Service Worker starts up or receives extension lifecycle events
- **THEN** the Service Worker loads the imported scripts and executes the initialization logic without throwing reference errors on `window`


<!-- @trace
source: upgrade-to-manifest-v3
updated: 2026-05-26
code:
  - .opencode/commands/spectra-drift.md
  - .opencode/commands/spectra-propose.md
  - background-wrapper.js
  - data/background/background.js
  - AGENTS.md
  - .spectra.yaml
  - .opencode/commands/spectra-commit.md
  - chrome_config.js
  - .opencode/commands/spectra-ingest.md
  - .opencode/skills/spectra-propose/SKILL.md
  - .opencode/commands/spectra-discuss.md
  - .opencode/commands/spectra-apply.md
  - .opencode/skills/spectra-ingest/SKILL.md
  - firefox_config.cjs
  - .opencode/commands/spectra-archive.md
  - .opencode/skills/spectra-audit/SKILL.md
  - .opencode/skills/spectra-apply/SKILL.md
  - package.json
  - .opencode/commands/spectra-debug.md
  - .opencode/skills/spectra-debug/SKILL.md
  - .opencode/skills/spectra-archive/SKILL.md
  - .opencode/commands/spectra-ask.md
  - chrome_config.cjs
  - firefox_config.js
  - .opencode/skills/spectra-commit/SKILL.md
  - .opencode/skills/spectra-ask/SKILL.md
  - .opencode/skills/spectra-drift/SKILL.md
  - .opencode/skills/spectra-discuss/SKILL.md
  - rules.json
  - _metadata/generated_indexed_rulesets/_ruleset1
  - manifest.json
  - .opencode/commands/spectra-audit.md
-->

---
### Requirement: Header Stripping with declarativeNetRequest

The extension SHALL use the declarative rules API (`declarativeNetRequest`) instead of blocking web request listeners to strip headers that prevent iframes from loading dictionary pages. The rule engine MUST strip the `X-Frame-Options`, `frame-options`, and `Content-Security-Policy` headers from all responses requested by sub-frames or xmlhttprequests.

#### Scenario: Header removal for iframe loading
- **WHEN** a network request of type `sub_frame` or `xmlhttprequest` is completed
- **THEN** the browser removes `X-Frame-Options`, `frame-options`, and `Content-Security-Policy` headers from the response

<!-- @trace
source: upgrade-to-manifest-v3
updated: 2026-05-26
code:
  - .opencode/commands/spectra-drift.md
  - .opencode/commands/spectra-propose.md
  - background-wrapper.js
  - data/background/background.js
  - AGENTS.md
  - .spectra.yaml
  - .opencode/commands/spectra-commit.md
  - chrome_config.js
  - .opencode/commands/spectra-ingest.md
  - .opencode/skills/spectra-propose/SKILL.md
  - .opencode/commands/spectra-discuss.md
  - .opencode/commands/spectra-apply.md
  - .opencode/skills/spectra-ingest/SKILL.md
  - firefox_config.cjs
  - .opencode/commands/spectra-archive.md
  - .opencode/skills/spectra-audit/SKILL.md
  - .opencode/skills/spectra-apply/SKILL.md
  - package.json
  - .opencode/commands/spectra-debug.md
  - .opencode/skills/spectra-debug/SKILL.md
  - .opencode/skills/spectra-archive/SKILL.md
  - .opencode/commands/spectra-ask.md
  - chrome_config.cjs
  - firefox_config.js
  - .opencode/skills/spectra-commit/SKILL.md
  - .opencode/skills/spectra-ask/SKILL.md
  - .opencode/skills/spectra-drift/SKILL.md
  - .opencode/skills/spectra-discuss/SKILL.md
  - rules.json
  - _metadata/generated_indexed_rulesets/_ruleset1
  - manifest.json
  - .opencode/commands/spectra-audit.md
-->