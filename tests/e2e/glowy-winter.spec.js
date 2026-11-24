// Gabarit Glowy Winter : encart, chapitres, affiches, shooting, crédits
import { test, expect } from './outils.js';

test.describe('Glowy Winter', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/projet.html?p=glowy-winter');
    await expect(page.locator('.page-gw')).toBeVisible();
  });

  test('l’encart montre le client, l’année, le titre et le type', async ({ page }) => {
    const encart = page.locator('[data-cl-encart]');
    await expect(page.locator('h1')).toHaveText('Glowy Winter');
    await expect(encart).toContainText('Columbus Café');
    await expect(encart).toContainText('2025');
    await expect(encart).toContainText('Direction artistique');
  });

  test('les quatre chapitres existent et chaque image a un texte de remplacement', async ({ page }) => {
    for (const id of ['gw-campagne', 'gw-recettes', 'gw-boutique', 'gw-shooting']) await expect(page.locator(`#${id}`)).toHaveCount(1);
    await expect(page.locator('.gw-affiches__item')).toHaveCount(3);
    await expect(page.locator('.gw-grille li')).toHaveCount(10);
    const sansAlt = await page.locator('.gw-visuels img:not(.gw-facade__avant):not(.gw-neige img)').evaluateAll((imgs) => imgs.filter((i) => !i.alt.trim()).length);
    expect(sansAlt).toBe(0);
  });

  test('les crédits listent les sept intervenants', async ({ page }) => {
    await expect(page.locator('.cl-credits--encart .gw-credits li')).toHaveCount(7);
    await expect(page.locator('.cl-credits--encart')).toContainText('Sébastien Dray : Photographie');
  });

  test('la façade a ses treize étoiles derrière le calque de la façade', async ({ page }) => {
    await expect(page.locator('.gw-facade .gw-etoile')).toHaveCount(13);
    await expect(page.locator('.gw-facade__avant')).toHaveCount(1);
  });

  test('l’interrupteur passe le sapin de jour à nuit puis revient', async ({ page }) => {
    const bloc = page.locator('[data-gw-sapin]');
    const [jour, nuit] = [page.locator('[data-gw-mode="0"]'), page.locator('[data-gw-mode="1"]')];
    await expect(jour).toHaveAttribute('aria-pressed', 'true');
    await nuit.click();
    await expect(bloc).toHaveAttribute('data-version', '1');
    await expect(nuit).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('.gw-sapin__video.is-actif video source')).toHaveAttribute('src', /sapin-nuit\.mp4$/);
    await jour.click();
    await expect(bloc).toHaveAttribute('data-version', '0');
  });

  test('chaque vidéo des recettes a sa photo à côté', async ({ page }) => {
    const rangs = page.locator('#gw-recettes .gw-posts');
    await expect(rangs).toHaveCount(2);
    for (let i = 0; i < 2; i++) {
      await expect(rangs.nth(i).locator('video')).toHaveCount(1);
      await expect(rangs.nth(i).locator('img')).toHaveCount(1);
    }
  });

  test('l’ouverture écrit le titre lettre par lettre puis le couvre de neige', async ({ page }) => {
    const scene = page.locator('[data-gw-neige]');
    await expect(scene).toHaveAttribute('role', 'img');
    await expect(scene.locator('.gw-neige__eau g g')).toHaveCount(11);
    // Le masque du titre se remplit de perles (plus de 500 disques tracés) avant la neige
    await expect.poll(() => scene.locator('[data-perles="neige-posees"] path').evaluateAll((l) => l.reduce((n, p) => n + (p.getAttribute('d') ?? '').split('M').length - 1, 0)), { timeout: 15000 }).toBeGreaterThan(500);
    await expect(scene).toHaveAttribute('data-etat', 'fin', { timeout: 20000 });
    await expect(scene.locator('.gw-neige__titre')).toHaveCSS('transform', /matrix\(1\.12/);
  });

  test('avec « réduire les animations », le titre enneigé s’affiche tout de suite', async ({ browser }) => {
    const ctx = await browser.newContext({ reducedMotion: 'reduce' });
    const page = await ctx.newPage();
    await page.goto('/projet.html?p=glowy-winter');
    await expect(page.locator('[data-gw-neige]')).toHaveAttribute('data-etat', 'fin');
    await expect(page.locator('.gw-neige__flocons')).toBeHidden();
    await ctx.close();
  });

  test('aucune image ne se casse', async ({ page }) => {
    await page.evaluate(() => document.querySelectorAll('.gw-visuels img').forEach((i) => { i.loading = 'eager'; }));
    await expect.poll(() => page.locator('.gw-visuels img').evaluateAll((imgs) => imgs.every((i) => i.complete && i.naturalWidth > 0)), { timeout: 15000 }).toBe(true);
  });
});
