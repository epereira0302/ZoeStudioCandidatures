// Gabarit Studio Zoé : vidéo du logo, carnet, typographies, motif, applications
import { test, expect, allerA } from './outils.js';

test.describe('Studio Zoé', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/projet.html?p=studio-zoe');
    await expect(page.locator('.page-sz')).toBeVisible();
  });

  test('l’encart montre le nom du studio et le type du projet', async ({ page }) => {
    await expect(page.locator('h1')).toHaveText('Studio Zoé');
    await expect(page.locator('[data-cl-encart]')).toContainText('Identité visuelle et création de logo');
  });

  test('la vidéo du logo attend d’être à moitié visible, part du début et tourne en boucle', async ({ page }) => {
    const video = page.locator('video[data-cl-depart]');
    await expect(video).toHaveAttribute('loop', '');
    // Presque hors de l’écran : pas encore lancée
    await video.evaluate((v) => scrollTo(0, v.getBoundingClientRect().top + scrollY - innerHeight + 40));
    await page.waitForTimeout(500);
    expect(await video.evaluate((v) => v.paused)).toBe(true);
    // À l’écran : lancée depuis le début
    await video.evaluate((v) => v.scrollIntoView({ block: 'center' }));
    await expect.poll(() => video.evaluate((v) => !v.paused && v.currentTime > 0), { timeout: 5000 }).toBe(true);
    expect(await video.evaluate((v) => v.currentTime)).toBeLessThan(3);
    // Hors de l’écran : en pause ; au retour, elle repart du début
    await page.evaluate(() => scrollTo(0, 0));
    await expect.poll(() => video.evaluate((v) => v.paused)).toBe(true);
    await video.evaluate((v) => v.scrollIntoView({ block: 'center' }));
    await expect.poll(() => video.evaluate((v) => !v.paused)).toBe(true);
    expect(await video.evaluate((v) => v.currentTime)).toBeLessThan(1.5);
  });

  test('le carnet tourne ses pages sans jamais changer d’image en route', async ({ page }) => {
    await allerA(page, '[data-sz-objet]');
    // Les images du carnet sont posées une fois pour toutes
    const sources = () => page.locator('[data-sz-livre] img').evaluateAll((l) => l.map((i) => i.getAttribute('src')).join('|'));
    const avant = await sources();
    const objet = page.locator('[data-sz-objet]');
    await expect(objet).toHaveAttribute('aria-label', /page 1 sur 3/i);
    await page.locator('[data-sz-livre-suiv]').click();
    await expect(objet).toHaveAttribute('aria-label', /page 2 sur 3/i);
    await expect(page.locator('[data-sz-livre-annonce]')).toHaveText(/Page 2 sur 3/);
    await expect(page.locator('[data-sz-haut].is-vu')).toHaveCount(1);
    await expect(page.locator('[data-sz-bas].is-vu')).toHaveCount(1);
    await page.waitForTimeout(300);
    await page.locator('[data-sz-livre-prec]').click();
    await expect(objet).toHaveAttribute('aria-label', /page 1 sur 3/i);
    expect(await sources()).toBe(avant);
  });

  test('le carnet tourne aussi tout seul', async ({ page }) => {
    await allerA(page, '[data-sz-objet]');
    await expect(page.locator('[data-sz-objet]')).toHaveAttribute('aria-label', /page 2 sur 3/i, { timeout: 6000 });
  });

  test('le motif bascule de couleurs au clic et le dit', async ({ page }) => {
    const motif = await allerA(page, '[data-sz-motif]');
    await motif.click();
    await expect(motif).toHaveAttribute('aria-pressed', 'true');
    await expect(motif).toHaveAttribute('aria-label', /brun et bleu/);
    await motif.click();
    await expect(motif).toHaveAttribute('aria-pressed', 'false');
  });

  test('la taille du logo passe de 2 à 4 puis 6 cm', async ({ page }) => {
    await allerA(page, '[data-sz-tailles]');
    const val = page.locator('[data-sz-taille-val]');
    await expect(val).toHaveText('2 cm');
    await expect(page.locator('[data-sz-taille-nom]')).toHaveText('Taille minimale');
    await expect(val).toHaveText('4 cm', { timeout: 4000 });
  });

  test('le testeur de Gyst suit le texte et les réglages', async ({ page }) => {
    await allerA(page, '[data-sz-testeur]');
    const champ = page.locator('[data-sz-texte]');
    await champ.fill('Zoe');
    await expect(page.locator('[data-sz-rendu]')).toHaveAttribute('aria-label', 'Zoe');
    await expect(page.locator('[data-sz-rendu] svg')).toHaveCount(3);
    await champ.fill('');
    await expect(page.locator('[data-sz-rendu] svg').first()).toBeAttached();
    const taille = page.locator('[data-sz-reglage="taille"]');
    await taille.fill('120');
    await expect(page.locator('[data-sz-sortie="taille"]')).toHaveText('120 px');
  });

  test('les colonnes des graisses s’ouvrent au clic', async ({ page }) => {
    await allerA(page, '[data-sz-colonnes]');
    const col = page.locator('[data-sz-colonnes] > *').nth(2);
    await col.click();
    await expect(col).toHaveClass(/is-ouverte/);
    await expect(col).toHaveAttribute('aria-pressed', 'true');
  });

  test('une lettre choisie d’Abril passe dans le grand cadre avec son code', async ({ page }) => {
    await allerA(page, '[data-sz-abril]');
    const btn = page.locator('[data-sz-abril] [data-c]').nth(3);
    await btn.click();
    await expect(btn).toHaveAttribute('aria-pressed', 'true');
    const c = await btn.getAttribute('data-c');
    await expect(page.locator('[data-sz-ga-code]')).toHaveText(`U+${c.codePointAt(0).toString(16).toUpperCase().padStart(4, '0')}`);
  });

  test('une lettre de Gyst survolée ou choisie s’affiche dans le rond', async ({ page }) => {
    const zone = await allerA(page, '[data-sz-survol]');
    const rondId = await zone.getAttribute('data-sz-survol');
    const lettre = zone.locator('svg[data-l]').nth(4);
    const l = await lettre.getAttribute('data-l');
    await lettre.dispatchEvent('click');
    await expect(page.locator(`#${rondId}`)).toHaveAttribute('aria-label', `La lettre ${l} en Gyst`);
  });

  test('les trois livrets s’enchaînent en coupe franche', async ({ page }) => {
    const bloc = await allerA(page, '[data-sz-defile]');
    const actif = () => bloc.locator('img.is-actif').getAttribute('src');
    const avant = await actif();
    await expect.poll(actif, { timeout: 5000 }).not.toBe(avant);
  });
});
