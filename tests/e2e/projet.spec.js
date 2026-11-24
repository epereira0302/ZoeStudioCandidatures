// Pages projet : page type, gabarits sur mesure, projet introuvable, projets suivants
import { test, expect, allerA, projets } from './outils.js';

test.describe('Toutes les pages projet', () => {
  test('chaque projet de projets.json s’affiche sans erreur, avec son titre', async ({ page, request }) => {
    test.slow();
    for (const p of await projets(request)) {
      await page.goto(`/projet.html?p=${p.slug}`);
      await expect(page).toHaveTitle(new RegExp((p.nom || p.titre).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
      await expect(page.locator('.suivant__item')).toHaveCount(3);
    }
  });
});

test('un projet inconnu affiche « Projet introuvable » et un lien de retour', async ({ page }) => {
  await page.goto('/projet.html?p=nexiste-pas');
  await expect(page).toHaveTitle(/Projet introuvable/);
  await expect(page.locator('[data-projet="titre"]')).toHaveText('Projet introuvable');
  await expect(page.locator('[data-projet="texte"] a')).toHaveAttribute('href', './');
});

test.describe('Page projet type', () => {
  test('affiche la fiche et les planches du projet', async ({ page, request }) => {
    const p = (await projets(request)).find((x) => !x.gabarit && !x.galerie);
    test.skip(!p, 'site des candidatures : chaque projet a sa mise en page sur mesure');
    await page.goto(`/projet.html?p=${p.slug}`);
    await expect(page.locator('[data-projet="titre"]')).toContainText(p.nom || p.titre);
    await expect(page.locator('main img').first()).toBeVisible();
    await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /.+/);
  });
});

test.describe('Projets suivants', () => {
  test('montre les trois projets d’après et la flèche passe au suivant', async ({ page, request }) => {
    const liste = await projets(request);
    const i = liste.findIndex((p) => p.slug === 'glowy-winter');
    const attendus = [1, 2, 3].map((k) => liste[(i + k) % liste.length]);
    await page.goto('/projet.html?p=glowy-winter');
    await allerA(page, '.projet-suivant');
    const actif = page.locator('.suivant__item.is-actif .suivant__titre');
    const depart = await actif.textContent();
    expect(attendus.map((p) => p.titre)).toContain(depart);
    await page.locator('.suivant__fleche--suiv').click();
    await expect(actif).not.toHaveText(depart);
    await expect(page.locator('.suivant__fleche')).toHaveCount(1);
    await expect(page.locator('.suivant__fleche')).toHaveAttribute('aria-label', /projet/i);
  });

  test('la pile s’arrête au survol puis repart', async ({ page, isMobile }) => {
    test.skip(isMobile, 'survol à la souris seulement');
    await page.goto('/projet.html?p=glowy-winter');
    await allerA(page, '.projet-suivant');
    const actif = page.locator('.suivant__item.is-actif .suivant__titre');
    await page.locator('.suivant__pile').hover();
    const fige = await actif.textContent();
    await page.waitForTimeout(3000);
    await expect(actif).toHaveText(fige);
    await page.mouse.move(2, 2);
    await expect(actif).not.toHaveText(fige, { timeout: 5000 });
  });

  test('le titre le plus long reste dans sa colonne, sans passer sous la pile', async ({ page, isMobile }) => {
    test.skip(isMobile, 'sur mobile la pile est sous le titre');
    await page.goto('/projet.html?p=studio-zoe');
    await allerA(page, '.projet-suivant');
    const mesure = await page.evaluate(() => {
      const pile = document.querySelector('.suivant__pile').getBoundingClientRect();
      return [...document.querySelectorAll('.suivant__titre')].map((t) => {
        const r = document.createRange(); r.selectNodeContents(t);
        return Math.max(...[...r.getClientRects()].map((x) => x.right)) - pile.left;
      });
    });
    for (const m of mesure) expect(m).toBeLessThanOrEqual(0);
  });
});
