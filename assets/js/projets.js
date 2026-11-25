// Page Projets : index défilant (référence vidéo d’Enzo, 2026-11-24).
// À gauche, la liste des noms reste à l’écran et glisse au fil du scroll :
// le projet dont la couverture passe au centre de l’écran est en encre, sur la
// ligne de repère, avec son type de projet. À droite, les couvertures
// défilent. Le mouvement suit le scroll en continu (aucune animation autonome) ;
// avec « réduire les animations », il reste lié au scroll, sans glissé amorti.
// Au clic, la couverture grandit jusqu’à la page projet (lienProjet).

import { chargerDonnees, lier, urlProjet, imageCouverture } from './donnees.js';
import { initCommun, lienProjet, ouvrirProjet, prechauffer, lenis, reduit, EASE } from './commun.js';

const gsap = window.gsap;
const ST = window.ScrollTrigger;
const anime = !!(gsap && !reduit);
const etroit = matchMedia('(max-width: 899px)');

const el = (tag, classe, texte) => {
  const n = document.createElement(tag);
  if (classe) n.className = classe;
  if (texte != null) n.textContent = texte;
  return n;
};

// Nom dans la liste : « nomIndex » s’il existe (ex. « C’est le moment »), sinon le titre
const nomIndex = (p) => p.nomIndex || p.titre;
// À côté du nom : le type de projet (ex. « Identité visuelle », « Identité visuelle et Packaging »)
const meta = (p) => p.typeIndex || p.categorieNom || '';

/* Construction -------------------------------------------------------------- */
function construire(projets) {
  const liste = document.querySelector('[data-index-liste]');
  const visuels = document.querySelector('[data-index-visuels]');
  return projets.map((p, i) => {
    // Couverture (à droite) : lien doublon du nom, retiré de l’ordre de tabulation
    const li = el('li', 'index__visuel');
    const a = el('a', 'index__image');
    a.href = urlProjet(p);
    a.tabIndex = -1;
    a.setAttribute('aria-hidden', 'true');
    const img = imageCouverture(p, { sizes: '(min-width: 900px) 40vw, 92vw' });
    img.alt = '';
    img.removeAttribute('fetchpriority');
    if (i < 2) { img.loading = 'eager'; img.fetchPriority = 'high'; } else img.loading = 'lazy';
    // Couverture à garder entière (un logo, ex. LCT) : posée sur sa couleur de fond
    if (p.couv?.entierIndex) {
      a.style.background = p.couv.entierIndex;
      img.classList.add('index__entier');
    }
    a.append(img);
    lienProjet(a, img);
    li.append(a);
    visuels.append(li);

    // Nom (à gauche) : le vrai lien, lu par les lecteurs d’écran
    const ligne = el('li', 'index__ligne');
    const lien = el('a', 'index__nom');
    lien.href = urlProjet(p);
    lien.append(el('span', 'index__texte', nomIndex(p)));
    const m = meta(p);
    if (m) {
      const info = el('span', 'index__meta micro', m);
      lien.append(' ', info);
    }
    ligne.append(lien);
    liste.append(ligne);
    // Prêt dès qu’on vise le nom ; au clic, si sa couverture est à l’écran, elle grandit
    lien.addEventListener('pointerenter', () => prechauffer(lien), { once: true });
    lien.addEventListener('click', (e) => {
      const r = img.getBoundingClientRect();
      if (r.bottom > 0 && r.top < innerHeight) ouvrirProjet(e, lien, img);
    });
    return { ligne, lien, visuel: li, img, meta: m };
  });
}

/* Défilement lié : liste, couleurs, compteur ---------------------------------- */
function index(cases) {
  const liste = document.querySelector('[data-index-liste]');
  const fenetre = document.querySelector('.index__fenetre');
  const compteur = document.querySelector('[data-index-actif]');
  const info = document.querySelector('[data-index-info]');
  document.querySelector('[data-index-total]').textContent = String(cases.length).padStart(2, '0');

  // Mesures (au chargement et à chaque changement de taille) : centres des
  // couvertures dans la page, position de chaque ligne dans la liste
  let centres = [];
  let lignes = [];
  let repere = 0;
  const mesurer = () => {
    const y = scrollY;
    // Mesuré sans les transformations (l’entrée en fondu décale les couvertures)
    const haut = document.querySelector('[data-index-visuels]').getBoundingClientRect().top + y;
    centres = cases.map((c) => haut + c.visuel.offsetTop + c.visuel.offsetHeight / 2);
    lignes = cases.map((c) => c.ligne.offsetTop + c.ligne.offsetHeight / 2);
    // Ligne de repère : le centre de l’écran ; sur mobile, le centre de la zone
    // sous la bande des noms
    const f = fenetre.getBoundingClientRect();
    repere = etroit.matches ? (f.bottom + innerHeight) / 2 : innerHeight / 2;
  };

  let actif = -1;
  let attente = false;
  const dessiner = () => {
    attente = false;
    const y = scrollY + repere;
    const n = centres.length;
    // Avancement continu : 2,4 = entre la 3e et la 4e couverture
    let t = 0;
    if (y >= centres[n - 1]) t = n - 1;
    else if (y > centres[0]) {
      let i = 0;
      while (i < n - 2 && y >= centres[i + 1]) i++;
      t = i + (y - centres[i]) / (centres[i + 1] - centres[i]);
    }
    const i0 = Math.floor(t);
    const i1 = Math.min(n - 1, i0 + 1);
    const ligneY = lignes[i0] + (lignes[i1] - lignes[i0]) * (t - i0);
    liste.style.transform = `translate3d(0, ${-ligneY}px, 0)`;
    // Les noms déjà passés s’effacent vite, les suivants restent lisibles
    cases.forEach((c, k) => {
      const d = k - t;
      const o = d < 0 ? Math.max(0, 1 + d * 0.85) : Math.max(0.55, 1 - d * 0.08);
      c.ligne.style.opacity = o.toFixed(3);
    });
    const a = Math.round(t);
    if (a !== actif) {
      if (actif >= 0) { cases[actif].ligne.classList.remove('is-actif'); cases[actif].lien.removeAttribute('aria-current'); }
      cases[a].ligne.classList.add('is-actif');
      cases[a].lien.setAttribute('aria-current', 'true');
      compteur.textContent = String(a + 1).padStart(2, '0');
      if (info) info.textContent = cases[a].meta;
      actif = a;
    }
  };
  const demander = () => { if (!attente) { attente = true; requestAnimationFrame(dessiner); } };
  // Lenis (défilement amorti) doit connaître la nouvelle hauteur de la page
  const remesurer = () => { lenis?.resize(); mesurer(); dessiner(); };

  addEventListener('scroll', demander, { passive: true });
  addEventListener('resize', remesurer, { passive: true });
  etroit.addEventListener('change', remesurer);
  ST?.addEventListener('refresh', remesurer);
  document.fonts?.ready.then(remesurer);
  addEventListener('load', remesurer);
  // Une couverture qui charge peut décaler les suivantes (hauteurs fixées en CSS : par sécurité)
  new ResizeObserver(remesurer).observe(document.querySelector('[data-index-visuels]'));
  remesurer();

  // Clavier : le nom qui reçoit le focus amène sa couverture sur la ligne de repère
  cases.forEach((c, k) => {
    c.lien.addEventListener('focus', () => {
      const cible = centres[k] - repere;
      if (Math.abs(scrollY - cible) < 4) return;
      if (lenis) lenis.scrollTo(cible, { duration: 0.9, force: true });
      else scrollTo({ top: cible, behavior: reduit ? 'auto' : 'smooth' });
    });
  });
}

/* Entrée : la liste puis les couvertures, en fondu --------------------------- */
function entree() {
  if (!anime) return;
  gsap.from('.index__tete, .index__fenetre', { opacity: 0, duration: 0.8, ease: EASE, delay: 0.1 });
  gsap.from('.index__visuel', { opacity: 0, y: 40, duration: 1, ease: EASE, stagger: 0.06, delay: 0.2, clearProps: 'transform,opacity' });
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
  const cases = construire(donnees.projets);
  index(cases);
  entree();
}

// Pied de page n’apparaît qu’une fois la page construite (pas de décalage)
init().finally(() => {
  document.body.classList.add('est-pret');
  window.ScrollTrigger?.refresh();
});
