// Petit serveur statique pour les tests : sert la racine du site, comme Vercel,
// avec les requêtes partielles (Range) dont les vidéos ont besoin pour se positionner.
import { createServer } from 'node:http';
import { createReadStream, statSync } from 'node:fs';
import { extname, join, normalize, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const RACINE = resolve(fileURLToPath(new URL('..', import.meta.url)));
const PORT = Number(process.env.PORT) || 4321;
const TYPES = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.png': 'image/png',
  '.jpg': 'image/jpeg', '.mp4': 'video/mp4', '.woff2': 'font/woff2', '.ico': 'image/x-icon', '.txt': 'text/plain; charset=utf-8',
};

const fichier = (chemin) => {
  const p = normalize(join(RACINE, decodeURIComponent(chemin)));
  if (!p.startsWith(RACINE)) return null;
  try {
    const s = statSync(p);
    if (s.isDirectory()) return fichier(join(chemin, 'index.html'));
    return { p, s };
  } catch { return null; }
};

createServer((req, res) => {
  const { pathname } = new URL(req.url, 'http://x');
  const f = fichier(pathname);
  if (!f) {
    const p404 = fichier('/404.html');
    res.writeHead(404, { 'Content-Type': TYPES['.html'] });
    return createReadStream(p404.p).pipe(res);
  }
  const type = TYPES[extname(f.p)] || 'application/octet-stream';
  const plage = /bytes=(\d*)-(\d*)/.exec(req.headers.range || '');
  if (plage) {
    const debut = plage[1] ? Number(plage[1]) : 0;
    const fin = plage[2] ? Number(plage[2]) : f.s.size - 1;
    res.writeHead(206, { 'Content-Type': type, 'Accept-Ranges': 'bytes', 'Content-Range': `bytes ${debut}-${fin}/${f.s.size}`, 'Content-Length': fin - debut + 1 });
    return createReadStream(f.p, { start: debut, end: fin }).pipe(res);
  }
  res.writeHead(200, { 'Content-Type': type, 'Accept-Ranges': 'bytes', 'Content-Length': f.s.size });
  createReadStream(f.p).pipe(res);
}).listen(PORT, () => console.log(`Site servi sur http://localhost:${PORT}`));
