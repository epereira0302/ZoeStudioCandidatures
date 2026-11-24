// Gabarit « Ne gardez que le meilleur des US » : fiches, bandeau qui défile,
// vidéos et leur son, affiche bleue fixe pendant que les posts défilent
import { test, expect } from './outils.js';

const URL_PROJET = '/projet.html?p=ne-gardez-que-le-meilleur-des-us';

test.describe('Ne gardez que le meilleur des US', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(URL_PROJET);
    await expect(page.locator('.page-us')).toBeVisible();
  });

  test('trois chapitres, chacun avec sa fiche : client, année, titre et type', async ({ page }) => {
    await expect(page.locator('h1')).toHaveText('Ne gardez que le meilleur des US');
    const fiches = page.locator('.us-fiche');
    await expect(fiches).toHaveCount(3);
    for (const [i, type] of ['Spot publicitaire', 'Campagne d’affichage', 'Publicité web et magazine'].entries()) {
      await expect(fiches.nth(i)).toContainText('Columbus Café');
      await expect(fiches.nth(i)).toContainText('2025');
      await expect(fiches.nth(i).locator('.cl-encart__sous')).toHaveText(type);
    }
    for (const id of ['us-spot', 'us-affichage', 'us-web']) await expect(page.locator(`#${id}`)).toHaveCount(1);
  });

  test('chaque image a un texte de remplacement et chaque vidéo un libellé', async ({ page }) => {
    const sansAlt = await page.locator('.us-visuels img').evaluateAll((imgs) => imgs.filter((i) => !i.alt.trim()).length);
    expect(sansAlt).toBe(0);
    await expect(page.locator('.us-visuels video')).toHaveCount(2);
    const sansLibelle = await page.locator('.us-visuels video').evaluateAll((v) => v.filter((x) => !x.getAttribute('aria-label')?.trim()).length);
    expect(sansLibelle).toBe(0);
  });

  test('le slogan du bandeau est lu une seule fois et sa piste défile', async ({ page }) => {
    const bandeau = page.locator('[data-us-bandeau]');
    await expect(bandeau.locator('.sr-only')).toHaveText('Ne gardez que le meilleur des US');
    await expect(bandeau.locator('.us-bandeau__piste')).toHaveAttribute('aria-hidden', 'true');
    test.skip(await page.evaluate(() => matchMedia('(prefers-reduced-motion: reduce)').matches), 'immobile avec « réduire les animations »');
    const position = () => bandeau.locator('.us-bandeau__piste').evaluate((p) => new DOMMatrix(getComputedStyle(p).transform).m41);
    const avant = await position();
    await page.waitForTimeout(400);
    expect(await position()).toBeLessThan(avant);
  });

  test('le bouton « son » active le son d’une vidéo, une seule à la fois', async ({ page }) => {
    test.skip(await page.evaluate(() => matchMedia('(prefers-reduced-motion: reduce)').matches), 'commandes du lecteur à la place');
    const [spot, carre] = [page.locator('.us-spot'), page.locator('.us-carre')];
    await spot.scrollIntoViewIfNeeded();
    await spot.locator('[data-us-son]').click();
    await expect(spot.locator('[data-us-son]')).toHaveAttribute('aria-pressed', 'true');
    expect(await spot.locator('video').evaluate((v) => v.muted)).toBe(false);
    await carre.scrollIntoViewIfNeeded();
    await carre.locator('[data-us-son]').click();
    await expect(carre.locator('[data-us-son]')).toHaveAttribute('aria-pressed', 'true');
    expect(await spot.locator('video').evaluate((v) => v.muted)).toBe(true);
    await carre.locator('[data-us-son]').click();
    await expect(carre.locator('[data-us-son]')).toHaveAttribute('aria-pressed', 'false');
  });

  test('l’affiche bleue reste en place pendant que les quatre posts défilent', async ({ page }) => {
    await expect(page.locator('.us-defile__posts li')).toHaveCount(4);
    const zone = page.locator('[data-us-defile]');
    const fixe = page.locator('.us-defile__fixe');
    const debut = await zone.evaluate((z) => z.getBoundingClientRect().top + scrollY);
    const haut = await page.evaluate(() => parseFloat(getComputedStyle(document.querySelector('.us-defile__fixe')).top));
    // Au début de la zone puis 300 px plus bas : l’affiche est au même endroit à l’écran
    await page.evaluate((y) => scrollTo(0, y), debut - haut + 20);
    await page.waitForTimeout(200);
    const a = await fixe.evaluate((f) => f.getBoundingClientRect().top);
    const p = await page.locator('.us-defile__posts').evaluate((f) => f.getBoundingClientRect().top);
    await page.evaluate((y) => scrollTo(0, y), debut - haut + 320);
    await page.waitForTimeout(200);
    expect(Math.round(await fixe.evaluate((f) => f.getBoundingClientRect().top))).toBe(Math.round(a));
    expect(await page.locator('.us-defile__posts').evaluate((f) => f.getBoundingClientRect().top)).toBeCloseTo(p - 300, 0);
  });

  test('Closer et Marmiton s’enchaînent dans la même vue, comme un GIF', async ({ page }) => {
    const boucle = page.locator('.us-boucle');
    await expect(boucle.locator('.cl-boucle__img')).toHaveCount(2);
    test.skip(await page.evaluate(() => matchMedia('(prefers-reduced-motion: reduce)').matches), 'immobile avec « réduire les animations »');
    await boucle.scrollIntoViewIfNeeded();
    const actif = boucle.locator('.cl-boucle__img.is-actif img');
    await expect(actif).toHaveAttribute('src', /magazine/);
    await expect(actif).toHaveAttribute('src', /marmiton/, { timeout: 4000 });
    await expect(actif).toHaveAttribute('src', /magazine/, { timeout: 4000 });
    // Sous la boucle, la colonne a la couleur de l’image affichée : jamais de crème
    const fond = () => page.locator('#us-web .us-visuels').evaluate((c) => getComputedStyle(c).backgroundColor);
    await expect.poll(fond).toBe('rgb(169, 208, 179)');
    await expect(actif).toHaveAttribute('src', /marmiton/, { timeout: 4000 });
    await expect.poll(fond).toBe('rgb(2, 85, 86)');
  });

  test('le texte de la fiche descend avec la page jusqu’à la fiche suivante', async ({ page, isMobile }) => {
    test.skip(isMobile || (page.viewportSize()?.width ?? 0) < 900, 'sur mobile, la fiche est au-dessus de ses visuels');
    const chap = page.locator('#us-affichage');
    const texte = chap.locator('[data-us-colle]');
    const debut = await chap.evaluate((c) => c.getBoundingClientRect().top + scrollY);
    const position = async (y) => { await page.evaluate((y) => scrollTo(0, y), y); await page.waitForTimeout(150); return texte.evaluate((t) => t.getBoundingClientRect().top); };
    // Pendant le chapitre : le texte reste au même endroit à l’écran
    const a = await position(debut + 200);
    const b = await position(debut + 900);
    expect(Math.round(b)).toBe(Math.round(a));
    // À la fin du chapitre, il remonte avec lui et la fiche suivante arrive
    const fin = await chap.evaluate((c) => c.getBoundingClientRect().bottom + scrollY);
    const c = await position(fin - 100);
    expect(c).toBeLessThan(a);
  });

  test('les crédits nomment l’équipe et l’agence Buzzman', async ({ page }) => {
    const c = page.locator('.us-credits');
    await expect(c.locator('h3')).toHaveText(['Équipe', 'Collaboration']);
    await expect(c).toContainText('Zoé Vinardell Graphisme & direction artistique');
    await expect(c).toContainText('Agence Buzzman');
  });

  test('avec « réduire les animations », le bandeau est immobile et les vidéos ont leurs commandes', async ({ browser }) => {
    const ctx = await browser.newContext({ reducedMotion: 'reduce' });
    const page = await ctx.newPage();
    await page.goto(URL_PROJET);
    await expect(page.locator('.page-us')).toBeVisible();
    await expect(page.locator('.us-bandeau__piste')).toHaveCSS('animation-name', 'none');
    await expect(page.locator('[data-us-son]')).toHaveCount(0);
    expect(await page.locator('.us-visuels video').evaluateAll((v) => v.every((x) => x.controls))).toBe(true);
    // Les deux visuels de la boucle sont visibles, l’un sous l’autre
    const imgs = page.locator('.us-boucle img');
    await imgs.first().scrollIntoViewIfNeeded();
    const [h1, h2] = await imgs.evaluateAll((l) => l.map((i) => i.getBoundingClientRect()));
    expect(h2.top).toBeGreaterThanOrEqual(h1.bottom - 1);
    await expect(imgs.nth(1)).toHaveCSS('opacity', '1');
    await ctx.close();
  });

  test('la pub se lance à l’arrivée, même sur un écran peu haut', async ({ browser }) => {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 600 } });
    const page = await ctx.newPage();
    await page.goto(URL_PROJET);
    await expect(page.locator('.page-us')).toBeVisible();
    const v = page.locator('.us-spot video');
    await expect.poll(() => v.evaluate((x) => !x.paused), { timeout: 8000 }).toBe(true);
    await ctx.close();
  });

  test('depuis la couverture de l’accueil, la pub reprend où en était la couverture', async ({ page }) => {
    test.skip(await page.evaluate(() => matchMedia('(prefers-reduced-motion: reduce)').matches), 'pas d’effet d’ouverture avec « réduire les animations »');
    await page.goto('/');
    const lien = page.locator('[data-phares-liste] a[href*="meilleur-des-us"]');
    await lien.scrollIntoViewIfNeeded();
    const couv = lien.locator('video');
    await expect.poll(() => couv.evaluate((x) => x.currentTime), { timeout: 10000 }).toBeGreaterThan(2);
    await lien.click();
    await expect(page).toHaveURL(/p=ne-gardez-que-le-meilleur-des-us/);
    const v = page.locator('.us-spot video');
    await expect.poll(() => v.evaluate((x) => !x.paused && x.currentTime > 2), { timeout: 10000 }).toBe(true);
  });

  test('lecture automatique refusée (comme Safari en économie d’énergie) : commandes visibles, la pub part au premier geste', async ({ browser }) => {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
    // Le navigateur refuse toute lecture tant qu’il n’y a pas eu de geste sur la page
    await ctx.addInitScript(() => {
      let geste = false;
      addEventListener('pointerdown', () => { geste = true; }, { capture: true });
      addEventListener('keydown', () => { geste = true; }, { capture: true });
      const jouer = HTMLMediaElement.prototype.play;
      HTMLMediaElement.prototype.play = function () {
        return geste ? jouer.call(this) : Promise.reject(new DOMException('refusée', 'NotAllowedError'));
      };
    });
    const page = await ctx.newPage();
    await page.goto(URL_PROJET);
    test.skip(await page.evaluate(() => matchMedia('(prefers-reduced-motion: reduce)').matches), 'commandes déjà visibles');
    const v = page.locator('.us-spot video');
    await expect.poll(() => v.evaluate((x) => x.controls), { timeout: 8000 }).toBe(true);
    expect(await v.evaluate((x) => x.paused)).toBe(true);
    await page.mouse.click(5, 300);
    await expect.poll(() => v.evaluate((x) => !x.paused), { timeout: 8000 }).toBe(true);
    await ctx.close();
  });
});
