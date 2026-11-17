# Balloon, bouquet and sender corrections - 17 November 2026

The sender is Hugsy throughout the site. Bouquets now start with empty paper. Loading an untouched five-flower legacy starter removes that preset; arrangements with personal changes are preserved. Clear bouquet removes stems without changing the paper, ribbon or tag.

Balloon making acts directly on the balloon: tap or drag it to inflate, then form the head/ears, front legs and back legs/tail. Dog, bunny and flower shapes have their own instructions. Undo, restart and colour choices remain available. The first stage is visibly deflated and the second is a straight inflated balloon; gift miniatures reflect the actual saved stage. On phones the balloon and bouquet stay visible above scrollable controls, and flower supply buttons support touch dragging.

---

# Birthday wish opening - 17 November 2026

The first visit in each tab now opens with a Start invitation, then a birthday greeting for JV, bunting, rising balloons, confetti, locally synthesised birthday music and a candle cake. Make a wish and blow into the microphone, or use the explicit tap alternative, before continuing to the existing birthday box. Settings > Replay the birthday wish repeats the celebration without clearing any gifts. Refreshes in the same tab resume the box after the opening has been completed.

Microphone access is requested only after pressing its button. The browser analyses audio locally, calibrates against room noise, and requires sustained energy rather than a single brief spike. Nothing is recorded or uploaded. Music stops before listening. Microphone tracks and the audio context close on success, Stop, leaving the screen, hiding the tab, or unmounting. Denied/missing microphones leave the tap alternative available. Microphone capture needs localhost or an HTTPS host; ordinary HTTP on a phone's LAN address cannot use it.

The cake workshop also supports microphone blowing. Light candles adds a candle if the cake has none. The opening follows the Start / greeting / balloons / confetti / cake sequence from [ProgrammerGaurav's reference](https://github.com/ProgrammerGaurav/happy-birthday), with original React, SVG, CSS and synthesised audio here. No reference repository assets or JavaScript libraries were copied.

Implementation: src/care/BirthdayPrelude.tsx, prelude.css, CandleBlower.tsx and useBlowCandles.ts. The existing browser-local creation save format is unchanged. Older implementation records below describe earlier versions.

---

# Click, touch and claw restoration - 17 November 2026

The active experience has five gifts again: cake, balloon animals, Polaroids, bouquet and the claw machine. Claw prizes can be kept in the box, including previously earned prizes. Normal taps open the ribbon and tear strip; dragging still works. Interactive surfaces use stable hit areas, while dimensional artwork remains.

The inherited fixed-tabletop page scroll lock has been removed so phone swipes can reach lower gifts. Workshop controls and close buttons remain reachable on narrow screens and short landscape windows. The local static server disables caching so refreshed pages receive the latest build. Refresh the existing localhost tab to preserve its browser-local saves; localhost and 127.0.0.1 have separate storage.

Current checks are in tests/birthday-browser.mjs, using native mouse/touch input and hit testing, including actual phone swipes. Older implementation records below describe earlier versions.

---

# Gift experience redesign - 17 November 2026

The active birthday box now uses dimensional CSS packaging with pointer-responsive perspective, a satin-release and tear-strip sequence, and an opening lid transition. The open box has a tissue-lined, asymmetrical arrangement. Cake and balloon objects use lazily loaded native Three.js: glossy balloon sculptures, shaded cake geometry, real raycast cake decoration and icing paths, and turntables. Balloon making also has a drag-to-twist gesture. Polaroids develop on upload and receive a collection stamp.

src/care/experience.css contains the art direction; src/care/ToyCanvas.tsx owns the renderer, raycasting, geometry and WebGL fallback. Native Three.js is used directly to work with this project's React/Next configuration. Offscreen scenes and scenes behind a workshop pause rendering; geometry and listeners are disposed on unmount. The original SVG editors remain interactive fallbacks. The saved cake and bouquet are shared by the miniature and workshop.

Settings > Replay the opening preserves creations and photos. Settings > Repack the box remains the confirmed destructive reset. Local preview: http://127.0.0.1:5173. The older implementation notes below are retained for history.

---

<!-- birthday-box-update -->
# Birthday box update - 17 November 2026

The active entry is now src/care/BirthdayBox.tsx. Open the satin ribbon with a downward pull, tear the perforated strip to the right, and lift the lid. Button alternatives are available. The box first reveals a playful envelope: three pointer attempts shrink/move it, then it opens a birthday letter signed by Hugsy. Keyboard activation and reduced motion skip the dodge. Only the letter's explicit continuation reveals the four gifts.

The four workshops are cake decorating, a step-by-step balloon dog/bunny/flower, personal Polaroid upload/captions/collection, and bouquet arranging. Extra toys, arcade, final-letter progression and decorative instructions are removed from the active experience. The old implementation below is retained as historical documentation.

Photos are resized locally and saved in this browser alongside the creations; three Polaroids can be collected. No personal photographs are bundled. Edit the letter in src/care/BirthdayBox.tsx and styling in src/care/birthday.css. Existing cake, bouquet and care-package saves are preserved; giftsRevealed, balloon and polaroids extend the version-2 save with safe defaults. The envelope remains the first reveal when opening an older save.

Checks: npm run typecheck, npm run lint, npm test, npm run build. The current browser journey is node tests/birthday-browser.mjs (isolated Chrome profile; results and screenshots under .local/care). Older care-browser.mjs covers the previous tabletop and is no longer the active journey. Use Settings > Repack the box to replay the opening; this explicitly clears creations and uploaded photos.

---

﻿# JV's Little World — A Birthday Care Package

A single, continuous illustrated tabletop. Unwrap a parcel, pick up its contents, unfold a letter, arrange individual flowers, decorate a miniature cake, play the claw machine, move plush friends around, and discover a last little birthday note. There are no activity routes, navigation menus, locked chapters, or next/previous flows.

## Play locally

On this Windows workspace, double-click **`start-local.cmd`** and open **http://127.0.0.1:5173**. The launcher uses the portable Node already present in `../.site-tools` when available. Leave its terminal running while you play.

On any machine with Node.js 22 and npm:

```sh
npm install
npm run dev
```

The app uses Next.js App Router, React, TypeScript, Tailwind CSS, Motion for springs/camera movement, Zustand for state, original SVG art, and native Web Audio. No account, environment variable, external database, paid API, WebGL, or microphone is needed. The earlier React Three Fiber adventure source remains in `src/scenes`, `src/components`, and `src/core`; its documentation is preserved under `docs/previous-adventure/`. Its save key is not changed by the new care package.

## What to touch

- **Parcel:** pull or tap the ribbon, peel or tap the tape, then lift/tap the lid. Fold back the tissue to reveal the contents. It never opens itself.
- **Loose gifts:** drag to move, tap/click to interact. A movement threshold prevents dragging from opening an activity. Objects lift, come to the foreground, settle inside safe bounds, and keep their positions. Arrow keys move a keyboard-focused object; `[` / `]` turn it; Enter opens it. Escape puts it back.
- **Letter:** tap the envelope, pull the sheet out, unfold it, read at your own pace, and fold it again. The actual paper expands within the tabletop rather than opening a browser modal. The original envelope stays nearby.
- **Bouquet:** add or drag stems from the flower supply, drag individual flowers into position, turn/resize/remove them, pick wrapping and ribbon colors, and edit the gift tag. The finished arrangement remains in the box.
- **Cake:** vanilla, chocolate, or strawberry sponge; pink, cream, chocolate, or lavender frosting; continuous icing strokes; draggable cherry, strawberry, sprinkle, flower, star, candle, penguin, and elephant toppers. Move, resize, rotate, remove, undo, redo, and light/blow out candles. The miniature always uses the same saved design as its close-up.
- **Arcade:** aim with the slider, hold arrow controls, or tap the glass. Grab to lower, close, lift, and deliver. Actual proximity detection makes it possible to win or miss. No coins or punitive timers. Six prizes are collectible; delivered prizes can be placed on the table and moved like other gifts. Once all prizes are collected, the machine remains replayable.
- **Little surprises:** a message under the coffee cup, a wobbling penguin, an elephant that can hold a flower, a tiny red race car, a rose dome, an original friendly robot, a tucked-away photo, and cherries you can drag near the cake to add a topper.
- **Last note:** after interacting with the main gifts and winning a prize, a second envelope appears. It is an optional discovery; opening it triggers a brief celebration, and the rest of the box remains playable.
- **Comfort:** discreet sound and settings controls. Sound starts off. Reduced motion and clearer reading are available. Repacking the box requires explicit confirmation.

The default written content is deliberately not presented as real shared memories. No reference videos or personal photos were supplied with this request; the artwork and interactions are original implementations from the written brief.

## Personalize it

Edit **`src/care/content.ts`** for the recipient, parcel label, birthday letter, flower notes, cake note, arcade messages, coffee/plush surprises, photo, and closing message. Replace the letter with your own words and set `letterIsDefault: false` before gifting.

For a photo, add an authorized image to `public/memories/` and set:

```ts
photo: {
  src: '/memories/your-photo.jpg',
  caption: 'Your real caption.',
  note: 'Your own true memory.'
}
```

The photograph is only shown when a real source is supplied. Otherwise the scene contains an honest illustrated photo placeholder. Do not put private media in `public` unless you intend every recipient of the deployed site to be able to access it.

Art is in **`src/care/Artwork.tsx`**. Bouquet, cake, and arcade rendering live with their interaction components. Palette, textures, typography, responsive composition, and object depth are in **`src/care/care.css`**. Font requests have fallbacks and do not block gameplay.

## Architecture

```text
src/app/
  page.tsx                 One app route, one continuous environment
  layout.tsx               Metadata and global styles
src/care/
  CarePackage.tsx          Tabletop, parcel, physical letter, camera, focus and surprises
  InteractiveObject.tsx    Pointer thresholds, lift, Motion values, bounds, stacking, keyboard movement
  Artwork.tsx              Original illustrated gifts, flowers, butterflies and toy sprites
  Bouquet.tsx              Arrangement, individual stem dragging and material editing
  Cake.tsx                 Continuous SVG icing paths, spatial 2.5D toppers and controls
  Arcade.tsx               Claw phases, proximity detection, controls and reward tickets
  store.ts                 Zustand store, loading, debounced saves and page-hide flush
  logic.mjs                Pure save validation, bounds, gentle overlap handling, claw detection
  types.ts                 Shared object and creation models
  audio.ts                 Original subtle synthesized notes and paper/tape noise
  content.ts               All editable birthday text and messages
```

The scene graph remains mounted during focus. A spring moves the same board toward an object's coordinates; closing restores the overview. The workbench is a contextual stationery sheet, not a route or activity menu. Gift positions are normalized so the same arrangement adapts to desktop and portrait framing. Motion values update the lifted object directly during a drag; React/Zustand commits its position on drop rather than on every ordinary pointer movement. Safe boundaries and gentle separation of exact overlaps allow deliberate, natural layering without a heavy physics engine.

The former chapter app is preserved but is not the active entry point. `npm run legacy:dev` runs that older Vite adventure on port 5174 if needed. Old tests and verification describe that preserved version; use the care-package checks below for the current app.

## Saves

`localStorage['jv-care-package:v2']` stores the opening state, all object coordinates/rotation/z-order, continuous icing paths, editable cake toppers, candle state, individual flower stems, wrapping/ribbon/tag, collected prizes, visited gifts, final letter state, and preferences.

Saves debounce by 160 ms and flush on page hide. Data is versioned and sanitized: invalid colors, object types, coordinates, and opening sequences recover safely. A delivered prize restores its actual table position. No screenshot is used as the only representation of a creation. Resets clear this care-package key only and leave the previous adventure save untouched.

These saves are browser/device/origin-local. They do not travel with a ZIP or sync to JV's phone. Clearing browser data removes them. Undo/redo history is deliberately session-local; creations and positions persist.

## Checks

```sh
npm run typecheck
npm run lint
npm test
npm run build
```

`npm run build` produces the static **`out/`** directory. To test it locally, serve `out` using any static HTTP server. The isolated Chrome harness **`tests/care-browser.mjs`** exercises actual pointer/touch input; it writes results and screenshots under `.local/care` and uses its own browser profile. It defaults to port 5173; use `CARE_URL=http://127.0.0.1:5175` for a production-export preview. `CHROME_PATH` overrides the Windows Chrome default. The test clears only the test origin in that isolated profile, not your ordinary browser.

See **`VERIFICATION.md`** for the actual executed checks, screenshots, and remaining limits.

## Deployment handoff

No deployment is performed without the authorization required by the prior brief. To deploy this updated app to Vercel later:

1. Import this directory/repository and select Next.js with Node 22.
2. Use `npm run build`. The project uses static export; `out/` can also be hosted by any static host.
3. Review and replace default personal text and media before gifting.
4. There are no secrets or environment variables to configure.

The generated care-package ZIPs are separate from the earlier adventure ZIPs. Runtime caches, dependency directories, test profiles, and browser saves are excluded from the source package.

## Known limits

- Reference videos and the actual personal letter/photo/inside jokes were not provided. The central content file is ready for them; no factual shared memories were invented.
- The visual world and cake are intentionally 2.5D SVG, as requested. It uses real object manipulation and editable paths; it is not a full WebGL cake renderer. The previous 3D editor remains preserved in the old source.
- Collision handling is gentle separation of near-identical centers, not rigid-body physics. Intentional overlap is supported.
- Microphone blowing is not implemented. The candle button is the supported, permission-free alternative.
- Phone verification uses Chrome touch emulation; physical-device feel and performance can still vary. Fonts use Google Fonts when available, with local fallbacks.
