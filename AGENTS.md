# OpenCode Agent Instructions

## WSL Environment & Manual Testing Quirks
* **WSL Windows Sharing:** The repository is under `/mnt/c/` in Windows 11 WSL. Load and test the unpacked extension directly in host Windows Chrome (`chrome://extensions/`) or Firefox, pointing to `C:\\Users\\Jason\\Documents\\my_dictionary`. This allows instant, real-time reloading of code changes.
* **GUI Commands Fail in WSL:** Running `npm run chrome`, `npm run firefox`, or `npm run both` starts browser GUI instances. This will fail under WSL without an X server. Prefer the host Windows manual loading method.

### Spectra CLI
The `spectra` binary is a Windows executable accessible from WSL at:
```
/mnt/c/Users/Jason/AppData/Local/Spectra/spectra.exe
```
**Always invoke spectra using the full path above.** Do NOT use `spectra` bare — it will not be found in the WSL `$PATH`.
Example:
```bash
/mnt/c/Users/Jason/AppData/Local/Spectra/spectra.exe status --change "my-change" --json
```

## Architecture & Code Quirks
* **No Bundler/Transpiler:** This project uses vanilla HTML, CSS, and JS. There is no Webpack, Vite, or TypeScript. Do not write TypeScript or ES modules syntax (`import`/`export`).
* **Manifest V2:** The extension uses `manifest_version: 2` with a persistent background page. Do not use Manifest V3 APIs (e.g., service workers, `declarativeNetRequest`) unless explicitly requested.
* **Header-Stripping Background Script:** `data/background/background.js` dynamically strips `X-Frame-Options` and `Content-Security-Policy` headers from web requests. This permits dictionary websites to load successfully within iframes in the content script panel.
* **Manual Initialization:** In `data/content_scripts/index.js`, initialization is done via a custom `_constructor()` method called after instantiation rather than the native ES6 class `constructor`. Keep this pattern to avoid issues.

## Developer Commands
* **Build commands:**
  * Build Chrome: `npm run build-chrome` (outputs zip to `chrome_build/`)
  * Build Firefox: `npm run build-firefox` (outputs zip to `firefox_build/`)
  * **Note:** `web-ext` is not listed as a devDependency in `package.json`. If not globally installed, use `npx web-ext` (e.g. `npx web-ext --config=chrome_config.js build`).
* **No Automated Tests:** Running `npm test` is a placeholder that exits with an error. Verification must be performed manually.
