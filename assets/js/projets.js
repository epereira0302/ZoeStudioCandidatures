// Page Projets : grille de photos carrées (référence d’Enzo du 2026-10-25),
// filtres par catégorie (?categorie=<id>, lien du sommaire de l’accueil).
// Au clic, la photo grandit jusqu’au plein écran et ouvre la page projet.

import { chargerDonnees, lier, urlProjet, imageCouverture } from './donnees.js';
import { initCommun, revelations, lienProjet, reduit, EASE } from './commun.js';

const gsap = window.gsap;
const ST = window.ScrollTrigger;
const anime = !!(gsap && !reduit);
const DOSSIER = 'contenu/images/projets/grille/';

const el = (tag, classe, texte) => {
  const n = document.createElement(tag);
  if (classe) n.className = classe;
  if (texte != null) n.textContent = texte;
  return n;
};

/* Grille ------------------------------------------------------------------ */
function grille(projets) {
  const ul = document.querySelector('[data-grille]');
  return projets.map((p, i) => {
    const li = el('li', 'grille__item');
    li.dataset.categorie = p.categoriesIds.join(' ');
    const a = el('a', 'grille__lien');
    a.href = urlProjet(p);
    a.dataset.slug = p.slug;

    const sizes = '(min-width: 900px) 20vw, 50vw';
    let img;
    if (p.couv && p.dossier) {
      // Couverture choisie pour le projet : la vignette carrée en montre le cadrage,
      // l’image entière apparaît quand elle grandit jusqu’à la page projet
      img = imageCouverture(p, { sizes });
      img.className = 'grille__img';
      img.removeAttribute('loading');
      img.removeAttribute('fetchpriority');
    } else {
      img = el('img', 'grille__img');
      img.src = `${DOSSIER}${p.slug}-s.webp`;
      img.srcset = `${DOSSIER}${p.slug}-s.webp 480w, ${DOSSIER}${p.slug}.webp 1000w`;
      img.sizes = sizes;
      img.width = 480;
      img.height = 480;
    }
    img.alt = '';
    img.decoding = 'async';
    // Les deux premières lignes se chargent tout de suite, le reste au besoin
    img.loading = i < 8 ? 'eager' : 'lazy';
    if (i < 4) img.fetchPriority = 'high';

    const legende = el('span', 'grille__legende');
    legende.append(el('span', 'grille__nom', p.titre), el('span', 'grille__cat', p.categorieNom));
    a.append(img, legende);
    lienProjet(a, img);
    li.append(a);
    ul.append(li);
    return { li, a };
  });
}

/* Filtres par catégorie --------------------------------------------------- */
function filtres(categories, projets, cases) {
  const zone = document.querySelector('[data-filtres]');
  const statut = document.querySelector('[data-grille-statut]');
  categories
    .filter((c) => projets.some((p) => p.categoriesIds.includes(c.id)))
    .forEach((c) => {
      const b = el('button', 'onglet', c.nom);
      b.type = 'button';
      b.dataset.filtre = c.id;
      b.setAttribute('aria-pressed', 'false');
      zone.append(b);
    });
  const boutons = [...zone.querySelectorAll('[data-filtre]')];

  const appliquer = (id, { annoncer = true, animer = true } = {}) => {
    if (!categories.some((c) => c.id === id)) id = '';
    boutons.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.filtre === id)));
    const visibles = [];
    cases.forEach((c) => {
      const garde = !id || c.li.dataset.categorie.split(' ').includes(id);
      c.li.hidden = !garde;
      if (garde) visibles.push(c.a);
    });
    // Les photos gardées reviennent en fondu, de gauche à droite
    if (animer && anime) {
      gsap.fromTo(visibles, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.5, ease: EASE, stagger: 0.03, overwrite: true, clearProps: 'transform,opacity' });
    }
    if (annoncer && statut) {
      const nom = categories.find((c) => c.id === id)?.nom;
      statut.textContent = nom ? `Projets ${nom.toLowerCase()} affichés` : 'Tous les projets affichés';
    }
    const url = new URL(location.href);
    if (id) url.searchParams.set('categorie', id);
    else url.searchParams.delete('categorie');
    history.replaceState(null, '', url);
    // Mobile : l’onglet choisi reste visible dans la bande qui défile
    const choisi = boutons.find((b) => b.dataset.filtre === id);
    if (zone.scrollWidth > zone.clientWidth && choisi) zone.scrollTo({ left: choisi.offsetLeft - zone.offsetLeft - 16, behavior: animer && anime ? 'smooth' : 'auto' });
    ST?.refresh();
  };

  zone.addEventListener('click', (e) => {
    const b = e.target.closest('[data-filtre]');
    if (b && b.getAttribute('aria-pressed') !== 'true') appliquer(b.dataset.filtre);
  });
  return appliquer;
}

/* Entrée : titre, barre, puis les photos ---------------------------------- */
function entree(cases) {
  if (!anime) return;
  gsap.from('.grille-titre', { yPercent: 30, opacity: 0, duration: 1, ease: EASE, delay: 0.1 });
  gsap.from('.grille-intro, .grille-barre', { opacity: 0, duration: 0.8, ease: EASE, delay: 0.3 });
  const visibles = cases.filter((c) => !c.li.hidden).map((c) => c.a);
  gsap.from(visibles, { opacity: 0, y: 24, duration: 0.9, ease: EASE, stagger: 0.04, delay: 0.35, clearProps: 'transform,opacity' });
}

async function init() {
  initCommun();
  if (ST) ST.config({ ignoreMobileResize: true });
  let donnees;
  try {
    donnees = await chargerDonnees();
  } catch (e) {
    console.error('Contenus introuvables', e);
    return;
  }
  lier(donnees);
  const cases = grille(donnees.projets);
  const appliquer = filtres(donnees.categories, donnees.projets, cases);
  const demande = new URLSearchParams(location.search).get('categorie') ?? '';
  appliquer(demande, { annoncer: false, animer: false });
  entree(cases);
  revelations();
  if (ST) {
    document.fonts?.ready.then(() => ST.refresh());
    addEventListener('load', () => ST.refresh());
  }
}

// Pied de page et projet suivant n'apparaissent qu'une fois la page construite :
// sinon ils s'affichent en haut puis sont repoussés (décalage mesuré : 1,66)
init().finally(() => {
  document.body.classList.add('est-pret');
  window.ScrollTrigger?.refresh();
});
