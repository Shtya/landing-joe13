/*
 * The JOE13 ribbon — one continuous WebGL band that runs through every slide
 * and re-forms into a new shape per slide (the "J" of the mark on the intro,
 * a ring around the platforms, a trajectory under the process, ...).
 *
 * Cheap by design: one mesh of (SEG+1)*2 vertices. Every shape is pre-built
 * with the same vertex layout, so a morph is just mixing two attribute sets
 * on the GPU, staggered along the ribbon so it appears to flow into place.
 */

import { SHAPES } from './shapes';

const SEG = 280;

const vertexShader = /* glsl */ `
  uniform float uMorph;
  uniform float uTime;
  uniform float uFlow;
  attribute vec3 aFrom;
  attribute vec3 aTo;
  attribute vec3 nFrom;
  attribute vec3 nTo;
  attribute float aT;
  attribute float aSide;
  varying float vT;
  varying float vSide;
  varying float vDepth;
  varying vec3 vN;
  varying vec3 vView;

  void main() {
    float k = clamp(uMorph * 1.7 - aT * 0.7, 0.0, 1.0);
    k = k * k * (3.0 - 2.0 * k);
    vec3 p = mix(aFrom, aTo, k);
    vec3 n = normalize(mix(nFrom, nTo, k) + vec3(0.0001));

    p += n * sin(aT * 13.0 + uTime * 0.9) * 0.045 * uFlow;
    p.y += sin(aT * 5.0 + uTime * 0.45) * 0.035 * uFlow;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    vN = normalize(normalMatrix * n);
    vView = normalize(-mv.xyz);
    vT = aT;
    vSide = aSide;
    vDepth = p.z;
    gl_Position = projectionMatrix * mv;
  }
`;

const fragmentShader = /* glsl */ `
  uniform float uTime;
  uniform float uReveal;
  uniform float uLight;
  uniform float uPulse;
  uniform float uPulsePos;
  uniform float uBoost;
  uniform vec3 cDeep;
  uniform vec3 cCobalt;
  uniform vec3 cCyan;
  uniform vec3 cViolet;
  varying float vT;
  varying float vSide;
  varying float vDepth;
  varying vec3 vN;
  varying vec3 vView;

  void main() {
    if (vT > uReveal) discard;
    vec3 n = normalize(vN);
    if (!gl_FrontFacing) n = -n;
    float facing = abs(dot(n, vView));
    float fres = pow(1.0 - facing, 2.4);

    vec3 base = mix(cCobalt, cCyan, smoothstep(0.1, 1.0, vT * 0.8 + 0.25 + 0.18 * sin(uTime * 0.21 + vT * 3.0)));
    base = mix(cDeep, base, 0.28 + 0.72 * facing);

    float edge = smoothstep(0.78, 1.0, abs(vSide));
    float band = fract(vT * 1.3 - uTime * 0.06);
    float sheen = exp(-pow((band - 0.5) * 18.0, 2.0));

    vec3 col = base;
    col += edge * vec3(0.55, 0.82, 1.0) * (0.55 - uLight * 0.25);
    col += sheen * vec3(0.65, 0.88, 1.0) * (0.55 - uLight * 0.3) * (0.4 + 0.6 * facing);
    col += fres * cViolet * 0.35;

    // energy pulse that races along the band on every scene change
    float wave = exp(-pow((vT - uPulsePos) * 12.0, 2.0)) * uPulse;
    col += wave * vec3(0.75, 0.95, 1.0) * (1.4 - uLight * 0.5);
    // pointer energy brightens the sheen
    col += sheen * uBoost * vec3(0.3, 0.6, 1.0) * 0.6;

    float head = smoothstep(uReveal - 0.035, uReveal, vT);
    col += head * vec3(0.7, 0.92, 1.0) * step(uReveal, 0.999);

    float alpha = smoothstep(0.0, 0.05, vT) * smoothstep(1.0, 0.93, vT);
    alpha *= clamp(1.0 + vDepth * 0.16, 0.22, 1.0);
    gl_FragColor = vec4(col, alpha);
  }
`;

function smooth(e0, e1, x) {
  const t = Math.min(1, Math.max(0, (x - e0) / (e1 - e0)));
  return t * t * (3 - 2 * t);
}

export function createRibbon(THREE, host, options) {
  const { ids, index = 0, mirror = false, light = false, reduced = false, gsap } = options;

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
  } catch (err) {
    return null;
  }
  if (!renderer.getContext()) return null;

  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  host.appendChild(renderer.domElement);
  renderer.domElement.setAttribute('aria-hidden', 'true');

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 60);
  camera.position.set(0, 0, 7);

  // --- ribbon geometry -----------------------------------------------------
  const count = (SEG + 1) * 2;
  const geometry = new THREE.BufferGeometry();
  const aFrom = new Float32Array(count * 3);
  const aTo = new Float32Array(count * 3);
  const nFrom = new Float32Array(count * 3);
  const nTo = new Float32Array(count * 3);
  const aT = new Float32Array(count);
  const aSide = new Float32Array(count);
  for (let i = 0; i <= SEG; i += 1) {
    aT[i * 2] = aT[i * 2 + 1] = i / SEG;
    aSide[i * 2] = -1;
    aSide[i * 2 + 1] = 1;
  }
  const idx = [];
  for (let i = 0; i < SEG; i += 1) {
    const a = i * 2;
    idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
  }
  geometry.setIndex(idx);
  // three needs a position attribute for bounds; aTo doubles as it.
  const fromAttr = new THREE.BufferAttribute(aFrom, 3);
  const toAttr = new THREE.BufferAttribute(aTo, 3);
  const nFromAttr = new THREE.BufferAttribute(nFrom, 3);
  const nToAttr = new THREE.BufferAttribute(nTo, 3);
  geometry.setAttribute('position', toAttr);
  geometry.setAttribute('aFrom', fromAttr);
  geometry.setAttribute('aTo', toAttr);
  geometry.setAttribute('nFrom', nFromAttr);
  geometry.setAttribute('nTo', nToAttr);
  geometry.setAttribute('aT', new THREE.BufferAttribute(aT, 1));
  geometry.setAttribute('aSide', new THREE.BufferAttribute(aSide, 1));

  const uniforms = {
    uMorph: { value: 1 },
    uTime: { value: 0 },
    uFlow: { value: reduced ? 0 : 1 },
    uReveal: { value: reduced ? 1.01 : 0 },
    uPulse: { value: 0 },
    uPulsePos: { value: -0.2 },
    uBoost: { value: 0 },
    uLight: { value: light ? 1 : 0 },
    cDeep: { value: new THREE.Color('#06123a') },
    cCobalt: { value: new THREE.Color('#1456ff') },
    cCyan: { value: new THREE.Color('#2ec5ff') },
    cViolet: { value: new THREE.Color('#7a4dff') },
  };
  const material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms,
    transparent: true,
    side: THREE.DoubleSide,
  });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.frustumCulled = false;
  scene.add(mesh);

  // --- dust: a few hundred points for depth --------------------------------
  const DUST = 360;
  const dustPos = new Float32Array(DUST * 3);
  for (let i = 0; i < DUST; i += 1) {
    dustPos[i * 3] = (Math.random() - 0.5) * 16;
    dustPos[i * 3 + 1] = (Math.random() - 0.5) * 9;
    dustPos[i * 3 + 2] = -Math.random() * 8 + 1;
  }
  const dustGeo = new THREE.BufferGeometry();
  dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
  const dustMat = new THREE.PointsMaterial({
    size: 0.022,
    color: light ? '#1456ff' : '#a9c2ff',
    transparent: true,
    opacity: light ? 0.35 : 0.5,
    depthWrite: false,
  });
  const dust = new THREE.Points(dustGeo, dustMat);
  scene.add(dust);

  // --- shapes ----------------------------------------------------------------
  let shapes = [];
  let current = index;
  let morphTween = null;

  function buildShape(def, halfW, halfH) {
    const pts = def.points.map(([u, v, z]) => new THREE.Vector3(u * halfW * (mirror ? -1 : 1), v * halfH, z));
    const curve = new THREE.CatmullRomCurve3(pts, false, 'centripetal');
    const frames = curve.computeFrenetFrames(SEG, false);
    const pos = new Float32Array(count * 3);
    const nor = new Float32Array(count * 3);
    const p = new THREE.Vector3();
    const side = new THREE.Vector3();
    const normal = new THREE.Vector3();
    // portrait screens: the band would dominate the copy, so it gets slimmer
    const width = (def.width ?? 0.34) * Math.max(0.5, Math.min(1, camera.aspect / 1.3));
    const twist = def.twist ?? 1;
    const phase = def.phase ?? 0;
    for (let i = 0; i <= SEG; i += 1) {
      const t = i / SEG;
      curve.getPointAt(t, p);
      const N = frames.normals[i];
      const B = frames.binormals[i];
      const T = frames.tangents[i];
      const a = phase + twist * Math.PI * 2 * t;
      side.copy(N).multiplyScalar(Math.cos(a)).addScaledVector(B, Math.sin(a));
      normal.crossVectors(T, side).normalize();
      const w = width * (0.25 + 0.75 * smooth(0, 0.12, t) * smooth(1, 0.86, t)) * 0.5;
      const o = i * 6;
      pos[o] = p.x - side.x * w;
      pos[o + 1] = p.y - side.y * w;
      pos[o + 2] = p.z - side.z * w;
      pos[o + 3] = p.x + side.x * w;
      pos[o + 4] = p.y + side.y * w;
      pos[o + 5] = p.z + side.z * w;
      nor[o] = nor[o + 3] = normal.x;
      nor[o + 1] = nor[o + 4] = normal.y;
      nor[o + 2] = nor[o + 5] = normal.z;
    }
    return { pos, nor };
  }

  function rebuildShapes() {
    const halfH = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.position.z;
    const halfW = halfH * camera.aspect;
    // On tall screens the ribbon sits behind content; keep it narrower.
    const wScale = camera.aspect < 1 ? 1.15 : 1;
    shapes = ids.map((id) => buildShape(SHAPES[id] ?? SHAPES.top, halfW * wScale, halfH));
  }

  /** CPU copy of the GPU blend, so an interrupted morph continues smoothly. */
  function snapshotInto(targetPos, targetNor) {
    const m = uniforms.uMorph.value;
    for (let i = 0; i < count; i += 1) {
      let k = Math.min(1, Math.max(0, m * 1.7 - aT[i] * 0.7));
      k = k * k * (3 - 2 * k);
      for (let c = 0; c < 3; c += 1) {
        const j = i * 3 + c;
        targetPos[j] = aFrom[j] + (aTo[j] - aFrom[j]) * k;
        targetNor[j] = nFrom[j] + (nTo[j] - nFrom[j]) * k;
      }
    }
  }

  function setInstant(i) {
    const s = shapes[i];
    aFrom.set(s.pos);
    aTo.set(s.pos);
    nFrom.set(s.nor);
    nTo.set(s.nor);
    fromAttr.needsUpdate = toAttr.needsUpdate = nFromAttr.needsUpdate = nToAttr.needsUpdate = true;
    uniforms.uMorph.value = 1;
  }

  function goTo(i) {
    if (i === current || !shapes[i]) return;
    current = i;
    morphTween?.kill();
    const tmpP = new Float32Array(count * 3);
    const tmpN = new Float32Array(count * 3);
    snapshotInto(tmpP, tmpN);
    aFrom.set(tmpP);
    nFrom.set(tmpN);
    aTo.set(shapes[i].pos);
    nTo.set(shapes[i].nor);
    fromAttr.needsUpdate = toAttr.needsUpdate = nFromAttr.needsUpdate = nToAttr.needsUpdate = true;
    uniforms.uMorph.value = 0;
    if (reduced) {
      uniforms.uMorph.value = 1;
      requestRender();
      return;
    }
    morphTween = gsap.to(uniforms.uMorph, { value: 1, duration: 1.9, ease: 'power3.inOut' });
    gsap.killTweensOf([uniforms.uPulse, uniforms.uPulsePos]);
    uniforms.uPulse.value = 1;
    uniforms.uPulsePos.value = -0.15;
    gsap.to(uniforms.uPulsePos, { value: 1.15, duration: 1.6, ease: 'power2.inOut' });
    gsap.to(uniforms.uPulse, { value: 0, duration: 0.6, delay: 1.1, ease: 'power1.in' });
  }

  // --- size & loop -----------------------------------------------------------
  function resize() {
    const w = host.clientWidth || window.innerWidth;
    const h = host.clientHeight || window.innerHeight;
    if (!w || !h) return; // hidden tab or zero-size host; the observer calls again
    const dprCap = w < 900 ? 1.25 : 1.75;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, dprCap));
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    rebuildShapes();
    setInstant(current);
    requestRender();
  }

  const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
  let lastPX = 0;
  let lastPY = 0;
  let energy = 0;
  function onPointer(e) {
    pointer.tx = (e.clientX / window.innerWidth) * 2 - 1;
    pointer.ty = (e.clientY / window.innerHeight) * 2 - 1;
    // fast pointer movement charges the band: it flows faster and shines
    const v = Math.hypot(e.clientX - lastPX, e.clientY - lastPY);
    lastPX = e.clientX;
    lastPY = e.clientY;
    energy = Math.min(1, energy + v / 900);
  }

  let last = performance.now();
  let running = false;
  function frame(now) {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    if (!reduced) {
      energy *= 0.95;
      uniforms.uBoost.value += (energy - uniforms.uBoost.value) * 0.08;
      uniforms.uTime.value += dt * (1 + uniforms.uBoost.value * 2.5);
      pointer.x += (pointer.tx - pointer.x) * 0.04;
      pointer.y += (pointer.ty - pointer.y) * 0.04;
      camera.position.x = pointer.x * 0.35;
      camera.position.y = -pointer.y * 0.22;
      camera.lookAt(0, 0, 0);
      dust.rotation.y += dt * 0.012;
      dust.position.y = Math.sin(uniforms.uTime.value * 0.1) * 0.15;
    }
    renderer.render(scene, camera);
  }
  function start() {
    if (running || reduced) return;
    running = true;
    last = performance.now();
    renderer.setAnimationLoop(frame);
  }
  function stop() {
    running = false;
    renderer.setAnimationLoop(null);
  }
  function requestRender() {
    if (!running) renderer.render(scene, camera);
  }
  function onVisibility() {
    if (document.hidden) stop();
    else start();
  }

  const ro = new ResizeObserver(resize);
  ro.observe(host);
  window.addEventListener('pointermove', onPointer, { passive: true });
  document.addEventListener('visibilitychange', onVisibility);
  resize();
  start();

  return {
    goTo,
    intro() {
      if (reduced) return null;
      uniforms.uReveal.value = 0;
      return gsap.to(uniforms.uReveal, { value: 1.01, duration: 2.6, ease: 'power2.inOut' });
    },
    setLight(isLight) {
      gsap.to(uniforms.uLight, { value: isLight ? 1 : 0, duration: 0.6, onUpdate: requestRender });
      dustMat.color.set(isLight ? '#1456ff' : '#a9c2ff');
      dustMat.opacity = isLight ? 0.35 : 0.5;
      requestRender();
    },
    dispose() {
      stop();
      morphTween?.kill();
      ro.disconnect();
      window.removeEventListener('pointermove', onPointer);
      document.removeEventListener('visibilitychange', onVisibility);
      geometry.dispose();
      material.dispose();
      dustGeo.dispose();
      dustMat.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    },
  };
}
