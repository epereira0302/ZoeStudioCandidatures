// Pièces communes aux co-brandings Krispy Kreme montés d’après les maquettes
// d’Enzo du 2026-11-18 (Buttermelt Glaze avec NYX, Kiss café avec Too Faced) :
// même encart aubergine que Columbus, Glowy Winter et LCT, visuels bord à bord
// à droite. Deux effets discrets : la bande de titre glisse au scroll, les
// logos chromés brillent quand ils arrivent à l’écran ou au survol.

import { reduit } from '../commun.js';

// Crédits par équipe : [{ equipe, membres: [[nom, rôle]] }] (équipe facultative)
function credits(liste) {
  if (!liste?.length) return '';
  return `<h2 class="cl-credits__titre">Crédits</h2>
        ${liste.map(({ equipe, membres }) => `${equipe ? `<h3>${equipe}</h3>` : ''}
        <ul class="kk-credits">${membres.map(([nom, role]) => `<li><span class="kk-credits__nom" translate="no">${nom}</span> : <span class="kk-credits__role">${role}</span></li>`).join('')}</ul>`).join('')}`;
}

// Encart aubergine (client, année, titre, type, texte, chapitres, crédits)
export function encart(p, chapitres) {
  const menu = (classe) => chapitres.map(([id, nom]) => `<a class="${classe}" href="#${id}" data-chap="${id}">${nom}</a>`);
  const texte = [p.description, ...(p.texte ?? [])].map((t) => `<p>${t}</p>`).join('');
  return {
    aside: `<aside class="cl-encart" aria-label="Le projet" data-cl-encart>
   <div class="cl-encart__defile" data-cl-defile>
    <dl class="cl-encart__haut">
      <div><dt>Client</dt><dd translate="no">${p.client}</dd></div>
      <div><dt>Année</dt><dd>${p.annee}</dd></div>
    </dl>
    <h1 class="cl-encart__titre" translate="no">${p.nom || p.titre}</h1>
    <p class="cl-encart__sous">${p.type}</p>
    <div class="cl-encart__texte kk-encart__texte">${texte}</div>
    <div class="cl-encart__bas">
      <nav class="cl-encart__menu" aria-label="Chapitres du projet">
        <ul>${menu('cl-encart__lien').map((a) => `<li>${a}</li>`).join('')}</ul>
      </nav>
      <div class="cl-credits cl-credits--encart">${credits(p.credits)}</div>
    </div>
   </div>
    <a class="cl-encart__fleche" href="#contenu" aria-label="Revenir en haut de la page">↑</a>
  </aside>
  <nav class="cl-repere" aria-label="Chapitres du projet, raccourcis" data-cl-repere>${menu('cl-repere__lien').join('')}</nav>`,
    mobile: `<div class="cl-credits cl-credits--mobile" data-theme="cl-encart">${credits(p.credits)}</div>`,
  };
}

// Mise en place commune : page à encart, en-tête aubergine
export function installer(html, classe) {
  document.body.classList.add('page-cl', 'page-kk', classe);
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', '#200603');
  const main = document.querySelector('main');
  main.querySelectorAll('[data-projet-hero], [data-projet-intro], [data-projet="galerie"]').forEach((n) => n.remove());
  main.insertAdjacentHTML('afterbegin', html);
  const header = document.querySelector('.header');
  delete header.dataset.fixeApres;
  header.dataset.on = 'cl-noir';
  // Sur mobile, l’encart est en haut de page : l’en-tête prend sa couleur
  const bloc = main.querySelector('[data-cl-encart]');
  const mobile = matchMedia('(max-width: 899px)');
  const theme = () => { if (mobile.matches) bloc.dataset.theme = 'cl-encart'; else delete bloc.dataset.theme; };
  theme();
  mobile.addEventListener('change', () => { theme(); dispatchEvent(new Event('resize')); });
}

// Bande de titre qui glisse doucement de droite à gauche pendant qu’elle
// traverse l’écran (immobile avec « réduire les animations »)
export function glisse() {
  const bandes = [...document.querySelectorAll('[data-kk-glisse]')];
  if (reduit || !bandes.length) return;
  let attente = false;
  const maj = () => {
    attente = false;
    const h = innerHeight;
    bandes.forEach((b) => {
      const r = b.getBoundingClientRect();
      if (r.bottom < 0 || r.top > h) return;
      const t = Math.min(1, Math.max(0, (h - r.top) / (h + r.height))); // 0 → 1 pendant la traversée
      b.style.setProperty('--kk-x', `${((0.5 - t) * 7).toFixed(3)}%`);
    });
  };
  addEventListener('scroll', () => { if (!attente) { attente = true; requestAnimationFrame(maj); } }, { passive: true });
  addEventListener('resize', maj, { passive: true });
  maj();
}

// Reflet qui traverse les logos chromés une fois à l’arrivée (puis au survol, en CSS)
export function brillance() {
  const logos = document.querySelectorAll('[data-kk-brille]');
  if (reduit) { logos.forEach((l) => l.classList.add('is-vu')); return; }
  const io = new IntersectionObserver((entrees) => entrees.forEach((e) => {
    if (!e.isIntersecting) return;
    e.target.classList.add('is-vu');
    io.unobserve(e.target);
  }), { threshold: 0.6 });
  logos.forEach((l) => io.observe(l));
}

// Vidéo des réseaux sociaux : muette en boucle (columbus.js, videos), avec un
// bouton pour écouter le son ; une seule vidéo parle à la fois
export const videoSon = (dossier, nom, w, h, alt) => `<div class="kk-video">
        <video muted loop playsinline preload="none" width="${w}" height="${h}" poster="${dossier}/${nom}-poster.webp" aria-label="${alt}" data-cl-video data-cl-depart><source src="${dossier}/${nom}.mp4" type="video/mp4"></video>
        <button class="kk-son" type="button" aria-pressed="false" data-kk-son><span class="kk-son__icone" aria-hidden="true"><svg viewBox="0 0 24 24" width="20" height="20"><path d="M4 9.5v5h3.5L12 18.5v-13L7.5 9.5H4z" fill="currentColor"/><path class="kk-son__ondes" d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path class="kk-son__barre" d="M16 9.5l5 5M21 9.5l-5 5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg></span><span class="kk-son__texte">Activer le son</span></button>
      </div>`;

export function sons() {
  const boutons = [...document.querySelectorAll('[data-kk-son]')];
  const couper = (b) => {
    const v = b.parentElement.querySelector('video');
    v.muted = true;
    b.setAttribute('aria-pressed', 'false');
    b.querySelector('.kk-son__texte').textContent = 'Activer le son';
  };
  boutons.forEach((b) => b.addEventListener('click', () => {
    const v = b.parentElement.querySelector('video');
    if (!v.muted) { couper(b); return; }
    boutons.filter((x) => x !== b).forEach(couper);
    v.muted = false;
    v.play().catch(() => {});
    b.setAttribute('aria-pressed', 'true');
    b.querySelector('.kk-son__texte').textContent = 'Couper le son';
  }));
  // Une vidéo qui sort de l’écran se tait : on ne garde pas un son sans image
  const io = new IntersectionObserver((entrees) => entrees.forEach((e) => {
    if (!e.isIntersecting) { const b = e.target.parentElement.querySelector('[data-kk-son]'); if (b?.getAttribute('aria-pressed') === 'true') couper(b); }
  }));
  boutons.forEach((b) => io.observe(b.parentElement.querySelector('video')));
}
