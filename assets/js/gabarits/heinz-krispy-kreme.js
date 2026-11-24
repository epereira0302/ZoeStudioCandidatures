// Gabarit « Non… et pourtant si. » (Heinz × Krispy Kreme, 1er avril 2026),
// d’après la maquette d’Enzo (2026-11-05, 13 planches) : même mise en page que
// Columbus, Studio Zoé et Glowy Winter, l’encart aubergine fixe à gauche, les
// visuels à droite. Deux interactions demandées par Enzo : les trois bouteilles
// de sauce se soulèvent au survol, et les onglets Barbecue / Ketchup /
// Firecracker ouvrent un dossier où le donut de la sauce apparaît, avec un
// morphing qui le fait tourner sur lui-même à chaque changement.

import { suivi } from './columbus.js?v=20261124g';

let dossier = '';
const LARGE = '(min-width: 900px) 75vw, 100vw';

// Image en deux tailles (« -s » = moitié de la largeur)
const img = (nom, w, h, alt, sizes = LARGE, plus = '') => `<img src="${dossier}/${nom}-s.webp" srcset="${dossier}/${nom}-s.webp ${Math.round(w / 2)}w, ${dossier}/${nom}.webp ${w}w" sizes="${sizes}" width="${w}" height="${h}" alt="${alt}" loading="lazy" decoding="async"${plus}>`;
// Visuel qui se pose au scroll (106 % → 100 %), comme sur Columbus
const z = (contenu, classe = '') => `<figure class="cl-z ${classe}">${contenu}</figure>`;

const CHAPITRES = [
  ['hk-revelation', 'La révélation'],
  ['hk-teasing', 'Le teasing'],
  ['hk-sauces', 'Les sauces'],
  ['hk-donuts', 'Les donuts'],
  ['hk-making-of', 'Le making-of'],
];

// Bouteilles : fichier, nom, position sur la planche 7 (en % de la bande crème)
// et couleur de la sauce pour le filet qui coule quand la bouteille se soulève
const BOUTEILLES = [
  ['ketchup', 'Tomato Ketchup', 8.13, 24.15, '#c40d1b'],
  ['firecracker', 'Firecracker Sauce', 37.35, 24.38, '#9c3f4f'],
  ['barbecue', 'Classic Barbecue', 66.65, 24.65, '#3b120c'],
];

// Slides du post du 1er avril : fichier, nom, largeur relevée sur la planche 4, hauteur, description
const SLIDES = [
  ['slide-1', 'Teasing', 1782, 1507, 'Slide 1 : « Non. », Heinz × Krispy Kreme, les bouteilles et les trois donuts pixelisés sur fond rouge'],
  ['slide-2', 'Reveal', 1903, 1411, 'Slide 2 : « Et pourtant si. », les bouteilles Classic Barbecue et Tomato Ketchup et les trois donuts nets'],
  ['slide-3', 'Présentation', 2184, 1230, 'Slide 3 : les trois donuts devant la bouteille de ketchup et une boîte Krispy Kreme, « C’était inévitable. C’est le 1er avril. »'],
];

// Dossiers : sauce, couleurs de l’onglet (fond, texte), donut, description
const SAUCES = [
  ['barbecue', 'Barbecue', 1600, 1527, 'Donut Barbecue : glaçage caramel nappé, éclats de pop-corn et plaque Heinz'],
  ['ketchup', 'Ketchup', 1600, 1571, 'Donut Ketchup : fourré au ketchup, glaçage rouge brillant et plaque Heinz'],
  ['firecracker', 'Firecracker', 1600, 1733, 'Donut Firecracker : beignet roulé dans le sucre et plaque Heinz'],
];

// Sauce qui sort du bouchon quand la bouteille est en l’air (Enzo, 2026-11-05) :
// un boudin brillant qui tombe du bec puis dessine une vague au sol, comme sur
// ses références ; texture tirée de ses PSD, teintée à la couleur du tube.
// Repère : 100 unités = largeur de la bouteille, le bouchon levé est vers y 190.
const BEC = { ketchup: 55.9, firecracker: 46.3, barbecue: 45.3 };
function sauce(f) {
  const x = BEC[f];
  const d = `M ${x} 182 C ${x} 196 ${x - 1} 203 ${x - 6} 208 C ${x - 12} 213 ${x - 30} 203 ${x - 33} 210 C ${x - 36} 218 ${x - 24} 225 ${x - 15} 219 C ${x - 7} 213 ${x - 7} 204 ${x + 1} 206 C ${x + 9} 208 ${x + 6} 224 ${x + 16} 222 C ${x + 25} 220 ${x + 24} 207 ${x + 32} 208 C ${x + 39} 209 ${x + 40} 216 ${x + 46} 217`;
  return `<svg class="hk-sauce" viewBox="0 0 100 236" aria-hidden="true" focusable="false">
            <defs>
              <pattern id="hk-tex-${f}" patternUnits="userSpaceOnUse" width="60" height="60"><image href="${dossier}/texture-${f}.webp" width="60" height="60" preserveAspectRatio="xMidYMid slice"/></pattern>
            </defs>
            <ellipse class="hk-sauce__flaque" cx="${x - 6}" cy="210" rx="9" ry="3.2"/>
            <path class="hk-sauce__ombre" d="${d}" pathLength="1"/>
            <path class="hk-sauce__bord" d="${d}" pathLength="1"/>
            <path class="hk-sauce__trait" d="${d}" pathLength="1" stroke="url(#hk-tex-${f})"/>
            <path class="hk-sauce__volume" d="${d}" pathLength="1"/>
            <path class="hk-sauce__reflet" d="${d}" pathLength="1"/>
            <ellipse class="hk-sauce__goutte" cx="${x}" cy="183.5" rx="3.9" ry="2.6"/>
          </svg>`;
}

// Crédits par équipe : [{ equipe, membres: [[nom, rôle]] }]
function credits(liste) {
  if (!liste?.length) return '';
  return `<h2 class="cl-credits__titre">Crédits</h2>
        ${liste.map(({ equipe, membres }) => `<h3>${equipe}</h3>
        <ul class="hk-credits">${membres.map(([nom, role]) => `<li><span translate="no">${nom}</span> : ${role}</li>`).join('')}</ul>`).join('')}`;
}

function gabarit(p) {
  const menu = (classe) => CHAPITRES.map(([id, nom]) => `<a class="${classe}" href="#${id}" data-chap="${id}">${nom}</a>`);
  const texte = [p.description, ...(p.texte ?? [])].map((t) => `<p>${t}</p>`).join('');
  return `
<article class="cl hk" data-cl>
  <aside class="cl-encart" aria-label="Le projet" data-cl-encart>
   <div class="cl-encart__defile" data-cl-defile>
    <dl class="cl-encart__haut">
      <div><dt>Client</dt><dd translate="no">${p.client}</dd></div>
      <div><dt>Année</dt><dd>${p.annee}</dd></div>
    </dl>
    <h1 class="cl-encart__titre hk-titre">${p.nom || p.titre}</h1>
    <p class="cl-encart__sous">${p.type}</p>
    <div class="cl-encart__texte hk-encart__texte">${texte}</div>
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
  <div class="cl-visuels hk-visuels" data-cl-visuels>
    <section class="cl-chap" id="hk-revelation" aria-label="La révélation" data-ouverture>
      <figure class="hk-bande">${img('logos', 2400, 458, 'Heinz, établi en 1869, × Krispy Kreme Doughnuts', LARGE, ' fetchpriority="high"').replace('loading="lazy"', 'loading="eager"')}</figure>
      <figure class="hk-bande">${img('annonce', 2400, 771, 'Le 1er avril, on révèle enfin la collaboration avec un visuel des donuts, et une nouvelle tagline :', LARGE).replace('loading="lazy"', 'loading="eager"')}</figure>
      <figure class="hk-bande">${img('non', 2400, 1218, 'Non. Et pourtant si.')}</figure>
      ${z(img('coulures', 2400, 1152, 'Trois temps d’une coulée de sauce Heinz qui nappe un donut, sur fond gris clair'))}
      ${z(img('gros-plan', 2400, 1800, 'Gros plan sur un donut entièrement nappé de sauce rouge brillante'))}
      <div class="hk-slides">
        <figure class="hk-bande">${img('inevitable-titre', 2400, 317, 'C’était inévitable. C’est le 1er avril.')}</figure>
        <ol class="hk-slides__liste">
          ${SLIDES.map(([f, nom, w, h, alt], i) => `<li style="--fr:${w}">
            <p class="hk-slides__nom">Slide ${i + 1} : ${nom}</p>
            ${img(f, 1200, h, alt, '(min-width: 900px) 25vw, 33vw')}
          </li>`).join('')}
        </ol>
      </div>
      ${z(img('boite', 2400, 2180, 'Les trois donuts sur fond rouge : le donut Ketchup coupé en deux sur une boîte Krispy Kreme, devant une bouteille de Tomato Ketchup, avec le donut Barbecue et le donut Firecracker'))}
    </section>
    <section class="cl-chap" id="hk-teasing" aria-label="Le teasing">
      <figure class="hk-bande">${img('teasing-titre', 2400, 342, 'Teasing du lancement')}</figure>
      <figure class="hk-bande">${img('teasing-photos', 2400, 825, 'Le stand Heinz × Krispy Kreme ; la vitrine de la boutique floutée « T’étais pas censé voir ça. Heinz × Krispy Kreme, trop bon pour être partagé » ; une invitée pose avec une bouteille de ketchup devant le mur de logos')}</figure>
      ${z(img('firecracker', 2400, 1012, 'Le donut Firecracker et sa plaque Heinz devant l’étiquette rose de la Firecracker Sauce'))}
    </section>
    <section class="cl-chap" id="hk-sauces" aria-label="Les sauces">
      <div class="hk-bouteilles" data-hk-bouteilles>
        ${BOUTEILLES.map(([f, nom, x, w, c]) => `<figure class="hk-bouteille" style="--x:${x}%; --w:${w}%; --sauce:${c}">
          <span class="hk-bouteille__ombre" aria-hidden="true"></span>
          ${sauce(f)}
          <img class="hk-bouteille__img" src="${dossier}/bouteille-${f}-s.webp" srcset="${dossier}/bouteille-${f}-s.webp 500w, ${dossier}/bouteille-${f}.webp 1000w" sizes="(min-width: 900px) 19vw, 25vw" width="1000" height="2160" alt="Bouteille Heinz ${nom}" loading="lazy" decoding="async">
        </figure>`).join('')}
      </div>
      <figure class="hk-cense"><video muted loop playsinline preload="none" width="1280" height="720" poster="${dossier}/video-cense-poster.webp" aria-label="Animation : « T’étais pas censé voir ça » en grand sur des gros plans de donuts, de pâte et de glaçage" data-hk-video><source src="${dossier}/video-cense.mp4" type="video/mp4"></video></figure>
      ${z(img('photo-sauces', 2400, 1792, 'Les bouteilles Classic Barbecue et Tomato Ketchup derrière les trois donuts, avec les logos Krispy Kreme et Heinz'))}
    </section>
    <section class="cl-chap hk-dossiers" id="hk-donuts" aria-label="Les donuts" data-hk-dossiers data-ouvert="barbecue">
      <div class="hk-onglets" role="group" aria-label="Choisir une sauce">
        ${SAUCES.map(([s, nom], i) => `<button class="hk-onglet hk-onglet--${s}" type="button" aria-pressed="${i === 0}" aria-controls="hk-dossier" data-sauce="${s}">${nom}</button>`).join('')}
      </div>
      <div class="hk-dossier" id="hk-dossier" data-hk-dossier>
        <div class="hk-dossier__interieur">
          <div class="hk-dossier__scene">
            ${SAUCES.map(([s, , w, h, alt]) => `<img class="hk-donut" src="${dossier}/donut-${s}-s.webp" srcset="${dossier}/donut-${s}-s.webp 800w, ${dossier}/donut-${s}.webp 1600w" sizes="(min-width: 900px) 50vw, 75vw" width="${w}" height="${h}" alt="${alt}" loading="lazy" decoding="async" data-donut="${s}"${s === 'barbecue' ? '' : ' hidden'}>`).join('')}
          </div>
        </div>
      </div>
      <p class="sr-only" aria-live="polite" data-hk-annonce></p>
    </section>
    <section class="cl-chap hk-making-of" id="hk-making-of" aria-label="Le making-of">
      <figure class="hk-cense"><video muted loop playsinline preload="none" width="1920" height="1080" poster="${dossier}/video-making-of-poster.webp" aria-label="Making-of en trois écrans de téléphone : le donut trempé dans la sauce, la prise de vue sur fond rouge avec les bouteilles Heinz, la retouche à l’ordinateur" data-hk-video><source src="${dossier}/video-making-of.mp4" type="video/mp4"></video></figure>
    </section>
    <div class="cl-credits cl-credits--mobile" data-theme="cl-encart">${credits(p.credits)}</div>
  </div>
</article>`;
}

/* Entrée du gabarit --------------------------------------------------------- */
export async function rendre(p) {
  dossier = p.dossier;
  document.body.classList.add('page-cl', 'page-hk');
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', '#200603');
  const main = document.querySelector('main');
  main.querySelectorAll('[data-projet-hero], [data-projet-intro], [data-projet="galerie"]').forEach((n) => n.remove());
  main.insertAdjacentHTML('afterbegin', gabarit(p));
  const header = document.querySelector('.header');
  delete header.dataset.fixeApres;
  header.dataset.on = 'cl-noir';
  const encart = main.querySelector('[data-cl-encart]');
  const mobile = matchMedia('(max-width: 899px)');
  const theme = () => { if (mobile.matches) encart.dataset.theme = 'cl-encart'; else delete encart.dataset.theme; };
  theme();
  mobile.addEventListener('change', () => { theme(); dispatchEvent(new Event('resize')); });
}

const calme = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

// Bouteilles : elles se soulèvent au survol (CSS :hover) ; au doigt, un appui
// soulève la bouteille touchée et repose les autres
function bouteilles() {
  const bloc = document.querySelector('[data-hk-bouteilles]');
  const items = [...bloc.querySelectorAll('.hk-bouteille')];
  items.forEach((b) => b.addEventListener('pointerdown', (e) => {
    if (e.pointerType === 'mouse') return;
    const deja = b.classList.contains('is-leve');
    items.forEach((x) => x.classList.remove('is-leve'));
    if (!deja) b.classList.add('is-leve');
  }));
}

// Dossiers : un onglet ouvre le dossier sur le donut de sa sauce ; un autre
// onglet fait tourner le donut sur lui-même en se transformant (flou, échelle,
// rotation croisés) ; l’onglet actif referme le dossier
function dossiers() {
  const bloc = document.querySelector('[data-hk-dossiers]');
  const dossierEl = bloc.querySelector('[data-hk-dossier]');
  const onglets = [...bloc.querySelectorAll('[data-sauce]')];
  const donuts = Object.fromEntries([...bloc.querySelectorAll('[data-donut]')].map((d) => [d.dataset.donut, d]));
  const annonce = bloc.querySelector('[data-hk-annonce]');
  const DUREE = 900;
  let actif = bloc.dataset.ouvert;   // Barbecue ouvert par défaut (Enzo, 2026-11-05)

  // Les donuts se chargent dès que le dossier approche de l’écran
  new IntersectionObserver((entrees, obs) => {
    if (!entrees.some((e) => e.isIntersecting)) return;
    Object.values(donuts).forEach((d) => { d.loading = 'eager'; });
    obs.disconnect();
  }, { rootMargin: '600px 0px' }).observe(bloc);

  const sortie = [
    { transform: 'rotate(0deg) scale(1)', filter: 'blur(0px)', opacity: 1 },
    { transform: 'rotate(150deg) scale(0.82)', filter: 'blur(14px)', opacity: 0.6, offset: 0.55 },
    { transform: 'rotate(240deg) scale(0.7)', filter: 'blur(26px)', opacity: 0 },
  ];
  const entree = [
    { transform: 'rotate(-240deg) scale(0.7)', filter: 'blur(26px)', opacity: 0 },
    { transform: 'rotate(-90deg) scale(0.9)', filter: 'blur(12px)', opacity: 0.75, offset: 0.45 },
    { transform: 'rotate(0deg) scale(1)', filter: 'blur(0px)', opacity: 1 },
  ];
  const ouverture = [
    { transform: 'translateY(8%) rotate(-120deg) scale(0.6)', filter: 'blur(18px)', opacity: 0 },
    { transform: 'translateY(0) rotate(0deg) scale(1)', filter: 'blur(0px)', opacity: 1 },
  ];

  function choisir(s) {
    const avant = actif;
    actif = avant === s ? '' : s;
    bloc.dataset.ouvert = actif;
    onglets.forEach((o) => o.setAttribute('aria-pressed', String(o.dataset.sauce === actif)));
    const nom = onglets.find((o) => o.dataset.sauce === s)?.textContent;
    annonce.textContent = actif ? `Dossier ${nom} ouvert` : 'Dossier fermé';
    if (!actif) return;
    const nouveau = donuts[actif];
    const ancien = avant ? donuts[avant] : null;
    nouveau.hidden = false;
    Object.values(donuts).forEach((d) => d.getAnimations().forEach((a) => a.finish()));
    if (calme()) {
      if (ancien) ancien.hidden = true;
      return;
    }
    if (!ancien) {
      nouveau.animate(ouverture, { duration: 800, delay: 120, easing: 'cubic-bezier(0.22, 1, 0.36, 1)', fill: 'backwards' });
      return;
    }
    ancien.classList.add('is-sortant');
    ancien.animate(sortie, { duration: DUREE * 0.75, easing: 'cubic-bezier(0.55, 0, 0.75, 0.25)' }).finished
      .then(() => { if (actif !== avant) ancien.hidden = true; ancien.classList.remove('is-sortant'); }, () => {});
    nouveau.animate(entree, { duration: DUREE, delay: DUREE * 0.25, easing: 'cubic-bezier(0.22, 1, 0.36, 1)', fill: 'backwards' });
  }

  onglets.forEach((o) => o.addEventListener('click', () => {
    const s = o.dataset.sauce;
    // Changement : on cache tout de suite les donuts qui ne jouent aucun rôle
    Object.entries(donuts).forEach(([k, d]) => { if (k !== s && k !== actif) d.hidden = true; });
    choisir(s);
    if (!actif) Object.values(donuts).forEach((d) => { setTimeout(() => { if (!bloc.dataset.ouvert) d.hidden = true; }, 600); });
  }));
  dossierEl.addEventListener('transitionend', () => dispatchEvent(new Event('resize')));
}

// Vidéos (« T’étais pas censé voir ça », making-of) : muettes, elles tournent dès
// qu’elles sont à l’écran ; si le navigateur refuse la lecture automatique, un clic les lance
function videosHk() {
  document.querySelectorAll('[data-hk-video]').forEach((v) => {
    v.muted = true;
    v.defaultMuted = true;
    if (calme()) { v.autoplay = false; v.removeAttribute('autoplay'); v.pause(); v.controls = true; return; }
    const lancer = () => v.play().catch((err) => { if (err.name === 'NotAllowedError') document.dispatchEvent(new CustomEvent('sz:bloquee', { detail: { video: v, commandes: true } })); });
    // Chargement un écran avant d’arriver (quelques Mo : pas au départ de la page)
    new IntersectionObserver(([e], obs) => { if (e.isIntersecting) { v.preload = 'auto'; obs.disconnect(); } }, { rootMargin: '100% 0px' }).observe(v);
    new IntersectionObserver(([e]) => { if (e.isIntersecting) lancer(); else v.pause(); }, { rootMargin: '10% 0px' }).observe(v);
    v.addEventListener('click', () => { if (v.paused) lancer(); });
  });
}

export function animer() {
  suivi();
  videosHk();
  bouteilles();
  dossiers();
  dispatchEvent(new Event('resize'));
}
