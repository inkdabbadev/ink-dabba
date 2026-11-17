# ink-dabba /hugsyy integration - 17 November 2026

The full project is copied under hugsyy/ and served by the parent site's /hugsyy route in a same-origin frame. The root prebuild exports this app with basePath /hugsyy/experience and copies its output to ignored public assets. The two Next.js versions and global styles stay separate. The parent TypeScript build excludes this standalone source tree.

Passed: combined production build (nested Next.js 15 export and parent Next.js 14 build), 10 unit tests, and the complete browser journey through http://127.0.0.1:5176/hugsyy with CARE_EMBEDDED=1. The harness selects the actual child frame's execution context while dispatching native mouse/touch input. It verifies microphone calibration/blowing/cleanup, all five workshops, empty bouquet defaults, stem dragging, balloon stages, saved creations, refresh and replay, narrow screens and landscape. No uncaught browser errors; the phone opening screenshot was inspected.

HTTP checks confirm that / and the existing studio pages keep microphone=(), while /hugsyy and its local child allow microphone=(self). The child's SAMEORIGIN frame policy and frame-ancestors self allow only the same-site wrapper. Physical phones were not tested. Evidence is in hugsyy/.local/care/results.json and screenshots (ignored).

---

# Balloon and bouquet correction - 17 November 2026

Removed starter bouquet flowers from fresh state and added a narrow migration for the exact untouched legacy preset; edited arrangements survive. The balloon now receives direct tap/drag input on the displayed object, with deflated and inflated stages before the animal takes shape. Both mobile editors keep their preview visible while their controls scroll. Flower supply touch handling adds once on tap and prevents scroll cancellation while dragging. Sender text and accessibility labels use Hugsy.

Ten unit tests pass, including empty defaults, legacy starter removal and preservation of personal edits. Production export passes. The browser journey includes direct balloon drag/tap, all three shape selections, undo/restart, an empty bouquet assertion, flower placement and saved-state checks. Additional phone checks exercise balloon tapping and finger twisting, emptying the wrap, adding one flower per tap/drop, and repositioning a stem with a finger.

The final production browser journey passes with no uncaught errors. Native emulated touch at 320px verifies one balloon advance per tap/drag, dog and flower completion, exactly one stem per flower tap/drop, and repositioning the visible editor stem. The test hit-checks that stem inside the workshop; an earlier test incorrectly targeted the duplicate miniature. Flower grab areas are enlarged and capture the pointer; interactive previews have no CSS perspective. Empty bouquet and balloon screenshots were inspected. A scan confirms no Harsh references remain in source or the served export. Physical phones were not tested.

---

# Birthday wish and microphone - 17 November 2026

The opening adds Start, birthday music, greeting, bunting, balloons, confetti, a five-candle cake, microphone blowing, tap fallback and continuation to the preserved box. Desktop invitation/celebration/wish screenshots are under .local/care/prelude-*.png.

tests/birthday-browser.mjs feeds a deterministic WAV through Chrome's fake microphone device into the actual getUserMedia/AudioContext/AnalyserNode pipeline. It checks no capture on load, denied permission with candles still lit, explicit tap fallback, quiet calibration, rejection of a brief noise, successful sustained input and ended microphone tracks after success. This tests the browser audio pipeline rather than replacing the detector with a mocked callback. Browser device simulation cannot establish sensitivity on physical microphones.

The opening reference is https://github.com/ProgrammerGaurav/happy-birthday. Artwork and implementation here are original. No deployment was performed.

Final production journey passes with no uncaught browser errors, including microphone extinguishing in the DIY cake workshop, phone microphone Stop/restart with ended tracks, the 320px tap fallback, replay preserving all five gifts, and the existing parcel/workshop/save checks. Phone opening screenshots were inspected at 390px and 320px. Production export, TypeScript/ESLint checks during build, and all 9 unit tests pass. Physical microphone sensitivity and physical iOS/Android hardware were not tested.

---

# Cake follow-up - 17 November 2026

Corrected icing mode so starting on an existing topper draws instead of silently moving the topper, in both WebGL and SVG editors. Restored touch-action:none on decoration supplies, overriding the broad button rule that allowed browser scrolling to cancel drags. Topper selection also handles ordinary click events. The mobile cake workshop now keeps a visible preview above an independently scrolling control panel.

The browser journey adds piping from an occupied location and an actual mobile supply-to-cake finger drag. It checks that the destination is visible and hit-tests to the canvas, and verifies that the drop adds a decoration. The phone cake screenshot was visually inspected. Production export and scoped lint pass.

---

# Native input and restored claw audit - 17 November 2026

Earlier checks activated several buttons through DOM click calls; those checks were insufficient to establish real pointer usability. The current harness uses native mouse/touch events and checks the hit target before activating controls. It also performs a real emulated finger swipe to verify page scrolling.

Fixed the inherited html/body overflow lock, parcel handlers that ignored ordinary pointer clicks, transformed interactive hit surfaces, and mobile workshop layout. Restored the fifth gift, the claw machine, with arrow clicks, held controls, keyboard aiming, grabbing, win/miss feedback, replay and persistent prizes kept in the box. Closing the workshop cancels active grabbing and held movement.

TypeScript, scoped ESLint, all 9 unit tests and the production export pass. Browser evidence is recorded by tests/birthday-browser.mjs under .local/care, including results.json and claw-restored-phone.png. The journey covers parcel dragging/tapping, envelope and letter progression, all five gifts, 3D and fallback cake input, bouquet manipulation, photo collection, save restoration, reduced motion, keyboard focus and Escape. Responsive checks cover 320px, 390px, 768px, 1024px and 844x390 landscape. These are Chrome emulation checks; physical phones were not tested. The test profile is separate from the user's browser. No external deployment was performed.

---

# Full interaction audit - 17 November 2026

The full active journey was rechecked on development and on the rebuilt production export at http://127.0.0.1:5173. TypeScript, scoped ESLint, all 9 unit tests, and the Next.js static production build pass. The browser journey records no uncaught exceptions.

Issues found and fixed: the flower supply still targeted the removed .is-focused layout; inherited pointer-events:none prevented direct bouquet manipulation and touch editing of the SVG cake fallback; bouquet colour inputs were squeezed by the old flex layout. Supply drops now target the current workshop, stem dragging preserves the grabbed offset and cleans up window listeners, the active SVG surfaces receive pointer input, and colour inputs use two full-width columns.

Expanded browser verification includes actual flower supply dragging and stem repositioning, paper/ribbon/tag updates, all three photo uploads with separate captions and collection state, complete save restoration, native touch placement onto the cake fallback during forced WebGL loss, and restoration of the 3D context. Keyboard tests verify focus wrapping, Escape, and focus return to the selected gift. All four workshops were checked at 320px, 768px and 1024px for viewport overflow and controls outside the viewport, in addition to the 1440px desktop and 390px touch journey. The 320px bouquet and desktop bouquet screenshots were visually inspected. The earlier ribbon, envelope, letter, balloon, 3D cake, undo/redo, replay and reduced-motion checks also pass.

Evidence: tests/birthday-browser.mjs and .local/care/results.json; screenshots include audit-320-bouquet.png and birthday-06-bouquet.png. Mobile tests use Chrome emulation; physical iOS/Android devices were not tested. User browser data was untouched: the harness uses a separate Chrome profile. No external deployment was performed.

---

# Dimensional gift experience - 17 November 2026

Current entry: src/care/BirthdayBox.tsx, with src/care/experience.css and a lazily loaded native Three.js renderer in src/care/ToyCanvas.tsx. The dimensional packaging uses CSS perspective, depth, and a lid exit animation; the balloon and cake are rendered WebGL geometry with lights and shadows.

Passed: TypeScript, scoped ESLint, 9 unit tests, and Next.js production static export. Initial route JavaScript is 171 kB; Three.js loads when the gifts are revealed. The existing Next ESLint-plugin detection advisory remains non-fatal.

The expanded tests/birthday-browser.mjs passed on the development preview and on the final production export at http://127.0.0.1:5173. It verifies actual ribbon/bow and tab dragging, envelope chase and letter progression, two rendered 3D miniatures, balloon drag-to-twist, real raycast cake placement, continuous 3D icing, turning the model and dropping a topper onto the rotated cake, undo/redo, bouquet editing, real photo upload and collection, and refresh restoration. At 390px it verifies touch drawing on the actual 3D cake, no horizontal overflow, forced WebGL loss with a preserved interactive SVG fallback, and context restoration. The settings replay preserves cake/bouquet/photos; reduced motion bypasses the chase. No uncaught browser exceptions were recorded.

Production screenshots were inspected for the parcel and the phone cake editor; desktop gifts, balloon workshop and cake were also visually reviewed. Screenshots/results are under .local/care. Test imagery is synthetic, and these are Chrome-emulation checks, not physical-device certification. No deployment was performed.

Earlier records below describe earlier implementations.

---

# Birthday box - 17 November 2026

Active implementation: src/care/BirthdayBox.tsx. Type checking, scoped lint and all 9 unit tests pass. Next.js production static export passes (169 kB first-load JS for the main route). Next reports an existing ESLint-plugin detection advisory; scoped ESLint succeeds.

The current isolated Chrome journey (tests/birthday-browser.mjs) passes against both development and production export on port 5173. Verified: real pointer drag of the ribbon and perforated tear strip, lid opening to an envelope only, three failed pointer attempts then letter opening, Hugsy signature, explicit reveal of exactly four gifts, balloon steps and shape reset, cake flavor editing, adding a bouquet stem, actual photo file-input upload/resizing, captions and Polaroid collection, all four creations restored after refresh, and 390px touch workshop opening without horizontal overflow. No uncaught browser errors. Screenshots and results are in .local/care/birthday-*.png and results.json. Desktop parcel/gifts/cake and phone balloon-workshop screenshots were inspected.

Phone checks use Chrome emulation, not physical hardware. Personal photos must be chosen by the recipient; no real photographs are bundled. Browser-local saves do not sync. The earlier verification below describes the preserved adventure, not the active birthday box.

---

﻿# Verification record

Executed on 14 November 2026 in Windows, using portable Node.js 22.16.0 and installed Google Chrome. Browser checks use isolated test data and a separate Chrome profile. No external deployment was performed.

## Automated checks

- `npm run typecheck`: passed.
- `npm run lint`: passed (ESLint and TypeScript recommended rules).
- `npm test`: 7 tests passed. Covers first-visit defaults, corrupt/future save recovery, structured cake restoration, invalid state sanitization, forest following and obstacle boundaries, and restored finale progression.
- `npm run build`: passed. Produces `dist/` with lazily loaded chapters and 3D engine.
- Production build size: initial JavaScript approximately 176 kB / 59 kB gzip; CSS approximately 43 kB / 11 kB gzip. The cake engine/editor is lazy-loaded at approximately 844 kB / 228 kB gzip. Vite reports the standard >500 kB lazy-chunk advisory; it is not an initial-page download or a failed build.

## Complete browser journey

`GAME_URL=http://127.0.0.1:4177 node tests/browser.mjs` against the built production preview:

- Envelope remains sealed without input.
- Intentional opening displays the letter; reading does not auto-advance.
- Intentional continuation reveals the illustrated world.
- Three-tier 3D cake, frosting change, decoration inventory, duplication, removal/history, explicit save, return, and refresh restoration.
- Closed-region illustration fill, undo/redo, actual brush strokes, sticker placement/resize, IndexedDB save, PNG export, and restoration after refresh.
- Three garden discoveries, clearly labeled sample content, editable memory text, collection progress, and passport update.
- All six butterflies guided along the actual assisted navigation paths around forest obstacles; the real rescue state unlocks the pavilion.
- Finale renders the saved cake and exact saved artwork preview, real collection counts, gift reveal, default final message, and all six earned stamps.
- Artwork PNG and composed keepsake PNG written by Chrome to the local downloads folder.
- Finale restored after refresh.
- Responsive world, cake, art, and finale views checked at 390px width without horizontal overflow.
- Reduced-motion preference persists.
- No uncaught browser runtime errors in the completed journey.

## Direct interaction checks

`node tests/interactions.mjs`, after the main journey on the development origin:

- Real Chrome touch input draws on the raster layer.
- Real touch erasing removes the tested pixel alpha.
- Real touch input repositions a sticker; the artwork saves successfully.
- Actual raycast picking and pointer dragging move a visible 3D decoration while preserving the other saved decorations.
- Trackpad-style horizontal wheel input changes the rendered orbit; Ctrl-wheel pinch input changes the rendered zoom.
- Forced WebGL context loss preserves the structured editable cake and exposes the honest fallback; retry recreates the 3D scene.
- No uncaught browser runtime errors in the successful direct-input run.

## Memory media checks

`GAME_URL=http://127.0.0.1:4177 node tests/media.mjs`, after the main journey:

- Original test image created in the browser, uploaded through the real file input, decoded, resized, and stored as JPEG.
- Original short WAV created in the browser, uploaded through the real file input, stored, and decoded to valid audio metadata.
- Customized text/caption and media saved together.
- Personalized content is not mislabeled as a sample.
- Photo and text restored after a page refresh.
- No uncaught browser runtime errors in the successful media run.

## Art direction review

Captured desktop and phone screenshots were inspected for the sealed opening, readable letter, illustrated map, cake editor, art studio, garden, forest, finale, and passport. Representative actual screenshots are in `docs/preview/`. The art is original SVG/procedural work; no generated image claims, generic stock art, or emoji-based game assets are used.

## Limits of verification

Phone layouts and touch were tested through Chrome emulation, not physical iOS/Android hardware. Native download behavior and GPU performance can vary by device. The WebGL fallback is deliberately labeled as a lightweight configuration view. Optional microphone blowing is not implemented. Shared personal memories/photos still need to be supplied; bundled entries remain explicit samples.

Browser logs, assertions, screenshots, and generated downloads are under `.local/` and excluded from source control. The browser harnesses clear only the isolated test origin when starting a first-visit journey; they do not use the ordinary user browser profile.
