// Navigation commune : lien d’évitement, menu mobile, pages simples, 404
import { test, expect } from './outils.js';

test('le lien d’évitement mène au contenu', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Tab');
  const lien = page.locator('.skip-link');
  await expect(lien).toBeFocused();
  await expect(lien).toHaveAttribute('href', '#contenu');
});

test.describe('Menu mobile', () => {
  test.beforeEach(({ isMobile }) => test.skip(!isMobile, 'menu plein écran sur mobile'));

  test('s’ouvre, garde le focus dedans et se ferme avec Échap', async ({ page }) => {
    await page.goto('/projets.html');
    const btn = page.locator('.menu-btn');
    await btn.click();
    await expect(btn).toHaveAttribute('aria-expanded', 'true');
    await expect(page.locator('html')).toHaveClass(/menu-open/);
    await expect(page.locator('main')).toHaveAttribute('inert', '');
    await expect(page.locator('#menu a').first()).toBeFocused();
    // Maj+Tab depuis le premier lien revient sur le bouton (piège à focus)
    await page.keyboard.press('Shift+Tab');
    await expect(btn).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(page.locator('#menu a').first()).toBeFocused();
    await page.keyboard.press('Escape');
    await expect(btn).toHaveAttribute('aria-expanded', 'false');
    await expect(page.locator('main')).not.toHaveAttribute('inert', '');
    await expect(btn).toBeFocused();
  });

  test('se referme au second clic', async ({ page }) => {
    await page.goto('/');
    const btn = page.locator('.menu-btn');
    await btn.click();
    await expect(btn.locator('.menu-btn__label')).toHaveText('Fermer');
    await btn.click();
    await expect(btn.locator('.menu-btn__label')).toHaveText('Menu');
  });
});

test('mentions légales : données de site.json, champs vides signalés', async ({ page, request }) => {
  const site = await (await request.get('/contenu/site.json')).json();
  await page.goto('/mentions-legales.html');
  await expect(page.locator('h1')).toBeVisible();
  await expect(page.locator('main')).toContainText(site.mentionsLegales.siret);
  await expect(page.locator('main')).toContainText('Vercel');
});

test('une adresse inconnue affiche la page 404', async ({ page, erreurs }) => {
  const r = await page.goto('/cette-page-n-existe-pas');
  expect(r.status()).toBe(404);
  // Le navigateur signale la réponse 404 elle-même : c’est attendu ici
  erreurs.splice(0, erreurs.length, ...erreurs.filter((e) => !e.includes('404')));
  await expect(page.locator('a[href="./"], a[href="/"], a[href="index.html"]').first()).toBeVisible();
});

test('aucune page ne déborde à l’horizontale', async ({ page }) => {
  for (const url of ['/', '/projets.html', '/projet.html?p=studio-zoe', '/projet.html?p=columbus-cafe-brand-identity', '/projet.html?p=sirop-monin', '/mentions-legales.html']) {
    await page.goto(url);
    await page.waitForTimeout(300);
    const deborde = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
    expect(deborde, `${url} déborde de ${deborde} px`).toBeLessThanOrEqual(1);
  }
});

test('un lien interne passe par le rideau puis ouvre la page', async ({ page, isMobile }) => {
  test.skip(isMobile, 'liens de l’en-tête visibles sur bureau');
  await page.goto('/mentions-legales.html');
  await page.locator('.nav a[href="projets.html"]').click();
  await expect(page.locator('.curtain')).toBeVisible();
  await expect(page).toHaveURL(/projets\.html$/);
  // À l’arrivée, le rideau remonte et disparaît
  await expect(page.locator('.curtain')).toBeHidden({ timeout: 3000 });
});
