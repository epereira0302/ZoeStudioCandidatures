// Accueil (site des candidatures) : ouverture, projets phares, à propos, pied de page
import { test, expect, allerA, projets } from './outils.js';

test.describe('Accueil', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('affiche l’ouverture et le titre de la page', async ({ page }) => {
    await expect(page).toHaveTitle(/Zoé Vinardell/);
    await expect(page.locator('#ouverture-titre')).toBeVisible();
    await expect(page.locator('h1')).toHaveCount(1);
  });

  test('pas de sommaire : les projets phares suivent l’ouverture', async ({ page }) => {
    await expect(page.locator('#sommaire, [data-sommaire-row]')).toHaveCount(0);
    await expect(page.locator('header')).toHaveAttribute('data-fixe-apres', '#phares');
  });

  test('l’à propos parle de son parcours, en minuscules, sans texte en dur périmé', async ({ page, request }) => {
    const site = await (await request.get('/contenu/site.json')).json();
    const p = page.locator('.apropos__corps p');
    await expect(p).toHaveCount(site.accueil.apropos.paragraphes.length);
    await expect(p.first()).toContainText('Wagram');
    expect(await p.first().evaluate((x) => getComputedStyle(x).textTransform)).toBe('none');
  });

  test('les logos « Ils m’ont fait confiance » sont demandés dès l’en-tête', async ({ page }) => {
    await expect(page.locator('link[rel="preload"][href*="logos/"][crossorigin]')).toHaveCount(7);
  });

  test('les trois projets choisis pour l’accueil (sans Studio Zoé) mènent à leur page, dans l’ordre', async ({ page, request }) => {
    const phares = (await projets(request)).filter((p) => p.accueil).sort((a, b) => a.accueil - b.accueil);
    expect(phares.map((p) => p.slug)).toEqual(['columbus-cafe-brand-identity', 'heinz-krispy-kreme', 'ne-gardez-que-le-meilleur-des-us']);
    const liens = page.locator('[data-phares-liste] a');
    await expect(liens).toHaveCount(phares.length);
    for (const [i, p] of phares.entries()) {
      await expect(liens.nth(i)).toHaveAttribute('href', `projet.html?p=${encodeURIComponent(p.slug)}`);
      await expect(liens.nth(i).locator('.bande__nom')).toHaveText(p.titre);
    }
  });

  test('un clic sur un projet phare ouvre sa page', async ({ page, request }) => {
    const p = (await projets(request)).find((x) => x.phare);
    await allerA(page, '[data-phares-liste] a');
    await page.locator('[data-phares-liste] a').first().click();
    await expect(page).toHaveURL(new RegExp(`projet\\.html\\?p=${p.slug}`));
    await expect(page.locator('main')).toBeVisible();
  });

  test('les coordonnées du pied de page viennent de site.json', async ({ page, request }) => {
    const site = await (await request.get('/contenu/site.json')).json();
    const mail = page.locator('footer a[href^="mailto:"]').first();
    await expect(mail).toHaveAttribute('href', `mailto:${site.contact.email}`);
    const tel = page.locator('footer a[href^="tel:"]').first();
    await expect(tel).toHaveAttribute('href', `tel:${site.contact.telephone.replace(/[^+\d]/g, '')}`);
    await expect(page.locator('footer [data-linkedin] a')).toHaveAttribute('href', site.contact.linkedin);
    await expect(page.locator('[data-year]')).toHaveText(String(new Date().getFullYear()));
  });

  test('le bandeau « Ils m’ont fait confiance » défile en boucle', async ({ page }) => {
    await allerA(page, '#confiance');
    await expect(page.locator('#confiance .confiance__logo').first()).toBeVisible();
  });

  test('la couverture de « Ne gardez que le meilleur des US » est le début de la pub, qui tourne', async ({ page }) => {
    const v = page.locator('[data-phares-liste] a[href*="meilleur-des-us"] video');
    await expect(v).toHaveAttribute('src', /meilleur-des-us\/couverture\.mp4$/);
    await expect(v).toHaveAttribute('poster', /couverture\.webp$/);
    expect(await v.evaluate((x) => x.muted && x.loop)).toBe(true);
    test.skip(await page.evaluate(() => matchMedia('(prefers-reduced-motion: reduce)').matches), 'image immobile avec « réduire les animations »');
    await v.scrollIntoViewIfNeeded();
    await expect.poll(() => v.evaluate((x) => !x.paused), { timeout: 8000 }).toBe(true);
  });
});
