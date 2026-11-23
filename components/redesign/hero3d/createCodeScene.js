/*
 * "Code → Product" — the hero scene.
 *
 * Thousands of glowing code glyphs ({ } < / > ; = …) orbit a glass core like
 * a galaxy. On cue they fly together and assemble a floating product — an app
 * window with header, sidebar, chart and text, a phone, a KPI card and a
 * call-to-action — then dissolve back into code. Every glyph is one point in a
 * single THREE.Points draw call; the cloud orbit, the assembly and the pointer
 * field all run on the GPU, so the CPU only eases a few uniforms per frame.
 *
 * Handling (wired by HeroScene.jsx through the returned API):
 *   pointer  — glyphs part around the cursor; a light follows it on the core
 *   drag     — spins the object with inertia; it springs back to its pose
 *   click    — toggles code ↔ product
 *   scroll   — setScatter(0..1) blows the glyphs outward as the hero leaves
 *
 * No post-processing: the glow comes from additive, soft-edged glyph sprites,
 * which keeps the canvas transparent and the frame budget small.
 */

import { SCREENS, drawScreen } from './uiTextures';
import { GL_OPTIONS } from '../perf';

const GLYPHS = ['{', '}', '<', '>', '/', ';', '=', '(', ')', '[', ']', '0', '1', '#', '*', ''];
const ATLAS = 4; // 4×4 cells, last cell is a soft dot

function makeAtlas(THREE) {
  const cell = 128;
  const c = document.createElement('canvas');
  c.width = c.height = cell * ATLAS;
  const g = c.getContext('2d');
  g.textAlign = 'center';
  g.textBaseline = 'middle';
  g.font = '700 92px ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace';
  g.fillStyle = '#fff';
  GLYPHS.forEach((ch, i) => {
    const x = (i % ATLAS) * cell + cell / 2;
    const y = Math.floor(i / ATLAS) * cell + cell / 2;
    if (ch) {
      g.fillText(ch, x, y + 4);
    } else {
      const grd = g.createRadialGradient(x, y, 0, x, y, cell / 2);
      grd.addColorStop(0, 'rgba(255,255,255,1)');
      grd.addColorStop(0.25, 'rgba(255,255,255,0.65)');
      grd.addColorStop(1, 'rgba(255,255,255,0)');
      g.fillStyle = grd;
      g.fillRect(x - cell / 2, y - cell / 2, cell, cell);
      g.fillStyle = '#fff';
    }
  });
  const tex = new THREE.CanvasTexture(c);
  tex.flipY = false;
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

function makeHalo(THREE) {
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const g = c.getContext('2d');
  const grd = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  grd.addColorStop(0, 'rgba(120,200,255,0.9)');
  grd.addColorStop(0.35, 'rgba(40,120,255,0.35)');
  grd.addColorStop(1, 'rgba(10,40,140,0)');
  g.fillStyle = grd;
  g.fillRect(0, 0, 128, 128);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

// deterministic random so the composition is identical on every load
function rng(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/*
 * The product, as shapes the glyphs settle onto. Units: the window is 3.6 wide.
 * line: [x1,y1,x2,y2,z] (edge, dense)   fill: [x,y,w,h,z] (area, lighter)
 */
function productShapes() {
  const lines = [];
  const fills = [];
  const rect = (x, y, w, h, z) => {
    lines.push([x, y, x + w, y, z], [x + w, y, x + w, y + h, z], [x + w, y + h, x, y + h, z], [x, y + h, x, y, z]);
  };
  // main app window
  rect(-1.8, -1.25, 3.6, 2.5, 0);
  lines.push([-1.8, 0.95, 1.8, 0.95, 0]); // header divider
  fills.push([-1.68, 1.04, 0.1, 0.1, 0], [-1.5, 1.04, 0.1, 0.1, 0], [-1.32, 1.04, 0.1, 0.1, 0]); // window dots
  lines.push([-1.15, -1.25, -1.15, 0.95, 0]); // sidebar edge
  for (let i = 0; i < 5; i += 1) fills.push([-1.66, 0.7 - i * 0.28, 0.38, 0.07, 0]); // sidebar items
  // chart
  const bars = [0.45, 0.8, 0.6, 1.05, 0.75, 1.3, 0.95];
  bars.forEach((h, i) => fills.push([-0.92 + i * 0.27, -1.05, 0.16, h, 0.02]));
  lines.push([-0.98, -1.06, 0.95, -1.06, 0.02]);
  // text rows on the right
  for (let i = 0; i < 6; i += 1) fills.push([1.08, 0.72 - i * 0.24, i % 2 ? 0.42 : 0.58, 0.06, 0]);
  // KPI card floating in front
  rect(0.95, -1.75, 1.35, 0.8, 0.75);
  fills.push([1.08, -1.32, 0.55, 0.16, 0.75], [1.08, -1.6, 1.05, 0.06, 0.75]);
  // phone floating behind
  rect(-2.55, -0.2, 0.82, 1.55, -0.65);
  for (let i = 0; i < 4; i += 1) fills.push([-2.43, 1.05 - i * 0.3, 0.58, 0.1, -0.65]);
  // call-to-action pill
  rect(-0.35, -1.62, 1.1, 0.3, 0.45);
  fills.push([-0.3, -1.58, 1.0, 0.22, 0.45]);
  return { lines, fills };
}

function sampleProduct(count, rand, mirror) {
  const { lines, fills } = productShapes();
  const items = [
    ...lines.map((l) => ({ kind: 'l', d: l, w: Math.hypot(l[2] - l[0], l[3] - l[1]) * 1.0 })),
    ...fills.map((f) => ({ kind: 'f', d: f, w: f[2] * f[3] * 2.6 + 0.02 })),
  ];
  const total = items.reduce((s, it) => s + it.w, 0);
  const out = new Float32Array(count * 3);
  let acc = 0;
  const cum = items.map((it) => (acc += it.w / total));
  for (let i = 0; i < count; i += 1) {
    const r = rand();
    let k = cum.findIndex((c) => r <= c);
    if (k < 0) k = items.length - 1;
    const it = items[k];
    let x;
    let y;
    let z;
    if (it.kind === 'l') {
      const t = rand();
      const [x1, y1, x2, y2, zz] = it.d;
      x = x1 + (x2 - x1) * t;
      y = y1 + (y2 - y1) * t;
      z = zz;
    } else {
      const [fx, fy, fw, fh, zz] = it.d;
      x = fx + rand() * fw;
      y = fy + rand() * fh;
      z = zz;
    }
    out[i * 3] = (mirror ? -x : x) + (rand() - 0.5) * 0.02;
    out[i * 3 + 1] = y + (rand() - 0.5) * 0.02;
    out[i * 3 + 2] = z + (rand() - 0.5) * 0.03;
  }
  return out;
}

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uMix;
  uniform float uIntro;
  uniform float uScatter;
  uniform vec2 uPointer;
  uniform float uPointerAmt;
  uniform float uAspect;
  uniform float uSize;
  uniform float uPixelRatio;
  attribute vec3 aCloud;   // radius, angle, height
  attribute vec3 aTarget;
  attribute float aGlyph;
  attribute float aSeed;
  attribute float aSize;
  varying float vGlyph;
  varying float vMix;
  varying float vSeed;
  varying float vBoost;
  varying float vFade;

  void main() {
    float r = aCloud.x;
    float ang = aCloud.y + uTime * (0.42 / (0.5 + r));
    vec3 cloud = vec3(cos(ang) * r, aCloud.z + sin(uTime * 0.7 + aSeed * 6.2831) * 0.07, sin(ang) * r);
    cloud *= uIntro;

    // staggered assembly: each glyph leaves at its own moment
    float d = clamp(uMix * 1.7 - aSeed * 0.7, 0.0, 1.0);
    d = d * d * (3.0 - 2.0 * d);
    vec3 p = mix(cloud, aTarget, d);
    // in flight the glyphs arc instead of travelling in straight lines
    p.z += sin(d * 3.14159) * (0.9 + aSeed * 0.8);
    p += normalize(p + vec3(0.0001)) * uScatter * (2.5 + aSeed * 4.0);

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    vec4 clip = projectionMatrix * mv;
    vec2 ndc = clip.xy / clip.w;
    vec2 dv = (ndc - uPointer) * vec2(uAspect, 1.0);
    float dist = length(dv);
    float f = smoothstep(0.42, 0.0, dist) * uPointerAmt;
    mv.xy += normalize(dv + 1e-4) * f * (0.55 - 0.3 * d);

    gl_Position = projectionMatrix * mv;
    gl_PointSize = aSize * uSize * uPixelRatio * (1.0 + f * 0.9) / -mv.z;
    vGlyph = aGlyph;
    vMix = d;
    vSeed = aSeed;
    vBoost = f;
    vFade = 1.0 - uScatter;
  }
`;

const fragmentShader = /* glsl */ `
  uniform sampler2D uAtlas;
  uniform vec3 uColA;
  uniform vec3 uColB;
  uniform vec3 uColHot;
  uniform float uLight;
  varying float vGlyph;
  varying float vMix;
  varying float vSeed;
  varying float vBoost;
  varying float vFade;

  void main() {
    float col = mod(vGlyph, 4.0);
    float row = floor(vGlyph / 4.0);
    vec2 uv = (vec2(col, row) + gl_PointCoord) / 4.0;
    float a = texture2D(uAtlas, uv).a;
    if (a < 0.02) discard;
    vec3 c = mix(uColA, uColB, vSeed);
    c = mix(c, uColHot, vMix * 0.55 + vBoost * 0.6);
    float alpha = a * (0.42 + 0.58 * vMix + vBoost * 0.4) * vFade;
    // on paper, normal blending needs more ink to read as clearly as light on black
    alpha = min(1.0, alpha * (1.0 + uLight * 0.9));
    alpha *= 1.0 - smoothstep(0.82, 1.0, vMix) * 0.82;
    gl_FragColor = vec4(c, alpha);
  }
`;

export function createCodeScene(THREE, host, options) {
  const { gsap, mirror = false, light = false, reduced = false, mobile = false, RoomEnvironment } = options;

  let renderer;
  try {
    // Hardware only: without a GPU the scene falls back to the CSS glow (see GL_OPTIONS).
    renderer = new THREE.WebGLRenderer(GL_OPTIONS);
  } catch {
    return null;
  }
  if (!renderer.getContext()) return null;
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  host.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 80);
  camera.position.set(0, 0, 10);

  if (RoomEnvironment) {
    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    pmrem.dispose();
  }

  const object = new THREE.Group();
  scene.add(object);

  // --- glyph cloud -----------------------------------------------------------
  const COUNT = mobile ? 1300 : 3200;
  const rand = rng(1313);
  const aCloud = new Float32Array(COUNT * 3);
  const aGlyph = new Float32Array(COUNT);
  const aSeed = new Float32Array(COUNT);
  const aSize = new Float32Array(COUNT);
  for (let i = 0; i < COUNT; i += 1) {
    const shell = rand() < 0.18;
    const r = shell ? 0.95 + rand() * 0.35 : 1.35 + Math.pow(rand(), 0.7) * 2.3;
    aCloud[i * 3] = r;
    aCloud[i * 3 + 1] = rand() * Math.PI * 2;
    aCloud[i * 3 + 2] = (rand() - 0.5) * (shell ? 1.8 : 0.5 + r * 0.22);
    const dot = rand() < 0.22;
    aGlyph[i] = dot ? 15 : Math.floor(rand() * 15);
    aSeed[i] = rand();
    aSize[i] = dot ? 0.6 + rand() * 0.8 : 0.9 + rand() * 0.9;
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(COUNT * 3), 3));
  geometry.setAttribute('aCloud', new THREE.BufferAttribute(aCloud, 3));
  geometry.setAttribute('aTarget', new THREE.BufferAttribute(sampleProduct(COUNT, rng(77), mirror), 3));
  geometry.setAttribute('aGlyph', new THREE.BufferAttribute(aGlyph, 1));
  geometry.setAttribute('aSeed', new THREE.BufferAttribute(aSeed, 1));
  geometry.setAttribute('aSize', new THREE.BufferAttribute(aSize, 1));
  geometry.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 12);

  const atlas = makeAtlas(THREE);
  const uniforms = {
    uTime: { value: 0 },
    uMix: { value: reduced ? 1 : 0 },
    uIntro: { value: reduced ? 1 : 0 },
    uScatter: { value: 0 },
    uPointer: { value: new THREE.Vector2(9, 9) },
    uPointerAmt: { value: 0 },
    uAspect: { value: 1 },
    uSize: { value: mobile ? 64 : 78 },
    uPixelRatio: { value: 1 },
    uAtlas: { value: atlas },
    uColA: { value: new THREE.Color() },
    uColB: { value: new THREE.Color() },
    uColHot: { value: new THREE.Color() },
    uLight: { value: 0 },
  };
  const material = new THREE.ShaderMaterial({
    uniforms,
    vertexShader,
    fragmentShader,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  const points = new THREE.Points(geometry, material);
  points.frustumCulled = false;
  object.add(points);

  // --- product screens: crisp, high-res UI the glyphs hand over to ------------------
  const screens = new THREE.Group();
  const maxAniso = renderer.capabilities.getMaxAnisotropy();
  const texScale = mobile ? 0.6 : 1;
  const screenMeshes = SCREENS.map(([draw, w, h, x, y, z]) => {
    const mat = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false, toneMapped: false, side: THREE.DoubleSide });
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(w, h), mat);
    mesh.position.set(mirror ? -x : x, y, z);
    mesh.userData.draw = draw;
    screens.add(mesh);
    return mesh;
  });
  function paintScreens(isLight) {
    screenMeshes.forEach((mesh) => {
      const tex = new THREE.CanvasTexture(drawScreen(mesh.userData.draw, { scale: texScale, light: isLight, rtl: mirror }));
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.anisotropy = maxAniso;
      tex.minFilter = THREE.LinearMipmapLinearFilter;
      tex.generateMipmaps = true;
      mesh.material.map?.dispose();
      mesh.material.map = tex;
      mesh.material.needsUpdate = true;
    });
  }
  screens.renderOrder = 0;
  points.renderOrder = 1;
  object.add(screens);
  // soft light behind the assembled product
  const backGlow = new THREE.Sprite(new THREE.SpriteMaterial({ transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0 }));
  backGlow.scale.set(7.5, 5.5, 1);
  backGlow.position.z = -0.8;
  object.add(backGlow);

  // --- glass core ----------------------------------------------------------------
  const core = new THREE.Group();
  const glass = new THREE.Mesh(
    new THREE.IcosahedronGeometry(0.78, 0),
    // a faceted blue crystal: reflective, lit from inside, slightly see-through
    new THREE.MeshPhysicalMaterial({
      color: 0x2a6bff,
      emissive: 0x0a3bd0,
      emissiveIntensity: 0.55,
      metalness: 0.35,
      roughness: 0.12,
      clearcoat: 1,
      clearcoatRoughness: 0.04,
      iridescence: 0.6,
      iridescenceIOR: 1.6,
      envMapIntensity: 2.2,
      flatShading: true,
      transparent: true,
      opacity: 0.82,
    }),
  );
  core.add(glass);
  const wire = new THREE.LineSegments(
    new THREE.WireframeGeometry(new THREE.IcosahedronGeometry(0.46, 1)),
    new THREE.LineBasicMaterial({ color: 0x6fd0ff, transparent: true, opacity: 0.85, blending: THREE.AdditiveBlending, depthWrite: false }),
  );
  core.add(wire);
  const haloTex = makeHalo(THREE);
  const halo = new THREE.Sprite(new THREE.SpriteMaterial({ map: haloTex, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
  backGlow.material.map = haloTex;
  backGlow.material.needsUpdate = true;
  halo.scale.setScalar(3.6);
  core.add(halo);
  object.add(core);

  const key = new THREE.PointLight(0x5fb4ff, 30, 12, 1.6);
  key.position.set(2, 2, 4);
  scene.add(key);
  scene.add(new THREE.AmbientLight(0x6688ff, 0.4));

  // --- theme -----------------------------------------------------------------
  function setLight(isLight) {
    uniforms.uLight.value = isLight ? 1 : 0;
    if (isLight) {
      uniforms.uColA.value.set('#1d5cf5');
      uniforms.uColB.value.set('#0a2a8c');
      uniforms.uColHot.value.set('#0778c9');
      material.blending = THREE.NormalBlending;
      halo.material.opacity = 0.45;
      wire.material.color.set('#1d5cf5');
      wire.material.blending = THREE.NormalBlending;
    } else {
      uniforms.uColA.value.set('#2f7bff');
      uniforms.uColB.value.set('#45adff');
      uniforms.uColHot.value.set('#bfe8ff');
      material.blending = THREE.AdditiveBlending;
      halo.material.opacity = 1;
      wire.material.color.set('#6fd0ff');
      wire.material.blending = THREE.AdditiveBlending;
    }
    paintScreens(isLight);
    material.needsUpdate = true;
    wire.material.needsUpdate = true;
    requestRender();
  }

  // --- motion state ------------------------------------------------------------
  const sign = mirror ? -1 : 1;
  const POSE = { yaw: -0.38 * sign, pitch: 0.14 };
  const st = {
    yaw: POSE.yaw,
    pitch: POSE.pitch,
    vy: 0,
    drag: false,
    px: 9,
    py: 9,
    tpx: 9,
    tpy: 9,
    amt: 0,
    tamt: 0,
    lastInput: -1e9,
  };

  // --- size & loop -----------------------------------------------------------
  function resize() {
    const w = host.clientWidth;
    const h = host.clientHeight;
    if (!w || !h) return;
    const dpr = Math.min(window.devicePixelRatio || 1, mobile ? 1.6 : 2);
    renderer.setPixelRatio(dpr);
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    // keep the whole product (≈5.6 units wide, 4 tall) in frame at any aspect
    const fitH = 3.7 / (2 * Math.tan((camera.fov * Math.PI) / 360));
    const fitW = 4.9 / (2 * Math.tan((camera.fov * Math.PI) / 360) * camera.aspect);
    camera.position.z = Math.max(fitH, fitW);
    camera.updateProjectionMatrix();
    uniforms.uAspect.value = camera.aspect;
    uniforms.uPixelRatio.value = dpr;
    requestRender();
  }

  let running = false;
  let last = performance.now();
  let visible = true;
  function frame(now) {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    const k = dt * 60;
    uniforms.uTime.value += dt;

    // rotation: inertia while free, then a soft spring back to the pose + sway
    if (!st.drag) {
      st.yaw += st.vy * k;
      st.vy *= Math.pow(0.94, k);
      if (Math.abs(st.vy) < 0.0008) {
        const sway = Math.sin(uniforms.uTime.value * 0.35) * 0.12;
        st.yaw += (POSE.yaw + sway - st.yaw) * 0.018 * k;
        st.pitch += (POSE.pitch - st.pitch) * 0.025 * k;
      }
    }
    object.rotation.y = st.yaw;
    object.rotation.x = st.pitch;

    // pointer field eases in and follows smoothly
    st.px += (st.tpx - st.px) * 0.12 * k;
    st.py += (st.tpy - st.py) * 0.12 * k;
    st.amt += (st.tamt - st.amt) * 0.08 * k;
    uniforms.uPointer.value.set(st.px, st.py);
    uniforms.uPointerAmt.value = st.amt;
    key.position.set(st.px * 4, st.py * 3, 3.5);

    // the core turns, and shrinks back behind the product when it assembles
    const m = uniforms.uMix.value;
    core.rotation.y += 0.004 * k;
    core.rotation.x += 0.0025 * k;
    wire.rotation.y -= 0.009 * k;
    core.scale.setScalar(Math.max(0.001, 1 - m * 0.97) + Math.sin(uniforms.uTime.value * 1.6) * 0.015 * (1 - m));
    core.position.z = -m * 0.9;
    const landed = Math.min(1, Math.max(0, (m - 0.72) / 0.28));
    const show = landed * landed * (3 - 2 * landed) * (1 - uniforms.uScatter.value);
    screenMeshes.forEach((mesh) => {
      mesh.material.opacity = show;
      mesh.visible = show > 0.002;
    });
    backGlow.material.opacity = show * (uniforms.uLight.value ? 0 : 0.55);

    renderer.render(scene, camera);
  }
  function start() {
    if (running || reduced || !visible || document.hidden) return;
    running = true;
    last = performance.now();
    renderer.setAnimationLoop(frame);
  }
  function stop() {
    running = false;
    renderer.setAnimationLoop(null);
  }
  function requestRender() {
    if (!running) frame(performance.now());
  }

  // --- choreography: assemble → hold → dissolve → hold, looping ------------------
  let loop = null;
  let resumeCall = null;
  function playLoop(delay = 0) {
    loop?.kill();
    if (reduced) return;
    loop = gsap.timeline({ repeat: -1, delay });
    loop
      .to(uniforms.uMix, { value: 1, duration: 2.2, ease: 'power3.inOut' })
      .to(uniforms.uMix, { value: 0, duration: 1.9, ease: 'power3.inOut' }, '+=5.2')
      .to({}, { duration: 3.4 });
  }
  function toggle() {
    loop?.kill();
    resumeCall?.kill();
    const to = uniforms.uMix.value > 0.5 ? 0 : 1;
    gsap.to(uniforms.uMix, { value: to, duration: 1.8, ease: 'power3.inOut', overwrite: true });
    // hand control back to the loop after a quiet spell
    resumeCall = gsap.delayedCall(10, () => playLoop(0));
  }

  const ro = new ResizeObserver(resize);
  ro.observe(host);
  const io = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible) start();
    else stop();
  });
  io.observe(host);
  const onVisibility = () => (document.hidden ? stop() : start());
  document.addEventListener('visibilitychange', onVisibility);

  setLight(light);
  resize();
  start();

  return {
    intro() {
      if (reduced) {
        requestRender();
        return;
      }
      gsap.fromTo(uniforms.uIntro, { value: 0 }, { value: 1, duration: 2.2, ease: 'expo.out' });
      playLoop(1.1);
    },
    toggle,
    setLight,
    // jump to a state (0 = code cloud, 1 = product); stops the auto loop
    setMix(v) {
      loop?.kill();
      resumeCall?.kill();
      gsap.killTweensOf(uniforms.uMix);
      uniforms.uMix.value = v;
      uniforms.uIntro.value = 1;
      requestRender();
    },
    setScatter(v) {
      uniforms.uScatter.value = v;
      requestRender();
    },
    pointer(nx, ny, active) {
      if (reduced) return;
      st.tpx = nx;
      st.tpy = ny;
      st.tamt = active ? 1 : 0;
      st.lastInput = performance.now();
    },
    dragBy(dx, dy) {
      st.drag = true;
      const step = dx * 0.006 * sign;
      st.yaw += step;
      st.vy = step;
      st.pitch = Math.min(0.7, Math.max(-0.45, st.pitch + dy * 0.004));
      if (!running) requestRender();
    },
    dragEnd() {
      st.drag = false;
      if (reduced) st.vy = 0;
    },
    dispose() {
      stop();
      loop?.kill();
      resumeCall?.kill();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      geometry.dispose();
      material.dispose();
      atlas.dispose();
      screenMeshes.forEach((mesh) => {
        mesh.geometry.dispose();
        mesh.material.map?.dispose();
        mesh.material.dispose();
      });
      backGlow.material.dispose();
      glass.geometry.dispose();
      glass.material.dispose();
      wire.geometry.dispose();
      wire.material.dispose();
      halo.material.map.dispose();
      halo.material.dispose();
      scene.environment?.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    },
  };
}
