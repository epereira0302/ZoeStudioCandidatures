// Gabarit Heinz × Krispy Kreme : encart, chapitres, bouteilles, dossiers des sauces, crédits
import { test, expect } from './outils.js';

test.describe('Heinz × Krispy Kreme', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/projet.html?p=heinz-krispy-kreme');
    await expect(page.locator('.page-hk')).toBeVisible();
  });

  test('l’encart montre le client, l’année, le titre et le type', async ({ page }) => {
    const encart = page.locator('[data-cl-encart]');
    await expect(page.locator('h1')).toHaveText('Non… et pourtant si.');
    await expect(encart).toContainText('Krispy Kreme x Heinz');
    await expect(encart).toContainText('2026');
    await expect(encart).toContainText('Co-branding');
  });

  test('les cinq chapitres existent et chaque image a un texte de remplacement', async ({ page }) => {
    for (const id of ['hk-revelation', 'hk-teasing', 'hk-sauces', 'hk-donuts', 'hk-making-of']) await expect(page.locator(`#${id}`)).toHaveCount(1);
    await expect(page.locator('.hk-bouteille')).toHaveCount(3);
    await expect(page.locator('.hk-sauce')).toHaveCount(3);
    await expect(page.locator('.hk-slides__nom')).toHaveText(['Slide 1 : Teasing', 'Slide 2 : Reveal', 'Slide 3 : Présentation']);
    await expect(page.locator('#hk-sauces .hk-cense video source')).toHaveAttribute('src', /video-cense\.mp4$/);
    const sansAlt = await page.locator('.hk-visuels img:not([aria-hidden="true"])').evaluateAll((imgs) => imgs.filter((i) => !i.alt.trim()).length);
    expect(sansAlt).toBe(0);
  });

  test('le making-of clôt le projet : vidéo muette, avec un libellé, qui tourne une fois à l’écran', async ({ page }) => {
    const chap = page.locator('#hk-making-of');
    expect(await page.locator('.hk-visuels > .cl-chap').last().getAttribute('id')).toBe('hk-making-of');
    const v = chap.locator('video');
    await expect(v.locator('source')).toHaveAttribute('src', /video-making-of\.mp4$/);
    await expect(v).toHaveAttribute('aria-label', /Making-of/);
    test.skip(await page.evaluate(() => matchMedia('(prefers-reduced-motion: reduce)').matches), 'commandes du lecteur à la place');
    await v.scrollIntoViewIfNeeded();
    await expect.poll(() => v.evaluate((x) => !x.paused && x.muted), { timeout: 8000 }).toBe(true);
  });

  test('les crédits listent les deux équipes', async ({ page }) => {
    const c = page.locator('.cl-credits--encart');
    await expect(c.locator('h3')).toHaveText(['Équipe Krispy Kreme', 'Équipe Heinz']);
    await expect(c.locator('.hk-credits li')).toHaveCount(8);
    await expect(c).toContainText('Zoé Vinardell : Direction artistique');
  });

  test('le dossier Barbecue est ouvert par défaut, un autre onglet change de donut, le même referme', async ({ page }) => {
    const bloc = page.locator('[data-hk-dossiers]');
    await expect(bloc).toHaveAttribute('data-ouvert', 'barbecue');
    await expect(page.locator('[data-sauce="barbecue"]')).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('[data-donut="barbecue"]')).toBeVisible();
    await page.locator('[data-sauce="firecracker"]').click();
    await expect(bloc).toHaveAttribute('data-ouvert', 'firecracker');
    await expect(page.locator('[data-donut="firecracker"]')).toBeVisible();
    await expect(page.locator('[data-donut="barbecue"]')).toBeHidden({ timeout: 3000 });
    await page.locator('[data-sauce="firecracker"]').click();
    await expect(bloc).toHaveAttribute('data-ouvert', '');
    await expect(page.locator('[data-sauce="firecracker"]')).toHaveAttribute('aria-pressed', 'false');
  });

  test('aucune image ne se casse', async ({ page }) => {
    await page.evaluate(() => document.querySelectorAll('.hk-visuels img').forEach((i) => { i.loading = 'eager'; i.hidden = false; }));
    await expect.poll(() => page.locator('.hk-visuels img:not([aria-hidden="true"])').evaluateAll((imgs) => imgs.every((i) => i.complete && i.naturalWidth > 0)), { timeout: 15000 }).toBe(true);
  });
});
