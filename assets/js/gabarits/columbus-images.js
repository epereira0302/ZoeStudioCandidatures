// Gabarit « Production image & direction artistique » (Columbus Café, éditions
// limitées 2025). Version C de la maquette vidéo du 24/11/2026, validée par
// Enzo : « collage en mouvement ».
//
// Trois mises en page seulement, dans cet ordre pour chaque édition :
//   1. planche : cinq photos posées sur l’aplat clair, titre en Cooper Black
//   2. duo : une photo et l’aplat foncé, la petite image change au fil du scroll
//   3. plein cadre : la dernière petite image en grand, en paysage
//   4. seconde planche : cinq autres photos, les vidéos mêlées aux photos
// Le scroll reste libre : les photos se déplacent à des profondeurs différentes,
// le duo se referme (photo d’un côté, aplat de l’autre), le plein cadre s’ouvre
// depuis une carte centrée. Le fond passe d’une couleur à l’autre en continu
// (interpolation OKLab), du milieu de la dernière planche d’une édition au
// milieu de la première planche de la suivante.
// Textes posés sur les visuels : Cooper Black (titres) et Uniform (le reste ;
// repli Sofia Pro Condensed tant que les fichiers Uniform ne sont pas fournis).
// L’encart aubergine garde la police du site. Aucune édition ne commence par
// une vidéo. Avec « réduire les animations », rien ne bouge et toutes les
// images restent visibles.

import { suivi, videos } from './columbus.js?v=20261124g';
import { encart, installer } from './krispy-commun.js?v=20261124g';
import { reduit } from '../commun.js';

// Polices Adobe Fonts : Cooper Black Std (kit lvy6flr) et Sofia Pro Condensed
// (kit du site, repli d’Uniform)
const POLICES = ['https://use.typekit.net/lvy6flr.css', 'https://use.typekit.net/ivl0joc.css'];

let dossier = '';

// Photos : [fichier, largeur, hauteur, description]
const PHOTOS = Object.fromEntries([
  ['bleu-donut-cartes', 1400, 2100, 'Donut au glaçage bleu, filets bleu foncé et fleurs de bleuet sur une assiette blanche, entre un muffin, des dés bleus, des cartes à jouer et un chaï latte bleu, sur une nappe à carreaux au soleil'],
  ['bleu-boisson-bleue', 2000, 1333, 'Boisson bleue glacée avec une rondelle de citron, sur fond bleu clair, avec son ombre bleutée'],
  ['bleu-latte-velours', 1400, 2100, 'Chaï latte bleu au cœur de mousse sur une soucoupe grise et quelques myrtilles, posé sur un fauteuil en velours bleu nuit'],
  ['bleu-compotee-moule', 1400, 2100, 'Une main dépose à la cuillère la compotée de myrtille sur un muffin, dans le moule'],
  ['bleu-compotee-cuilleres', 1400, 2100, 'Deux cuillères déposent la compotée de myrtille sur un muffin doré, dans le moule'],
  ['bleu-glacage-fouet', 1400, 2100, 'Un fouet fait couler le glaçage bleu sur les muffins coiffés de compotée de myrtille'],
  ['bleu-muffin-bleuet', 1400, 2100, 'Gros plan d’un muffin aux filets de glaçage bleu, coiffé de compotée de myrtille et de pétales de bleuet'],
  ['bleu-muffin-bouquet', 1400, 2100, 'Muffin chaï myrtille sur une assiette bleue avec des myrtilles, devant un bouquet de fleurs des champs dans un vase bleu, un pot de lait et un fouet'],
  ['bleu-table-cartes', 1400, 2100, 'Vue d’ensemble de la table : donut bleu, muffin, chaï latte, bougie bleue torsadée, bouquet, dés et cartes à jouer, une main qui tient ses cartes'],
  ['vert-035', 1400, 2100, 'Donuts au glaçage pistache et éclats de pistache sur une grille, sur fond vert'],
  ['vert-002', 1400, 2100, 'Muffin pistache sur une soucoupe verte et boisson à la pistache, nappe vichy verte et pistaches sur fond vert pâle'],
  ['vert-017', 1400, 2100, 'Une main prend une pile de cookies à la pistache posée sur une serviette Columbus, à côté d’une boisson, sur fond vert'],
  ['vert-023', 1400, 2100, 'Trois muffins à la crème de pistache sur une assiette, fleurs roses, sur fond vert vif'],
  ['vert-048', 1400, 2100, 'Une cuillère dorée d’où coule la crème de pistache, sur fond kaki'],
  ['vert-049', 1400, 2100, 'Boisson à la pistache parsemée d’éclats, quelques pistaches devant, sur fond kaki'],
  ['vert-056', 1400, 2100, 'Boisson à la pistache et muffin pistache côte à côte, sur fond kaki'],
  ['vert-068', 1400, 2100, 'Pistaches en coque, vues de dessus'],
  ['vert-070', 1400, 2100, 'Pistaches décortiquées, vertes et violettes, vues de dessus'],
  ['vert-073', 1400, 2100, 'Une main bat le matcha au fouet en bambou dans un petit bol blanc'],
  ['vert-008', 1400, 2100, 'Une main tient la boisson à la pistache sur une nappe vichy verte, pistaches éparpillées'],
  ['vert-090', 1400, 2100, 'Fraises, fouet en bambou et bol de matcha en poudre, sur fond rose'],
  ['vert-092', 1400, 2100, 'Trois muffins à la pistache sur une assiette à bord rayé, sur fond rose'],
  ['vert-100', 1400, 2100, 'Muffins pistache sur une assiette verte, bouquet de fleurs roses dans un vase, une main et un téléphone, sur fond rose'],
  ['jaune-017', 1400, 2100, 'Muffin coiffé de passion et d’un ruban rayé sur une planche rose, avec un fruit de la passion et de la noix de coco, sur fond jaune'],
  ['jaune-003', 1400, 2100, 'Une main laisse tomber une rondelle de citron au-dessus de deux boissons, sur fond jaune'],
  ['jaune-012', 1400, 2100, 'Citronnade et jus en gros plan, rondelles de citron, sur fond jaune'],
  ['jaune-015', 1400, 2100, 'Deux boissons, un fruit de la passion ouvert et des fleurs, sur fond jaune'],
  ['jaune-018', 1400, 2100, 'Donut au glaçage citron et ruban rayé sur une assiette festonnée, vu de dessus, sur fond jaune'],
  ['jaune-020', 1400, 2100, 'Donut au glaçage citron sur une assiette, nappe à carreaux, sur fond jaune'],
  ['jaune-045', 1400, 2100, 'Une jeune femme sourit en tenant un muffin, un bouquet de tulipes au bras'],
  ['jaune-051', 1400, 2100, 'Deux amies trinquent avec leurs citronnades, muffin en main'],
  ['jaune-068', 1400, 2100, 'Donut au glaçage citron, citronnade et part de tarte au citron sur un carrelage clair'],
  ['jaune-069', 1400, 2100, 'Tarte au citron, citrons et fruits de la passion sur une planche jaune'],
  ['jaune-096', 1400, 2100, 'Une jeune femme à lunettes blanches regarde son téléphone, un muffin à la main, sur fond jaune'],
  ['jaune-098', 1400, 2100, 'La même jeune femme croque son muffin en riant'],
  ['jaune-110', 1400, 2100, 'Muffin et citronnade sur une table jaune, devant un ciel nuageux peint'],
  ['jaune-113', 1400, 2100, 'Muffin, citronnade et demi-citron, devant un ciel nuageux peint'],
  ['jaune-115', 1400, 2100, 'Muffin et citronnade au milieu de marguerites, devant un ciel nuageux'],
  ['marron-037', 1400, 2100, 'Boisson au caramel et au pop-corn en gros plan, filets de caramel sur le verre, devant un rideau bordeaux'],
  ['marron-032', 2000, 1333, 'Boissons au caramel, muffin, donut et cookie au chocolat sur une serviette Columbus, pop-corn éparpillé, devant un rideau bordeaux'],
  ['marron-021', 1400, 2101, 'Muffin au pop-corn et latte sur une serviette Columbus, devant un rideau bordeaux'],
  ['marron-024', 1400, 2100, 'Boissons au caramel, muffin et cookie sur une serviette Columbus'],
  ['marron-030', 1400, 2100, 'Cookie au chocolat et donut, vus de près'],
  ['marron-038', 1400, 2099, 'Boissons au caramel, donut, muffin et cookie, devant le rideau bordeaux'],
  ['marron-039', 1400, 2100, 'Donut au pop-corn sur une serviette Columbus'],
  ['marron-043', 1400, 2100, 'Donut posé au milieu d’un bol de pop-corn, vu de dessus'],
  ['marron-045', 1400, 2100, 'Muffin et boisson au pop-corn, pop-corn répandu devant'],
  ['marron-062', 1400, 2100, 'Boisson au caramel et au pop-corn vue de dessus, sur fond bordeaux'],
  ['marron-069', 1400, 2100, 'Une main dépose du pop-corn sur la boisson au caramel'],
  ['marron-006', 1400, 2100, 'Latte et brique de lait d’avoine Alpro Barista, devant le rideau bordeaux'],
  ['marron-013', 1400, 2100, 'Une personne assise tient un latte et un muffin'],
  ['marron-074', 1400, 2100, 'Mains, latte et cookie sur une petite table ronde'],
  ['marron-095', 1400, 2100, 'Une jeune femme boit sa boisson sur une banquette, muffin et sac sur la table'],
  ['marron-121', 1400, 2100, 'Un client attablé, boisson au caramel, muffin et cookie sur une assiette bleue'],
  ['marron-129', 1400, 2100, 'Des mains cassent un cookie au chocolat au-dessus d’une boisson au pop-corn'],
  ['bleu-donut-table', 1400, 2100, 'Donut au glaçage bleu et fleurs de bleuet sur une assiette blanche, cartes à jouer, dés bleus, cuillère bleue et myrtilles sur une nappe à carreaux'],
  ['bleu-muffins-dessus', 1400, 2100, 'Muffins dorés dans leur moule, vus de dessus, avant la garniture'],
  ['bleu-muffin-moule', 1400, 2100, 'Un muffin coiffé de compotée de myrtille, de glaçage bleu et de fleurs de bleuet, au milieu des autres muffins dans le moule'],
  ['bleu-glacage-vertical', 1400, 2100, 'Le fouet dépose le glaçage bleu sur un muffin coiffé de compotée de myrtille'],
  ['bleu-muffin-vase', 1400, 2100, 'Muffin chaï myrtille sur une assiette grise avec des myrtilles, devant un vase bleu et un bouquet de mimosa, un fouet et une cuillère bleue'],
].map(([f, w, h, alt]) => [f, { f, w, h, alt }]));

const EDITIONS = [
  {
    id: 'ci-bleu', titre: 'Du bleu contre le blues', num: '01', mois: 'Janvier 2025', saveur: 'Myrtille, spiruline bleue et chaï',
    clair: '#cfe3f5', fonce: '#1c2b4a',
    vue1: 'bleu-glacage-fouet',
    vue2: ['bleu-compotee-cuilleres', 'bleu-glacage-vertical', 'bleu-compotee-moule', 'bleu-muffins-dessus', 'bleu-muffin-moule'],
    vue3: 'bleu-latte-velours',
    suite: ['bleu-muffin-vase', 'bleu-boisson-bleue', 'bleu-table-cartes', 'bleu-muffin-bleuet', 'bleu-donut-table'],
    galerie: ['bleu-muffin-bouquet', 'bleu-donut-cartes'],
    videos: [['video-chai-latte', 1080, 1920, 'Animation : « Du bleu contre le blues… », le chaï à la spiruline bleue, le coulis de myrtille et le lait velouté composent le chaï latte myrtille'], ['video-muffin', 1080, 1920, 'Animation : le muffin cœur myrtille, son glaçage au chaï à la spiruline bleue, la compotée de myrtille et les fleurs de bleuet']],
  },
  {
    id: 'ci-vert', titre: 'Matcha ou Pistache', num: '02', mois: 'Mars 2025', saveur: 'Crème de pistache, éclats et matcha',
    clair: '#e2eac6', fonce: '#3d4a1e',
    vue1: 'vert-023',
    vue2: ['vert-048', 'vert-035', 'vert-068', 'vert-073', 'vert-090'],
    vue3: 'vert-002',
    suite: ['vert-017', 'vert-070', 'vert-056', 'vert-092', 'vert-100'],
    galerie: ['vert-049', 'vert-008'],
    videos: [['video-vert-frappe', 960, 1080, 'Animation : « Matcha ou Pistache ? », le frappé pistache au crémeux de pistache, lait velouté, glace pilée et éclats de pistache'], ['video-vert-muffin', 960, 1080, 'Animation : le muffin cœur pistache, son crémeux et ses éclats de pistache']],
  },
  {
    id: 'ci-jaune', titre: 'Passion d’été', num: '03', mois: 'Avril 2025', saveur: 'Fruit de la passion, citron et noix de coco',
    clair: '#fde6a3', fonce: '#9a4514',
    vue1: 'jaune-015',
    vue2: ['jaune-003', 'jaune-017', 'jaune-069', 'jaune-018', 'jaune-012'],
    vue3: 'jaune-045',
    suite: ['jaune-020', 'jaune-051', 'jaune-113', 'jaune-096', 'jaune-110'],
    galerie: ['jaune-068', 'jaune-098', 'jaune-115'],
    videos: [['video-jaune-produits', 960, 1080, 'Animation : « Passions d’été », le muffin coco passion, le smoothie passion et l’élixir passion'], ['video-jaune-muffin', 960, 1080, 'Animation : le muffin coco passion, sa pâte de noix de coco, son cœur et son topping passion']],
  },
  {
    id: 'ci-marron', titre: 'Pop party', num: '04', mois: 'Juillet 2025', saveur: 'Caramel, pop-corn et lait d’avoine',
    clair: '#f2d6c1', fonce: '#4b1f15',
    vue1: 'marron-037',
    vue2: ['marron-069', 'marron-043', 'marron-030', 'marron-013', 'marron-062'],
    vue3: 'marron-021',
    suite: ['marron-129', 'marron-039', 'marron-095', 'marron-006', 'marron-032'],
    galerie: ['marron-074', 'marron-024', 'marron-121', 'marron-038', 'marron-045'],
    videos: [],
  },
];

// Recadrages paysage du plein cadre (largeur et hauteur de la grande taille)
const PAYSAGES = { 'bleu-donut-table': [1717, 966], 'vert-100': [2400, 1350], 'jaune-110': [2400, 1350], 'marron-032': [2400, 1350] };

// Deux compositions de planche (gauche, haut, largeur, hauteur, en % du cadre) :
// P d’après la maquette d’Enzo, Q en miroir. Le CSS reprend ces places sur mobile.
const COMPO = {
  P: [[17, 9, 19, 44], [43, 47, 22, 46], [47, 8, 25, 32], [3.5, 63, 25, 30], [75, 52, 19, 38]],
  Q: [[64, 9, 19, 44], [35, 47, 22, 46], [28, 8, 25, 32], [71.5, 63, 25, 30], [6, 52, 19, 38]],
};

// Répartition des photos d’une édition. La seconde planche reçoit les vidéos,
// chacune dans la case dont le format est le plus proche du sien.
function repartir(e, compo2) {
  const reserve = [e.vue1, ...e.suite.slice(0, 4), ...e.galerie];
  const p2 = new Array(5).fill(null);
  e.videos.forEach(([f, w, h, alt]) => {
    const libre = COMPO[compo2].map(([, , cw, ch], k) => ({ k, r: (cw * 16) / (ch * 10) }))
      .filter((c) => !p2[c.k]).sort((a, b) => Math.abs(a.r - w / h) - Math.abs(b.r - w / h))[0];
    p2[libre.k] = { video: f, w, h, alt };
  });
  let i = 0;
  for (let k = 0; k < 5; k++) if (!p2[k]) p2[k] = reserve[i++];
  return { p1: e.vue2, grand: e.vue3, p2, suite: [...reserve.slice(i), e.suite[4]], paysage: e.suite[4] };
}

// Image en deux tailles (« -s » = moitié de la largeur)
const img = (f, sizes) => {
  const { w, h, alt } = PHOTOS[f];
  return `<img src="${dossier}/${f}-s.webp" srcset="${dossier}/${f}-s.webp ${Math.round(w / 2)}w, ${dossier}/${f}.webp ${w}w" sizes="${sizes}" width="${w}" height="${h}" alt="${alt}" loading="lazy" decoding="async">`;
};
const media = (it) => (typeof it === 'string'
  ? img(it, '(min-width: 900px) 22vw, 44vw')
  : `<video src="${dossier}/${it.video}.mp4" width="${it.w}" height="${it.h}" muted loop playsinline preload="none" data-cl-video aria-label="${it.alt}"></video>`);
// Une vidéo garde son format entier (son texte incrusté n’est jamais coupé)
const formatVideo = (it) => (typeof it === 'string' ? '' : ` style="aspect-ratio:${it.w} / ${it.h}"`);

function planche(e, items, compo, depart, premiere) {
  return `<div class="ci-bloc ci-bloc--planche" data-bloc="planche">
    <div class="ci-planche ci-planche--${compo}${premiere ? '' : ' ci-planche--sans-titre'}">
      ${premiere ? `<div class="ci-planche__titre" data-titre>
        <h2 class="ci-cooper" id="${e.id}-titre">${e.titre}</h2>
        <p class="ci-uniform">${e.saveur}</p>
      </div>` : ''}
      ${items.map((it, k) => `<figure class="ci-photo${typeof it === 'string' ? '' : ' ci-photo--video'}" data-photo>
        <figcaption class="ci-uniform">${String(depart + k).padStart(2, '0')}.</figcaption>
        <div class="ci-photo__cadre"${formatVideo(it)}>${media(it)}</div>
      </figure>`).join('')}
      <p class="ci-planche__ed ci-uniform">Éd. ${e.num} · ${e.mois}</p>
    </div>
  </div>`;
}

function duo(r, miroir) {
  const n = String(r.suite.length).padStart(2, '0');
  return `<div class="ci-bloc ci-bloc--duo" data-bloc="duo">
   <div class="ci-duo__piste" data-piste>
    <div class="ci-duo${miroir ? ' ci-duo--miroir' : ''}">
      <figure class="ci-duo__photo">${img(r.grand, '(min-width: 900px) 38vw, 100vw')}</figure>
      <div class="ci-duo__aplat">
        <ul class="ci-duo__suite">${r.suite.map((f) => `<li>${img(f, '(min-width: 900px) 14vw, 40vw')}</li>`).join('')}</ul>
        <p class="ci-duo__compte ci-uniform" aria-hidden="true"><span>01</span> / ${n}</p>
      </div>
    </div>
   </div>
  </div>`;
}

function plein(e, r) {
  const f = r.paysage; const [w, h] = PAYSAGES[f];
  return `<div class="ci-bloc ci-bloc--plein" data-bloc="plein">
    <figure class="ci-plein">
      <img src="${dossier}/${f}-paysage-s.webp" srcset="${dossier}/${f}-paysage-s.webp ${Math.round(w / 2)}w, ${dossier}/${f}-paysage.webp ${w}w" sizes="(min-width: 900px) 75vw, 100vw" width="${w}" height="${h}" alt="${PHOTOS[f].alt}, en grand" loading="lazy" decoding="async">
      <figcaption class="ci-plein__legende ci-uniform">${e.titre} · Columbus Café · ${e.mois}</figcaption>
    </figure>
  </div>`;
}

function gabarit(p) {
  const { aside, mobile } = encart(p, EDITIONS.map((e) => [e.id, e.titre]));
  return `
<article class="cl kk ci" data-cl>
  ${aside}
  <div class="cl-visuels ci-visuels" data-cl-visuels style="--ci-fond:${EDITIONS[0].clair}; --ci-encre:${EDITIONS[0].fonce}">
    ${EDITIONS.map((e, i) => {
      const [c1, c2] = i % 2 ? ['Q', 'P'] : ['P', 'Q'];
      const r = repartir(e, c2);
      return `<section class="cl-chap ci-edition" id="${e.id}" aria-labelledby="${e.id}-titre" data-clair="${e.clair}" data-fonce="${e.fonce}" style="--ci-clair:${e.clair}; --ci-fonce:${e.fonce}">
      ${planche(e, r.p1, c1, 1, true)}
      ${duo(r, i % 2 === 1)}
      ${plein(e, r)}
      ${planche(e, r.p2, c2, 6, false)}
    </section>`;
    }).join('\n    ')}
    ${mobile}
  </div>
</article>`;
}

/* Couleurs : passage en OKLab, sans gris au milieu --------------------------- */
const borne = (x) => Math.min(1, Math.max(0, x));
const lisse = (a, b, x) => { const t = borne((x - a) / (b - a)); return t * t * (3 - 2 * t); };
const mix = (a, b, t) => a + (b - a) * t;
const lin = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const delin = (c) => (c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055);
function versLab(hex) {
  const [r, g, b] = [1, 3, 5].map((i) => lin(parseInt(hex.slice(i, i + 2), 16) / 255));
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  return [0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s, 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s, 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s];
}
function depuisLab([L, A, B]) {
  const l = (L + 0.3963377774 * A + 0.2158037573 * B) ** 3;
  const m = (L - 0.1055613458 * A - 0.0638541728 * B) ** 3;
  const s = (L - 0.0894841775 * A - 1.291485548 * B) ** 3;
  const rgb = [4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s, -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s, -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s];
  return `rgb(${rgb.map((c) => Math.round(borne(delin(c)) * 255)).join(', ')})`;
}
const melange = (a, b, t) => { const x = versLab(a); const y = versLab(b); return depuisLab(x.map((v, i) => mix(v, y[i], t))); };

/* Mouvement ----------------------------------------------------------------- */
const PROFONDEURS = [-160, 110, -90, 190, -130]; // px de parallaxe par photo, pour un écran de 900 px

function animerPage() {
  const visuels = document.querySelector('[data-cl-visuels]');
  let eds = []; let blocs = []; let vh = innerHeight; let etroit = false;
  const mesurer = () => {
    vh = innerHeight; etroit = innerWidth < 900;
    const haut = (el) => el.getBoundingClientRect().top + scrollY;
    eds = [...document.querySelectorAll('.ci-edition')].map((el) => ({ top: haut(el), clair: el.dataset.clair, fonce: el.dataset.fonce }));
    blocs = [...document.querySelectorAll('[data-bloc]')].map((el) => ({
      el, type: el.dataset.bloc, top: haut(el), h: el.offsetHeight,
      photos: [...el.querySelectorAll('[data-photo]')], titre: el.querySelector('[data-titre]'),
      duo: el.querySelector('.ci-duo'), suite: [...el.querySelectorAll('.ci-duo__suite li')], compte: el.querySelector('.ci-duo__compte span'),
      plein: el.querySelector('.ci-plein'), piste: el.querySelector('[data-piste]'),
    })).map((b) => (b.piste ? { ...b, pTop: haut(b.piste), pH: b.piste.offsetHeight, cH: b.duo.offsetHeight, haut: parseFloat(getComputedStyle(b.duo).top) || 0 } : b));
  };

  // Le fond glisse d’une couleur à l’autre sur une longue distance
  const fond = (y) => {
    const centre = y + vh / 2;
    let clair = eds[0].clair; let encre = eds[0].fonce;
    for (let i = 0; i < eds.length - 1; i++) {
      const a = eds[i]; const b = eds[i + 1];
      const debut = b.top - vh * 1.15; const fin = b.top + vh * 0.55;
      if (centre > fin) { clair = b.clair; encre = b.fonce; continue; }
      if (centre >= debut) { const t = lisse(debut, fin, centre); clair = melange(a.clair, b.clair, t); encre = melange(a.fonce, b.fonce, t); }
      break;
    }
    visuels.style.setProperty('--ci-fond', clair);
    visuels.style.setProperty('--ci-encre', encre);
  };

  const peindre = (y) => {
    fond(y);
    if (reduit) return;
    const amp = (etroit ? 0.45 : 1) * (vh / 900);
    blocs.forEach((b) => {
      const p = (y + vh - b.top) / (b.h + vh); // 0 : le bloc entre par le bas ; 1 : il sort par le haut
      if (p < -0.1 || p > 1.1) return;
      if (b.type === 'planche') {
        b.photos.forEach((ph, k) => {
          const a = lisse(0.02 + k * 0.025, 0.2 + k * 0.025, p);
          ph.style.opacity = a.toFixed(3);
          ph.style.transform = `translate3d(0, ${((0.5 - p) * PROFONDEURS[k] * amp).toFixed(1)}px, 0) rotate(${((0.5 - p) * (k % 2 ? 3 : -3)).toFixed(2)}deg)`;
          const m = ph.querySelector('img');
          if (m) m.style.transform = `scale(1.12) translate3d(0, ${((p - 0.5) * 6).toFixed(2)}%, 0)`;
        });
        if (b.titre) {
          // titre et sous-titre bougent ensemble : ils ne se chevauchent jamais
          const a = lisse(0.04, 0.22, p);
          b.titre.style.opacity = a.toFixed(3);
          b.titre.style.transform = `translate3d(0, ${((0.5 - p) * 60 * amp + (1 - a) * 24).toFixed(1)}px, 0)`;
        }
      } else if (b.type === 'duo') {
        // le duo se referme en arrivant, puis reste à l’écran le temps des petites images
        const q = borne((y + b.haut - b.pTop) / Math.max(1, b.pH - b.cH));
        const e = lisse(0.04, 0.24, (y + vh - b.pTop) / (b.cH + vh));
        const [photo, aplat] = b.duo.children;
        const sens = b.duo.classList.contains('ci-duo--miroir') ? -1 : 1;
        b.duo.style.opacity = e.toFixed(3);
        photo.style.transform = `translate3d(${((1 - e) * -35 * sens).toFixed(2)}%, 0, 0)`;
        aplat.style.transform = `translate3d(${((1 - e) * 35 * sens).toFixed(2)}%, 0, 0)`;
        // chaque petite image descend sur la précédente
        const n = b.suite.length; const k4 = lisse(0.08, 0.88, q) * (n - 1);
        b.suite.forEach((li, k) => {
          const d = k ? borne(k4 - (k - 1)) : 1; const s = d * d * (3 - 2 * d);
          li.style.opacity = d > 0 ? '1' : '0';
          li.style.clipPath = `inset(${((1 - s) * 100).toFixed(2)}% 0 0 0)`;
          li.firstElementChild.style.transform = `scale(${mix(1.12, 1, s).toFixed(4)})`;
        });
        b.compte.textContent = String(Math.min(n, Math.round(k4) + 1)).padStart(2, '0');
      } else {
        // le plein cadre s’ouvre depuis une carte centrée
        const e = lisse(0.08, 0.45, p);
        b.plein.style.clipPath = `inset(${((1 - e) * 22).toFixed(2)}% ${((1 - e) * 26).toFixed(2)}% round ${((1 - e) * 22).toFixed(1)}px)`;
        b.plein.firstElementChild.style.transform = `scale(${mix(1.25, 1, e).toFixed(4)})`;
        b.plein.lastElementChild.style.opacity = lisse(0.4, 0.55, p).toFixed(3);
      }
    });
  };

  // Lissage court (0,1 s) : le mouvement suit le scroll sans à-coups
  let cible = scrollY; let courant = scrollY; let t0 = 0; let enCours = false;
  const image = (t) => {
    const dt = t0 ? Math.min(0.05, (t - t0) / 1000) : 0.016; t0 = t;
    courant += (cible - courant) * (1 - Math.exp(-dt / 0.1));
    if (Math.abs(cible - courant) < 0.3) courant = cible;
    peindre(courant);
    if (courant !== cible) requestAnimationFrame(image); else { enCours = false; t0 = 0; }
  };
  addEventListener('scroll', () => { cible = scrollY; if (!enCours) { enCours = true; requestAnimationFrame(image); } }, { passive: true });
  addEventListener('resize', () => { mesurer(); courant = cible = scrollY; peindre(courant); }, { passive: true });
  addEventListener('load', () => { mesurer(); peindre(scrollY); });
  mesurer(); peindre(scrollY);
}

/* Entrée du gabarit --------------------------------------------------------- */
export async function rendre(p) {
  dossier = p.dossier;
  POLICES.forEach((href) => {
    if (document.querySelector(`link[href="${href}"]`)) return;
    const l = document.createElement('link');
    l.rel = 'stylesheet';
    l.href = href;
    document.head.append(l);
  });
  installer(gabarit(p), 'page-ci');
  if (reduit) document.querySelector('.ci').classList.add('ci--statique');
}

export function animer() {
  suivi();
  videos();
  animerPage();
}
