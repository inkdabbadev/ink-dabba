"use client";
import { useEffect, useRef, useState, type ReactNode } from "react";
import * as THREE from "three";
import { useCare } from "./store";
import type { CareData, Topper, IcingPath } from "./types";

type ToyProps = {
  kind: "balloon" | "cake";
  miniature?: boolean;
  turn?: number;
  tool?: string;
  selected?: string | null;
  onSelect?: (id: string) => void;
  remember?: () => void;
  fallback?: ReactNode;
};
type CakeCanvas = HTMLCanvasElement & {
  cakeDrop?: (x: number, y: number) => { x: number; y: number } | null;
};
const vector = (p: number[]) => new THREE.Vector3(...p);
function material(color: string, gloss = false) {
  return gloss
    ? new THREE.MeshPhysicalMaterial({
        color,
        roughness: 0.18,
        metalness: 0.12,
        clearcoat: 1,
        clearcoatRoughness: 0.1,
      })
    : new THREE.MeshStandardMaterial({ color, roughness: 0.6 });
}
function mesh(
  group: THREE.Group,
  geometry: THREE.BufferGeometry,
  color: string,
  position: number[] = [0, 0, 0],
  scale: number[] = [1, 1, 1],
  gloss = false,
) {
  const obj = new THREE.Mesh(geometry, material(color, gloss));
  obj.position.copy(vector(position));
  obj.scale.copy(vector(scale));
  obj.castShadow = true;
  obj.receiveShadow = true;
  group.add(obj);
  return obj;
}
function ball(
  group: THREE.Group,
  position: number[],
  size: number[],
  color: string,
  gloss = false,
) {
  return mesh(
    group,
    new THREE.SphereGeometry(1, 20, 16),
    color,
    position,
    size,
    gloss,
  );
}
function pill(
  group: THREE.Group,
  a: number[],
  b: number[],
  radius: number,
  color: string,
) {
  const av = vector(a),
    bv = vector(b),
    length = av.distanceTo(bv);
  const m = mesh(
    group,
    new THREE.CapsuleGeometry(
      radius,
      Math.max(0.005, length - radius * 2),
      6,
      16,
    ),
    color,
    av.clone().add(bv).multiplyScalar(0.5).toArray(),
    [1, 1, 1],
    true,
  );
  m.quaternion.setFromUnitVectors(
    new THREE.Vector3(0, 1, 0),
    bv.sub(av).normalize(),
  );
  return m;
}
function makeBalloon(data: CareData["balloon"]) {
  const g = new THREE.Group(),
    { shape, color } = data,
    step = data.step;
  g.position.y = 0.2;
  if (step <= 1) {
    pill(g, [-1.5, 0, 0], [1.5, 0, 0], step === 0 ? 0.045 : 0.18, color);
    return g;
  }
  if (shape === "flower") {
    pill(g, [0, -1.05, 0], [0, 0.6, 0], 0.1, "#79956e");
    for (let i = 0; i < Math.min(6, step * 2); i++) {
      const a = (i * Math.PI) / 3;
      pill(
        g,
        [Math.cos(a) * 0.2, Math.sin(a) * 0.2 + 0.7, 0],
        [Math.cos(a) * 0.85, Math.sin(a) * 0.85 + 0.7, 0],
        0.23,
        color,
      );
    }
    if (step === 4)
      ball(g, [0, 0.7, 0.16], [0.28, 0.28, 0.28], "#f4cb6e", true);
    return g;
  }
  pill(g, [-0.58, 0.15, 0], [0.85, 0.15, 0], 0.25, color);
  pill(g, [-0.65, 0.1, 0], [-0.92, 0.8, 0], 0.18, color);
  pill(g, [-1.35, 0.88, 0], [-0.72, 0.88, 0], 0.22, color);
  if (step >= 2) {
    pill(
      g,
      [-0.84, 0.97, -0.16],
      [-0.92, shape === "bunny" ? 1.95 : 1.48, -0.2],
      0.15,
      color,
    );
    pill(
      g,
      [-0.7, 0.98, 0.13],
      [-0.58, shape === "bunny" ? 1.95 : 1.5, 0.2],
      0.15,
      color,
    );
  }
  if (step >= 3) {
    pill(g, [-0.5, 0.15, -0.17], [-0.58, -0.85, -0.3], 0.19, color);
    pill(g, [-0.45, 0.15, 0.17], [-0.35, -0.85, 0.35], 0.19, color);
  }
  if (step >= 4) {
    pill(g, [0.66, 0.15, -0.17], [0.75, -0.85, -0.3], 0.19, color);
    pill(g, [0.7, 0.15, 0.17], [0.92, -0.85, 0.35], 0.19, color);
    pill(g, [0.85, 0.2, 0], [1.18, 0.93, 0], 0.14, color);
    ball(g, [-1.08, 0.99, 0.2], [0.035, 0.035, 0.035], "#482333");
  }
  const knot = mesh(
    g,
    new THREE.ConeGeometry(0.09, 0.17, 12),
    color,
    [-1.55, 0.88, 0],
    [1, 1, 1],
    true,
  );
  knot.rotation.z = Math.PI / 2;
  return g;
}
function decoration(item: Topper, lit: boolean) {
  const g = new THREE.Group();
  g.scale.setScalar(item.size * 0.8);
  g.rotation.y = (item.rotation * Math.PI) / 180;
  g.userData.topperId = item.id;
  const color =
    item.type === "strawberry"
      ? "#c8465d"
      : item.type === "cherry"
        ? "#a82d51"
        : item.type === "star"
          ? "#edbf62"
          : item.type === "flower"
            ? "#d996b9"
            : item.type === "penguin"
              ? "#39434c"
              : item.type === "elephant"
                ? "#aaa3c8"
                : "#efcc9c";
  if (item.type === "candle") {
    mesh(
      g,
      new THREE.CylinderGeometry(0.055, 0.055, 0.6, 12),
      "#b4789e",
      [0, 0.3, 0],
    );
    mesh(
      g,
      new THREE.CylinderGeometry(0.009, 0.009, 0.06, 6),
      "#49382e",
      [0, 0.62, 0],
    );
    if (lit) {
      const flame = ball(g, [0, 0.73, 0], [0.05, 0.11, 0.05], "#ffc364");
      flame.material.emissive.set("#ffc364");
      flame.material.emissiveIntensity = 1.2;
    }
  } else if (item.type === "sprinkle")
    pill(g, [-0.09, 0.04, 0], [0.09, 0.04, 0], 0.035, "#d780a4");
  else if (item.type === "flower") {
    for (let i = 0; i < 5; i++)
      ball(
        g,
        [Math.cos(i * 1.256) * 0.12, 0.09, Math.sin(i * 1.256) * 0.12],
        [0.12, 0.048, 0.12],
        color,
      );
    ball(g, [0, 0.12, 0], [0.07, 0.07, 0.07], "#eac36c");
  } else if (item.type === "star") {
    const shape = new THREE.Shape();
    for (let i = 0; i < 10; i++) {
      const a = (i * Math.PI) / 5,
        r = i % 2 ? 0.1 : 0.22;
      if (i === 0) shape.moveTo(Math.cos(a) * r, Math.sin(a) * r);
      else shape.lineTo(Math.cos(a) * r, Math.sin(a) * r);
    }
    shape.closePath();
    const star = mesh(
      g,
      new THREE.ExtrudeGeometry(shape, {
        depth: 0.055,
        bevelEnabled: true,
        bevelSize: 0.02,
        bevelThickness: 0.02,
        bevelSegments: 2,
        steps: 1,
      }),
      color,
      [0, 0.08, 0],
    );
    star.rotation.x = -Math.PI / 2;
  } else if (item.type === "penguin" || item.type === "elephant") {
    ball(g, [0, 0.23, 0], [0.18, 0.28, 0.18], color);
    ball(g, [0, 0.25, 0.15], [0.12, 0.18, 0.055], "#fff5dc");
    ball(g, [-0.065, 0.4, 0.15], [0.022, 0.022, 0.022], "#332d36");
    ball(g, [0.065, 0.4, 0.15], [0.022, 0.022, 0.022], "#332d36");
    if (item.type === "elephant")
      pill(g, [0, 0.38, 0.15], [0, 0.1, 0.3], 0.06, color);
    else ball(g, [0, 0.33, 0.22], [0.05, 0.03, 0.07], "#edbf62");
  } else {
    ball(
      g,
      [0, 0.13, 0],
      item.type === "strawberry" ? [0.13, 0.18, 0.13] : [0.15, 0.15, 0.15],
      color,
      true,
    );
    if (item.type === "cherry")
      pill(g, [0, 0.24, 0], [0.09, 0.5, 0], 0.015, "#727b48");
  }
  return g;
}
function icing(group: THREE.Group, path: IcingPath) {
  if (!path.points.length) return;
  const points = path.points.map(
    (p) => new THREE.Vector3((p.x - 50) * 0.033, 1.025, (p.y - 50) * 0.033),
  );
  if (points.length === 1) points.push(points[0].clone().addScalar(0.002));
  const stroke = mesh(
    group,
    new THREE.TubeGeometry(
      new THREE.CatmullRomCurve3(points),
      Math.min(250, Math.max(2, points.length * 2)),
      path.width * 0.009,
      7,
      false,
    ),
    path.color,
  );
  stroke.userData.icing = true;
}
function makeCake(data: CareData["cake"], selected?: string | null) {
  const g = new THREE.Group();
  g.position.y = -0.55;
  const cylinder = (radius: number, height: number, y: number, color: string) =>
    mesh(g, new THREE.CylinderGeometry(radius, radius, height, 64), color, [
      0,
      y,
      0,
    ]);
  cylinder(1.77, 0.09, -0.14, "#e6d2ad");
  cylinder(1.6, 0.07, -0.06, "#fff3dc");
  cylinder(
    1.4,
    0.92,
    0.45,
    data.base === "chocolate"
      ? "#78503f"
      : data.base === "strawberry"
        ? "#dca4a2"
        : "#d9b57c",
  );
  cylinder(1.405, 0.11, 0.36, data.frost);
  cylinder(1.43, 0.13, 0.94, data.frost);
  for (let i = 0; i < 26; i++) {
    const a = (i * Math.PI * 2) / 26;
    ball(
      g,
      [Math.cos(a) * 1.4, 0.85 - (i % 3) * 0.08, Math.sin(a) * 1.4],
      [0.12, 0.18 + (i % 3) * 0.07, 0.12],
      data.frost,
    );
    ball(
      g,
      [Math.cos(a) * 1.41, 0.08, Math.sin(a) * 1.41],
      [0.09, 0.06, 0.09],
      "#fff1dc",
    );
  }
  const surface = mesh(
    g,
    new THREE.CircleGeometry(1.43, 64),
    data.frost,
    [0, 1.012, 0],
  );
  surface.rotation.x = -Math.PI / 2;
  surface.userData.icing = true;
  data.paths.forEach((p) => icing(g, p));
  for (const item of data.toppers) {
    const d = decoration(item, data.lit);
    d.position.set((item.x - 50) * 0.033, 1.03, (item.y - 50) * 0.033);
    g.add(d);
    if (selected === item.id) {
      const ring = mesh(
        d,
        new THREE.RingGeometry(0.24, 0.27, 32),
        "#85445c",
        [0, 0.01, 0],
      );
      ring.rotation.x = -Math.PI / 2;
    }
  }
  return g;
}
function dispose(group: THREE.Object3D) {
  group.traverse((obj) => {
    if (obj instanceof THREE.Mesh) {
      obj.geometry.dispose();
      for (const mat of Array.isArray(obj.material)
        ? obj.material
        : [obj.material])
        mat.dispose();
    }
  });
}
export default function ToyCanvas(props: ToyProps) {
  const canvas = useRef<CakeCanvas>(null),
    latest = useRef(props),
    data = useCare((s) => s.data),
    saved = useRef(data),
    [ready, setReady] = useState(false),
    [failed, setFailed] = useState(false);
  latest.current = props;
  saved.current = data;
  const engine = useRef<{
    scene: THREE.Scene;
    root: THREE.Group;
    model: THREE.Group;
    renderer: THREE.WebGLRenderer;
    camera: THREE.PerspectiveCamera;
    refresh: () => void;
  } | null>(null);
  useEffect(() => {
    const element = canvas.current;
    if (!element) return;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas: element,
        alpha: true,
        antialias: true,
        powerPreference: "low-power",
      });
    } catch {
      setFailed(true);
      return;
    }
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    const scene = new THREE.Scene(),
      root = new THREE.Group(),
      camera = new THREE.PerspectiveCamera(
        props.miniature ? 31 : 37,
        1,
        0.1,
        50,
      );
    camera.position.copy(
      vector(props.kind === "cake" ? [3.7, 4.8, 5.5] : [3.4, 2.1, 5.8]),
    );
    camera.lookAt(0, props.kind === "balloon" ? 0.35 : 0, 0);
    scene.add(root);
    scene.add(
      new THREE.AmbientLight("#fff8ef", 1.4),
      new THREE.HemisphereLight("#fff8ef", "#b79287", 1.2),
    );
    const key = new THREE.DirectionalLight("#fff4dd", 3.8);
    key.position.set(-4, 7, 4);
    key.castShadow = true;
    key.shadow.mapSize.set(1024, 1024);
    key.shadow.normalBias = 0.04;
    key.shadow.radius = 4;
    scene.add(key);
    const rim = new THREE.DirectionalLight("#f5d9e1", 2);
    rim.position.set(4, 2, -4);
    scene.add(rim);
    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(200, 200),
      new THREE.ShadowMaterial({ transparent: true, opacity: 0.11 }),
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -1.02;
    floor.receiveShadow = true;
    scene.add(floor);
    let model = new THREE.Group(),
      animation = 0,
      alive = true,
      hidden = false,
      modelScale = 1;
    const refresh = () => {
      root.remove(model);
      dispose(model);
      model =
        props.kind === "cake"
          ? makeCake(saved.current.cake, latest.current.selected)
          : makeBalloon(saved.current.balloon);
      root.add(model);
      modelScale =
        props.kind === "balloon" && !saved.current.reduced ? 0.94 : 1;
      if (engine.current) engine.current.model = model;
    };
    engine.current = { scene, root, model, renderer, camera, refresh };
    refresh();
    const resize = () => {
      const rect = element.parentElement!.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      camera.aspect = rect.width / rect.height;
      camera.updateProjectionMatrix();
      renderer.setSize(rect.width, rect.height, false);
    };
    const observer = new ResizeObserver(resize);
    observer.observe(element.parentElement!);
    resize();
    let last = performance.now();
    function frame(time: number) {
      if (!alive) return;
      animation = requestAnimationFrame(frame);
      if (hidden || element?.closest("[inert]")) return;
      const dt = Math.min(0.06, (time - last) / 1000);
      last = time;
      const reduced = saved.current.reduced;
      root.rotation.y = reduced
        ? latest.current.turn || 0
        : THREE.MathUtils.damp(
            root.rotation.y,
            (latest.current.turn || 0) + (props.miniature ? -0.38 : 0),
            8,
            dt,
          );
      root.position.y =
        !reduced && props.miniature ? Math.sin(time * 0.0008) * 0.035 : 0;
      modelScale = THREE.MathUtils.damp(modelScale, 1, 9, dt);
      model.scale.setScalar(modelScale);
      renderer.render(scene, camera);
    }
    animation = requestAnimationFrame(frame);
    const visibility = new IntersectionObserver((entries) => {
      hidden = !entries[0].isIntersecting;
    });
    visibility.observe(element);
    const ray = new THREE.Raycaster(),
      plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -0.462);
    const setRay = (x: number, y: number) => {
      camera.updateMatrixWorld();
      root.updateWorldMatrix(true, true);
      const r = element.getBoundingClientRect();
      ray.setFromCamera(
        new THREE.Vector2(
          ((x - r.left) / r.width) * 2 - 1,
          (-(y - r.top) / r.height) * 2 + 1,
        ),
        camera,
      );
      return r;
    };
    const drop = (x: number, y: number, clamp = false) => {
      const r = setRay(x, y);
      if (x < r.left || x > r.right || y < r.top || y > r.bottom) return null;
      const hit = ray.ray.intersectPlane(plane, new THREE.Vector3());
      if (!hit) return null;
      root.updateWorldMatrix(true, false);
      const p = root.worldToLocal(hit),
        length = Math.hypot(p.x, p.z);
      if (length > 1.43 && !clamp) return null;
      if (length > 1.37) {
        p.x *= 1.37 / length;
        p.z *= 1.37 / length;
      }
      return {
        x: THREE.MathUtils.clamp(50 + p.x / 0.033, 12, 88),
        y: THREE.MathUtils.clamp(50 + p.z / 0.033, 15, 85),
      };
    };
    element.cakeDrop = (x, y) => (props.kind === "cake" ? drop(x, y) : null);
    element.dataset.toy = props.kind;
    element.dataset.rendered = "true";
    const live = new THREE.Group();
    live.position.y = -0.55;
    root.add(live);
    let drawing: IcingPath | null = null,
      moving: string | null = null,
      startX = 0,
      startY = 0;
    const down = (e: PointerEvent) => {
      if (props.miniature || props.kind !== "cake" || e.button !== 0) return;
      setRay(e.clientX, e.clientY);
      const intersections = ray.intersectObject(root, true);
      const hit = intersections[0];
      if (!hit) return;
      let object: THREE.Object3D | null = hit.object,
        id: string | null = null;
      while (object) {
        if (object.userData.topperId) {
          id = object.userData.topperId;
          break;
        }
        object = object.parent;
      }
      const p = drop(e.clientX, e.clientY);
      if (!p && (!id || latest.current.tool === "pipe")) return;
      if (!id && !hit.object.userData.icing) return;
      e.preventDefault();
      element.setPointerCapture(e.pointerId);
      latest.current.remember?.();
      startX = e.clientX;
      startY = e.clientY;
      if (id && latest.current.tool !== "pipe") {
        moving = id;
        latest.current.onSelect?.(id);
        return;
      }
      if (latest.current.tool === "pipe") {
        drawing = {
          id: crypto.randomUUID(),
          color: saved.current.cake.icing,
          width: 4,
          points: [p!],
        };
      } else if (saved.current.cake.toppers.length < 80) {
        const item = {
          id: crypto.randomUUID(),
          type: latest.current.tool || "cherry",
          ...p!,
          rotation: 0,
          size: 1,
        };
        useCare.getState().update((d) => ({
          ...d,
          cake: { ...d.cake, toppers: [...d.cake.toppers, item] },
        }));
        latest.current.onSelect?.(item.id);
      }
    };
    const move = (e: PointerEvent) => {
      if (!drawing && !moving) return;
      const p = drop(e.clientX, e.clientY, true);
      if (!p) return;
      if (drawing) {
        const last = drawing.points.at(-1)!;
        if (Math.hypot(p.x - last.x, p.y - last.y) > 0.5) {
          drawing.points.push(p);
          dispose(live);
          live.clear();
          icing(live, drawing);
        }
      } else if (
        moving &&
        Math.hypot(e.clientX - startX, e.clientY - startY) > 3
      ) {
        const id = moving;
        useCare.getState().update((d) => ({
          ...d,
          cake: {
            ...d.cake,
            toppers: d.cake.toppers.map((t) =>
              t.id === id ? { ...t, ...p } : t,
            ),
          },
        }));
      }
    };
    const finish = () => {
      if (drawing) {
        const path = drawing;
        drawing = null;
        dispose(live);
        live.clear();
        useCare.getState().update((d) => ({
          ...d,
          cake: { ...d.cake, paths: [...d.cake.paths, path].slice(-100) },
        }));
      }
      moving = null;
    };
    element.addEventListener("pointerdown", down);
    element.addEventListener("pointermove", move);
    window.addEventListener("pointerup", finish);
    window.addEventListener("pointercancel", finish);
    const lost = (e: Event) => {
      e.preventDefault();
      setFailed(true);
    };
    const restored = () => {
      setFailed(false);
      refresh();
    };
    element.addEventListener("webglcontextlost", lost);
    element.addEventListener("webglcontextrestored", restored);
    setReady(true);
    return () => {
      alive = false;
      cancelAnimationFrame(animation);
      observer.disconnect();
      visibility.disconnect();
      element.removeEventListener("pointerdown", down);
      element.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", finish);
      window.removeEventListener("pointercancel", finish);
      element.removeEventListener("webglcontextlost", lost);
      element.removeEventListener("webglcontextrestored", restored);
      delete element.cakeDrop;
      dispose(scene);
      key.shadow.map?.dispose();
      renderer.dispose();
      engine.current = null;
    };
  }, [props.kind, props.miniature]);
  useEffect(() => {
    engine.current?.refresh();
  }, [data.cake, data.balloon, props.selected]);
  return (
    <div
      className={
        "toy-canvas " + (ready && !failed ? "is-rendered" : "is-fallback")
      }
    >
      <canvas
        ref={canvas}
        style={{
          width: "100%",
          height: "100%",
          display: ready && !failed ? "block" : "none",
          touchAction: "none",
        }}
        role="img"
        aria-label={
          props.kind === "cake"
            ? "Three-dimensional birthday cake. Choose a decoration and tap the icing."
            : "Three-dimensional balloon animal"
        }
      />
      {(!ready || failed) && props.fallback}
    </div>
  );
}
