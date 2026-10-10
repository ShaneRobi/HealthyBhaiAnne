export const icon = (name, cls = '') => {
  const paths = {
    leaf: '<path d="M5 17C3 7 13 3 21 3c1 10-6 18-14 16M7 18l9-9"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5"/>',
    bowl: '<path d="M3 11h18c0 6-4 9-9 9s-9-3-9-9Zm4-4 1-3m4 3 1-3m4 3 1-3M7 21h10"/>',
    water: '<path d="M12 3C9 8 5 11 5 15a7 7 0 0 0 14 0c0-4-4-7-7-12Z"/><path d="M9 15a3 3 0 0 0 3 3"/>',
    walk: '<ellipse cx="7" cy="8" rx="3" ry="5" transform="rotate(-20 7 8)"/><ellipse cx="17" cy="13" rx="3" ry="5" transform="rotate(20 17 13)"/><path d="m7 15 2 4m6 2 1 2"/>',
    check: '<path d="m5 12 4 4L19 6"/>',
    arrow: '<path d="M4 12h16m-6-6 6 6-6 6"/>',
    globe: '<circle cx="12" cy="12" r="9"/><ellipse cx="12" cy="12" rx="4" ry="9"/><path d="M3 12h18"/>',
    heart: '<path d="M12 21S2 15 2 8a5 5 0 0 1 10-1 5 5 0 0 1 10 1c0 7-10 13-10 13Z"/>',
    close: '<path d="m6 6 12 12M6 18 18 6"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6m0-10v.5"/>',
  };
  return `<svg class="icon ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || paths.leaf}</svg>`;
};

export const plateArt = () => `<svg class="plate-art" viewBox="0 0 340 300" aria-hidden="true">
  <defs><filter id="shadow"><feDropShadow dx="0" dy="6" stdDeviation="7" flood-color="#53694e" flood-opacity=".13"/></filter><pattern id="rice" width="18" height="17" patternUnits="userSpaceOnUse"><path d="m4 5 3 5m6-7 1 5m-4 4 4 2" stroke="#e0d5ae" stroke-width="3" stroke-linecap="round"/></pattern></defs>
  <ellipse cx="175" cy="258" rx="108" ry="12" fill="#abc7a5" opacity=".25"/>
  <g filter="url(#shadow)"><circle cx="170" cy="142" r="119" fill="#fffdf4"/><circle cx="170" cy="142" r="104" fill="#f0ecdd"/><path d="M166 46a96 96 0 0 0 0 192Z" fill="#b4ce8f"/><path d="M174 46a96 96 0 0 1 92 92h-92Z" fill="#f4e8c4"/><path d="M174 146h92a96 96 0 0 1-92 92Z" fill="#e6b898"/><path d="M176 50a91 91 0 0 1 83 84h-83Z" fill="url(#rice)"/>
  <g fill="#4e8a51"><circle cx="115" cy="95" r="16"/><circle cx="99" cy="113" r="17"/><circle cx="126" cy="118" r="18"/><circle cx="108" cy="132" r="15"/><path d="m115 116 11 36 8-5-12-35"/></g>
  <g fill="#759c50"><ellipse cx="120" cy="184" rx="13" ry="24" transform="rotate(-40 120 184)"/><ellipse cx="140" cy="171" rx="10" ry="20" transform="rotate(24 140 171)"/></g>
  <g fill="#dc7f55"><ellipse cx="89" cy="160" rx="9" ry="17" transform="rotate(32 89 160)"/><ellipse cx="91" cy="187" rx="8" ry="14" transform="rotate(-27 91 187)"/></g>
  <circle cx="144" cy="69" r="10" fill="#ce694f"/><circle cx="144" cy="69" r="5" fill="#eb9576"/>
  <g transform="rotate(-18 219 184)"><rect x="190" y="162" width="52" height="36" rx="12" fill="#bb7754"/><path d="m199 166 1 27m10-29 1 29m10-29 1 29m10-27 1 25" stroke="#925d42" stroke-width="2"/></g>
  <ellipse cx="199" cy="216" rx="15" ry="12" fill="#fff9df"/><ellipse cx="199" cy="216" rx="7" ry="6" fill="#e6b953"/></g>
  <path d="M35 58c-9-17-5-33 2-40 12 12 14 27-2 40Z" fill="#8aaa6f"/><path d="M36 58c5-16 19-24 31-21-4 16-17 23-31 21Z" fill="#b0c794"/><path d="M34 39v38" stroke="#739159" stroke-width="2"/>
  <path d="m292 231 6-7m-1 16 8-2" stroke="#b1c09b" stroke-width="3" stroke-linecap="round"/>
</svg>`;

export const walkArt = () => `<svg class="walk-art" viewBox="0 0 320 260" aria-hidden="true"><circle cx="165" cy="123" r="104" fill="#e0ebd4"/><circle cx="241" cy="49" r="19" fill="#edd69a"/><path d="M31 231q126-20 255 0" fill="none" stroke="#9caf88" stroke-width="3"/><path d="M68 226v-55m0 23c-22 0-25-24-25-24 26 0 25 24 25 24Zm0-14c24 0 24-28 24-28-24 4-24 28-24 28Z" fill="#8ea975" stroke="#6d8c61" stroke-width="3"/><circle cx="175" cy="60" r="17" fill="#c58c65"/><path d="M158 54q0-24 25-14l7 12-20-4-8 9" fill="#303e36"/><path d="m161 83 31 7 8 60-49 5Z" fill="#267567"/><path d="m163 92-32 37-28-7m83-22 23 30 28-15" fill="none" stroke="#c58c65" stroke-width="12" stroke-linecap="round"/><path d="m165 151-20 34-12 37m56-69 9 35 30 31" fill="none" stroke="#40554c" stroke-width="17" stroke-linecap="round"/><path d="m129 223-12 5h21m84-9 12 8h-20" fill="none" stroke="#e8e0c7" stroke-width="9" stroke-linecap="round"/></svg>`;
