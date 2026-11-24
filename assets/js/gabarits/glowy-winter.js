// Gabarit « Glowy Winter » (Columbus Café, Noël 2025), d’après la maquette
// d’Enzo (2026-11-04, 7 planches) : même mise en page que Columbus et Studio
// Zoé, l’encart aubergine fixe à gauche, les visuels à droite. Ouverture sur la
// spirale rose et la neige, affiches A1 / A4 / A5, posts des recettes, façade
// et mugs, sapin, puis le shooting de Sébastien Dray en grilles de photos.

import { suivi, videos } from './columbus.js?v=20261124g';
import { PERLES } from './glowy-winter-perles.js';

let dossier = '';
const LARGE = '(min-width: 900px) 75vw, 100vw';
const DEMI = '(min-width: 900px) 37.5vw, 50vw';
const TIERS = '(min-width: 900px) 24vw, 50vw';

// Image en deux tailles (« -s » = moitié de la largeur)
const img = (nom, w, h, alt, sizes = LARGE, plus = '') => `<img src="${dossier}/${nom}-s.webp" srcset="${dossier}/${nom}-s.webp ${Math.round(w / 2)}w, ${dossier}/${nom}.webp ${w}w" sizes="${sizes}" width="${w}" height="${h}" alt="${alt}" loading="lazy" decoding="async"${plus}>`;
// Visuel qui se pose au scroll (106 % → 100 %), comme sur Columbus
// Vidéo muette en boucle, lancée du début quand la moitié est à l’écran (columbus.js, videos)
const video = (nom, w, h, alt) => `<video muted loop playsinline preload="none" width="${w}" height="${h}" poster="${dossier}/${nom}-poster.webp" aria-label="${alt}" data-cl-video data-cl-depart><source src="${dossier}/${nom}.mp4" type="video/mp4"></video>`;
const z = (contenu, classe = '') => `<figure class="cl-z ${classe}">${contenu}</figure>`;

const CHAPITRES = [
  ['gw-campagne', 'La campagne'],
  ['gw-recettes', 'Les recettes'],
  ['gw-boutique', 'Le point de vente'],
  ['gw-shooting', 'Le shooting'],
];

// Étoiles de la façade : centre en % du visuel (relevés sur la planche 4),
// toutes au même diamètre ; elles passent derrière la façade
const ETOILES = [
  [0.2, 2.1], [26.3, 7.5], [53.4, -1.3], [89.1, 2.1], [72, 23.4], [103.2, 40.9], [-3.8, 49], [54.7, 63.3],
  [73.7, 78.8], [25.6, 84.3], [-0.5, 91.8], [47.8, 97.6], [90.9, 97.3],
];
// Étoile à dix branches inégales, comme sur les planches
const BRANCHES = [1, 0.93, 1, 0.9, 0.97, 1, 0.92, 0.98, 0.95, 0.9];
const POINTS = BRANCHES.flatMap((r, i) => {
  const a = (i / 10) * Math.PI * 2 - Math.PI / 2;
  const b = a + Math.PI / 10;
  return [`${(r * Math.cos(a)).toFixed(3)},${(r * Math.sin(a)).toFixed(3)}`, `${(0.43 * Math.cos(b)).toFixed(3)},${(0.43 * Math.sin(b)).toFixed(3)}`];
}).join(' ');

// Affiches : format, usage, fichier, largeur, hauteur (ombre comprise)
const AFFICHES = [
  ['A1', 'Stop trottoir', 'affiche-a1', 1648, 2450],
  ['A4', 'Affichage vitrine', 'affiche-a4', 1548, 2050],
  ['A5', 'Affichette pour table', 'affiche-a5', 1054, 1398],
];
const ALT_AFFICHE = 'Affiche Glowy Winter sur la spirale rouge : Glowy Choco Praliné, Cinnamon Roll Chaï Latte, Glowy Prali Muffin et Glowy Prali Donut, avec leurs prix';

// Shooting : deux grilles, comme les planches 6 et 7
const GRILLE_1 = [
  ['photo-chocolat-donut', 'Chocolat chaud à la chantilly et au sucre d’orge, un donut doré au sapin en chocolat, sur fond rouge'],
  ['photo-banquette', 'Une jeune femme en gilet rouge sourit sur une banquette, son Glowy Choco Praliné entre les mains'],
  ['photo-cloche', 'Une main soulève une cloche en verre sur une part de red velvet'],
  ['photo-table', 'Table de fête : bougies framboise, papillotes rayées et donut doré sur une assiette liserée de rouge'],
  ['photo-donut-velvet', 'Donut doré au sapin en chocolat à côté d’une part de red velvet, sur fond rouge'],
  ['photo-pull-rouge', 'Des mains aux ongles nude tiennent un chocolat chaud devant un pull rouge'],
];
const GRILLE_2 = [
  ['photo-main-chocolat', 'Une main pose un donut doré contre un chocolat chaud à la chantilly'],
  ['photo-donut-assiette', 'Donut doré au sapin en chocolat sur une assiette blanche à picots'],
  ['photo-muffin-main', 'Une main se penche vers le Glowy Prali Muffin et son sucre d’orge'],
];

// Crédits : « Nom : rôle », dans l’encart en fin de page et sous les visuels sur mobile
// Ouverture animée, d’après le fichier SNOW-TEXT.ai d’Enzo (2026-11-05) :
// la neige des stalactites fond, s’écoule en filets d’eau qui remplissent
// chaque lettre de « Glowy Winter » ; puis les flocons s’y posent un à un, le
// givre et la neige s’accumulent et le titre grossit sous leur poids.
// Lettres : [x de la goutte, bas de la stalactite, haut de la lettre], en %
// du visuel (2419 × 2420), relevés sur le fichier Illustrator.
const LETTRES = [
  [12.82, 10.08, 17.36], [19.43, 12.23, 17.64], [26.54, 6.4, 19.83], [31.54, 12.27, 19.71], [44.52, 14.96, 19.96],
  [58.66, 6.53, 17.77], [63.37, 5.66, 17.77], [71.97, 7.02, 19.67], [77.1, 12.31, 18.22], [83.71, 15.21, 19.79], [86.81, 8.43, 19.88],
];
const VIS = { w: 2419, h: 2420 };                   // visuel, en pixels du fichier
const ZONE = { x: 185, y: 400, w: 2050, h: 295 };   // zone du titre, mêmes unités
const BOITE = { x: (ZONE.x / VIS.w) * 100, y: (ZONE.y / VIS.h) * 100, w: (ZONE.w / VIS.w) * 100, h: (ZONE.h / VIS.h) * 100 };
const GROSSIT = 1.12; // taille finale du titre enneigé
const EAU = 820;      // hauteur de la zone des gouttes (haut du visuel)
// Filtre « goo » : flou puis seuil, les gouttes proches fusionnent comme un liquide
const goo = (id, flou, x, y, w, h) => `<filter id="${id}" filterUnits="userSpaceOnUse" x="${x}" y="${y}" width="${w}" height="${h}" color-interpolation-filters="sRGB"><feGaussianBlur stdDeviation="${flou}"/><feColorMatrix values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 26 -11"/></filter>`;

function ouverture() {
  const src = (n) => `${dossier}/neige-${n}.webp`;
  // Les perles de chaque masque sont dessinées dans deux tracés (celles qui sont
  // posées, celles qui grossissent) plutôt qu’en ~700 cercles animés un à un :
  // même rendu, mais le navigateur n’a plus 1 400 éléments à recalculer par image.
  const traces = (nom) => `<g data-perles="${nom}-posees"></g><path data-perles="${nom}-vives"/>`;
  const gouttes = LETTRES.map(([x, y0]) => `<g transform="translate(${Math.round((x / 100) * VIS.w)} ${Math.round((y0 / 100) * VIS.h) - 8})"><circle r="21"/><circle r="15"/><circle r="11"/><circle r="8"/></g>`).join('');
  return `<figure class="gw-ouverture gw-neige" data-gw-neige data-etat="attente" role="img" aria-label="Glowy Winter : la neige fond et écrit le titre, qui se couvre de neige, au-dessus du Cinnamon Roll Chaï Latte, du Glowy Choco Praliné, du Glowy Prali Muffin et du donut doré, sur une spirale rose">
    <img class="gw-neige__fond" src="${dossier}/neige-fond-s.webp" srcset="${dossier}/neige-fond-s.webp 1210w, ${dossier}/neige-fond.webp 2419w" sizes="${LARGE}" width="2419" height="2420" alt="" fetchpriority="high" decoding="async">
    <div class="gw-neige__titre" style="left:${BOITE.x}%;top:${BOITE.y}%;width:${BOITE.w}%;height:${BOITE.h}%">
      <div class="gw-neige__couche gw-neige__envers" data-couche="ecrit">
        <svg class="gw-neige__ecrit" viewBox="0 0 ${ZONE.w} ${ZONE.h}" preserveAspectRatio="none" aria-hidden="true">
          <defs>${goo('gw-goo-ecrit', 8, -60, -60, ZONE.w + 120, ZONE.h + 120)}
            <filter id="gw-bleu" color-interpolation-filters="sRGB"><feColorMatrix values="0 0 0 0 .8 0 0 0 0 .91 0 0 0 0 1 0 0 0 1 0"/></filter>
            <mask id="gw-ecrit-eau" maskUnits="userSpaceOnUse" x="0" y="0" width="${ZONE.w}" height="${ZONE.h}"><g filter="url(#gw-goo-ecrit)" fill="#fff">${traces('eau')}</g></mask>
            <mask id="gw-ecrit" maskUnits="userSpaceOnUse" x="0" y="0" width="${ZONE.w}" height="${ZONE.h}"><g filter="url(#gw-goo-ecrit)" fill="#fff">${traces('neige')}</g></mask></defs>
          <g mask="url(#gw-ecrit-eau)"><image href="${src('titre')}" width="${ZONE.w}" height="${ZONE.h}" filter="url(#gw-bleu)"/></g>
          <image href="${src('titre')}" width="${ZONE.w}" height="${ZONE.h}" mask="url(#gw-ecrit)"/>
        </svg>
      </div>
      <div class="gw-neige__couche gw-neige__envers" data-couche="givre"><img class="gw-neige__masque" src="${src('titre-givre')}" alt="" decoding="async"></div>
      <div class="gw-neige__couche" data-couche="neige"><img class="gw-neige__masque" src="${src('titre-neige')}" alt="" decoding="async"></div>
    </div>
    <canvas class="gw-neige__flocons" aria-hidden="true"></canvas>
    <img class="gw-neige__bande" src="${dossier}/neige-bande.webp" width="2419" height="389" alt="" decoding="async">
    <svg class="gw-neige__eau" viewBox="0 0 ${VIS.w} ${EAU}" aria-hidden="true">
      <defs>${goo('gw-goo-eau', 7, 0, 0, VIS.w, EAU)}</defs>
      <g filter="url(#gw-goo-eau)" fill="#fbfdff">${gouttes}</g>
    </svg>
  </figure>`;
}


function credits(liste) {
  if (!liste?.length) return '';
  return `<h2 class="cl-credits__titre">Crédits</h2>
        <ul class="gw-credits">${liste.map(([nom, role]) => `<li><span translate="no">${nom}</span> : ${role}</li>`).join('')}</ul>`;
}

function gabarit(p) {
  const menu = (classe) => CHAPITRES.map(([id, nom]) => `<a class="${classe}" href="#${id}" data-chap="${id}">${nom}</a>`);
  const texte = [p.description, ...(p.texte ?? [])].map((t) => `<p>${t}</p>`).join('');
  return `
<article class="cl gw" data-cl>
  <aside class="cl-encart" aria-label="Le projet" data-cl-encart>
   <div class="cl-encart__defile" data-cl-defile>
    <dl class="cl-encart__haut">
      <div><dt>Client</dt><dd translate="no">${p.client}</dd></div>
      <div><dt>Année</dt><dd>${p.annee}</dd></div>
    </dl>
    <h1 class="cl-encart__titre" translate="no">${p.nom || p.titre}</h1>
    <p class="cl-encart__sous">${p.type}</p>
    <div class="cl-encart__texte gw-encart__texte">${texte}</div>
    <div class="cl-encart__bas">
      <nav class="cl-encart__menu" aria-label="Chapitres du projet">
        <ul>${menu('cl-encart__lien').map((a) => `<li>${a}</li>`).join('')}</ul>
      </nav>
      <div class="cl-credits cl-credits--encart">${credits(p.credits)}</div>
    </div>
   </div>
    <a class="cl-encart__fleche" href="#contenu" aria-label="Revenir en haut de la page">↑</a>
  </aside>
  <nav class="cl-repere" aria-label="Chapitres du projet, raccourcis" data-cl-repere>${menu('cl-repere__lien').join('')}</nav>
  <div class="cl-visuels gw-visuels" data-cl-visuels>
    <section class="cl-chap" id="gw-campagne" aria-label="La campagne">
      ${ouverture()}
      <ul class="gw-affiches" data-theme="gw-rose">
        ${AFFICHES.map(([format, usage, f, w, h]) => `<li class="gw-affiches__item gw-affiches__item--${format.toLowerCase()}">
          <p class="gw-affiches__nom"><span>${format}</span> - ${usage}</p>
          ${img(f, w, h, `${ALT_AFFICHE} (format ${format})`, '(min-width: 900px) 21vw, 70vw')}
        </li>`).join('')}
      </ul>
    </section>
    <section class="cl-chap" id="gw-recettes" aria-label="Les recettes">
      <div class="cl-g2 gw-posts">
        ${z(video('video-produits', 960, 1080, 'Animation : l’ours Columbus, le titre Glowy Winter édition limitée, puis le Glowy Choco Praliné et le Glowy Prali Muffin avec leurs ingrédients, sur fond rose et rouge'))}
        ${z(img('photo-produit-trio', 1600, 1800, 'Le Cinnamon Roll Chaï Latte, le Glowy Choco Praliné à la chantilly dorée et le Glowy Prali Muffin, sur fond rose', DEMI))}
      </div>
      <div class="cl-g2 gw-posts">
        ${z(img('photo-produit-muffin', 1600, 1800, 'Le Glowy Prali Muffin, glaçage doré et sucre d’orge, sur une spirale rose', DEMI))}
        ${z(video('video-muffin', 960, 1080, 'Animation : l’ours Columbus, le titre Glowy Winter édition limitée, puis le Glowy Prali Muffin coupé en deux et son glaçage praliné de noisette'))}
      </div>
    </section>
    <section class="cl-chap" id="gw-boutique" aria-label="Le point de vente">
      <figure class="gw-facade" role="img" aria-label="Habillage de la façade Columbus Café : rideaux de théâtre rayés rouge et rose sur la vitrine, guirlande d’étoiles et de perles, grandes étoiles rouges qui tournent lentement sur fond rose">
        <span class="gw-facade__etoiles" aria-hidden="true">${ETOILES.map(([x, y], i) => `<svg class="gw-etoile" viewBox="-1 -1 2 2" style="left:${x}%; top:${y}%; --r:${(i * 47) % 36}deg; --d:${70 + (i * 13) % 50}s;${i % 2 ? ' --sens:reverse;' : ''}"><polygon points="${POINTS}"/></svg>`).join('')}</span>
        <img class="gw-facade__avant" src="${dossier}/facade-avant-s.webp" srcset="${dossier}/facade-avant-s.webp 1200w, ${dossier}/facade-avant.webp 2400w" sizes="${LARGE}" width="2400" height="1738" alt="" loading="lazy" decoding="async">
      </figure>
      <figure class="gw-mugs" data-theme="gw-blanc">${img('mugs', 2400, 448, 'Deux mugs Glowy Winter à plat : l’un rose aux étoiles rouges, l’autre à la spirale rouge et rose, avec l’ours Columbus')}</figure>
      <div class="gw-sapin" data-gw-sapin data-version="0">
        ${[['jour', 'de jour : spirale rose, flocons et guirlande de perles'], ['nuit', 'de nuit : spirale prune, flocons et guirlande lumineuse qui scintille']].map(([m, alt], i) => `<figure class="gw-sapin__video${i ? '' : ' is-actif'}">${video(`sapin-${m}`, 1440, 1080, `Animation : le sapin de Noël décoré aux couleurs de Glowy Winter, ${alt}`).replace(' data-cl-depart', '')}</figure>`).join('')}
        <div class="cl-mode gw-mode" role="group" aria-label="Ambiance du sapin">
          <span class="cl-mode__pouce" aria-hidden="true"></span>
          <button class="cl-mode__btn" type="button" aria-pressed="true" data-gw-mode="0"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2.5v2.5M12 19v2.5M2.5 12H5M19 12h2.5M5.3 5.3l1.8 1.8M16.9 16.9l1.8 1.8M5.3 18.7l1.8-1.8M16.9 7.1l1.8-1.8"/></svg>Jour</button>
          <button class="cl-mode__btn" type="button" aria-pressed="false" data-gw-mode="1"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/></svg>Nuit</button>
        </div>
      </div>
    </section>
    <section class="cl-chap gw-shooting" id="gw-shooting" aria-label="Le shooting" data-theme="gw-blanc">
      <ul class="gw-grille">
        ${GRILLE_1.map(([f, alt]) => `<li>${z(img(f, 1200, 1200, alt, TIERS))}</li>`).join('')}
      </ul>
      <ul class="gw-grille">
        <li class="gw-grille__large">${z(img('photo-trio', 2400, 854, 'Le Glowy Prali Muffin, une part de red velvet et le donut doré alignés sur fond rouge'))}</li>
        ${GRILLE_2.map(([f, alt]) => `<li>${z(img(f, 1200, 1200, alt, TIERS))}</li>`).join('')}
      </ul>
    </section>
    <div class="cl-credits cl-credits--mobile" data-theme="cl-encart">${credits(p.credits)}</div>
  </div>
</article>`;
}

/* Entrée du gabarit --------------------------------------------------------- */
export async function rendre(p) {
  dossier = p.dossier;
  document.body.classList.add('page-cl', 'page-gw');
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', '#200603');
  const main = document.querySelector('main');
  main.querySelectorAll('[data-projet-hero], [data-projet-intro], [data-projet="galerie"]').forEach((n) => n.remove());
  main.insertAdjacentHTML('afterbegin', gabarit(p));
  const header = document.querySelector('.header');
  delete header.dataset.fixeApres;
  header.dataset.on = 'cl-noir';
  const encart = main.querySelector('[data-cl-encart]');
  const mobile = matchMedia('(max-width: 899px)');
  const theme = () => { if (mobile.matches) encart.dataset.theme = 'cl-encart'; else delete encart.dataset.theme; };
  theme();
  mobile.addEventListener('change', () => { theme(); dispatchEvent(new Event('resize')); });
}

// Sapin : interrupteur jour / nuit ; les deux vidéos tournent ensemble,
// la nouvelle reprend au même instant et apparaît en fondu
function sapin() {
  const bloc = document.querySelector('[data-gw-sapin]');
  const figures = [...bloc.querySelectorAll('.gw-sapin__video')];
  const vids = figures.map((f) => f.querySelector('video'));
  const boutons = [...bloc.querySelectorAll('[data-gw-mode]')];
  boutons.forEach((b) => b.addEventListener('click', () => {
    const v = Number(b.dataset.gwMode);
    const avant = Number(bloc.dataset.version);
    if (v === avant) return;
    if (!vids[avant].paused) {
      vids[v].currentTime = vids[avant].currentTime;
      vids[v].play().catch(() => {});
    }
    bloc.dataset.version = String(v);
    figures.forEach((f, i) => f.classList.toggle('is-actif', i === v));
    boutons.forEach((x, i) => x.setAttribute('aria-pressed', String(i === v)));
  }));
}

export function animer() {
  neige();
  suivi();
  videos();
  sapin();
  dispatchEvent(new Event('resize'));
}

// --- Animation de l’ouverture ----------------------------------------------
const MASQUE_POS = (el, v) => { const p = `0% ${(100 - v * 100).toFixed(2)}%`; el.style.maskPosition = p; el.style.webkitMaskPosition = p; };
const borne = (v) => Math.min(1, Math.max(0, v));
const lisse = (v) => v * v * (3 - 2 * v);

// Courbe d’accélération « cubic-bezier », comme en CSS
function bezier(x1, y1, x2, y2) {
  const cx = 3 * x1; const bx = 3 * (x2 - x1) - cx; const ax = 1 - cx - bx;
  const cy = 3 * y1; const by = 3 * (y2 - y1) - cy; const ay = 1 - cy - by;
  return (x) => {
    let t = x;
    for (let i = 0; i < 8; i++) {
      const e = ((ax * t + bx) * t + cx) * t - x;
      const d = (3 * ax * t + 2 * bx) * t + cx;
      if (Math.abs(e) < 1e-6 || !d) break;
      t -= e / d;
    }
    t = borne(t);
    return ((ay * t + by) * t + cy) * t;
  };
}
// Une perle grossit de 0 à 112 % (aux 7/10 du temps) puis revient à 100 %
const COULE = bezier(0.25, 0.8, 0.35, 1);
const taillePerle = (p) => { const q = COULE(p); return q < 0.7 ? (1.12 * q) / 0.7 : 1.12 - (0.12 * (q - 0.7)) / 0.3; };
const RAYON = 22;
const disque = (x, y, r) => `M${(x - r).toFixed(1)},${y}a${r.toFixed(1)},${r.toFixed(1)} 0 1,0 ${(2 * r).toFixed(1)},0a${r.toFixed(1)},${r.toFixed(1)} 0 1,0 ${(-2 * r).toFixed(1)},0z`;

// Remplissage liquide d’un masque : perles = [{ x, y, debut }], durée de
// croissance en ms. Rend une fonction à appeler à chaque image avec le temps
// écoulé ; elle répond false quand tout est posé.
function coulee(scene, nom, perles, duree) {
  const posees = scene.querySelector(`[data-perles="${nom}-posees"]`);
  const vives = scene.querySelector(`[data-perles="${nom}-vives"]`);
  const attente = [...perles].sort((a, b) => a.debut - b.debut);
  let suivante = 0;
  let enCours = [];
  // Perles posées : rangées par petits tracés de 48, pour ne relire à chaque
  // image que le dernier tracé et non les centaines de perles déjà en place
  let lot = null;
  let fixe = '';
  let dansLot = 0;
  const poser = (d) => {
    if (!lot || dansLot >= 48) {
      lot = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      posees.append(lot);
      fixe = '';
      dansLot = 0;
    }
    fixe += d;
    dansLot += 1;
  };
  let dernierVif = '';
  return (t) => {
    while (suivante < attente.length && attente[suivante].debut <= t) enCours.push(attente[suivante++]);
    let vif = '';
    let ajout = false;
    enCours = enCours.filter((p) => {
      const avance = (t - p.debut) / duree;
      if (avance >= 1) {
        // lot plein : on l’écrit une dernière fois avant d’en ouvrir un autre
        if (lot && dansLot >= 48 && ajout) lot.setAttribute('d', fixe);
        poser(disque(p.x, p.y, RAYON));
        ajout = true;
        return false;
      }
      vif += disque(p.x, p.y, RAYON * taillePerle(avance));
      return true;
    });
    if (ajout) lot.setAttribute('d', fixe);
    if (vif !== dernierVif) { vives.setAttribute('d', vif); dernierVif = vif; }
    return suivante < attente.length || enCours.length > 0;
  };
}

// Flocons (canvas) : neige qui tombe en continu ; pendant la « rafale », des
// flocons plus gros tombent sur le titre et s’y posent : chacun prévient pose().
function flocons(canvas, scene, pose, chaqueImage) {
  const ctx = canvas.getContext('2d');
  let w = 0; let h = 0; let actif = false; let raf = 0; let avant = 0;
  let aLancer = 0; let cadence = 0; let reserve = 0;
  const liste = [];
  const nouveau = (haut) => ({
    x: Math.random(), y: haut ? -0.02 - Math.random() * 0.06 : Math.random(),
    r: 0.0025 + Math.random() * 0.0045, v: 0.025 + Math.random() * 0.035, p: Math.random() * 6.28, a: 0.55 + Math.random() * 0.45, rafale: false,
  });
  for (let i = 0; i < 34; i++) liste.push(nouveau(false));
  const taille = () => {
    const r = scene.getBoundingClientRect();
    const dpr = Math.min(devicePixelRatio || 1, 2);
    w = r.width; h = r.height;
    canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  const image = (t) => {
    const dt = Math.min((t - (avant || t)) / 1000, 0.05); avant = t;
    if (aLancer > 0) {
      reserve += dt * cadence;
      while (reserve >= 1 && aLancer > 0) {
        reserve -= 1; aLancer -= 1;
        const f = nouveau(true);
        // tombe au-dessus d’une lettre et s’y pose, dans le haut du titre
        f.x = (BOITE.x + (0.03 + Math.random() * 0.94) * BOITE.w) / 100;
        f.fin = (BOITE.y + BOITE.h * (0.08 + Math.random() * 0.35)) / 100;
        f.r = 0.004 + Math.random() * 0.004; f.v = 0.13 + Math.random() * 0.06; f.a = 0.95; f.rafale = true;
        liste.push(f);
      }
    }
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#fff';
    for (let i = liste.length - 1; i >= 0; i--) {
      const f = liste[i];
      f.y += f.v * dt;
      f.p += dt * 0.9;
      if (f.rafale && f.y >= f.fin) { liste.splice(i, 1); pose(); continue; }
      if (f.y > 1.02) Object.assign(f, nouveau(true));
      ctx.globalAlpha = f.a;
      ctx.beginPath(); ctx.arc((f.x + Math.sin(f.p) * 0.006) * w, f.y * h, f.r * w, 0, 6.2832); ctx.fill();
    }
    chaqueImage(dt);
    raf = actif ? requestAnimationFrame(image) : 0;
  };
  new ResizeObserver(taille).observe(scene);
  new IntersectionObserver(([e]) => {
    actif = e.isIntersecting;
    if (actif && !raf) { avant = 0; raf = requestAnimationFrame(image); }
  }).observe(scene);
  // n flocons lancés en « duree » secondes
  return { rafale: (n, duree) => { aLancer = n; cadence = n / duree; } };
}

function neige() {
  const scene = document.querySelector('[data-gw-neige]');
  if (!scene) return;
  const titre = scene.querySelector('.gw-neige__titre');
  const [ecrit, givre, couche] = ['ecrit', 'givre', 'neige'].map((c) => scene.querySelector(`[data-couche="${c}"]`));
  const masques = [ecrit, givre, givre.firstElementChild, couche.firstElementChild];
  let etat = 'attente';
  const fin = () => {
    etat = 'fin';
    scene.dataset.etat = 'fin';
    scene.getAnimations({ subtree: true }).forEach((a) => a.cancel());
    scene.querySelectorAll('[data-perles]').forEach((t) => { t.removeAttribute('d'); t.replaceChildren(); });
    titre.style.transform = '';
    masques.forEach((m) => { m.style.maskPosition = ''; m.style.webkitMaskPosition = ''; });
  };
  if (matchMedia('(prefers-reduced-motion: reduce)').matches || !scene.animate) { fin(); return; }

  // La neige s’accumule : chaque flocon posé fait monter la « charge » ; le
  // titre la suit sans à-coup (lissage exponentiel), givre puis neige
  // recouvrent par le haut et le titre grossit au même rythme.
  const POSES = 120;
  let poses = 0; let charge = 0; let suivie = 0;
  const pose = () => { if (etat === 'joue') { poses = Math.min(POSES, poses + 1); charge = poses / POSES; } };
  const chaqueImage = (dt) => {
    if (etat !== 'joue' || charge === 0) return;
    suivie += (charge - suivie) * (1 - Math.exp(-dt * 3.2));
    if (charge >= 1 && 1 - suivie < 0.002) { fin(); return; }
    const g = lisse(borne(suivie / 0.3));
    const n = lisse(borne((suivie - 0.12) / 0.88));
    MASQUE_POS(givre.firstElementChild, g); MASQUE_POS(ecrit, g);
    MASQUE_POS(couche.firstElementChild, n); MASQUE_POS(givre, n);
    titre.style.transform = `scale(${(1 + (GROSSIT - 1) * suivie).toFixed(4)})`;
  };
  const neigeux = flocons(scene.querySelector('.gw-neige__flocons'), scene, pose, chaqueImage);
  const imgs = [...scene.querySelectorAll('img')];
  const pret = Promise.all(imgs.map((i) => (i.decode ? i.decode().catch(() => {}) : null)));

  const jouer = () => {
    etat = 'joue';
    scene.dataset.etat = 'joue';
    const a = (el, k, o) => el.animate(k, { fill: 'both', ...o });

    // 1. La neige fond : les stalactites s’allongent tout au long de l’écriture
    a(scene.querySelector('.gw-neige__bande'), [{ transform: 'scaleY(1)' }, { transform: 'scaleY(1.045)' }], { duration: 4200, easing: 'cubic-bezier(.45,0,.55,1)' });

    // 2. Sous chaque stalactite, l’eau perle, s’étire en filet et tombe ; à
    // l’impact, elle se répand dans la lettre en suivant la pente (perles qui
    // fusionnent grâce au filtre « goo »).
    // deux jeux de perles : le front d’eau bleutée, puis la neige blanche qui le suit
    const eau = [];
    const blanche = [];
    const groupes = scene.querySelectorAll('.gw-neige__eau g g');
    let dernier = 0;
    LETTRES.forEach(([x, y0, y1], i) => {
      const d = ((y1 - y0) / 100) * VIS.h + 8;
      const forme = 560;
      const chute = Math.round(Math.sqrt((2 * d) / 4600) * 1000);
      const depart = 150 + i * 200;
      const impact = depart + forme + chute;
      const [perle, ...filet] = groupes[i].children;
      a(perle, [
        { transform: 'translateY(-12px) scale(0)', offset: 0 },
        { transform: 'translateY(4px) scale(.85, .9)', offset: 0.55, easing: 'cubic-bezier(.4,0,.6,1)' },
        { transform: 'translateY(16px) scale(.95, 1.2)', offset: 0.78, easing: 'cubic-bezier(.55,0,1,.45)' },
        { transform: `translateY(${d.toFixed(0)}px) scale(.8, 1.45)`, offset: 1 },
      ], { duration: forme + chute, delay: depart, fill: 'none' });
      // le filet : trois gouttelettes qui suivent et s’amenuisent
      filet.forEach((c, k) => a(c, [
        { transform: 'translateY(0) scale(0)' },
        { transform: 'translateY(6px) scale(1)', offset: 0.25 },
        { transform: `translateY(${(d * (0.7 - k * 0.18)).toFixed(0)}px) scale(0)` },
      ], { duration: chute + 220 + k * 40, delay: depart + forme * 0.72 + k * 55, fill: 'none', easing: 'cubic-bezier(.55,0,.9,.6)' }));
      // l’eau se répand dans la lettre depuis le point d’impact
      const ix = (x / 100) * VIS.w - ZONE.x;
      const iy = (y1 / 100) * VIS.h - ZONE.y;
      PERLES[i].forEach(([px, py]) => {
        const dx = px - ix; const dy = py - iy;
        const dist = Math.hypot(dx * 1.15, Math.max(dy, -dy * 1.8)); // coule plus vite vers le bas
        const t = impact - 30 + (dist / 400) * 1000 + Math.random() * 70;
        eau.push({ x: px, y: py, debut: t - 60 });
        blanche.push({ x: px, y: py, debut: t + 170 });
        dernier = Math.max(dernier, t + 690);
      });
    });
    // Une seule boucle fait grossir les perles des deux masques, sur l’horloge
    // des animations de la page (la même que celle des gouttes ci-dessus)
    const horloge = () => document.timeline.currentTime ?? performance.now();
    const depart0 = horloge();
    const couches = [coulee(scene, 'eau', eau, 420), coulee(scene, 'neige', blanche, 520)];
    const couler = () => {
      if (etat === 'fin') return;
      const t = horloge() - depart0;
      const reste = couches.map((c) => c(t));
      if (reste.some(Boolean)) requestAnimationFrame(couler);
    };
    requestAnimationFrame(couler);

    // 3. Les flocons commencent à tomber sur le titre pendant que les
    // dernières lettres se remplissent ; ils se posent pendant ~4 s.
    setTimeout(() => neigeux.rafale(POSES, 3.6), dernier - 1700);
  };

  let lance = false;
  new IntersectionObserver((entrees, io) => {
    if (lance || !entrees[0].isIntersecting) return;
    lance = true; io.disconnect();
    pret.then(() => setTimeout(jouer, 350));
  }, { threshold: 0.35 }).observe(scene);
}
