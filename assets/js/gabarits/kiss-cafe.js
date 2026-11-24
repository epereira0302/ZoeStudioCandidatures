// Gabarit « Kiss café » (Too Faced × Krispy Kreme, Le Marais, 2025), d’après
// la maquette d’Enzo (2026-11-18, 4 planches) : l’encart aubergine fixe à
// gauche, les visuels à droite, bord à bord.
// - La boutique : le logo Too Faced chromé (un reflet le traverse), puis la
//   boutique et ses horaires
// - Les réseaux sociaux : quatre contenus carrés en deux rangées (images fixes),
//   puis les deux reels de l’événement côte à côte, avec le son à la demande
// - La vitrine : le logo Krispy Kreme en chrome 3D qui tourne sur lui-même
//   (krispy-3d.js, chargé à l’approche), puis la façade entière
//   du 40, dans le Marais

import { suivi, videos } from './columbus.js?v=20261124g';
import { encart, installer, brillance, videoSon, sons } from './krispy-commun.js?v=20261124g';

let dossier = '';
const LARGE = '(min-width: 900px) 75vw, 100vw';
const DEMI = '(min-width: 900px) 37.5vw, 50vw';

// Image en deux tailles (« -s » = moitié de la largeur)
const img = (nom, w, h, alt, sizes = LARGE, plus = '') => `<img src="${dossier}/${nom}-s.webp" srcset="${dossier}/${nom}-s.webp ${Math.round(w / 2)}w, ${dossier}/${nom}.webp ${w}w" sizes="${sizes}" width="${w}" height="${h}" alt="${alt}" loading="lazy" decoding="async"${plus}>`;
// Visuel qui se pose au scroll (106 % → 100 %), comme sur Columbus
const z = (contenu, classe = '') => `<figure class="cl-z ${classe}">${contenu}</figure>`;
const tot = (html) => html.replace('loading="lazy"', 'loading="eager"');

const CHAPITRES = [
  ['kc-boutique', 'La boutique'],
  ['kc-reseaux', 'Les réseaux sociaux'],
  ['kc-vitrine', 'La vitrine'],
];

// Contenus des réseaux sociaux : fichier, largeur, hauteur, description
const CONTENUS = [
  ['video-boite', 1600, 1571, 'Un invité ferme les yeux et rit, bouche grande ouverte, en serrant une boîte Krispy Kreme de donuts roses emballés aux couleurs du Kiss café'],
  ['video-donuts', 1600, 1576, 'Des mains attrapent des donuts au glaçage rose et aux vermicelles posés au milieu des rouges à lèvres Too Faced'],
  ['video-sachet', 1600, 1570, 'Un donut rose dans son papier à pois verts, fermé par l’autocollant Kiss café : un cœur holographique au nœud rose, « Too Faced » et le logo Krispy Kreme'],
  ['video-carrousel', 1600, 1575, 'Une invitée croque son donut devant le mur Too Faced, à côté du cœur Kiss café en relief'],
];

function gabarit(p) {
  const { aside, mobile } = encart(p, CHAPITRES);
  return `
<article class="cl kk kc" data-cl>
  ${aside}
  <div class="cl-visuels kc-visuels" data-cl-visuels>
    <section class="cl-chap" id="kc-boutique" aria-label="La boutique" data-ouverture>
      <figure class="kk-bande kk-brille" data-kk-brille>${tot(img('logo-too-faced', 2400, 705, 'Le logo Too Faced en lettres roses gonflées, sur un dégradé blanc et rose', LARGE, ' fetchpriority="high"'))}</figure>
      ${z(tot(img('boutique', 2400, 1799, 'La boutique éphémère Too Faced, toute rose : l’écran au cœur Kiss café, le comptoir miroir des rouges à lèvres et l’arche « Too Faced, du jeudi au dimanche, 11 h - 19 h », entourés de cœurs et d’étoiles holographiques')), 'kc-boutique')}
    </section>
    <section class="cl-chap" id="kc-reseaux" aria-label="Les réseaux sociaux">
      <ul class="kc-grille">
        ${CONTENUS.map(([f, w, h, alt]) => `<li>${z(img(f, w, h, alt, DEMI))}</li>`).join('')}
      </ul>
      <div class="kc-reels">
        ${videoSon(dossier, 'video-pop-up', 576, 1024, 'Reel : une créatrice découvre le premier pop-up Too Faced à Paris, entre la vitrine Kiss café, les rouges à lèvres, le mur Kissing Juicy Tint et la boîte de donuts Krispy Kreme')}
        ${videoSon(dossier, 'video-kiss-cafe', 576, 1024, 'Reel : visite du pop-up Kiss café, la vitrine du Marais, les donuts roses emballés aux couleurs de l’événement et les coffrets de maquillage')}
      </div>
    </section>
    <section class="cl-chap" id="kc-vitrine" aria-label="La vitrine">
      <figure class="kc-logo3d" role="img" aria-label="Le logo Krispy Kreme Doughnuts en chrome, qui tourne lentement sur lui-même, sur un fond violet traversé de rose" data-kc-logo3d>
        <img class="kc-logo3d__fond" src="${dossier}/fond-krispy-s.webp" srcset="${dossier}/fond-krispy-s.webp 1200w, ${dossier}/fond-krispy.webp 2400w" sizes="${LARGE}" width="2400" height="1272" alt="" loading="lazy" decoding="async">
        <img class="kc-logo3d__image" src="${dossier}/logo-krispy-s.webp" srcset="${dossier}/logo-krispy-s.webp 1200w, ${dossier}/logo-krispy.webp 2400w" sizes="${LARGE}" width="2400" height="1272" alt="" loading="lazy" decoding="async">
        <span class="kc-logo3d__aide" aria-hidden="true">Glissez pour le faire tourner</span>
      </figure>
      ${z(img('vitrine', 1176, 1154, 'La vitrine du 40, dans le Marais : enseigne « Le Marais 40 », cœurs, lèvres et étoiles holographiques collés sur la vitre, le cœur Kiss café « 18 sept - 5 oct » et l’arche Too Faced « Du jeudi au dimanche, 11 h - 19 h »'), 'kc-vitrine')}
    </section>
    ${mobile}
  </div>
</article>`;
}

/* Entrée du gabarit --------------------------------------------------------- */
export async function rendre(p) {
  dossier = p.dossier;
  installer(gabarit(p), 'page-kc');
}

// Logo en 3D : le module (et three.js) ne se charge qu’à l’approche
function logo3d() {
  const fig = document.querySelector('[data-kc-logo3d]');
  if (!fig) return;
  const io = new IntersectionObserver(([e]) => {
    if (!e.isIntersecting) return;
    io.disconnect();
    import('./krispy-3d.js?v=20261124g').then((m) => m.logo3d(fig, dossier)).catch(() => {});
  }, { rootMargin: '60% 0px' });
  io.observe(fig);
}

export function animer() {
  suivi();
  brillance();
  videos();
  sons();
  logo3d();
  // L’en-tête relit les fonds des blocs maintenant qu’ils existent
  dispatchEvent(new Event('resize'));
}
