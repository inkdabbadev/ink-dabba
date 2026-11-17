# Dear JV — A Little World for You

A browser-only birthday adventure made for JV: an intentional envelope and letter, an illustrated world, a real 3D Cake Lab, a colouring and drawing studio, an editable Memory Garden, a playable butterfly-guiding forest, and a finale assembled from the player's actual creations.

## Run locally

Requires Node.js 22.12 or newer and npm.

```sh
npm install
npm run dev
```

Open the Local URL printed by Vite, normally `http://127.0.0.1:5173`. In this Windows workspace you can also double-click `start-local.cmd`; it uses the supplied portable runtime when available. No account, API key, environment variables, or server database is required. Opening `index.html` directly from disk is not supported; use the dev server or the built preview.

```sh
npm run typecheck
npm run lint
npm test
npm run build
npm run preview
```

This Windows workspace also has a portable Node and npm outside this project at `../.site-tools/node.exe` and `../.site-tools/npm/package/bin/npm-cli.js`. Standard npm commands are recommended on other machines. The original working cake studio was preserved, unchanged, at `public/original-cake-studio/` and is served at `/original-cake-studio/`.

## Build and deploy to Vercel

This is a static client application built with Vite, React, and TypeScript. A server-rendered Next.js application would add no necessary backend behavior for this game. React Three Fiber runs the real Three.js cake scene. The Canvas API runs drawing, composition, transition effects, and the forest. Custom original SVGs supply the illustrated world and colourable assets. Dependencies are deliberately limited; there are no remote model, music, AI, or database services.

1. Commit this `dear-jv` directory as a project, excluding `node_modules`, `.local`, and `dist`.
2. Import its repository into Vercel and set the project root to this directory.
3. Select the Vite preset, Node 22, build command `npm run build`, output directory `dist`.
4. The supplied `vercel.json` provides build settings and response headers.
5. Review the content and sample memories before publishing. Deploy through Vercel's UI, or authenticate locally and run `npx vercel` for a preview and `npx vercel --prod` when ready.

No deployment or external repository changes were performed for this project. Vercel instructions are a handoff, not a claim that a public URL exists.

## The adventure

- **Envelope:** remains sealed until explicitly clicked/tapped. The flap opens, the letter slides up, and the full letter waits for an intentional Continue action.
- **World:** original illustrated destinations in a single explorable landscape. Cake, art, and garden are available from the outset. Three garden discoveries reveal the forest; six guided forest butterflies reveal the pavilion. Completed activities remain editable.
- **Cake Lab:** five flavors, one to three tiers, three frosting styles, arbitrary frosting color, adjustable coverage, direct piping, eleven procedural decoration types, spatial placement, moving, sizing, rotation, duplication, removal, undo/redo, orbit, zoom, candle lighting, save stamp, and PNG capture. All cake changes persist as structured state.
- **Colouring Studio:** five original closed-region illustrations plus a blank page; reliable region fills; pencil, brush, eraser, brush size, any color, eight original sticker types, sticker transforms, undo/redo, explicit save, automatic drafts, and PNG export.
- **Memory Garden:** five discoverable objects. Samples are explicitly labeled and never presented as factual memories. Text, captions, photos, and optional audio can be customized on the device.
- **Forest:** six butterflies follow a nearby glowing pointer around mushroom obstacles toward a golden tree. Mouse, touch, keyboard, and a complete guided alternative are supported. No time limit, failure state, or punishment.
- **Finale:** uses the actual saved cake configuration and explicitly saved artwork, the real collection count, an intentional gift reveal, the editable final message, replay, artwork download, keepsake composition, and return paths.
- **Pip:** original pixel elephant with stateful dialogue, idle movement, blinking, curious/happy/walking/celebration reactions, and dismissible speech.
- **Passport/settings:** six earned stamps, explicit progress, global sound controls, reduced motion, lightweight 3D, clearer-reading mode, and an explicitly confirmed whole-adventure reset.

## Architecture

```text
src/
  App.tsx                       App shell, lazy scene router, transition coordination
  core/
    types.ts                    Structured game, cake, artwork, and sticker types
    logic.mjs                   Versioned save sanitizer + pure forest movement
    store.ts                    Shared subscribed state, localStorage, IndexedDB
    audio.ts                    Original synthesized, user-enabled sound effects
    journey.ts                  Central navigation context
  content/
    birthday.ts                 Recipient, letter, finale, memories, dialogue, stamps
    illustrations.ts            Five original colourable SVG illustration generators
  components/
    Art.tsx                     Original world SVGs, landmarks, icons, pixel creatures
    Transition.tsx              Reusable canvas pixel butterfly transitions
    UI.tsx                      Accessible modals, journal, settings, scene headings
  scenes/
    Intro.tsx                   Sealed envelope and letter
    World.tsx                   Illustrated destination hub
    CakeLab.tsx                 R3F cake editor + reusable CakeStage/CakeModel
    ColouringStudio.tsx         SVG fill, raster drawing, sticker and export engine
    MemoryGarden.tsx            Memories, local media personalization and collection
    Forest.tsx                  Pointer/touch guiding mechanic and portal
    Finale.tsx                  Real creations, gift, message and keepsake
  styles.css                    Shared art direction, responsive layouts, motion
```

The centralized `scene` enum is the only active-scene state. `JourneyContext.go` owns navigation and progression checks; the canvas transition commits the next scene at its midpoint. Scenes are lazy-loaded, and inactive 3D/canvas scenes unmount and cancel animation frames. The 3D engine is a separate lazy chunk; the opening does not download the cake engine.

## Personalize it

### Shared content shipped to JV

Edit `src/content/birthday.ts`:

- `recipient`, `title`, `subtitle`
- `letter`, `finale`, `gift`
- `memories` (stable IDs should stay unchanged)
- elephant dialogue
- achievement titles and descriptions

The supplied letter and final message are the default text from the project brief. The sample memories deliberately do not invent events.

To add photos or audio for **everyone who opens the deployed game**, place your authorized files under `public/memories/` and reference them in the corresponding memory:

```ts
{
  id: 'camera',
  title: 'Your actual memory title',
  object: 'camera',
  sample: false,
  text: 'Your true story, in your own words.',
  caption: 'Who, where, and why this matters.',
  photo: '/memories/your-photo.jpg',
  audio: '/memories/your-message.mp3',
}
```

Use reasonably sized images and short audio. No missing asset paths are supplied by default. To change the original drawings, edit `src/content/illustrations.ts`; each fillable shape has a stable `data-region` ID. The world, characters, icons, and landmark art are in `src/components/Art.tsx`. Palette, typography, spacing, and responsive composition are in `src/styles.css`.

### In-game personalization

Open a memory and choose **Personalise this memory**. The editor accepts text, captions, an image, and optional audio. Images are resized to at most 1200px and stored as JPEG; files are limited to 8 MB each.

**In-game uploads and edits stay only in the current browser. They do not automatically become part of a deployed gift or transfer to JV's device.** Edit the shared configuration and add public files to ship personalized content. Browser-local memory edits override the bundled sample only on that device.

## Persistence

- `localStorage['dear-jv:save:v1']` contains validated, versioned progress: letter, current scene, achievements, the entire structured cake, discovered memories, rescued butterfly IDs, gift state, preferences, and memory text overrides.
- Cake decorations save their ID, type, 3D position, size, rotation, and random seed. Rendering uses those saved values, not a screenshot. The same `CakeStage` renders that state in the editor and finale.
- Saves debounce by 120ms and flush on page hide. Invalid JSON and unsupported versions safely recover to a sealed first visit. Invalid positions, colors, kinds, and progression are bounded or sanitized.
- IndexedDB database `dear-jv-art`, store `creations`, holds `art-draft`, `artwork`, and `memory:<id>` media. Drawing saves include the chosen template, region fills, transparent ink PNG, editable sticker transforms, and a composited preview. Drafts save automatically; **Keep my artwork** saves the version used in the finale.
- Progress is device/browser/origin-specific. Clearing site data, changing origin, or private-browsing storage restrictions may remove it. There is no cloud sync. PNG downloads and the finale keepsake provide portable outputs.
- Storage failures show feedback rather than silently claiming a successful save. Full reset clears both stores only after confirmation.

## Input and accessibility

Use trackpad two-finger scrolling to orbit, pinch to zoom, and select Rotate tool for click-and-drag inspection. Touch supports direct placement and two-finger pinch. On-canvas buttons also rotate and zoom. The Add button places a decoration without precise dragging; selection controls handle resizing, turning, duplication, and removal. Forest guiding has arrow-key controls and a complete assisted alternative. Fill, stickers, and drawing use pointer events for mouse/touch/pen. Modals use native dialog focus management, Escape, visible focus, and a dismiss button. Audio remains off until explicitly enabled. No microphone permission is requested.

## Verification

See `VERIFICATION.md` for the actual completed checks and limitations. Unit tests run with `npm test`. The checked-in browser journey harness uses Chrome DevTools Protocol and an isolated profile under `.local/browser-profile`; it never operates on the user's ordinary Chrome profile. It clears only that test origin's data in that isolated profile. Run a dev server on port 4173, then:

```sh
npm run dev -- --port 4173
node tests/browser.mjs
```

On Windows the harness defaults to `C:/Program Files/Google/Chrome/Application/chrome.exe`. Set `CHROME_PATH` for another installation. It writes screenshots, browser assertions, and downloaded PNGs under `.local/`. Those files are excluded from source control.

## Practical limitations

- Personal photos, actual memories, and inside jokes have not been supplied. The clearly marked sample memories must be replaced before a fully personal handoff.
- 3D requires WebGL. A clearly labeled lightweight 2D configuration view preserves editing/saving controls if WebGL is unavailable; it does not pretend to be 3D. Mobile performance depends on hardware; the lightweight setting reduces resolution and shadows.
- No microphone blowing is implemented; the accessible candle button is the supported alternative.
- Fonts request Google Fonts when online; local system fonts provide fallbacks. All gameplay artwork, geometry, sounds, and saves work without a third-party asset account.
- Browser checks emulate a phone; they do not replace hands-on checks on JV's actual phone or laptop.
- The optional artwork-free/cake-free finale shows honest links back to those activities rather than fabricating creations. Complete and save them to fill the celebration with JV's work.

### Additional input and media checks

After a complete journey on the development origin, `node tests/interactions.mjs` exercises actual touch drawing/erasing, sticker dragging, 3D dragging, trackpad gestures, and WebGL recovery. After a complete journey on any tested origin, `node tests/media.mjs` checks the memory photo/audio upload path; set `GAME_URL` to that origin if it differs from port 4173. The production journey was also run against the built preview on port 4177. See `VERIFICATION.md` for the executed results.
