// Page projet (projet.html?p=<slug>) : image d’ouverture plein écran avec le
// titre posé dessus, présentation et fiche, galerie en sections titrées,
// projet suivant. Mise en page inspirée des études de cas de RoAndCo.

import { chargerDonnees, lier, imagePlanche, imageVisuel, imageCouverture, urlProjet } from './donnees.js';
import { initCommun, revelations, decouperMots, imagesVisibles, reveler, reduit, EASE } from './commun.js';

const gsap = window.gsap;
const ST = window.ScrollTrigger;
const anime = !!(gsap && ST && !reduit);

const A_COMPLETER = /À COMPLÉTER/;
const rempli = (v) => (Array.isArray(v) ? v.length > 0 : !!v && !A_COMPLETER.test(v));
const el = (tag, classe, texte) => {
  const n = document.createElement(tag);
  if (classe) n.className = classe;
  if (texte != null) n.textContent = texte;
  return n;
};
const zone = (nom) => document.querySelector(`[data-projet="${nom}"]`);

/* 1. Ouverture ------------------------------------------------------------- */
function hero(p) {
  const media = document.querySelector('[data-projet-media]');
  // Titre foncé sur une image claire (« encre » sombre), clair sinon
  const section = document.querySelector('[data-projet-hero]');
  const sombre = p.hero?.encre === 'sombre';
  section.dataset.theme = sombre ? 'paper' : 'aubergine';
  section.classList.toggle('projet-hero--clair', !sombre);
  if (p.hero?.fond) {
    section.classList.add('projet-hero--fond');
    media.style.setProperty('--hero-fond', p.hero.fond);
  }
  const img = imageCouverture(p, { sizes: '100vw', eager: true });
  img.alt = p.hero?.alt ?? img.alt;
  img.loading = 'eager';
  media.append(img);
  zone('client').textContent = rempli(p.client) ? p.client : p.categorieNom;
  zone('titre').textContent = p.nom || p.titre;
}

/* 2. Présentation et fiche ------------------------------------------------- */
function presentation(p) {
  zone('type').textContent = p.type || p.categorieNom;
  const corps = zone('texte');
  [p.description, ...(p.texte ?? [])].filter(rempli).forEach((t, i) => {
    corps.append(el('p', i === 0 ? 'projet-intro__chapo' : null, t));
  });
  if (!corps.children.length) corps.append(el('p', 'projet-intro__chapo', `${p.titre}, ${p.categorieNom.toLowerCase()}.`));

  const fiche = zone('fiche');
  [
    ['Client', p.client],
    ['Année', p.annee],
    ['Rôle', p.role],
    ['Contribution', p.contribution],
    ['Avec', rempli(p.agence) ? `l’agence ${p.agence}` : ''],
    ['Catégorie', p.categorieNom],
  ].filter(([, v]) => rempli(v)).forEach(([cle, v]) => {
    const ligne = el('div', 'projet-fiche__ligne');
    const dd = el('dd');
    if (Array.isArray(v)) {
      const ul = el('ul');
      v.forEach((x) => ul.append(el('li', null, x)));
      dd.append(ul);
    } else dd.textContent = v;
    ligne.append(el('dt', 'micro', cle), dd);
    fiche.append(ligne);
  });
}

/* 3. Galerie --------------------------------------------------------------- */
const TAILLES = {
  plein: '(min-width: 1440px) 62vw, (min-width: 768px) 80vw, 100vw',
  bande: '(min-width: 1440px) 62vw, (min-width: 768px) 80vw, 100vw',
  demi: '(min-width: 768px) 40vw, 100vw',
  seul: '(min-width: 768px) 40vw, 100vw',
};

function figure(p, item) {
  const fig = el('figure', `visuel visuel--${item.format} visuel--${item.type || 'panneau'}`);
  fig.dataset.reveal = 'mask';
  if (item.type === 'photo') fig.style.setProperty('--ratio', `${item.w} / ${item.h}`);
  fig.append(imageVisuel(p, item, { sizes: TAILLES[item.format] ?? TAILLES.plein }));
  return fig;
}

function galerie(p) {
  const racine = zone('galerie');
  const sections = p.galerie?.length
    ? p.galerie
    : [{ titre: 'Planches', planches: true }];
  sections.forEach((s, i) => {
    const sec = el('section', 'bloc');
    const id = `bloc-${i + 1}`;
    sec.setAttribute('aria-labelledby', id);
    const tete = el('div', 'bloc__tete');
    const h = el('h2', 'bloc__titre', s.titre);
    h.id = id;
    tete.append(h);
    if (s.note) tete.append(el('p', 'bloc__note serif', s.note));
    const grille = el('div', 'bloc__grille');
    if (s.planches) {
      for (let n = p.planches.de; n <= p.planches.a; n++) {
        const fig = el('figure', 'visuel visuel--plein visuel--photo');
        fig.dataset.reveal = 'mask';
        fig.style.setProperty('--ratio', '1366 / 768');
        fig.append(imagePlanche(p, n, { sizes: TAILLES.plein }));
        grille.append(fig);
      }
    } else {
      s.images.forEach((item) => grille.append(figure(p, item)));
    }
    sec.append(tete, grille);
    racine.append(sec);
  });
}

/* 4. Projets suivants : trois projets en pile de cartes ------------------- */
// La carte du dessus part vers la gauche et repasse derrière la pile (vidéo
// d’Enzo, 2026-10-28) ; le titre et la catégorie changent en même temps.
// Survol ou focus : la pile s’arrête ; « réduire les animations » : immobile.
const N_SUIVANTS = 3;
function suivant(p, projets) {
  const i = projets.findIndex((x) => x.slug === p.slug);
  const liste = Array.from({ length: Math.min(N_SUIVANTS, projets.length - 1) }, (_, k) => projets[(i + 1 + k) % projets.length]);
  const nav = zone('suivant');
  nav.setAttribute('aria-label', 'Projets suivants');
  const bloc = el('div', 'suivant');
  const textes = el('ul', 'suivant__textes');
  const pile = el('a', 'suivant__pile');
  pile.tabIndex = -1;
  pile.setAttribute('aria-hidden', 'true');
  const liens = [];
  const cartes = [];
  liste.forEach((s, k) => {
    const li = el('li', 'suivant__item');
    const a = el('a', 'suivant__lien');
    a.href = urlProjet(s);
    a.append(el('span', 'suivant__titre display', s.nom || s.titre), el('span', 'suivant__cat serif', s.categorieNom));
    li.append(a);
    textes.append(li);
    liens.push(li);
    const carte = el('span', 'suivant__carte');
    const img = imageCouverture(s, { sizes: '(min-width: 768px) 30vw, 80vw' });
    img.alt = '';
    carte.append(img);
    carte.dataset.pos = String(k);
    pile.append(carte);
    cartes.push(carte);
  });
  // Flèche fine pour changer soi-même de projet
  const fleches = el('div', 'suivant__fleches');
  const fleche = (sens, label) => {
    const b = el('button', `suivant__fleche suivant__fleche--${sens}`);
    b.type = 'button';
    b.setAttribute('aria-label', label);
    b.innerHTML = `<svg viewBox="0 0 72 24" aria-hidden="true"><path d="${sens === 'prec' ? 'M70 12 H4 M15 3 L3 12 L15 21' : 'M2 12 H68 M57 3 L69 12 L57 21'}"/></svg>`;
    fleches.append(b);
    return b;
  };
  // Une seule flèche, à droite de la pile : elle passe au projet d’après
  const suiv = fleche('suiv', 'Voir un autre projet');
  bloc.append(el('p', 'suivant__label micro', 'Projet suivant'), textes, pile, fleches);
  nav.append(bloc);

  let actif = 0;
  const montrer = (n) => {
    actif = n;
    liens.forEach((li, k) => li.classList.toggle('is-actif', k === n));
    // Position de chaque carte dans la pile : 0 dessus, puis derrière
    cartes.forEach((c, k) => { if (c.dataset.pos !== 'sort') c.dataset.pos = String((k - n + cartes.length) % cartes.length); });
    pile.href = urlProjet(liste[n]);
  };
  montrer(0);
  if (liste.length < 2) { fleches.hidden = true; return; }
  const avancer = () => {
    const dessus = cartes[actif];
    dessus.dataset.pos = 'sort';
    montrer((actif + 1) % cartes.length);
    // Une fois sortie à gauche, la carte repasse sans transition derrière la pile
    setTimeout(() => {
      dessus.classList.add('is-sans-transition');
      dessus.dataset.pos = String(cartes.length - 1);
      dessus.getBoundingClientRect();
      dessus.classList.remove('is-sans-transition');
    }, 520);
  };
  liens.forEach((li, k) => li.addEventListener('focusin', () => { if (k !== actif) montrer(k); }));
  let minuteur = 0;
  let visible = false;
  let arret = false;
  suiv.addEventListener('click', () => { avancer(); regler(); });
  if (reduit) return;
  function regler() {
    clearInterval(minuteur);
    if (visible && !arret && !reduit) minuteur = setInterval(avancer, 2400);
  }
  bloc.addEventListener('pointerenter', () => { arret = true; regler(); });
  bloc.addEventListener('pointerleave', () => { arret = false; regler(); });
  bloc.addEventListener('focusin', () => { arret = true; regler(); });
  bloc.addEventListener('focusout', (e) => { if (!bloc.contains(e.relatedTarget)) { arret = false; regler(); } });
  new IntersectionObserver((e) => { visible = e[0].isIntersecting; regler(); }, { threshold: 0.3 }).observe(bloc);
}

/* Projet introuvable ------------------------------------------------------- */
function introuvable() {
  document.title = 'Projet introuvable · Zoé Vinardell';
  zone('client').textContent = 'Erreur';
  zone('titre').textContent = 'Projet introuvable';
  zone('type').textContent = 'Ce lien ne mène à aucun projet';
  const p = el('p', 'projet-intro__chapo');
  const a = el('a', 'link', 'Revenir à l’accueil');
  a.href = './';
  p.append(a);
  zone('texte').append(p);
  document.querySelector('[data-projet-hero]')?.classList.add('is-vide');
}

/* Entrée : le titre monte mot à mot sur l’image ----------------------------- */
function entree(depuisAccueil) {
  const titre = zone('titre');
  const client = zone('client');
  if (!anime) return;
  const mots = decouperMots(titre);
  gsap.from(mots, { yPercent: 110, duration: 1, ease: EASE, stagger: 0.06, delay: depuisAccueil ? 0.05 : 0.3 });
  gsap.from(client, { opacity: 0, y: 12, duration: 0.8, ease: EASE, delay: depuisAccueil ? 0.15 : 0.4 });
  // L’image recule doucement au scroll
  const img = document.querySelector('[data-projet-media] img');
  if (img) {
    gsap.to(img, {
      yPercent: 12, scale: 1.04, ease: 'none',
      scrollTrigger: { trigger: '[data-projet-hero]', start: 'top top', end: 'bottom top', scrub: true },
    });
  }
}

async function init() {
  // Arrivée depuis l’effet d’ouverture de l’accueil : pas de rideau
  let depuisAccueil = false;
  try { depuisAccueil = sessionStorage.getItem('sz-ouverture') === '1'; sessionStorage.removeItem('sz-ouverture'); } catch (e) { /* rien */ }
  if (depuisAccueil) { try { sessionStorage.removeItem('sz-rideau'); } catch (e) { /* rien */ } }
  // Page masquée à l’arrivée (rideau, ou image d’ouverture gardée à l’écran) :
  // on la révèle une fois construite, images visibles comprises
  let masquee = document.documentElement.classList.contains('ouverture');
  try { masquee = masquee || (!reduit && sessionStorage.getItem('sz-rideau') === '1'); } catch (e) { /* rien */ }
  initCommun();
  if (ST) ST.config({ ignoreMobileResize: true });
  let donnees;
  try {
    donnees = await chargerDonnees();
  } catch (e) {
    console.error('Contenus introuvables', e);
  }
  if (donnees) lier(donnees);
  const slug = new URLSearchParams(location.search).get('p');
  const p = donnees?.projets.find((x) => x.slug === slug);
  if (!p) {
    introuvable();
    return;
  }
  const nom = p.nom || p.titre;
  document.title = `${nom} · ${rempli(p.client) ? p.client : p.categorieNom} · Zoé Vinardell`;
  const desc = rempli(p.description) ? p.description : `${p.titre}, ${p.categorieNom}. Projet de Zoé Vinardell, graphiste et directrice artistique à Paris.`;
  document.querySelector('meta[name="description"]')?.setAttribute('content', desc);
  // Un projet peut avoir sa propre mise en page (gabarit), sinon la page type
  let gabarit = null;
  if (p.gabarit) {
    try {
      gabarit = await import(`./gabarits/${p.gabarit}.js?v=${window.SZ_GABARITS ?? ''}`);
    } catch (e) {
      console.error('Gabarit introuvable', e);
    }
  }
  if (gabarit) {
    await gabarit.rendre(p, { depuisAccueil });
  } else {
    hero(p);
    presentation(p);
    galerie(p);
  }
  suivant(p, donnees.projets);
  revelations();
  // Avec l’image d’ouverture, pas d’attente ici : elle part aussitôt rejoindre
  // le premier visuel et ne s’y fond qu’une fois celui-ci chargé (reveler)
  if (masquee && !document.documentElement.classList.contains('ouverture')) await imagesVisibles();
  if (gabarit) gabarit.animer?.();
  else entree(depuisAccueil);
  reveler();
  if (ST) {
    document.fonts?.ready.then(() => ST.refresh());
    addEventListener('load', () => ST.refresh());
  }
}

// Pied de page et projet suivant n'apparaissent qu'une fois la page construite :
// sinon ils s'affichent en haut puis sont repoussés (décalage mesuré : 1,66)
init().finally(() => {
  reveler(); // au cas où la page s’arrête avant (projet introuvable, erreur)
  document.body.classList.add('est-pret');
  window.ScrollTrigger?.refresh();
});
