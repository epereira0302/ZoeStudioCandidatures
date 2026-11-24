// Gabarit « C’est le moment » (Columbus Café), d’après la maquette d’Enzo du
// 2026-10-25 : un encart aubergine fixe à gauche (infos, texte, menu des
// chapitres, puis crédits en fin de page), les visuels bord à bord à droite.
// Versions précédentes : branches sauvegarde-columbus-v4 et sauvegarde-columbus-v5.

import { reduit, signalerBloquee } from '../commun.js';

let dossier = '';
// Largeur des fichiers « -s » (versions légères) quand elle n’est pas de 900 px
const LEGERES = {};
const LARGE = '(min-width: 900px) 75vw, 100vw';
const DEMI = '(min-width: 900px) 38vw, 100vw';
const TIERS = '(min-width: 900px) 25vw, 50vw';

function img(nom, w, h, alt, sizes = LARGE) {
  const s = LEGERES[nom] ?? 900;
  const srcset = s >= w ? `${dossier}/${nom}.webp ${w}w` : `${dossier}/${nom}-s.webp ${s}w, ${dossier}/${nom}.webp ${w}w`;
  return `<img src="${dossier}/${nom}-s.webp" srcset="${srcset}" sizes="${sizes}" width="${w}" height="${h}" alt="${alt}" loading="lazy" decoding="async">`;
}
// Image dont la version légère n’a pas la largeur par défaut
const img2 = (nom, w, h, s, alt, sizes = LARGE) => `<img src="${dossier}/${nom}-s.webp" srcset="${dossier}/${nom}-s.webp ${s}w, ${dossier}/${nom}.webp ${w}w" sizes="${sizes}" width="${w}" height="${h}" alt="${alt}" loading="lazy" decoding="async">`;

// Vidéo muette, lue en boucle quand elle est à l’écran
const video = (nom, w, h, alt) => `<video muted loop playsinline preload="none" width="${w}" height="${h}" poster="${dossier}/${nom}-poster.webp" aria-label="${alt}" data-cl-video><source src="${dossier}/${nom}.mp4" type="video/mp4"></video>`;

// Visuel bord à bord qui se pose au scroll (106 % → 100 %)
const z = (contenu, { classe = '', theme = '' } = {}) => `<figure class="cl-z ${classe}"${theme ? ` data-theme="${theme}"` : ''}>${contenu}</figure>`;
// Visuel détouré, centré dans une case de couleur
const caseFond = (fond, contenu, classe = '') => `<figure class="cl-case cl-case--${fond} ${classe}">${contenu}</figure>`;

const CHAPITRES = [
  ['cl-logo', 'Logo'],
  ['cl-couleurs', 'Couleurs'],
  ['cl-typos', 'Typographies'],
  ['cl-icono', 'Iconographie'],
  ['cl-ton', 'Ton de voix'],
  ['cl-photo', 'Photographie'],
  ['cl-applications', 'Applications'],
];

// Couleurs boissons, puis le brun café (large) et le jaune muffin
const BANDES = [
  ['Infusion', '#0A616E', 'is-sombre'], ['Thé vert', '#EDE99E'], ['Chocolat', '#904731', 'is-sombre'], ['Thé au lait', '#F18F1B'],
  ['Café au lait', '#F5B1B5'], ['Lait', '#FFFBF5'], ['Thé', '#FFF1D6'], ['Soda', '#FFD57B'],
  ['Brun café', '#221718', 'is-sombre cl-bandes__large'], ['Jaune muffin', '#FAB900', 'cl-bandes__large'],
];

const PARFUMS = [
  ['parfum-myrtille', 'Myrtille : latte aux myrtilles et gros plan de myrtilles'],
  ['parfum-caramel', 'Caramel : nappage caramel et boisson au caramel, pop-corn et muffin'],
  ['parfum-chantilly', 'Chantilly pailletée : chocolat chaud, chantilly, sucre d’orge et donut'],
  ['parfum-gateau', 'Gâteau gourmand : marbré crème et chocolat, une part dégustée à la cuillère'],
  ['parfum-pistache', 'Pistache : crème de pistache et boisson à la pistache'],
];
const TON = [
  ['ton-de-voix-1', 'Ton de voix : « C’est le moment de se poser 5 minutes. Pendant 2 heures. » (BtoC, expérience) et « Faire mousser nos lattes avec du lait français, c’est le moment » (BtoB, entreprise française engagée)'],
  ['ton-de-voix-2', 'Ton de voix : « Choisir des ingrédients responsables et gourmands, c’est le moment » (BtoB) et « C’est le moment du coco matcha. » (BtoC, innovation)'],
];
// Photos de la marque, en bande qui défile de droite à gauche
const PHOTOS = [
  'Salade, boisson glacée et muffin sur une table orange',
  'Citronnade posée sur la banquette en cuir',
  'Un latte tenu à deux mains',
  'Chocolat viennois et latte à l’ourson sur fond jaune',
  'Milkshake au caramel, nappé de miel',
  'Bagel garni coupé en deux sur une nappe vichy',
  'Deux amies partagent un sandwich au café',
  'Bagel sur une assiette, fond orange et rouge',
  'Boissons violettes et donut, lettres « Nouveau »',
  'Muffins garnis à la cuillère dans le moule',
  'Muffins, cookie et matcha sur une table ronde',
  'Club sandwich, muffin et boisson verte sur fond bleu nuit',
  'Espresso et croissant au soleil',
  'Milkshake au crumble tenu à la main',
  'Deux cafés glacés sur une table orange',
  'Machine à espresso',
  'Moulin à café et porte-filtre',
  'Lait versé dans un café glacé',
].map((alt, i) => [`photo-${String(i + 1).padStart(2, '0')}`, alt]);
const ECRANS = [
  ['site-3', 'Réseaux : « Plus on est d’ours, plus on rit ! », fond rose'],
  ['site-1', 'Accueil : « C’est le moment de savourer un bon café », fond jaune'],
  ['site-2', 'Menu : les boissons et « On se suit ? », fond noir'],
  ['site-4', 'Boutique : la fiche du kit à cookie, fond bleu clair'],
];
// Cases de la carte de fidélité : centres dans la planche de 8000 × 4500 px
const CASES = [3136, 3711, 4286, 4861].flatMap((x) => [[x, 2895], [x, 3353]]).sort((a, b) => a[1] - b[1] || a[0] - b[0]);

// Images qui s’enchaînent comme un GIF (immobiles avec « réduire les animations »)
// Avec « deux » : l’image est coupée en deux volets ; la suivante arrive
// d’abord à gauche puis à droite (vidéo de référence d’Enzo)
function boucle(id, images, delai, { w, h, s }, libelle, deux = false) {
  const contenu = (f, alt) => (deux
    ? `<span class="cl-boucle__volet cl-boucle__volet--g">${img2(f, w, h, s, alt)}</span><span class="cl-boucle__volet cl-boucle__volet--d" aria-hidden="true">${img2(f, w, h, s, '')}</span>`
    : img2(f, w, h, s, alt));
  return `<div class="cl-boucle${deux ? ' cl-boucle--deux' : ''}" id="${id}" role="group" aria-label="${libelle}" data-cl-boucle data-delai="${delai}"${deux ? ' data-deux' : ''} style="aspect-ratio: ${w} / ${h}">
        ${images.map(([f, alt], i) => `<figure class="cl-boucle__img${i === 0 ? ' is-actif is-g is-d' : ''}">${contenu(f, alt)}</figure>`).join('')}
      </div>`;
}

// Bande de photos qui défile en continu ; la liste est doublée pour boucler
// sans à-coup (la copie est cachée aux lecteurs d’écran)
function defile(photos, libelle) {
  const liste = (copie) => photos.map(([f, alt]) => `<li>${img2(f, 800, 1200, 400, copie ? '' : alt, '(min-width: 900px) 18vw, 45vw')}</li>`).join('');
  return `<div class="cl-defile" role="group" aria-label="${libelle}" data-cl-photos>
        <ul class="cl-defile__piste">${liste(false)}${liste(true).replace(/<li>/g, '<li aria-hidden="true">')}</ul>
      </div>`;
}

// Crédits : dans l’encart en fin de page, et sous les visuels sur mobile
function credits(c) {
  if (!c) return '';
  const liste = (t) => `<ul>${t.map((x) => `<li>${x}</li>`).join('')}</ul>`;
  return `<h2 class="cl-credits__titre">Crédits</h2>
        <h3>Équipe</h3>${liste(c.equipe)}
        <h3>Services</h3>${liste(c.services)}
        <h3>Collaboration</h3><ul><li>${c.collaboration.nom}</li>${c.collaboration.roles.map((r) => `<li><em>${r}</em></li>`).join('')}</ul>`;
}

function gabarit(p) {
  const menu = (classe) => CHAPITRES.map(([id, nom]) => `<a class="${classe}" href="#${id}" data-chap="${id}">${nom}</a>`);
  return `
<article class="cl" data-cl>
  <aside class="cl-encart" aria-label="Le projet" data-cl-encart>
   <div class="cl-encart__defile" data-cl-defile>
    <dl class="cl-encart__haut">
      <div><dt>Client</dt><dd translate="no">${p.client}</dd></div>
      <div><dt>Année</dt><dd>${p.annee}</dd></div>
    </dl>
    <h1 class="cl-encart__titre">${p.nom}</h1>
    <p class="cl-encart__sous">Refonte charte graphique</p>
    <p class="cl-encart__texte">${p.description}</p>
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

  <div class="cl-visuels" data-cl-visuels>
    <section class="cl-chap" id="cl-logo" aria-label="Logo">
      <div class="cl-bascule" data-theme="cl-noir" data-cl-bascule data-version="0">
        <figure class="cl-bascule__img is-actif">${img2('logo-jaune-blanc', 2400, 1350, 1200, 'Version jaune et blanc : « C’est le moment » en blanc sur jaune, le logo jaune sur blanc').replace('loading="lazy"', 'fetchpriority="high"')}</figure>
        <figure class="cl-bascule__img">${img2('logo-noir-jaune', 2400, 1350, 1200, 'Version noir et jaune : « C’est le moment » en jaune sur noir, le logo noir sur jaune')}</figure>
        <div class="cl-mode" role="group" aria-label="Version du logo">
          <span class="cl-mode__pouce" aria-hidden="true"></span>
          <button class="cl-mode__btn" type="button" aria-pressed="true" data-cl-mode="0"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2.5v2.5M12 19v2.5M2.5 12H5M19 12h2.5M5.3 5.3l1.8 1.8M16.9 16.9l1.8 1.8M5.3 18.7l1.8-1.8M16.9 7.1l1.8-1.8"/></svg>Mode clair</button>
          <button class="cl-mode__btn" type="button" aria-pressed="false" data-cl-mode="1"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/></svg>Mode sombre</button>
        </div>
      </div>
      <div class="cl-comparer" data-theme="cl-blanc" data-cl-comparer style="--pos: 50%">
        <figure class="cl-comparer__cote">${img2('logo-nouveau-aligne', 1200, 1200, 600, 'Nouveau logo : l’ourson redessiné, « Columbus Café » sans le « & Co »', DEMI)}</figure>
        <figure class="cl-comparer__cote cl-comparer__cote--avant">${img2('logo-ancien-aligne', 1200, 1200, 600, 'Ancien logo : l’ourson et « columbus Café & Co »', DEMI)}</figure>
        <span class="cl-pastille cl-comparer__libelle cl-comparer__libelle--avant" aria-hidden="true">Avant</span>
        <span class="cl-pastille cl-comparer__libelle cl-comparer__libelle--apres" aria-hidden="true">Après</span>
        <span class="cl-comparer__barre" aria-hidden="true"><span class="cl-comparer__poignee"></span></span>
        <input class="cl-comparer__curseur" type="range" min="0" max="100" value="50" step="1" aria-label="Comparer l’ancien et le nouveau logo : à gauche l’ancien, à droite le nouveau" data-cl-comparer-curseur>
      </div>
      <div class="cl-g3" data-theme="cl-jaune">
        ${caseFond('jaune', img('logo-sur-jaune', 960, 960, 'Logo Columbus Café en noir sur fond jaune', TIERS))}
        ${caseFond('blanc', img('logo-sur-blanc', 960, 960, 'Logo Columbus Café : ourson jaune, nom en noir, sur fond blanc', TIERS))}
        ${z(video('video-logo-trace', 900, 900, 'Animation : l’ourson Columbus se dessine trait par trait'), { classe: 'cl-carre' })}
      </div>
    </section>

    <section class="cl-chap" id="cl-couleurs" aria-label="Couleurs" data-theme="cl-noir">
      <ul class="cl-bandes">
        ${BANDES.map(([n, c, classe = '']) => `<li class="${classe}" style="--c:${c}"><span>${n}</span></li>`).join('')}
      </ul>
    </section>

    <section class="cl-chap" id="cl-typos" aria-label="Typographies">
      <div class="cl-g2 cl-g2--empile">
        <div class="cl-moitie" data-theme="cl-jaune">
          <p class="cl-moitie__ent"><span>Typographie</span><span>Ofelia</span></p>
          ${img('typo-ofelia', 2000, 799, 'Spécimen de l’Ofelia Display Ultrabold', DEMI)}
          <h2 class="cl-moitie__titre">Les titres</h2>
          <p>Ofelia Display, en UltraBold et uniquement en majuscules, pour les titres et les accroches.</p>
        </div>
        <div class="cl-moitie" data-theme="cl-creme">
          <p class="cl-moitie__ent"><span>Typographie</span><span>Liebling</span></p>
          ${img('typo-liebling', 2000, 1186, 'Spécimen de la Liebling en Regular, Medium, Bold et Black', DEMI)}
          <h2 class="cl-moitie__titre">Le texte courant</h2>
          <p>Liebling, en Regular, Medium, Bold et Black, pour tout ce qui se lit : menus, textes, mentions.</p>
        </div>
      </div>
      ${z(video('video-liebling', 1280, 720, 'Animation du spécimen Liebling : Café, Matcha, Élixir, Cœur coulant'), { theme: 'cl-noir' })}
    </section>

    <section class="cl-chap" id="cl-icono" aria-label="Iconographie">
      <figure class="cl-pictos" data-theme="cl-noir">${img('iconographie', 1515, 457, 'Quatre pictogrammes jaunes pleins : un gobelet, un muffin, un verre et une viennoiserie')}</figure>
      <div class="cl-g2" data-theme="cl-blanc">
        ${caseFond('blanc', img('pastilles', 1362, 1155, 'Pastilles jaunes : ourson, 3+1 muffins offert, nouveau cœur coulant', DEMI))}
        ${caseFond('creme', img('cocarde', 1209, 627, 'Un muffin et la cocarde « Columbus Café est une entreprise française »', DEMI))}
      </div>
    </section>

    <section class="cl-chap" id="cl-ton" aria-label="Ton de voix">
      <div class="cl-g2" data-theme="cl-blanc">
        ${caseFond('blanc', img('texte-cest-le-moment', 2000, 1628, 'Accroche « C’est le moment d’aimer le lundi matin » : le début en Ofelia, la fin en Liebling', DEMI))}
        ${caseFond('jaune', img('mise-en-page-texte', 1998, 2827, 'Affiche « C’est le moment » sur fond rayé, ourson jaune en bas à droite', DEMI))}
      </div>
      <div data-theme="cl-blanc">${boucle('cl-ton', TON, 1600, { w: 2400, h: 1052, s: 1200 }, 'Le ton de voix, en boucle')}</div>
      <div class="cl-g2" data-theme="cl-noir">
        ${z(img2('coffee-shop', 1200, 1350, 600, 'Un coffee shop Columbus Café & Co à l’angle d’un immeuble en pierre, des clients en terrasse', DEMI), { classe: 'cl-carre' })}
        ${z(video('video-villes', 900, 900, 'Animation : « Columbus Café, premier coffee shop français », puis les villes jusqu’à Paris'), { classe: 'cl-carre' })}
      </div>
      ${z(img2('texture-typo', 2400, 1350, 1200, 'Trois textures gourmandes, caramel, praliné et chocolat, signées « C’est le moment » en blanc'), { theme: 'cl-noir' })}
    </section>

    <section class="cl-chap" id="cl-photo" aria-label="Photographie">
      <div data-theme="cl-noir">${boucle('cl-parfums', PARFUMS, 1150, { w: 2400, h: 1350, s: 1200 }, 'Les parfums du muffin, en boucle', true)}</div>
      <div data-theme="cl-jaune">${defile(PHOTOS, 'Photographies de la marque, en défilement')}</div>
      ${z(img2('affiche', 2400, 1350, 1200, 'Deux affiches : « C’est le moment de craquer. 4 fois. » avec la boîte de 3+1 muffins, et « C’est le moment de briser des cœurs. » avec le nouveau cœur coulant'), { theme: 'cl-noir' })}
      ${z(img2('muffin-sur-place', 2400, 1350, 1200, 'Muffins préparés sur place : garniture à la cuillère, trois vues du moule'), { theme: 'cl-blanc' })}
    </section>

    <section class="cl-chap" id="cl-applications" aria-label="Applications">
      <div class="cl-incite" data-theme="cl-jaune">
        <p class="cl-incite__piste"><span>Cliquez sur les cases pour tamponner la carte</span>${'<span aria-hidden="true">Cliquez sur les cases pour tamponner la carte</span>'.repeat(7)}</p>
      </div>
      <div class="cl-carte" data-theme="cl-noir" data-cl-carte>
        <div class="cl-carte__fenetre">
          <div class="cl-carte__planche">
            ${img2('fidelite-carte', 2400, 1350, 1200, 'Carte de fidélité jaune « C’est le moment de craquer pour la bonne cause. Votre gourmandise se récompense. », posée sur une mousse de café', '(min-width: 900px) 75vw, 290vw')}
            <ol class="cl-carte__cases" aria-label="Cases de la carte de fidélité, à tamponner">
              ${CASES.map(([x, y], i) => `<li style="--x:${(x / 80).toFixed(3)}%; --y:${(y / 45).toFixed(3)}%"><button class="cl-carte__case" type="button" aria-pressed="${i < 3}" aria-label="Case ${i + 1}" data-cl-case><span class="cl-carte__tampon" aria-hidden="true"></span></button></li>`).join('')}
            </ol>
          </div>
        </div>
        <p class="cl-pastille cl-carte__statut" role="status" data-cl-carte-statut></p>
        <button class="cl-pastille cl-carte__reset" type="button" data-cl-carte-reset hidden>Recommencer</button>
      </div>
      <figure class="cl-case cl-case--blanc cl-case--bande" data-theme="cl-blanc">${img2('porte-gobelets', 2400, 746, 1200, 'Trois porte-gobelets jaunes : « C’est le moment », l’ourson, et la version à plat')}</figure>
      <div class="cl-g3" data-theme="cl-noir">
        ${caseFond('noir', img('sac-emporter', 2000, 1243, 'Sacs à emporter kraft, ourson et cases à cocher', TIERS))}
        ${caseFond('jaune', img('tablier', 1531, 2131, 'Tablier noir avec l’ourson jaune', TIERS))}
        ${caseFond('noir', img('sachets', 1366, 1078, 'Sachets viennoiserie jaunes, signature et ourson', TIERS))}
      </div>
      <figure class="cl-fixe" data-theme="cl-blanc">${img2('bache-travaux', 2400, 1350, 1200, 'Bâche de travaux, recrutement barista : « C’est le moment de partager ta bonne humeur (et ton talent) », l’ourson en grand, la devanture noire')}</figure>
      <div data-theme="cl-rose">${boucle('cl-ecrans', ECRANS, 1400, { w: 1920, h: 1080, s: 960 }, 'Les écrans du site, en boucle')}</div>
    </section>

    <div class="cl-credits cl-credits--mobile" data-theme="cl-encart">${credits(p.credits)}</div>
  </div>
</article>`;
}

/* Comportements ------------------------------------------------------------- */

// Chapitre en cours (italique dans le menu), contenu de l’encart qui défile
// au rythme du projet (des infos jusqu’aux crédits), visuels qui se posent au scroll
// Partagé avec les autres gabarits à encart (studio-zoe.js) : les chapitres
// sont ceux du menu de l’encart
export function suivi() {
  const encart = document.querySelector('[data-cl-encart]');
  const defile = document.querySelector('[data-cl-defile]');
  const article = document.querySelector('[data-cl]');
  const repere = document.querySelector('[data-cl-repere]');
  const chapitres = [...encart.querySelectorAll('.cl-encart__menu [data-chap]')].map((a) => document.getElementById(a.dataset.chap));
  const liens = [...document.querySelectorAll('[data-chap]')];
  const zooms = [...document.querySelectorAll('.cl-z')];
  const mobile = matchMedia('(max-width: 899px)');
  let actif;
  let course = 0; // hauteur du contenu de l’encart qui dépasse de l’écran
  const mesurer = () => { course = mobile.matches ? 0 : Math.max(0, defile.scrollHeight - encart.clientHeight); };
  const maj = () => {
    // 1. Lectures
    const h = innerHeight;
    let cur = null;
    chapitres.forEach((c) => { if (c.getBoundingClientRect().top < h * 0.3) cur = c.id; });
    const art = course ? article.getBoundingClientRect() : null;
    const echelles = reduit ? [] : zooms.map((f) => {
      const r = f.getBoundingClientRect();
      if (r.bottom < 0 || r.top > h) return null;
      return (1.06 - 0.06 * Math.min(1, Math.max(0, (h - r.top) / (h * 0.8)))).toFixed(4);
    });
    // 2. Écritures
    if (cur !== actif) {
      actif = cur;
      liens.forEach((a) => (a.dataset.chap === cur ? a.setAttribute('aria-current', 'true') : a.removeAttribute('aria-current')));
      encart.classList.toggle('a-un-actif', !!cur);
      // Mobile : le raccourci du chapitre reste visible dans le bandeau
      const a = repere.querySelector('[aria-current]');
      if (a && mobile.matches) repere.scrollTo({ left: a.offsetLeft - (repere.clientWidth - a.offsetWidth) / 2, behavior: reduit ? 'auto' : 'smooth' });
    }
    // Le texte de l’encart descend avec la page et reste à l’écran pendant tout
    // le projet ; à la fin seulement, il remonte au rythme du scroll pour laisser
    // voir les crédits, puis la page suivante prend le relais (même effet que
    // les fiches de « Ne gardez que le meilleur des US »)
    if (art) {
      const reste = art.bottom - h; // ce qu’il reste de l’article sous l’écran
      const monte = Math.min(course, Math.max(0, course - reste));
      defile.style.transform = `translate3d(0, ${(-monte).toFixed(1)}px, 0)`;
    } else defile.style.transform = '';
    echelles.forEach((v, i) => { if (v) zooms[i].style.setProperty('--s', v); });
  };
  let attente = false;
  addEventListener('scroll', () => { if (!attente) { attente = true; requestAnimationFrame(() => { attente = false; maj(); }); } }, { passive: true });
  addEventListener('resize', () => { mesurer(); maj(); }, { passive: true });
  document.fonts?.ready.then(() => { mesurer(); maj(); });
  mesurer();
  maj();
}

// Avant / après : le curseur (input range) règle la position de la barre
function comparer() {
  const bloc = document.querySelector('[data-cl-comparer]');
  const curseur = bloc?.querySelector('[data-cl-comparer-curseur]');
  if (!curseur) return;
  const maj = () => {
    bloc.style.setProperty('--pos', `${curseur.value}%`);
    curseur.setAttribute('aria-valuetext', `${curseur.value} % ancien logo, ${100 - curseur.value} % nouveau`);
  };
  curseur.addEventListener('input', maj);
  maj();
}

// Logo jaune et blanc / noir et jaune : interrupteur mode clair, mode sombre
function bascule() {
  const bloc = document.querySelector('[data-cl-bascule]');
  if (!bloc) return;
  const figures = bloc.querySelectorAll('.cl-bascule__img');
  const boutons = bloc.querySelectorAll('[data-cl-mode]');
  boutons.forEach((b) => b.addEventListener('click', () => {
    const v = Number(b.dataset.clMode);
    bloc.dataset.version = String(v);
    figures.forEach((f, i) => f.classList.toggle('is-actif', i === v));
    boutons.forEach((x, i) => x.setAttribute('aria-pressed', String(i === v)));
  }));
}

// Vidéos : lecture quand elles sont à l’écran, pause sinon ; avec « réduire
// les animations », pas de lecture automatique mais les commandes du lecteur
export function videos() {
  const liste = document.querySelectorAll('[data-cl-video]');
  if (reduit) {
    liste.forEach((v) => {
      v.controls = true;
      v.preload = 'metadata';
      // Immobile sur l’image du logo fini plutôt que sur la première image, vide
      if (!v.dataset.clRepli) return;
      const fige = () => { v.currentTime = Number(v.dataset.clRepli); };
      if (v.readyState >= 2) fige(); else v.addEventListener('loadeddata', fige, { once: true });
    });
    return;
  }
  // Muette par la propriété aussi : sans elle, Safari peut refuser la lecture automatique
  liste.forEach((v) => { v.muted = true; v.defaultMuted = true; });
  // Chargement seulement à l’approche (un écran avant) : avant, toutes les vidéos
  // de la page partaient dès l’ouverture (6,9 Mo sur Glowy Winter)
  const approche = new IntersectionObserver((entrees, obs) => entrees.forEach((e) => {
    if (!e.isIntersecting) return;
    const v = e.target;
    v.autoplay = !('clDepart' in v.dataset);
    v.preload = 'auto';
    obs.unobserve(v);
  }), { rootMargin: '100% 0px' });
  liste.forEach((v) => approche.observe(v));
  const lancer = (v) => v.play().catch((err) => {
    // Lecture refusée (mode économie d’énergie…) : on montre l’image du logo fini,
    // les commandes du lecteur, et la vidéo repart au premier geste sur la page
    if (err.name === 'NotAllowedError') {
      if (v.dataset.clRepli) v.currentTime = Number(v.dataset.clRepli);
      signalerBloquee(v, !v.dataset.clRepli);
    } else if (err.name === 'AbortError') {
      // Lecture interrompue pendant le chargement (Safari) : on réessaie dès que possible
      v.addEventListener('canplay', () => { if (v.paused && v.getBoundingClientRect().bottom > 0) v.play().catch(() => {}); }, { once: true });
    }
  });
  // Lancée un peu avant d’arriver à l’écran
  const io = new IntersectionObserver((entrees) => entrees.forEach((e) => {
    if (e.isIntersecting) lancer(e.target); else e.target.pause();
  }), { threshold: 0, rootMargin: '15% 0px' });
  // « data-cl-depart » : repart du début quand elle est bien à l’écran (la moitié
  // de la vidéo, ou la moitié de l’écran pour une grande vidéo sur un petit écran),
  // puis tourne en boucle tant qu’on la voit. Arrivée depuis une couverture animée :
  // elle reprend où en était la couverture (« data-cl-reprise »), pas au début.
  const depart = new IntersectionObserver((entrees) => entrees.forEach((e) => {
    const v = e.target;
    const vue = e.intersectionRatio >= 0.5 || e.intersectionRect.height >= innerHeight * 0.5;
    if (vue) {
      if (v.paused) {
        if (!('clReprise' in v.dataset)) v.currentTime = 0;
        delete v.dataset.clReprise;
        lancer(v);
      }
    } else if (e.intersectionRatio === 0) v.pause();
  }), { threshold: [0, 0.25, 0.5, 0.75, 1] });
  liste.forEach((v) => ('clDepart' in v.dataset ? depart : io).observe(v));
}

// Images en boucle (parfums, écrans du site) : arrêt hors écran ou au bouton ;
// arrêtées d’office avec « réduire les animations »
export function boucles() {
  document.querySelectorAll('[data-cl-boucle]').forEach((bloc) => {
    const figures = [...bloc.querySelectorAll('.cl-boucle__img')];
    const delai = Number(bloc.dataset.delai) || 1000;
    const deux = 'deux' in bloc.dataset;
    let volet = 0;
    let i = 0;
    let minuteur = 0;
    let visible = false;
    const pause = reduit;
    const regler = () => {
      clearInterval(minuteur);
      if (visible && !pause) {
        minuteur = setInterval(() => {
          const avant = figures[i];
          i = (i + 1) % figures.length;
          const apres = figures[i];
          avant.classList.remove('is-actif');
          apres.classList.add('is-actif');
          if (!deux) return;
          // Volet gauche tout de suite, volet droit un peu après
          avant.classList.remove('is-g');
          apres.classList.add('is-g');
          clearTimeout(volet);
          volet = setTimeout(() => { avant.classList.remove('is-d'); apres.classList.add('is-d'); }, delai * 0.4);
        }, delai);
      }
    };
    // Les images se chargent avant d’arriver, pour que la boucle ne clignote pas
    new IntersectionObserver((entrees, io) => entrees.forEach((e) => {
      if (!e.isIntersecting) return;
      figures.forEach((f) => f.querySelectorAll('img').forEach((im) => { im.loading = 'eager'; }));
      io.disconnect();
    }), { rootMargin: '100% 0px' }).observe(bloc);
    new IntersectionObserver((entrees) => entrees.forEach((e) => { visible = e.isIntersecting; regler(); }), { threshold: 0.3 }).observe(bloc);
  });
}

// Bande de photos : défile sans arrêt ; images chargées avant d’arriver
function defiles() {
  document.querySelectorAll('[data-cl-photos]').forEach((bloc) => {
    // Immobile, la bande se parcourt à la main : elle doit pouvoir prendre le focus
    if (reduit) bloc.tabIndex = 0;
    new IntersectionObserver((entrees, io) => entrees.forEach((e) => {
      if (!e.isIntersecting) return;
      bloc.querySelectorAll('img').forEach((im) => { im.loading = 'eager'; });
      io.disconnect();
    }), { rootMargin: '100% 0px' }).observe(bloc);
  });
}

// Carte de fidélité : chaque case vide se tamponne d’un clic ; à huit,
// le muffin est offert et la carte peut repartir de zéro
function carte() {
  const bloc = document.querySelector('[data-cl-carte]');
  if (!bloc) return;
  const cases = [...bloc.querySelectorAll('[data-cl-case]')];
  const statut = bloc.querySelector('[data-cl-carte-statut]');
  const reset = bloc.querySelector('[data-cl-carte-reset]');
  const pleines = () => cases.filter((c) => c.getAttribute('aria-pressed') === 'true').length;
  const dire = () => {
    const reste = cases.length - pleines();
    statut.textContent = reste ? `Encore ${reste} tampon${reste > 1 ? 's' : ''} avant le muffin offert` : 'Carte complète : le muffin est offert';
    reset.hidden = reste > 0;
    bloc.classList.toggle('is-complete', !reste);
  };
  cases.forEach((c) => {
    // Chaque tampon est posé un peu de travers, comme à la main
    c.querySelector('.cl-carte__tampon').style.setProperty('--r', `${Math.round(Math.random() * 30 - 15)}deg`);
    c.addEventListener('click', () => {
      if (c.getAttribute('aria-pressed') === 'true') return;
      c.setAttribute('aria-pressed', 'true');
      dire();
      if (!reset.hidden) reset.focus();
    });
  });
  reset.addEventListener('click', () => {
    cases.forEach((c) => c.setAttribute('aria-pressed', 'false'));
    dire();
    cases[0].focus();
  });
  dire();
}

/* Entrée du gabarit --------------------------------------------------------- */
export async function rendre(p) {
  dossier = p.dossier;
  document.body.classList.add('page-cl');
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', '#200603');
  const main = document.querySelector('main');
  main.querySelectorAll('[data-projet-hero], [data-projet-intro], [data-projet="galerie"]').forEach((n) => n.remove());
  main.insertAdjacentHTML('afterbegin', gabarit(p));
  // L’en-tête reste affiché sur toute la largeur, aubergine (voir le CSS)
  const header = document.querySelector('.header');
  delete header.dataset.fixeApres;
  header.dataset.on = 'cl-noir';
  // Sur mobile, l’encart est en haut de page : l’en-tête prend sa couleur
  const encart = main.querySelector('[data-cl-encart]');
  const mobile = matchMedia('(max-width: 899px)');
  const theme = () => { if (mobile.matches) encart.dataset.theme = 'cl-encart'; else delete encart.dataset.theme; };
  theme();
  mobile.addEventListener('change', () => { theme(); dispatchEvent(new Event('resize')); });
}

export function animer() {
  suivi();
  comparer();
  bascule();
  videos();
  boucles();
  defiles();
  carte();
  // L’en-tête relit les fonds des blocs maintenant qu’ils existent
  dispatchEvent(new Event('resize'));
}
