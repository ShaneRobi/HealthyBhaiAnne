import './style.css';
import { content, languages } from './content.js';
import { icon, plateArt, walkArt } from './art.js';

const app = document.querySelector('#app');
let lang = null;
let view = 0;
let checks = [false, false, false];
let storageWorks = true;
let checklistDate = dayKey();
let returnFocus;
function dayKey() { return new Date().toLocaleDateString('en-CA'); }
function read(key) { try { return localStorage.getItem(key); } catch { storageWorks = false; return null; } }
function save(key, value) { try { localStorage.setItem(key, value); } catch { storageWorks = false; } }
function refreshChecks() {
  checklistDate = dayKey();
  try {
    const saved = JSON.parse(read('hba-plan') || 'null');
    checks = saved?.day === checklistDate && Array.isArray(saved.checks) && saved.checks.length === 3 ? saved.checks.map(Boolean) : [false, false, false];
  } catch { checks = [false, false, false]; }
}
const savedLang = read('hba-language');
if (languages.some(l => l.code === savedLang)) lang = savedLang;
refreshChecks();
const brand = () => `<a class="brand" href="#" data-home aria-label="Healthy Bhaiya Anna">${icon('leaf')}<span>Healthy <strong>Bhaiya Anna</strong><small>${content[lang || 'en'].tagline}</small></span></a>`;
const languageButtons = () => languages.map((l, i) => `<button class="language-option" data-language="${l.code}" lang="${l.code}"><span class="language-letter">${['Aa', 'অ', 'அ'][i]}</span><span><strong>${l.native}</strong><small>${l.english}${i === 0 ? ' · ' + l.greeting : ''}</small></span>${icon('arrow')}</button>`).join('');
function welcome() {
  document.documentElement.lang = 'en';
  app.innerHTML = `<div class="welcome-shell"><header class="welcome-header">${brand()}<span class="location">Singapore <span class="location-dot"></span></span></header><main class="welcome-main"><section class="welcome-story"><span class="eyebrow">${content.en.welcome}</span><h1>${content.en.intro.replace('\n', '<br>')}</h1><p>${content.en.introSub}</p><div class="welcome-plate">${plateArt()}<span class="little-note">${icon('heart')} ${content.en.heroNote}</span></div></section><section class="language-card" aria-labelledby="language-heading"><div class="card-top-icon">${icon('globe')}</div><h2 id="language-heading">${content.en.choose}</h2><p>${content.en.chooseSub}</p><div class="language-options">${languageButtons()}</div><div class="language-greetings"><span lang="bn">স্বাগতম, ভাই।</span><span lang="ta">வரவேற்கிறோம், அண்ணா.</span></div><span class="welcome-bottom">${icon('leaf')} ${content.en.tagline}</span></section></main><footer class="welcome-footer">${content.en.footer}</footer></div>`;
}
function nav(t, mobile = false) {
  return `<nav class="${mobile ? 'mobile-nav' : 'desktop-nav'}" aria-label="${t.select === content.en.select ? 'Main navigation' : t.tagline}">${t.nav.map((label, i) => `<button class="nav-button ${view === i ? 'active' : ''}" data-view="${i}" ${view === i ? 'aria-current="page"' : ''}>${icon(['sun', 'bowl', 'walk', 'check'][i])}<span>${mobile ? t.navShort[i] : label}</span></button>`).join('')}</nav>`;
}
function plate(t) {
  return `<div class="plate-panel"><span class="eyebrow">${t.plateLabel}</span>${plateArt()}<p class="plate-heading">${t.plateText.replace('\n', '<br>')}</p><div class="plate-legend">${t.plateLegend.map((s, i) => `<span><i class="dot dot-${i}"></i>${s}</span>`).join('')}</div></div>`;
}
function safety(t) { return `<aside class="safety-note">${icon('info')}<div><h2>${t.safetyTitle}</h2><p>${t.safetyText}</p></div></aside>`; }
function today(t) {
  return `<section class="hero"><div class="hero-copy"><span class="eyebrow">${t.hello}</span><h1>${t.title}</h1><p>${t.subtitle}</p><button class="button primary" data-view="1">${t.foodCta}${icon('arrow')}</button><button class="text-button" data-view="2">${icon('walk')}${t.walkCta}</button><span class="hero-note">${icon('leaf')}${t.heroNote}</span></div>${plate(t)}</section><section class="habits-section"><div class="section-heading"><span class="eyebrow">${t.easy}</span><h2>${t.easyTitle}</h2><p>${t.easySub}</p></div><div class="habit-grid">${t.cards.map((c, i) => `<article class="habit-card"><div class="habit-top"><span class="habit-icon tone-${i}">${icon(['bowl', 'water', 'walk'][i])}</span><span class="habit-number">0${i + 1}</span></div><h3>${c[0]}</h3><p>${c[1]}</p><button class="card-link" data-view="${i === 2 ? 2 : 1}" ${i === 1 ? 'data-tip="2"' : ''}>${c[2]}${icon('arrow')}</button></article>`).join('')}</div></section><aside class="rest-banner"><span class="rest-icon">${icon('heart')}</span><div><h2>${t.tiredTitle}</h2><p>${t.tiredText}</p></div><button class="text-button" data-view="3">${t.tiredLink}${icon('arrow')}</button></aside>`;
}
function food(t) {
  return `<section class="page-intro"><span class="eyebrow">${t.foodEyebrow}</span><h1>${t.foodTitle}</h1><p>${t.foodSub}</p></section><div class="food-layout">${plate(t)}<div class="tip-list">${t.tips.map((tip, i) => `<article class="food-tip" id="tip-${i}"><span class="step-number">${i + 1}</span><div><h2>${tip[0]}</h2><p>${tip[1]}</p></div></article>`).join('')}</div></div><aside class="rest-banner"><span class="rest-icon">${icon('bowl')}</span><div><h2>${t.cateredTitle}</h2><p>${t.cateredText}</p></div></aside>`;
}
function move(t) {
  return `<section class="page-intro"><span class="eyebrow">${t.moveEyebrow}</span><h1>${t.moveTitle}</h1><p>${t.moveSub}</p></section><section class="walking-layout"><div class="walking-picture">${walkArt()}<span class="walk-time">${icon('walk')} ${t.walkDuration}</span></div><div class="tip-list">${t.steps.map((step, i) => `<article class="food-tip"><span class="step-number">${i + 1}</span><div><h2>${step[0]}</h2><p>${step[1]}</p></div></article>`).join('')}</div></section><aside class="stop-note">${icon('info')}<div><h2>${t.stopTitle}</h2><p>${t.stopText}</p></div></aside>`;
}
function plan(t) {
  const completed = checks.filter(Boolean).length;
  return `<section class="page-intro"><span class="eyebrow">${t.planEyebrow}</span><h1>${t.planTitle}</h1><p>${t.planSub}</p></section><section class="plan-card"><div class="plan-progress"><span>${icon('leaf')}</span><div><strong>${completed} / 3</strong><p>${t.planProgress}</p></div></div><div class="progress-track" role="progressbar" aria-label="${t.planProgress}" aria-valuemin="0" aria-valuemax="3" aria-valuenow="${completed}"><span style="width:${completed / 3 * 100}%"></span></div><div class="checklist">${t.planChoices.map((label, i) => `<label class="check-row ${checks[i] ? 'completed' : ''}"><input type="checkbox" data-check="${i}" ${checks[i] ? 'checked' : ''}><span>${label}</span>${icon(['water', 'bowl', 'walk'][i])}</label>`).join('')}</div><p class="plan-feedback" aria-live="polite">${completed ? t.planDone : t.easySub}</p><button class="text-button reset-plan" data-reset>${t.reset}</button>${!storageWorks ? `<p class="storage-note">${t.storageNote}</p>` : ''}</section>`;
}
function render(focus = false) {
  if (!lang) return welcome();
  if (checklistDate !== dayKey()) refreshChecks();
  const t = content[lang];
  document.documentElement.lang = lang;
  app.innerHTML = `<div class="site-shell"><header class="site-header">${brand()}${nav(t)}<button class="language-switch" data-open-language aria-label="${t.change}">${icon('globe')}<span>${languages.find(l => l.code === lang).native}</span><span class="chevron">⌄</span></button></header><main id="main" tabindex="-1">${[today, food, move, plan][view](t)}${safety(t)}<footer class="site-footer"><div><span>${icon('leaf')}${t.footer}</span><p>${t.review}</p></div><div class="source-links"><span>${t.sources}</span><a href="https://www.healthhub.sg/" target="_blank" rel="noopener noreferrer">${t.sourceLinks[0]} ↗</a><a href="https://www.cdc.gov/diabetes/prevention-type-2/index.html" target="_blank" rel="noopener noreferrer">${t.sourceLinks[1]} ↗</a></div></footer></main>${nav(t, true)}</div>`;
  if (focus) document.querySelector('#main').focus({ preventScroll: true });
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
  if (language) {
    const dialog = document.querySelector('dialog');
    lang = language.dataset.language;
    save('hba-language', lang);
    dialog?.close();
    render(true);
    return;
  }
  if (e.target.closest('[data-open-language]')) return openLanguage();
  if (e.target.closest('[data-close-language]')) return document.querySelector('dialog')?.close();
  const navButton = e.target.closest('[data-view]');
  if (navButton) {
    view = Number(navButton.dataset.view);
    render(true);
    window.scrollTo({ top: 0, behavior: 'instant' });
    if (navButton.dataset.tip) document.querySelector(`#tip-${navButton.dataset.tip}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
  if (e.target.closest('[data-home]')) {
    e.preventDefault();
    view = 0;
    render(true);
    window.scrollTo({ top: 0, behavior: 'instant' });
  }
  if (e.target.closest('[data-reset]')) {
    checks = [false, false, false];
    save('hba-plan', JSON.stringify({ day: dayKey(), checks }));
    render();
    document.querySelector('[data-reset]').focus();
  }
});
document.addEventListener('change', e => {
  if (!e.target.matches('[data-check]')) return;
  if (checklistDate !== dayKey()) refreshChecks();
  const index = Number(e.target.dataset.check);
  checks[index] = e.target.checked;
  save('hba-plan', JSON.stringify({ day: dayKey(), checks }));
  render();
  document.querySelector(`[data-check="${index}"]`).focus();
});
document.addEventListener('visibilitychange', () => {
  if (!document.hidden && checklistDate !== dayKey()) { refreshChecks(); render(); }
});
render();
