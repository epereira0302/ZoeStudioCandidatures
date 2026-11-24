// Gabarit « Ne gardez que le meilleur des US » (Columbus Café, 2025), d’après
// la maquette d’Enzo (2026-11-16, 8 planches). Trois chapitres, chacun sur une
// rangée : sa fiche aubergine à gauche (client, année, titre, texte), qui défile
// avec ses visuels, et les visuels à droite.
// - Spot publicitaire : bandeau jaune où le slogan défile en boucle, le spot,
//   puis le film carré à côté de « Coffee shop français »
// - Campagne d’affichage : panneau 4 × 3, abribus, puis l’affiche bleue qui
//   reste en place pendant que les posts défilent à sa droite ; serviette et gobelet
// - Publicité web et magazine : Closer et Marmiton qui s’enchaînent dans la même
//   vue, comme un GIF ; les crédits en fin de fiche

import { videos, boucles } from './columbus.js?v=20261124g';
import { reduit } from '../commun.js';

let dossier = '';
const LARGE = '(min-width: 900px) 75vw, 100vw';

// Image en deux tailles (« -s » = moitié de la largeur)
const img = (nom, w, h, alt, sizes = LARGE, plus = '') => `<img src="${dossier}/${nom}-s.webp" srcset="${dossier}/${nom}-s.webp ${Math.round(w / 2)}w, ${dossier}/${nom}.webp ${w}w" sizes="${sizes}" width="${w}" height="${h}" alt="${alt}" loading="lazy" decoding="async"${plus}>`;
// Vidéo muette en boucle, lancée du début quand la moitié est à l’écran
// (columbus.js, videos : « data-cl-depart ») ; son au bouton. Ainsi les deux
// films ne tournent jamais ensemble au haut de la page : deux décodages vidéo
// simultanés coûtent la moitié des images sur les machines modestes.
const video = (nom, w, h, alt) => `<video muted loop playsinline preload="none" width="${w}" height="${h}" poster="${dossier}/${nom}-poster.webp" aria-label="${alt}" data-cl-video data-cl-depart><source src="${dossier}/${nom}.mp4" type="video/mp4"></video>
  <button class="us-son" type="button" aria-pressed="false" data-us-son><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z"/><path class="us-son__onde" d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11"/><path class="us-son__barre" d="M15.5 9.5l5 5M20.5 9.5l-5 5"/></svg><span>Son</span></button>`;

const SLOGAN = 'Ne gardez que le meilleur des US';

// Posts carrés de la colonne qui défile, à droite de l’affiche bleue
const POSTS = [
  ['post-massachusetts', 1100, 1101, 'Affiche Columbus sur fond jaune : « Enfin un café qui n’est pas un jus de Massachusetts. » Assemblage café bio 100 % arabica, torréfié en France, avec un expresso en verre'],
  ['post-late-shows', 1100, 1104, 'Affiche Columbus sur fond vert d’eau : « Les U.S. ont les meilleurs late shows. Nous avons les meilleurs latte chauds. » Boissons lactées au lait français certifié Bleu-Blanc-Cœur, avec un latte'],
  ['post-californie', 1100, 1097, 'Affiche Columbus sur fond vert : « Plus quali et fourni qu’en Californie. » Club-sandwichs préparés sur place et toastés minute, sur une assiette jaune'],
  ['post-palm-springs', 1100, 1100, 'Affiche Columbus sur fond vert d’eau : « Sans huile de Palm Springs. » Muffin cœur choco-noisette préparé sur place, sans huile de palme'],
];

// Fiche du chapitre : son texte (et, au dernier chapitre, les crédits) descend
// avec la page, collé sous l’en-tête, jusqu’à la fin du chapitre ; la fiche
// suivante prend alors le relais (CSS sticky, réglé par colle())
function fiche(p, chap, { titre = 'h2', avec = '', plus = '' } = {}) {
  return `<div class="us-fiche" data-theme="cl-encart">
     <div class="us-fiche__colle" data-us-colle>
      <div class="us-fiche__bloc">
        <dl class="cl-encart__haut">
          <div><dt>Client</dt><dd translate="no">${p.client}</dd></div>
          <div><dt>Année</dt><dd>${p.annee}</dd></div>
        </dl>
        <${titre} class="cl-encart__titre us-fiche__titre" translate="no">${p.nom || p.titre}</${titre}>
        <p class="cl-encart__sous">${chap.type}</p>
        <div class="cl-encart__texte us-fiche__texte">${chap.texte.map((t) => `<p>${t}</p>`).join('')}</div>
      </div>
      ${avec}
     </div>
      ${plus}
    </div>`;
}

function credits(liste) {
  if (!liste?.length) return '';
  return `<div class="cl-credits us-credits">
        <h2>Crédits</h2>
        ${liste.map((g) => `<h3>${g.titre}</h3>
        <ul>${(g.membres ?? []).map(([nom, role]) => `<li><span translate="no">${nom}</span> <i>${role}</i></li>`).join('')}${g.nom ? `<li translate="no">${g.nom}</li>` : ''}${(g.roles ?? []).map((r) => `<li><i>${r}</i></li>`).join('')}</ul>`).join('')}
      </div>`;
}

const fleche = '<a class="cl-encart__fleche us-fleche" href="#contenu" aria-label="Revenir en haut de la page">↑</a>';

function gabarit(p) {
  const [spot, affichage, web] = p.chapitres;
  const piste = Array.from({ length: 4 }, () => `<span>${SLOGAN}</span>`).join('');
  return `
<article class="us" data-us>
  <section class="us-chap" id="us-spot" aria-label="${spot.type}">
    ${fiche(p, spot, { titre: 'h1' })}
    <div class="us-visuels">
      <p class="us-bandeau" data-us-bandeau><span class="sr-only">${SLOGAN}</span><span class="us-bandeau__piste" aria-hidden="true">${piste}${piste}</span></p>
      <figure class="us-spot">${video('spot', 1920, 1080, 'Spot publicitaire Columbus Café « Ne gardez que le meilleur des U.S. » : dans un coffee shop, une jeune femme commande son latte, entourée de mots anglais traduits en jaune, « Habitudes matinales », « Pardon », « Parfait »')}</figure>
      <div class="us-duo">
        <figure class="us-carre">${video('film-carre', 720, 720, 'Film carré Columbus Café : un client au muffin choco-noisette, sous-titré « Ok, bye », avec les traductions « D’accord » et « Salut » en jaune')}</figure>
        <p class="us-coffee" translate="no">Coffee<br>shop<br>français</p>
      </div>
    </div>
  </section>
  <section class="us-chap" id="us-affichage" aria-label="${affichage.type}">
    ${fiche(p, affichage, { plus: fleche })}
    <div class="us-visuels">
      <figure>${img('panneau-californie', 2400, 1250, 'Panneau JCDecaux 4 × 3 sous le ciel : « Plus quali et fourni qu’en Californie. » Club-sandwichs préparés sur place et toastés minute par nos baristas')}</figure>
      <figure>${img('abribus', 2400, 1152, 'Deux abribus en ville : « Partagez un smoothie avec Caroline du Sud ou Nathalie du Nord », sur fond bleu, et « Les U.S. ont les meilleurs late shows. Nous avons les meilleurs latte chauds », sur fond vert d’eau')}</figure>
      <div class="us-defile" data-us-defile>
        <figure class="us-defile__fixe">${img('affiche-late-show', 1500, 1500, 'Affiche Columbus sur fond bleu ciel : « Les U.S. ont les meilleurs late show, nous avons les meilleurs latte chauds. » Un latte à la chantilly et aux éclats de spéculoos', '(min-width: 900px) 47vw, 62vw')}</figure>
        <ul class="us-defile__posts">
          ${POSTS.map(([n, w, h, alt]) => `<li>${img(n, w, h, alt, '(min-width: 900px) 29vw, 38vw')}</li>`).join('')}
        </ul>
      </div>
      <figure>${img('serviette-gobelet', 2400, 826, 'Serviette kraft « Yessuie can » posée sur un papier vert, et le gabarit à plat du gobelet bleu « Les U.S. ont les meilleurs late shows, nous avons les meilleurs latte chauds »')}</figure>
    </div>
  </section>
  <section class="us-chap" id="us-web" aria-label="${web.type}">
    ${fiche(p, web, { avec: credits(p.credits) })}
    <div class="us-visuels">
      <!-- Closer et Marmiton dans la même vue, qui s’enchaînent comme un GIF
           (boucle de columbus.js : arrêtée hors écran ; avec « réduire les
           animations », les deux visuels l’un sous l’autre) -->
      <div class="cl-boucle us-boucle" role="group" aria-label="La publicité dans Closer et sur Marmiton, en boucle" data-cl-boucle data-delai="2000" style="aspect-ratio: 2400 / 1554">
        <figure class="cl-boucle__img is-actif">${img('magazine', 2400, 1554, 'Le magazine Closer ouvert sur la page cuisine, face à la publicité Columbus : « Vos vacances sont trop courtes pour cuisiner. » 1 muffin acheté = 1 muffin offert sur présentation de cette pub')}</figure>
        <figure class="cl-boucle__img">${img('marmiton', 2400, 1554, 'Bannière Columbus sur la recette du gâteau au yaourt de Marmiton : « Vous pouvez rendre votre tablier. » 1 muffin acheté = 1 muffin offert avec le code FREEMUFFIN')}</figure>
      </div>
    </div>
  </section>
</article>`;
}

/* Entrée du gabarit --------------------------------------------------------- */
export async function rendre(p) {
  dossier = p.dossier;
  document.body.classList.add('page-cl', 'page-us');
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', '#200603');
  const main = document.querySelector('main');
  main.querySelectorAll('[data-projet-hero], [data-projet-intro], [data-projet="galerie"]').forEach((n) => n.remove());
  main.insertAdjacentHTML('afterbegin', gabarit(p));
  const header = document.querySelector('.header');
  delete header.dataset.fixeApres;
  header.dataset.on = 'cl-noir';
}

// Bandeau : le slogan défile en continu (CSS) ; arrêté hors écran pour ne rien
// calculer pour rien, et immobile avec « réduire les animations »
function bandeau() {
  const b = document.querySelector('[data-us-bandeau]');
  if (!b || reduit) return;
  new IntersectionObserver(([e]) => b.classList.toggle('est-arrete', !e.isIntersecting)).observe(b);
}

// Son des vidéos : un seul à la fois ; avec « réduire les animations », les
// commandes du lecteur prennent le relais (columbus.js, videos)
function son() {
  const boutons = [...document.querySelectorAll('[data-us-son]')];
  if (reduit) { boutons.forEach((b) => b.remove()); return; }
  boutons.forEach((b) => {
    const v = b.previousElementSibling;
    b.addEventListener('click', () => {
      const allume = v.muted;
      boutons.forEach((x) => {
        const autre = x.previousElementSibling;
        autre.muted = true;
        x.setAttribute('aria-pressed', 'false');
      });
      if (allume) {
        v.muted = false;
        b.setAttribute('aria-pressed', 'true');
        if (v.paused) v.play().catch(() => {});
      }
    });
    // Coupée quand elle sort de l’écran : le bouton revient à « muet »
    v.addEventListener('pause', () => {
      if (!v.muted) { v.muted = true; b.setAttribute('aria-pressed', 'false'); }
    });
  });
}

// Texte des fiches : collé sous l’en-tête pendant son chapitre. Plus haut que
// l’écran (fiche et crédits), il se cale sur le bas de l’écran pour être lu en
// entier avant de partir (un « top » négatif fait coller son bas)
function colle() {
  const blocs = [...document.querySelectorAll('[data-us-colle]')];
  const mobile = matchMedia('(max-width: 899px)');
  const regler = () => blocs.forEach((b) => {
    b.style.removeProperty('--us-colle');
    if (mobile.matches) return;
    const haut = parseFloat(getComputedStyle(b).top) || 0;
    const marge = parseFloat(getComputedStyle(b.parentElement).paddingBottom) || 0;
    const place = innerHeight - b.offsetHeight - marge;
    if (place < haut) b.style.setProperty('--us-colle', `${Math.round(place)}px`);
  });
  addEventListener('resize', regler, { passive: true });
  document.fonts?.ready.then(regler);
  regler();
}

export function animer() {
  colle();
  videos();
  boucles();
  bandeau();
  son();
}
