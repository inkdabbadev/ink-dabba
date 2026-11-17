export const CARE_KEY = "jv-care-package:v2";
export const ITEM_IDS = [
  "letter",
  "bouquet",
  "cake",
  "arcade",
  "penguin",
  "elephant",
  "coffee",
  "cherries",
  "car",
  "rose",
  "robot",
  "photo",
  "final",
];
export const FLOWERS = ["daisy", "tulip", "rose", "cosmos", "leaf"];
export const TOPPERS = [
  "cherry",
  "strawberry",
  "sprinkle",
  "flower",
  "star",
  "candle",
  "penguin",
  "elephant",
];
const defaults = [
  ["letter", 338, 350, -13, 190, 170],
  ["bouquet", 260, 540, -21, 200, 280],
  ["cake", 568, 535, 9, 210, 200],
  ["arcade", 744, 385, 12, 190, 270],
  ["penguin", 442, 580, -14, 115, 145],
  ["elephant", 685, 640, -7, 125, 130],
  ["coffee", 195, 378, -13, 140, 140],
  ["cherries", 579, 705, 16, 90, 90],
  ["car", 805, 636, -16, 170, 90],
  ["rose", 480, 342, -7, 115, 170],
  ["robot", 850, 510, 13, 100, 130],
  ["photo", 334, 690, 7, 140, 160],
  ["final", 500, 730, -6, 180, 130],
];
export function freshCare() {
  return {
    version: 2,
    giftsRevealed: false,
    balloon: { shape: "dog", color: "#cf7896", step: 0 },
    polaroids: [1, 2, 3].map((n) => ({
      id: "photo-" + n,
      src: "",
      caption: "",
      collected: false,
    })),
    parcel: { ribbon: false, tape: false, lid: false, tissue: false },
    objects: defaults.map(([id, x, y, rotation, w, h], i) => ({
      id,
      type: id,
      position: { x, y },
      rotation,
      scale: 1,
      zIndex: id === "photo" ? 2 : i + 4,
      draggable: true,
      interactive: true,
      interactionState: "idle",
      collected: false,
      completed: false,
      metadata: { w, h },
    })),
    cake: {
      base: "vanilla",
      frost: "#e9afc0",
      icing: "#fff1d4",
      paths: [],
      toppers: [],
      lit: false,
    },
    bouquet: {
      wrap: "#d4c4df",
      ribbon: "#ae5367",
      tag: "for you, JV",
      flowers: [],
    },
    prizes: [],
    visited: [],
    letterStage: 0,
    finalOpened: false,
    sound: false,
    reduced: false,
    readable: false,
  };
}
const num = (x, a, b, d) =>
  typeof x === "number" && Number.isFinite(x) ? Math.min(b, Math.max(a, x)) : d;
const hex = (x, d) =>
  typeof x === "string" && /^#[0-9a-f]{6}$/i.test(x) ? x : d;
export function hydrateCare(raw) {
  const d = freshCare();
  try {
    const s = typeof raw === "string" ? JSON.parse(raw) : raw;
    if (!s || s.version !== 2) return d;
    d.giftsRevealed = s.giftsRevealed === true;
    d.balloon = {
      shape: ["dog", "bunny", "flower"].includes(s.balloon?.shape)
        ? s.balloon.shape
        : "dog",
      color: hex(s.balloon?.color, d.balloon.color),
      step: Math.round(num(s.balloon?.step, 0, 4, 0)),
    };
    if (Array.isArray(s.polaroids))
      d.polaroids = d.polaroids.map((p, i) => {
        const v = s.polaroids[i];
        return {
          ...p,
          src:
            typeof v?.src === "string" &&
            /^data:image\/(jpeg|png|webp);base64,/.test(v.src) &&
            v.src.length < 1200000
              ? v.src
              : "",
          caption: typeof v?.caption === "string" ? v.caption.slice(0, 80) : "",
          collected: v?.collected === true,
        };
      });
    for (const k of Object.keys(d.parcel)) d.parcel[k] = s.parcel?.[k] === true;
    if (!d.parcel.ribbon || !d.parcel.tape) d.parcel.lid = false;
    if (!d.parcel.lid) d.parcel.tissue = false;
    d.sound = s.sound === true;
    d.reduced = s.reduced === true;
    d.readable = s.readable === true;
    d.finalOpened = s.finalOpened === true;
    d.letterStage = Math.round(num(s.letterStage, 0, 3, 0));
    d.visited = Array.isArray(s.visited)
      ? [...new Set(s.visited.filter((x) => ITEM_IDS.includes(x)))]
      : [];
    d.prizes = Array.isArray(s.prizes)
      ? [
          ...new Set(
            s.prizes.filter((x) =>
              [
                "penguin",
                "elephant",
                "cherry",
                "coffee",
                "heart",
                "capsule",
              ].includes(x),
            ),
          ),
        ]
      : [];
    d.objects = d.objects.map((o) => {
      const v = Array.isArray(s.objects)
        ? s.objects.find((v) => v.id === o.id)
        : null;
      return v
        ? {
            ...o,
            position: {
              x: num(v.position?.x, 70, 930, o.position.x),
              y: num(v.position?.y, 130, 890, o.position.y),
            },
            rotation: num(v.rotation, -180, 180, o.rotation),
            scale: num(v.scale, 0.65, 1.5, 1),
            zIndex: num(v.zIndex, 1, 999, o.zIndex),
            completed: v.completed === true,
            collected: v.collected === true,
          }
        : o;
    });
    for (const id of d.prizes) {
      const v = Array.isArray(s.objects)
        ? s.objects.find((o) => o.id === "prize-" + id)
        : null;
      if (v)
        d.objects.push({
          id: "prize-" + id,
          type: id,
          position: {
            x: num(v.position?.x, 70, 930, 780),
            y: num(v.position?.y, 130, 890, 750),
          },
          rotation: num(v.rotation, -180, 180, 0),
          scale: num(v.scale, 0.65, 1.5, 0.8),
          zIndex: num(v.zIndex, 1, 999, 40),
          draggable: true,
          interactive: true,
          interactionState: "idle",
          collected: true,
          completed: true,
          metadata: { w: 105, h: 120 },
        });
    }
    const cake = s.cake || {};
    d.cake = {
      base: ["vanilla", "chocolate", "strawberry"].includes(cake.base)
        ? cake.base
        : "vanilla",
      frost: hex(cake.frost, d.cake.frost),
      icing: hex(cake.icing, d.cake.icing),
      lit: cake.lit === true,
      paths: Array.isArray(cake.paths)
        ? cake.paths
            .filter((v) => Array.isArray(v.points) && v.points.length)
            .slice(-100)
            .map((v, i) => ({
              id: String(v.id || i),
              color: hex(v.color, "#fff1d4"),
              width: num(v.width, 1, 12, 4),
              points: v.points.slice(0, 500).map((p) => ({
                x: num(p.x, 13, 87, 50),
                y: num(p.y, 14, 85, 50),
              })),
            }))
        : [],
      toppers: Array.isArray(cake.toppers)
        ? cake.toppers
            .filter((v) => TOPPERS.includes(v.type))
            .slice(-80)
            .map((v, i) => ({
              id: String(v.id || i),
              type: v.type,
              x: num(v.x, 12, 88, 50),
              y: num(v.y, 15, 85, 50),
              rotation: num(v.rotation, -180, 180, 0),
              size: num(v.size, 0.5, 1.6, 1),
            }))
        : [],
    };
    const b = s.bouquet || {};
    d.bouquet.wrap = hex(b.wrap, d.bouquet.wrap);
    d.bouquet.ribbon = hex(b.ribbon, d.bouquet.ribbon);
    d.bouquet.tag =
      typeof b.tag === "string" ? b.tag.slice(0, 55) : d.bouquet.tag;
    if (Array.isArray(b.flowers))
      d.bouquet.flowers = b.flowers
        .filter((f) => FLOWERS.includes(f.type))
        .slice(-32)
        .map((f, i) => ({
          id: String(f.id || i),
          type: f.type,
          x: num(f.x, 8, 92, 50),
          y: num(f.y, 12, 76, 35),
          rotation: num(f.rotation, -90, 90, 0),
          size: num(f.size, 0.6, 1.5, 1),
        }));
    // Remove only the untouched legacy starter arrangement. Keep personal work.
    const starter = [
      ["rose", 43, 34, -22],
      ["daisy", 59, 29, 14],
      ["tulip", 72, 43, 27],
      ["cosmos", 28, 48, -35],
      ["leaf", 50, 52, 6],
    ];
    if (
      d.bouquet.flowers.length === 5 &&
      starter.every(([type, x, y, rotation], i) => {
        const f = d.bouquet.flowers.find((v) => v.id === `stem-${i + 1}`);
        return (
          f &&
          f.type === type &&
          f.x === x &&
          f.y === y &&
          f.rotation === rotation &&
          f.size === 1
        );
      })
    )
      d.bouquet.flowers = [];
    return d;
  } catch {
    return d;
  }
}
export function boundPosition(x, y) {
  return { x: num(x, 70, 930, 500), y: num(y, 130, 890, 500) };
}
export function settlePosition(position, id, objects) {
  let p = boundPosition(position.x, position.y);
  for (const o of objects) {
    if (o.id === id || o.id === "photo" || o.id === "final") continue;
    const dx = p.x - o.position.x,
      dy = p.y - o.position.y,
      d = Math.hypot(dx, dy);
    if (d < 38) {
      const a = d < 1 ? 0.7 : Math.atan2(dy, dx);
      p = boundPosition(
        o.position.x + Math.cos(a) * 42,
        o.position.y + Math.sin(a) * 42,
      );
    }
  }
  return p;
}
export function clawHit(x, prizes, tolerance = 12) {
  return (
    prizes
      .filter((p) => !p.collected)
      .map((p) => ({ ...p, distance: Math.abs(p.x - x) }))
      .filter((p) => p.distance <= tolerance)
      .sort((a, b) => a.distance - b.distance)[0] || null
  );
}
export function finalAvailable(visited, prizes) {
  return (
    ["letter", "bouquet", "cake", "arcade"].every((id) =>
      visited.includes(id),
    ) && prizes.length > 0
  );
}
