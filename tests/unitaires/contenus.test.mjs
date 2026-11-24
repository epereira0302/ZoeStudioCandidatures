// Cohérence des contenus : chaque projet, catégorie, image et gabarit référencés existent
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';

const racine = new URL('../../', import.meta.url);
const json = (f) => JSON.parse(readFileSync(new URL(f, racine), 'utf8'));
const existe = (f) => existsSync(new URL(f, racine));
const { categories, projets } = json('contenu/projets.json');
const site = json('contenu/site.json');

test('les slugs des projets sont uniques et sûrs dans une adresse', () => {
  const slugs = projets.map((p) => p.slug);
  assert.equal(new Set(slugs).size, slugs.length);
  for (const s of slugs) assert.match(s, /^[a-z0-9]+(-[a-z0-9]+)*$/, s);
});

test('chaque projet appartient à une catégorie connue, et chaque catégorie a un projet', () => {
  const ids = new Set(categories.map((c) => c.id));
  for (const p of projets) assert.ok(ids.has(p.categorie), `${p.slug} : catégorie ${p.categorie}`);
  for (const p of projets) for (const id of p.categories ?? []) assert.ok(ids.has(id), `${p.slug} : catégorie ${id}`);
  for (const c of categories) assert.ok(projets.some((p) => (p.categories ?? [p.categorie]).includes(c.id)), `catégorie vide : ${c.id}`);
});

test('chaque projet a un titre, des planches cohérentes et une couverture dans sa plage', () => {
  for (const p of projets) {
    assert.ok(p.titre?.trim(), `${p.slug} : titre`);
    assert.ok(Number.isInteger(p.planches.de) && p.planches.de <= p.planches.a, `${p.slug} : planches`);
    assert.ok(p.couverture >= p.planches.de && p.couverture <= p.planches.a, `${p.slug} : couverture hors plage`);
  }
});

test('toutes les planches existent en grande et en petite version', () => {
  const manquantes = [];
  for (const p of projets) {
    const prefixe = categories.find((c) => c.id === p.categorie).prefixe;
    for (let n = p.planches.de; n <= p.planches.a; n++) {
      const nn = String(n).padStart(2, '0');
      for (const f of [`${prefixe}-${nn}.webp`, `${prefixe}-${nn}-s.webp`]) if (!existe(`contenu/images/planches/${f}`)) manquantes.push(f);
    }
  }
  assert.deepEqual(manquantes, []);
});

test('chaque projet a sa photo dans la grille de la page Projets', () => {
  const manquantes = projets.flatMap((p) => [`${p.slug}.webp`, `${p.slug}-s.webp`]).filter((f) => !existe(`contenu/images/projets/grille/${f}`));
  assert.deepEqual(manquantes, []);
});

test('un gabarit annoncé a son script, sa feuille de style et son dossier d’images', () => {
  const html = readFileSync(new URL('projet.html', racine), 'utf8');
  for (const p of projets.filter((x) => x.gabarit)) {
    assert.ok(existe(`assets/js/gabarits/${p.gabarit}.js`), `${p.slug} : script`);
    assert.ok(html.includes(`assets/css/gabarits/${p.gabarit}.css`) || existe(`assets/css/gabarits/${p.gabarit}.css`), `${p.slug} : feuille de style`);
    assert.ok(p.dossier && existe(p.dossier), `${p.slug} : dossier`);
  }
});

test('les images de galerie et d’ouverture citées existent', () => {
  const manquantes = [];
  for (const p of projets.filter((x) => x.dossier)) {
    const items = [...(p.galerie ?? []).flatMap((g) => g.images ?? []), ...(p.hero ? [p.hero] : [])];
    for (const it of items) for (const f of [`${it.img}.webp`, `${it.img}-s.webp`]) if (!existe(`${p.dossier}/${f}`)) manquantes.push(`${p.slug}/${f}`);
  }
  assert.deepEqual(manquantes, []);
});

test('les médias écrits en dur dans les gabarits existent', () => {
  const manquants = [];
  for (const g of ['studio-zoe', 'columbus', 'le-central-technique', 'buttermelt-glaze', 'kiss-cafe', 'columbus-images', 'coupe-du-monde']) {
    const code = readFileSync(new URL(`assets/js/gabarits/${g}.js`, racine), 'utf8');
    const dossier = projets.find((p) => p.gabarit === g).dossier;
    // img('nom', …), video('nom', …), masque('nom')
    for (const [, type, nom] of code.matchAll(/\b(img|video|masque)\('([\w-]+)'/g)) {
      const fichiers = type === 'video' ? [`${nom}.mp4`, `${nom}-poster.webp`] : type === 'masque' ? [`${nom}.webp`] : [`${nom}.webp`, `${nom}-s.webp`];
      for (const f of fichiers) if (!existe(`${dossier}/${f}`)) manquants.push(`${g} : ${f}`);
    }
  }
  assert.deepEqual(manquants, []);
});

test('site.json : coordonnées de contact complètes et bien formées', () => {
  assert.match(site.contact.email, /^[^@\s]+@[^@\s]+\.[a-z]{2,}$/);
  assert.match(site.contact.telephone.replace(/\s/g, ''), /^\+33\d{9}$/);
  assert.match(site.contact.linkedin, /^https:\/\/www\.linkedin\.com\//);
});

test('aucun fichier HTML ne pointe vers un script, une feuille ou une image absente', () => {
  const manquants = [];
  for (const page of ['index.html', 'projets.html', 'projet.html', 'mentions-legales.html', '404.html']) {
    const html = readFileSync(new URL(page, racine), 'utf8');
    for (const [, url] of html.matchAll(/(?:src|href)="((?!https?:|mailto:|tel:|#|data:)[^"?#]+\.(?:js|css|webp|png|jpg|svg|ico|woff2|mp4))"/g)) {
      if (!existe(url)) manquants.push(`${page} → ${url}`);
    }
  }
  assert.deepEqual(manquants, []);
});

test('la liste des mises en page préchargées dans projet.html suit les contenus', () => {
  const html = readFileSync(new URL('projet.html', racine), 'utf8');
  const liste = JSON.parse(html.match(/[ ,]G=(\{.*?\});/)[1]);
  const attendus = projets.filter((p) => p.gabarit);
  assert.deepEqual(Object.keys(liste).sort(), attendus.map((p) => p.slug).sort());
  for (const p of attendus) {
    const [principal, ...autres] = liste[p.slug];
    assert.equal(principal, p.gabarit, p.slug);
    // Les modules importés par la mise en page sont préchargés avec elle
    const source = readFileSync(new URL(`assets/js/gabarits/${p.gabarit}.js`, racine), 'utf8');
    const importes = [...source.matchAll(/from '\.\/([\w-]+)\.js(?:\?v=[\w-]+)?'/g)].map((m) => m[1]);
    assert.deepEqual([...autres].sort(), importes.sort(), p.slug);
    for (const n of liste[p.slug]) assert.ok(existe(`assets/js/gabarits/${n}.js`), n);
  }
});

test('les gabarits importent columbus.js au numéro de version de projet.html', () => {
  const html = readFileSync(new URL('projet.html', racine), 'utf8');
  const v = html.match(/SZ_GABARITS='([\w-]+)'/)[1];
  for (const p of projets.filter((x) => x.gabarit && x.gabarit !== 'columbus')) {
    const source = readFileSync(new URL(`assets/js/gabarits/${p.gabarit}.js`, racine), 'utf8');
    assert.match(source, new RegExp(`from './columbus\\.js\\?v=${v}'`), p.gabarit);
  }
});
