// Rapport de couverture du code du site (méthode ECC test-coverage) :
// fusionne la couverture V8 relevée par chaque parcours (COUVERTURE=1)
// et l’affiche fichier par fichier, avec le seuil de 80 % en lignes.
import { readdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import v8toIstanbul from 'v8-to-istanbul';
import libCoverage from 'istanbul-lib-coverage';
import libReport from 'istanbul-lib-report';
import reports from 'istanbul-reports';

const SEUIL = 80;
const racine = fileURLToPath(new URL('../../', import.meta.url));
const brut = new URL('../.couverture/brut/', import.meta.url);
const carte = libCoverage.createCoverageMap({});

for (const f of readdirSync(brut)) {
  for (const entree of JSON.parse(readFileSync(new URL(f, brut), 'utf8'))) {
    const chemin = racine + new URL(entree.url).pathname.slice(1);
    const conv = v8toIstanbul(chemin, 0, { source: entree.source });
    await conv.load();
    conv.applyCoverage(entree.functions);
    carte.merge(conv.toIstanbul());
  }
}

const contexte = libReport.createContext({
  dir: fileURLToPath(new URL('../rapport-couverture/', import.meta.url)),
  coverageMap: carte,
  defaultSummarizer: 'flat',
});
for (const r of ['text', 'html', 'json-summary']) reports.create(r).execute(contexte);

const lignes = carte.getCoverageSummary().lines.pct;
console.log(`\nCouverture totale des lignes : ${lignes} % (seuil ${SEUIL} %)`);
if (lignes < SEUIL) process.exitCode = 1;
