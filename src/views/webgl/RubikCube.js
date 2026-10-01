import * as THREE from "three";
import gsap from "gsap";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";

// Cubo mágico 3x3 de verdade: as camadas giram, ele se embaralha e se resolve sozinho.
// Resolver = desfazer os movimentos na ordem inversa (guardados em `history`).

const FACE_COLORS = {
  px: "#d8392b", // direita — vermelho
  nx: "#f07a1a", // esquerda — laranja
  py: "#f5f2ea", // cima — branco
  ny: "#f1c232", // baixo — amarelo
  pz: "#1f9a57", // frente — verde
  nz: "#1f5fd0", // trás — azul
};
const AXES = ["x", "y", "z"];

function roundedRectShape(size, r) {
  const s = size / 2;
  const shape = new THREE.Shape();
  shape.moveTo(-s + r, -s);
  shape.lineTo(s - r, -s);
  shape.quadraticCurveTo(s, -s, s, -s + r);
  shape.lineTo(s, s - r);
  shape.quadraticCurveTo(s, s, s - r, s);
  shape.lineTo(-s + r, s);
  shape.quadraticCurveTo(-s, s, -s, s - r);
  shape.lineTo(-s, -s + r);
  shape.quadraticCurveTo(-s, -s, -s + r, -s);
  return shape;
}

export function createRubikCube(canvas, { reduceMotion = false } = {}) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environmentIntensity = 0.6;

  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 50);
  camera.position.set(0, 0, 11);

  scene.add(new THREE.HemisphereLight("#ffffff", "#d9cfc0", 0.8));
  const key = new THREE.DirectionalLight("#fff6ea", 2.2);
  key.position.set(-4, 6, 6);
  key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  key.shadow.bias = -0.0008;
  Object.assign(key.shadow.camera, { left: -4, right: 4, top: 4, bottom: -4 });
  scene.add(key);
  const rim = new THREE.DirectionalLight("#e8c48a", 2);
  rim.position.set(5, 2, -4);
  scene.add(rim);

  // ---------- Peças ----------
  const root = new THREE.Group(); // posição / intro / scroll
  const tilt = new THREE.Group(); // segue o mouse
  const cube = new THREE.Group(); // as 27 peças
  root.add(tilt);
  tilt.add(cube);
  scene.add(root);
  cube.rotation.set(0.55, -0.7, 0);

  const bodyGeo = new RoundedBoxGeometry(0.96, 0.96, 0.96, 4, 0.12);
  const bodyMat = new THREE.MeshStandardMaterial({ color: "#141414", roughness: 0.35, metalness: 0.1 });
  const stickerGeo = new THREE.ShapeGeometry(roundedRectShape(0.8, 0.14), 6);
  const stickerMats = Object.fromEntries(
    Object.entries(FACE_COLORS).map(([k, c]) => [
      k,
      new THREE.MeshPhysicalMaterial({ color: c, roughness: 0.25, clearcoat: 1, clearcoatRoughness: 0.15 }),
    ]),
  );
  const faces = [
    { key: "px", axis: "x", sign: 1, rot: [0, Math.PI / 2, 0] },
    { key: "nx", axis: "x", sign: -1, rot: [0, -Math.PI / 2, 0] },
    { key: "py", axis: "y", sign: 1, rot: [-Math.PI / 2, 0, 0] },
    { key: "ny", axis: "y", sign: -1, rot: [Math.PI / 2, 0, 0] },
    { key: "pz", axis: "z", sign: 1, rot: [0, 0, 0] },
    { key: "nz", axis: "z", sign: -1, rot: [0, Math.PI, 0] },
  ];

  const cubies = [];
  for (let x = -1; x <= 1; x++)
    for (let y = -1; y <= 1; y++)
      for (let z = -1; z <= 1; z++) {
        const cubie = new THREE.Group();
        const body = new THREE.Mesh(bodyGeo, bodyMat);
        body.castShadow = body.receiveShadow = true;
        cubie.add(body);
        const pos = { x, y, z };
        for (const f of faces) {
          if (pos[f.axis] !== f.sign) continue; // só as faces de fora ganham adesivo
          const st = new THREE.Mesh(stickerGeo, stickerMats[f.key]);
          st.rotation.set(...f.rot);
          st.position[f.axis] = f.sign * 0.485;
          st.receiveShadow = true;
          cubie.add(st);
        }
        cubie.position.set(x, y, z);
        cubie.userData.home = new THREE.Vector3(x, y, z);
        cube.add(cubie);
        cubies.push(cubie);
      }

  // ---------- Movimentos ----------
  const history = [];
  let chain = Promise.resolve();
  let pending = 0;
  let turning = false;
  const snapMatrix = new THREE.Matrix4();

  function turn({ axis, layer, dir }, duration) {
    return new Promise((resolve) => {
      turning = true;
      const pivot = new THREE.Object3D();
      cube.add(pivot);
      const members = cubies.filter((c) => Math.round(c.userData.home[axis]) === layer);
      members.forEach((c) => {
        c.position.copy(c.userData.home);
        pivot.attach(c);
      });
      gsap.to(pivot.rotation, {
        [axis]: (dir * Math.PI) / 2,
        duration,
        ease: "power2.inOut",
        onComplete() {
          pivot.updateMatrixWorld(true);
          members.forEach((c) => {
            cube.attach(c);
            c.position.set(Math.round(c.position.x), Math.round(c.position.y), Math.round(c.position.z));
            // arredonda a rotação pra múltiplos de 90° (evita erro acumulado)
            snapMatrix.makeRotationFromQuaternion(c.quaternion);
            snapMatrix.elements.forEach((v, i) => (snapMatrix.elements[i] = Math.round(v)));
            c.quaternion.setFromRotationMatrix(snapMatrix);
            c.userData.home.copy(c.position);
          });
          cube.remove(pivot);
          turning = false;
          resolve();
        },
      });
    });
  }

  function enqueue(move, duration, record = true) {
    pending++;
    chain = chain
      .then(() => turn(move, duration))
      .then(() => {
        pending--;
        if (record) history.push(move);
      });
  }

  function randomMove() {
    const last = history[history.length - 1];
    let m;
    do {
      m = {
        axis: AXES[Math.floor(Math.random() * 3)],
        layer: Math.floor(Math.random() * 3) - 1,
        dir: Math.random() < 0.5 ? 1 : -1,
      };
    } while (last && last.axis === m.axis && last.layer === m.layer);
    return m;
  }

  function solve(speed = 0.28) {
    const moves = history.splice(0).reverse();
    moves.forEach((m) => enqueue({ ...m, dir: -m.dir }, speed, false));
  }

  // ---------- Estado / interação ----------
  const state = {
    mouse: new THREE.Vector2(),
    look: new THREE.Vector2(),
    scroll: 0,
    intro: 0,
    spin: 0,
    punch: 1,
  };

  // Loop sozinho: embaralha devagar e, depois de alguns movimentos, se resolve
  let cooldown = 2;
  setInterval(() => {
    if (reduceMotion || pending > 0 || state.scroll > 0.02 || document.hidden) return;
    if (cooldown-- > 0) return;
    if (history.length >= 7) {
      solve();
      cooldown = 4;
    } else enqueue(randomMove(), 0.5);
  }, 650);

  // Clique: embaralha rápido com um "soquinho" de escala
  function poke() {
    gsap.fromTo(state, { punch: 0.9 }, { punch: 1, duration: 0.8, ease: "elastic.out(1, 0.4)" });
    gsap.fromTo(state, { spin: 0 }, { spin: Math.PI * 2, duration: 1.1, ease: "power3.inOut" });
    for (let i = 0; i < 6; i++) enqueue(randomMove(), 0.16);
    cooldown = 3;
  }

  const layout = { x: 0, y: 0, scale: 1 };
  function resize() {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    const viewH = 2 * camera.position.z * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
    const viewW = viewH * camera.aspect;
    if (camera.aspect > 1) {
      layout.x = viewW * 0.27;
      layout.y = 0.6;
      layout.scale = 0.72;
    } else {
      layout.x = 0;
      layout.y = 0.75;
      layout.scale = Math.min(0.7, viewW / 6.6);
    }
  }
  resize();
  window.addEventListener("resize", resize);

  const raycaster = new THREE.Raycaster();
  const ndc = new THREE.Vector2();
  // o ponto da tela (em px) está em cima do cubo?
  function hitTest(clientX, clientY) {
    const rect = canvas.getBoundingClientRect();
    if (clientY > rect.bottom || clientY < rect.top) return false;
    ndc.set(((clientX - rect.left) / rect.width) * 2 - 1, -((clientY - rect.top) / rect.height) * 2 + 1);
    raycaster.setFromCamera(ndc, camera);
    return raycaster.intersectObject(cube, true).length > 0;
  }

  const t0 = performance.now();
  let running = true;
  function tick() {
    if (!running) return;
    const t = (performance.now() - t0) / 1000;
    const s = state.scroll;
    const intro = state.intro;

    state.look.lerp(state.mouse, 0.05);
    tilt.rotation.y = state.look.x * 0.5 + state.spin + t * 0.08;
    tilt.rotation.x = -state.look.y * 0.35;

    // explode: as peças se afastam conforme o hero sai da tela
    if (!turning) {
      const spread = 1 + s * 0.9;
      cubies.forEach((c) => c.position.copy(c.userData.home).multiplyScalar(spread));
    }

    root.position.set(layout.x, layout.y - (1 - intro) * 3 + s * 2.2 + Math.sin(t * 1.2) * 0.06, 0);
    root.rotation.z = (1 - intro) * 0.6;
    root.rotation.x = s * 0.8;
    root.scale.setScalar(layout.scale * (0.4 + intro * 0.6) * state.punch * (1 - s * 0.2));

    renderer.render(scene, camera);
    requestAnimationFrame(tick);
  }
  tick();

  new IntersectionObserver(([entry]) => {
    const was = running;
    running = entry.isIntersecting;
    if (running && !was) tick();
  }).observe(canvas);

  // x/y de -1 a 1 (posição do mouse na janela); quem chama é o HeroController
  const setPointer = (x, y) => state.mouse.set(x, y);

  // state.scroll (0→1) e state.intro (0→1) são animados pelos controllers
  return { state, hitTest, poke, setPointer };
}
