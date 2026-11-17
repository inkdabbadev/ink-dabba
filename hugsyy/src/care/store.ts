import { create } from "zustand";
import { CARE_KEY, freshCare, hydrateCare, settlePosition } from "./logic.mjs";
import type { CareData } from "./types";
interface CareStore {
  data: CareData;
  ready: boolean;
  error: string;
  load: () => void;
  update: (fn: (d: CareData) => CareData) => void;
  move: (id: string, x: number, y: number) => void;
  raise: (id: string) => void;
  visit: (id: string) => void;
  reset: () => void;
}
let timer: ReturnType<typeof setTimeout> | undefined;
export const useCare = create<CareStore>((set, get) => ({
  data: freshCare() as CareData,
  ready: false,
  error: "",
  load() {
    if (get().ready) return;
    try {
      const raw = localStorage.getItem(CARE_KEY);
      const data = hydrateCare(raw) as CareData;
      if (!raw)
        data.reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
      set({ data, ready: true });
    } catch {
      set({
        ready: true,
        error:
          "Your browser cannot keep this box between visits. You can still play.",
      });
    }
  },
  update(fn) {
    set((s) => ({ data: fn(s.data) }));
    clearTimeout(timer);
    timer = setTimeout(() => {
      try {
        localStorage.setItem(CARE_KEY, JSON.stringify(get().data));
      } catch {
        set({ error: "The box could not save. Local storage may be full." });
      }
    }, 160);
  },
  move(id, x, y) {
    const p = settlePosition({ x, y }, id, get().data.objects);
    get().update((d) => ({
      ...d,
      objects: d.objects.map((o) => (o.id === id ? { ...o, position: p } : o)),
    }));
  },
  raise(id) {
    get().update((d) => ({
      ...d,
      objects: d.objects.map((o) =>
        o.id === id
          ? {
              ...o,
              zIndex: Math.min(
                999,
                Math.max(...d.objects.map((a) => a.zIndex)) + 1,
              ),
            }
          : o,
      ),
    }));
  },
  visit(id) {
    if (get().data.visited.includes(id)) return;
    get().update((d) => ({ ...d, visited: [...d.visited, id] }));
  },
  reset() {
    clearTimeout(timer);
    set({ data: freshCare() as CareData });
    try {
      localStorage.removeItem(CARE_KEY);
    } catch {}
  },
}));
if (typeof window !== "undefined")
  window.addEventListener("pagehide", () => {
    if (useCare.getState().ready)
      try {
        localStorage.setItem(CARE_KEY, JSON.stringify(useCare.getState().data));
      } catch {}
  });
