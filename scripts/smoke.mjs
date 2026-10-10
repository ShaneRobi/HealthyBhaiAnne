import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { content } from '../src/content.js';

// Exercise the built site through real clicks, including narrow phones and storage failures.
const base = 'http://127.0.0.1:4180/HealthyBhaiAnne/';
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
      assert.equal(await page.locator('html').getAttribute('lang'), lang);
      const nav = width > 820 ? '.desktop-nav' : '.mobile-nav';
      for (let view = 0; view < 4; view++) {
        await page.locator(`${nav} [data-view="${view}"]`).click();
        assert.equal(await page.locator('h1').textContent(), [content[lang].title, content[lang].foodTitle, content[lang].moveTitle, content[lang].planTitle][view]);
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth);
        assert.equal(overflow, false, `Horizontal overflow: ${lang}, ${width}px, view ${view}`);
        assert.equal(await page.locator('main').evaluate(e => e === document.activeElement), true);
        if (width === 390 && (view === 0 || (view === 1 && lang === 'ta'))) await page.screenshot({ path: `artifacts/${lang}-${view}-mobile.png`, fullPage: true });
        if (width === 1440 && lang === 'en' && view === 0) await page.screenshot({ path: 'artifacts/home-desktop.png', fullPage: true });
        cases++;
      }
      await page.locator('[data-check="0"]').check();
      await page.locator('[data-check="1"]').check();
      assert.equal(await page.locator('[role="progressbar"]').getAttribute('aria-valuenow'), '2');
      await page.reload();
      assert.equal(await page.locator('html').getAttribute('lang'), lang);
      await page.locator(`${nav} [data-view="3"]`).click();
      assert.equal(await page.locator('[data-check="0"]').isChecked(), true);
      assert.equal(await page.locator('[data-check="1"]').isChecked(), true);
      await page.locator('[data-open-language]').click();
      assert.equal(await page.locator('dialog').evaluate(e => e.open), true);
      await page.keyboard.press('Escape');
      await page.locator('dialog').waitFor({ state: 'detached' });
      assert.equal(await page.locator('dialog').count(), 0);
      assert.equal(await page.locator('[data-open-language]').evaluate(e => e === document.activeElement), true);
      await page.locator('[data-open-language]').click();
      const next = lang === 'en' ? 'bn' : 'en';
      await page.locator(`dialog [data-language="${next}"]`).click();
      assert.equal(await page.locator('html').getAttribute('lang'), next);
      assert.equal(await page.locator('[data-check="0"]').isChecked(), true);
      await page.locator('[data-reset]').click();
      assert.equal(await page.locator('[role="progressbar"]').getAttribute('aria-valuenow'), '0');
      assert.deepEqual(errors, []);
      cases += 4;
      await context.close();
    }
  }
  // An old checklist must reset, while the remembered language stays selected.
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto(base);
  await page.evaluate(() => {
    localStorage.setItem('hba-language', 'en');
    localStorage.setItem('hba-plan', JSON.stringify({ day: '2000-01-01', checks: [true, true, true] }));
  });
  await page.reload();
  await page.locator('.desktop-nav [data-view="3"]').click();
  assert.equal(await page.locator('[role="progressbar"]').getAttribute('aria-valuenow'), '0');
  await context.close();
  // Browsers blocking localStorage should still support language selection and a live checklist.
  const blocked = await browser.newContext({ viewport: { width: 390, height: 844 } });
  await blocked.addInitScript(() => {
    Object.defineProperty(window, 'localStorage', { get() { throw new DOMException('Storage blocked', 'SecurityError'); } });
  });
  const blockedPage = await blocked.newPage();
  await blockedPage.goto(base);
  await blockedPage.locator('[data-language="ta"]').click();
  await blockedPage.locator('.mobile-nav [data-view="3"]').click();
  await blockedPage.locator('[data-check="0"]').check();
  assert.equal(await blockedPage.locator('[role="progressbar"]').getAttribute('aria-valuenow'), '1');
  assert.equal(await blockedPage.locator('.storage-note').count(), 1);
  await blocked.close();
  cases += 2;
  console.log(`PASS: ${cases} browser checks. Three languages, four sections, three screen sizes, language switching, persistence, daily reset and blocked storage.`);
} finally {
  await browser?.close();
  server.kill('SIGTERM');
}
