// Gabarit « Le Central Technique », d’après la maquette d’Enzo (2026-11-17,
// MISE_EN_PAGE_LCT, 12 planches) : l’encart aubergine fixe à gauche (client,
// année, présentation en haut, rôle en bas), les visuels empilés à droite.
// Trois passages vivants : la vidéo du symbole qui se construit, le motif à
// recolorer (« Choisissez vos couleurs ») et les typographies : Rubik dont la
// graisse varie toute seule (référence : écran du 2026-11-16) et un inspecteur
// de glyphes en Sofia Pro Condensed (référence : écran du 2026-10-28).

import { suivi, videos } from './columbus.js?v=20261124g';

let dossier = '';
const LARGE = '(min-width: 900px) 75vw, 100vw';

// Sofia Pro Condensed : kit Adobe Fonts du portfolio (autorisé sur
// zoestudio-ten.vercel.app, les préversions *.vercel.app et localhost)
const POLICES = 'https://use.typekit.net/ivl0joc.css';
const SOFIA = '"sofia-pro-condensed", "Arial Narrow", sans-serif';

// Visuel en deux tailles (« -s » = 1200 px)
function img(nom, h, alt, { eager = false, sizes = LARGE } = {}) {
  return `<img src="${dossier}/${nom}-s.webp" srcset="${dossier}/${nom}-s.webp 1200w, ${dossier}/${nom}.webp 2400w" sizes="${sizes}" width="2400" height="${h}" alt="${alt}" loading="${eager ? 'eager' : 'lazy'}"${eager ? ' fetchpriority="high"' : ''} decoding="async">`;
}
const fig = (contenu, classe = '') => `<figure class="lct-bloc ${classe}">${contenu}</figure>`;
// Visuel qui se pose au scroll (106 % → 100 %), comme sur Columbus
const z = (contenu) => `<figure class="lct-bloc cl-z">${contenu}</figure>`;

// Couleurs de la charte (planche 9) : nom, valeur
const COULEURS = [
  ['Technique', '#0A2935'], ['Matrice', '#5CB6BC'], ['Codec', '#CDE9F2'],
  ['LED', '#EF7A47'], ['Pixel', '#D84728'], ['Blanc', '#FFFFFF'],
];

// Le symbole de LCT (pastilles du motif)
const SYMBOLE = 'M459.63,227.05c-3.97-4.12-7.91-7.96-11.82-11.56l.35-.34-73.54-76.3-74.55,71.84c-2.69,2.36-5.4,4.81-8.12,7.43l-33.24,32.04c-6.25,4.97-10.59,5.69-14.52,1.61-4.4-4.57-2.76-8.8,6.61-17.83l111.72-107.66-77.06-79.96-102.12,98.42,70.45,73.11c-57.18-50.65-92.33-55.11-137.79-11.29-39.75,38.31-37.6,79.86,19.64,139.26,3.97,4.12,7.91,7.96,11.82,11.56l-.35.34,73.54,76.3,74.55-71.84c2.69-2.36,5.4-4.81,8.12-7.43l33.24-32.04c6.25-4.97,10.59-5.69,14.52-1.61,4.4,4.57,2.76,8.8-6.61,17.83l-111.72,107.66,77.06,79.96,102.12-98.42-70.45-73.11c57.18,50.65,92.33,55.11,137.79,11.29,39.75-38.31,37.6-79.86-19.64-139.26Z';
const puce = () => `<svg class="lct-puce__forme" viewBox="80 40 435 495" aria-hidden="true" focusable="false"><path d="${SYMBOLE}"/></svg>`;

// Sofia Pro Condensed : graisses du kit
const STYLES = [['Light', 300], ['Regular', 400], ['Medium', 500], ['Semibold', 600], ['Bold', 700], ['Black', 900]];
// Bloc Unicode « Basic Latin » (U+0021 à U+007E) : nom du glyphe, nom Unicode
const GLYPHES = [["exclam","Exclamation Mark"],["quotedbl","Quotation Mark"],["numbersign","Number Sign"],["dollar","Dollar Sign"],["percent","Percent Sign"],["ampersand","Ampersand"],["quotesingle","Apostrophe"],["parenleft","Left Parenthesis"],["parenright","Right Parenthesis"],["asterisk","Asterisk"],["plus","Plus Sign"],["comma","Comma"],["hyphen","Hyphen-Minus"],["period","Full Stop"],["slash","Solidus"],["zero","Digit Zero"],["one","Digit One"],["two","Digit Two"],["three","Digit Three"],["four","Digit Four"],["five","Digit Five"],["six","Digit Six"],["seven","Digit Seven"],["eight","Digit Eight"],["nine","Digit Nine"],["colon","Colon"],["semicolon","Semicolon"],["less","Less-Than Sign"],["equal","Equals Sign"],["greater","Greater-Than Sign"],["question","Question Mark"],["at","Commercial At"],["A","Latin Capital Letter A"],["B","Latin Capital Letter B"],["C","Latin Capital Letter C"],["D","Latin Capital Letter D"],["E","Latin Capital Letter E"],["F","Latin Capital Letter F"],["G","Latin Capital Letter G"],["H","Latin Capital Letter H"],["I","Latin Capital Letter I"],["J","Latin Capital Letter J"],["K","Latin Capital Letter K"],["L","Latin Capital Letter L"],["M","Latin Capital Letter M"],["N","Latin Capital Letter N"],["O","Latin Capital Letter O"],["P","Latin Capital Letter P"],["Q","Latin Capital Letter Q"],["R","Latin Capital Letter R"],["S","Latin Capital Letter S"],["T","Latin Capital Letter T"],["U","Latin Capital Letter U"],["V","Latin Capital Letter V"],["W","Latin Capital Letter W"],["X","Latin Capital Letter X"],["Y","Latin Capital Letter Y"],["Z","Latin Capital Letter Z"],["bracketleft","Left Square Bracket"],["backslash","Reverse Solidus"],["bracketright","Right Square Bracket"],["asciicircum","Circumflex Accent"],["underscore","Low Line"],["grave","Grave Accent"],["a","Latin Small Letter A"],["b","Latin Small Letter B"],["c","Latin Small Letter C"],["d","Latin Small Letter D"],["e","Latin Small Letter E"],["f","Latin Small Letter F"],["g","Latin Small Letter G"],["h","Latin Small Letter H"],["i","Latin Small Letter I"],["j","Latin Small Letter J"],["k","Latin Small Letter K"],["l","Latin Small Letter L"],["m","Latin Small Letter M"],["n","Latin Small Letter N"],["o","Latin Small Letter O"],["p","Latin Small Letter P"],["q","Latin Small Letter Q"],["r","Latin Small Letter R"],["s","Latin Small Letter S"],["t","Latin Small Letter T"],["u","Latin Small Letter U"],["v","Latin Small Letter V"],["w","Latin Small Letter W"],["x","Latin Small Letter X"],["y","Latin Small Letter Y"],["z","Latin Small Letter Z"],["braceleft","Left Curly Bracket"],["bar","Vertical Line"],["braceright","Right Curly Bracket"],["asciitilde","Tilde"]];
const car = (i) => String.fromCharCode(0x21 + i);

// Avant / après : même curseur que Columbus « C’est le moment » ; l’ancien
// logo (2013) à gauche, le nouveau (2026) à droite, centrés au même endroit
function avantApres() {
  return `<div class="lct-avap" data-theme="lct-codec">
        <div class="cl-comparer lct-comparer" data-lct-comparer style="--pos: 50%">
          <figure class="cl-comparer__cote">${img('logo-apres', 1220, 'Après : le nouveau logo de 2026, le symbole en losange au-dessus de « Le Central Technique », en bleu Technique', { eager: true })}</figure>
          <figure class="cl-comparer__cote cl-comparer__cote--avant">${img('logo-avant', 1220, 'Avant : l’ancien logo de 2013, une sphère bleue brillante précédée de deux croissants, « Le Central Technique » en blanc', { eager: true })}</figure>
          <span class="lct-avap__libelle lct-avap__libelle--avant" aria-hidden="true">Avant</span>
          <span class="lct-avap__libelle lct-avap__libelle--apres" aria-hidden="true">Après</span>
          <span class="lct-avap__annee lct-avap__annee--avant" aria-hidden="true">2013</span>
          <span class="lct-avap__annee lct-avap__annee--apres" aria-hidden="true">2026</span>
          <span class="cl-comparer__barre" aria-hidden="true"><span class="cl-comparer__poignee"></span></span>
          <input class="cl-comparer__curseur" type="range" min="0" max="100" value="50" step="1" aria-label="Comparer l’ancien et le nouveau logo : à gauche l’ancien (2013), à droite le nouveau (2026)" data-lct-comparer-curseur>
        </div>
      </div>`;
}

// Le logo sur six aplats ; un petit interrupteur passe la grille de la
// couleur au niveau de gris (Enzo, 2026-11-17)
const DEGRADE = 'linear-gradient(135deg, #CDE9F2 0%, #5CB6BC 48%, #0A2935 100%)';
const CASES = [
  // forme, fond, logo, description
  ['symbole', DEGRADE, '#FFFFFF', 'Le symbole blanc sur un dégradé de Codec à Technique'],
  ['mot', '#0A2935', '#5CB6BC', 'Le nom en Matrice sur Technique'],
  ['symbole', '#5CB6BC', '#CDE9F2', 'Le symbole en Codec sur Matrice'],
  ['mot', '#EF7A47', '#D84728', 'Le nom en Pixel sur LED'],
  ['symbole', '#CDE9F2', '#0A2935', 'Le symbole en Technique sur Codec'],
  ['mot', '#D84728', '#EF7A47', 'Le nom en LED sur Pixel'],
];
function grille() {
  return `<div class="lct-grille" data-lct-modes data-version="0">
        <div class="lct-grille__cases">
          ${CASES.map(([forme, f, l, alt]) => `<div class="lct-case" style="--f:${f}; --l:${l}">
            <span class="lct-masque lct-masque--${forme}" role="img" aria-label="${alt}" style="-webkit-mask-image:url(${dossier}/${forme}.svg);mask-image:url(${dossier}/${forme}.svg)"></span>
          </div>`).join('')}
        </div>
        <div class="cl-mode lct-mode" role="group" aria-label="Affichage des logos">
          <span class="cl-mode__pouce" aria-hidden="true"></span>
          <button class="cl-mode__btn" type="button" aria-pressed="true" data-lct-mode="0">Couleur</button>
          <button class="cl-mode__btn" type="button" aria-pressed="false" data-lct-mode="1">Niveau de gris</button>
        </div>
      </div>`;
}

// Tenues de travail : une seule planche (aplat et texte à gauche, photo à
// droite) qui reste à l’écran ; chaque cran de scroll change le texte, la
// couleur de l’aplat et la photo (Enzo, 2026-11-17)
const TENUES = [
  ['casque', 'Casque de<br>chantier', '#0A2935', '#FFFFFF', 'Casque de chantier bleu marine au symbole blanc, posé sur des parpaings'],
  ['polo', 'Polo', '#CDE9F2', '#0A2935', 'Polo bleu marine au symbole blanc, suspendu sous un puits de lumière dans une pièce en béton'],
  ['combinaison', 'Combinaison<br>de chantier', '#5CB6BC', '#FFFFFF', 'Combinaison de chantier grise vue de dos : « Nous agissons en votre nom pour concrétiser les projets de vos clients », le logo et le symbole en Technique'],
];
function tenues() {
  return `<div class="lct-tenues" data-lct-tenues data-etape="0" style="--n:${TENUES.length}">
        <div class="lct-tenues__cadre">
          <ol class="lct-tenues__aplats">
            ${TENUES.map(([, t, aplat, encre], i) => `<li class="lct-tenues__aplat${i === 0 ? ' is-actif' : ''}" style="--aplat:${aplat}; --encre:${encre}" data-etape="${i}">
              <p class="lct-tenues__coin"${i ? ' aria-hidden="true"' : ''}><span>Identité visuelle</span><span>Application</span></p>
              <p class="lct-tenues__titre">${t}</p>
              <p class="lct-tenues__coin"${i ? ' aria-hidden="true"' : ''}><span>Tenue de travail</span><span>LCT</span></p>
            </li>`).join('')}
          </ol>
          <div class="lct-tenues__photos">
            ${TENUES.map(([f, , , , alt], i) => `<img class="lct-tenues__photo${i === 0 ? ' is-actif' : ''}" src="${dossier}/tenue-${f}-s.webp" srcset="${dossier}/tenue-${f}-s.webp 600w, ${dossier}/tenue-${f}.webp 1200w" sizes="(min-width: 900px) 38vw, 50vw" width="1200" height="1800" alt="${alt}" loading="lazy" decoding="async" data-etape="${i}">`).join('')}
          </div>
        </div>
      </div>`;
}

// Taille minimale (planche 3) : le symbole remplit la carte à 10 cm puis
// rétrécit jusqu’à 2 cm ; en rétrécissant, ses deux incisions s’élargissent
// pour rester lisibles. La carte se pose exactement sur celle de l’image.
const TRAITS = '<line x1="250.4" y1="245.7" x2="388.8" y2="112.6"/><line x1="344.2" y1="326.8" x2="205.8" y2="459.9"/>';
// Centre du symbole dans son dessin, et place libre entre les deux textes
const SYM = { cx: 297.6, cy: 286.5, h: 480.5 };
const CARTE = { cx: 308.5, cy: 321.5, grand: 400, petit: 150 };
function carte() {
  return `<div class="lct-carte" data-lct-carte>
          <svg class="lct-carte__svg" viewBox="0 0 617 617" role="img" aria-labelledby="lct-carte-titre">
            <title id="lct-carte-titre">Taille minimale : à 10 cm, le symbole et ses incisions fines ; réduit à 2 cm, ses incisions sont élargies pour rester lisibles</title>
            <rect width="617" height="617" rx="68" fill="#FFFFFF"/>
            <text class="lct-carte__titre" x="308.5" y="83" textLength="339" lengthAdjust="spacing">TAILLE MINIMALE</text>
            <g data-lct-carte-symbole>
              <path d="${SYMBOLE}" fill="#0A2935"/>
              <g stroke="#FFFFFF" stroke-linecap="round" stroke-width="17" data-lct-traits>${TRAITS}</g>
            </g>
            <text class="lct-carte__taille" x="308.5" y="583" data-lct-carte-taille>2 CM</text>
          </svg>
        </div>`;
}

// Autocollants : les six de la planche se collent à l’arrivée ; un clic (ou
// un toucher) sur la surface en colle un de plus, autant qu’on veut
const STICKERS = [
  // fichier, x %, y %, largeur %, rapport largeur/hauteur, description
  [1, 3.73, 12.63, 27.75, 1.67, 'texte bleu clair bordé de Technique et de blanc'],
  [2, 34.45, 13.27, 27.2, 1.6947, 'texte blanc sur Pixel'],
  [3, 67.3, 12.63, 27.75, 1.67, 'texte Matrice bordé de Technique et de bleu clair'],
  [4, 4.88, 50.58, 27.2, 1.6929, 'texte Pixel sur LED'],
  [5, 37.62, 50.58, 27.2, 1.6929, 'texte Technique sur bleu clair'],
  [6, 68.2, 50.02, 27.68, 1.6727, 'texte LED sur Pixel'],
];
const sticker = (n, x, y, w, ar, extra = '') => `<img class="lct-sticker" src="${dossier}/sticker-${n}.webp" width="800" height="${Math.round(800 / ar)}" alt="" draggable="false" style="left:${x}%; top:${y}%; width:${w}%;${extra}" data-lct-sticker>`;
function autocollants() {
  return `<div class="lct-stickers" data-lct-stickers>
        <div class="lct-stickers__surface" role="img" aria-label="Six autocollants « Le Central Technique » inclinés sur fond Technique : ${STICKERS.map((t) => t[5]).join(', ')}" data-lct-surface>
          ${STICKERS.map(([n, x, y, w, ar]) => sticker(n, x, y, w, ar)).join('')}
        </div>
        <p class="lct-stickers__aide" aria-hidden="true"><span class="lct-souris">Cliquez</span><span class="lct-doigt">Touchez</span> pour coller un autocollant</p>
        <div class="lct-stickers__boutons">
          <button type="button" class="lct-stickers__btn lct-stickers__btn--coller" data-lct-coller>Coller un autocollant</button>
          <button type="button" class="lct-stickers__btn" data-lct-decoller hidden>Tout décoller</button>
        </div>
        <p class="sr-only" aria-live="polite" data-lct-stickers-annonce></p>
      </div>`;
}

// Palette : six bandes qui s’élargissent au survol (ou au focus) et montrent
// leurs valeurs. Couleurs relevées sur la maquette ; CMJN calculé
const PALETTE = [
  // nom, fichier, hex, encre, position du nom (gauche %, bas %, hauteur %)
  ['Technique', 'technique', '#082935', '#FFFFFF', 14.9, 4.09, 46.27],
  ['Matrice', 'matrice', '#5CB6BD', '#FFFFFF', 13.5, 4.57, 35.47],
  ['Codec', 'codec', '#CEE9F2', '#082935', 13.8, 4.46, 26.1],
  ['Blanc', 'blanc', '#FFFFFF', '#082935', 15.2, 4.54, 25.91],
  ['LED', 'led', '#EE7A46', '#FFFFFF', 17.9, 4.5, 14.1],
  ['Pixel', 'pixel', '#D74728', '#FFFFFF', 18.7, 4.5, 22.95],
];
const rvb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
function cmjn(h) {
  const [r, v, b] = rvb(h).map((x) => x / 255);
  const k = 1 - Math.max(r, v, b);
  if (k >= 1) return [0, 0, 0, 100];
  return [r, v, b].map((x) => Math.round(((1 - x - k) / (1 - k)) * 100)).concat(Math.round(k * 100));
}
function palette() {
  return `<ul class="lct-bandes" aria-label="Palette de couleurs" data-lct-bandes>
        ${PALETTE.map(([nom, f, hex, encre, g, bas, h]) => `<li class="lct-bande" tabindex="0" style="--c:${hex}; --encre:${encre}">
          <img class="lct-bande__nom" src="${dossier}/couleur-${f}.webp" alt="${nom}" style="--g:${g}; --bas:${bas}%; --h:${h}%" loading="lazy" decoding="async">
          <dl class="lct-bande__valeurs">
            <div><dt>HEX</dt><dd>${hex}</dd></div>
            <div><dt>RVB</dt><dd>${rvb(hex).join(' ')}</dd></div>
            <div><dt>CMJN</dt><dd>${cmjn(hex).join(' ')}</dd></div>
          </dl>
        </li>`).join('')}
      </ul>`;
}

/* Gabarit -------------------------------------------------------------------- */
function choix(nom, legende, depart) {
  return `<fieldset class="lct-motif__choix lct-motif__choix--${nom}">
          <legend>${legende}</legend>
          <div class="lct-motif__puces">${COULEURS.map(([n, c]) => `<label class="lct-puce${c === '#FFFFFF' ? ' lct-puce--blanc' : ''}" style="--c:${c}"><input type="radio" name="lct-${nom}" value="${c}"${c === depart ? ' checked' : ''} data-lct-choix="${nom}">${puce()}<span class="sr-only">${n}</span></label>`).join('')}</div>
        </fieldset>`;
}

function motif() {
  return `<div class="lct-motif" data-theme="lct-blanc" data-lct-motif style="--motif:#0A2935; --fond:#FFFFFF">
      <div class="lct-motif__cadre" role="img" aria-label="Le motif de LCT : le symbole répété en diagonale"><div class="lct-motif__toile" style="-webkit-mask-image:url(${dossier}/motif.svg);mask-image:url(${dossier}/motif.svg)"></div></div>
      <div class="lct-motif__barre">
        ${choix('motif', 'Couleur du pattern', '#0A2935')}
        <button class="lct-motif__hasard" type="button" aria-label="Choisissez vos couleurs : une combinaison au hasard" data-lct-hasard>Choisissez vos couleurs</button>
        ${choix('fond', 'Couleur du fond', '#FFFFFF')}
      </div>
      <p class="sr-only" aria-live="polite" data-lct-motif-annonce></p>
    </div>`;
}

function typos() {
  return `<section class="lct-typos" id="lct-typos" aria-label="Typographies" data-theme="lct-technique">
      <div class="lct-rubik" data-lct-rubik>
        <p class="lct-etiquette">Rubik</p>
        <p class="lct-rubik__texte" data-lct-rubik-texte>Le Central<br>Technique</p>
        <div class="lct-rubik__reglages">
          <button class="lct-lecture" type="button" aria-pressed="false" data-lct-lecture><span class="sr-only" data-lct-lecture-nom>Mettre en pause l’animation de la graisse</span></button>
          <label class="lct-curseur"><span>Graisse</span><input type="range" min="300" max="900" step="1" value="900" data-lct-graisse><output data-lct-graisse-valeur>900</output></label>
        </div>
      </div>

      <div class="lct-sofia" data-theme="lct-blanc" data-lct-sofia>
        <p class="lct-etiquette lct-etiquette--texte">Sofia Pro Condensed, texte courant</p>
        <div class="lct-sofia__corps">
          <div class="lct-sofia__fiche">
            <svg class="lct-sofia__glyphe" viewBox="0 0 1400 1250" role="img" aria-labelledby="lct-glyphe-titre" data-lct-glyphe>
              <title id="lct-glyphe-titre" data-lct-glyphe-titre>C</title>
              <g class="lct-sofia__lignes" data-lct-lignes></g>
              <text x="700" y="0" text-anchor="middle" data-lct-glyphe-texte>C</text>
            </svg>
            <dl class="lct-sofia__infos" data-lct-infos>
              <div><dt><label for="lct-style">Style</label></dt><dd><select id="lct-style" data-lct-style>${STYLES.map(([n, g]) => `<option value="${g}"${g === 400 ? ' selected' : ''}>Sofia Pro Condensed ${n}</option>`).join('')}</select></dd></div>
            </dl>
          </div>
          <div class="lct-sofia__table">
            <p class="lct-sofia__bloc" id="lct-bloc-latin">Basic Latin</p>
            <div class="lct-sofia__grille" role="group" aria-labelledby="lct-bloc-latin" data-lct-grille>
              ${GLYPHES.map(([, u], i) => `<button type="button" aria-pressed="false" lang="en" aria-label="${u}" data-c="${i}">${car(i).replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;').replace('"', '&quot;')}</button>`).join('')}
            </div>
          </div>
        </div>
        <p class="sr-only" aria-live="polite" data-lct-sofia-annonce></p>
      </div>
    </section>`;
}

function gabarit(p) {
  return `
<article class="cl lct" data-cl>
  <aside class="cl-encart" aria-label="Le projet" data-cl-encart>
   <div class="cl-encart__defile" data-cl-defile>
    <dl class="cl-encart__haut">
      <div><dt>Client</dt><dd translate="no">${p.client}</dd></div>
      <div><dt>Année</dt><dd>${p.annee}</dd></div>
    </dl>
    <h1 class="cl-encart__titre">${p.nom}</h1>
    <p class="cl-encart__sous">${p.type}</p>
    <div class="cl-encart__texte lct-encart__texte"><p>${p.description}</p></div>
    <div class="cl-encart__bas lct-role">
      <h2 class="lct-role__titre">Rôle</h2>
      <ul>${(p.roles ?? []).map((r) => `<li>${r}</li>`).join('')}</ul>
      ${p.collaboration ? `<p class="lct-role__note">${p.collaboration}</p>` : ''}
    </div>
   </div>
    <a class="cl-encart__fleche" href="#contenu" aria-label="Revenir en haut de la page">↑</a>
  </aside>
  <nav class="cl-repere" aria-label="Chapitres du projet, raccourcis" hidden data-cl-repere></nav>

  <div class="cl-visuels lct-visuels" data-cl-visuels>
    <section class="cl-chap" id="lct-logo" aria-label="Le logo" data-ouverture>
      ${fig(img('titre', 789, 'Le Central Technique : le symbole et le nom en bleu clair sur fond bleu Technique', { eager: true }), 'lct-bloc--titre')}
      ${avantApres()}
      ${grille()}
      ${fig(`${img('construction', 1662, 'Construction du logo : symbole et nom mesurés en X (7,4 X, 1,8 X, 2,6 X, 1,1 X, 1,3 X), taille minimale de 2 cm. « Le symbole a été entièrement repensé à partir de la lettre “C” de Central, un choix logique pour une entreprise qui devient un vrai collectif. La lettre est construite en symétrie imbriquée, ce qui forme un losange qu’on ne lit pas tout de suite comme un “C”. Cela a permis de répondre à la demande précise de LCT : avoir un symbole fort, mais qui reste discret et ne se dévoile pas au premier coup d’œil face aux clients finaux. Pour la typographie de “Le Central”, j’ai choisi des courbes rondes et fluides, très lisibles, qui contrastent volontairement avec les angles du symbole. »')}${carte()}`, 'lct-construction')}
      <figure class="lct-bloc lct-reveal">
        <video muted loop playsinline preload="none" width="1920" height="1080" poster="${dossier}/reveal-poster.webp" aria-label="Animation 3D : les deux moitiés du symbole tournent, se construisent autour d’un cercle puis s’assemblent en losange sur fond bleu nuit" data-cl-video data-cl-repli="7"><source src="${dossier}/reveal.mp4" type="video/mp4"></video>
      </figure>
      ${fig(img('declinaisons', 488, 'Cinq déclinaisons du logo : sur Pixel, sur LED, sur Matrice, sur Technique et sur Codec'))}
    </section>

    <section class="cl-chap" id="lct-elements" aria-label="Motif et couleurs">
      ${motif()}
      ${autocollants()}
      ${palette()}
    </section>

    ${typos()}

    <section class="cl-chap" id="lct-applications" aria-label="Applications">
      ${tenues()}
      ${z(img('papeterie', 1234, 'Papeterie : papier à en-tête, carte de visite d’Enzo Pereira, carte au motif, enveloppe au symbole, stylo au motif et carnet « De la conception à l’intégration, l’audiovisuel au cœur de votre activité »'))}
      ${z(img('enseignes', 920, 'Enseignes : un caisson en drapeau au symbole blanc et un panneau « Le Central Technique » sur la façade'))}
      ${z(img('horaires', 2114, 'Plaque « Horaires livraisons, 09.00h à 16.00h, lundi, mardi, mercredi, jeudi, vendredi » fixée sur un bardage'))}
    </section>
  </div>
</article>`;
}

/* Comportements ------------------------------------------------------------- */
const calme = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

// Taille minimale : 10 cm (grand, incisions d’origine) → 2 cm (petit,
// incisions élargies) → retour, en boucle tant que la carte est à l’écran.
// Immobile à 2 cm avec « réduire les animations ».
function incisions() {
  const bloc = document.querySelector('[data-lct-carte]');
  const symbole = bloc.querySelector('[data-lct-carte-symbole]');
  const traits = bloc.querySelector('[data-lct-traits]');
  const taille = bloc.querySelector('[data-lct-carte-taille]');
  const FIN = 17; const LARGE = 46; const CYCLE = 6400; // 17 : la largeur d’origine des incisions
  let visible = false;
  let raf = 0;
  let t0 = 0;
  const poser = (u) => {
    const h = CARTE.grand + (CARTE.petit - CARTE.grand) * u;
    const k = h / SYM.h;
    symbole.setAttribute('transform', `translate(${CARTE.cx} ${CARTE.cy}) scale(${k.toFixed(4)}) translate(${-SYM.cx} ${-SYM.cy})`);
    traits.setAttribute('stroke-width', (FIN + (LARGE - FIN) * u).toFixed(2));
    taille.textContent = `${Math.round(10 - 8 * u)} CM`;
  };
  // Palier à 10 cm, descente, palier à 2 cm, remontée
  const courbe = (u) => {
    const x = u < 0.5 ? u * 2 : (1 - u) * 2;
    const y = Math.min(1, Math.max(0, (x - 0.18) / 0.6));
    return y * y * (3 - 2 * y);
  };
  const image = (t) => { poser(courbe(((t - t0) % CYCLE) / CYCLE)); raf = requestAnimationFrame(image); };
  new IntersectionObserver(([e]) => {
    visible = e.isIntersecting;
    cancelAnimationFrame(raf);
    if (visible && !calme()) { t0 = performance.now(); raf = requestAnimationFrame(image); }
  }).observe(bloc);
  poser(calme() ? 1 : 0);
}

// Autocollants : un clic colle le suivant de la série à l’endroit visé,
// légèrement tourné ; le bouton en colle un au hasard (clavier)
function coller() {
  const bloc = document.querySelector('[data-lct-stickers]');
  const surface = bloc.querySelector('[data-lct-surface]');
  const decoller = bloc.querySelector('[data-lct-decoller]');
  const annonce = bloc.querySelector('[data-lct-stickers-annonce]');
  let suivant = 0;
  let ajouts = 0;
  const poser = (px, py) => {
    const [n, , , w, ar] = STICKERS[suivant % STICKERS.length];
    suivant += 1;
    const r = surface.getBoundingClientRect();
    const hauteur = (w / ar) * (r.width / r.height); // en % de la hauteur
    const x = Math.min(100 - w, Math.max(0, px - w / 2));
    const y = Math.min(100 - hauteur, Math.max(0, py - hauteur / 2));
    const angle = (Math.random() * 24 - 12).toFixed(1);
    surface.insertAdjacentHTML('beforeend', sticker(n, x.toFixed(2), y.toFixed(2), w, ar, ` --r:${angle}deg;`));
    surface.lastElementChild.classList.add('is-ajout');
    ajouts += 1;
    decoller.hidden = false;
    annonce.textContent = `${ajouts} autocollant${ajouts > 1 ? 's' : ''} ajouté${ajouts > 1 ? 's' : ''}`;
  };
  surface.addEventListener('click', (e) => {
    const r = surface.getBoundingClientRect();
    poser(((e.clientX - r.left) / r.width) * 100, ((e.clientY - r.top) / r.height) * 100);
  });
  bloc.querySelector('[data-lct-coller]').addEventListener('click', () => poser(15 + Math.random() * 70, 15 + Math.random() * 70));
  decoller.addEventListener('click', () => {
    surface.querySelectorAll('.is-ajout').forEach((s) => s.remove());
    ajouts = 0;
    suivant = 0;
    decoller.hidden = true;
    annonce.textContent = 'Autocollants ajoutés retirés';
    bloc.querySelector('[data-lct-coller]').focus();
  });
  // Les six de la planche se collent l’un après l’autre à l’arrivée
  new IntersectionObserver(([e], obs) => {
    if (!e.isIntersecting) return;
    bloc.classList.add('is-colle');
    obs.disconnect();
  }, { threshold: 0.35 }).observe(bloc);
}

// Avant / après : le curseur règle la position de la barre
function comparer() {
  const bloc = document.querySelector('[data-lct-comparer]');
  const curseur = bloc.querySelector('[data-lct-comparer-curseur]');
  const maj = () => {
    bloc.style.setProperty('--pos', `${curseur.value}%`);
    curseur.setAttribute('aria-valuetext', `${curseur.value} % ancien logo, ${100 - curseur.value} % nouveau`);
  };
  curseur.addEventListener('input', maj);
  maj();
}

// Couleur / niveau de gris : toute la grille
function modes() {
  const bloc = document.querySelector('[data-lct-modes]');
  const boutons = [...bloc.querySelectorAll('[data-lct-mode]')];
  boutons.forEach((b) => b.addEventListener('click', () => {
    bloc.dataset.version = b.dataset.lctMode;
    boutons.forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
  }));
}

// Tenues : l’étape suit la progression du scroll dans le bloc (planche
// fixe). Le nouvel aplat monte depuis le bas, la nouvelle photo descend
// depuis le haut, par-dessus les précédents.
function etapesTenues() {
  const bloc = document.querySelector('[data-lct-tenues]');
  const cadre = bloc.querySelector('.lct-tenues__cadre');
  const aplats = [...bloc.querySelectorAll('.lct-tenues__aplat')];
  const photos = [...bloc.querySelectorAll('.lct-tenues__photo')];
  let etape = 0;
  let dessus = 1;
  const devoiler = (el) => {
    el.style.transition = 'none';
    el.classList.remove('is-actif');
    el.style.zIndex = String(++dessus);
    void el.offsetWidth; // repart de l’état caché, sans animation
    el.style.transition = '';
    el.classList.add('is-actif');
  };
  const poser = (i) => {
    if (i === etape) return;
    etape = i;
    bloc.dataset.etape = String(i);
    devoiler(aplats[i]);
    devoiler(photos[i]);
  };
  // Les trois photos se chargent ensemble à l’approche
  new IntersectionObserver((entrees, obs) => {
    if (!entrees.some((e) => e.isIntersecting)) return;
    photos.forEach((p) => { p.loading = 'eager'; });
    obs.disconnect();
  }, { rootMargin: '100% 0px' }).observe(bloc);
  const maj = () => {
    const r = bloc.getBoundingClientRect();
    const haut = parseFloat(getComputedStyle(cadre).top) || 0;
    const course = r.height - cadre.offsetHeight;
    const u = course > 0 ? (haut - r.top) / course : 0;
    poser(Math.min(TENUES.length - 1, Math.max(0, Math.floor(u * TENUES.length))));
  };
  let attente = false;
  addEventListener('scroll', () => { if (!attente) { attente = true; requestAnimationFrame(() => { attente = false; maj(); }); } }, { passive: true });
  addEventListener('resize', maj, { passive: true });
  maj();
}

// Motif : couleur du symbole et couleur du fond ; jamais les deux identiques
// (le motif disparaîtrait) : la couleur prise par l’autre groupe s’échange
function recolorer() {
  const bloc = document.querySelector('[data-lct-motif]');
  const annonce = bloc.querySelector('[data-lct-motif-annonce]');
  const groupes = { motif: [...bloc.querySelectorAll('[data-lct-choix="motif"]')], fond: [...bloc.querySelectorAll('[data-lct-choix="fond"]')] };
  const nom = (c) => COULEURS.find(([, v]) => v === c)[0];
  const valeur = (g) => groupes[g].find((r) => r.checked).value;
  const appliquer = (g, c) => {
    groupes[g].forEach((r) => { r.checked = r.value === c; });
    bloc.style.setProperty(`--${g}`, c);
  };
  const dire = () => { annonce.textContent = `Motif ${nom(valeur('motif'))} sur fond ${nom(valeur('fond'))}`; };
  let avant = { motif: valeur('motif'), fond: valeur('fond') };
  Object.entries(groupes).forEach(([g, radios]) => radios.forEach((r) => r.addEventListener('change', () => {
    const autre = g === 'motif' ? 'fond' : 'motif';
    if (valeur(autre) === r.value) appliquer(autre, avant[g]);
    appliquer(g, r.value);
    avant = { motif: valeur('motif'), fond: valeur('fond') };
    dire();
  })));
  bloc.querySelector('[data-lct-hasard]').addEventListener('click', () => {
    const tirage = () => COULEURS[Math.floor(Math.random() * COULEURS.length)][1];
    let m; let f;
    do { m = tirage(); f = tirage(); } while (m === f || (m === avant.motif && f === avant.fond));
    appliquer('motif', m);
    appliquer('fond', f);
    avant = { motif: m, fond: f };
    dire();
  });
}

// Rubik : la graisse va et vient de Light (300) à Black (900) tant que le
// bloc est à l’écran ; le curseur la règle à la main (l’animation s’arrête),
// le bouton relance ou met en pause. Immobile en Black avec « réduire les animations ».
function rubik() {
  const bloc = document.querySelector('[data-lct-rubik]');
  const texte = bloc.querySelector('[data-lct-rubik-texte]');
  const curseur = bloc.querySelector('[data-lct-graisse]');
  const sortie = bloc.querySelector('[data-lct-graisse-valeur]');
  const bouton = bloc.querySelector('[data-lct-lecture]');
  const nomBouton = bloc.querySelector('[data-lct-lecture-nom]');
  const CYCLE = 5200; // ms pour un aller-retour, avec un temps d’arrêt à chaque bout
  let lecture = !calme();
  let visible = false;
  let raf = 0;
  let t0 = 0;
  let decalage = 0;

  const poser = (g) => {
    const v = Math.round(g);
    texte.style.fontVariationSettings = `"wght" ${v}`;
    texte.style.fontWeight = v;
    curseur.value = v;
    sortie.textContent = v;
  };
  // 0 → 1 → 0 sur un cycle, avec un palier en haut et en bas
  const courbe = (u) => {
    const x = u < 0.5 ? u * 2 : (1 - u) * 2;
    const y = Math.min(1, Math.max(0, (x - 0.12) / 0.76));
    return y * y * (3 - 2 * y);
  };
  const image = (t) => {
    const u = ((t - t0 + decalage) % CYCLE) / CYCLE;
    poser(900 - 600 * courbe(u));
    raf = requestAnimationFrame(image);
  };
  const etat = () => {
    cancelAnimationFrame(raf);
    bouton.setAttribute('aria-pressed', String(!lecture));
    nomBouton.textContent = lecture ? 'Mettre en pause l’animation de la graisse' : 'Lancer l’animation de la graisse';
    bouton.classList.toggle('is-pause', !lecture);
    if (lecture && visible) {
      // Reprise à la graisse affichée : on retrouve sa place dans le cycle
      const g = Number(curseur.value);
      const y = (900 - g) / 600;
      const x = 0.12 + 0.76 * y; // inverse approché du palier
      decalage = (x / 2) * CYCLE;
      t0 = performance.now();
      raf = requestAnimationFrame(image);
    }
  };
  bouton.addEventListener('click', () => { lecture = !lecture; etat(); });
  curseur.addEventListener('input', () => {
    if (lecture) { lecture = false; etat(); }
    poser(Number(curseur.value));
  });
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; etat(); }).observe(bloc);
  poser(900);
  etat();
}

// Sofia Pro Condensed : inspecteur de glyphes. Le glyphe choisi s’affiche en
// grand entre ses lignes (ascendante, hauteur de capitale, hauteur d’x, ligne
// de base, descendante) mesurées dans la police, avec ses noms et son code.
// Tant qu’on n’y touche pas, une visite passe d’un glyphe à l’autre.
function sofia() {
  const bloc = document.querySelector('[data-lct-sofia]');
  const grille = bloc.querySelector('[data-lct-grille]');
  const boutons = [...grille.querySelectorAll('button')];
  const style = bloc.querySelector('[data-lct-style]');
  const glyphe = bloc.querySelector('[data-lct-glyphe-texte]');
  const titre = bloc.querySelector('[data-lct-glyphe-titre]');
  const svg = bloc.querySelector('[data-lct-glyphe]');
  const lignes = bloc.querySelector('[data-lct-lignes]');
  const annonce = bloc.querySelector('[data-lct-sofia-annonce]');
  let actif = 34; // « C », comme Central
  let visite = 0;
  let touche = false;

  // Mesures de la police (unités pour un corps de 1000) ; valeurs de secours
  // si Sofia Pro Condensed n’est pas encore là
  const mesurer = () => {
    const ctx = document.createElement('canvas').getContext('2d');
    ctx.font = `${style.value} 1000px ${SOFIA}`;
    const H = ctx.measureText('H');
    const x = ctx.measureText('x');
    const m = {
      asc: Math.round(H.fontBoundingBoxAscent || 920),
      cap: Math.round(H.actualBoundingBoxAscent || 700),
      x: Math.round(x.actualBoundingBoxAscent || 480),
      desc: Math.round(H.fontBoundingBoxDescent || 230),
    };
    const haut = m.asc + 80;
    const total = haut + m.desc + 80;
    svg.setAttribute('viewBox', `0 0 1400 ${total}`);
    glyphe.setAttribute('y', haut);
    const ligne = (nom, y, val) => `<line x1="0" x2="1400" y1="${y}" y2="${y}"/><text x="0" y="${y - 14}">${nom}</text><text x="1400" y="${y - 14}" text-anchor="end">${val}</text>`;
    lignes.innerHTML = [
      ligne('Ascendante', haut - m.asc, m.asc),
      ligne('Hauteur de capitale', haut - m.cap, m.cap),
      ligne('Hauteur d’x', haut - m.x, m.x),
      ligne('Ligne de base', haut, 0),
      ligne('Descendante', haut + m.desc, -m.desc),
    ].join('');
  };

  const choisir = (i, { dire = false } = {}) => {
    actif = i;
    const c = car(i);
    const [, u] = GLYPHES[i];
    glyphe.textContent = c;
    titre.textContent = `${u}, en Sofia Pro Condensed`;
    boutons.forEach((b, k) => b.setAttribute('aria-pressed', String(k === i)));
    if (dire) annonce.textContent = `${u}, U+${(0x21 + i).toString(16).padStart(4, '0').toUpperCase()}`;
  };
  const graisse = () => { bloc.style.setProperty('--sofia-g', style.value); mesurer(); };

  // La main de l’internaute arrête la visite
  const arreter = () => { touche = true; clearInterval(visite); };
  grille.addEventListener('pointerover', (e) => {
    const b = e.target.closest('button');
    if (!b || e.pointerType !== 'mouse') return;
    arreter();
    choisir(Number(b.dataset.c));
  });
  grille.addEventListener('click', (e) => {
    const b = e.target.closest('button');
    if (!b) return;
    arreter();
    choisir(Number(b.dataset.c), { dire: true });
  });
  grille.addEventListener('focusin', (e) => {
    const b = e.target.closest('button');
    if (!b) return;
    arreter();
    choisir(Number(b.dataset.c));
  });
  // Flèches : déplacement dans la grille (12 colonnes)
  grille.addEventListener('keydown', (e) => {
    const pas = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -12, ArrowDown: 12 }[e.key];
    if (pas === undefined) return;
    const i = Number(e.target.closest('button')?.dataset.c);
    const j = Math.min(boutons.length - 1, Math.max(0, i + pas));
    if (j === i) return;
    e.preventDefault();
    boutons[j].focus();
  });
  style.addEventListener('change', () => { arreter(); graisse(); });

  // Visite automatique : un glyphe toutes les 1,4 s quand le bloc est à l’écran
  const SUITE = [...'2+#6FELZYbdgoeU=C'].map((c) => c.charCodeAt(0) - 0x21);
  let k = 0;
  new IntersectionObserver(([e]) => {
    clearInterval(visite);
    if (!e.isIntersecting || touche || calme()) return;
    visite = setInterval(() => {
      const i = SUITE[k % SUITE.length];
      k += 1;
      choisir(i);
      // La grille défile pour montrer la case (jamais la page)
      const b = boutons[i];
      if (b.offsetTop < grille.scrollTop || b.offsetTop + b.offsetHeight > grille.scrollTop + grille.clientHeight) {
        grille.scrollTo({ top: b.offsetTop - grille.clientHeight / 2 + b.offsetHeight / 2, behavior: 'smooth' });
      }
    }, 1400);
  }, { threshold: 0.3 }).observe(bloc);

  graisse();
  choisir(actif);
  document.fonts?.load(`400 100px ${SOFIA}`).then(mesurer, () => {});
  document.fonts?.ready.then(mesurer);
}

/* Entrée du gabarit --------------------------------------------------------- */
export async function rendre(p) {
  dossier = p.dossier;
  document.body.classList.add('page-cl', 'page-lct');
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', '#200603');
  // Sofia Pro Condensed ne se charge que sur cette page
  if (!document.querySelector(`link[href="${POLICES}"]`)) {
    const l = document.createElement('link');
    l.rel = 'stylesheet';
    l.href = POLICES;
    document.head.append(l);
  }
  const main = document.querySelector('main');
  main.querySelectorAll('[data-projet-hero], [data-projet-intro], [data-projet="galerie"]').forEach((n) => n.remove());
  main.insertAdjacentHTML('afterbegin', gabarit(p));
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
  videos();
  comparer();
  incisions();
  modes();
  etapesTenues();
  recolorer();
  coller();
  rubik();
  sofia();
  // Les polices arrivent après la mise en page : l’encart se remesure
  document.fonts?.ready.then(() => dispatchEvent(new Event('resize')));
  dispatchEvent(new Event('resize'));
}
