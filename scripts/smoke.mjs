import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { content } from '../src/content.js';

const base = 'http://127.0.0.1:4180/HealthyBhaiAnne/';
const routes = ['home', 'food', 'walking', 'diabetes'];
const headings = lang => [content[lang].title, content[lang].foodTitle, content[lang].moveTitle, content[lang].diabetesTitle];
const url = (lang, page, topic = '') => `${base}#/${lang}/${page}${topic ? `?topic=${topic}` : ''}`;
async function expectPage(page, lang, index, topic = '') {
  await page.waitForURL(url(lang, routes[index], topic));
  await page.waitForFunction(text => document.querySelector('h1')?.textContent === text, headings(lang)[index]);
  assert.equal(await page.locator('html').getAttribute('lang'), lang);
  assert.equal(await page.title(), `${content[lang].nav[index]} · Healthy Bhaiya Anna`);
  assert.equal(await page.locator('input[type="checkbox"], [role="progressbar"], [data-check], [data-reset]').count(), 0);
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, `${lang}, ${routes[index]} overflows`);
}
const server = spawn(process.execPath, ['node_modules/vite/bin/vite.js', 'preview', '--host', '127.0.0.1', '--port', '4180', '--strictPort', '--base', '/HealthyBhaiAnne/'], { stdio: 'pipe' });
let serverOutput = '';
server.stdout.on('data', b => { serverOutput += b; });
server.stderr.on('data', b => { serverOutput += b; });
let browser;
let cases = 0;
try {
  for (let i = 0; ; i++) {
    if (server.exitCode !== null) throw new Error(`Preview server failed: ${serverOutput}`);
    try { const response = await fetch(base); if (response.ok) break; } catch {}
    if (i === 50) throw new Error(`Preview server was not ready: ${serverOutput}`);
    await new Promise(r => setTimeout(r, 100));
  }
  browser = await chromium.launch({ headless: true, executablePath: process.env.BROWSER_EXECUTABLE_PATH || undefined, args: ['--no-sandbox'] });
  await mkdir('artifacts', { recursive: true });
  for (const width of [1440, 390, 320]) {
    for (const lang of ['en', 'bn', 'ta']) {
      const context = await browser.newContext({ viewport: { width, height: 900 } });
      const page = await context.newPage();
      const errors = [];
      page.on('pageerror', e => errors.push(e.message));
      await page.goto(base);
      assert.equal(await page.locator('[data-language]').count(), 3);
      if (width === 1440 && lang === 'en') await page.screenshot({ path: 'artifacts/welcome.png', fullPage: true });
      await page.locator(`[data-language="${lang}"]`).click();
      await expectPage(page, lang, 0);
      const nav = width > 820 ? '.desktop-nav' : '.mobile-nav';
      for (let view = 0; view < routes.length; view++) {
        await page.locator(`${nav} [data-route="${routes[view]}"]`).click();
        await expectPage(page, lang, view);
        assert.equal(await page.locator('main').evaluate(e => e === document.activeElement), true);
        assert.equal(await page.locator('[data-previous]').getAttribute('href'), view === 0 ? '#/' : `#/${lang}/${routes[view - 1]}`);
        assert.equal(await page.locator('[data-next]').getAttribute('href'), `#/${lang}/${routes[(view + 1) % routes.length]}`);
        await page.reload();
        await expectPage(page, lang, view);
        if (width === 390 && (view === 0 || view === 3)) await page.screenshot({ path: `artifacts/${lang}-${routes[view]}-mobile.png`, fullPage: true });
        if (width === 1440 && lang === 'en' && view === 0) await page.screenshot({ path: 'artifacts/home-desktop.png', fullPage: true });
        cases++;
      }
      // Visible previous/next controls and browser history must agree.
      await page.locator('[data-previous]').click();
      await expectPage(page, lang, 2);
      await page.goBack();
      await expectPage(page, lang, 3);
      await page.goForward();
      await expectPage(page, lang, 2);
      await page.locator('[data-next]').click();
      await expectPage(page, lang, 3);
      await page.locator('[data-next]').click();
      await expectPage(page, lang, 0);
      await page.locator('[data-previous]').click();
      await page.locator('[data-language="en"]').waitFor();
      await page.goBack();
      await expectPage(page, lang, 0);
      cases++;
      // Switching languages preserves the section; Back restores the old language and section.
      await page.locator(`${nav} [data-route="food"]`).click();
      await expectPage(page, lang, 1);
      await page.locator('[data-open-language]').click();
      await page.keyboard.press('Escape');
      await page.locator('dialog').waitFor({ state: 'detached' });
      assert.equal(await page.locator('[data-open-language]').evaluate(e => e === document.activeElement), true);
      await page.locator('[data-open-language]').click();
      const nextLang = lang === 'en' ? 'bn' : 'en';
      await page.locator(`dialog [data-language="${nextLang}"]`).click();
      await expectPage(page, nextLang, 1);
      await page.goBack();
      await expectPage(page, lang, 1);
      await page.goto(base);
      await expectPage(page, lang, 0);
      cases++;
      // The drinks link can be shared and survives reload and Back/Forward.
      await page.locator('.card-link[href*="topic=drinks"]').click();
      await expectPage(page, lang, 1, 'drinks');
      const position = await page.locator('#tip-2').boundingBox();
      assert.ok(position.y < 900 && position.y + position.height > 0);
      await page.reload();
      await expectPage(page, lang, 1, 'drinks');
      await page.goBack();
      await expectPage(page, lang, 0);
      await page.goForward();
      await expectPage(page, lang, 1, 'drinks');
      assert.deepEqual(errors, []);
      cases++;
      await context.close();
    }
  }
  // Shared language routes take precedence over a saved language and old checklist data is unused.
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto(base);
  await page.evaluate(() => {
    localStorage.setItem('hba-language', 'en');
    localStorage.setItem('hba-plan', 'legacy checklist data');
  });
  await page.goto(url('ta', 'diabetes'));
  await expectPage(page, 'ta', 3);
  assert.equal(await page.evaluate(() => localStorage.getItem('hba-plan')), 'legacy checklist data');
  await page.goto(`${base}#/bn/missing-page`);
  await expectPage(page, 'bn', 0);
  await page.goto(`${base}#/unsupported/food`);
  await page.locator('[data-language="bn"]').waitFor();
  await page.locator('[data-language="bn"]').click();
  await expectPage(page, 'bn', 1);
  await context.close();
  cases += 3;
  const blocked = await browser.newContext({ viewport: { width: 390, height: 844 } });
  await blocked.addInitScript(() => Object.defineProperty(window, 'localStorage', { get() { throw new DOMException('Storage blocked', 'SecurityError'); } }));
  const blockedPage = await blocked.newPage();
  await blockedPage.goto(base);
  await blockedPage.locator('[data-language="ta"]').click();
  await expectPage(blockedPage, 'ta', 0);
  await blockedPage.locator('.mobile-nav [data-route="food"]').click();
  await expectPage(blockedPage, 'ta', 1);
  await blockedPage.reload();
  await expectPage(blockedPage, 'ta', 1);
  await blocked.close();
  cases++;
  console.log(`PASS: ${cases} browser scenarios. Informational pages, three languages and screen sizes, page URLs, reloads, Back/Next, browser history, language switching and blocked storage.`);
} finally {
  await browser?.close();
  server.kill('SIGTERM');
}
