// « Réduire les animations » : rien ne bouge tout seul, tout reste lisible et utilisable
import { test, expect, allerA } from './outils.js';

test.use({ reducedMotion: 'reduce' });

test('accueil : pas de chargement animé, contenu visible', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.loader')).toHaveCount(0);
  await expect(page.locator('[data-phares-liste] a').first()).toBeVisible();
});

test('Studio Zoé : vidéo arrêtée avec ses commandes, carnet immobile mais utilisable', async ({ page }) => {
  await page.goto('/projet.html?p=studio-zoe');
  const video = await allerA(page, 'video[data-cl-depart]');
  await page.waitForTimeout(600);
  expect(await video.evaluate((v) => v.paused)).toBe(true);
  await expect(video).toHaveAttribute('controls', '');
  await allerA(page, '[data-sz-objet]');
  await page.waitForTimeout(3500);
  const objet = page.locator('[data-sz-objet]');
  await expect(objet).toHaveAttribute('aria-label', /page 1 sur 3/i);
  await page.locator('[data-sz-livre-suiv]').click();
  await expect(objet).toHaveAttribute('aria-label', /page 2 sur 3/i);
  await page.locator('[data-sz-livre-prec]').click();
  await page.locator('[data-sz-livre-prec]').click();
  await expect(objet).toHaveAttribute('aria-label', /page 3 sur 3/i);
});

test('Studio Zoé : les livrets ne défilent pas', async ({ page }) => {
  await page.goto('/projet.html?p=studio-zoe');
  const bloc = await allerA(page, '[data-sz-defile]');
  const avant = await bloc.locator('img.is-actif').getAttribute('src');
  await page.waitForTimeout(1200);
  await expect(bloc.locator('img.is-actif')).toHaveAttribute('src', avant);
});

test('projets suivants : la pile reste immobile, la flèche fonctionne', async ({ page }) => {
  await page.goto('/projet.html?p=glowy-winter');
  await allerA(page, '.projet-suivant');
  const actif = page.locator('.suivant__item.is-actif .suivant__titre');
  const depart = await actif.textContent();
  await page.waitForTimeout(3000);
  await expect(actif).toHaveText(depart);
  await page.locator('.suivant__fleche--suiv').click();
  await expect(actif).not.toHaveText(depart);
});

test('Columbus : la bande de photos se parcourt au clavier, les parfums ne tournent pas', async ({ page }) => {
  await page.goto('/projet.html?p=columbus-cafe-brand-identity');
  await expect(page.locator('[data-cl-photos]')).toHaveAttribute('tabindex', '0');
  const bloc = await allerA(page, '[data-cl-boucle]');
  const avant = await bloc.locator('.cl-boucle__img.is-actif').first().innerHTML();
  await page.waitForTimeout(2500);
  expect(await bloc.locator('.cl-boucle__img.is-actif').first().innerHTML()).toBe(avant);
});

test('page Projets : la liste suit le scroll sans animation propre', async ({ page }) => {
  await page.goto('/projets.html');
  await expect(page.locator('.index__ligne.is-actif')).toHaveCount(1);
  expect(await page.locator('.index__ligne').first().evaluate((x) => getComputedStyle(x).transitionDuration)).toBe('0s');
});
