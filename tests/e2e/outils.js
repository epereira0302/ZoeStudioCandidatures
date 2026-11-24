// Outils partagés par les parcours : relevé des erreurs de la page et
// couverture du code (V8) quand COUVERTURE=1.
import { test as base, expect } from '@playwright/test';
import { mkdirSync, writeFileSync } from 'node:fs';
import { randomUUID } from 'node:crypto';

const COUVERTURE = process.env.COUVERTURE === '1';
const DOSSIER = new URL('../.couverture/brut/', import.meta.url);

export const test = base.extend({
  // Chaque test échoue si la page lève une erreur ou écrit une erreur dans la console
  erreurs: [async ({ page }, use) => {
    // Les polices Adobe Fonts (page Le Central Technique) viennent d’un serveur
    // externe : remplacées par une feuille vide pour des tests sans réseau
    await page.route('https://use.typekit.net/**', (r) => r.fulfill({ status: 200, contentType: 'text/css', body: '' }));
    const liste = [];
    page.on('pageerror', (e) => liste.push(`Exception : ${e.message}`));
    page.on('console', (m) => { if (m.type() === 'error') liste.push(`Console : ${m.text()}`); });
    await use(liste);
    expect(liste, 'erreurs JavaScript dans la page').toEqual([]);
  }, { auto: true }],

  couverture: [async ({ page, browserName }, use) => {
    const actif = COUVERTURE && browserName === 'chromium';
    if (actif) await page.coverage.startJSCoverage({ resetOnNavigation: false });
    await use();
    if (!actif) return;
    const brut = (await page.coverage.stopJSCoverage()).filter((e) => /\/assets\/js\/(?!vendor\/).+\.js/.test(e.url));
    mkdirSync(DOSSIER, { recursive: true });
    writeFileSync(new URL(`${randomUUID()}.json`, DOSSIER), JSON.stringify(brut));
  }, { auto: true }],
});

export { expect };

// Fait défiler jusqu’à un élément puis attend que la page se pose
export async function allerA(page, selecteur) {
  const cible = page.locator(selecteur).first();
  await cible.evaluate((e) => e.scrollIntoView({ block: 'center' }));
  await page.waitForTimeout(400);
  return cible;
}

// Charge tous les projets décrits dans contenu/projets.json
export async function projets(request) {
  const r = await request.get('/contenu/projets.json');
  return (await r.json()).projets;
}
