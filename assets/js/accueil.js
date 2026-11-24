// Accueil (site des candidatures), fonds alternés aubergine / papier :
// ouverture (fenêtre d’images qui s’agrandit au scroll), bande des projets
// phares, à propos, logos, contact. Le sommaire du site principal est retiré.

import { chargerDonnees, lier, imageCouverture, urlProjet } from './donnees.js';
import { initCommun, loader, revelations, decouperMots, lienProjet, reduit, EASE } from './commun.js';

const gsap = window.gsap;
const ST = window.ScrollTrigger;
const anime = !!(gsap && ST && !reduit);

/* 1. Ouverture ------------------------------------------------------------- */
// Le monogramme est dans un ovale glissé entre deux mots. Au scroll, la section
// reste en place : l’ovale grandit jusqu’au plein écran et écarte les mots.
function ouverture(site) {
  const section = document.querySelector('[data-ouverture]');
  const titre = section?.querySelector('.ouverture__titre');
  const media = section?.querySelector('[data-ouverture-media]');
  if (!section || !titre || !media || !anime) return {};

  // Entrée du titre, mot par mot (lancée après le loader)
  decouperMots(titre);
  const fenetre = section.querySelector('[data-fenetre]');
  const blocs = [...titre.querySelectorAll('.wm')].filter((w) => !w.contains(fenetre));
  const mots = blocs.map((b) => b.firstElementChild);
  gsap.set(mots, { yPercent: 115 });
  // L’ovale n’est pas masqué comme les mots : il apparaît flou puis net
  fenetre.closest('.wm')?.classList.add('wm--libre');
  fenetre.classList.add('is-floue');

  const logo = site?.accueil?.logo ?? {};
  let mono = null;
  let photo = null;
  if (logo.photo) {
    photo = document.createElement('img');
    photo.className = 'ouverture__photo';
    photo.src = logo.photo;
    if (logo.petite) photo.srcset = `${logo.petite} 1000w, ${logo.photo} 2560w`;
    photo.sizes = '100vw';
    photo.alt = '';
    photo.decoding = 'async';
    media.append(photo);
    media.classList.add('has-photo');
  } else {
    media.insertAdjacentHTML('beforeend', '<svg class="ouverture__mono" viewBox="60 51 1153 881"><use href="assets/img/sprite.svg#mono"/></svg>');
    mono = media.querySelector('.ouverture__mono');
  }
  let legende = null;
  if (logo.legende) {
    legende = document.createElement('p');
    legende.className = 'ouverture__legende micro';
    legende.textContent = logo.legende;
    media.append(legende);
  }

  // Mesures : position de l’ovale dans la section, sens de poussée de chaque mot
  let r0 = null;
  let W = 0;
  let H = 0;
  let sens = [];
  const mesurer = () => {
    const s = section.getBoundingClientRect();
    const r = fenetre.getBoundingClientRect();
    W = s.width; H = s.height;
    r0 = { l: r.left - s.left, t: r.top - s.top, r: s.right - r.right, b: s.bottom - r.bottom, w: r.width, h: r.height };
    sens = blocs.map((b) => {
      const m = b.getBoundingClientRect();
      const cy = (m.top + m.bottom) / 2;
      if (cy > r.top && cy < r.bottom) return m.right <= r.left + 1 ? 'g' : 'd';
      return cy < r.top ? 'h' : 'b';
    });
  };

  const etat = { t: 0 };
  const dessiner = () => {
    if (!r0) return;
    const e = etat.t;
    const L = r0.l * (1 - e);
    const T = r0.t * (1 - e);
    const R = r0.r * (1 - e);
    const B = r0.b * (1 - e);
    const w = W - L - R;
    const h = H - T - B;
    const k = (1 - e) ** 2;
    media.style.clipPath = `inset(${T}px ${R}px ${B}px ${L}px round ${(w / 2) * k}px / ${(h / 2) * k}px)`;
    if (photo) {
      // Le logo remplit d’abord l’ovale, puis l’image couvre tout l’écran
      const debut = (r0.w * 2) / 1000;
      const fin = Math.max(W / 1000, H / 562.5);
      photo.style.transform = `translate(${L + w / 2 - 500}px, ${T + h / 2 - 281.25}px) scale(${debut + (fin - debut) * e})`;
    }
    if (mono) {
      const hauteur = r0.h * 0.6 + (Math.min(H * 0.4, (W * 0.6) / 1.31) - r0.h * 0.6) * e;
      mono.style.transform = `translate(${L + w / 2 - 65.5}px, ${T + h / 2 - 50}px) scale(${hauteur / 100})`;
    }
    // Les mots suivent les bords de l’ovale
    blocs.forEach((b, i) => {
      const d = sens[i];
      const x = d === 'g' ? L - r0.l : d === 'd' ? r0.r - R : 0;
      const y = d === 'h' ? T - r0.t : d === 'b' ? r0.b - B : 0;
      b.style.transform = x || y ? `translate(${x}px, ${y}px)` : '';
    });
    if (legende) legende.style.opacity = Math.max(0, (e - 0.8) / 0.2);
  };

  // L’épinglage est posé dès le départ (mise en page stable, ancres justes) ;
  // le zoom ne se dessine qu’une fois l’ovale net.
  let pret = false;
  const dessinerSiPret = () => { if (pret) dessiner(); };
  gsap.to(etat, {
    t: 1,
    ease: 'power2.inOut',
    onUpdate: dessinerSiPret,
    scrollTrigger: {
      trigger: section,
      start: 'top top',
      end: '+=120%',
      pin: true,
      scrub: 0.6,
      anticipatePin: 1,
      onRefreshInit: () => blocs.forEach((b) => { b.style.transform = ''; }),
      onRefresh: () => { mesurer(); dessinerSiPret(); },
    },
  });

  // Image du zoom décodée dès le départ, en parallèle de l’entrée des mots
  const decodee = photo ? photo.decode().catch(() => {}) : Promise.resolve();
  const entree = () => {
    // Le calque plein cadre ne remplace l’ovale qu’une fois son image décodée :
    // pas d’image vide (ovale sombre) au moment du passage
    let lance = false;
    const zoom = async () => {
      if (lance) return;
      lance = true;
      removeEventListener('scroll', presser);
      await decodee;
      pret = true;
      mesurer();
      dessiner();
      section.classList.add('is-zoom');
    };
    const montrerOvale = () => {
      fenetre.classList.add('is-nette');
      fenetre.classList.remove('is-floue');
    };
    const mouvement = gsap.to(mots, { yPercent: 0, duration: 0.9, ease: EASE, stagger: 0.04 });
    // L’ovale arrive pendant l’entrée des mots, puis le zoom est prêt aussitôt net
    const ovale = gsap.delayedCall(0.3, montrerOvale);
    const pretZoom = gsap.delayedCall(0.9, zoom);
    // Si l’on fait défiler avant la fin, l’entrée se termine d’un coup : le zoom suit le scroll tout de suite
    const presser = () => {
      removeEventListener('scroll', presser);
      mouvement.progress(1);
      ovale.kill();
      pretZoom.kill();
      montrerOvale();
      zoom();
    };
    addEventListener('scroll', presser, { passive: true });
  };
  return { entree };
}

/* 3. Projets phares : bande de projets sous le sommaire ------------------- */
// « accueil » (1, 2, 3…) choisit les projets de la bande et leur ordre ;
// sans lui, les trois premiers projets phares
export function projetsAccueil(projets) {
  const choisis = projets.filter((p) => p.accueil).sort((a, b) => a.accueil - b.accueil);
  return choisis.length ? choisis : projets.filter((p) => p.phare).slice(0, 3);
}
function phares(projets) {
  const liste = document.querySelector('[data-phares-liste]');
  if (!liste) return;
  liste.dataset.n = String(projetsAccueil(projets).length);
  projetsAccueil(projets).forEach((p) => {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.className = 'bande__lien';
    a.href = urlProjet(p);
    const fig = document.createElement('div');
    fig.className = 'bande__media';
    const img = imageCouverture(p, { sizes: '(min-width: 1100px) 24vw, (min-width: 768px) 32vw, 80vw' });
    img.alt = '';
    fig.append(img);
    const nom = document.createElement('h3');
    nom.className = 'bande__nom';
    nom.textContent = p.titre;
    const cat = document.createElement('p');
    cat.className = 'bande__cat serif';
    cat.textContent = p.legende || p.categorieNom;
    a.append(fig, nom, cat);
    lienProjet(a, img);
    li.append(a);
    liste.append(li);
  });
  // Mobile : au clavier, la carte qui reçoit le focus vient se caler dans la bande
  liste.addEventListener('focusin', (e) => {
    const li = e.target.closest('li');
    if (li && liste.scrollWidth > liste.clientWidth) li.scrollIntoView({ inline: 'start', block: 'nearest', behavior: anime ? 'smooth' : 'auto' });
  });
}

/* Changements de fond : la section qui s’en va recule sous la suivante ---- */
function profondeur() {
  if (!anime) return;
  document.querySelectorAll('[data-recul]').forEach((sec) => {
    const contenu = sec.querySelector('[data-recul-contenu]');
    if (!contenu) return;
    gsap.to(contenu, {
      y: () => sec.offsetHeight * 0.15, ease: 'none',
      scrollTrigger: { trigger: sec, start: 'bottom bottom', end: 'bottom top', scrub: true, invalidateOnRefresh: true },
    });
  });
  document.querySelectorAll('[data-parallaxe]').forEach((img) => {
    gsap.fromTo(img, { yPercent: -6 }, {
      yPercent: 6, ease: 'none',
      scrollTrigger: { trigger: img.parentElement, start: 'top bottom', end: 'bottom top', scrub: true },
    });
  });
}

// Ils m’ont fait confiance : la liste est doublée pour boucler sans raccord.
// Sans animation, les logos restent posés au centre.
function bandeau() {
  const bloc = document.querySelector('[data-bandeau]');
  if (!bloc || reduit) return;
  const liste = bloc.querySelector('.confiance__liste');
  const copie = liste.cloneNode(true);
  copie.setAttribute('aria-hidden', 'true');
  copie.inert = true;
  copie.querySelectorAll('img').forEach((im) => { im.alt = ''; });
  liste.after(copie);
  bloc.classList.add('is-defile');
  // Vitesse constante (environ 50 px/s), quelle que soit la largeur de l’écran
  const caler = () => bloc.style.setProperty('--duree', `${Math.max(20, liste.offsetWidth / 50)}s`);
  caler();
  addEventListener('resize', caler, { passive: true });
}

async function init() {
  initCommun();
  if (ST) ST.config({ ignoreMobileResize: true });
  let donnees;
  try {
    donnees = await chargerDonnees();
  } catch (e) {
    console.error('Contenus introuvables', e);
  }
  if (donnees) lier(donnees);
  const { entree } = ouverture(donnees?.site);
  if (donnees) {
    phares(donnees.projets);
  }
  bandeau();
  revelations();
  profondeur();
  await loader();
  entree?.();
  if (ST) {
    document.fonts?.ready.then(() => ST.refresh());
    addEventListener('load', () => ST.refresh());
  }
}

init();
