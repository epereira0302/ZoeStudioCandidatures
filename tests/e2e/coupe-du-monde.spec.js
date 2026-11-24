// Coupe du monde 2026 : planches de cinq photos numérotées (validées le
// 24/11/2026), images en grand entre les planches, encart aubergine.
import { test, expect } from './outils.js';

test.describe('Coupe du monde 2026', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/projet.html?p=coupe-du-monde-2026');
    await expect(page.locator('.page-cdm')).toBeVisible();
  });

  test('encart aubergine : titre, texte et crédit', async ({ page }) => {
    const encart = page.locator('[data-cl-encart]');
    await expect(page.locator('h1')).toHaveText('Coupe du monde 2026');
    await expect(encart).toContainText('Sony RX100 VII');
    await expect(encart.locator('.kk-credits__nom').first()).toHaveText('Zoé Vinardell');
    await expect(encart.locator('.kk-credits__role').first()).toHaveText('Photographe');
  });

  test('les 28 photos et la boucle, numérotées de 01 à 29, le projet ne commence pas par une vidéo', async ({ page }) => {
    const photos = await page.locator('.cdm-visuels img').evaluateAll((imgs) => new Set(imgs.map((i) => i.getAttribute('src'))).size);
    expect(photos).toBe(28);
    await expect(page.locator('.cdm-grand--boucle video[loop][muted]')).toHaveCount(1);
    const numeros = await page.locator('.cdm-visuels .cdm-num').allTextContents();
    expect(numeros).toEqual(Array.from({ length: 29 }, (_, k) => String(k + 1).padStart(2, '0')));
    expect(await page.locator('.cdm-visuels').evaluate((v) => v.querySelector('img, video').tagName)).toBe('IMG');
  });

  test('cinq planches et des images en grand entre elles', async ({ page }) => {
    await expect(page.locator('.cdm-libre')).toHaveCount(5);
    await expect(page.locator('.cdm-grand')).toHaveCount(4);
    const ordre = await page.locator('.cdm-section').evaluateAll((s) => s.map((x) => (x.querySelector('.cdm-grand') ? 'G' : 'P')).join(''));
    expect(ordre).toBe('PGPGPGPGP');
  });

  test('aucun texte ne se pose sur une photo', async ({ page, isMobile }) => {
    test.skip(isMobile, 'lecture continue sur mobile');
    const ko = await page.locator('.cdm-libre').evaluateAll((blocs) => blocs.flatMap((b, i) => {
      b.querySelectorAll('[data-apparait]').forEach((el) => (el.style.transform = 'none'));
      const coupe = (a, c) => a.left < c.right - 1 && c.left < a.right - 1 && a.top < c.bottom - 1 && c.top < a.bottom - 1;
      const textes = [...b.querySelectorAll('.cdm-entete, .cdm-chapitre, .cdm-num')];
      const photos = [...b.querySelectorAll('img')];
      return textes.flatMap((t) => photos.filter((p) => coupe(t.getBoundingClientRect(), p.getBoundingClientRect())).map(() => `planche ${i} : « ${t.textContent.trim().slice(0, 20)} »`));
    }));
    expect(ko).toEqual([]);
  });

  test('chaque photo a un texte de remplacement et se charge', async ({ page }) => {
    const ko = await page.locator('.cdm-visuels img').evaluateAll(async (imgs) => {
      await Promise.all(imgs.map((i) => { i.loading = 'eager'; return i.decode().catch(() => {}); }));
      return imgs.filter((i) => !i.alt.trim() || !i.naturalWidth).map((i) => i.src);
    });
    expect(ko).toEqual([]);
  });
});
