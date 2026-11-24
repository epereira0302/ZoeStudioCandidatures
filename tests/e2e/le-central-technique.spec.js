// Gabarit Le Central Technique (maquette du 2026-11-17) : encart, visuels,
// vidéo du symbole, motif à recolorer, Rubik variable, inspecteur de glyphes
import { test, expect } from './outils.js';

test.describe('Le Central Technique', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/projet.html?p=le-central-technique');
    await expect(page.locator('.page-lct')).toBeVisible();
  });

  test('l’encart montre le client, l’année, le titre, le type et le rôle', async ({ page }) => {
    const encart = page.locator('[data-cl-encart]');
    await expect(page.locator('h1')).toHaveText('Le Central Technique');
    await expect(encart).toContainText('Création de logo et identité visuelle');
    await expect(encart).toContainText('2026');
    await expect(encart.locator('.lct-role li')).toHaveText(['Direction artistique', 'Graphisme', 'Création de contenu']);
    await expect(encart.locator('.lct-role__note')).toHaveText('Collaboration long terme');
  });

  test('les visuels suivent la maquette, sans l’ancien contenu, et ont tous un texte de remplacement', async ({ page }) => {
    const noms = await page.locator('.lct-visuels img:not([data-lct-sticker]):not(.lct-bande__nom)').evaluateAll((imgs) => imgs.map((i) => i.getAttribute('src').match(/([\w-]+)-s\.webp$/)[1]));
    expect(noms).toEqual(['titre', 'logo-apres', 'logo-avant', 'construction', 'declinaisons', 'tenue-casque', 'tenue-polo', 'tenue-combinaison', 'papeterie', 'enseignes', 'horaires']);
    await expect(page.locator('.lct-testeur, .lct-cols')).toHaveCount(0);
    // Les autocollants sont décrits par leur surface (role=img), d’où alt=""
    const sansAlt = await page.locator('.lct-visuels img:not([data-lct-sticker])').evaluateAll((imgs) => imgs.filter((i) => !i.alt.trim()).length);
    expect(sansAlt).toBe(0);
    const cassees = await page.locator('.lct-visuels img').evaluateAll(async (imgs) => {
      await Promise.all(imgs.map((i) => { i.loading = 'eager'; return i.decode().catch(() => {}); }));
      return imgs.filter((i) => !i.naturalWidth).map((i) => i.src);
    });
    expect(cassees).toEqual([]);
  });

  test('la vidéo du symbole remplace la capture, muette, et tourne à l’écran', async ({ page }) => {
    const v = page.locator('.lct-reveal video');
    await expect(v.locator('source')).toHaveAttribute('src', /reveal\.mp4$/);
    await expect(v).toHaveAttribute('aria-label', /symbole/);
    test.skip(await page.evaluate(() => matchMedia('(prefers-reduced-motion: reduce)').matches), 'commandes du lecteur à la place');
    await v.scrollIntoViewIfNeeded();
    await expect.poll(() => v.evaluate((x) => !x.paused && x.muted), { timeout: 8000 }).toBe(true);
  });

  test('le motif se recolore, sans jamais avoir la même couleur que son fond', async ({ page }) => {
    const bloc = page.locator('[data-lct-motif]');
    await bloc.scrollIntoViewIfNeeded();
    await bloc.locator('.lct-motif__choix--motif .lct-puce').nth(3).click();
    await expect(bloc).toHaveAttribute('style', /--motif:\s*#EF7A47/);
    // Fond = couleur du motif : les deux s’échangent
    await bloc.locator('.lct-motif__choix--fond .lct-puce').nth(3).click();
    await expect(bloc).toHaveAttribute('style', /--fond:\s*#EF7A47/);
    await expect(bloc).toHaveAttribute('style', /--motif:\s*#FFFFFF/);
    await expect(bloc.locator('[data-lct-motif-annonce]')).toHaveText('Motif Blanc sur fond LED');
    for (let i = 0; i < 5; i += 1) {
      await bloc.locator('[data-lct-hasard]').click();
      const [m, f] = await bloc.evaluate((b) => ['--motif', '--fond'].map((v) => b.style.getPropertyValue(v).trim()));
      expect(m).not.toBe(f);
    }
  });

  test('Rubik : la graisse varie seule, le curseur la règle et met en pause', async ({ page }) => {
    const bloc = page.locator('[data-lct-rubik]');
    const texte = bloc.locator('[data-lct-rubik-texte]');
    await bloc.scrollIntoViewIfNeeded();
    const graisse = () => texte.evaluate((t) => Number(getComputedStyle(t).fontWeight));
    const reduit = await page.evaluate(() => matchMedia('(prefers-reduced-motion: reduce)').matches);
    if (reduit) {
      await expect(bloc.locator('[data-lct-lecture]')).toHaveAttribute('aria-pressed', 'true');
      expect(await graisse()).toBe(900);
    } else {
      const a = await graisse();
      await page.waitForTimeout(900);
      expect(await graisse()).not.toBe(a);
    }
    await bloc.locator('[data-lct-graisse]').fill('420');
    await expect(bloc.locator('[data-lct-graisse-valeur]')).toHaveText('420');
    await expect(bloc.locator('[data-lct-lecture]')).toHaveAttribute('aria-pressed', 'true');
    await page.waitForTimeout(500);
    expect(await graisse()).toBe(420);
  });

  test('Sofia : un glyphe choisi s’affiche en grand ; flèches dans la grille', async ({ page }) => {
    const bloc = page.locator('[data-lct-sofia]');
    await bloc.scrollIntoViewIfNeeded();
    await expect(bloc.locator('[data-lct-grille] button')).toHaveCount(94);
    await expect(bloc.locator('[data-lct-info]')).toHaveCount(0);
    await bloc.locator('[data-lct-grille] button', { hasText: /^g$/ }).click();
    await expect(bloc.locator('[data-lct-glyphe-texte]')).toHaveText('g');
    await expect(bloc.locator('[data-lct-sofia-annonce]')).toHaveText('Latin Small Letter G, U+0067');
    await page.keyboard.press('ArrowRight');
    await expect(bloc.locator('[data-lct-glyphe-texte]')).toHaveText('h');
    // La visite automatique s’arrête dès qu’on a choisi
    await page.waitForTimeout(1800);
    await expect(bloc.locator('[data-lct-glyphe-texte]')).toHaveText('h');
    await bloc.locator('[data-lct-style]').selectOption('900');
    await expect(bloc).toHaveCSS('--sofia-g', '900');
    await expect(bloc.locator('[data-lct-lignes] line')).toHaveCount(5);
  });

  test('avant / après : le curseur déplace la barre entre l’ancien et le nouveau logo', async ({ page }) => {
    const bloc = page.locator('[data-lct-comparer]');
    await expect(bloc).toHaveAttribute('style', /--pos: 50%/);
    await bloc.locator('[data-lct-comparer-curseur]').fill('20');
    await expect(bloc).toHaveAttribute('style', /--pos: 20%/);
    await expect(bloc.locator('[data-lct-comparer-curseur]')).toHaveAttribute('aria-valuetext', '20 % ancien logo, 80 % nouveau');
  });

  test('couleur / niveau de gris : toute la grille passe en gris', async ({ page }) => {
    const bloc = page.locator('[data-lct-modes]');
    await bloc.scrollIntoViewIfNeeded();
    const filtre = () => bloc.locator('.lct-grille__cases').evaluate((c) => getComputedStyle(c).filter);
    expect(await filtre()).toBe('none');
    await bloc.getByRole('button', { name: 'Niveau de gris' }).click();
    await expect(bloc).toHaveAttribute('data-version', '1');
    await expect(bloc.getByRole('button', { name: 'Niveau de gris' })).toHaveAttribute('aria-pressed', 'true');
    await expect.poll(filtre, { timeout: 3000 }).toBe('grayscale(1)');
    await bloc.getByRole('button', { name: 'Couleur' }).click();
    await expect.poll(filtre, { timeout: 3000 }).toMatch(/none|grayscale\(0\)/);
  });

  test('tenues : la planche reste à l’écran et chaque cran de scroll dévoile texte, couleur et photo', async ({ page }) => {
    const bloc = page.locator('[data-lct-tenues]');
    await bloc.evaluate((b) => scrollTo(0, b.getBoundingClientRect().top + scrollY - 72));
    await expect(bloc).toHaveAttribute('data-etape', '0');
    const separation = () => bloc.locator('.lct-tenues__photos').evaluate((p) => Math.round(p.getBoundingClientRect().left));
    const x0 = await separation();
    const etapes = [];
    for (const u of [0.5, 0.9]) {
      await bloc.evaluate((b, f) => {
        const cadre = b.querySelector('.lct-tenues__cadre');
        const course = b.offsetHeight - cadre.offsetHeight;
        scrollTo(0, b.getBoundingClientRect().top + scrollY - parseFloat(getComputedStyle(cadre).top) + course * f);
      }, u);
      await page.waitForTimeout(300);
      etapes.push(await bloc.getAttribute('data-etape'));
      expect(await separation()).toBe(x0);
      const cadre = await bloc.locator('.lct-tenues__cadre').boundingBox();
      expect(Math.round(cadre.y)).toBeGreaterThanOrEqual(0);
    }
    expect(etapes).toEqual(['1', '2']);
    // La dernière tenue dévoilée est au-dessus des autres
    const dessus = await bloc.evaluate((b) => ['.lct-tenues__aplat', '.lct-tenues__photo'].map((sel) => {
      const els = [...b.querySelectorAll(sel)];
      return els.reduce((m, e, i) => (Number(getComputedStyle(e).zIndex) > Number(getComputedStyle(els[m]).zIndex) ? i : m), 0);
    }));
    expect(dessus).toEqual([2, 2]);
    await expect(bloc.locator('.lct-tenues__aplat').nth(2)).toContainText('Combinaison');
    await expect.poll(() => bloc.locator('.lct-tenues__photo').nth(2).evaluate((e) => getComputedStyle(e).clipPath), { timeout: 3000 }).toMatch(/inset\(0(px)?\)/);
  });

  test('taille minimale : le symbole passe de 10 cm à 2 cm et ses incisions s’élargissent', async ({ page }) => {
    const carte = page.locator('[data-lct-carte]');
    await carte.scrollIntoViewIfNeeded();
    await expect(carte.locator('[data-lct-carte-lecture], [data-lct-carte-etat]')).toHaveCount(0);
    const etat = () => carte.evaluate((c) => ({ w: Number(c.querySelector('[data-lct-traits]').getAttribute('stroke-width')), t: c.querySelector('[data-lct-carte-taille]').textContent }));
    const reduit = await page.evaluate(() => matchMedia('(prefers-reduced-motion: reduce)').matches);
    if (reduit) {
      expect(await etat()).toEqual({ w: 46, t: '2 CM' });
    } else {
      await expect.poll(async () => (await etat()).t, { timeout: 8000 }).toBe('2 CM');
      expect((await etat()).w).toBeGreaterThan(40);
      await expect.poll(async () => (await etat()).t, { timeout: 8000 }).toBe('10 CM');
      expect((await etat()).w).toBeLessThan(20);
    }
  });

  test('autocollants : les six se collent, puis un clic en colle un de plus à l’endroit visé', async ({ page }) => {
    const bloc = page.locator('[data-lct-stickers]');
    await bloc.scrollIntoViewIfNeeded();
    await expect(bloc).toHaveClass(/is-colle/);
    const surface = bloc.locator('[data-lct-surface]');
    await expect(surface.locator('[data-lct-sticker]')).toHaveCount(6);
    const boite = await surface.boundingBox();
    for (let i = 0; i < 3; i += 1) await surface.click({ position: { x: boite.width * (0.3 + i * 0.2), y: boite.height * 0.5 } });
    await expect(surface.locator('.is-ajout')).toHaveCount(3);
    await expect(bloc.locator('[data-lct-stickers-annonce]')).toHaveText('3 autocollants ajoutés');
    // Le premier ajout est centré sur le clic
    const s1 = await surface.locator('.is-ajout').first().evaluate((e) => ({ l: parseFloat(e.style.left), w: parseFloat(e.style.width) }));
    expect(Math.abs(s1.l + s1.w / 2 - 30)).toBeLessThan(1);
    await bloc.locator('[data-lct-decoller]').click();
    await expect(surface.locator('.is-ajout')).toHaveCount(0);
    await expect(surface.locator('[data-lct-sticker]')).toHaveCount(6);
    // Au clavier
    await bloc.locator('[data-lct-coller]').focus();
    await page.keyboard.press('Enter');
    await expect(surface.locator('.is-ajout')).toHaveCount(1);
  });

  test('palette : la bande survolée ou focalisée s’élargit et montre HEX, RVB et CMJN', async ({ page }) => {
    const bandes = page.locator('[data-lct-bandes] .lct-bande');
    await expect(bandes).toHaveCount(6);
    await expect(bandes.nth(0).locator('dd')).toHaveText(['#082935', '8 41 53', '85 23 0 79']);
    await expect(bandes.nth(3).locator('dd')).toHaveText(['#FFFFFF', '255 255 255', '0 0 0 0']);
    await bandes.nth(4).scrollIntoViewIfNeeded();
    const largeur = (i) => bandes.nth(i).evaluate((b) => b.getBoundingClientRect().width);
    const avant = await largeur(4);
    await bandes.nth(4).focus();
    await expect.poll(() => largeur(4), { timeout: 3000 }).toBeGreaterThan(avant * 1.5);
    await expect.poll(() => bandes.nth(4).locator('.lct-bande__valeurs').evaluate((v) => getComputedStyle(v).opacity), { timeout: 3000 }).toBe('1');
  });
});
