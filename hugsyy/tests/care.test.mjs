import assert from "node:assert/strict";
import test from "node:test";
import {
  freshCare,
  hydrateCare,
  clawHit,
  settlePosition,
  finalAvailable,
} from "../src/care/logic.mjs";
test("the parcel stays sealed on a first or invalid visit", () => {
  for (const raw of [null, "bad", '{"version":9}', "{}"])
    assert.deepEqual(hydrateCare(raw), freshCare());
});
test("parcel opening cannot restore an impossible order", () => {
  const s = freshCare();
  s.parcel.lid = true;
  s.parcel.tissue = true;
  assert.equal(hydrateCare(s).parcel.lid, false);
  assert.equal(hydrateCare(s).parcel.tissue, false);
});
test("cake paths, flowers, positions, prizes and settings persist", () => {
  const s = freshCare();
  s.parcel = { ribbon: true, tape: true, lid: true, tissue: true };
  s.objects[0].position = { x: 120, y: 200 };
  s.cake.paths = [
    {
      id: "p",
      color: "#aa88cc",
      width: 4,
      points: [
        { x: 40, y: 35 },
        { x: 55, y: 40 },
      ],
    },
  ];
  s.cake.toppers = [
    { id: "t", type: "penguin", x: 50, y: 50, rotation: 4, size: 1 },
  ];
  s.bouquet.flowers = [
    { id: "personal-rose", type: "rose", x: 68, y: 34, rotation: -12, size: 1 },
  ];
  s.bouquet.tag = "JV";
  s.prizes = ["penguin"];
  s.reduced = true;
  const r = hydrateCare(JSON.stringify(s));
  assert.deepEqual(r.cake, s.cake);
  assert.deepEqual(r.bouquet, s.bouquet);
  assert.deepEqual(r.objects[0].position, s.objects[0].position);
  assert.deepEqual(r.prizes, s.prizes);
  assert.equal(r.reduced, true);
});
test("bouquets start empty and untouched legacy starters are removed without losing personal flowers", () => {
  assert.deepEqual(freshCare().bouquet.flowers, []);
  const old = freshCare();
  old.bouquet.flowers = [
    { id: "stem-1", type: "rose", x: 43, y: 34, rotation: -22, size: 1 },
    { id: "stem-2", type: "daisy", x: 59, y: 29, rotation: 14, size: 1 },
    { id: "stem-3", type: "tulip", x: 72, y: 43, rotation: 27, size: 1 },
    { id: "stem-4", type: "cosmos", x: 28, y: 48, rotation: -35, size: 1 },
    { id: "stem-5", type: "leaf", x: 50, y: 52, rotation: 6, size: 1 },
  ];
  assert.deepEqual(hydrateCare(old).bouquet.flowers, []);
  old.bouquet.flowers[0].x = 60;
  assert.deepEqual(hydrateCare(old).bouquet.flowers, old.bouquet.flowers);
});
test("invalid positions and unrecognized art are sanitized", () => {
  const s = freshCare();
  s.objects[0].position = { x: -500, y: 90000 };
  s.cake.toppers = [
    { type: "bad" },
    { id: "a", type: "cherry", x: 999, y: -100, size: 99 },
  ];
  s.bouquet.wrap = "url(evil)";
  const r = hydrateCare(s);
  assert.deepEqual(r.objects[0].position, { x: 70, y: 890 });
  assert.equal(r.cake.toppers.length, 1);
  assert.equal(r.cake.toppers[0].x, 88);
  assert.equal(r.cake.toppers[0].size, 1.6);
  assert.equal(r.bouquet.wrap, "#d4c4df");
});
test("placement remains on the table and gently separates exact overlaps", () => {
  const objects = freshCare().objects;
  const p = settlePosition(objects[0].position, "coffee", objects);
  assert(
    Math.hypot(p.x - objects[0].position.x, p.y - objects[0].position.y) >= 38,
  );
  assert.deepEqual(settlePosition({ x: -200, y: 9999 }, "none", []), {
    x: 70,
    y: 890,
  });
});
test("claw detects the nearest available prize and can really miss", () => {
  const p = [
    { id: "penguin", x: 22, collected: false },
    { id: "coffee", x: 70, collected: false },
  ];
  assert.equal(clawHit(25, p).id, "penguin");
  assert.equal(clawHit(48, p), null);
  p[0].collected = true;
  assert.equal(clawHit(25, p), null);
});
test("the final letter is discoverable after playing with main gifts, without a forced ending", () => {
  assert.equal(
    finalAvailable(["letter", "bouquet", "cake", "arcade"], ["penguin"]),
    true,
  );
  assert.equal(
    finalAvailable(["letter", "bouquet", "cake"], ["penguin"]),
    false,
  );
  assert.equal(
    finalAvailable(["letter", "bouquet", "cake", "arcade"], []),
    false,
  );
});
test("delivered prizes keep their table position and cannot inject unknown objects", () => {
  const s = freshCare();
  s.prizes = ["penguin"];
  s.objects.push({
    id: "prize-penguin",
    type: "penguin",
    position: { x: 820, y: 770 },
    rotation: 12,
    scale: 0.8,
    zIndex: 51,
    metadata: { w: 105, h: 120 },
  });
  s.objects.push({ id: "unknown", type: "bad", position: { x: 100, y: 100 } });
  const r = hydrateCare(s);
  assert.equal(r.objects.length, 14);
  assert.deepEqual(r.objects.find((o) => o.id === "prize-penguin").position, {
    x: 820,
    y: 770,
  });
  assert(!r.objects.some((o) => o.id === "unknown"));
});

test("birthday gifts and personal Polaroids restore safely", () => {
  const s = freshCare();
  s.giftsRevealed = true;
  s.balloon = { shape: "bunny", color: "#c97894", step: 4 };
  s.polaroids[0] = {
    id: "photo-1",
    src: "data:image/jpeg;base64,YQ==",
    caption: "A lovely day",
    collected: true,
  };
  const r = hydrateCare(JSON.stringify(s));
  assert.equal(r.giftsRevealed, true);
  assert.deepEqual(r.balloon, s.balloon);
  assert.deepEqual(r.polaroids, s.polaroids);
  s.balloon = { shape: "unknown", color: "url(bad)", step: 900 };
  s.polaroids[0].src = "javascript:alert(1)";
  const safe = hydrateCare(s);
  assert.equal(safe.balloon.shape, "dog");
  assert.equal(safe.balloon.step, 4);
  assert.equal(safe.polaroids[0].src, "");
});
