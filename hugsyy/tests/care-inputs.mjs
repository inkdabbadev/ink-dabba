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
  if (false)
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

  await wait(
    '!!document.querySelector("[data-object=bouquet]")',
    "restored parcel",
  );
  await sleep(700);
  await tap("[data-object=bouquet]");
  await wait('!!document.querySelector(".workbench-bouquet")');
  await sleep(800);
  const before = (await state()).bouquet.flowers.length;
  const start = await rect('[aria-label="Add rose"]'),
    target = await evaluate(
      '(()=>{const s=document.querySelector(".is-focused .bouquet-art"),p=s.createSVGPoint();p.x=150;p.y=130;const v=p.matrixTransform(s.getScreenCTM());return{x:v.x,y:v.y}})()',
    );
  await send("Input.dispatchMouseEvent", {
    type: "mousePressed",
    x: start.x,
    y: start.y,
    button: "left",
    clickCount: 1,
  });
  for (let i = 1; i <= 12; i++)
    await send("Input.dispatchMouseEvent", {
      type: "mouseMoved",
      x: start.x + ((target.x - start.x) * i) / 12,
      y: start.y + ((target.y - start.y) * i) / 12,
      buttons: 1,
    });
  await send("Input.dispatchMouseEvent", {
    type: "mouseReleased",
    ...target,
    button: "left",
    clickCount: 1,
  });
  await sleep(400);
  assert.equal((await state()).bouquet.flowers.length, before + 1);
  const flower = (await state()).bouquet.flowers.at(-1);
  const stem = await evaluate(
    '(()=>{const s=document.querySelectorAll(".is-focused [data-flower]");const g=s[s.length-1],svg=g.ownerSVGElement,p=svg.createSVGPoint();p.x=0;p.y=-20;const v=p.matrixTransform(g.getScreenCTM());return{x:v.x,y:v.y}})()',
  );
  await send("Input.dispatchMouseEvent", {
    type: "mousePressed",
    ...stem,
    button: "left",
    clickCount: 1,
  });
  for (let i = 1; i <= 8; i++)
    await send("Input.dispatchMouseEvent", {
      type: "mouseMoved",
      x: stem.x + (30 * i) / 8,
      y: stem.y + (16 * i) / 8,
      buttons: 1,
    });
  await send("Input.dispatchMouseEvent", {
    type: "mouseReleased",
    x: stem.x + 30,
    y: stem.y + 16,
    button: "left",
    clickCount: 1,
  });
  await sleep(400);
  const moved = (await state()).bouquet.flowers.at(-1);
  assert(Math.hypot(moved.x - flower.x, moved.y - flower.y) > 2);
  await shot("10-direct-flowers");
  log("Supply dragging and individual flower dragging");
  await click(".put-back");
  await sleep(900);
  await tap("[data-object=cake]");
  await wait('!!document.querySelector(".workbench-cake")');
  await sleep(800);
  const count = (await state()).cake.toppers.length,
    src = await rect('[aria-label="Use star topper"]'),
    dest = await evaluate(
      '(()=>{const s=document.querySelector("[data-cake-surface=active]"),p=s.createSVGPoint();p.x=150;p.y=115;const v=p.matrixTransform(s.getScreenCTM());return{x:v.x,y:v.y}})()',
    );
  await send("Input.dispatchMouseEvent", {
    type: "mousePressed",
    x: src.x,
    y: src.y,
    button: "left",
    clickCount: 1,
  });
  for (let i = 1; i <= 12; i++)
    await send("Input.dispatchMouseEvent", {
      type: "mouseMoved",
      x: src.x + ((dest.x - src.x) * i) / 12,
      y: src.y + ((dest.y - src.y) * i) / 12,
      buttons: 1,
    });
  await send("Input.dispatchMouseEvent", {
    type: "mouseReleased",
    ...dest,
    button: "left",
    clickCount: 1,
  });
  await sleep(400);
  assert.equal((await state()).cake.toppers.length, count + 1);
  assert.equal((await state()).cake.toppers.at(-1).type, "star");
  await shot("11-direct-topper");
  log("Supply topper dragged onto real frosting coordinates");
  await click(".put-back");
  await sleep(900);
  const penguinBefore = (await state()).objects.find((o) => o.id === "penguin");
  await evaluate('document.querySelector("[data-object=penguin]").focus()');
  await send("Input.dispatchKeyEvent", {
    type: "keyDown",
    key: "ArrowRight",
    code: "ArrowRight",
  });
  await send("Input.dispatchKeyEvent", {
    type: "keyUp",
    key: "ArrowRight",
    code: "ArrowRight",
  });
  await sleep(300);
  assert(
    (await state()).objects.find((o) => o.id === "penguin").position.x >
      penguinBefore.position.x,
  );
  log("Keyboard object movement");
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
  const cup = await rect("[data-object=coffee]"),
    old = (await state()).objects.find((o) => o.id === "coffee");
  await send("Input.dispatchTouchEvent", {
    type: "touchStart",
    touchPoints: [{ x: cup.x, y: cup.y, id: 1, force: 1 }],
  });
  for (let i = 1; i <= 8; i++)
    await send("Input.dispatchTouchEvent", {
      type: "touchMove",
      touchPoints: [
        { x: cup.x + (35 * i) / 8, y: cup.y + (18 * i) / 8, id: 1, force: 1 },
      ],
    });
  await send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
  await sleep(500);
  const cupMoved = (await state()).objects.find((o) => o.id === "coffee");
  assert(
    Math.hypot(
      cupMoved.position.x - old.position.x,
      cupMoved.position.y - old.position.y,
    ) > 20,
  );
  assert.equal(
    await evaluate('!!document.querySelector(".object-workbench")'),
    false,
  );
  log("Actual touch drag without accidental opening");
  await tap("[data-object=letter]");
  await wait('!!document.querySelector(".workbench-letter")');
  await text("Pull the letter out");
  await text("Unfold the paper");
  await sleep(900);
  const paper = await rect(".birthday-paper");
  assert(paper.left >= -8 && paper.left + paper.w <= 398);
  assert(paper.top >= 30);
  await shot("12-phone-letter");
  await click(".put-back");
  await sleep(900);
  await click('[aria-label="Comfort and reset settings"]');
  await click(".comfort-sheet input[type=checkbox]");
  assert((await state()).reduced);
  await click('[aria-label="Close comfort settings"]');
  log("Mobile letter framing and reduced motion");
  assert.equal(await evaluate("document.documentElement.scrollWidth"), 390);
  assert.deepEqual(errors, []);
  fs.writeFileSync(
    path.join(out, "input-results.json"),
    JSON.stringify({ passed: true, report, errors }, null, 2),
  );
  console.log("DIRECT CARE INPUT CHECKS PASSED");
} catch (e) {
  console.error(e);
  fs.writeFileSync(
    path.join(out, "input-results.json"),
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
