// Production image & direction artistique (Columbus Café) : version C de la
// maquette vidéo, validée le 24/11/2026. Par édition : planche, duo, plein
// cadre, seconde planche (vidéos mêlées aux photos), fond interpolé au scroll.
import { test, expect } from './outils.js';

test.describe('Production image & direction artistique', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/projet.html?p=columbus-cafe-images');
    await expect(page.locator('.page-ci')).toBeVisible();
  });

  test('titre, texte d’Enzo et crédits (nom en gras, travail en italique)', async ({ page }) => {
    const encart = page.locator('[data-cl-encart]');
    await expect(page.locator('h1')).toHaveText('Production Images : Éditions Limitées');
    await expect(encart).toContainText('Imaginer et orchestrer la production image');
    await expect(encart).toContainText('La couleur devient le fil rouge de l’année.');
    const nom = encart.locator('.kk-credits__nom').first();
    await expect(nom).toHaveText('Zoé Vinardell');
    expect(Number(await nom.evaluate((n) => getComputedStyle(n).fontWeight))).toBeGreaterThanOrEqual(700);
    const role = encart.locator('.kk-credits__role').nth(1);
    await expect(role).toHaveText('Photographe');
    expect(await role.evaluate((n) => getComputedStyle(n).fontStyle)).toBe('italic');
  });

  test('chaque édition : planche, duo, plein cadre, seconde planche', async ({ page }) => {
    const ordre = await page.locator('.ci-edition').evaluateAll((eds) => eds.map((e) => [...e.children].map((b) => b.dataset.bloc).join(',')));
    expect(ordre).toEqual(new Array(4).fill('planche,duo,plein,planche'));
    const titres = await page.locator('.ci-planche__titre h2').allTextContents();
    expect(titres).toEqual(['Du bleu contre le blues', 'Matcha ou Pistache', 'Passion d’été', 'Pop party']);
  });

  test('les 60 photos et les 6 vidéos, les vidéos posées dans les planches comme les photos, à bords droits', async ({ page }) => {
    const photos = await page.locator('.ci-visuels img').evaluateAll((imgs) => new Set(imgs.map((i) => i.getAttribute('src').match(/\/((?:bleu|vert|jaune|marron)-[\w-]+?)(?:-paysage)?-s\.webp$/)?.[1]).filter(Boolean)).size);
    expect(photos).toBe(60);
    await expect(page.locator('.ci-planche .ci-photo--video video')).toHaveCount(6);
    await expect(page.locator('.ci-visuels video:not(.ci-planche video)')).toHaveCount(0);
    const rayons = await page.locator('.ci-photo--video, .ci-photo--video video').evaluateAll((els) => els.map((e) => getComputedStyle(e).borderRadius));
    for (const r of rayons) expect(r).toBe('0px');
  });

  test('aucune édition ne commence par une vidéo', async ({ page }) => {
    const premiers = await page.locator('.ci-edition').evaluateAll((eds) => eds.map((e) => !!e.querySelector('[data-bloc]').querySelector('video')));
    expect(premiers).toEqual([false, false, false, false]);
  });

  test('chaque photo n’apparaît qu’une fois (hors plein cadre)', async ({ page }) => {
    const repetees = await page.locator('.ci-visuels').evaluate((v) => {
      const f = [...v.querySelectorAll('.ci-edition img')].filter((i) => !i.closest('.ci-plein')).map((i) => i.getAttribute('src'));
      return f.filter((x, k) => f.indexOf(x) !== k);
    });
    expect(repetees).toEqual([]);
  });

  test('le texte ne se superpose jamais : ni titre sur sous-titre, ni texte sur photo', async ({ page }) => {
    const chevauchements = await page.locator('.ci-planche').evaluateAll((planches) => {
      const ko = [];
      const coupe = (a, b) => a.left < b.right - 1 && b.left < a.right - 1 && a.top < b.bottom - 1 && b.top < a.bottom - 1;
      planches.forEach((pl, i) => {
        pl.querySelectorAll('[data-photo], [data-titre]').forEach((el) => (el.style.transform = 'none'));
        const titre = pl.querySelector('[data-titre]');
        const textes = [...pl.querySelectorAll('[data-titre] h2, [data-titre] p, .ci-planche__ed, figcaption')];
        const photos = [...pl.querySelectorAll('.ci-photo__cadre')];
        if (titre) {
          const [h2, p] = titre.children;
          if (h2.getBoundingClientRect().bottom > p.getBoundingClientRect().top) ko.push(`planche ${i} : titre sur sous-titre`);
        }
        textes.forEach((t) => photos.forEach((ph) => { if (coupe(t.getBoundingClientRect(), ph.getBoundingClientRect())) ko.push(`planche ${i} : « ${t.textContent.trim().slice(0, 20)} » sur une photo`); }));
        textes.forEach((t, a) => textes.forEach((u, b) => { if (a < b && coupe(t.getBoundingClientRect(), u.getBoundingClientRect())) ko.push(`planche ${i} : « ${t.textContent.trim().slice(0, 12)} » sur « ${u.textContent.trim().slice(0, 12)} »`); }));
      });
      return ko;
    });
    expect(chevauchements).toEqual([]);
  });

  test('tout texte posé sur les visuels est en Cooper Black ou en Uniform', async ({ page }) => {
    const hors = await page.locator('.ci-edition').evaluateAll((eds) => eds.flatMap((ed) => {
      const w = document.createTreeWalker(ed, NodeFilter.SHOW_TEXT);
      const ko = [];
      while (w.nextNode()) {
        const el = w.currentNode.parentElement;
        if (!w.currentNode.textContent.trim()) continue;
        const f = getComputedStyle(el).fontFamily;
        if (!/cooper-black-std|uniform/i.test(f.split(',')[0])) ko.push(`${ed.id} : ${w.currentNode.textContent.trim()} (${f})`);
      }
      return ko;
    }));
    expect(hors).toEqual([]);
  });

  test('le fond passe d’une couleur à l’autre en continu', async ({ page }) => {
    const fond = () => page.locator('[data-cl-visuels]').evaluate((v) => getComputedStyle(v).backgroundColor);
    const aller = (fraction) => page.locator('#ci-jaune').evaluate((s, f) => scrollTo({ top: s.getBoundingClientRect().top + scrollY - innerHeight / 2 + innerHeight * f, behavior: 'instant' }), fraction);
    await aller(-2);
    await expect.poll(fond, { timeout: 4000 }).toBe('rgb(226, 234, 198)');
    await aller(-0.3);
    await expect.poll(async () => { const c = await fond(); return c !== 'rgb(226, 234, 198)' && c !== 'rgb(253, 230, 163)'; }, { timeout: 4000 }).toBe(true);
    await aller(1.5);
    await expect.poll(fond, { timeout: 4000 }).toBe('rgb(253, 230, 163)');
  });

  test('chaque photo a un texte de remplacement et se charge', async ({ page }) => {
    const ko = await page.locator('.ci-visuels img').evaluateAll(async (imgs) => {
      await Promise.all(imgs.map((i) => { i.loading = 'eager'; return i.decode().catch(() => {}); }));
      return imgs.filter((i) => !i.alt.trim() || !i.naturalWidth).map((i) => i.src);
    });
    expect(ko).toEqual([]);
  });

  test('les chapitres de l’encart mènent aux éditions', async ({ page, isMobile }) => {
    test.skip(isMobile, 'encart en haut de page sur mobile');
    await page.locator('.ci-edition').last().evaluate((s) => scrollTo({ top: s.getBoundingClientRect().bottom + scrollY - innerHeight, behavior: 'instant' }));
    await page.locator('.cl-encart__lien[href="#ci-jaune"]').click();
    await expect.poll(() => page.locator('#ci-jaune').evaluate((s) => Math.abs(s.getBoundingClientRect().top) < 200), { timeout: 12000 }).toBe(true);
  });
});
