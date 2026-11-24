// Co-brandings Krispy Kreme d’après les maquettes du 2026-11-18 : Buttermelt
// Glaze (NYX) et Kiss café (Too Faced), plus la nouvelle couverture de Glowy Winter
import { test, expect, projets } from './outils.js';

const sansAltOuCassees = (page, selecteur) => page.locator(selecteur).evaluateAll(async (imgs) => {
  await Promise.all(imgs.map((i) => { i.loading = 'eager'; return i.decode().catch(() => {}); }));
  // alt vide permis pour un calque décoratif, mais l’attribut doit exister
  return imgs.filter((i) => i.getAttribute('alt') === null || !i.naturalWidth).map((i) => i.src);
});

test.describe('Buttermelt Glaze', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/projet.html?p=nyx-krispy-kreme');
    await expect(page.locator('.page-bm')).toBeVisible();
  });

  test('l’encart montre client, année, titre, type et crédits, sans rôle ni catégorie', async ({ page }) => {
    const encart = page.locator('[data-cl-encart]');
    await expect(page.locator('h1')).toHaveText('Buttermelt Glaze');
    await expect(encart).toContainText('NYX × Krispy Kreme');
    await expect(encart).toContainText('2025');
    await expect(encart).toContainText('Lancement de produit');
    await expect(encart.locator('.kk-fiche')).toHaveCount(0);
    await expect(encart).not.toContainText('Rôle');
    await expect(encart).toContainText('252 400 vues');
    await expect(encart.locator('.cl-credits--encart li')).toHaveCount(4);
    await expect(encart.locator('.cl-credits--encart')).toContainText('Flavie Tréhin : Chargée de communication');
  });

  test('les visuels suivent la maquette et ont tous un texte de remplacement', async ({ page }) => {
    const noms = await page.locator('.bm-visuels img').evaluateAll((imgs) => imgs.map((i) => i.getAttribute('src').match(/([\w-]+)-s\.webp$/)[1]));
    expect(noms).toEqual(['glaze-bandeau', 'photo-gobelet', 'calque-goutte', 'calque-almond', 'calque-chai', 'tube-almond', 'tube-chai', 'photo-plateau', 'boites', 'post-logos-affiche', 'post-croque-affiche', 'post-logos-tel', 'post-croque-tel', 'post-logos', 'post-croque']);
    // la scène des deux posts vient juste après les packagings, puis la vidéo
    const ordre = await page.locator('#bm-reseaux > *').evaluateAll((n) => n.map((x) => x.className));
    expect(ordre[0]).toContain('bm-posts');
    expect(ordre[1]).toContain('bm-video');
    expect(await sansAltOuCassees(page, '.bm-visuels img')).toEqual([]);
  });

  test('la scène reste à l’écran : le tube change de teinte et la goutte apparaît derrière', async ({ page }) => {
    test.skip(await page.evaluate(() => matchMedia('(prefers-reduced-motion: reduce)').matches), 'visuels fixes');
    const chai = page.locator('.bm-teintes__tube--chai');
    const goutte = page.locator('.bm-teintes__goutte');
    await expect(page.locator('[data-bm-produit].bm-anime')).toHaveCount(1);
    expect(Number(await chai.evaluate((e) => getComputedStyle(e).opacity))).toBeLessThan(0.05);
    // jusqu’au bas de la scène
    await page.locator('[data-bm-teintes]').evaluate((b) => scrollTo(0, b.getBoundingClientRect().bottom + scrollY - innerHeight));
    await expect.poll(() => chai.evaluate((e) => Number(getComputedStyle(e).opacity)), { timeout: 4000 }).toBeGreaterThan(0.99);
    await expect.poll(() => goutte.evaluate((e) => Number(getComputedStyle(e).opacity)), { timeout: 4000 }).toBeGreaterThan(0.99);
    // la goutte est derrière le tube
    const z = await page.evaluate(() => [...document.querySelector('[data-bm-scene]').children].map((n) => n.className));
    expect(z[0]).toContain('goutte');
  });

  test('le post aux logos devient le post croqué au scroll, fond compris', async ({ page }) => {
    test.skip(await page.evaluate(() => matchMedia('(prefers-reduced-motion: reduce)').matches), 'visuels fixes');
    const scene = page.locator('[data-bm-posts-scene]');
    const fond = () => scene.evaluate((s) => getComputedStyle(s).backgroundColor);
    await page.locator('[data-bm-posts]').evaluate((b) => scrollTo(0, b.getBoundingClientRect().top + scrollY - innerHeight));
    await expect.poll(fond, { timeout: 4000 }).toBe('rgb(253, 207, 126)');
    // jusqu’à la fin de la scène : le haut du bloc à (haut collant − course)
    await page.locator('[data-bm-posts]').evaluate((b) => { const s = b.querySelector('[data-bm-posts-scene]'); const haut = parseFloat(getComputedStyle(s).top); scrollTo(0, b.getBoundingClientRect().top + scrollY - (haut - (b.offsetHeight - s.offsetHeight)) + 2); });
    await expect.poll(fond, { timeout: 4000 }).toBe('rgb(194, 115, 58)');
    await expect.poll(() => page.locator('.bm-posts__tel--croque').evaluate((e) => Number(getComputedStyle(e).opacity)), { timeout: 4000 }).toBeGreaterThan(0.99);
  });

  test('le bouton du son fait parler la vidéo des réseaux, puis la coupe', async ({ page, isMobile }) => {
    test.skip(await page.evaluate(() => matchMedia('(prefers-reduced-motion: reduce)').matches), 'commandes du lecteur');
    const bloc = page.locator('.bm-video');
    await bloc.scrollIntoViewIfNeeded();
    const bouton = bloc.locator('[data-kk-son]');
    await expect(bouton).toHaveAttribute('aria-pressed', 'false');
    await bouton.click();
    await expect(bouton).toHaveAttribute('aria-pressed', 'true');
    expect(await bloc.locator('video').evaluate((v) => v.muted)).toBe(false);
    await bouton.click();
    expect(await bloc.locator('video').evaluate((v) => v.muted)).toBe(true);
  });

  test('la bande « Glaze » glisse au scroll', async ({ page }) => {
    test.skip(await page.evaluate(() => matchMedia('(prefers-reduced-motion: reduce)').matches), 'immobile');
    const bande = page.locator('[data-kk-glisse]');
    const x0 = await bande.evaluate((b) => b.style.getPropertyValue('--kk-x'));
    await page.mouse.wheel(0, 500);
    await expect.poll(() => bande.evaluate((b) => b.style.getPropertyValue('--kk-x'))).not.toBe(x0);
  });
});

test.describe('Kiss café', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/projet.html?p=too-faced-kiss-cafe');
    await expect(page.locator('.page-kc')).toBeVisible();
  });

  test('l’encart montre client, année, titre et texte', async ({ page }) => {
    const encart = page.locator('[data-cl-encart]');
    await expect(page.locator('h1')).toHaveText('Kiss café');
    await expect(encart).toContainText('Too Faced × Krispy Kreme');
    await expect(encart).toContainText('Marais');
    await expect(encart.locator('.cl-credits--encart li')).toHaveCount(4);
  });

  test('les visuels suivent la maquette et ont tous un texte de remplacement', async ({ page }) => {
    const noms = await page.locator('.kc-visuels img').evaluateAll((imgs) => imgs.map((i) => i.getAttribute('src').match(/([\w-]+)-s\.webp$/)[1]));
    expect(noms).toEqual(['logo-too-faced', 'boutique', 'video-boite', 'video-donuts', 'video-sachet', 'video-carrousel', 'fond-krispy', 'logo-krispy', 'vitrine']);
    expect(await sansAltOuCassees(page, '.kc-visuels img')).toEqual([]);
    await expect(page.locator('.kc-grille li')).toHaveCount(4);
  });

  test('le logo chromé brille quand il arrive à l’écran', async ({ page }) => {
    const logo = page.locator('[data-kk-brille]').first();
    await expect(logo).toHaveClass(/is-vu/);
  });

  test('les deux reels sont côte à côte, un seul parle à la fois', async ({ page }) => {
    test.skip(await page.evaluate(() => matchMedia('(prefers-reduced-motion: reduce)').matches), 'commandes du lecteur');
    const reels = page.locator('.kc-reels .kk-video');
    await expect(reels).toHaveCount(2);
    await reels.first().scrollIntoViewIfNeeded();
    const [a, b] = await reels.evaluateAll((r) => r.map((x) => x.getBoundingClientRect().top));
    expect(Math.abs(a - b)).toBeLessThan(2);
    await reels.nth(0).locator('[data-kk-son]').click();
    await reels.nth(1).locator('[data-kk-son]').click();
    expect(await reels.evaluateAll((r) => r.map((x) => x.querySelector('video').muted))).toEqual([true, false]);
  });

  test('le logo Krispy Kreme passe en 3D (WebGL) et tourne', async ({ page }) => {
    const webgl = await page.evaluate(() => !!document.createElement('canvas').getContext('webgl2'));
    test.skip(!webgl, 'pas de WebGL dans ce navigateur');
    const fig = page.locator('[data-kc-logo3d]');
    await fig.scrollIntoViewIfNeeded();
    await expect(fig).toHaveClass(/is-3d/, { timeout: 15000 });
    await expect(fig.locator('canvas')).toBeVisible();
  });

  test('la vitrine est montrée en entier', async ({ page }) => {
    const img = page.locator('.kc-vitrine img');
    await expect(img).toHaveAttribute('width', '1176');
    await expect(img).toHaveAttribute('height', '1154');
  });
});

test.describe('Catégories et accueil', () => {
  test('les deux projets sont rangés en Identité visuelle et en Packaging', async ({ request }) => {
    const liste = await projets(request);
    for (const slug of ['nyx-krispy-kreme', 'too-faced-kiss-cafe']) {
      expect(liste.find((p) => p.slug === slug).categories).toEqual(['brand-identity', 'packaging']);
    }
  });

  test('Glowy Winter, Buttermelt Glaze et Kiss café ne sont pas dans les projets phares', async ({ page, request }) => {
    const liste = await projets(request);
    for (const s of ['glowy-winter', 'nyx-krispy-kreme', 'too-faced-kiss-cafe']) {
      const p = liste.find((x) => x.slug === s);
      expect(p.accueil, s).toBeFalsy();
    }
    await page.goto('/');
    const liens = await page.locator('[data-phares-liste] a').evaluateAll((a) => a.map((x) => x.getAttribute('href')));
    for (const s of ['glowy-winter', 'nyx-krispy-kreme', 'too-faced-kiss-cafe']) expect(liens.join(' ')).not.toContain(`p=${s}`);
  });

  test('Glowy Winter, Buttermelt Glaze et Kiss café ont leur couverture choisie', async ({ page }) => {
    await page.goto('/projets.html');
    for (const [slug, dossier] of [['glowy-winter', 'glowy-winter'], ['nyx-krispy-kreme', 'buttermelt-glaze'], ['too-faced-kiss-cafe', 'kiss-cafe']]) {
      const img = page.locator(`.index__image[href$="p=${slug}"] img`);
      await expect(img).toHaveAttribute('src', new RegExp(`${dossier}/couverture-s\\.webp$`));
    }
  });
});
