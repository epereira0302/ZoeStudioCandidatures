// Chargement des contenus (contenu/site.json et contenu/projets.json)
// et petites fonctions partagées par toutes les pages.

const BASE = new URL('../../', import.meta.url);

let cache;
export async function chargerDonnees() {
  if (cache) return cache;
  const [site, projets] = await Promise.all([
    fetch(new URL('contenu/site.json', BASE)).then((r) => r.json()),
    fetch(new URL('contenu/projets.json', BASE)).then((r) => r.json()),
  ]);
  const categories = new Map(projets.categories.map((c) => [c.id, c]));
  // « categories » : un projet peut être rangé dans plusieurs catégories ;
  // « categorie » reste celle de ses planches
  const liste = projets.projets.map((p, i) => {
    const ids = p.categories?.length ? p.categories : [p.categorie];
    return {
      ...p,
      numero: String(i + 1).padStart(2, '0'),
      categoriesIds: ids,
      categorieNom: ids.map((id) => categories.get(id)?.nom ?? id).join(' et '),
      prefixe: categories.get(p.categorie)?.prefixe ?? p.categorie,
    };
  });
  const planches = liste.reduce((n, p) => n + (p.planches.a - p.planches.de + 1), 0);
  cache = {
    site,
    categories: projets.categories,
    projets: liste,
    compte: {
      projets: String(liste.length),
      planches: String(planches),
      phares: String(liste.filter((p) => p.phare).length).padStart(2, '0'),
    },
  };
  return cache;
}

// Chemin d’une planche : grande (1366 px) ou petite (720 px)
export function planche(projet, n, petite = false) {
  const nn = String(n).padStart(2, '0');
  return `contenu/images/planches/${projet.prefixe}-${nn}${petite ? '-s' : ''}.webp`;
}

export function imagePlanche(projet, n, { sizes = '100vw', eager = false } = {}) {
  const img = document.createElement('img');
  img.src = planche(projet, n, true);
  img.srcset = `${planche(projet, n, true)} 720w, ${planche(projet, n)} 1366w`;
  img.sizes = sizes;
  img.width = 1366;
  img.height = 768;
  img.alt = `${projet.titre}, ${projet.categorieNom} : planche ${n}`;
  img.decoding = 'async';
  if (eager) img.fetchPriority = 'high';
  else img.loading = 'lazy';
  img.addEventListener('error', () => {
    const ph = document.createElement('div');
    ph.className = 'placeholder micro';
    ph.textContent = '[Image à venir]';
    img.replaceWith(ph);
  }, { once: true });
  return img;
}

// Visuel d’un projet détaillé (dossier + nom) : grande et petite version
export function imageVisuel(projet, item, { sizes = '100vw', eager = false } = {}) {
  const img = document.createElement('img');
  const base = `${projet.dossier}/${item.img}`;
  img.src = `${base}-s.webp`;
  img.srcset = `${base}-s.webp 900w, ${base}.webp ${item.w}w`;
  img.sizes = sizes;
  img.width = item.w;
  img.height = item.h;
  img.alt = item.alt ?? '';
  img.decoding = 'async';
  if (eager) img.fetchPriority = 'high';
  else img.loading = 'lazy';
  return img;
}

// Image d’ouverture : le « hero » du projet s’il existe, sinon sa planche de couverture.
// Sert aussi de vignette sur l’accueil, pour que l’effet d’ouverture soit continu.
// Couverture animée (« couv.video ») : un extrait muet qui tourne en boucle quand il
// est à l’écran ; avec « réduire les animations », son image de départ, immobile
function videoCouverture(projet) {
  const c = projet.couv;
  const v = document.createElement('video');
  v.muted = true;
  v.defaultMuted = true;
  v.loop = true;
  v.playsInline = true;
  v.setAttribute('playsinline', '');
  v.setAttribute('aria-hidden', 'true');
  v.preload = 'metadata';
  v.width = c.w;
  v.height = c.h;
  v.poster = `${projet.dossier}/${c.img}.webp`;
  v.src = `${projet.dossier}/${c.video}`;
  v.dataset.couverture = '';
  if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
    new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        v.preload = 'auto';
        v.play().catch((err) => {
          // Refusée : elle partira au premier geste sur la page (commun.js)
          if (err.name === 'NotAllowedError') document.dispatchEvent(new CustomEvent('sz:bloquee', { detail: { video: v, commandes: false } }));
        });
      } else v.pause();
    }, { rootMargin: '10% 0px' }).observe(v);
  }
  return v;
}

// « couv » : image de couverture choisie pour le projet (prioritaire), avec son cadrage.
export function imageCouverture(projet, options = {}) {
  if (projet.couv?.video && projet.dossier) return videoCouverture(projet);
  if (projet.couv && projet.dossier) {
    const img = imageVisuel(projet, projet.couv, options);
    if (projet.couv.cadrage) img.style.objectPosition = projet.couv.cadrage;
    return img;
  }
  return projet.hero && projet.dossier
    ? imageVisuel(projet, projet.hero, options)
    : imagePlanche(projet, projet.couverture, options);
}

export function urlProjet(projet) {
  return `projet.html?p=${encodeURIComponent(projet.slug)}`;
}

// Lit « contact.email » dans un objet
export function lire(obj, chemin) {
  return chemin.split('.').reduce((o, k) => (o == null ? o : o[k]), obj);
}

// Remplit les éléments [data-bind], [data-bind-href] et [data-bind-attr]
export function lier(donnees, racine = document) {
  const source = { ...donnees.site, compte: donnees.compte };
  racine.querySelectorAll('[data-bind]').forEach((el) => {
    const v = lire(source, el.dataset.bind);
    if (v == null || v === '') return;
    el.textContent = v;
    // Une adresse e-mail ne se coupe qu’après l’arobase sur petit écran
    // (dans une phrase, elle reste d’un seul tenant)
    if (el.dataset.bind === 'contact.email' && v.includes('@') && !el.closest('p')) {
      const [nom, domaine] = v.split('@');
      el.replaceChildren(`${nom}@`, document.createElement('wbr'), domaine);
    }
  });
  racine.querySelectorAll('[data-bind-href]').forEach((el) => {
    const [prefixe, chemin] = el.dataset.bindHref.split(':');
    const v = lire(source, chemin);
    if (v) el.href = `${prefixe}:${prefixe === 'tel' ? v.replace(/[^+\d]/g, '') : v}`;
  });
  racine.querySelectorAll('[data-bind-attr]').forEach((el) => {
    const [attr, chemin] = el.dataset.bindAttr.split(':');
    const v = lire(source, chemin);
    if (v) el.setAttribute(attr, v);
  });  // Pied de page : l’icône LinkedIn devient un lien dès que l’adresse est renseignée
  const zone = racine.querySelector('[data-linkedin]');
  const url = donnees.site?.contact?.linkedin;
  if (zone && url) {
    const lien = document.createElement('a');
    lien.className = 'footer__social';
    lien.href = url;
    lien.target = '_blank';
    lien.rel = 'noopener';
    lien.setAttribute('aria-label', 'LinkedIn (nouvel onglet)');
    lien.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><use href="assets/img/sprite.svg#linkedin"/></svg>';
    zone.replaceChildren(lien);
  }
}
