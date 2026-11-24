// Gabarit Columbus « C’est le moment » : encart qui suit la lecture et modules interactifs
import { test, expect, allerA } from './outils.js';

const URL_COLUMBUS = '/projet.html?p=columbus-cafe-brand-identity';

test.describe('Columbus', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(URL_COLUMBUS);
    await expect(page.locator('[data-cl]')).toBeVisible();
  });

  test('le chapitre lu est marqué dans le menu de l’encart', async ({ page }) => {
    const premier = await page.locator('.cl-encart__menu [data-chap]').nth(1).getAttribute('data-chap');
    await allerA(page, `#${premier}`);
    await page.evaluate((id) => scrollTo(0, document.getElementById(id).getBoundingClientRect().top + scrollY - 50), premier);
    await expect(page.locator(`.cl-encart__menu [data-chap="${premier}"]`)).toHaveAttribute('aria-current', 'true');
  });

  test('le curseur avant / après règle la barre et se lit au lecteur d’écran', async ({ page }) => {
    const curseur = await allerA(page, '[data-cl-comparer-curseur]');
    await curseur.fill('30');
    await expect(curseur).toHaveAttribute('aria-valuetext', '30 % ancien logo, 70 % nouveau');
    await expect(page.locator('[data-cl-comparer]')).toHaveAttribute('style', /--pos:\s*30%/);
  });

  test('l’interrupteur mode clair / mode sombre change de logo', async ({ page }) => {
    await allerA(page, '[data-cl-bascule]');
    const boutons = page.locator('[data-cl-mode]');
    await boutons.nth(1).click();
    await expect(boutons.nth(1)).toHaveAttribute('aria-pressed', 'true');
    await expect(boutons.nth(0)).toHaveAttribute('aria-pressed', 'false');
    await expect(page.locator('[data-cl-bascule]')).toHaveAttribute('data-version', '1');
  });

  test('la carte de fidélité se tamponne jusqu’au muffin offert puis repart de zéro', async ({ page }) => {
    await allerA(page, '[data-cl-carte]');
    const cases = page.locator('[data-cl-case]');
    const n = await cases.count();
    const vides = page.locator('[data-cl-case][aria-pressed="false"]');
    const reste = await vides.count(); // la carte arrive avec quelques tampons déjà posés
    const statut = page.locator('[data-cl-carte-statut]');
    await expect(statut).toHaveText(`Encore ${reste} tampons avant le muffin offert`);
    const premiere = vides.first();
    const id = await premiere.evaluate((c) => [...c.parentElement.children].indexOf(c));
    await premiere.click();
    await cases.nth(id).click(); // une case déjà tamponnée ne compte pas deux fois
    await expect(statut).toHaveText(`Encore ${reste - 1} tampon${reste - 1 > 1 ? 's' : ''} avant le muffin offert`);
    while (await vides.count()) await vides.first().click();
    await expect(statut).toHaveText('Carte complète : le muffin est offert');
    const reset = page.locator('[data-cl-carte-reset]');
    await expect(reset).toBeVisible();
    await expect(reset).toBeFocused();
    await reset.click();
    await expect(statut).toHaveText(`Encore ${n} tampons avant le muffin offert`);
    await expect(cases.nth(0)).toBeFocused();
  });

  test('les parfums tournent en boucle à l’écran', async ({ page }) => {
    const bloc = await allerA(page, '[data-cl-boucle]');
    const actif = () => bloc.locator('.cl-boucle__img.is-actif').first().innerHTML();
    const avant = await actif();
    await expect.poll(actif, { timeout: 5000 }).not.toBe(avant);
  });
});
