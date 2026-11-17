# Verification record

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
