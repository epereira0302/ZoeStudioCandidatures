// Pages de texte simples (mentions légales) : en-tête, menu, curseur et pied
// de page communs, contenus de contenu/site.json.

import { chargerDonnees, lier } from './donnees.js';
import { initCommun, revelations } from './commun.js';

async function init() {
  initCommun();
  try {
    lier(await chargerDonnees());
  } catch (e) {
    console.error('Contenus introuvables', e);
  }
  revelations();
}

init();
