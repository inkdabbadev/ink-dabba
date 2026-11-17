import fs from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";
import assert from "node:assert/strict";
const url = process.env.CARE_URL || "http://127.0.0.1:5173",
  out = path.resolve(".local/care"),
  sleep = (ms) => new Promise((r) => setTimeout(r, ms));
fs.mkdirSync(out, { recursive: true });
// Real browser microphone pipeline, fed deterministic quiet/clap/breath audio.
const microphoneWav = path.join(out, "test-breath.wav");
const sampleRate = 48000,
  audioSamples = sampleRate * 6;
const wav = Buffer.alloc(44 + audioSamples * 2);
wav.write("RIFF", 0);
wav.writeUInt32LE(wav.length - 8, 4);
wav.write("WAVEfmt ", 8);
wav.writeUInt32LE(16, 16);
wav.writeUInt16LE(1, 20);
wav.writeUInt16LE(1, 22);
wav.writeUInt32LE(sampleRate, 24);
wav.writeUInt32LE(sampleRate * 2, 28);
wav.writeUInt16LE(2, 32);
wav.writeUInt16LE(16, 34);
wav.write("data", 36);
wav.writeUInt32LE(audioSamples * 2, 40);
let randomSeed = 19;
for (let i = 0; i < audioSamples; i++) {
  const second = i / sampleRate;
  randomSeed = (randomSeed * 1664525 + 1013904223) >>> 0;
  const loud = (second > 1 && second < 1.09) || (second > 2.5 && second < 4);
  wav.writeInt16LE(
    loud ? Math.round(((randomSeed / 2 ** 32) * 2 - 1) * 16000) : 0,
    44 + i * 2,
  );
}
fs.writeFileSync(microphoneWav, wav);
const chrome = spawn(
  process.env.CHROME_PATH ||
    "C:/Program Files/Google/Chrome/Application/chrome.exe",
  [
    "--headless=new",
    "--no-first-run",
    "--no-default-browser-check",
    "--disable-background-networking",
    "--use-fake-device-for-media-stream",
    "--use-file-for-fake-audio-capture=" + microphoneWav,
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
  const frameContexts = new Map();
  ws.onmessage = (e) => {
    const m = JSON.parse(e.data);
    if (m.id) {
      const p = pending.get(m.id);
      pending.delete(m.id);
      if (!p) return;
      m.error ? p.reject(m.error) : p.resolve(m.result);
    } else if (m.method === "Runtime.executionContextCreated") {
      const c = m.params.context;
      if (c.auxData?.isDefault) frameContexts.set(c.auxData.frameId, c.id);
    } else if (m.method === "Runtime.executionContextsCleared") {
      frameContexts.clear();
    } else if (m.method === "Runtime.executionContextDestroyed") {
      for (const [frame, context] of frameContexts)
        if (context === m.params.executionContextId) frameContexts.delete(frame);
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
  await send("Page.addScriptToEvaluateOnNewDocument", {
    source: `
    window.__micTracks = [];
    if (navigator.mediaDevices) {
      const get = navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices);
      navigator.mediaDevices.getUserMedia = async function(options) {
        const stream = await get(options);
        window.__micTracks.push(...stream.getTracks());
        return stream;
      };
    }
  `,
  });
  if (!process.env.KEEP_CARE_SAVE)
    await send("Storage.clearDataForOrigin", {
      origin: new URL(url).origin,
      storageTypes: "all",
    });
  await send("Page.navigate", { url });
  const evaluate = async (expression) => {
    let contextId;
    if (process.env.CARE_EMBEDDED) {
      const tree = await send("Page.getFrameTree");
      const find = (node) => node.frame.url.includes("/hugsyy/experience/") ? node.frame
        : node.childFrames?.map(find).find(Boolean);
      const frame = find(tree.frameTree);
      contextId = frame && frameContexts.get(frame.id);
      if (!contextId) throw Error("Birthday iframe is not ready");
    }
    const r = await send("Runtime.evaluate", {
      expression,
      ...(contextId ? { contextId } : {}),
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
  let touchMode = false;
  const click = async (selector) => {
    await evaluate(
      `(()=>{const e=document.querySelector(${JSON.stringify(selector)});if(!e)throw Error('Missing '+${JSON.stringify(selector)});e.scrollIntoView({block:'center',inline:'nearest'});})()`,
    );
    await sleep(80);
    let p = await rect(selector);
    await send("Input.dispatchMouseEvent", {
      type: "mouseMoved",
      x: p.x,
      y: p.y,
    });
    await sleep(120);
    p = await rect(selector);
    const hit = await evaluate(
      `(()=>{const e=document.querySelector(${JSON.stringify(selector)}),hit=document.elementFromPoint(${p.x},${p.y});return {ok:!!hit&&(e===hit||e.contains(hit)),hit:hit?.outerHTML.slice(0,180),target:e.outerHTML.slice(0,180)};})()`,
    );
    assert(
      hit.ok,
      "Blocked real click " + selector + ": " + JSON.stringify(hit),
    );
    if (touchMode) {
      await send("Input.dispatchTouchEvent", {
        type: "touchStart",
        touchPoints: [{ x: p.x, y: p.y, id: 1, force: 1 }],
      });
      await send("Input.dispatchTouchEvent", {
        type: "touchEnd",
        touchPoints: [],
      });
    } else {
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
    }
    await sleep(280);
  };
  const text = async (label) => {
    await evaluate(
      `(()=>{document.querySelectorAll('[data-test-action]').forEach(e=>e.removeAttribute('data-test-action'));const e=[...document.querySelectorAll('button')].find(e=>e.textContent.trim().includes(${JSON.stringify(label)}));if(!e)throw Error('Missing '+${JSON.stringify(label)});e.setAttribute('data-test-action','true');})()`,
    );
    await click("[data-test-action=true]");
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
    '!!document.querySelector(".prelude-start")',
    "birthday invitation",
    90000,
  );
  await shot("prelude-01-invitation");
  await click(".prelude-start");
  await wait('!!document.querySelector(".wish-cake.is-lit")');
  assert.equal(
    await evaluate("window.__micTracks.length"),
    0,
    "Never request microphone on load",
  );
  await sleep(1200);
  await shot("prelude-02-celebration");
  await send("Browser.setPermission", {
    permission: { name: "microphone" },
    setting: "denied",
    origin: new URL(url).origin,
  });
  await click(".wish-mic-button");
  await wait(
    'document.querySelector(".candle-blower")?.dataset.micState === "error"',
    "microphone denial",
  );
  assert(await evaluate('!!document.querySelector(".wish-cake.is-lit")'));
  await click(".wish-tap-button");
  await wait('!!document.querySelector(".wish-cake.is-out")');
  await sleep(900);
  await shot("prelude-03-wish");
  await click(".prelude-continue");
  await click('[aria-label="Settings"]');
  await text("Replay the birthday wish");
  await click(".prelude-start");
  await send("Browser.setPermission", {
    permission: { name: "microphone" },
    setting: "granted",
    origin: new URL(url).origin,
  });
  await click(".wish-mic-button");
  await wait(
    'document.querySelector(".candle-blower")?.dataset.micState === "listening"',
    "microphone calibration",
  );
  await sleep(800);
  assert(
    await evaluate('!!document.querySelector(".wish-cake.is-lit")'),
    "A brief clap must not extinguish candles",
  );
  await wait(
    '!!document.querySelector(".wish-cake.is-out")',
    "actual microphone breath extinguishes candles",
    12000,
  );
  assert(
    await evaluate(
      'window.__micTracks.length > 0 && window.__micTracks.every(t=>t.readyState === "ended")',
    ),
    "Release microphone after the wish",
  );
  await click(".prelude-continue");
  log(
    "Birthday opening: Start, greeting, denial fallback, real microphone breath, short-noise rejection and track cleanup",
  );
  await wait('!!document.querySelector(".new-parcel")', "new parcel", 90000);
  await sleep(1100);
  await shot("birthday-01-parcel");
  await drag(".satin-bow", 0, 120);
  assert((await state()).parcel.ribbon);
  await drag(".tear-tab", 240, 0);
  assert((await state()).parcel.tape);
  await tap(".new-lid-tab");
  await wait('!!document.querySelector(".playful-envelope")');
  assert.equal(
    await evaluate('document.querySelectorAll("[data-gift]").length'),
    0,
  );
  for (let i = 0; i < 3; i++) {
    await tap(".playful-envelope");
    assert.equal(
      await evaluate('!!document.querySelector(".letter-dialog")'),
      false,
    );
  }
  await tap(".playful-envelope");
  await wait('!!document.querySelector(".letter-dialog")');
  assert(
    await evaluate(
      'document.querySelector(".signature").textContent.includes("Hugsy")',
    ),
  );
  await shot("birthday-02-letter");
  await text("Open the little things");
  await wait('document.querySelectorAll("[data-gift]").length===5');
  await wait(
    'document.querySelectorAll("canvas[data-rendered=true]").length>=2',
    "3D gifts ready",
  );
  await sleep(1200);
  await shot("birthday-03-gifts");
  log(
    "Physical ribbon and tear strip, playful envelope, Hugsy letter and five gifts",
  );
  await tap("[data-gift=balloon]");
  await wait(
    '!!document.querySelector(".dialog-balloon canvas[data-rendered=true]")',
  );
  await drag(".balloon-touch-layer", 75, 0);
  assert.equal((await state()).balloon.step, 1);
  for (let i = 0; i < 3; i++) await text("Twist balloon");
  await click('[aria-label="Turn object right"]');
  await sleep(700);
  assert.equal((await state()).balloon.step, 4);
  await text("Make another");
  assert.equal((await state()).balloon.step, 0);
  await change('[aria-label="Balloon shape"]', "bunny");
  assert.equal((await state()).balloon.step, 0);
  await text("Inflate balloon");
  await click(".balloon-touch-layer");
  assert.equal(
    (await state()).balloon.step,
    2,
    "Tap the balloon itself to twist",
  );
  await text("Undo twist");
  assert.equal((await state()).balloon.step, 1);
  for (let i = 0; i < 3; i++) await click(".balloon-touch-layer");
  assert.equal((await state()).balloon.step, 4);
  await shot("birthday-04-balloon");
  await click('[aria-label="Back to gift box"]');
  await wait('!document.querySelector(".birthday-overlay")');
  await tap("[data-gift=cake]");
  await wait('!!document.querySelector(".dialog-cake")', "cake workshop");
  await text("chocolate");
  assert.equal((await state()).cake.base, "chocolate");

  await wait(
    '!!document.querySelector(".dialog-cake canvas[data-rendered=true]")',
  );
  const cakePoint = async (x = 50, y = 50) =>
    evaluate(
      `(()=>{const c=document.querySelector('.dialog-cake canvas[data-toy=cake]'),r=c.getBoundingClientRect();let best=null,distance=Infinity;for(let a=0;a<35;a++)for(let b=0;b<35;b++){const px=r.left+r.width*a/34,py=r.top+r.height*b/34,p=c.cakeDrop(px,py);if(p){const d=Math.hypot(p.x-${x},p.y-${y});if(d<distance){distance=d;best={x:px,y:py};}}}return best;})()`,
    );
  const press = (p) =>
    send("Input.dispatchMouseEvent", {
      type: "mousePressed",
      x: p.x,
      y: p.y,
      button: "left",
      clickCount: 1,
    });
  const release = (p) =>
    send("Input.dispatchMouseEvent", {
      type: "mouseReleased",
      x: p.x,
      y: p.y,
      button: "left",
      clickCount: 1,
    });
  const centre = await cakePoint();
  await press(centre);
  await release(centre);
  await sleep(400);
  assert.equal((await state()).cake.toppers.length, 1);
  await text("Draw with icing");
  // Start on the cherry itself: piping must not silently switch to moving it.
  const acrossTopper = await cakePoint(70, 60);
  await press(centre);
  for (let i = 1; i <= 12; i++)
    await send("Input.dispatchMouseEvent", {
      type: "mouseMoved",
      x: centre.x + ((acrossTopper.x - centre.x) * i) / 12,
      y: centre.y + ((acrossTopper.y - centre.y) * i) / 12,
      buttons: 1,
    });
  await release(acrossTopper);
  await sleep(200);
  assert.equal((await state()).cake.paths.length, 1, "Pipe across a topper");
  const a = await cakePoint(30, 35),
    b = await cakePoint(65, 40);
  await press(a);
  for (let i = 1; i <= 12; i++)
    await send("Input.dispatchMouseEvent", {
      type: "mouseMoved",
      x: a.x + ((b.x - a.x) * i) / 12,
      y: a.y + ((b.y - a.y) * i) / 12,
      buttons: 1,
    });
  await release(b);
  await sleep(400);
  assert((await state()).cake.paths[0].points.length > 3);
  const before = (await send("Page.captureScreenshot", { format: "png" })).data;
  await click('[aria-label="Turn object right"]');
  await sleep(750);
  const after = (await send("Page.captureScreenshot", { format: "png" })).data;
  assert.notEqual(before, after);
  const target = await cakePoint(65, 60),
    supply = await rect('[aria-label="Use strawberry topper"]');
  await drag(
    '[aria-label="Use strawberry topper"]',
    target.x - supply.x,
    target.y - supply.y,
  );
  assert.equal((await state()).cake.toppers.length, 2);
  await text("Undo");
  assert.equal((await state()).cake.toppers.length, 1);
  await text("Redo");
  assert.equal((await state()).cake.toppers.length, 2);
  await shot("birthday-05-cake");
  await text("Light candles");
  assert(
    (await state()).cake.toppers.some((t) => t.type === "candle"),
    "Lighting adds a candle when needed",
  );
  await click(".dialog-cake .wish-mic-button");
  await wait(
    'document.querySelector(".dialog-cake .candle-blower")?.dataset.micState === "listening"',
  );
  await wait(
    'JSON.parse(localStorage.getItem("jv-care-package:v2")).cake.lit === false',
    "microphone extinguishes workshop candles",
    12000,
  );
  assert(
    await evaluate('window.__micTracks.every(t=>t.readyState === "ended")'),
  );
  log(
    "Real 3D cake picking, piping, rotated supply drop, undo/redo and turntable",
  );

  await click('[aria-label="Back to gift box"]');
  await wait('!document.querySelector(".birthday-overlay")');
  await tap("[data-gift=bouquet]");
  await wait('!!document.querySelector(".dialog-bouquet")');
  const count = (await state()).bouquet.flowers.length;
  assert.equal(count, 0, "The bouquet starts empty");
  await click('[aria-label="Add rose"]');
  assert.equal((await state()).bouquet.flowers.length, count + 1);

  const flowerTarget = await evaluate(
    '(()=>{const svg=document.querySelector(".dialog-bouquet .bouquet-art"),p=svg.createSVGPoint();p.x=225;p.y=210;const v=p.matrixTransform(svg.getScreenCTM());return{x:v.x,y:v.y};})()',
  );
  const supplyFlower = await rect('[aria-label="Add daisy"]');
  await drag(
    '[aria-label="Add daisy"]',
    flowerTarget.x - supplyFlower.x,
    flowerTarget.y - supplyFlower.y,
  );
  assert.equal((await state()).bouquet.flowers.length, count + 2);
  const newStem = (await state()).bouquet.flowers.at(-1);
  const stemPoint = await evaluate(
    `(()=>{const g=document.querySelector('.dialog-bouquet [data-flower="${newStem.id}"]'),v=new DOMPoint(0,0).matrixTransform(g.getScreenCTM());return{x:v.x,y:v.y};})()`,
  );
  await press(stemPoint);
  await send("Input.dispatchMouseEvent", {
    type: "mouseMoved",
    x: stemPoint.x + 35,
    y: stemPoint.y - 20,
    buttons: 1,
  });
  await release({ x: stemPoint.x + 35, y: stemPoint.y - 20 });
  await sleep(400);
  assert.notEqual((await state()).bouquet.flowers.at(-1).x, newStem.x);
  await change('[aria-label="Wrapping paper colour"]', "#c4a0bb");
  await change('[aria-label="Bouquet ribbon colour"]', "#8c3656");
  await change('[aria-label="Bouquet gift tag"]', "Made with love");
  assert.equal((await state()).bouquet.tag, "Made with love");
  await shot("birthday-06-bouquet");
  log("Real flower supply drop, stem dragging, bouquet colours and gift tag");

  await click('[aria-label="Back to gift box"]');
  await wait('!document.querySelector(".birthday-overlay")');
  await tap("[data-gift=photo]");
  await wait('!!document.querySelector(".dialog-photo")');
  await evaluate(
    `(async()=>{const c=document.createElement('canvas');c.width=200;c.height=200;const ctx=c.getContext('2d');ctx.fillStyle='#c87b98';ctx.fillRect(0,0,200,200);const blob=await new Promise(r=>c.toBlob(r,'image/png'));const file=new File([blob],'test-memory.png',{type:'image/png'});const dt=new DataTransfer();dt.items.add(file);const input=document.querySelector('input[type=file]');input.files=dt.files;input.dispatchEvent(new Event('change',{bubbles:true}));})()`,
  );
  await wait('!!document.querySelector(".large-polaroid img")');
  await change('[aria-label="Polaroid caption"]', "A lovely day");
  await text("Keep this Polaroid");
  assert((await state()).polaroids[0].collected);
  await shot("birthday-07-polaroid");
  await click('[aria-label="Back to gift box"]');
  await wait('!document.querySelector(".birthday-overlay")');

  for (let slot = 2; slot <= 3; slot++) {
    await tap("[data-gift=photo]");
    await wait('!!document.querySelector(".dialog-photo")');
    await click(".photo-tabs button:nth-child(" + slot + ")");
    await evaluate(
      `(async()=>{const c=document.createElement('canvas');c.width=100;c.height=100;c.getContext('2d').fillRect(0,0,100,100);const blob=await new Promise(r=>c.toBlob(r));const dt=new DataTransfer();dt.items.add(new File([blob],'moment.png',{type:'image/png'}));const input=document.querySelector('input[type=file]');input.files=dt.files;input.dispatchEvent(new Event('change',{bubbles:true}));})()`,
    );
    await wait('!!document.querySelector(".large-polaroid img")');
    await change('[aria-label="Polaroid caption"]', "Moment " + slot);
    await text("Keep this Polaroid");
    await click('[aria-label="Back to gift box"]');
    await wait('!document.querySelector(".birthday-overlay")');
  }
  assert.equal((await state()).polaroids.filter((p) => p.collected).length, 3);
  log("All three Polaroids upload, collect and retain separate captions");

  await click("[data-gift=arcade]");
  await wait('!!document.querySelector(".dialog-arcade")');
  const value = () =>
    evaluate(
      'Number(document.querySelector(".dialog-arcade input[type=range]").value)',
    );
  const positionBefore = await value();
  await click('[aria-label="Move claw left"]');
  assert((await value()) < positionBefore);
  await click('[aria-label="Move claw right"]');
  const arcadeKey = async (key, code) => {
    await send("Input.dispatchKeyEvent", {
      type: "keyDown",
      key,
      code: key,
      windowsVirtualKeyCode: code,
    });
    await send("Input.dispatchKeyEvent", {
      type: "keyUp",
      key,
      code: key,
      windowsVirtualKeyCode: code,
    });
  };
  const aim = async (n) => {
    await click('[aria-label="Claw horizontal position"]');
    await arcadeKey("Home", 36);
    for (let i = 10; i < n; i++) await arcadeKey("ArrowRight", 39);
    await sleep(150);
    assert.equal(await value(), n);
  };
  await aim(21);
  await text("Grab a little joy");
  await wait('!!document.querySelector(".prize-ticket")');
  assert((await state()).prizes.includes("penguin"));
  await text("Keep this prize in the box");
  assert((await state()).objects.some((o) => o.id === "prize-penguin"));
  await aim(10);
  await text("Grab a little joy");
  await wait(
    'document.querySelector(".workshop-note")?.textContent.includes("near-miss")',
  );
  assert.equal((await state()).prizes.length, 1);
  await aim(35);
  await text("Grab a little joy");
  await wait('!!document.querySelector(".prize-ticket")');
  assert((await state()).prizes.includes("elephant"));
  await text("Keep this prize in the box");
  await shot("claw-restored-desktop");
  await click('[aria-label="Back to gift box"]');
  await wait('!document.querySelector(".birthday-overlay")');
  assert.equal(
    await evaluate('document.querySelectorAll(".keepsake-tray>span").length'),
    2,
  );
  log(
    "Restored claw: real arrow clicks, keyboard aim, win, miss, replay and prizes in the box",
  );
  const saved = await state();
  await send("Page.reload", { ignoreCache: true });
  await wait('document.querySelectorAll("[data-gift]").length===5');
  const restored = await state();
  assert.deepEqual(restored.balloon, saved.balloon);
  assert.deepEqual(restored.polaroids, saved.polaroids);
  assert.deepEqual(restored.cake, saved.cake);
  assert.deepEqual(restored.bouquet, saved.bouquet);
  assert.deepEqual(restored.prizes, saved.prizes);
  assert(restored.objects.some((o) => o.id === "prize-penguin"));
  log("Balloon making, cake, bouquet, photo upload and collection persist");
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
  touchMode = true;
  await evaluate("window.scrollTo(0,0)");
  await sleep(200);
  await send("Input.dispatchTouchEvent", {
    type: "touchStart",
    touchPoints: [{ x: 10, y: 650, id: 1, force: 1 }],
  });
  for (let i = 1; i <= 12; i++) {
    await send("Input.dispatchTouchEvent", {
      type: "touchMove",
      touchPoints: [{ x: 10, y: 650 - i * 32, id: 1, force: 1 }],
    });
    await sleep(18);
  }
  await send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
  await sleep(300);
  assert(
    (await evaluate("window.scrollY")) > 100,
    "A real finger swipe must scroll the phone page",
  );
  log("Real phone swipe reaches gifts below the fold");
  await evaluate("window.scrollTo(0,0)");
  await sleep(200);
  await sleep(800);
  assert.equal(await evaluate("document.documentElement.scrollWidth"), 390);
  await shot("birthday-08-phone");
  const p = await rect("[data-gift=balloon]");
  await send("Input.dispatchTouchEvent", {
    type: "touchStart",
    touchPoints: [{ x: p.x, y: p.y, id: 1, force: 1 }],
  });
  await send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
  await wait('!!document.querySelector(".dialog-balloon")');
  assert.equal(await evaluate("document.documentElement.scrollWidth"), 390);
  await sleep(700);
  await shot("birthday-09-phone-workshop");

  await click('[aria-label="Back to gift box"]');
  await wait('!document.querySelector(".birthday-overlay")');
  await tap("[data-gift=cake]");
  await wait(
    '!!document.querySelector(".dialog-cake canvas[data-rendered=true]")',
  );
  await sleep(700);
  await text("Draw with icing");
  const touchA = await cakePoint(35, 40),
    touchB = await cakePoint(65, 45),
    pathCount = (await state()).cake.paths.length;
  await send("Input.dispatchTouchEvent", {
    type: "touchStart",
    touchPoints: [{ x: touchA.x, y: touchA.y, id: 1, force: 1 }],
  });
  for (let i = 1; i <= 8; i++)
    await send("Input.dispatchTouchEvent", {
      type: "touchMove",
      touchPoints: [
        {
          x: touchA.x + ((touchB.x - touchA.x) * i) / 8,
          y: touchA.y + ((touchB.y - touchA.y) * i) / 8,
          id: 1,
          force: 1,
        },
      ],
    });
  await send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
  await sleep(500);
  assert.equal((await state()).cake.paths.length, pathCount + 1);
  // Tools must not scroll the cake out of reach on a real phone viewport.
  await click('[aria-label="Use star topper"]');
  const fingerStart = await rect('[aria-label="Use star topper"]');
  const fingerEnd = await cakePoint(30, 70);
  assert(
    fingerEnd.y > 0 && fingerEnd.y < 844,
    "Cake stays visible beside tools",
  );
  assert(
    await evaluate(
      `document.elementFromPoint(${fingerEnd.x},${fingerEnd.y})?.tagName === 'CANVAS'`,
    ),
  );
  assert.equal(
    await evaluate(
      "getComputedStyle(document.querySelector('[aria-label=\"Use star topper\"]')).touchAction",
    ),
    "none",
  );
  const beforeFingerDrop = (await state()).cake.toppers.length;
  await send("Input.dispatchTouchEvent", {
    type: "touchStart",
    touchPoints: [{ x: fingerStart.x, y: fingerStart.y, id: 1, force: 1 }],
  });
  for (let i = 1; i <= 15; i++) {
    await send("Input.dispatchTouchEvent", {
      type: "touchMove",
      touchPoints: [
        {
          x: fingerStart.x + ((fingerEnd.x - fingerStart.x) * i) / 15,
          y: fingerStart.y + ((fingerEnd.y - fingerStart.y) * i) / 15,
          id: 1,
          force: 1,
        },
      ],
    });
    await sleep(18);
  }
  await send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
  await sleep(300);
  assert.equal(
    (await state()).cake.toppers.length,
    beforeFingerDrop + 1,
    "Real phone supply drag adds topper",
  );
  assert.equal(await evaluate("document.documentElement.scrollWidth"), 390);
  await shot("birthday-10-phone-cake");
  const beforeLoss = (await state()).cake;
  await evaluate(
    'window.__lostContext=document.querySelector(".dialog-cake canvas").getContext("webgl2").getExtension("WEBGL_lose_context");window.__lostContext.loseContext()',
  );
  await wait(
    '!!document.querySelector(".dialog-cake [data-cake-surface=active]")',
  );
  assert.deepEqual((await state()).cake, beforeLoss);
  await click('[aria-label="Use candle topper"]');
  const fallbackPoint = await evaluate(
    '(()=>{const svg=document.querySelector(".dialog-cake [data-cake-surface=active]"),p=svg.createSVGPoint();p.x=150;p.y=110;const v=p.matrixTransform(svg.getScreenCTM());return{x:v.x,y:v.y};})()',
  );
  await send("Input.dispatchTouchEvent", {
    type: "touchStart",
    touchPoints: [{ x: fallbackPoint.x, y: fallbackPoint.y, id: 1, force: 1 }],
  });
  await send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
  await sleep(400);
  assert.equal(
    (await state()).cake.toppers.length,
    beforeLoss.toppers.length + 1,
  );
  await evaluate("window.__lostContext.restoreContext()");
  await wait(
    'document.querySelector(".dialog-cake canvas").style.display === "block"',
  );
  log(
    "Phone touch icing, no overflow, and context-loss fallback preserves the editable cake",
  );
  const keepsakes = await state();
  await click('[aria-label="Back to gift box"]');
  await wait('!document.querySelector(".birthday-overlay")');
  await click('[aria-label="Settings"]');
  await click(".birthday-settings input[type=checkbox]");
  await text("Replay the opening");
  await wait('!!document.querySelector(".new-parcel")');
  await click(".ribbon .physical-pull");
  await wait('!!document.querySelector(".tear .physical-pull")');
  await click(".tear .physical-pull");
  await text("Lift the lid");
  await wait('!!document.querySelector(".playful-envelope")');
  await tap(".playful-envelope");
  await wait('!!document.querySelector(".letter-dialog")');
  const afterReplay = await state();
  assert.deepEqual(afterReplay.cake, keepsakes.cake);
  assert.deepEqual(afterReplay.bouquet, keepsakes.bouquet);
  assert.deepEqual(afterReplay.polaroids, keepsakes.polaroids);
  log("Replay preserves creations; reduced motion skips the envelope chase");

  await text("Open the little things");
  await wait('document.querySelectorAll("[data-gift]").length===5');
  const key = async (name, shift = false) => {
    await send("Input.dispatchKeyEvent", {
      type: "keyDown",
      key: name,
      code: name,
      windowsVirtualKeyCode: name === "Tab" ? 9 : 27,
      modifiers: shift ? 8 : 0,
    });
    await send("Input.dispatchKeyEvent", {
      type: "keyUp",
      key: name,
      code: name,
      windowsVirtualKeyCode: name === "Tab" ? 9 : 27,
      modifiers: shift ? 8 : 0,
    });
    await sleep(150);
  };
  await evaluate('document.querySelector("[data-gift=photo]").focus()');
  await click("[data-gift=photo]");
  await wait('!!document.querySelector(".dialog-photo")');
  assert.equal(
    await evaluate('document.activeElement.getAttribute("aria-label")'),
    "Back to gift box",
  );
  await key("Tab", true);
  assert.equal(
    await evaluate('document.activeElement.closest(".gift-dialog")!==null'),
    true,
  );
  await key("Tab");
  assert.equal(
    await evaluate('document.activeElement.getAttribute("aria-label")'),
    "Back to gift box",
  );
  await key("Escape");
  await wait('!document.querySelector(".birthday-overlay")');
  assert.equal(
    await evaluate('document.activeElement.getAttribute("data-gift")'),
    "photo",
  );
  log("Keyboard focus trap, Escape and return to the selected gift");
  for (const [width, height] of [
    [320, 900],
    [768, 900],
    [1024, 900],
    [844, 390],
  ]) {
    await send("Emulation.setDeviceMetricsOverride", {
      width,
      height,
      deviceScaleFactor: 1,
      mobile: width < 650,
    });
    await sleep(400);
    assert(
      await evaluate("document.documentElement.scrollWidth <= innerWidth"),
    );
    for (const gift of ["cake", "balloon", "bouquet", "photo", "arcade"]) {
      await click("[data-gift=" + gift + "]");
      await wait('!!document.querySelector(".dialog-' + gift + '")');
      await sleep(350);
      const clipped = await evaluate(
        'JSON.stringify([...document.querySelectorAll(".gift-dialog button,.gift-dialog input,.gift-dialog select")].filter(e=>{const r=e.getBoundingClientRect();return r.width&&(r.left < -1 || r.right > innerWidth+1)}).map(e=>e.getAttribute("aria-label")||e.textContent.trim()))',
      );
      assert.equal(
        clipped,
        "[]",
        width + "px " + gift + " clipped controls: " + clipped,
      );
      assert.equal(
        await evaluate("document.documentElement.scrollWidth <= innerWidth"),
        true,
      );
      if (width === 320 && gift === "arcade") {
        await text("Grab a little joy");
        await wait('!!document.querySelector(".prize-ticket")');
        await text("Keep this prize in the box");
        assert((await state()).prizes.includes("cherry"));
        await shot("claw-restored-phone");
      }
      if (width === 320 && gift === "balloon") {
        await change('[aria-label="Balloon shape"]', "dog");
        await click(".balloon-touch-layer");
        assert.equal(
          (await state()).balloon.step,
          1,
          "Phone tap inflates once",
        );
        const p = await rect(".balloon-touch-layer");
        await send("Input.dispatchTouchEvent", {
          type: "touchStart",
          touchPoints: [{ x: p.x, y: p.y, id: 1 }],
        });
        for (let i = 1; i <= 12; i++) {
          await send("Input.dispatchTouchEvent", {
            type: "touchMove",
            touchPoints: [{ x: p.x + i * 4, y: p.y, id: 1 }],
          });
          await sleep(18);
        }
        await send("Input.dispatchTouchEvent", {
          type: "touchEnd",
          touchPoints: [],
        });
        await sleep(300);
        assert.equal(
          (await state()).balloon.step,
          2,
          "Phone drag twists once without a duplicate click",
        );
        await click(".balloon-touch-layer");
        await click(".balloon-touch-layer");
        assert.equal((await state()).balloon.step, 4);
        await change('[aria-label="Balloon shape"]', "flower");
        for (let i = 0; i < 4; i++) await click(".balloon-touch-layer");
        assert.equal((await state()).balloon.step, 4);
        await shot("balloon-320-complete");
      }
      if (width === 320 && gift === "bouquet") {
        await text("Clear bouquet");
        assert.equal((await state()).bouquet.flowers.length, 0);
        await shot("bouquet-320-empty");
        await click('[aria-label="Add rose"]');
        assert.equal(
          (await state()).bouquet.flowers.length,
          1,
          "Phone flower tap adds exactly one stem",
        );
        await evaluate(
          'document.querySelector(\'[aria-label="Add daisy"]\').scrollIntoView({block:"center"})',
        );
        await sleep(200);
        const from = await rect('[aria-label="Add daisy"]');
        const to = await evaluate(
          '(()=>{const s=document.querySelector(".dialog-bouquet .bouquet-art"),p=new DOMPoint(150,100).matrixTransform(s.getScreenCTM());return{x:p.x,y:p.y}})()',
        );
        assert(to.y > 0 && to.y < height);
        assert(
          await evaluate(
            `!!document.elementFromPoint(${to.x},${to.y})?.closest('.bouquet-art')`,
          ),
        );
        assert.equal(
          await evaluate(
            "getComputedStyle(document.querySelector('[aria-label=\"Add daisy\"]')).touchAction",
          ),
          "none",
        );
        await send("Input.dispatchTouchEvent", {
          type: "touchStart",
          touchPoints: [{ x: from.x, y: from.y, id: 1 }],
        });
        for (let i = 1; i <= 20; i++) {
          await send("Input.dispatchTouchEvent", {
            type: "touchMove",
            touchPoints: [
              {
                x: from.x + ((to.x - from.x) * i) / 20,
                y: from.y + ((to.y - from.y) * i) / 20,
                id: 1,
              },
            ],
          });
          await sleep(18);
        }
        await send("Input.dispatchTouchEvent", {
          type: "touchEnd",
          touchPoints: [],
        });
        await sleep(300);
        assert.equal(
          (await state()).bouquet.flowers.length,
          2,
          "Phone flower supply drop adds exactly one stem",
        );
        const stem = (await state()).bouquet.flowers.at(-1);
        const head = await evaluate(
          `(()=>{const g=document.querySelector('.dialog-bouquet [data-flower="${stem.id}"]'),p=new DOMPoint(0,0).matrixTransform(g.getScreenCTM());return{x:p.x,y:p.y}})()`,
        );
        assert(
          await evaluate(
            `!!document.elementFromPoint(${head.x},${head.y})?.closest('.dialog-bouquet [data-flower]')`,
          ),
          "Touch the visible workshop flower, not its miniature",
        );
        await send("Input.dispatchTouchEvent", {
          type: "touchStart",
          touchPoints: [{ x: head.x, y: head.y, id: 1 }],
        });
        await send("Input.dispatchTouchEvent", {
          type: "touchMove",
          touchPoints: [{ x: head.x + 20, y: head.y + 12, id: 1 }],
        });
        await send("Input.dispatchTouchEvent", {
          type: "touchEnd",
          touchPoints: [],
        });
        await sleep(300);
        assert.notEqual(
          (await state()).bouquet.flowers.at(-1).x,
          stem.x,
          "Phone finger repositions the flower",
        );
        await shot("audit-320-bouquet");
      }
      await click('[aria-label="Back to gift box"]');
      await wait('!document.querySelector(".birthday-overlay")');
    }
  }
  log(
    "All five workshops accept real taps at 320px, 768px, 1024px and 844x390 landscape",
  );
  await send("Emulation.setDeviceMetricsOverride", {
    width: 390,
    height: 844,
    deviceScaleFactor: 1,
    mobile: true,
  });
  await click('[aria-label="Settings"]');
  await text("Replay the birthday wish");
  await click(".prelude-start");
  await sleep(1100);
  await shot("prelude-04-phone");
  await click(".wish-mic-button");
  await wait(
    'document.querySelector(".candle-blower")?.dataset.micState === "listening"',
  );
  await click(".wish-mic-button");
  assert(
    await evaluate('window.__micTracks.every(t=>t.readyState === "ended")'),
    "Stop microphone releases every track",
  );
  assert(await evaluate('!!document.querySelector(".wish-cake.is-lit")'));
  await click(".wish-mic-button");
  await wait(
    '!!document.querySelector(".wish-cake.is-out")',
    "phone microphone breath",
    12000,
  );
  await click(".prelude-continue");
  assert.equal(
    await evaluate('document.querySelectorAll("[data-gift]").length'),
    5,
    "Birthday replay keeps gifts",
  );
  await send("Emulation.setDeviceMetricsOverride", {
    width: 320,
    height: 700,
    deviceScaleFactor: 1,
    mobile: true,
  });
  await click('[aria-label="Settings"]');
  await text("Replay the birthday wish");
  await click(".prelude-start");
  await sleep(1000);
  assert(await evaluate("document.documentElement.scrollWidth <= innerWidth"));
  await shot("prelude-05-small-phone");
  await click(".wish-tap-button");
  await click(".prelude-continue");
  log(
    "Phone birthday opening, real microphone stop/restart, 320px tap fallback and saved gifts preserved",
  );
  assert.deepEqual(errors, []);
  log("Uncaught browser errors", errors);
  fs.writeFileSync(
    path.join(out, "results.json"),
    JSON.stringify({ passed: true, report, errors }, null, 2),
  );
  console.log("CARE PACKAGE CHECKS PASSED");
} catch (e) {
  if (ws) {
    try {
      const c = await new Promise((resolve) => {
        const i = 99999;
        ws.addEventListener("message", function listener(event) {
          const m = JSON.parse(event.data);
          if (m.id === i) {
            ws.removeEventListener("message", listener);
            resolve(m.result);
          }
        });
        ws.send(
          JSON.stringify({
            id: i,
            method: "Page.captureScreenshot",
            params: { format: "png" },
          }),
        );
      });
      fs.writeFileSync(
        path.join(out, "birthday-failure.png"),
        Buffer.from(c.data, "base64"),
      );
    } catch {}
  }
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
