// Logo Krispy Kreme en chrome 3D pour le Kiss café (demandes d’Enzo des 23
// novembre, inspiration : lettres de chrome « gonflé » qui tournent). Le contour
// vient du logo chromé de la maquette, vectorisé en trois familles
// (krispy-formes.json, 1000 unités de large) :
// - chrome : le cadre, l’écriture et la pastille, bords très arrondis
// - laque : le fond noir brillant de la pastille
// - lettres : « DOUGHNUTS », en chrome, en relief sur la laque (lisibles)
// Tourne lentement sur lui-même ; on peut le faire tourner à la main (souris ou
// doigt, glisser à l’horizontale). Avec « réduire les animations » : immobile de
// trois quarts, toujours orientable à la main. Calcul seulement à l’écran ; sans
// WebGL, l’image fixe reste.

import {
  WebGLRenderer, Scene, PerspectiveCamera, Group, Mesh, Shape, Path, ExtrudeGeometry,
  MeshPhysicalMaterial, MeshBasicMaterial, ShaderMaterial, SphereGeometry, PlaneGeometry,
  PMREMGenerator, Color, BackSide, DoubleSide, SRGBColorSpace,
  ACESFilmicToneMapping, toCreasedNormals,
} from '../vendor/three-krispy.js?v=20261124g';
import { reduit } from '../commun.js';

const LARGEUR = 10;            // largeur du logo dans la scène
const TOUR = 18;               // secondes pour un tour complet
const ANGLE_FIXE = -0.42;      // trois quarts, avec « réduire les animations »

// Studio de reflets doux (ciel bleuté vers lavande, comme l’inspiration) avec
// de petites sources très vives qui donnent les éclats blancs du chrome
function studio(renderer) {
  const scene = new Scene();
  const ciel = new Mesh(new SphereGeometry(50, 64, 32), new ShaderMaterial({
    side: BackSide,
    depthWrite: false,
    uniforms: { bas: { value: new Color('#100c1c') }, milieu: { value: new Color('#4d5276') }, haut: { value: new Color('#b9c2e4') } },
    vertexShader: 'varying vec3 p; void main(){ p = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
    fragmentShader: 'uniform vec3 bas, milieu, haut; varying vec3 p; void main(){ float y = p.y; vec3 c = y < 0.0 ? mix(milieu, bas, smoothstep(0.0, -0.9, y)) : mix(milieu, haut, smoothstep(-0.05, 0.75, y)); gl_FragColor = vec4(c, 1.0); }',
  }));
  scene.add(ciel);
  const lumiere = (geo, x, y, z, couleur, force) => {
    const m = new Mesh(geo, new MeshBasicMaterial({ color: new Color(couleur).multiplyScalar(force), side: DoubleSide, toneMapped: false }));
    m.position.set(x, y, z);
    m.lookAt(0, 0, 0);
    scene.add(m);
  };
  lumiere(new PlaneGeometry(9, 6), -16, 15, 18, '#ffffff', 4);        // boîte à lumière haut gauche
  lumiere(new PlaneGeometry(2, 30), 22, 2, 10, '#ffffff', 4.5);       // bande verticale à droite
  lumiere(new PlaneGeometry(1.4, 26), -24, 0, 4, '#ffffff', 3.5);     // fil de lumière à gauche
  lumiere(new SphereGeometry(1.1, 16, 8), -6, 18, 24, '#ffffff', 22);  // éclats
  lumiere(new SphereGeometry(0.9, 16, 8), 14, 10, 26, '#ffffff', 20);
  lumiere(new SphereGeometry(0.7, 16, 8), 4, -6, 30, '#ffffff', 16);
  lumiere(new SphereGeometry(0.7, 16, 8), -18, -4, 22, '#ffffff', 14);
  lumiere(new PlaneGeometry(30, 2.5), 0, -16, 18, '#b48cff', 1.8);     // reflet lavande bas
  lumiere(new PlaneGeometry(18, 2), 8, 20, -10, '#ff7ccf', 1.6);       // reflet rose derrière
  const pmrem = new PMREMGenerator(renderer);
  const env = pmrem.fromScene(scene, 0.02).texture;
  pmrem.dispose();
  return env;
}

// Formes extrudées : { o: [[x, y]…], h: [trou…] } → géométrie lissée
function extruder(liste, k, { profondeur, epaisseur, arrondi, segments }) {
  const formes = liste.map(({ o, h }) => {
    const s = new Shape(o.map(([x, y]) => ({ x: x * k, y: y * k })));
    h.forEach((t) => s.holes.push(new Path(t.map(([x, y]) => ({ x: x * k, y: y * k })))));
    return s;
  });
  const g = new ExtrudeGeometry(formes, {
    depth: profondeur, curveSegments: 4, bevelEnabled: true,
    bevelThickness: epaisseur, bevelSize: arrondi, bevelOffset: -arrondi, bevelSegments: segments,
  });
  g.translate(0, 0, -profondeur / 2);
  // normales lissées partout où l’angle reste doux : le bord devient un boudin continu
  return toCreasedNormals(g, Math.PI / 2.6);
}

export async function logo3d(figure, dossier) {
  const canvas = document.createElement('canvas');
  canvas.className = 'kc-logo3d__toile';
  canvas.setAttribute('aria-hidden', 'true');
  let renderer;
  try {
    renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'low-power' });
  } catch {
    return; // pas de WebGL : l’image fixe reste
  }
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));

  const donnees = await fetch(`${dossier}/krispy-formes.json`).then((r) => r.json());
  const k = LARGEUR / donnees.largeur;
  // Corps : peu profond mais très arrondi (bevel vers l’intérieur, silhouette exacte)
  const corps = { profondeur: 0.16, epaisseur: 0.11, arrondi: 0.034, segments: 9 };
  const avant = corps.profondeur / 2 + corps.epaisseur;  // plan de la face avant
  const gChrome = extruder(donnees.chrome, k, corps);
  const gLaque = extruder(donnees.laque, k, { profondeur: 0.02, epaisseur: 0.012, arrondi: 0.01, segments: 3 });
  gLaque.translate(0, 0, avant + 0.004);
  const gLettres = extruder(donnees.lettres, k, { profondeur: 0.03, epaisseur: 0.035, arrondi: 0.012, segments: 5 });
  gLettres.translate(0, 0, avant + 0.03);

  const scene = new Scene();
  scene.environment = studio(renderer);
  const chrome = new MeshPhysicalMaterial({ color: 0xf6f5fa, metalness: 1, roughness: 0.035, envMapIntensity: 1.35 });
  const laque = new MeshPhysicalMaterial({ color: 0x0b0a10, metalness: 0.15, roughness: 0.18, clearcoat: 1, clearcoatRoughness: 0.05, envMapIntensity: 1 });
  const logo = new Group();
  logo.add(new Mesh(gChrome, chrome), new Mesh(gLaque, laque), new Mesh(gLettres, chrome));
  // le dos de la pastille : la laque et les lettres en miroir, pour un logo lisible des deux côtés
  const dos = new Group();
  dos.add(new Mesh(gLaque, laque), new Mesh(gLettres, chrome));
  dos.scale.set(-1, 1, -1);
  logo.add(dos);
  scene.add(logo);

  const camera = new PerspectiveCamera(30, 1, 0.1, 100);
  // Le logo occupe 71 % de la largeur, comme sur la maquette
  const cadrer = () => {
    const { width, height } = figure.getBoundingClientRect();
    if (!width || !height) return;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    const largeurVue = LARGEUR / 0.71;
    const d = largeurVue / (2 * Math.tan((camera.fov * Math.PI) / 360) * camera.aspect);
    // le logo de la maquette est centré à 51,9 % de la hauteur : même place que l’image fixe
    camera.position.set(0, 0.019 * 2 * d * Math.tan((camera.fov * Math.PI) / 360), d);
    camera.updateProjectionMatrix();
  };
  figure.appendChild(canvas);
  cadrer();
  new ResizeObserver(() => { cadrer(); if (!enCours) dessiner(); }).observe(figure);

  // Rotation : vitesse de croisière, poussée au doigt, retour en douceur
  const croisiere = reduit ? 0 : (Math.PI * 2) / TOUR;
  let angle = reduit ? ANGLE_FIXE : -0.25;
  let vitesse = croisiere;
  let prise = null;
  let t0 = performance.now();
  let enCours = false;
  let visible = false;

  const dessiner = () => {
    logo.rotation.y = angle;
    logo.rotation.x = reduit ? 0.05 : 0.06 * Math.sin(performance.now() / 2600);
    renderer.render(scene, camera);
  };
  const image = (t) => {
    const dt = Math.min(0.05, (t - t0) / 1000);
    t0 = t;
    if (!prise) {
      // retour exponentiel vers la vitesse de croisière (≈ 1,2 s)
      vitesse += (croisiere - vitesse) * (1 - Math.exp(-dt / 0.4));
      angle += vitesse * dt;
    }
    dessiner();
    const calme = !prise && Math.abs(vitesse - croisiere) < 1e-3 && croisiere === 0;
    if (visible && !document.hidden && !calme) requestAnimationFrame(image);
    else enCours = false;
  };
  const lancer = () => {
    if (enCours) return;
    enCours = true;
    t0 = performance.now();
    requestAnimationFrame(image);
  };

  // Glisser à l’horizontale pour le faire tourner ; le défilement vertical reste libre
  canvas.addEventListener('pointerdown', (e) => {
    prise = { x: e.clientX, angle, hist: [[e.clientX, e.timeStamp]] };
    canvas.setPointerCapture(e.pointerId);
    figure.classList.add('is-prise');
    lancer();
  });
  canvas.addEventListener('pointermove', (e) => {
    if (!prise) return;
    angle = prise.angle + ((e.clientX - prise.x) / figure.clientWidth) * Math.PI * 1.6;
    prise.hist.push([e.clientX, e.timeStamp]);
    if (prise.hist.length > 5) prise.hist.shift();
  });
  const lacher = () => {
    if (!prise) return;
    // vitesse de lâcher, reprise par l’élan puis amortie vers la croisière
    const [a, b] = [prise.hist[0], prise.hist[prise.hist.length - 1]];
    const dt = Math.max(16, b[1] - a[1]) / 1000;
    vitesse = (((b[0] - a[0]) / figure.clientWidth) * Math.PI * 1.6) / dt;
    prise = null;
    figure.classList.remove('is-prise');
    lancer();
  };
  canvas.addEventListener('pointerup', lacher);
  canvas.addEventListener('pointercancel', lacher);

  new IntersectionObserver(([e]) => {
    visible = e.isIntersecting;
    if (visible) lancer();
  }, { rootMargin: '10% 0px' }).observe(figure);
  document.addEventListener('visibilitychange', () => { if (!document.hidden && visible) lancer(); });

  dessiner();
  figure.classList.add('is-3d');
}
