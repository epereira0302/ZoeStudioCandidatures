// Fonctions de assets/js/donnees.js qui ne dépendent pas de la page
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { planche, urlProjet, lire, chargerDonnees } from '../../assets/js/donnees.js';

test('planche : chemin de la grande et de la petite version, numéro sur deux chiffres', () => {
  const p = { prefixe: 'packaging' };
  assert.equal(planche(p, 3), 'contenu/images/planches/packaging-03.webp');
  assert.equal(planche(p, 12, true), 'contenu/images/planches/packaging-12-s.webp');
});

test('urlProjet : le slug est encodé dans l’adresse', () => {
  assert.equal(urlProjet({ slug: 'studio-zoe' }), 'projet.html?p=studio-zoe');
  assert.equal(urlProjet({ slug: 'é & co' }), 'projet.html?p=%C3%A9%20%26%20co');
});

test('lire : suit un chemin pointé et s’arrête sans erreur sur un trou', () => {
  const site = { contact: { email: 'a@b.fr', vide: null } };
  assert.equal(lire(site, 'contact.email'), 'a@b.fr');
  assert.equal(lire(site, 'contact.vide.x'), null);
  assert.equal(lire(site, 'absent.x'), undefined);
});

test('chargerDonnees : complète chaque projet et compte projets, planches et phares', async () => {
  const lecture = (url) => import('node:fs/promises').then((fs) => fs.readFile(new URL(url)));
  const avant = globalThis.fetch;
  let appels = 0;
  globalThis.fetch = async (url) => { appels++; const t = await lecture(url); return { json: async () => JSON.parse(t) }; };
  try {
    const d = await chargerDonnees();
    const brut = JSON.parse(await lecture(new URL('../../contenu/projets.json', import.meta.url)));
    assert.equal(d.projets.length, brut.projets.length);
    assert.equal(d.compte.projets, String(brut.projets.length));
    assert.equal(d.projets[0].numero, '01');
    for (const p of d.projets) {
      const c = brut.categories.find((x) => x.id === p.categorie);
      const ids = p.categories?.length ? p.categories : [p.categorie];
      assert.deepEqual(p.categoriesIds, ids, `${p.slug} : catégories`);
      assert.equal(p.categorieNom, ids.map((id) => brut.categories.find((x) => x.id === id).nom).join(' et '), `${p.slug} : nom de catégorie`);
      assert.equal(p.prefixe, c.prefixe);
    }
    const planches = brut.projets.reduce((n, p) => n + p.planches.a - p.planches.de + 1, 0);
    assert.equal(d.compte.planches, String(planches));
    assert.equal(d.compte.phares, String(brut.projets.filter((p) => p.phare).length).padStart(2, '0'));
    // Mis en cache : un second appel ne relit rien
    await chargerDonnees();
    assert.equal(appels, 2);
  } finally {
    globalThis.fetch = avant;
  }
});
