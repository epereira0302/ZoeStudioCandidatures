// Accueil : ouverture, sommaire des catégories, projets phares, pied de page
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

  test('le sommaire liste chaque catégorie avec son nombre de projets', async ({ page, request }) => {
    const r = await request.get('/contenu/projets.json');
    const { categories, projets: liste } = await r.json();
    const lignes = page.locator('[data-sommaire-row]');
    await expect(lignes).toHaveCount(categories.length);
    for (const [i, c] of categories.entries()) {
      const nb = liste.filter((p) => (p.categories ?? [p.categorie]).includes(c.id)).length;
      await expect(lignes.nth(i)).toHaveText(c.nom);
      await expect(lignes.nth(i)).toHaveAttribute('href', `projets.html?categorie=${encodeURIComponent(c.id)}`);
      await expect(lignes.nth(i)).toHaveAttribute('aria-label', new RegExp(`${nb} projets?`));
    }
  });

  test('le survol d’une ligne du sommaire l’active et écarte les voisines', async ({ page, isMobile }) => {
    test.skip(isMobile, 'survol à la souris seulement');
    await allerA(page, '[data-sommaire-row]');
    const lignes = page.locator('[data-sommaire-row]');
    await lignes.nth(2).hover();
    await expect(lignes.nth(2)).toHaveClass(/is-active/);
    await expect(page.locator('.sommaire__list li').nth(0)).toHaveClass(/is-avant/);
    await expect(page.locator('.sommaire__list li').nth(3)).toHaveClass(/is-apres/);
    await page.mouse.move(5, 5);
    await page.locator('#a-propos').scrollIntoViewIfNeeded();
    await expect(page.locator('[data-sommaire-row].is-active')).toHaveCount(0);
  });

  test('le focus clavier active aussi la ligne du sommaire', async ({ page }) => {
    const ligne = page.locator('[data-sommaire-row]').first();
    await ligne.focus();
    await expect(ligne).toHaveClass(/is-active/);
  });

  test('les quatre projets choisis pour l’accueil mènent à leur page, dans l’ordre', async ({ page, request }) => {
    const phares = (await projets(request)).filter((p) => p.accueil).sort((a, b) => a.accueil - b.accueil);
    expect(phares.map((p) => p.slug)).toEqual(['studio-zoe', 'columbus-cafe-brand-identity', 'heinz-krispy-kreme', 'ne-gardez-que-le-meilleur-des-us']);
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
