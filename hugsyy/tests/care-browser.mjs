import fs from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";
import assert from "node:assert/strict";
const url = process.env.CARE_URL || "http://127.0.0.1:5173",
  out = path.resolve(".local/care"),
  sleep = (ms) => new Promise((r) => setTimeout(r, ms));
fs.mkdirSync(out, { recursive: true });
const chrome = spawn(
  process.env.CHROME_PATH ||
    "C:/Program Files/Google/Chrome/Application/chrome.exe",
  [
    "--headless=new",
    "--no-first-run",
    "--no-default-browser-check",
    "--disable-background-networking",
    "--remote-debugging-port=9281",
    "--user-data-dir=" + path.join(out, "profile"),
    "--window-size=1440,1080",
    "about:blank",
  ],
  { windowsHide: true, stdio: "ignore" },
);
let ws;
const errors = [],
  report = [];
try {
  let pages;
  for (let i = 0; i < 60; i++) {
    try {
      pages = await (await fetch("http://127.0.0.1:9281/json")).json();
      if (pages.some((p) => p.type === "page")) break;
    } catch {}
    await sleep(250);
  }
  ws = new WebSocket(pages.find((p) => p.type === "page").webSocketDebuggerUrl);
  await new Promise((r) => ws.addEventListener("open", r, { once: true }));
  let id = 0;
  const pending = new Map();
  ws.onmessage = (e) => {
    const m = JSON.parse(e.data);
    if (m.id) {
      const p = pending.get(m.id);
      pending.delete(m.id);
      m.error ? p.reject(m.error) : p.resolve(m.result);
    } else if (m.method === "Runtime.exceptionThrown")
      errors.push(
        m.params.exceptionDetails.exception?.description ||
          m.params.exceptionDetails.text,
      );
  };
  const send = (method, params = {}) =>
    new Promise((resolve, reject) => {
      const i = ++id;
      pending.set(i, { resolve, reject });
      ws.send(JSON.stringify({ id: i, method, params }));
    });
  await send("Runtime.enable");
  await send("Page.enable");
  if (!process.env.KEEP_CARE_SAVE)
    await send("Storage.clearDataForOrigin", {
      origin: new URL(url).origin,
      storageTypes: "all",
    });
  await send("Page.navigate", { url });
  const evaluate = async (expression) => {
    const r = await send("Runtime.evaluate", {
      expression,
      returnByValue: true,
      awaitPromise: true,
    });
    if (r.exceptionDetails)
      throw Error(
        r.exceptionDetails.exception?.description || r.exceptionDetails.text,
      );
    return r.result.value;
  };
  const wait = async (expression, label = "condition", timeout = 45000) => {
    const start = Date.now();
    while (Date.now() - start < timeout) {
      try {
        if (await evaluate(expression)) return;
      } catch {}
      await sleep(250);
    }
    throw Error("Timeout " + label);
  };
  const click = async (selector) => {
    await evaluate(
      `(()=>{const e=document.querySelector(${JSON.stringify(selector)});if(!e)throw Error('Missing control');if(e instanceof HTMLElement)e.click();else e.dispatchEvent(new MouseEvent('click',{bubbles:true}))})()`,
    );
    await sleep(220);
  };
  const text = async (label) => {
    await evaluate(
      `(()=>{const e=[...document.querySelectorAll('button')].find(e=>e.textContent.trim().includes(${JSON.stringify(label)}));if(!e)throw Error('Missing ${label}');e.click()})()`,
    );
    await sleep(220);
  };
  const state = async () => {
    await sleep(250);
    return evaluate(
      'JSON.parse(localStorage.getItem("jv-care-package:v2")||"null")',
    );
  };
  const shot = async (name) => {
    const r = await send("Page.captureScreenshot", {
      format: "png",
      captureBeyondViewport: true,
    });
    fs.writeFileSync(
      path.join(out, name + ".png"),
      Buffer.from(r.data, "base64"),
    );
  };
  const rect = (selector) =>
    evaluate(
      `(()=>{const target=document.querySelector(${JSON.stringify(selector)}),b=(target.classList.contains("table-object")?target.querySelector(".object-lift"):target).getBoundingClientRect();return{x:b.left+b.width/2,y:b.top+b.height/2,w:b.width,h:b.height,left:b.left,top:b.top}})()`,
    );
  const tap = async (selector) => {
    const p = await rect(selector);
    await send("Input.dispatchMouseEvent", {
      type: "mousePressed",
      x: p.x,
      y: p.y,
      button: "left",
      clickCount: 1,
    });
    await send("Input.dispatchMouseEvent", {
      type: "mouseReleased",
      x: p.x,
      y: p.y,
      button: "left",
      clickCount: 1,
    });
    await sleep(700);
  };
  const drag = async (selector, dx, dy) => {
    const p = await rect(selector);
    await send("Input.dispatchMouseEvent", {
      type: "mousePressed",
      x: p.x,
      y: p.y,
      button: "left",
      clickCount: 1,
    });
    for (let i = 1; i <= 10; i++)
      await send("Input.dispatchMouseEvent", {
        type: "mouseMoved",
        x: p.x + (dx * i) / 10,
        y: p.y + (dy * i) / 10,
        buttons: 1,
      });
    await send("Input.dispatchMouseEvent", {
      type: "mouseReleased",
      x: p.x + dx,
      y: p.y + dy,
      button: "left",
      clickCount: 1,
    });
    await sleep(600);
  };
  const change = async (selector, value) => {
    await evaluate(
      `(()=>{const e=document.querySelector(${JSON.stringify(selector)});Object.getOwnPropertyDescriptor(e instanceof HTMLSelectElement?HTMLSelectElement.prototype:HTMLInputElement.prototype,'value').set.call(e,${JSON.stringify(value)});e.dispatchEvent(new Event('input',{bubbles:true}));e.dispatchEvent(new Event('change',{bubbles:true}))})()`,
    );
    await sleep(220);
  };
  function log(label, value = true) {
    console.log(label, JSON.stringify(value));
    report.push({ label, value });
  }
  await wait('!!document.querySelector(".parcel-lid")', "app ready", 90000);
  await sleep(1200);
  assert.equal(
    await evaluate(
      'document.querySelector(".parcel-lid").classList.contains("lid-open")',
    ),
    false,
  );
  await shot("01-sealed");
  log("Parcel remains sealed");
  if (!process.env.CARE_SMOKE) {
    await drag(".ribbon-bow", 45, 55);
    assert((await state()).parcel.ribbon);
    await tap(".parcel-tape");
    assert((await state()).parcel.tape);
    await tap(".lift-lid");
    await wait(
      'document.querySelectorAll(".table-object").length>8',
      "contents",
    );
    await sleep(1000);
    await tap(".tissue-sheet");
    assert((await state()).parcel.tissue);
    await shot("02-unpacked");
    log("Intentional ribbon, tape, lid and tissue");
    const before = (await state()).objects.find((o) => o.id === "coffee");
    await drag("[data-object=coffee]", -95, 18);
    assert.equal(
      await evaluate('!!document.querySelector(".object-workbench")'),
      false,
    );
    const moved = (await state()).objects.find((o) => o.id === "coffee");
    assert(
      Math.hypot(
        moved.position.x - before.position.x,
        moved.position.y - before.position.y,
      ) > 30,
    );
    log("Dragging moves without opening");
    await tap("[data-object=letter]");
    await wait('!!document.querySelector(".workbench-letter")');
    await text("Pull the letter out");
    assert.equal((await state()).letterStage, 2);
    await text("Unfold the paper");
    assert.equal((await state()).letterStage, 3);
    await shot("03-letter");
    await text("Fold it again");
    assert.equal((await state()).letterStage, 1);
    await click(".put-back");
    await sleep(800);
    log("Physical letter pull, unfold and refold");
    await tap("[data-object=bouquet]");
    await wait('!!document.querySelector(".workbench-bouquet")');
    await click('[aria-label="Add tulip"]');
    assert.equal((await state()).bouquet.flowers.length, 6);
    await change('[aria-label="Bouquet gift tag"]', "A little bloom for JV");
    await change('[aria-label="Wrapping paper colour"]', "#b9c6a5");
    const stem = (await state()).bouquet.flowers.at(-1);
    await change('[aria-label="Flower rotation"]', "31");
    await click('[aria-label="Move flower right"]');
    const flower = (await state()).bouquet.flowers.at(-1);
    assert(flower.x > stem.x);
    assert.equal(flower.rotation, 31);
    await shot("04-bouquet");
    await click(".put-back");
    await sleep(800);
    log("Individual flowers, arrangement, wrap and tag saved");
    await tap("[data-object=cake]");
    await wait('!!document.querySelector(".workbench-cake")');
    await text("Draw with icing");
    const svg = await rect("[data-cake-surface=active]");
    const points = await evaluate(
      `(()=>{const svg=document.querySelector('[data-cake-surface=active]'),m=svg.getScreenCTM();return [80,100,120,140,160,180,200].map((x,i)=>{const p=svg.createSVGPoint();p.x=x;p.y=100+Math.sin(i)*9;const v=p.matrixTransform(m);return{x:v.x,y:v.y}})})()`,
    );
    await send("Input.dispatchMouseEvent", {
      type: "mousePressed",
      ...points[0],
      button: "left",
      clickCount: 1,
    });
    for (const p of points.slice(1))
      await send("Input.dispatchMouseEvent", {
        type: "mouseMoved",
        ...p,
        buttons: 1,
      });
    await send("Input.dispatchMouseEvent", {
      type: "mouseReleased",
      ...points.at(-1),
      button: "left",
      clickCount: 1,
    });
    await sleep(500);
    assert((await state()).cake.paths.length > 0);
    await tap('[aria-label="Use penguin topper"]');
    await text("Place one for me");
    assert.equal((await state()).cake.toppers.at(-1).type, "penguin");
    await text("Undo");
    assert.equal((await state()).cake.toppers.length, 0);
    await text("Redo");
    assert.equal((await state()).cake.toppers.length, 1);
    await tap('[aria-label="Use candle topper"]');
    await text("Place one for me");
    await text("Light candles");
    assert((await state()).cake.lit);
    await shot("05-cake");
    await text("Blow out");
    assert.equal((await state()).cake.lit, false);
    await click(".put-back");
    await sleep(900);
    log("Persistent piping, toppers, history and candles");
    await tap("[data-object=arcade]");
    await wait('!!document.querySelector(".workbench-arcade")');
    await change('[aria-label="Claw horizontal position"]', "10");
    await text("Grab a little joy");
    await sleep(2700);
    const prizes = (await state()).prizes;
    assert(prizes.includes("penguin"));
    await text("Put this little friend on the table");
    assert((await state()).objects.some((o) => o.id === "prize-penguin"));
    await change('[aria-label="Claw horizontal position"]', "21");
    await text("Grab a little joy");
    await sleep(2700);
    assert((await state()).prizes.length === 1);
    assert(
      await evaluate(
        'document.querySelector(".live-note").textContent.includes("near-miss")',
      ),
    );
    await change('[aria-label="Claw horizontal position"]', "70");
    await text("Grab a little joy");
    await sleep(2700);
    assert((await state()).prizes.length === 2);
    await shot("06-arcade");
    await click(".put-back");
    await sleep(800);
    log("Claw win, real miss, replay and prize delivery");
    await wait('!!document.querySelector("[data-object=final]")');
    await tap("[data-object=final]");
    await wait('!!document.querySelector(".workbench-final")');
    assert((await state()).finalOpened);
    await shot("07-final");
    await click(".put-back");
    await sleep(800);
    const saved = await state();
    await send("Page.reload", { ignoreCache: true });
    await sleep(1800);
    await wait('!!document.querySelector("[data-object=cake]")');
    const restored = await state();
    assert.deepEqual(restored.cake, saved.cake);
    assert.deepEqual(restored.bouquet, saved.bouquet);
    assert.deepEqual(
      restored.objects.find((o) => o.id === "coffee").position,
      saved.objects.find((o) => o.id === "coffee").position,
    );
    assert(restored.objects.some((o) => o.id === "prize-penguin"));
    log("All creations and loose objects survive reload");
    await send("Emulation.setDeviceMetricsOverride", {
      width: 390,
      height: 844,
      deviceScaleFactor: 1,
      mobile: true,
    });
    await send("Emulation.setTouchEmulationEnabled", {
      enabled: true,
      maxTouchPoints: 2,
    });
    await sleep(900);
    assert.equal(await evaluate("document.documentElement.scrollWidth"), 390);
    await shot("08-phone-table");
    const p = await rect("[data-object=cake]");
    await send("Input.dispatchTouchEvent", {
      type: "touchStart",
      touchPoints: [{ x: p.x, y: p.y, id: 1, force: 1 }],
    });
    await send("Input.dispatchTouchEvent", {
      type: "touchEnd",
      touchPoints: [],
    });
    await wait('!!document.querySelector(".workbench-cake")');
    await sleep(900);
    await shot("09-phone-cake");
    assert.equal(await evaluate("document.documentElement.scrollWidth"), 390);
    log("Phone touch focus and no overflow");
  }
  assert.deepEqual(errors, []);
  log("Uncaught browser errors", errors);
  fs.writeFileSync(
    path.join(out, "results.json"),
    JSON.stringify({ passed: true, report, errors }, null, 2),
  );
  console.log("CARE PACKAGE CHECKS PASSED");
} catch (e) {
  console.error(e);
  fs.writeFileSync(
    path.join(out, "results.json"),
    JSON.stringify(
      { passed: false, report, errors, error: String(e) },
      null,
      2,
    ),
  );
  process.exitCode = 1;
} finally {
  ws?.close();
  chrome.kill();
}
