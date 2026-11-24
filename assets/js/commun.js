// Comportements communs à toutes les pages : loader, en-tête, menu,
// curseur, révélations, boutons magnétiques, copie d’e-mail, transitions.

export const reduit = matchMedia('(prefers-reduced-motion: reduce)').matches;
export const sourisFine = matchMedia('(hover: hover) and (pointer: fine)').matches;
export const EASE = 'expo.out';

const gsap = window.gsap;
if (gsap && window.ScrollTrigger) gsap.registerPlugin(window.ScrollTrigger);

/* Défilement amorti à la molette (Lenis), synchronisé avec ScrollTrigger ----
   Ordinateur avec souris uniquement : le tactile garde son défilement natif,
   et rien ne change avec « réduire les animations ». */
export let lenis = null;
export function defilementDoux() {
  const Lenis = window.Lenis;
  const ST = window.ScrollTrigger;
  if (lenis || !Lenis || !gsap || !ST || reduit || !sourisFine) return lenis;
  lenis = new Lenis({ lerp: 0.11, wheelMultiplier: 1, autoRaf: false });
  lenis.on('scroll', ST.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
  const html = document.documentElement;
  html.classList.add('defilement-doux'); // pas « lenis » dans le nom : Lenis retire ses classes par motif
  // Ancres internes : défilement amorti, marge de l’en-tête respectée, puis focus sur la cible
  document.addEventListener('click', (e) => {
    const a = e.target.closest?.('a[href^="#"]');
    if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const id = a.getAttribute('href').slice(1);
    const cible = id ? document.getElementById(id) : null;
    if (!cible) return;
    e.preventDefault();
    // Comme le navigateur : marge de la page, plus celle de la cible
    const marge = (parseFloat(getComputedStyle(html).scrollPaddingTop) || 0) + (parseFloat(getComputedStyle(cible).scrollMarginTop) || 0);
    lenis.scrollTo(cible, {
      offset: -marge,
      onComplete: () => {
        if (!cible.matches('a, button, input, select, textarea, [tabindex]')) cible.setAttribute('tabindex', '-1');
        cible.focus({ preventScroll: true });
      },
    });
    history.pushState(null, '', `#${id}`);
  });
  return lenis;
}

/* Loader d’entrée : court, une seule fois par visite ------------------------ */
export function loader() {
  const el = document.querySelector('.loader');
  let vu = false;
  try { vu = sessionStorage.getItem('sz-loader') === '1'; sessionStorage.setItem('sz-loader', '1'); } catch (e) { /* stockage indisponible */ }
  if (!el || !gsap || reduit || vu) {
    el?.remove();
    return Promise.resolve();
  }
  el.classList.add('is-on');
  const mono = el.querySelector('.loader__mono');
  return new Promise((resolve) => {
    gsap.timeline({ onComplete: () => { el.remove(); resolve(); } })
      .from(mono, { scale: 0.4, rotate: -25, opacity: 0, duration: 0.6, ease: 'back.out(1.6)' })
      // Le monogramme s’efface entièrement avant que le rideau ne remonte : jamais coupé
      .to(mono, { opacity: 0, scale: 0.92, duration: 0.3, ease: 'power1.in' }, 0.8)
      .to(el, { clipPath: 'inset(0 0 100% 0)', duration: 0.6, ease: 'expo.inOut' }, 1.1)
      .add(resolve, 1.35);
  });
}

/* En-tête : couleur selon la section dessous, masqué en descendant ---------- */
// Bornes des sections thémées (mesurées par entete(), lues aussi par le curseur)
let bornes = [];
const themeA = (yDoc) => bornes.find((b) => b.haut <= yDoc && b.bas > yDoc)?.theme;

export function entete() {
  const header = document.querySelector('.header');
  if (!header) return;
  let derniereY = scrollY;
  let enAttente = false;
  // Positions mesurées une fois (et à chaque recalcul de ScrollTrigger) :
  // aucune lecture de mise en page pendant le scroll.
  let seuilFixe = Infinity;
  let hauteur = 0;
  const bloc = (el) => (el.parentElement?.classList.contains('pin-spacer') ? el.parentElement : el);
  const mesurer = () => {
    // Relu à chaque mesure : une page peut construire ses sections après coup
    const sections = [...document.querySelectorAll('main [data-theme], footer[data-theme]')];
    const repere = header.dataset.fixeApres ? document.querySelector(header.dataset.fixeApres) : null;
    const y0 = scrollY;
    hauteur = header.offsetHeight;
    bornes = sections.map((sec) => {
      const r = bloc(sec).getBoundingClientRect();
      return { haut: r.top + y0, bas: r.bottom + y0, theme: sec.dataset.theme };
    });
    seuilFixe = repere ? bloc(repere).getBoundingClientRect().top + y0 - hauteur - 32 : Infinity;
  };
  const maj = () => {
    enAttente = false;
    const y = scrollY + hauteur / 2;
    const t = themeA(y);
    if (t && header.dataset.on !== t) header.dataset.on = t;
    // À partir de la section indiquée (data-fixe-apres), l’en-tête reste affiché
    const fixe = scrollY >= seuilFixe;
    header.classList.toggle('is-fond', fixe);
    const bas = !fixe && scrollY > derniereY && scrollY > innerHeight * 0.6;
    if (!document.documentElement.classList.contains('menu-open')) header.classList.toggle('is-hidden', bas);
    derniereY = scrollY;
  };
  addEventListener('scroll', () => { if (!enAttente) { enAttente = true; requestAnimationFrame(maj); } }, { passive: true });
  const remesurer = () => { mesurer(); maj(); };
  window.ScrollTrigger?.addEventListener('refresh', remesurer);
  addEventListener('resize', remesurer, { passive: true });
  addEventListener('load', remesurer);
  document.fonts?.ready.then(remesurer);
  remesurer();
}

/* Menu plein écran (mobile) ------------------------------------------------- */
export function menu() {
  const btn = document.querySelector('.menu-btn');
  const panneau = document.getElementById('menu');
  if (!btn || !panneau) return;
  const html = document.documentElement;
  const label = btn.querySelector('.menu-btn__label');
  const liens = () => [...panneau.querySelectorAll('a'), btn];

  const ouvrir = (oui, rendreFocus = true) => {
    html.classList.toggle('menu-open', oui);
    btn.setAttribute('aria-expanded', String(oui));
    label.textContent = oui ? 'Fermer' : 'Menu';
    document.body.style.overflow = oui ? 'hidden' : '';
    if (lenis) { if (oui) lenis.stop(); else lenis.start(); }
    document.querySelector('main')?.toggleAttribute('inert', oui);
    document.querySelector('footer')?.toggleAttribute('inert', oui);
    if (oui) {
      panneau.querySelector('a')?.focus();
      if (gsap && !reduit) {
        gsap.from(panneau.querySelectorAll('.menu__link'), { yPercent: 60, opacity: 0, duration: 0.7, stagger: 0.06, ease: EASE, delay: 0.15 });
      }
    } else if (rendreFocus) btn.focus();
  };
  btn.addEventListener('click', () => ouvrir(!html.classList.contains('menu-open')));
  // Lien vers une ancre de la page (Contact → pied de page) : on referme le
  // menu avant le défilement, sinon la cible reste inerte sous le panneau
  panneau.addEventListener('click', (e) => {
    if (e.target.closest('a[href^="#"]') && html.classList.contains('menu-open')) ouvrir(false, false);
  });
  panneau.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') ouvrir(false);
    if (e.key === 'Tab') {
      const l = liens();
      const i = l.indexOf(document.activeElement);
      if (e.shiftKey && i === 0) { e.preventDefault(); l.at(-1).focus(); }
      else if (!e.shiftKey && i === l.length - 1) { e.preventDefault(); l[0].focus(); }
    }
  });
  btn.addEventListener('keydown', (e) => { if (e.key === 'Escape') ouvrir(false); });
  matchMedia('(min-width: 900px)').addEventListener('change', (e) => { if (e.matches) ouvrir(false); });
}

/* Curseur personnalisé ------------------------------------------------------ */
export function curseur() {
  const c = document.querySelector('.cursor');
  if (!c || !sourisFine || !gsap) return;
  // Pages projet et grille Projets : curseur normal du système, sans halo (règle d’Enzo)
  if (['projet', 'projets'].includes(document.body.dataset.page)) { c.hidden = true; return; }
  document.documentElement.classList.add('has-cursor');
  // Léger retard ; aucun avec « réduire les animations »
  const duree = reduit ? 0 : 0.35;
  const calques = c.querySelectorAll('.cursor__calque');
  const x = gsap.quickTo(calques, 'x', { duration: duree, ease: 'power3.out' });
  const y = gsap.quickTo(calques, 'y', { duration: duree, ease: 'power3.out' });
  gsap.set(calques, { x: innerWidth / 2, y: innerHeight / 2 });
  // Lien survolé : le halo grandit
  const lien = (el) => c.classList.toggle('is-link', !!el?.closest?.('a, button, [data-cursor]'));
  // Fond sous la souris, lu sur l’élément réellement survolé (les bornes
  // mesurées ne servent que de secours) : une image passe toujours en négatif,
  // même posée sur une section claire.
  const fond = () => {
    const el = document.elementFromPoint(px, py);
    const t = el?.closest('img, video, picture, .fenetre, [data-cursor-negatif]') ? 'image'
      : el?.closest('[data-theme]')?.dataset.theme || themeA(scrollY + py);
    if (t && c.dataset.fond !== t) c.dataset.fond = t;
  };
  let px = -1;
  let py = -1;
  addEventListener('pointermove', (e) => {
    if (e.pointerType !== 'mouse') return;
    if (c.classList.contains('is-hidden')) { gsap.set(calques, { x: e.clientX, y: e.clientY }); c.classList.remove('is-hidden'); }
    px = e.clientX; py = e.clientY;
    x(px); y(py);
    lien(e.target);
    fond();
  }, { passive: true });
  // Au scroll, la souris ne bouge pas mais le contenu sous elle change :
  // le fond suit à chaque image, le survol de lien est réévalué à l’arrêt
  let minuteur = 0;
  let enAttente = false;
  addEventListener('scroll', () => {
    if (px < 0) return;
    if (!enAttente) { enAttente = true; requestAnimationFrame(() => { enAttente = false; fond(); }); }
    clearTimeout(minuteur);
    minuteur = setTimeout(() => lien(document.elementFromPoint(px, py)), 90);
  }, { passive: true });
  document.documentElement.addEventListener('mouseleave', () => c.classList.add('is-hidden'));
}

/* Découpe en mots masqués (révélation ligne par ligne) --------------------- */
export function decouperMots(el) {
  if (el.dataset.split) return el.querySelectorAll('.wi');
  const envelopper = (contenu) => {
    const wm = document.createElement('span');
    wm.className = 'wm';
    const wi = document.createElement('span');
    wi.className = 'wi';
    wi.append(contenu);
    wm.append(wi);
    return wm;
  };
  const parcourir = (noeud) => {
    [...noeud.childNodes].forEach((n) => {
      if (n.nodeType === Node.TEXT_NODE) {
        const morceaux = n.textContent.split(/(\s+)/);
        const frag = document.createDocumentFragment();
        morceaux.forEach((m) => {
          if (!m) return;
          frag.append(/^\s+$/.test(m) ? document.createTextNode(' ') : envelopper(m));
        });
        n.replaceWith(frag);
      } else if (n.nodeType === Node.ELEMENT_NODE) {
        if (n.matches('.paren-img, .fenetre, img, svg, .wm')) n.replaceWith(envelopper(n.cloneNode(true)));
        else parcourir(n);
      }
    });
  };
  parcourir(el);
  el.dataset.split = '1';
  return el.querySelectorAll('.wi');
}

/* Révélations au scroll ----------------------------------------------------- */
export function revelations(racine = document) {
  const lignes = racine.querySelectorAll('[data-reveal="lines"]');
  const fondus = racine.querySelectorAll('[data-reveal="fade"]');
  const masques = racine.querySelectorAll('[data-reveal="mask"]');
  if (!gsap || reduit) {
    fondus.forEach((el) => (el.style.opacity = 1));
    masques.forEach((el) => (el.style.clipPath = 'none'));
    return;
  }
  lignes.forEach((el) => {
    const mots = [...decouperMots(el)];
    // Regroupe par ligne pour un décalage ligne par ligne
    const tops = mots.map((m) => Math.round(m.parentElement.offsetTop / 4));
    const uniques = [...new Set(tops)];
    gsap.set(mots, { yPercent: 115 });
    window.ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        mots.forEach((m, i) => {
          const ligne = uniques.indexOf(tops[i]);
          gsap.to(m, { yPercent: 0, duration: 0.9, ease: EASE, delay: ligne * 0.09 + (i % 8) * 0.012 });
        });
      },
    });
  });
  fondus.forEach((el) => {
    gsap.fromTo(el, { opacity: 0, x: -24 }, { opacity: 1, x: 0, duration: 0.8, ease: EASE, scrollTrigger: { trigger: el, start: 'top 90%', once: true } });
  });
  masques.forEach((el) => {
    gsap.to(el, { clipPath: 'inset(0% 0 0 0 round 0px)', duration: 1, ease: 'expo.inOut', scrollTrigger: { trigger: el, start: 'top 90%', once: true } });
  });
}

/* Boutons magnétiques ------------------------------------------------------- */
export function magnetiques() {
  if (!sourisFine || reduit || !gsap) return;
  document.querySelectorAll('[data-magnetic]').forEach((el) => {
    const x = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3.out' });
    const y = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3.out' });
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      x((e.clientX - r.left - r.width / 2) * 0.25);
      y((e.clientY - r.top - r.height / 2) * 0.35);
    });
    el.addEventListener('pointerleave', () => { x(0); y(0); });
  });
}

/* Copier l’e-mail ----------------------------------------------------------- */
export function copie() {
  document.querySelectorAll('[data-copy]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const texte = btn.dataset.copy;
      const statut = btn.closest('section, div')?.parentElement?.querySelector('.copy-status') ?? document.querySelector('.copy-status');
      try {
        await navigator.clipboard.writeText(texte);
        if (statut) statut.textContent = 'E-mail copié dans le presse-papiers.';
      } catch (e) {
        if (statut) statut.textContent = `Copie impossible : ${texte}`;
      }
      clearTimeout(btn._t);
      btn._t = setTimeout(() => { if (statut) statut.textContent = ''; }, 3500);
    });
  });
}

/* Transitions de page (rideau aubergine) ----------------------------------- */
export function transitions() {
  const rideau = document.querySelector('.curtain');
  const html = document.documentElement;
  if (!rideau || !gsap || reduit) { html.classList.remove('arrivee'); return; }
  let arrivee = false;
  try { arrivee = sessionStorage.getItem('sz-rideau') === '1'; sessionStorage.removeItem('sz-rideau'); } catch (e) { /* rien */ }
  if (arrivee) {
    gsap.set(rideau, { yPercent: 0, visibility: 'visible' });
    let leve = false;
    const lever = () => {
      if (leve) return;
      leve = true;
      gsap.to(rideau, { yPercent: -100, duration: 0.7, ease: 'expo.inOut', delay: 0.05, onComplete: () => gsap.set(rideau, { visibility: 'hidden' }) });
    };
    // Page projet : construite par script après l’arrivée des contenus. Le rideau
    // attend son signal (« sz:pret ») pour ne pas se lever sur une page encore vide ;
    // au plus tard après 1,6 s, quoi qu’il arrive.
    if (document.body.dataset.page === 'projet') {
      document.addEventListener('sz:pret', lever, { once: true });
      setTimeout(lever, 1600);
    } else lever();
  }
  // GSAP tient désormais le rideau par ses styles : la classe posée dans l’en-tête peut partir
  html.classList.remove('arrivee');
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href]');
    if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if (a.target === '_blank' || a.hasAttribute('download')) return;
    const url = new URL(a.href, location.href);
    if (url.origin !== location.origin || url.protocol.startsWith('mailto') || url.protocol.startsWith('tel')) return;
    if (url.pathname === location.pathname && url.search === location.search) return;
    e.preventDefault();
    try { sessionStorage.setItem('sz-rideau', '1'); } catch (err) { /* rien */ }
    gsap.fromTo(rideau, { yPercent: 100, visibility: 'visible' }, { yPercent: 0, duration: 0.55, ease: 'expo.inOut', onComplete: () => { location.href = url.href; } });
  });
  // Retour arrière depuis le cache : on retire le rideau
  addEventListener('pageshow', (e) => { if (e.persisted) gsap.set(rideau, { yPercent: 100, visibility: 'hidden' }); });
}

/* Effet d’ouverture : l’image cliquée grandit jusqu’au plein écran, le reste
   s’efface, puis la page projet s’ouvre sur la même image (référence vidéo d’Enzo).
   Partagé par l’accueil (projets phares) et la page Projets (vignette de l’index). */
// Page projet préparée dès que l’on vise une vignette (survol, focus, toucher) :
// ses scripts et styles, dans leur version du jour, sont déjà là au clic.
// (Les navigateurs qui lisent les règles de spéculation préchargent aussi la page.)
let pageProjet = null;
const pris = new Set();
const prendre = (url) => {
  if (pris.has(url)) return;
  pris.add(url);
  fetch(url, { credentials: 'same-origin' }).catch(() => { pris.delete(url); });
};
export function prechauffer(a) {
  try {
    const u = new URL(a.href, location.href);
    if (u.origin !== location.origin) return;
    const slug = u.searchParams.get('p');
    pageProjet ??= fetch(u.pathname, { credentials: 'same-origin' }).then((r) => (r.ok ? r.text() : '')).catch(() => '');
    pageProjet.then((html) => {
      (html.match(/assets\/[\w/.-]+\?v=\w+/g) || []).forEach(prendre);
      const V = html.match(/SZ_GABARITS='(\w+)'/)?.[1];
      const G = html.match(/,G=(\{.*?\});try/)?.[1];
      if (V && G && slug) (JSON.parse(G)[slug] || []).forEach((n) => prendre(`assets/js/gabarits/${n}.js?v=${V}`));
    }).catch(() => {});
  } catch (err) { /* rien : la page se chargera normalement */ }
}

// Lien vers un projet : préparation au premier signe d’intention, ouverture au clic
export function lienProjet(a, img) {
  const viser = () => prechauffer(a);
  a.addEventListener('pointerenter', viser, { once: true });
  a.addEventListener('focus', viser, { once: true });
  a.addEventListener('touchstart', viser, { once: true, passive: true });
  a.addEventListener('click', (e) => ouvrirProjet(e, a, img));
}

// Plus grande version proposée par le srcset d’une image
function plusGrande(img) {
  let meilleure = null;
  let largeur = 0;
  (img.srcset || '').split(',').forEach((c) => {
    const [url, w] = c.trim().split(/\s+/);
    const n = parseFloat(w);
    if (url && n > largeur) { largeur = n; meilleure = new URL(url, location.href).href; }
  });
  return meilleure;
}

// Position (en %) d’un cadrage « object-position », pour le reproduire ailleurs
function cadrage(img) {
  const p = getComputedStyle(img).objectPosition.split(' ').map((v) => (v.endsWith('%') ? parseFloat(v) : 50));
  return [p[0] ?? 50, p[1] ?? 50];
}

let remettre = null;
export function ouvrirProjet(e, a, img) {
  if (!gsap || reduit || !img || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  e.preventDefault();
  prechauffer(a);
  const r = img.getBoundingClientRect();
  const W = innerWidth;
  const H = innerHeight;
  const [px, py] = cadrage(img);
  const position = `${px}% ${py}%`;
  const calque = document.createElement('div');
  calque.className = 'ouverture-projet';
  calque.setAttribute('aria-hidden', 'true');
  const video = img.tagName === 'VIDEO';
  let copie;
  let src;
  if (video) {
    // Couverture animée : la vidéo elle-même passe dans le calque, sans s’arrêter
    // (déplacée d’un bloc, elle continue de jouer) ; elle reprend sa place au retour
    const [parent, suivant, classe] = [img.parentNode, img.nextSibling, img.className];
    remettre = () => { img.className = classe; img.removeAttribute('style'); parent.insertBefore(img, suivant); };
    copie = img;
    copie.className = '';
    copie.style.transition = 'none';
    copie.style.objectPosition = position;
    calque.append(copie);
    copie.play?.().catch(() => {});
  } else {
    // La copie part de l’image déjà affichée (aucune attente, aucun écran vide) ;
    // sa version nette se charge pendant qu’elle grandit, puis la remplace
    const petite = img.currentSrc || img.src;
    copie = document.createElement('img');
    copie.alt = '';
    copie.src = petite;
    copie.style.objectPosition = position;
    calque.append(copie);
    src = petite;
    const grande = plusGrande(img);
    if (grande && grande !== petite) {
      const hd = new Image();
      hd.src = grande;
      hd.decode().then(() => { copie.src = grande; src = grande; }).catch(() => {});
    }
  }
  // Cadre d’arrivée : tout l’écran, sauf si l’image et l’écran n’ont pas la même
  // orientation (une couverture en largeur sur un téléphone tenu droit) : elle
  // s’arrête alors sur toute la largeur, entière, au lieu d’être recadrée
  const ir = (img.naturalWidth || img.videoWidth || img.width || r.width) / (img.naturalHeight || img.videoHeight || img.height || r.height);
  let [bx, by, bw, bh] = [0, 0, W, H];
  if (W / H < 1 !== ir < 1) {
    if (W / H < ir) { bh = W / ir; by = (H - bh) / 2; } else { bw = H * ir; bx = (W - bw) / 2; }
  }
  // Le calque couvre tout l’écran dès le départ ; seule une découpe (clip-path)
  // et une mise à l’échelle (transform) l’animent : aucune remise en page
  // à chaque image, contrairement à une animation de top/left/width/height.
  Object.assign(calque.style, { top: '0px', left: '0px', width: `${W}px`, height: `${H}px` });
  Object.assign(copie.style, { left: `${bx}px`, top: `${by}px`, width: `${bw}px`, height: `${bh}px` });
  const decoupe = (t, d, b, g) => `inset(${t}px ${d}px ${b}px ${g}px)`;
  const echelle = Math.max(r.width / bw, r.height / bh);
  gsap.set(calque, { clipPath: decoupe(r.top, W - r.right, H - r.bottom, r.left) });
  gsap.set(copie, { x: r.left + r.width / 2 - (bx + bw / 2), y: r.top + r.height / 2 - (by + bh / 2), scale: echelle, transformOrigin: '50% 50%', force3D: true });
  document.body.append(calque);
  // Ce que la page projet doit savoir pour garder l’image à l’écran à son arrivée :
  // une miniature (affichable dès sa toute première image), le cadrage, le cadre
  // et la couleur du fond autour
  try {
    sessionStorage.setItem('sz-ouverture', '1');
    sessionStorage.setItem('sz-ouverture-pos', position);
    sessionStorage.setItem('sz-ouverture-cadre', [bx, by, bw, bh].map((v) => v.toFixed(1)).join(','));
    sessionStorage.setItem('sz-ouverture-fond', getComputedStyle(document.body).backgroundColor);
  } catch (err) { /* stockage indisponible : la page projet s’ouvrira normalement */ }
  // Instantané de ce qui est à l’écran (vidéo : au départ vers la page projet,
  // avec l’instant de la vidéo, pour que celle du projet reprenne au même endroit)
  const instantane = () => {
    try {
      const k = Math.min(1, (video ? 1100 : 360) / bw);
      const mini = document.createElement('canvas');
      mini.width = Math.round(bw * k);
      mini.height = Math.round(bh * k);
      const nw = img.naturalWidth || img.videoWidth;
      const nh = img.naturalHeight || img.videoHeight;
      if (!nw || !nh) throw new Error('image pas encore prête');
      const e2 = Math.max(mini.width / nw, mini.height / nh);
      mini.getContext('2d').drawImage(img, (mini.width - nw * e2) * px / 100, (mini.height - nh * e2) * py / 100, nw * e2, nh * e2);
      sessionStorage.setItem('sz-ouverture-mini', mini.toDataURL('image/jpeg', video ? 0.82 : 0.72));
      if (video) {
        src = 'mini';
        sessionStorage.setItem('sz-ouverture-temps', img.currentTime.toFixed(2));
      }
    } catch (err) { /* image pas encore chargée ou stockage plein : on s’en passe */ }
  };
  if (!video) instantane();
  const decoupeFin = decoupe(by, W - bx - bw, H - by - bh, bx);
  const reste = [document.querySelector('main'), document.querySelector('.header'), document.querySelector('footer')];
  const partir = () => {
    if (video) instantane();
    try { sessionStorage.setItem('sz-ouverture-img', src || img.poster); } catch (err) { /* rien */ }
    location.href = a.href;
  };
  // La page suivante se demande avant la fin du geste : elle se charge pendant
  // que l’image finit de grandir, et prend le relais sur la même image plein écran
  const D = 0.8;
  gsap.timeline()
    .to(reste, { opacity: 0, duration: 0.35, ease: 'power2.out' }, 0)
    .to(calque, { clipPath: decoupeFin, duration: D, ease: 'expo.inOut' }, 0)
    .to(copie, { x: 0, y: 0, scale: 1, duration: D, ease: 'expo.inOut' }, 0)
    .call(partir, null, D * 0.72);
}
// Retour arrière depuis le cache : la page revient comme avant le clic
addEventListener('pageshow', (e) => {
  if (!e.persisted) return;
  remettre?.();
  remettre = null;
  document.querySelectorAll('.ouverture-projet').forEach((n) => n.remove());
  document.querySelectorAll('main, .header, footer').forEach((n) => (n.style.opacity = ''));
});

/* Arrivée sur une page construite par script --------------------------------
   Attend que les images visibles à l’écran soient chargées (au plus `max` ms),
   pour révéler une page complète plutôt qu’une page qui se remplit. */
export function imagesVisibles(max = 900) {
  const enCours = [...document.querySelectorAll('main img')].filter((i) => {
    if (i.complete) return false;
    const r = i.getBoundingClientRect();
    return r.width > 0 && r.bottom > 0 && r.top < innerHeight;
  });
  if (!enCours.length) return Promise.resolve();
  const chargees = Promise.all(enCours.map((i) => new Promise((ok) => {
    i.addEventListener('load', ok, { once: true });
    i.addEventListener('error', ok, { once: true });
  })));
  return Promise.race([chargees, new Promise((ok) => setTimeout(ok, max))]);
}

// La page est prête : le rideau se lève, ou l’image d’ouverture gardée à l’écran s’efface
let revele = false;
// Premier visuel du projet à l’écran : celui que le gabarit désigne (data-ouverture),
// sinon l’image ou la vidéo qui occupe le plus de place dans le premier écran
function premierVisuel() {
  const H = innerHeight;
  const vue = (m) => { const r = m.getBoundingClientRect(); return Math.max(0, Math.min(H, r.bottom) - Math.max(0, r.top)) * r.width; };
  const designe = document.querySelector('main [data-ouverture]');
  if (designe && vue(designe) > 0) return designe;
  let meilleur = null;
  let aire = innerWidth * H * 0.12;
  document.querySelectorAll('main img, main video').forEach((m) => {
    const v = vue(m);
    if (v > aire && getComputedStyle(m).visibility !== 'hidden') { aire = v; meilleur = m; }
  });
  return meilleur;
}

// Le visuel est-il prêt à être vu ? (au plus `max` ms d’attente)
function charge(m, max) {
  const imgs = m.matches('img, video') ? [m] : [...m.querySelectorAll('img')].filter((i) => i.getBoundingClientRect().top < innerHeight);
  const attente = imgs.map((i) => (i.tagName === 'VIDEO'
    ? (i.readyState >= 2 ? null : new Promise((ok) => i.addEventListener('loadeddata', ok, { once: true })))
    : (i.complete ? null : new Promise((ok) => { i.addEventListener('load', ok, { once: true }); i.addEventListener('error', ok, { once: true }); })))).filter(Boolean);
  return Promise.race([Promise.all(attente), new Promise((ok) => setTimeout(ok, max))]);
}

export function reveler() {
  if (revele) return;
  revele = true;
  document.dispatchEvent(new Event('sz:pret'));
  const html = document.documentElement;
  if (!html.classList.contains('ouverture')) return;
  const fin = (delai) => setTimeout(() => {
    html.classList.remove('ouverture', 'ouverture-vers', 'ouverture-fin');
    ['--ov-t', '--ov-l', '--ov-w', '--ov-h', '--ov0-t', '--ov0-l', '--ov0-w', '--ov0-h', '--ouverture-fond', '--ouverture-img', '--ouverture-mini', '--ouverture-pos'].forEach((v) => html.style.removeProperty(v));
  }, delai);
  // L’image gardée à l’écran part tout de suite rejoindre la place du premier
  // visuel du projet (aucun arrêt sur image), et s’y fond dès qu’il est chargé
  const cible = !reduit && premierVisuel();
  if (!cible) {
    html.classList.add('ouverture-fin');
    fin(500);
    return;
  }
  let temps = null;
  try { temps = sessionStorage.getItem('sz-ouverture-temps'); sessionStorage.removeItem('sz-ouverture-temps'); } catch (err) { /* rien */ }
  if (cible.tagName === 'VIDEO') {
    // La vidéo visée se lance tout de suite (muette, donc autorisée partout, Safari
    // compris), et reprend où en était la couverture animée s’il y en avait une
    if (temps && Number.isFinite(+temps)) {
      cible.dataset.clReprise = '';
      const caler = () => { try { cible.currentTime = +temps; } catch (err) { /* elle part du début */ } };
      if (cible.readyState >= 1) caler(); else cible.addEventListener('loadedmetadata', caler, { once: true });
      setTimeout(() => { delete cible.dataset.clReprise; }, 3000);
    }
    cible.muted = true;
    if (cible.preload === 'none') cible.preload = 'auto';
    cible.play().catch((err) => { if (err.name === 'NotAllowedError') signalerBloquee(cible); });
  }
  const r = cible.getBoundingClientRect();
  const t = Math.max(0, r.top);
  html.style.setProperty('--ov-t', `${t}px`);
  html.style.setProperty('--ov-l', `${r.left}px`);
  html.style.setProperty('--ov-w', `${r.width}px`);
  html.style.setProperty('--ov-h', `${Math.min(innerHeight, r.bottom) - t}px`);
  html.classList.add('ouverture-vers');
  const debut = performance.now();
  charge(cible, 700).then(() => {
    // Le fondu commence au plus tôt vers la fin du trajet (0,45 s)
    setTimeout(() => { html.classList.add('ouverture-fin'); fin(450); }, Math.max(0, 450 - (performance.now() - debut)));
  });
}

export function annee() {
  document.querySelectorAll('[data-year]').forEach((el) => (el.textContent = new Date().getFullYear()));
}

// Lecture automatique refusée par le navigateur (Safari en mode économie d’énergie,
// réglage « Ne jamais lire automatiquement »…) : la vidéo signalée (« sz:bloquee »)
// affiche ses commandes si on le demande, et repart au premier geste sur la page
const bloquees = new Set();
document.addEventListener('sz:bloquee', (e) => {
  const { video, commandes } = e.detail || {};
  if (!(video instanceof HTMLVideoElement)) return;
  bloquees.add(video);
  if (commandes) video.controls = true;
});
const relancer = () => bloquees.forEach((v) => {
  const r = v.getBoundingClientRect();
  if (!r.width || r.bottom < 0 || r.top > innerHeight) return;
  v.muted = true;
  v.play().then(() => bloquees.delete(v)).catch(() => {});
});
['pointerdown', 'keydown', 'touchend'].forEach((t) => addEventListener(t, relancer, { capture: true, passive: true }));
export function signalerBloquee(video, commandes = true) {
  document.dispatchEvent(new CustomEvent('sz:bloquee', { detail: { video, commandes } }));
}

export function initCommun() {
  defilementDoux();
  annee();
  entete();
  menu();
  curseur();
  magnetiques();
  copie();
  transitions();
}
