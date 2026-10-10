import './style.css';
import { content, languages } from './content.js';
import { icon, plateArt, walkArt } from './art.js';

const app = document.querySelector('#app');
const pages = ['home', 'food', 'walking', 'diabetes'];
let lang = null;
let view = 0;
let returnFocus;
function readLanguage() {
  try { const saved = localStorage.getItem('hba-language'); return languages.some(l => l.code === saved) ? saved : null; }
  catch { return null; }
}
function saveLanguage(code) { try { localStorage.setItem('hba-language', code); } catch { /* Reading works without storage. */ } }
function href(page, code = lang, topic = '') { return code ? `#/${code}/${page}${topic ? `?topic=${topic}` : ''}` : '#/'; }
function route() {
  const [path, query = ''] = location.hash.slice(1).split('?');
  const [code, page] = path.split('/').filter(Boolean);
  return { lang: languages.some(l => l.code === code) ? code : null, page: pages.includes(page) ? page : 'home', topic: new URLSearchParams(query).get('topic') };
}
function navigate(page, code = lang) {
  const target = href(page, code);
  if (location.hash === target) syncRoute(true);
  else location.hash = target;
}
const brand = () => `<a class="brand" href="${href('home')}" aria-label="Healthy Bhaiya Anna">${icon('leaf')}<span>Healthy <strong>Bhaiya Anna</strong><small>${content[lang || 'en'].tagline}</small></span></a>`;
const languageButtons = () => languages.map((l, i) => `<button class="language-option" data-language="${l.code}" lang="${l.code}"><span class="language-letter">${['Aa', 'অ', 'அ'][i]}</span><span><strong>${l.native}</strong><small>${l.english}${i === 0 ? ' · ' + l.greeting : ''}</small></span>${icon('arrow')}</button>`).join('');
function welcome() {
  const t = content.en;
  document.documentElement.lang = 'en';
  document.title = 'Healthy Bhaiya Anna';
  app.innerHTML = `<div class="welcome-shell"><header class="welcome-header">${brand()}<span class="location">Singapore <span class="location-dot"></span></span></header><main class="welcome-main"><section class="welcome-story"><span class="eyebrow">${t.welcome}</span><h1>${t.intro.replace('\n', '<br>')}</h1><p>${t.introSub}</p><div class="welcome-plate">${plateArt()}<span class="little-note">${icon('heart')} ${t.heroNote}</span></div></section><section class="language-card" aria-labelledby="language-heading"><div class="card-top-icon">${icon('globe')}</div><h2 id="language-heading">${t.choose}</h2><p>${t.chooseSub}</p><div class="language-options">${languageButtons()}</div><div class="language-greetings"><span lang="bn">স্বাগতম, ভাই।</span><span lang="ta">வரவேற்கிறோம், அண்ணா.</span></div><span class="welcome-bottom">${icon('leaf')} ${t.tagline}</span></section></main><footer class="welcome-footer">${t.footer}</footer></div>`;
}
function nav(t, mobile = false) {
  return `<nav class="${mobile ? 'mobile-nav' : 'desktop-nav'}" aria-label="${t.mainNavigation}">${t.nav.map((label, i) => `<a class="nav-button ${view === i ? 'active' : ''}" href="${href(pages[i])}" data-route="${pages[i]}" ${view === i ? 'aria-current="page"' : ''}>${icon(['sun', 'bowl', 'walk', 'info'][i])}<span>${mobile ? t.navShort[i] : label}</span></a>`).join('')}</nav>`;
}
function breadcrumbs(t) { return view === 0 ? '' : `<nav class="breadcrumbs" aria-label="${t.breadcrumbs}"><a href="${href('home')}">${t.nav[0]}</a><span aria-hidden="true">/</span><span aria-current="page">${t.nav[view]}</span></nav>`; }
function pageNavigation(t) {
  const previous = view === 0 ? '#/' : href(pages[view - 1]);
  const previousTitle = view === 0 ? t.select : t.nav[view - 1];
  const next = href(pages[(view + 1) % pages.length]);
  const nextTitle = t.nav[(view + 1) % pages.length];
  return `<nav class="page-navigation" aria-label="${t.pageNavigation}"><a class="page-link previous" href="${previous}" data-previous><span aria-hidden="true">←</span><span><small>${t.previous}</small><strong>${previousTitle}</strong></span></a><a class="page-link next" href="${next}" data-next><span><small>${view === pages.length - 1 ? t.returnHome : t.next}</small><strong>${nextTitle}</strong></span><span aria-hidden="true">→</span></a></nav>`;
}
function plate(t) { return `<div class="plate-panel"><span class="eyebrow">${t.plateLabel}</span>${plateArt()}<p class="plate-heading">${t.plateText.replace('\n', '<br>')}</p><div class="plate-legend">${t.plateLegend.map((s, i) => `<span><i class="dot dot-${i}"></i>${s}</span>`).join('')}</div></div>`; }
function safety(t) { return `<aside class="safety-note">${icon('info')}<div><h2>${t.safetyTitle}</h2><p>${t.safetyText}</p></div></aside>`; }
function home(t) {
  return `<section class="hero"><div class="hero-copy"><span class="eyebrow">${t.hello}</span><h1>${t.title}</h1><p>${t.subtitle}</p><a class="button primary" href="${href('food')}">${t.foodCta}${icon('arrow')}</a><a class="text-button" href="${href('walking')}">${icon('walk')}${t.walkCta}</a><span class="hero-note">${icon('leaf')}${t.heroNote}</span></div>${plate(t)}</section><section class="habits-section"><div class="section-heading"><span class="eyebrow">${t.easy}</span><h2>${t.easyTitle}</h2><p>${t.easySub}</p></div><div class="habit-grid">${t.cards.map((c, i) => `<article class="habit-card"><div class="habit-top"><span class="habit-icon tone-${i}">${icon(['bowl', 'water', 'walk'][i])}</span><span class="habit-number">0${i + 1}</span></div><h3>${c[0]}</h3><p>${c[1]}</p><a class="card-link" href="${href(i === 2 ? 'walking' : 'food', lang, i === 1 ? 'drinks' : '')}">${c[2]}${icon('arrow')}</a></article>`).join('')}</div></section><aside class="rest-banner"><span class="rest-icon">${icon('heart')}</span><div><h2>${t.tiredTitle}</h2><p>${t.tiredText}</p></div><a class="text-button" href="${href('diabetes')}">${t.tiredLink}${icon('arrow')}</a></aside>`;
}
function food(t) {
  return `<section class="page-intro"><span class="eyebrow">${t.foodEyebrow}</span><h1>${t.foodTitle}</h1><p>${t.foodSub}</p></section><div class="food-layout">${plate(t)}<div class="tip-list">${t.tips.map((tip, i) => `<article class="food-tip" id="tip-${i}"><span class="step-number">${i + 1}</span><div><h2>${tip[0]}</h2><p>${tip[1]}</p></div></article>`).join('')}</div></div><aside class="rest-banner"><span class="rest-icon">${icon('bowl')}</span><div><h2>${t.cateredTitle}</h2><p>${t.cateredText}</p></div></aside>`;
}
function walking(t) {
  return `<section class="page-intro"><span class="eyebrow">${t.moveEyebrow}</span><h1>${t.moveTitle}</h1><p>${t.moveSub}</p></section><section class="walking-layout"><div class="walking-picture">${walkArt()}<span class="walk-time">${icon('walk')} ${t.walkDuration}</span></div><div class="tip-list">${t.steps.map((step, i) => `<article class="food-tip"><span class="step-number">${i + 1}</span><div><h2>${step[0]}</h2><p>${step[1]}</p></div></article>`).join('')}</div></section><aside class="stop-note">${icon('info')}<div><h2>${t.stopTitle}</h2><p>${t.stopText}</p></div></aside>`;
}
function diabetes(t) {
  return `<section class="page-intro"><span class="eyebrow">${t.diabetesEyebrow}</span><h1>${t.diabetesTitle}</h1><p>${t.diabetesSub}</p></section><section class="diabetes-grid">${t.diabetesCards.map((c, i) => `<article class="info-card"><span class="habit-icon tone-${i % 3}">${icon(['info', 'bowl', 'heart', 'sun'][i])}</span><h2>${c[0]}</h2><p>${c[1]}</p></article>`).join('')}</section>`;
}
function render(focus = false) {
  if (!lang) return welcome();
  const t = content[lang];
  document.documentElement.lang = lang;
  document.title = `${t.nav[view]} · Healthy Bhaiya Anna`;
  app.innerHTML = `<div class="site-shell"><header class="site-header">${brand()}${nav(t)}<button class="language-switch" data-open-language aria-label="${t.change}">${icon('globe')}<span>${languages.find(l => l.code === lang).native}</span><span class="chevron">⌄</span></button></header><main id="main" tabindex="-1">${breadcrumbs(t)}${[home, food, walking, diabetes][view](t)}${pageNavigation(t)}${safety(t)}<footer class="site-footer"><div><span>${icon('leaf')}${t.footer}</span><p>${t.review}</p></div><div class="source-links"><span>${t.sources}</span><a href="https://www.healthhub.sg/" target="_blank" rel="noopener noreferrer">${t.sourceLinks[0]} ↗</a><a href="https://www.cdc.gov/diabetes/prevention-type-2/index.html" target="_blank" rel="noopener noreferrer">${t.sourceLinks[1]} ↗</a></div></footer></main>${nav(t, true)}</div>`;
  if (focus) document.querySelector('#main').focus({ preventScroll: true });
}
function syncRoute(focus = false) {
  document.querySelector('dialog')?.close();
  const current = route();
  lang = current.lang;
  view = pages.indexOf(current.page);
  if (lang) {
    saveLanguage(lang);
    const canonical = href(current.page, lang, current.topic === 'drinks' && current.page === 'food' ? 'drinks' : '');
    if (location.hash !== canonical) history.replaceState(null, '', canonical);
  }
  render(focus);
  window.scrollTo({ top: 0, behavior: 'instant' });
  if (lang && current.page === 'food' && current.topic === 'drinks') document.querySelector('#tip-2')?.scrollIntoView({ block: 'center' });
}
function openLanguage() {
  returnFocus = document.activeElement;
  const dialog = document.createElement('dialog');
  dialog.className = 'language-dialog';
  const t = content[lang];
  dialog.setAttribute('aria-labelledby', 'dialog-language-heading');
  dialog.innerHTML = `<button class="dialog-close" aria-label="${t.close}" data-close-language>${icon('close')}</button><div class="card-top-icon">${icon('globe')}</div><h2 id="dialog-language-heading">${t.select}</h2><div class="language-options">${languageButtons()}</div>`;
  dialog.addEventListener('close', () => { dialog.remove(); if (returnFocus?.isConnected) returnFocus.focus(); });
  dialog.addEventListener('click', e => { if (e.target === dialog) dialog.close(); });
  document.body.append(dialog);
  dialog.showModal();
}
document.addEventListener('click', e => {
  const language = e.target.closest('[data-language]');
  if (language) { document.querySelector('dialog')?.close(); navigate(pages[view], language.dataset.language); return; }
  if (e.target.closest('[data-open-language]')) return openLanguage();
  if (e.target.closest('[data-close-language]')) return document.querySelector('dialog')?.close();
  const link = e.target.closest('a[href^="#/"]');
  if (link && !e.ctrlKey && !e.metaKey && !e.shiftKey && !e.altKey && link.getAttribute('href') === location.hash) { e.preventDefault(); syncRoute(true); }
});
window.addEventListener('hashchange', () => syncRoute(true));
// Explicit language URLs take priority. Only a fresh root visit uses the saved preference.
if (!location.hash || location.hash === '#') {
  const saved = readLanguage();
  if (saved) history.replaceState(null, '', href('home', saved));
}
syncRoute();
