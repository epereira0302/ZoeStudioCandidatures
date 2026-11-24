// Gabarit « Studio Zoé » (identité visuelle du studio), mis en page comme
// Columbus (Enzo, 2026-10-27) : l’encart aubergine fixe à gauche, les visuels
// bord à bord à droite. La partie typographie reprend la vidéo de référence
// d’Enzo (titre et grand rond, grille de glyphes, colonnes des graisses du Z,
// testeur à curseurs, glyphes d’Abril sur leurs lignes) ; le catalogue des Moires se feuillette page à page.
// Gyst et Abril ne sont pas fournies en fichiers de police : leurs lettres sont
// tracées depuis la charte (glyphes-gyst.svg, glyphes-abril.svg).

import { reduit } from '../commun.js';
import { suivi, videos } from './columbus.js?v=20261124g';

let dossier = '';
const LARGE = '(min-width: 900px) 75vw, 100vw';
const DEMI = '(min-width: 900px) 38vw, 100vw';
const TIERS = '(min-width: 900px) 25vw, 50vw';
const QUART = '(min-width: 900px) 19vw, 50vw';

// Image en deux tailles (« -s » = moitié de la largeur)
const img = (nom, w, h, alt, sizes = LARGE) => `<img src="${dossier}/${nom}-s.webp" srcset="${dossier}/${nom}-s.webp ${Math.round(w / 2)}w, ${dossier}/${nom}.webp ${w}w" sizes="${sizes}" width="${w}" height="${h}" alt="${alt}" loading="lazy" decoding="async">`;
const video = (nom, w, h, alt) => `<video muted loop playsinline preload="none" width="${w}" height="${h}" poster="${dossier}/${nom}-poster.webp" aria-label="${alt}" data-cl-video><source src="${dossier}/${nom}.mp4" type="video/mp4"></video>`;
// Visuel bord à bord qui se pose au scroll (106 % → 100 %)
const z = (contenu, { classe = '', theme = '' } = {}) => `<figure class="cl-z ${classe}"${theme ? ` data-theme="${theme}"` : ''}>${contenu}</figure>`;
// Logo teint par masque (l’url reste relative à la page, pas à la feuille de style)
const masque = (f) => `-webkit-mask-image:url('${dossier}/${f}.webp'); mask-image:url('${dossier}/${f}.webp');`;
// Visuel détouré au centre d’une case de couleur
const caseFond = (theme, contenu, classe = '') => `<figure class="sz-case ${classe}" data-theme="${theme}">${contenu}</figure>`;

const CHAPITRES = [
  ['sz-nom', 'Le nom'],
  ['sz-logo', 'Construction du logo'],
  ['sz-symbole', 'Le symbole'],
  ['sz-couleurs', 'Couleurs'],
  ['sz-typos', 'Typographies'],
  ['sz-applications', 'Applications'],
]

// Les six couleurs de la charte, nommées d’après les Moires
const COULEURS = [
  // Fil de vie décalé à droite : la bande ne touche pas le texte rose de la slide au-dessus
  ['Clotho', '#37121E', 'is-sombre'], ['Atropos', '#705622', 'is-sombre'], ['Lachésis', '#FFEDE3'],
  ['Destin', '#D3E9F4'], ['Fil de vie', '#FF1FA3'], ['Déesse', '#F2B0DC'],
];
// Colonnes de la typo : une graisse de Gyst par colonne, un fond et une encre de la charte
const COLONNES = [
  ['Light', 'light', '#37121E', '#F2B0DC'], ['Regular', 'regular', '#705622', '#FFEDE3'],
  ['Medium', 'medium', '#FF1FA3', '#37121E'], ['Bold', 'bold', '#D3E9F4', '#37121E'],
];

// Applications : les trois livrets qui s’enchaînent au centre (vidéo d’Enzo)
const DEFILE = [
  ['defile-carte-1', 'Livret « Direction artistique et design graphique » : carte kaki au symbole aubergine entre deux bandes bleues, sur fond aubergine'],
  ['defile-carte-2', 'Le même livret en rose et aubergine, symbole bleu clair, sur fond gris bleu'],
  ['defile-carte-3', 'Le livret en lilas, carte aubergine au symbole rose entre deux bandes kaki, sur fond rose'],
];

// Déclinaisons du logo : fichier, nom, fond, encre (le logo est teint par masque)
const LOGOS = [
  ['logo-tagline', 'Logo et tagline', 1200, 750, 'sz-lachesis'],
  ['logo', 'Logo', 1200, 562, 'sz-clotho'],
  ['logotype-tagline', 'Logotype et tagline', 1200, 347, 'sz-destin'],
  ['logo-symbole', 'Symbole', 1200, 914, 'sz-atropos'],
  ['logotype', 'Logotype', 1200, 200, 'sz-deesse'],
  ['tagline', 'Tagline', 1200, 146, 'sz-lachesis'],
];

// Construction du logo : grille, hauteur d’x et zone de protection (d’après la charte)
function schema() {
  const H = [189, 318, 349, 479, 511, 543];
  const V = [132, 463, 508, 771];
  const ligne = (x1, y1, x2, y2, c) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" class="${c}"/>`;
  const boite = (x, y, w, h, texte = '') => `<rect x="${x}" y="${y}" width="${w}" height="${h}" class="sz-schema__rose"/>${texte ? `<text x="${x + w / 2}" y="${y + h / 2}">${texte}</text>` : ''}`;
  return `<svg class="sz-schema" viewBox="0 0 892 696" role="img" aria-label="Construction du logo : la hauteur des capitales vaut x ; les lignes sont séparées d’un quart de x ; la zone de protection autour du logo vaut la moitié de x">
            <rect x="69" y="125" width="63" height="64" class="sz-schema__bleu"/><rect x="69" y="543" width="63" height="63" class="sz-schema__bleu"/><rect x="771" y="543" width="65" height="63" class="sz-schema__bleu"/>
            ${H.map((y) => ligne(48, y, 862, y, 'sz-schema__guide')).join('')}
            ${V.map((x) => ligne(x, 64, x, 656, 'sz-schema__guide')).join('')}
            ${ligne(48, 125, 862, 125, 'sz-schema__cadre')}${ligne(48, 606, 862, 606, 'sz-schema__cadre')}
            ${ligne(69, 60, 69, 665, 'sz-schema__cadre')}${ligne(836, 60, 836, 665, 'sz-schema__cadre')}
            <image href="${dossier}/construction-logo.webp" x="0" y="0" width="892" height="696"/>
            ${boite(771, 189, 65, 129, 'x')}${boite(302, 318, 63, 31, '1/4x')}${boite(326, 479, 63, 32, '1/4x')}${boite(672, 511, 63, 32, '1/4x')}
          </svg>`;
}

// Catalogue « Les Moires » : chaque page pleine a un haut et un bas, séparés
// par les anneaux. Comme un calendrier à anneaux, on tourne une seule feuille :
// le haut bascule par-dessus les anneaux, son dos devient le bas de la page suivante
const LIVRE = [
  [6, 'L’aiguille et son fil de cuivre'],
  [2, 'Une main tient un fil de lin au-dessus d’un plateau'],
  [4, 'Deux fileuses au travail, une Moire coupe le fil aux ciseaux'],
];

const PANGRAMME = ['L’ÉQUILIBRE', 'DES CONTRASTES'];
const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
// Titre en Abril : chaque lettre et son écart avec la précédente (en millièmes
// de la hauteur de capitale), relevés sur la charte
const TITRE_ABRIL = [
  [['U', 0], ['n', 70], ['e', 78]],
  [['t', 0], ['o', 36], ['u', 109], ['c', 73], ['h', 52], ['e', 78]],
  [['d', 0], ['e', 62]],
  [['ﬁ', -90], ['n', 88], ['e', 78], ['s', 62], ['s', 52], ['e', 67]],
];
// Glyphes d’Abril présents dans la charte, et ses lignes de référence
const GLYPHES_ABRIL = [
  ['Capitales', 'ABCEGJPSTVZ'],
  ['Minuscules', 'abcdefghiklmnopqrstuy'],
  ['Accents et ligatures', 'àçèéﬁﬂ'],
];
const LIGNES_ABRIL = [
  ['Ascendante', -1067], ['Hauteur de capitale', -1000], ['Hauteur d’x', -694], ['Ligne de base', 0], ['Descendante', 316],
];

/* Lettres tracées ------------------------------------------------------------ */
// Proportions de chaque lettre (viewBox de son symbole), lues dans les fichiers tracés
const CADRES = {};
const lettre = (id, classe, attr = '') => `<svg class="${classe}"${attr} viewBox="${CADRES[id] || '0 0 1 1'}" aria-hidden="true"><use href="#${id}"/></svg>`;
const gyst = (L, classe = 'sz-g', nom = L) => lettre(`gyst-${L}`, classe, ` data-l="${nom}"`);
const abril = (c, classe = 'sz-a') => lettre(`abril-${c.codePointAt(0)}`, classe);
// Lettres de Gyst hors de l’alphabet tracé : É et l’apostrophe
const GYST_PLUS = { É: 'Eaigu', '’': 'apos', "'": 'apos' };
// Une ligne de texte en Gyst : mots insécables, É gardé, autres accents retirés
function ligneGyst(texte) {
  const propre = [...texte.toUpperCase()].map((c) => (GYST_PLUS[c] ? c : c.normalize('NFD').replace(/[̀-ͯ]/g, ''))).join('');
  return propre.split(/\s+/).filter(Boolean).map((mot) => `<span class="sz-mot">${[...mot].filter((c) => ALPHABET.includes(c) || GYST_PLUS[c]).map((c) => (GYST_PLUS[c] ? gyst(GYST_PLUS[c], 'sz-g', c) : gyst(c))).join('')}</span>`).join(' ');
}

/* Typographies (vidéo de référence d’Enzo) ----------------------------------- */
function typos() {
  const rond = (id, contenu, libelle) => `<div class="sz-rond" id="${id}" role="img" aria-label="${libelle}" data-sz-rond>${contenu}</div>`;
  // Libellés de bloc : le premier à gauche, le second calé à droite de la page, à la même marge
  const ent = (a, b) => `<p class="sz-typo__ent"><span>${a}</span><span>${b}</span></p>`;
  return `
      <div class="sz-typo" data-theme="sz-blanc">
        ${ent('Gyst', 'Studio Phospho')}
        <div class="sz-typo__panneau">
          <p class="sz-pangramme" role="img" aria-label="L’équilibre des contrastes, en Gyst" data-sz-survol="sz-rond-gyst">${PANGRAMME.map((l) => `<span class="sz-pangramme__ligne">${ligneGyst(l)}</span>`).join('')}</p>
          <p class="sz-typo__texte">La police Gyst est une typographie néo-humaniste créée par le studio Phospho. Ses contrastes marqués lui donnent une allure élégante et assurée dans les titres, sans rien perdre de sa lisibilité. Polyvalente et pleine de caractère, Gyst s’accorde naturellement avec les courbes du symbole de Studio Zoé.</p>
        </div>
        <div class="sz-typo__panneau sz-typo__panneau--rond">${rond('sz-rond-gyst', gyst('G', 'sz-rond__g'), 'La lettre G en Gyst')}</div>
      </div>

      <div class="sz-typo" data-theme="sz-lachesis">
        ${ent('Gyst', 'Capitales')}
        <div class="sz-typo__panneau">
          <ul class="sz-glyphes" aria-label="Les capitales de Gyst : survolez ou choisissez une lettre" data-sz-survol="sz-rond-glyphes">
            ${[...ALPHABET].map((L) => `<li><button class="sz-glyphes__btn" type="button" aria-label="${L}" aria-controls="sz-rond-glyphes" data-l="${L}">${gyst(L)}</button></li>`).join('')}
          </ul>
        </div>
        <div class="sz-typo__panneau sz-typo__panneau--rond">${rond('sz-rond-glyphes', gyst('S', 'sz-rond__g'), 'La lettre S en Gyst')}</div>
      </div>

      <div class="sz-colonnes" data-theme="sz-blanc" data-sz-colonnes>
        ${COLONNES.map(([nom, graisse, fond, encre], i) => `<button class="sz-colonnes__col${i === 0 ? ' is-ouverte' : ''}" type="button" aria-pressed="${i === 0}" style="--fond:${fond}; --encre:${encre}">
          <span class="sz-colonnes__nom">${nom}</span>
          ${lettre(`gyst-Z-${graisse}`, 'sz-colonnes__s')}
          <span class="sr-only">: le Z de Gyst ${nom}</span>
        </button>`).join('')}
      </div>

      <div class="sz-testeur" data-theme="sz-blanc" data-sz-testeur>
        <div class="sz-testeur__reglages">
          <label class="sz-testeur__reglage"><span>Taille</span><output data-sz-sortie="taille">120 px</output><input type="range" min="32" max="220" value="120" name="taille" data-sz-reglage="taille"></label>
          <label class="sz-testeur__reglage"><span>Interlettrage</span><output data-sz-sortie="lettres">4 %</output><input type="range" min="-4" max="30" value="4" name="lettres" data-sz-reglage="lettres"></label>
          <label class="sz-testeur__reglage"><span>Interlignage</span><output data-sz-sortie="lignes">110 %</output><input type="range" min="90" max="170" value="110" name="lignes" data-sz-reglage="lignes"></label>
          <label class="sz-testeur__reglage sz-testeur__reglage--texte"><span>Votre texte</span><input type="text" name="texte" value="Le fil de la vie" maxlength="60" autocomplete="off" spellcheck="false" data-sz-texte></label>
        </div>
        <p class="sz-testeur__rendu" role="img" data-sz-rendu></p>
      </div>

      <div class="sz-typo sz-typo--abril" data-theme="sz-destin">
        ${ent('Abril', 'TypeTogether')}
        <div class="sz-typo__panneau">
          <p class="sz-signature" role="img" aria-label="Une touche de finesse, en Abril italique">${TITRE_ABRIL.map((mot) => `<span class="sz-mot">${mot.map(([c, ecart]) => `<span class="sz-signature__l" style="margin-left:${ecart / 1000}em">${abril(c)}</span>`).join('')}</span>`).join('')}</p>
          <p class="sz-typo__texte">Abril est une famille sérif dessinée par Veronika Burian et José Scaglione pour la fonderie TypeTogether. Elle signe en italique la mention « Création graphique » de Studio Zoé : plus douce et plus fluide, elle complète la Gyst du nom et apporte une touche de finesse à l’ensemble du logo.</p>
        </div>
      </div>
      ${explorateur()}
      <div class="sz-g3" data-theme="sz-clotho">
        ${z(img('carte-visite', 1080, 1350, 'Carte de visite bleue au symbole aubergine, posée entre une peinture et du bois, décembre 2023', TIERS), { classe: 'sz-portrait' })}
        <figure class="sz-portrait sz-defile" data-sz-defile>
          ${DEFILE.map(([f, alt], k) => img(f, 1080, 1350, alt, TIERS).replace('<img ', `<img class="${k === 0 ? 'is-actif' : ''}" `)).join('')}
        </figure>
        ${z(img('enveloppe', 1080, 1350, 'Enveloppe vert sauge marquée du symbole aubergine, sur bois et peinture, décembre 2023', TIERS), { classe: 'sz-portrait' })}
      </div>`;
}

/* Glyphes d’Abril (vidéo d’Enzo) : la lettre choisie s’affiche en grand,
   posée sur ses lignes de référence */
function explorateur() {
  const H0 = -1250; // haut du cadre, en unités de la lettre
  const HT = 1800;
  const LT = 3000;
  const pos = (y) => `${((y - H0) / HT) * 100}%`;
  return `
      <div class="sz-glyphes-a" data-theme="sz-destin" data-sz-abril>
        <div class="sz-glyphes-a__choix">
          ${GLYPHES_ABRIL.map(([titre, lettres]) => `
          <p class="sz-glyphes-a__titre" id="sz-ga-${titre.slice(0, 3).toLowerCase()}">${titre}</p>
          <ul class="sz-glyphes-a__grille" aria-labelledby="sz-ga-${titre.slice(0, 3).toLowerCase()}">
            ${[...lettres].map((c) => `<li><button class="sz-glyphes-a__btn${c === 'A' ? ' is-choisi' : ''}" type="button" aria-pressed="${c === 'A'}" aria-controls="sz-ga-vue" data-c="${c}">${c}</button></li>`).join('')}
          </ul>`).join('')}
        </div>
        <figure class="sz-glyphes-a__vue" id="sz-ga-vue" data-theme="sz-clotho">
          <svg class="sz-glyphes-a__svg" viewBox="0 ${H0} ${LT} ${HT}" role="img" aria-label="La lettre A en Abril italique" data-sz-ga-svg>
            ${LIGNES_ABRIL.map(([, y]) => `<line x1="0" x2="${LT}" y1="${y}" y2="${y}"/>`).join('')}
            <g data-sz-ga-lettre></g>
          </svg>
          ${LIGNES_ABRIL.map(([nom, y]) => `<span class="sz-glyphes-a__ligne${y === -1000 ? ' sz-glyphes-a__ligne--dessous' : ''}" style="top:${pos(y)}" aria-hidden="true"><span>${nom}</span><span>${-y}</span></span>`).join('')}
          <figcaption class="sz-glyphes-a__nom"><span>Abril Italique</span><span data-sz-ga-code>U+0041</span></figcaption>
        </figure>
      </div>`;
}

// Carnet : deux flèches discrètes sur le texte rose pour tourner plus vite
const fleche = (sens) => `<svg viewBox="0 0 24 72" aria-hidden="true"><path d="${sens === 'haut' ? 'M12 70 V4 M3 15 L12 3 L21 15' : 'M12 2 V68 M3 57 L12 69 L21 57'}"/></svg>`;
const FLECHES = `<div class="sz-fleches">
          <button class="sz-fleche sz-fleche--haut" type="button" aria-label="Page précédente du catalogue" data-sz-livre-prec>${fleche('haut')}</button>
          <button class="sz-fleche sz-fleche--bas" type="button" aria-label="Page suivante du catalogue" data-sz-livre-suiv>${fleche('bas')}</button>
        </div>`;

/* Slide texte : symbole et titre en capitales, texte à côté d’un visuel */
function slide(theme, titre, texte, visuel, classe = '') {
  let bloc = `<div class="sz-slide__texte" data-theme="${theme}">
          <h2 class="sz-slide__titre"><span class="sz-masque" aria-hidden="true" style="${masque('logo-symbole')}"></span>${titre}</h2>${texte}
        </div>`;
  // Visuel à gauche sauf pour le carnet, à droite du texte
  if (classe.includes('livre')) bloc = bloc.replace(/<\/div>$/, `${FLECHES}</div>`);
  return `<div class="sz-slide ${classe}">
        ${classe.includes('livre') ? bloc + visuel : visuel + bloc}
      </div>`;
}

/* Catalogue qui se feuillette ------------------------------------------------- */
function livre() {
  const [n0, alt0] = LIVRE[0];
  const page = (n) => `<img src="${dossier}/livre-${n}.webp" width="1080" height="1350" alt="" decoding="async">`;
  return `
      <div class="sz-livre" data-sz-livre>
        <div class="sz-livre__objet" role="img" aria-label="Catalogue à anneaux, page 1 sur ${LIVRE.length} : ${alt0}" data-sz-objet>
          ${LIVRE.map(([n], i) => `<div class="sz-livre__moitie sz-livre__moitie--haut${i ? '' : ' is-vu'}" data-sz-haut>${page(n)}</div>
          <div class="sz-livre__moitie sz-livre__moitie--bas${i ? '' : ' is-vu'}" data-sz-bas>${page(n)}</div>`).join('\n          ')}
          ${LIVRE.map(([n], i) => `<div class="sz-livre__moitie sz-livre__moitie--haut sz-livre__feuille" data-sz-feuille><span class="sz-livre__recto">${page(n)}</span><span class="sz-livre__verso">${page(LIVRE[(i + 1) % LIVRE.length][0])}</span></div>`).join('\n          ')}
          <img class="sz-livre__anneaux" src="${dossier}/livre-anneaux.webp" width="1080" height="205" alt="" decoding="async">
        </div>
        <p class="sr-only" role="status" data-sz-livre-annonce></p>
      </div>`;
}

// Crédits : dans l’encart en fin de page, et sous les visuels sur mobile
function credits(c) {
  if (!c) return '';
  const liste = (t) => `<ul>${t.map((x) => `<li>${x}</li>`).join('')}</ul>`;
  return `<h2 class="cl-credits__titre">Crédits</h2>
        <h3>Équipe</h3>${liste(c.equipe)}
        <h3>Services</h3>${liste(c.services)}
        ${c.collaboration ? `<h3>Collaboration</h3><ul><li>${c.collaboration.nom}</li>${c.collaboration.roles.map((r) => `<li><em>${r}</em></li>`).join('')}</ul>` : ''}`;
}

function gabarit(p) {
  const menu = (classe) => CHAPITRES.map(([id, nom]) => `<a class="${classe}" href="#${id}" data-chap="${id}">${nom}</a>`);
  return `
<article class="cl sz" data-cl>
  <aside class="cl-encart" aria-label="Le projet" data-cl-encart>
   <div class="cl-encart__defile" data-cl-defile>
    <dl class="cl-encart__haut">
      <div><dt>Client</dt><dd translate="no">${p.client}</dd></div>
      <div><dt>Année</dt><dd>${p.annee}</dd></div>
    </dl>
    <h1 class="cl-encart__titre sz-encart__nom">${p.nom || p.titre}</h1>
    <p class="cl-encart__sous">${p.type}</p>
    <div class="cl-encart__texte sz-encart__texte">
      <h2 class="sz-encart__rub">Brief</h2><p>${p.brief}</p>
      <h2 class="sz-encart__rub">Démarche créative</h2><p>${p.demarche}</p>
    </div>
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

  <div class="cl-visuels sz-visuels" data-cl-visuels>
    <section class="cl-chap sz-ouverture" id="sz-nom" aria-label="Le nom" data-theme="sz-blanc" data-ouverture>
      <div class="sz-ouverture__bande">
        <span class="sz-masque" role="img" aria-label="Studio Zoé, création graphique" style="${masque('logotype-tagline')} aspect-ratio: 1200 / 347"></span>
      </div>
      ${slide('sz-destin', 'Et si tout partait d’un prénom ?', `
          <p>Fondé en 2023, <strong>Studio Zoé</strong> est un bureau de <strong>création graphique indépendant.</strong> D’abord dédié à de petits projets, il a progressivement pris de l’ampleur et réalise aujourd’hui des projets pour des marques reconnues. Cette évolution appelait <strong>une identité visuelle forte et personnelle</strong>, capable de séduire de nouveaux clients tout en restant à la hauteur de ceux qui lui font déjà confiance.</p>
          <p>Pour construire cette identité, le choix s’est porté sur le prénom de la fondatrice. Pour une structure indépendante, ancrer le logo dans l’histoire de ce prénom allait de soi. <strong>Zoé signifie «&nbsp;la vie&nbsp;» en grec</strong>&nbsp;: c’est là que tout commence.</p>`,
        z(img('pochette-prenom', 1600, 1800, 'Pochette bleue « Direction artistique » de Studio Zoé, d’où dépassent une carte « Studio Zoé, projet n° 24 » et la photo d’une main peinte tenant un fil', DEMI), { classe: 'sz-slide__visuel' }))}
    </section>

    <section class="cl-chap" id="sz-logo" aria-label="Construction du logo">
      <div class="sz-construction" data-theme="sz-blanc">
        <figure class="sz-construction__schema">
          <p class="sz-typo__ent"><span>Construction</span><span>Zone de protection</span></p>
          ${schema()}
        </figure>
        <figure class="sz-construction__mini">
          <p class="sz-construction__titre" aria-hidden="true"><span data-sz-taille-nom>Taille minimale</span> <span data-sz-taille-val>2 cm</span></p>
          <div class="sz-construction__scene" role="img" aria-label="Le logo Studio Zoé à 2 cm, sa taille minimale, puis à 4 cm et à 6 cm" data-sz-tailles>
            <div class="sz-construction__logo"><span class="sz-masque" style="${masque('logo')} aspect-ratio: 1200 / 562"></span></div>
          </div>
        </figure>
      </div>
      <ul class="sz-logos">
        ${LOGOS.map(([f, nom, w, h, theme]) => `<li class="sz-case" data-theme="${theme}"><span class="sz-masque" role="img" aria-label="${nom} de Studio Zoé" style="${masque(f)} aspect-ratio: ${w} / ${h}"></span><span class="sz-logos__nom">${nom}</span></li>`).join('')}
      </ul>
    </section>

    <section class="cl-chap" id="sz-symbole" aria-label="Le symbole">
      <button class="sz-motif" type="button" aria-pressed="false" aria-label="Motif : le symbole répété et entrelacé, en aubergine et rose. Passer en brun et bleu" data-sz-motif>
        <span class="sz-motif__calque sz-motif__calque--trame" style="${masque('motif-trame')}"></span>
        <span class="sz-motif__calque sz-motif__calque--fil" style="${masque('motif-fil')}"></span>
      </button>
      <div class="cl-g2" data-theme="sz-destin">
        ${z(video('video-logo', 900, 900, 'Animation : le symbole de Studio Zoé se dessine, puis se décline sur bleu, aubergine, brun et rose').replace('preload="none"', 'preload="auto" data-cl-depart data-cl-repli="6.5"'), { classe: 'cl-carre' })}
        ${caseFond('sz-atropos', `<span class="sz-masque" role="img" aria-label="Le symbole de Studio Zoé, crème sur brun" style="${masque('logo-symbole')} aspect-ratio: 1200 / 914"></span>`, 'sz-case--carre')}
      </div>
      ${slide('sz-fil', 'Quand le fil devient symbole', `
          <p>Dans la mythologie grecque, l’existence de chaque être est représentée par un fil, confié à trois déesses&nbsp;: <strong>les Moires.</strong> Clotho, la plus jeune, <strong>filait un nouveau fil à chaque naissance.</strong> Lachésis le <strong>déroulait et le mesurait</strong>&nbsp;: sa longueur déterminait la durée d’une vie. Enfin, Atropos, tenait une paire de ciseaux et <strong>le tranchait lorsque l’heure était venue.</strong></p>
          <p><strong>Le symbole est né de ce fil.</strong> Le tracé se déploie en une ligne unique et continue, faite de courbes et de boucles. Le Z s’enchaîne au E sans interruption, puis ce dessin est reproduit en miroir pour former une composition symétrique et équilibrée. Au centre, le O réunit les deux moitiés et les noue, tel un lien que l’on attache. <strong>Les trois lettres de Zoé se fondent ainsi en un monogramme unique</strong>&nbsp;: un fil ininterrompu qui relie les idées, les formes et les personnes, et donne vie à chaque création du studio.</p>`,
        livre(), 'sz-slide--livre')}
    </section>

    <section class="cl-chap" id="sz-couleurs" aria-label="Couleurs" data-theme="sz-clotho">
      <ul class="cl-bandes sz-bandes">
        ${COULEURS.map(([n, c, classe = '']) => `<li class="${classe}" style="--c:${c}"><span>${n}</span><span class="sz-bandes__hex">${c}</span></li>`).join('')}
      </ul>
      ${z(img('logo-couleurs', 2400, 1350, 'Huit carrés aux couleurs de la charte, chacun avec le symbole, posés sur une peinture'), { theme: 'sz-clotho' })}
    </section>

    <section class="cl-chap" id="sz-typos" aria-label="Typographies">
      ${typos()}
    </section>

    <section class="cl-chap" id="sz-applications" aria-label="Applications">
      <ul class="sz-stickers">
        ${[
    ['sticker-1', 'Sticker ovale rose « Studio Zoé », un coin décollé', 'sz-deesse'],
    ['sticker-3', 'Sticker ovale crème au symbole brun, un coin décollé', 'sz-clotho'],
    ['sticker-2', 'Sticker ovale aubergine « Studio Zoé », un coin décollé', 'sz-destin'],
  ].map(([f, alt, theme]) => `<li class="sz-case" data-theme="${theme}">${img(f, 1400, 788, alt, TIERS)}</li>`).join('')}
      </ul>
    </section>

    <div class="cl-credits cl-credits--mobile" data-theme="cl-encart">${credits(p.credits)}</div>
  </div>
</article>`;
}

/* Comportements ------------------------------------------------------------- */

// Le grand rond affiche la lettre survolée (ou choisie au clavier)
function ronds() {
  const montrer = (rond, svg) => {
    if (rond.dataset.l === svg.dataset.l && svg.dataset.l) return;
    const copie = svg.cloneNode(true);
    copie.setAttribute('class', rond.firstElementChild.getAttribute('class'));
    rond.replaceChildren(copie);
    rond.dataset.l = svg.dataset.l || '';
    rond.setAttribute('aria-label', `La lettre ${rond.dataset.l} en Gyst`);
  };
  document.querySelectorAll('[data-sz-survol]').forEach((zone) => {
    const rond = document.getElementById(zone.dataset.szSurvol);
    const lettre = (e) => e.target.closest('svg[data-l]') || e.target.closest('button')?.querySelector('svg');
    zone.addEventListener('pointerover', (e) => { const s = lettre(e); if (s) montrer(rond, s); });
    zone.addEventListener('focusin', (e) => { const s = lettre(e); if (s) montrer(rond, s); });
    zone.addEventListener('click', (e) => { const s = lettre(e); if (s) montrer(rond, s); });
  });
}

// Glyphes d’Abril : la lettre survolée ou choisie passe dans le grand cadre
function glyphesAbril() {
  const bloc = document.querySelector('[data-sz-abril]');
  const svg = bloc.querySelector('[data-sz-ga-svg]');
  const place = bloc.querySelector('[data-sz-ga-lettre]');
  const code = bloc.querySelector('[data-sz-ga-code]');
  const btns = [...bloc.querySelectorAll('[data-c]')];
  const montrer = (btn) => {
    if (!btn || btn.classList.contains('is-choisi')) return;
    const c = btn.dataset.c;
    const id = `abril-${c.codePointAt(0)}`;
    const w = Number((CADRES[id] || '0 0 600 1600').split(' ')[2]);
    place.innerHTML = `<use href="#${id}" x="${(3000 - w) / 2}" y="-1150" width="${w}" height="1600"/>`;
    svg.setAttribute('aria-label', `La lettre ${c === 'ﬁ' ? 'fi' : c === 'ﬂ' ? 'fl' : c} en Abril italique`);
    code.textContent = `U+${c.codePointAt(0).toString(16).toUpperCase().padStart(4, '0')}`;
    btns.forEach((b) => { b.classList.toggle('is-choisi', b === btn); b.setAttribute('aria-pressed', String(b === btn)); });
  };
  ['pointerover', 'focusin', 'click'].forEach((t) => bloc.addEventListener(t, (e) => montrer(e.target.closest('[data-c]'))));
  montrer(btns[1]);
  montrer(btns[0]);
}

// Applications : les trois livrets s’enchaînent en coupe franche, vite, comme
// dans la vidéo d’Enzo ; seulement à l’écran, immobiles si on réduit les animations
function defile() {
  const bloc = document.querySelector('[data-sz-defile]');
  const imgs = [...bloc.querySelectorAll('img')];
  if (reduit) return;
  imgs.forEach((im) => { im.loading = 'eager'; });
  let i = 0;
  let minuteur = 0;
  const suivante = () => {
    imgs[i].classList.remove('is-actif');
    i = (i + 1) % imgs.length;
    imgs[i].classList.add('is-actif');
  };
  new IntersectionObserver((e) => {
    clearInterval(minuteur);
    if (e[0].isIntersecting) minuteur = setInterval(suivante, 420);
  }, { threshold: 0.3 }).observe(bloc);
}

// Colonnes : celle survolée (ou choisie) s’ouvre et montre le S entier
function colonnes() {
  const bloc = document.querySelector('[data-sz-colonnes]');
  const cols = [...bloc.children];
  const ouvrir = (c) => cols.forEach((x) => { x.classList.toggle('is-ouverte', x === c); x.setAttribute('aria-pressed', String(x === c)); });
  cols.forEach((c) => {
    c.addEventListener('pointerenter', (e) => { if (e.pointerType === 'mouse') ouvrir(c); });
    c.addEventListener('click', () => ouvrir(c));
  });
}

// Testeur : taille, interlettrage et interlignage règlent le rendu en Gyst
function testeur() {
  const bloc = document.querySelector('[data-sz-testeur]');
  const rendu = bloc.querySelector('[data-sz-rendu]');
  const champ = bloc.querySelector('[data-sz-texte]');
  const unites = { taille: ' px', lettres: ' %', lignes: ' %' };
  const regler = (input) => {
    const cle = input.dataset.szReglage;
    bloc.querySelector(`[data-sz-sortie="${cle}"]`).textContent = `${input.value}${unites[cle]}`;
    rendu.style.setProperty(`--${cle}`, input.value);
  };
  bloc.querySelectorAll('[data-sz-reglage]').forEach((i) => { i.addEventListener('input', () => regler(i)); regler(i); });
  const ecrire = () => { rendu.innerHTML = ligneGyst(champ.value) || ligneGyst('Studio Zoe'); rendu.setAttribute('aria-label', champ.value); };
  champ.addEventListener('input', ecrire);
  ecrire();
}

// Catalogue : la feuille du haut bascule par-dessus les anneaux vers le bas
// (page suivante) ou revient du bas vers le haut (page précédente) ;
// les pages défilent seules à l’écran, avec pause, précédent et suivant
function catalogue() {
  const bloc = document.querySelector('[data-sz-livre]');
  const objet = bloc.querySelector('[data-sz-objet]');
  // Toutes les moitiés et toutes les feuilles sont posées d’avance, les unes sur
  // les autres : tourner une page ne change jamais d’image (pas de blanc ni de saut)
  const hauts = [...bloc.querySelectorAll('[data-sz-haut]')];
  const bas = [...bloc.querySelectorAll('[data-sz-bas]')];
  const feuilles = [...bloc.querySelectorAll('[data-sz-feuille]')];
  const annonce = bloc.querySelector('[data-sz-livre-annonce]');
  const slideBloc = bloc.closest('.sz-slide') || bloc;
  const n = LIVRE.length;
  let page = 0;
  let occupe = false;
  let visible = false;
  let minuteur = 0;
  const DUREE = 950;
  const PLAT = 'rotateX(0deg)';
  const POSEE = 'rotateX(-180deg)';

  const dire = (parle) => {
    const texte = `Page ${page + 1} sur ${n} : ${LIVRE[page][1]}`;
    objet.setAttribute('aria-label', `Catalogue à anneaux, ${texte}`);
    if (parle) annonce.textContent = texte;
  };
  const montrer = (h, b) => {
    hauts.forEach((e, i) => e.classList.toggle('is-vu', i === h));
    bas.forEach((e, i) => e.classList.toggle('is-vu', i === b));
  };
  const aller = async (avant, parle = false) => {
    if (occupe) return;
    const cible = (page + (avant ? 1 : -1) + n) % n;
    if (reduit) { page = cible; montrer(page, page); dire(parle); return; }
    occupe = true;
    // En avant : la feuille de la page actuelle (dos = bas de la suivante) bascule vers le bas,
    // le haut suivant attend dessous. En arrière : la feuille de la page précédente remonte
    const feuille = feuilles[avant ? page : cible];
    if (avant) montrer(cible, page); else montrer(page, cible);
    const anim = feuille.animate([{ transform: avant ? PLAT : POSEE }, { transform: avant ? POSEE : PLAT }], { duration: DUREE, easing: 'cubic-bezier(0.55, 0, 0.25, 1)', fill: 'both' });
    feuille.classList.add('is-tourne');
    await anim.finished;
    page = cible;
    montrer(page, page);
    feuille.classList.remove('is-tourne');
    anim.cancel();
    occupe = false;
    dire(parle);
  };
  const regler = () => {
    clearInterval(minuteur);
    // Les pages tournent seules ; les flèches servent à aller plus vite
    if (visible && !reduit) minuteur = setInterval(() => aller(true), 2800);
  };
  slideBloc.querySelector('[data-sz-livre-suiv]').addEventListener('click', () => { aller(true, true); regler(); });
  slideBloc.querySelector('[data-sz-livre-prec]').addEventListener('click', () => { aller(false, true); regler(); });
  new IntersectionObserver((e) => { visible = e[0].isIntersecting; regler(); }, { threshold: 0.4 }).observe(objet);
  dire(false);
}

// Taille du logo : 2 cm (minimum), puis 4 cm et 6 cm, en boucle à l’écran
function tailles() {
  const scene = document.querySelector('[data-sz-tailles]');
  const nom = document.querySelector('[data-sz-taille-nom]');
  const val = document.querySelector('[data-sz-taille-val]');
  const T = [2, 4, 6];
  let i = 0;
  let minuteur = 0;
  const poser = () => {
    scene.style.setProperty('--taille', `${T[i]}cm`);
    nom.textContent = i === 0 ? 'Taille minimale' : 'Taille';
    val.textContent = `${T[i]} cm`;
  };
  poser();
  new IntersectionObserver((e) => {
    clearInterval(minuteur);
    if (e[0].isIntersecting) minuteur = setInterval(() => { i = (i + 1) % T.length; poser(); }, 1800);
  }, { threshold: 0.5 }).observe(scene);
}

// Motif : rose et aubergine, brun et bleu au survol ; un clic (ou le clavier) bascule
function motif() {
  const b = document.querySelector('[data-sz-motif]');
  b.addEventListener('click', () => {
    const autre = b.getAttribute('aria-pressed') !== 'true';
    b.setAttribute('aria-pressed', String(autre));
    b.setAttribute('aria-label', `Motif : le symbole répété et entrelacé, en ${autre ? 'brun et bleu. Revenir en aubergine et rose' : 'aubergine et rose. Passer en brun et bleu'}`);
  });
}

/* Entrée du gabarit --------------------------------------------------------- */
export async function rendre(p) {
  dossier = p.dossier;
  document.body.classList.add('page-cl', 'page-sz');
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', '#200603');
  const main = document.querySelector('main');
  main.querySelectorAll('[data-projet-hero], [data-projet-intro], [data-projet="galerie"]').forEach((n) => n.remove());
  // Lettres tracées de Gyst et d’Abril, insérées une fois dans la page
  const sprites = await Promise.all(['gyst', 'abril'].map((f) => fetch(`${dossier}/glyphes-${f}.svg`).then((r) => r.text()).catch(() => '')));
  sprites.join('').replace(/<symbol id="([^"]+)" viewBox="([^"]+)"/g, (_, id, vb) => {
    // Le symbole a son propre repère : la lettre se cale depuis l’origine
    const [, , w, h] = vb.split(' ');
    CADRES[id] = `0 0 ${w} ${h}`;
    return '';
  });
  main.insertAdjacentHTML('afterbegin', sprites.join('') + gabarit(p));
  const header = document.querySelector('.header');
  delete header.dataset.fixeApres;
  header.dataset.on = 'cl-noir';
  const encart = main.querySelector('[data-cl-encart]');
  const mobile = matchMedia('(max-width: 899px)');
  const theme = () => { if (mobile.matches) encart.dataset.theme = 'cl-encart'; else delete encart.dataset.theme; };
  theme();
  mobile.addEventListener('change', () => { theme(); dispatchEvent(new Event('resize')); });
}

export function animer() {
  suivi();
  videos();
  tailles();
  motif();
  ronds();
  colonnes();
  testeur();
  glyphesAbril();
  defile();
  catalogue();
  dispatchEvent(new Event('resize'));
}
