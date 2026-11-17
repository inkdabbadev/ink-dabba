# Care package implementation plan

Replace the active chapter interface with one continuous, coordinate-based tabletop. Keep the previous adventure source and old saves intact. Use Next.js App Router, TypeScript, Motion springs, Zustand persistence, and original SVG art.

- Opening: intentional ribbon, tape, and lid actions, each with drag and tap alternatives.
- Objects: reusable pointer engine, movement threshold, direct motion values during drag, persistent coordinates/rotation/z-order, boundary and gentle overlap handling, keyboard move controls.
- Camera: focus objects in the same scene without routes or page replacements; tabletop remains visible.
- Letter: envelope -> pulled sheet -> unfolded paper -> refold and return, in scene.
- Bouquet: individual stems, wrapping, ribbon, note, selection editing, persistent composition.
- Cake: free placement, continuous icing paths, editable toppers, candle controls, persistent miniature, undo/redo.
- Arcade: moving claw, lower/grab/lift/deliver cycle, real hit detection, forgiving aim, miss state, replayable collected prizes.
- Personal objects: penguin wobble, elephant reactions/flower, coffee message underneath, racing car, rose dome, robot, hidden photo and final note.
- Accessibility: native controls, tap alternatives, keyboard movement, reduced motion, sound off by default, confirmed reset.
- Verification: pure mechanics and save unit tests, typecheck, lint, Next production export, isolated Chrome pointer/touch journey, refresh persistence and mobile layout.

No reference videos were supplied. No invented shared memories. No deployment without the authorization required by the previous project brief.
