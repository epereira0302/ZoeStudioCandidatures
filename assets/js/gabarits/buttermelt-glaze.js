// Gabarit « Buttermelt Glaze » (NYX Professional Makeup × Krispy Kreme, avril
// 2025), d’après la maquette d’Enzo (2026-11-18, 5 planches) : l’encart
// aubergine fixe à gauche, les visuels à droite, bord à bord.
// - Le produit : la bande « Glaze » (redessinée nette le 2026-11-23) qui glisse
//   au scroll, puis les photos à gauche et, à droite, une scène qui reste à
//   l’écran : le tube Almond Butta devient Chai Butta et la goutte de fond de
//   teint se répand derrière lui (calques détourés dans la maquette)
// - Le packaging : les boîtes à emporter
// - Les réseaux sociaux : juste après les packagings, le post aux logos qui
//   devient le post croqué dans une même scène (2026-11-23), puis la vidéo :
//   le fond passe du jaune à l’orangé, l’affiche glisse comme un carrousel
//   Instagram et l’écran du téléphone suit

import { suivi, videos } from './columbus.js?v=20261124g';
import { encart, installer, glisse, videoSon, sons } from './krispy-commun.js?v=20261124g';
import { reduit } from '../commun.js';

let dossier = '';
const LARGE = '(min-width: 900px) 75vw, 100vw';
// Colonnes du produit : 2712 et 3287 px de large sur la maquette
const GAUCHE = '(min-width: 900px) 34vw, 100vw';
const DROITE = '(min-width: 900px) 41vw, 100vw';

// Image en deux tailles (« -s » = moitié de la largeur)
const img = (nom, w, h, alt, sizes = LARGE, plus = '') => `<img src="${dossier}/${nom}-s.webp" srcset="${dossier}/${nom}-s.webp ${Math.round(w / 2)}w, ${dossier}/${nom}.webp ${w}w" sizes="${sizes}" width="${w}" height="${h}" alt="${alt}" loading="lazy" decoding="async"${plus}>`;
// Visuel qui se pose au scroll (106 % → 100 %), comme sur Columbus
const z = (contenu, classe = '') => `<figure class="cl-z ${classe}">${contenu}</figure>`;
const tot = (html) => html.replace('loading="lazy"', 'loading="eager"');

const CHAPITRES = [
  ['bm-produit', 'Le produit'],
  ['bm-packaging', 'Le packaging'],
  ['bm-reseaux', 'Les réseaux sociaux'],
];

function gabarit(p) {
  const { aside, mobile } = encart(p, CHAPITRES);
  return `
<article class="cl kk bm" data-cl>
  ${aside}
  <div class="cl-visuels bm-visuels" data-cl-visuels>
    <section class="cl-chap" id="bm-produit" aria-label="Le produit" data-ouverture>
      <figure class="kk-bande kk-glisse" data-kk-glisse>${tot(img('glaze-bandeau', 3600, 1061, 'Le mot « Glaze » en grandes lettres jaunes, sur les vagues orangées du tube Buttermelt Glaze', LARGE, ' fetchpriority="high"'))}</figure>
      <div class="bm-produit" data-bm-produit>
        ${z(tot(img('photo-gobelet', 1600, 2001, 'Une main tient le pack Krispy Kreme × NYX dans la rue : un Original Glazed et un tube Buttermelt Glaze dans un papier à pois verts, fermé par un gobelet jaune et sa bande aux deux logos', GAUCHE)), 'bm-produit__gobelet')}
        <div class="bm-teintes" data-bm-teintes>
          <div class="bm-teintes__scene" data-bm-scene>
            <img class="bm-teintes__goutte" src="${dossier}/calque-goutte-s.webp" srcset="${dossier}/calque-goutte-s.webp 942w, ${dossier}/calque-goutte.webp 1883w" sizes="${DROITE}" width="1883" height="1706" alt="" loading="eager" decoding="async">
            <img class="bm-teintes__tube bm-teintes__tube--almond" src="${dossier}/calque-almond-s.webp" srcset="${dossier}/calque-almond-s.webp 490w, ${dossier}/calque-almond.webp 980w" sizes="(min-width: 900px) 16vw, 40vw" width="980" height="2258" alt="Tube NYX Buttermelt Glaze, Soft Glow Skin Tint SPF 30, teinte 04 Almond Butta" loading="eager" decoding="async">
            <img class="bm-teintes__tube bm-teintes__tube--chai" src="${dossier}/calque-chai-s.webp" srcset="${dossier}/calque-chai-s.webp 490w, ${dossier}/calque-chai.webp 980w" sizes="(min-width: 900px) 16vw, 40vw" width="980" height="2258" alt="Le même tube en teinte 05 Chai Butta, devant une goutte de fond de teint caramel" loading="eager" decoding="async">
          </div>
          <!-- Sans animation : les deux visuels de la maquette, l’un sous l’autre -->
          <figure class="bm-teintes__fixe">${tot(img('tube-almond', 1600, 1651, 'Tube NYX Buttermelt Glaze, Soft Glow Skin Tint SPF 30, teinte 04 Almond Butta, sur fond crème', DROITE))}</figure>
          <figure class="bm-teintes__fixe">${img('tube-chai', 1600, 1651, 'Tube NYX Buttermelt Glaze, protection SPF 30, teinte 05 Chai Butta, devant une goutte de fond de teint caramel, sur fond crème', DROITE)}</figure>
        </div>
        ${z(img('photo-plateau', 1600, 2001, 'Sur fond jaune ondulé, une main attrape un gobelet NYX × Krispy Kreme posé dans un porte-gobelet en carton avec le tube Buttermelt Glaze, à côté d’un Original Glazed sur sa serviette à pois', GAUCHE), 'bm-produit__plateau')}
      </div>
    </section>
    <section class="cl-chap" id="bm-packaging" aria-label="Le packaging">
      ${z(img('boites', 2400, 1943, 'Quatre boîtes à emporter jaunes Buttermelt Glaze : les dix teintes du fond de teint, « Ready pour un teint glowy en mode express », des donuts « Fond de teint lumineux, SPF 30, 93 % d’ingrédients soin », deux modèles qui tiennent le tube et un donut, et les logos NYX et Krispy Kreme'), 'bm-boites')}
    </section>
    <section class="cl-chap" id="bm-reseaux" aria-label="Les réseaux sociaux">
      <div class="bm-posts" data-bm-posts>
        <div class="bm-posts__scene" data-bm-posts-scene>
          <div class="bm-posts__affiche">
            <img class="bm-posts__a bm-posts__a--logos" src="${dossier}/post-logos-affiche-s.webp" srcset="${dossier}/post-logos-affiche-s.webp 600w, ${dossier}/post-logos-affiche.webp 1200w" sizes="(min-width: 900px) 30vw, 40vw" width="1200" height="1502" alt="Post Instagram de nyxcosmetics_france : un Original Glazed vu de près, « buttermelt Glaze » en lettres jaunes, le logo Krispy Kreme dans le trou du donut et le logo NYX en relief doré dessous" loading="lazy" decoding="async">
            <img class="bm-posts__a bm-posts__a--croque" src="${dossier}/post-croque-affiche-s.webp" srcset="${dossier}/post-croque-affiche-s.webp 600w, ${dossier}/post-croque-affiche.webp 1200w" sizes="(min-width: 900px) 30vw, 40vw" width="1200" height="1500" alt="Post suivant : un Original Glazed croqué sur sa serviette à pois, « Glaze » écrit sur le glaçage et les logos NYX et Krispy Kreme au centre, à côté du tube et d’une coulée de fond de teint" loading="lazy" decoding="async">
          </div>
          <img class="bm-posts__tel bm-posts__tel--logos" src="${dossier}/post-logos-tel-s.webp" srcset="${dossier}/post-logos-tel-s.webp 400w, ${dossier}/post-logos-tel.webp 800w" sizes="(min-width: 900px) 20vw, 26vw" width="800" height="1572" alt="Le post aux logos affiché sur un téléphone, dans le fil Instagram" loading="lazy" decoding="async">
          <img class="bm-posts__tel bm-posts__tel--croque" src="${dossier}/post-croque-tel-s.webp" srcset="${dossier}/post-croque-tel-s.webp 400w, ${dossier}/post-croque-tel.webp 800w" sizes="(min-width: 900px) 20vw, 26vw" width="800" height="1571" alt="Le post croqué affiché sur le téléphone" loading="lazy" decoding="async">
        </div>
        <!-- Sans animation : les deux visuels de la maquette, l’un sous l’autre -->
        ${z(img('post-logos', 2400, 1786, 'Post Instagram de nyxcosmetics_france : un Original Glazed vu de près, « buttermelt Glaze » en lettres jaunes, le logo Krispy Kreme dans le trou du donut et le logo NYX en relief doré dessous, à côté du même post affiché sur un téléphone'), 'bm-posts__fixe')}
        ${z(img('post-croque', 2400, 1800, 'Post Instagram : un Original Glazed croqué sur sa serviette à pois, « Glaze » écrit sur le glaçage et les logos NYX et Krispy Kreme au centre, à côté du tube et d’une coulée de fond de teint, avec son aperçu sur téléphone, sur fond caramel'), 'bm-posts__fixe')}
      </div>
      <div class="bm-video">${videoSon(dossier, 'video-reseaux', 1200, 1080, 'Vidéo : deux publications des réseaux sociaux côte à côte, la journée « 100 % Glaze » du 26 avril au flagship et une créatrice qui présente le gobelet et les tubes Buttermelt Glaze')}</div>
    </section>
    ${mobile}
  </div>
</article>`;
}

/* Entrée du gabarit --------------------------------------------------------- */
export async function rendre(p) {
  dossier = p.dossier;
  installer(gabarit(p), 'page-bm');
}

// Changement de teinte : la scène reste à l’écran pendant que les photos
// défilent ; l’avancée suit le scroll avec un léger amorti (≈ 0,12 s)
function teintes() {
  const bloc = document.querySelector('[data-bm-teintes]');
  if (!bloc || reduit) return;
  const scene = bloc.querySelector('[data-bm-scene]');
  const [almond, chai] = scene.querySelectorAll('.bm-teintes__tube');
  const goutte = scene.querySelector('.bm-teintes__goutte');
  document.querySelector('[data-bm-produit]').classList.add('bm-anime');
  const lisse = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
  // sortie avec un léger dépassement, comme un liquide qui s’étale puis se pose
  const rebond = (t) => 1 + 2.2 * (t - 1) ** 3 + 1.2 * (t - 1) ** 2;
  let cible = 0; let p = 0; let t0 = 0; let enCours = false;
  const mesurer = () => {
    const h = scene.offsetHeight;
    bloc.style.setProperty('--bm-scene-h', `${h}px`);
    const haut = parseFloat(getComputedStyle(scene).top) || 0;
    const r = bloc.getBoundingClientRect();
    cible = Math.min(1, Math.max(0, (haut - r.top) / Math.max(1, r.height - h)));
  };
  const peindre = () => {
    const c = lisse(0.26, 0.5, p);
    chai.style.opacity = c.toFixed(3);
    almond.style.opacity = c > 0.995 ? '0' : '1';
    const flot = Math.sin(Math.PI * lisse(0.1, 0.9, p));
    const lift = `translate3d(0, ${(-1.4 * flot).toFixed(3)}%, 0) rotate(${(-1.6 * flot).toFixed(3)}deg)`;
    almond.style.transform = lift;
    chai.style.transform = lift;
    const g = lisse(0.36, 0.86, p);
    const s = g > 0 ? 0.22 + 0.78 * rebond(g) : 0.22;
    const onde = Math.sin(Math.PI * g) * 0.05;
    goutte.style.opacity = lisse(0.36, 0.48, p).toFixed(3);
    goutte.style.transform = `scale(${(s * (1 + onde)).toFixed(4)}, ${(s * (1 - onde * 0.8)).toFixed(4)})`;
  };
  const image = (t) => {
    const dt = t0 ? Math.min(0.05, (t - t0) / 1000) : 0.016;
    t0 = t;
    p += (cible - p) * (1 - Math.exp(-dt / 0.12));
    if (Math.abs(cible - p) < 0.0005) p = cible;
    peindre();
    if (p !== cible) requestAnimationFrame(image); else { enCours = false; t0 = 0; }
  };
  const suivre = () => { mesurer(); if (!enCours) { enCours = true; requestAnimationFrame(image); } };
  addEventListener('scroll', suivre, { passive: true });
  addEventListener('resize', suivre, { passive: true });
  mesurer(); p = cible; peindre();
}

// Post aux logos → post croqué : même principe que la scène des teintes
function posts() {
  const bloc = document.querySelector('[data-bm-posts]');
  if (!bloc || reduit) return;
  const scene = bloc.querySelector('[data-bm-posts-scene]');
  const [aLogos, aCroque] = scene.querySelectorAll('.bm-posts__a');
  const [tLogos, tCroque] = scene.querySelectorAll('.bm-posts__tel');
  bloc.classList.add('bm-anime');
  const lisse = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
  const c0 = [253, 207, 126]; const c1 = [194, 115, 58];  // fonds relevés sur la maquette
  let cible = 0; let p = 0; let t0 = 0; let enCours = false;
  const mesurer = () => {
    const h = scene.offsetHeight;
    bloc.style.setProperty('--bm-posts-h', `${h}px`);
    const haut = parseFloat(getComputedStyle(scene).top) || 0;
    const r = bloc.getBoundingClientRect();
    cible = Math.min(1, Math.max(0, (haut - r.top) / Math.max(1, r.height - h)));
  };
  const peindre = () => {
    const k = lisse(0.3, 0.7, p);
    scene.style.backgroundColor = `rgb(${c0.map((v, i) => Math.round(v + (c1[i] - v) * k)).join(' ')})`;
    // carrousel : le post suivant entre par la droite, le premier sort à gauche
    aLogos.style.transform = `translate3d(${(-100 * k).toFixed(2)}%, 0, 0)`;
    aCroque.style.transform = `translate3d(${(100 - 100 * k).toFixed(2)}%, 0, 0)`;
    tCroque.style.opacity = k.toFixed(3);
    tLogos.style.opacity = k > 0.995 ? '0' : '1';
  };
  const image = (t) => {
    const dt = t0 ? Math.min(0.05, (t - t0) / 1000) : 0.016;
    t0 = t;
    p += (cible - p) * (1 - Math.exp(-dt / 0.12));
    if (Math.abs(cible - p) < 0.0005) p = cible;
    peindre();
    if (p !== cible) requestAnimationFrame(image); else { enCours = false; t0 = 0; }
  };
  const suivre = () => { mesurer(); if (!enCours) { enCours = true; requestAnimationFrame(image); } };
  addEventListener('scroll', suivre, { passive: true });
  addEventListener('resize', suivre, { passive: true });
  mesurer(); p = cible; peindre();
}

export function animer() {
  suivi();
  glisse();
  teintes();
  posts();
  videos();
  sons();
  // L’en-tête relit les fonds des blocs maintenant qu’ils existent
  dispatchEvent(new Event('resize'));
}
