// Gabarit « Coupe du monde 2026 » (série photographique, France – Espagne).
// Même structure que les autres projets : encart aubergine à gauche, visuels à
// droite, sur fond papier. Mise en page validée par Enzo le 24/11/2026 (d’après
// sa référence « spring nails trends ») et reprise pour tout le projet :
// planches de cinq photos numérotées, l’une débordant du cadre, en deux
// compositions alternées (P, et Q en miroir). Entre les planches, des images en
// grand (et la boucle du tacle) relancent la lecture. Numérotation continue de
// 01 à 29. Les 28 photos et la boucle sont toutes montrées ; deux photos presque
// identiques ne sont jamais voisines ; le projet ne commence pas par une vidéo.
// Mouvement discret, piloté par le scroll : apparition, légère parallaxe, zoom
// arrière des images en grand. Rien ne bouge avec « réduire les animations ».

import { suivi, videos } from './columbus.js?v=20261124g';
import { encart, installer } from './krispy-commun.js?v=20261124g';
import { reduit } from '../commun.js';

let dossier = '';

// Photos : nom, largeur, hauteur, description
const PHOTOS = Object.fromEntries([
  ['espagne-pelouse', 2400, 1600, 'Joueur espagnol en maillot blanc, de profil sur la pelouse'],
  ['espagne-regard', 2400, 1600, 'Visage d’un joueur espagnol, bandeau dans les cheveux, regard de côté'],
  ['france-profil', 2400, 1600, 'Profil d’un joueur français en maillot bleu, saisi dans le flou'],
  ['duel-16', 2400, 1600, 'Duel entre le numéro 16 espagnol et un joueur français, ballon au pied'],
  ['duel-16-course', 2400, 1600, 'Le numéro 16 espagnol lancé face à un défenseur français'],
  ['crampon-rose', 2400, 1600, 'Jambe d’un joueur espagnol en short rouge, crampon rose, en plein élan'],
  ['france-7-dos', 2400, 1600, 'Dos du numéro 7 français, maillot bleu, en mouvement'],
  ['terrain-vue-large', 2400, 1600, 'Vue large du terrain, joueurs des deux équipes dispersés sur la pelouse'],
  ['duel-flou', 2400, 1600, 'Deux joueurs à la lutte, le mouvement étiré par le flou'],
  ['france-course', 2400, 1600, 'Joueur français en course, seul près du rond central'],
  ['bleus-groupe', 2400, 1600, 'Joueurs français de dos, les numéros 7 et 10 au milieu du groupe'],
  ['bleus-arbitre', 1600, 2400, 'Joueurs français autour de l’arbitre, avant une reprise de jeu'],
  ['accolade-15', 2400, 1600, 'Joueurs espagnols dans une accolade, le numéro 15 de dos'],
  ['accolade-15-serree', 2400, 1600, 'Accolade espagnole, le numéro 15 serré contre ses coéquipiers'],
  ['accolade-15-proche', 2400, 1600, 'Accolade des Espagnols, vue rapprochée'],
  ['joie-21', 2400, 1600, 'Joie espagnole autour du numéro 21, bras levés'],
  ['oyarzabal-21', 2400, 1600, 'Le numéro 21, Oyarzabal, de dos parmi ses coéquipiers'],
  ['oyarzabal-terrain', 2400, 1600, 'Oyarzabal, numéro 21, de dos face au terrain'],
  ['oyarzabal-public', 2400, 1600, 'Oyarzabal de dos, le public en arrière-plan'],
  ['oyarzabal-index', 2400, 1600, 'Oyarzabal lève l’index, maillot blanc numéro 21'],
  ['espagne-regard-fixe', 2400, 1600, 'Joueur espagnol au regard fixe, entouré de joueurs en mouvement'],
  ['france-ballon', 2400, 1600, 'Joueur français, ballon au pied, devant un adversaire'],
  ['duel-ballon', 2400, 1600, 'Duel au ballon entre un Espagnol et un Français'],
  ['mbappe-dos', 2400, 1600, 'Kylian Mbappé de dos, maillot bleu floqué de son nom'],
  ['france-percee', 2400, 1600, 'Joueur français qui s’échappe balle au pied, suivi par un Espagnol'],
  ['france-tresses-course', 2400, 1600, 'Joueur français aux tresses, en pleine course'],
  ['france-tresses-visage', 2400, 1600, 'Visage d’un joueur français aux tresses, concentré'],
  ['frappe', 2400, 1600, 'Frappe d’un joueur français, jambe tendue, ballon au sol'],
].map(([f, w, h, alt]) => [f, { f, w, h, alt }]));

const CHAPITRES = [
  ['cdm-avant', 'I. L’avant-match'],
  ['cdm-jeu', 'II. Le jeu'],
  ['cdm-bleus', 'III. Les Bleus'],
  ['cdm-joie', 'IV. La joie espagnole'],
];

// Image en deux tailles (« -s » = moitié de la largeur) ; cadrage facultatif
const img = (f, sizes, cadrage = '') => {
  const { w, h, alt } = PHOTOS[f];
  return `<img src="${dossier}/${f}-s.webp" srcset="${dossier}/${f}-s.webp ${w / 2}w, ${dossier}/${f}.webp ${w}w" sizes="${sizes}" width="${w}" height="${h}" alt="${alt}" loading="lazy" decoding="async"${cadrage ? ` style="object-position:${cadrage}"` : ''}>`;
};
const num = (n) => String(n).padStart(2, '0');

// Places des cinq photos (gauche, haut, largeur, hauteur en %) et du numéro
const COMPO = {
  P: [[37, 24, 21, 28, 'haut'], [62, 24, 41, 28, 'haut'], [37, 64, 21, 25, 'gauche'], [62, 64, 41, 25, 'bas'], [-4, 50, 26, 33, 'bas-droite']],
  Q: [[42, 24, 21, 28, 'haut'], [-3, 24, 41, 28, 'haut'], [42, 64, 21, 25, 'droite'], [-3, 64, 41, 25, 'bas'], [78, 50, 26, 33, 'bas-gauche']],
};

// Planche : un titre court, cinq photos numérotées
function planche(id, chapitre, sous, photos, compo, depart, premiere = false) {
  return `<section class="cdm-section"${id ? ` id="${id}"` : ''} aria-label="${chapitre}">
    <div class="cdm-libre cdm-libre--${compo}">
      ${premiere ? `<p class="cdm-entete cdm-entete--gauche">Coupe du monde 2026</p>
      <p class="cdm-entete cdm-entete--droite">France – Espagne<br>Série photographique</p>` : ''}
      <div class="cdm-chapitre cdm-chapitre--${compo}" data-apparait><h2>${chapitre}</h2><p>${sous}</p></div>
      ${photos.map(([f, cadrage], k) => { const [x, y, w, h, place] = COMPO[compo][k]; return `<figure class="cdm-photo cdm-photo--num-${place}" style="--x:${x}%; --y:${y}%; --w:${w}%; --h:${h}%; --m:${k === 1 || k === 3 ? 2 : 1}" data-apparait>
        <figcaption class="cdm-num">${num(depart + k)}</figcaption>${img(f, '(min-width: 900px) 30vw, 50vw', cadrage)}
      </figure>`; }).join('')}
    </div>
  </section>`;
}

// Image en grand, sur toute la largeur de la colonne
function grand(f, n, legende, cadrage = '50% 50%') {
  return `<section class="cdm-section cdm-section--grand">
    <figure class="cdm-grand" data-grand>
      <div class="cdm-grand__cadre">${img(f, '(min-width: 900px) 75vw, 100vw', cadrage)}</div>
      <figcaption><span class="cdm-num">${num(n)}</span><span>${legende}</span></figcaption>
    </figure>
  </section>`;
}

// La boucle du tacle, en grand
function boucle(n) {
  return `<section class="cdm-section cdm-section--grand">
    <figure class="cdm-grand cdm-grand--boucle" data-grand>
      <div class="cdm-grand__cadre"><video src="${dossier}/boucle-tacle.mp4" poster="${dossier}/boucle-tacle-affiche.webp" width="810" height="720" muted loop playsinline preload="none" data-cl-video aria-label="Boucle : un tacle entre un Français et un Espagnol, le ballon roule sous les deux joueurs"></video></div>
      <figcaption><span class="cdm-num">${num(n)}</span><span>Le tacle, en boucle</span></figcaption>
    </figure>
  </section>`;
}

function gabarit(p) {
  const { aside, mobile } = encart(p, CHAPITRES);
  return `
<article class="cl kk cdm" data-cl>
  ${aside}
  <div class="cl-visuels cdm-visuels" data-cl-visuels>
    ${planche('cdm-avant', 'L’avant-match', 'Les regards avant le coup d’envoi', [['france-profil', '55% 40%'], ['duel-16', '50% 50%'], ['espagne-regard', '45% 35%'], ['frappe', '50% 55%'], ['espagne-pelouse', '28% 50%']], 'P', 1, true)}
    ${grand('terrain-vue-large', 6, 'Le terrain, vu de haut')}
    ${planche('cdm-jeu', 'Le jeu', 'Duels, courses et frappes', [['duel-16-course', '50% 45%'], ['france-ballon', '50% 55%'], ['crampon-rose', '45% 60%'], ['france-percee', '50% 55%'], ['duel-ballon', '55% 55%']], 'Q', 7)}
    ${boucle(12)}
    ${planche('cdm-bleus', 'Les Bleus', 'Le groupe, de dos et de près', [['bleus-arbitre', '50% 35%'], ['bleus-groupe', '50% 45%'], ['france-7-dos', '55% 45%'], ['mbappe-dos', '50% 40%'], ['accolade-15-proche', '40% 50%']], 'P', 13)}
    ${grand('france-tresses-visage', 18, 'Concentration', '60% 35%')}
    ${planche('cdm-joie', 'La joie espagnole', 'Le but, l’accolade, Oyarzabal', [['france-tresses-course', '55% 45%'], ['duel-flou', '50% 50%'], ['accolade-15', '62% 50%'], ['oyarzabal-terrain', '50% 40%'], ['espagne-regard-fixe', '45% 45%']], 'Q', 19)}
    ${grand('joie-21', 24, 'La joie autour du numéro 21', '45% 45%')}
    ${planche('', 'Fin du match', 'Le numéro 21 et les siens', [['oyarzabal-index', '40% 45%'], ['accolade-15-serree', '55% 50%'], ['france-course', '50% 50%'], ['oyarzabal-21', '50% 45%'], ['oyarzabal-public', '50% 40%']], 'P', 25)}
    ${mobile}
  </div>
</article>`;
}

/* Mouvement ----------------------------------------------------------------- */
const borne = (x) => Math.min(1, Math.max(0, x));
const lisse = (a, b, x) => { const t = borne((x - a) / (b - a)); return t * t * (3 - 2 * t); };

function animerPage() {
  let vh = innerHeight; let els = [];
  const mesurer = () => {
    vh = innerHeight;
    els = [...document.querySelectorAll('[data-apparait], [data-grand]')].map((el, k) => {
      const r = el.getBoundingClientRect();
      return { el, top: r.top + scrollY, h: r.height, k, type: el.dataset.grand !== undefined ? 'grand' : 'apparait', media: el.querySelector('img, video') };
    });
  };
  const peindre = (y) => {
    els.forEach((o) => {
      const p = (y + vh - o.top) / (o.h + vh); // 0 : entre par le bas ; 1 : sort par le haut
      if (p < -0.05 || p > 1.05) return;
      if (o.type === 'apparait') {
        const a = lisse(0.02, 0.22, p);
        const prof = [14, -10, 18, -14, 8][o.k % 5];
        o.el.style.opacity = a.toFixed(3);
        o.el.style.transform = `translate3d(0, ${((1 - a) * 28 + (0.5 - p) * prof).toFixed(1)}px, 0)`;
      } else {
        // image en grand : elle s’ouvre un peu et recule doucement
        const a = lisse(0.02, 0.4, p);
        o.el.style.opacity = lisse(0, 0.16, p).toFixed(3);
        o.el.firstElementChild.style.clipPath = `inset(${((1 - a) * 6).toFixed(2)}% ${((1 - a) * 8).toFixed(2)}%)`;
        o.media.style.transform = `scale(${(1.12 - 0.12 * borne(p * 1.4)).toFixed(4)})`;
      }
    });
  };
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
  installer(gabarit(p), 'page-cdm');
  if (reduit) document.querySelector('.cdm').classList.add('cdm--statique');
}

export function animer() {
  suivi();
  videos();
  if (!reduit) animerPage();
}
