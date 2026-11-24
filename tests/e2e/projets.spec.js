// Page Projets : grille de tous les projets et filtres par catégorie
import { test, expect, projets } from './outils.js';

test.describe('Page Projets', () => {
  test('affiche un lien par projet, dans l’ordre de projets.json', async ({ page, request }) => {
    const liste = await projets(request);
    await page.goto('/projets.html');
    const liens = page.locator('.grille__lien');
    await expect(liens).toHaveCount(liste.length);
    await expect(liens.first()).toHaveAttribute('href', `projet.html?p=${liste[0].slug}`);
    await expect(liens.last().locator('.grille__nom')).toHaveText(liste.at(-1).titre);
  });

  test('un filtre ne garde que sa catégorie, l’annonce et met l’adresse à jour', async ({ page, request }) => {
    const liste = await projets(request);
    await page.goto('/projets.html');
    const filtre = page.locator('[data-filtre]').nth(1);
    const id = await filtre.getAttribute('data-filtre');
    await filtre.click();
    await expect(filtre).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('.grille__item:not([hidden])')).toHaveCount(liste.filter((p) => (p.categories ?? [p.categorie]).includes(id)).length);
    await expect(page).toHaveURL(new RegExp(`categorie=${id}`));
    await expect(page.locator('[data-grille-statut]')).toContainText('affichés');
    // Un second clic sur le même filtre ne change rien
    await filtre.click();
    await expect(filtre).toHaveAttribute('aria-pressed', 'true');
  });

  test('« Tous » remet toute la grille', async ({ page, request }) => {
    const liste = await projets(request);
    await page.goto('/projets.html?categorie=packaging');
    await expect(page.locator('.grille__item:not([hidden])')).toHaveCount(liste.filter((p) => (p.categories ?? [p.categorie]).includes('packaging')).length);
    await page.locator('[data-filtre=""]').click();
    await expect(page.locator('.grille__item:not([hidden])')).toHaveCount(liste.length);
    await expect(page).not.toHaveURL(/categorie=/);
    await expect(page.locator('[data-grille-statut]')).toHaveText('Tous les projets affichés');
  });

  test('une catégorie inconnue dans l’adresse affiche tout', async ({ page, request }) => {
    const liste = await projets(request);
    await page.goto('/projets.html?categorie=inexistante');
    await expect(page.locator('.grille__item:not([hidden])')).toHaveCount(liste.length);
  });

  test('un clic sur une photo ouvre le projet', async ({ page, request }) => {
    const liste = await projets(request);
    await page.goto('/projets.html');
    await page.locator('.grille__lien').nth(1).click();
    await expect(page).toHaveURL(new RegExp(`p=${liste[1].slug}`));
  });

  test('la photo agrandie reste à l’écran pendant que la page projet se construit, puis s’efface', async ({ page }) => {
    await page.goto('/projets.html');
    test.skip(await page.evaluate(() => matchMedia('(prefers-reduced-motion: reduce)').matches), 'pas d’effet d’ouverture avec « réduire les animations »');
    // Relevé à l’arrivée sur la page projet, avant que ses contenus ne soient chargés
    await page.addInitScript(() => document.addEventListener('DOMContentLoaded', () => {
      const html = document.documentElement;
      window.__ouverture = { gardee: html.classList.contains('ouverture'), image: getComputedStyle(html).getPropertyValue('--ouverture-img') };
    }));
    await page.locator('.grille__lien').first().click();
    await expect(page).toHaveURL(/projet\.html\?p=/);
    await expect(page.locator('body')).toHaveClass(/est-pret/);
    const releve = await page.evaluate(() => window.__ouverture);
    expect(releve.gardee).toBe(true);
    expect(releve.image).toMatch(/^url\(".+\.webp"\)$/);
    // Une fois la page prête, l’image s’efface et ne laisse rien derrière elle
    await expect(page.locator('html')).not.toHaveClass(/ouverture/);
    expect(await page.evaluate(() => sessionStorage.getItem('sz-ouverture-img') ?? sessionStorage.getItem('sz-ouverture-mini'))).toBeNull();
  });

  test('Studio Zoé, Columbus Café et Heinz ont leur couverture choisie, ici et sur l’accueil', async ({ page }) => {
    await page.goto('/projets.html');
    const attendu = { 'studio-zoe': 'studio-zoe/couverture', 'columbus-cafe-brand-identity': 'columbus-cest-le-moment/couverture', 'heinz-krispy-kreme': 'heinz-krispy-kreme/couverture' };
    for (const [slug, image] of Object.entries(attendu)) {
      await expect(page.locator(`.grille__lien[data-slug="${slug}"] img`)).toHaveAttribute('src', new RegExp(image));
    }
    await page.goto('/');
    const phares = page.locator('[data-phares-liste] img');
    await expect(phares).toHaveCount(3); // la quatrième couverture est une vidéo
    for (const [i, image] of Object.values(attendu).entries()) await expect(phares.nth(i)).toHaveAttribute('src', new RegExp(image));
  });

  test('à l’ouverture, l’image rejoint la place du premier visuel du projet avant de s’y fondre', async ({ page }) => {
    await page.goto('/projets.html');
    test.skip(await page.evaluate(() => matchMedia('(prefers-reduced-motion: reduce)').matches), 'pas d’effet d’ouverture avec « réduire les animations »');
    await page.addInitScript(() => {
      new MutationObserver(() => {
        const html = document.documentElement;
        if (html?.classList.contains('ouverture-vers') && !window.__vers) {
          window.__vers = ['--ov-t', '--ov-l', '--ov-w', '--ov-h'].map((v) => parseFloat(html.style.getPropertyValue(v)));
        }
      }).observe(document, { attributes: true, subtree: true, attributeFilter: ['class'] });
    });
    await page.locator('.grille__lien[data-slug="studio-zoe"]').click();
    await expect(page).toHaveURL(/p=studio-zoe/);
    await expect(page.locator('body')).toHaveClass(/est-pret/);
    await expect(page.locator('html')).not.toHaveClass(/ouverture/);
    const vers = await page.evaluate(() => window.__vers);
    expect(vers).toBeTruthy();
    // Le cadre visé est celui de la première section, désignée par le gabarit
    const r = await page.locator('[data-ouverture]').evaluate((s) => s.getBoundingClientRect().toJSON());
    expect(Math.abs(vers[1] - r.left)).toBeLessThan(2);
    expect(Math.abs(vers[2] - r.width)).toBeLessThan(2);
  });

  test('la couverture vidéo grandit et ouvre le projet sur l’image vue au clic', async ({ page }) => {
    await page.goto('/projets.html');
    test.skip(await page.evaluate(() => matchMedia('(prefers-reduced-motion: reduce)').matches), 'pas d’effet d’ouverture avec « réduire les animations »');
    const lien = page.locator('.grille__lien[data-slug="ne-gardez-que-le-meilleur-des-us"]');
    await expect(lien.locator('video')).toHaveCount(1);
    await lien.scrollIntoViewIfNeeded();
    await expect.poll(() => lien.locator('video').evaluate((x) => x.readyState >= 2), { timeout: 8000 }).toBe(true);
    await page.addInitScript(() => document.addEventListener('DOMContentLoaded', () => {
      const html = document.documentElement;
      window.__ouverture = { gardee: html.classList.contains('ouverture'), mini: getComputedStyle(html).getPropertyValue('--ouverture-mini').startsWith('url("data:image/jpeg') };
    }));
    await lien.click();
    await expect(page).toHaveURL(/p=ne-gardez-que-le-meilleur-des-us/);
    await expect(page.locator('body')).toHaveClass(/est-pret/);
    expect(await page.evaluate(() => window.__ouverture)).toEqual({ gardee: true, mini: true });
    await expect(page.locator('html')).not.toHaveClass(/ouverture/);
  });
});
