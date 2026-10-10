# Healthy Bhaiya Anna

A calm, mobile-first food and movement guide for workers in Singapore, with complete English, Bengali and Tamil versions. Built with plain JavaScript and Vite. No accounts, analytics, backend, external fonts or API keys.

## Develop

Use Node.js 22.12+ (Node 24 works).

```sh
cd /workspace/HealthyBhaiAnne
npm ci --cache /tmp/healthy-bhaiya-npm-cache --no-audit --no-fund
npm run dev -- --port 5173 --strictPort
```

First-time visitors choose a language. Return visits remember it on the same device; the language button switches it any time. All pages are informational. There are no checklists, tasks, progress scores or health records stored on the device. Only the language preference uses localStorage; reading and navigation work when storage is blocked.

Each page has a shareable route such as `#/en/food`, `#/bn/walking`, or `#/ta/diabetes`. Hash routes work on GitHub Pages without server rewrites, so direct links and refreshes avoid 404 errors. The page links, Back/Next controls and browser Back/Forward buttons use the same history. Language switching preserves the current page. Shared URLs specify their own language and take priority over a remembered preference.

## Build and validate

```sh
npm run build
BROWSER_EXECUTABLE_PATH=/usr/bin/chromium npm test
```

The browser smoke test starts and stops its own production preview on port 4180, under the GitHub Pages project path `/HealthyBhaiAnne/`. It checks all three languages and four informational pages at 1440px, 390px and 320px, page URLs and refreshes, Back/Next links, browser history, language switching, shared links and blocked storage. Screenshots are saved in ignored `artifacts/`. On another machine, install Playwright's Chromium with `npx playwright install chromium` and run `npm test` without the executable override.

`npm run preview -- --port 4173` serves the built output for local checks. Offline support is not included in this first version.

## Publish with GitHub Pages

The build uses relative asset paths so it works under the repository's project URL.

```sh
npm run build
BROWSER_EXECUTABLE_PATH=/usr/bin/chromium npm test
git add .
git commit -m "Update Healthy Bhaiya Anna"
git push origin HEAD:main
npm run deploy
```

The deployment script builds the site, adds `.nojekyll`, and uploads only the built files to `gh-pages`. It uses a temporary Git index and a normal push, leaving the working branch and staged source files untouched. It requires write access to the repository. Deployment alone does not enable GitHub Pages.

In the repository's **Settings → Pages**, select **Deploy from a branch**, **gh-pages**, and **/ (root)**, then save. Once GitHub's deployment completes, the expected website address is `https://shanerobi.github.io/HealthyBhaiAnne/`.

## Content review

Translations and advice are a draft for review by fluent Bengali / Tamil speakers and a clinician before community use. Edit the language dictionaries in `src/content.js`. Food guidance addresses portion balance, catered meals and physically demanding work. Movement guidance includes fatigue, diabetes medicine precautions, foot wounds and Singapore's emergency number (995).

The further-reading links point to Singapore HealthHub and CDC diabetes prevention information. External source pages were blocked by the onboarding network, so source-specific citations and current page wording have not been verified. This is general education, not a treatment plan.
