import * as THREE from "three";
import gsap from "gsap";
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

// "Estúdio" de reflexo barato: um gradiente 128x64 com duas janelas de luz suaves.
// Antes era um RoomEnvironment 3D renderizado em 6 direções (custava ~1,7 s pra gerar).
function makeStudioTexture() {
  const c = document.createElement("canvas");
  c.width = 128;
  c.height = 64;
  const g = c.getContext("2d");
  const sky = g.createLinearGradient(0, 0, 0, 64);
  sky.addColorStop(0, "#ffffff");
  sky.addColorStop(0.45, "#e9e2d6");
  sky.addColorStop(1, "#2a2622");
  g.fillStyle = sky;
  g.fillRect(0, 0, 128, 64);
  for (const [x, y, r] of [
    [34, 18, 16],
    [92, 22, 12],
  ]) {
    const light = g.createRadialGradient(x, y, 0, x, y, r);
    light.addColorStop(0, "rgba(255,255,255,1)");
    light.addColorStop(1, "rgba(255,255,255,0)");
    g.fillStyle = light;
    g.fillRect(0, 0, 128, 64);
  }
  const tex = new THREE.CanvasTexture(c);
  tex.mapping = THREE.EquirectangularReflectionMapping;
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

// O aparelho desenha 3D sem placa de vídeo (no processador)? Ex.: SwiftShader, llvmpipe.
// Nesse caso o cubo entra em modo mínimo, senão trava a página por vários segundos.
function hasSoftwareGL() {
  try {
    const gl = document.createElement("canvas").getContext("webgl");
    if (!gl) return true;
    const info = gl.getExtension("WEBGL_debug_renderer_info");
    const name = info ? gl.getParameter(info.UNMASKED_RENDERER_WEBGL) : "";
    gl.getExtension("WEBGL_lose_context")?.loseContext();
    return /swiftshader|llvmpipe|software|basic render/i.test(name);
  } catch {
    return true;
  }
}

// opções:
//   state: objeto compartilhado com o controller (scroll e intro de 0→1)
//   lite:  modo leve pra celular (sem sombras, resolução menor, 30 fps)
// modo mínimo (automático, sem placa de vídeo): sem reflexos/sombras e só desenha quando algo muda
export function createRubikCube(canvas, { reduceMotion = false, state: shared = {}, lite = false } = {}) {
  const minimal = hasSoftwareGL();
  if (minimal) lite = true;
  const still = reduceMotion || minimal; // sem movimento contínuo

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: !minimal, alpha: true });
  renderer.setPixelRatio(minimal ? 1 : Math.min(window.devicePixelRatio, lite ? 1.5 : 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  // no site publicado não precisa checar erro de shader (essa checagem força o navegador a esperar)
  renderer.debug.checkShaderErrors = import.meta.env.DEV;
  renderer.shadowMap.enabled = !lite;
  renderer.shadowMap.type = THREE.PCFShadowMap;

  const scene = new THREE.Scene();
  // reflexo suave do "estúdio" nos adesivos (desligado sem placa de vídeo)
  const studio = minimal ? null : makeStudioTexture();
  scene.add(new THREE.AmbientLight("#ffffff", minimal ? 0.9 : 0.35));

  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 50);
  camera.position.set(0, 0, 11);

  scene.add(new THREE.HemisphereLight("#ffffff", "#d9cfc0", 0.8));
  const key = new THREE.DirectionalLight("#fff6ea", 2.2);
  key.position.set(-4, 6, 6);
  key.castShadow = !lite;
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

  const bodyGeo = new RoundedBoxGeometry(0.96, 0.96, 0.96, minimal ? 2 : 4, 0.12);
  // Phong = plástico brilhante clássico. Shader bem menor que o PBR (Standard/Physical),
  // compila rápido até em celular fraco — antes a compilação travava a página por ~1,5 s
  const bodyMat = new THREE.MeshPhongMaterial({ color: "#141414", specular: "#3a3a3a", shininess: 40 });
  const stickerGeo = new THREE.ShapeGeometry(roundedRectShape(0.8, 0.14), 6);
  const stickerMats = Object.fromEntries(
    Object.entries(FACE_COLORS).map(([k, c]) => [
      k,
      new THREE.MeshPhongMaterial({
        color: c,
        specular: "#5a5a5a",
        shininess: 90,
        envMap: studio,
        reflectivity: 0.12,
        combine: THREE.MixOperation,
      }),
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
  // usa o objeto do controller: assim a intro/scroll funcionam mesmo antes do cubo carregar
  const state = Object.assign(shared, {
    mouse: new THREE.Vector2(),
    look: new THREE.Vector2(),
    scroll: shared.scroll ?? 0,
    intro: shared.intro ?? 0,
    spin: 0,
    punch: 1,
  });

  // Loop sozinho: embaralha devagar e, depois de alguns movimentos, se resolve
  let cooldown = 2;
  setInterval(() => {
    if (still || pending > 0 || state.scroll > 0.02 || document.hidden) return;
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
  function resize(w, h) {
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
  // ResizeObserver entrega o tamanho sem forçar o navegador a recalcular o layout
  new ResizeObserver(([entry]) => resize(entry.contentRect.width, entry.contentRect.height)).observe(canvas);

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
  let frame = 0;
  let lastKey = "";
  function tick() {
    if (!running) return;
    const t = (performance.now() - t0) / 1000;
    const s = state.scroll;
    const intro = state.intro;

    state.look.lerp(state.mouse, 0.05);
    const idle = still ? 0 : t; // giro lento e flutuação só com placa de vídeo
    tilt.rotation.y = state.look.x * 0.5 + state.spin + idle * 0.08;
    tilt.rotation.x = -state.look.y * 0.35;

    // explode: as peças se afastam conforme o hero sai da tela
    if (!turning) {
      const spread = 1 + s * 0.9;
      cubies.forEach((c) => c.position.copy(c.userData.home).multiplyScalar(spread));
    }

    root.position.set(layout.x, layout.y - (1 - intro) * 3 + s * 2.2 + Math.sin(idle * 1.2) * 0.06, 0);
    root.rotation.z = (1 - intro) * 0.6;
    root.rotation.x = s * 0.8;
    root.scale.setScalar(layout.scale * (0.4 + intro * 0.6) * state.punch * (1 - s * 0.2));

    // no modo leve desenha 1 quadro sim, 1 não (30 fps)
    if (minimal) {
      // só redesenha quando algo mudou (intro, scroll, mouse, clique, camada girando)
      const sig = `${intro.toFixed(3)}|${s.toFixed(3)}|${state.look.x.toFixed(3)}|${state.look.y.toFixed(3)}|${state.spin.toFixed(2)}|${state.punch.toFixed(3)}|${turning}|${camera.aspect}`;
      if (sig !== lastKey) renderer.render(scene, camera);
      lastKey = sig;
    } else if (!lite || (frame++ & 1) === 0) renderer.render(scene, camera);
    requestAnimationFrame(tick);
  }

  // compila os shaders em segundo plano (sem travar a página) e só então começa a desenhar
  let ready = false;
  renderer
    .compileAsync(scene, camera)
    .catch(() => {})
    .then(() => {
      ready = true;
      if (running) tick();
    });

  new IntersectionObserver(([entry]) => {
    const was = running;
    running = entry.isIntersecting;
    if (ready && running && !was) tick();
  }).observe(canvas);

  // x/y de -1 a 1 (posição do mouse na janela); quem chama é o HeroController
  const setPointer = (x, y) => state.mouse.set(x, y);

  // state.scroll (0→1) e state.intro (0→1) são animados pelos controllers
  return { state, hitTest, poke, setPointer };
}
