"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Play, RotateCcw } from "lucide-react";
import { useOsReducedMotion } from "@/lib/arjun-os/motion";
import { cn } from "@/utils/cn";

/*
 * The launch film's drone shot, live in the browser: the drone arrives at an angle, yaws round to face
 * you, comes forward with its nose dipped, and the camera dives into its gimbal lens, where the Fuji
 * footage opens out. Same flight model as the film (videos/film-launch/assets/stage3d.js): a pilot's
 * target eased through three moves, followed on damped springs integrated once at 240 Hz, with pitch and
 * bank taken from the airframe's own acceleration. Three.js and the 2.5 MB model load only on play.
 */

const W = 1920, H = 1080, FOV = 30, D = 20, PI = Math.PI;
const K = (2 * D * Math.tan((FOV / 2) * PI / 180)) / H; // world units per virtual pixel on the z = 0 plane
// Measured on the model: the body is square-on at ry 0.65; the gimbal's optical axis sits at 0.55.
const FACE = 0.65, LENS_AXIS = 0.55, QUARTER = PI / 4;
const PUSH = { a: 2.35, b: 4.17, dEnd: 0.17 };
const END = 4.25;
const LENS_LOCAL: [number, number, number] = [-0.111, -0.0335, 0.165];
const LENS_R = 0.009;

const E = {
  "power2.in": (p: number) => p * p,
  "power2.inOut": (p: number) => (p < 0.5 ? 2 * p * p : 1 - (-2 * p + 2) ** 2 / 2),
  "power1.inOut": (p: number) => -(Math.cos(PI * p) - 1) / 2,
};
const ramp = (t: number, a: number, b: number, ease: keyof typeof E = "power2.inOut") => E[ease](Math.max(0, Math.min(1, (t - a) / (b - a))));

/** The flight, solved once: position (virtual px), size, and yaw on springs. */
function solveFlight() {
  const target = (t: number) => {
    const fly = ramp(t, 0, 1.2), turn = ramp(t, 1.2, 1.75);
    // Coming forward: it spools up to cruising speed and keeps coming, so the dive picks it up mid-flight.
    const c = Math.max(0, t - 1.8), CRUISE = 620, SPOOL = 0.5;
    const come = c < SPOOL ? CRUISE * c * c / (2 * SPOOL) : CRUISE * (c - SPOOL / 2);
    const h = ramp(t, 1.15, 1.75) * (1 - ramp(t, 1.8, 2.25)), u = t - 1.15;
    return [
      2250 + (960 - 2250) * fly + h * 6 * Math.sin(u * 2 * PI * 0.55),
      1230 + (520 - 1230) * fly + 0.08 * come + h * 7 * Math.sin(u * 2 * PI * 0.9),
      420 + (760 - 420) * fly + come,
      FACE - QUARTER + QUARTER * turn,
    ];
  };
  const Wn = [7.2, 7.2, 7.2, 6.5], Z = [0.4, 0.4, 0.4, 0.55], dt = 1 / 240;
  let x = target(0), v = [0, 0, 0, 0];
  const n = Math.ceil(END / dt) + 1, X: number[][] = [], A: number[][] = [], V: number[][] = [];
  for (let i = 0; i < n; i++) {
    const g = target(i * dt);
    const a = g.map((gk, k) => Wn[k] * Wn[k] * (gk - x[k]) - 2 * Z[k] * Wn[k] * v[k]);
    X.push(x.slice()); A.push(a); V.push(v.slice());
    v = v.map((vk, k) => vk + a[k] * dt);
    x = x.map((xk, k) => xk + v[k] * dt);
  }
  return (t: number) => {
    const i = Math.max(0, Math.min(n - 1, Math.round(t / dt)));
    return { p: X[i], a: A[i], v: V[i] };
  };
}

type Phase = "idle" | "loading" | "flying" | "landed";

export function DroneDive({ film, poster, autoStart = true }: { film: string; poster: string; autoStart?: boolean }) {
  const reduced = useOsReducedMotion();
  const stage = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const lens = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [phase, setPhase] = useState<Phase>(reduced ? "landed" : "idle");
  const stop = useRef<() => void>(() => undefined);

  const fly = useCallback(async () => {
    if (!stage.current || !canvas.current || !lens.current || !ring.current) return;
    stop.current();
    setPhase("loading");
    const [THREE, { GLTFLoader }, { MeshoptDecoder }] = await Promise.all([
      import("three"),
      import("three/examples/jsm/loaders/GLTFLoader.js"),
      import("three/examples/jsm/libs/meshopt_decoder.module.js"),
    ]);
    const box = stage.current, cvs = canvas.current, lensEl = lens.current, ringEl = ring.current;
    const renderer = new THREE.WebGLRenderer({ canvas: cvs, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(FOV, W / H, 0.1, 400);

    // The film's studio: a black room with strip softboxes, for highlights that read on black.
    const studio = new THREE.Scene();
    studio.add(new THREE.Mesh(new THREE.BoxGeometry(40, 40, 40), new THREE.MeshBasicMaterial({ color: 0x020203, side: THREE.BackSide })));
    const strip = (w: number, h: number, x: number, y: number, z: number, ry: number, rx: number, c: number, k: number) => {
      const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: new THREE.Color(c).multiplyScalar(k), side: THREE.DoubleSide }));
      m.position.set(x, y, z); m.rotation.set(rx, ry, 0); studio.add(m);
    };
    strip(1.6, 22, -14, 2, -6, PI / 2.6, 0, 0xffffff, 6);
    strip(1.2, 22, 15, 1, -4, -PI / 2.4, 0, 0xfff1e6, 4.5);
    strip(26, 2.2, 0, 16, 2, 0, PI / 2, 0xffffff, 2.2);
    strip(10, 6, 0, -2, 18, PI, 0, 0xffffff, 0.35);
    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(studio, 0.02).texture;
    const light = (c: number, k: number, x: number, y: number, z: number) => { const l = new THREE.DirectionalLight(c, k); l.position.set(x, y, z); scene.add(l); };
    light(0xffffff, 2.2, -8, 3, -6); light(0xffe6d2, 1.6, 8, 2, -5); light(0xffffff, 0.9, 2, 8, 10);

    const loader = new GLTFLoader();
    loader.setMeshoptDecoder(MeshoptDecoder);
    let gltf;
    try {
      gltf = await loader.loadAsync("/3d/drone.glb");
    } catch {
      renderer.dispose();
      setPhase("landed");
      return;
    }
    const obj = gltf.scene;
    obj.updateMatrixWorld(true);
    const bbox = new THREE.Box3().setFromObject(obj);
    const size = bbox.getSize(new THREE.Vector3()), center = bbox.getCenter(new THREE.Vector3());
    const inner = new THREE.Group(); inner.add(obj); obj.position.sub(center); inner.scale.setScalar(1 / size.x);
    const outer = new THREE.Group(); outer.add(inner); scene.add(outer);
    // A brighter studio finish, as in the film, then a blurred disc in place of each pair of blades.
    const mats: InstanceType<typeof THREE.MeshStandardMaterial>[] = [];
    obj.traverse((o) => {
      const mesh = o as InstanceType<typeof THREE.Mesh>;
      if (!mesh.isMesh) return;
      const m = (mesh.material as InstanceType<typeof THREE.MeshStandardMaterial>).clone();
      mesh.material = m; mats.push(m);
      m.envMapIntensity = 2.2;
      if (m.name === "huise-paint" || m.name === "waike") m.color.multiplyScalar(1.18);
    });
    outer.updateMatrixWorld(true);
    const discs: InstanceType<typeof THREE.Mesh>[] = [];
    {
      const c = document.createElement("canvas"); c.width = c.height = 256;
      const g = c.getContext("2d")!, m = 128;
      const grad = g.createRadialGradient(m, m, 8, m, m, 126);
      grad.addColorStop(0, "rgba(40,40,40,0)"); grad.addColorStop(0.2, "rgba(40,40,40,.28)");
      grad.addColorStop(0.85, "rgba(60,60,60,.16)"); grad.addColorStop(0.95, "rgba(230,120,50,.22)"); grad.addColorStop(1, "rgba(60,60,60,0)");
      g.fillStyle = grad; g.beginPath(); g.arc(m, m, 126, 0, PI * 2); g.fill();
      g.fillStyle = "rgba(20,20,20,.22)";
      [0, PI].forEach((a) => { g.beginPath(); g.moveTo(m, m); g.arc(m, m, 124, a, a + 0.5); g.closePath(); g.fill(); });
      const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace;
      const discMat = new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false, side: THREE.DoubleSide });
      const local = (v: InstanceType<typeof THREE.Vector3>) => obj.worldToLocal(v.clone());
      ["LB", "LF", "RB", "RF"].forEach((arm) => {
        let node: InstanceType<typeof THREE.Object3D> | null = null;
        obj.traverse((o) => { if (!node && new RegExp(`^${arm}_\\d+$`).test(o.name)) node = o; });
        if (!node) return;
        const parts: { o: InstanceType<typeof THREE.Mesh>; c: InstanceType<typeof THREE.Vector3>; s: InstanceType<typeof THREE.Vector3> }[] = [];
        (node as InstanceType<typeof THREE.Object3D>).traverse((o) => {
          const mesh = o as InstanceType<typeof THREE.Mesh>;
          if (!mesh.isMesh) return;
          const b = new THREE.Box3().setFromObject(mesh);
          parts.push({ o: mesh, c: local(b.getCenter(new THREE.Vector3())), s: b.getSize(new THREE.Vector3()) });
        });
        const name = (p: (typeof parts)[number]) => (p.o.material as InstanceType<typeof THREE.Material>).name;
        const hub = parts.filter((p) => name(p) === "jinshu").sort((a, b) => b.s.length() - a.s.length())[0];
        const shells = parts.filter((p) => name(p) === "waike");
        if (!hub || shells.length < 2) return;
        let best: { d: number; a: (typeof parts)[number]; b: (typeof parts)[number] } | null = null;
        for (let i = 0; i < shells.length; i++) for (let j = i + 1; j < shells.length; j++) {
          const d = shells[i].c.clone().add(shells[j].c).multiplyScalar(0.5).distanceTo(hub.c);
          if (!best || d < best.d) best = { d, a: shells[i], b: shells[j] };
        }
        if (!best) return;
        best.a.o.visible = false; best.b.o.visible = false;
        const r = Math.max(best.a.c.distanceTo(hub.c), best.b.c.distanceTo(hub.c)) * 2.05;
        const disc = new THREE.Mesh(new THREE.CircleGeometry(r, 48), discMat);
        disc.position.set(hub.c.x, Math.max(best.a.c.y, best.b.c.y), hub.c.z);
        disc.rotation.x = -PI / 2;
        obj.add(disc); discs.push(disc);
      });
    }

    const flight = solveFlight();
    const pose = (t: number) => {
      const { p, a, v } = flight(t);
      return {
        x: p[0], y: p[1], s: p[2],
        // Nose dips as it speeds up toward you and stays down a touch while cruising, like a real quad.
        rx: 0.12 + 0.16 * Math.tanh(a[2] / 2600) + 0.12 * Math.tanh(Math.max(0, v[2]) / 900) + 0.012 * Math.sin(t * 2 * PI * 0.8),
        // Yaw as the camera sees it: a three-quarter view while it crosses, then square-on.
        ry: p[3] - Math.atan(((p[0] - W / 2) * K) / D),
        rz: -0.4 * Math.tanh(a[0] / 5200) + 0.015 * Math.sin(t * 2 * PI * 1.3),
      };
    };
    const C0 = new THREE.Vector3(0, 0, D), ORIGIN = new THREE.Vector3();
    const LENS = new THREE.Vector3(...LENS_LOCAL);
    const vL = new THREE.Vector3(), vN = new THREE.Vector3(), q = new THREE.Quaternion(), look = new THREE.Vector3();

    let vw = 0, vh = 0;
    const resize = () => {
      vw = box.clientWidth; vh = box.clientHeight;
      renderer.setSize(vw, vh, false);
    };
    resize();
    const onResize = () => resize();
    window.addEventListener("resize", onResize);

    const frame = (t: number) => {
      const s = vw / W; // virtual px → stage px
      const pz = pose(t);
      outer.visible = t < PUSH.b;
      outer.position.set((pz.x - W / 2) * K, -(pz.y - H / 2) * K, 0);
      outer.scale.setScalar(pz.s * K);
      outer.rotation.set(pz.rx, pz.ry, pz.rz);
      discs.forEach((d, i) => { d.rotation.z = t * 47 * (i % 2 ? 1 : -1); });

      const pushing = t >= PUSH.a && t < PUSH.b;
      if (!pushing) {
        camera.position.copy(C0); camera.near = 0.1; camera.updateProjectionMatrix(); camera.lookAt(ORIGIN);
        lensEl.style.clipPath = t >= PUSH.b ? "none" : "circle(0px at 50% 50%)";
        ringEl.style.opacity = "0";
      } else {
        // The push: turn onto the lens's own axis early, then dolly in at a constant rate in log space.
        outer.updateMatrixWorld(true);
        const L = outer.localToWorld(vL.copy(LENS));
        outer.getWorldQuaternion(q);
        vN.set(Math.sin(-LENS_AXIS), 0, Math.cos(-LENS_AXIS)).applyQuaternion(q);
        const from = C0.clone().sub(L), d0 = from.length(); from.normalize();
        const dir = from.lerp(vN, ramp(t, PUSH.a, PUSH.a + 0.65)).normalize();
        const k = ramp(t, PUSH.a, PUSH.b);
        camera.position.copy(L).addScaledVector(dir, PUSH.dEnd * Math.pow(d0 / PUSH.dEnd, 1 - k));
        camera.near = 0.005; camera.updateProjectionMatrix();
        camera.lookAt(look.copy(ORIGIN).lerp(L, ramp(t, PUSH.a, PUSH.a + 0.75)));
        camera.updateMatrixWorld(true);
        // Where the glass sits on screen and how big it is; the footage shows through it, then opens out.
        const c = L.clone().project(camera), cx = (c.x + 1) * W / 2, cy = (1 - c.y) * H / 2;
        const right = new THREE.Vector3(1, 0, 0).applyQuaternion(camera.quaternion);
        const e = L.clone().addScaledVector(right, LENS_R * outer.scale.x).project(camera);
        const r = Math.hypot((e.x - c.x) * W / 2, (e.y - c.y) * H / 2);
        const open = ramp(t, PUSH.b - 0.34, PUSH.b, "power2.in");
        const R = r + open * 1400;
        lensEl.style.clipPath = `circle(${(R * s).toFixed(1)}px at ${(cx * s).toFixed(1)}px ${(cy * s).toFixed(1)}px)`;
        lensEl.style.opacity = ramp(t, 3.1, 3.55, "power1.inOut").toFixed(3);
        ringEl.style.transform = `translate(${(cx * s).toFixed(1)}px, ${(cy * s).toFixed(1)}px) scale(${((R * s) / 500).toFixed(4)})`;
        ringEl.style.opacity = (ramp(t, 3.1, 3.55, "power1.inOut") * (1 - open)).toFixed(3);
      }
      renderer.render(scene, camera);
    };

    let raf = 0, start = 0, alive = true;
    const finish = () => {
      if (!alive) return;
      alive = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      lensEl.style.clipPath = "none"; lensEl.style.opacity = "1"; ringEl.style.opacity = "0";
      mats.forEach((m) => m.dispose());
      pmrem.dispose(); renderer.dispose();
      setPhase("landed");
    };
    stop.current = finish;
    video.current?.play().catch(() => undefined);
    setPhase("flying");
    const tick = (now: number) => {
      if (!alive) return;
      if (!start) start = now;
      const t = (now - start) / 1000;
      frame(Math.min(t, END));
      if (t >= END) finish(); else raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
  }, []);

  // Start once, the first time the stage is properly on screen (not on save-data connections).
  useEffect(() => {
    if (reduced || !autoStart || !stage.current) return;
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    if (saveData) return;
    let started = false;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started) { started = true; observer.disconnect(); void fly(); }
    }, { threshold: 0.6 });
    observer.observe(stage.current);
    return () => observer.disconnect();
  }, [autoStart, fly, reduced]);

  useEffect(() => () => stop.current(), []);
  useEffect(() => { if (phase === "landed") video.current?.play().catch(() => undefined); }, [phase]);

  return (
    <div ref={stage} className={cn("dd-stage", `is-${phase}`)}>
      <canvas ref={canvas} className="dd-canvas" aria-hidden />
      <div ref={lens} className="dd-lens" style={phase === "landed" ? undefined : { clipPath: "circle(0px at 50% 50%)" }}>
        <video ref={video} src={film} poster={poster} muted loop playsInline preload="none" aria-label="Lake Kawaguchiko and Mount Fuji, from the drone" />
      </div>
      <div ref={ring} className="dd-ring" aria-hidden />
      {phase === "idle" && (
        <button type="button" className="dd-play" onClick={() => void fly()}>
          <Play size={16} fill="currentColor" aria-hidden />Fly in
        </button>
      )}
      {phase === "loading" && <span className="dd-status" role="status">Spinning up…</span>}
      {phase === "landed" && !reduced && (
        <button type="button" className="dd-replay" onClick={() => void fly()} aria-label="Replay the drone fly-in">
          <RotateCcw size={14} aria-hidden />Replay
        </button>
      )}
    </div>
  );
}
