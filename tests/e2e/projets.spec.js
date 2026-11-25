// Page Projets : index défilant (liste des noms fixe, couvertures qui défilent)
import { test, expect, projets } from './outils.js';

// Amène la couverture n° i sur la ligne de repère
const amener = (page, i) => page.locator('.index__visuel').nth(i).evaluate((li) => {
  const r = li.getBoundingClientRect();
  const fen = document.querySelector('.index__fenetre').getBoundingClientRect();
  const repere = matchMedia('(max-width: 899px)').matches ? (fen.bottom + innerHeight) / 2 : innerHeight / 2;
  window.scrollTo(0, scrollY + r.top + r.height / 2 - repere);
});

test.describe('Page Projets', () => {
  test('un nom et une couverture par projet, dans l’ordre de projets.json, sans paragraphe d’introduction', async ({ page, request }) => {
    const liste = await projets(request);
    await page.goto('/projets.html');
    const noms = page.locator('.index__nom');
    await expect(noms).toHaveCount(liste.length);
    await expect(page.locator('.index__image')).toHaveCount(liste.length);
    await expect(noms.first()).toHaveAttribute('href', `projet.html?p=${liste[0].slug}`);
    await expect(noms.last().locator('.index__texte')).toHaveText(liste.at(-1).nomIndex || liste.at(-1).titre);
    await expect(page.locator('.grille-intro, [data-filtres]')).toHaveCount(0);
    await expect(page.locator('h1')).toHaveCount(1);
  });

  test('le projet au centre de l’écran est en encre, avec son compteur', async ({ page, request }) => {
    const liste = await projets(request);
    await page.goto('/projets.html');
    await expect(page.locator('.index__ligne').first()).toHaveClass(/is-actif/);
    await expect(page.locator('body')).toHaveClass(/est-pret/);
    await page.waitForTimeout(1500); // fin de l’entrée en fondu des couvertures
    await amener(page, 4);
    await expect(page.locator('.index__ligne').nth(4)).toHaveClass(/is-actif/);
    await expect(page.locator('.index__ligne.is-actif')).toHaveCount(1);
    await expect(page.locator('.index__nom[aria-current="true"]')).toHaveText(new RegExp(liste[4].nomIndex || liste[4].titre));
    await expect(page.locator('[data-index-actif]')).toHaveText('05');
    await expect(page.locator('.index__ligne.is-actif .index__meta')).toHaveText('Identité visuelle et Packaging');
    // La liste glisse : le nom actif reste près de la ligne de repère
    const ecart = await page.locator('.index__ligne.is-actif').evaluate((l) => {
      const f = document.querySelector('.index__fenetre').getBoundingClientRect();
      const r = l.getBoundingClientRect();
      return Math.abs((r.top + r.bottom) / 2 - (f.top + f.bottom) / 2);
    });
    expect(ecart).toBeLessThan(30);
  });

  test('au clavier, le focus sur un nom amène sa couverture au centre', async ({ page, isMobile }) => {
    test.skip(isMobile, 'tabulation au clavier');
    await page.goto('/projets.html');
    await expect(page.locator('body')).toHaveClass(/est-pret/);
    await page.locator('.index__nom').nth(6).focus();
    await expect(page.locator('.index__ligne').nth(6)).toHaveClass(/is-actif/, { timeout: 5000 });
  });

  test('les couvertures ne sont pas des arrêts de tabulation en double', async ({ page }) => {
    await page.goto('/projets.html');
    await expect(page.locator('.index__image[tabindex="-1"][aria-hidden="true"]')).toHaveCount(await page.locator('.index__image').count());
  });

  test('un clic sur une couverture ouvre le projet', async ({ page, request }) => {
    const liste = await projets(request);
    await page.goto('/projets.html');
    await amener(page, 1);
    await page.waitForTimeout(300);
    await page.locator('.index__image').nth(1).click();
    await expect(page).toHaveURL(new RegExp(`p=${liste[1].slug}`));
  });

  test('un clic sur un nom ouvre le projet', async ({ page, request }) => {
    const liste = await projets(request);
    await page.goto('/projets.html');
    await page.locator('.index__nom').first().click();
    await expect(page).toHaveURL(new RegExp(`p=${liste[0].slug}`));
  });

  test('pas de défilement horizontal, sur ordinateur comme sur mobile', async ({ page }) => {
    await page.goto('/projets.html');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  });

  test('la photo agrandie reste à l’écran pendant que la page projet se construit, puis s’efface', async ({ page }) => {
    await page.goto('/projets.html');
    test.skip(await page.evaluate(() => matchMedia('(prefers-reduced-motion: reduce)').matches), 'pas d’effet d’ouverture avec « réduire les animations »');
    // Relevé à l’arrivée sur la page projet, avant que ses contenus ne soient chargés
    await page.addInitScript(() => document.addEventListener('DOMContentLoaded', () => {
      const html = document.documentElement;
      window.__ouverture = { gardee: html.classList.contains('ouverture'), image: getComputedStyle(html).getPropertyValue('--ouverture-img') };
    }));
    await page.locator('.index__image').first().click();
    await expect(page).toHaveURL(/projet\.html\?p=/);
    await expect(page.locator('body')).toHaveClass(/est-pret/);
    const releve = await page.evaluate(() => window.__ouverture);
    expect(releve.gardee).toBe(true);
    expect(releve.image).toMatch(/^url\(".+\.webp"\)$/);
    // Une fois la page prête, l’image s’efface et ne laisse rien derrière elle
    await expect(page.locator('html')).not.toHaveClass(/ouverture/);
    expect(await page.evaluate(() => sessionStorage.getItem('sz-ouverture-img') ?? sessionStorage.getItem('sz-ouverture-mini'))).toBeNull();
  });

  test('Columbus Café et Heinz ont leur couverture choisie, ici et sur l’accueil', async ({ page }) => {
    await page.goto('/projets.html');
    const attendu = { 'columbus-cafe-brand-identity': 'columbus-cest-le-moment/couverture', 'heinz-krispy-kreme': 'heinz-krispy-kreme/couverture' };
    for (const [slug, image] of Object.entries(attendu)) {
      await expect(page.locator(`.index__image[href$="p=${slug}"] img`)).toHaveAttribute('src', new RegExp(image));
    }
    await page.goto('/');
    const phares = page.locator('[data-phares-liste] img');
    await expect(phares).toHaveCount(2); // la troisième couverture est une vidéo
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
    await page.locator('.index__image[href$="p=studio-zoe"]').click();
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
    const lien = page.locator('.index__image[href$="p=ne-gardez-que-le-meilleur-des-us"]');
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
