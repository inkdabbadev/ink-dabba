import {
  useEffect,
  useRef,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";
import { animate, motion, useMotionValue } from "motion/react";
import { boundPosition } from "./logic.mjs";
import { useCare } from "./store";
import { play } from "./audio";
import type { TableObject } from "./types";
export function InteractiveObject({
  item,
  width,
  height,
  zoom,
  focused,
  onActivate,
  onDrop,
  children,
  extraClass = "",
}: {
  item: TableObject;
  width: number;
  height: number;
  zoom: number;
  focused: boolean;
  onActivate: () => void;
  onDrop?: (x: number, y: number) => void;
  children: ReactNode;
  extraClass?: string;
}) {
  const x = useMotionValue((item.position.x / 1000) * width),
    y = useMotionValue((item.position.y / 1000) * height),
    lift = useMotionValue(0),
    drag = useRef<{
      id: number;
      sx: number;
      sy: number;
      ox: number;
      oy: number;
      moved: boolean;
      lastX: number;
      lastY: number;
    } | null>(null);
  const move = useCare((s) => s.move),
    raise = useCare((s) => s.raise),
    reduced = useCare((s) => s.data.reduced);
  useEffect(() => {
    if (!drag.current) {
      animate(x, (item.position.x / 1000) * width, {
        duration: reduced ? 0 : 0.23,
      });
      animate(y, (item.position.y / 1000) * height, {
        duration: reduced ? 0 : 0.23,
      });
    }
  }, [item.position.x, item.position.y, width, height, x, y, reduced]);
  function down(e: ReactPointerEvent<HTMLDivElement>) {
    if (
      focused ||
      e.button !== 0 ||
      (e.target as HTMLElement).closest("[data-no-drag]")
    )
      return;
    e.preventDefault();
    e.currentTarget.focus({ preventScroll: true });
    raise(item.id);
    x.stop();
    y.stop();
    drag.current = {
      id: e.pointerId,
      sx: e.clientX,
      sy: e.clientY,
      ox: x.get(),
      oy: y.get(),
      moved: false,
      lastX: e.clientX,
      lastY: e.clientY,
    };
    e.currentTarget.setPointerCapture(e.pointerId);
  }
  function finish(e: ReactPointerEvent<HTMLDivElement>) {
    const d = drag.current;
    if (!d || e.pointerId !== d.id) return;
    drag.current = null;
    animate(lift, 0, { type: "spring", stiffness: 360, damping: 22 });
    if (d.moved) {
      const p = boundPosition(
        (x.get() / width) * 1000,
        (y.get() / height) * 1000,
      );
      move(item.id, p.x, p.y);
      onDrop?.(p.x, p.y);
      play("drop");
    } else onActivate();
    e.currentTarget.releasePointerCapture(e.pointerId);
  }
  return (
    <motion.div
      data-object={item.id}
      role="button"
      tabIndex={0}
      aria-label={
        item.id === "final"
          ? "A last little birthday letter"
          : item.id === "arcade"
            ? "Tiny claw machine"
            : item.id === "bouquet"
              ? "Arrange your bouquet"
              : item.id === "cake"
                ? "Decorate your birthday cake"
                : item.id === "letter"
                  ? "Your birthday letter"
                  : "Pick up or play with the " + item.id
      }
      className={"table-object " + (focused ? "is-focused " : "") + extraClass}
      style={{
        x,
        y,
        zIndex: focused ? 1200 : item.zIndex,
        width: 0,
        height: 0,
        rotate: item.rotation,
        scale: item.scale,
      }}
      onPointerDown={down}
      onPointerMove={(e) => {
        const d = drag.current;
        if (!d || d.id !== e.pointerId) return;
        const dx = (e.clientX - d.sx) / zoom,
          dy = (e.clientY - d.sy) / zoom;
        if (Math.hypot(e.clientX - d.sx, e.clientY - d.sy) > 6 && !d.moved) {
          d.moved = true;
          animate(lift, reduced ? 0 : -8, { duration: 0.12 });
          play("pick");
        }
        if (d.moved) {
          const p = boundPosition(
            ((d.ox + dx) / width) * 1000,
            ((d.oy + dy) / height) * 1000,
          );
          x.set((p.x / 1000) * width);
          y.set((p.y / 1000) * height);
        }
        d.lastX = e.clientX;
        d.lastY = e.clientY;
      }}
      onPointerUp={finish}
      onPointerCancel={(e) => {
        if (!drag.current) return;
        drag.current = null;
        animate(lift, 0, { duration: 0.1 });
        move(item.id, (x.get() / width) * 1000, (y.get() / height) * 1000);
        if (e.currentTarget.hasPointerCapture(e.pointerId))
          e.currentTarget.releasePointerCapture(e.pointerId);
      }}
      onKeyDown={(e) => {
        if (focused || e.target !== e.currentTarget) return;
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onActivate();
        }
        if (
          ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key)
        ) {
          e.preventDefault();
          raise(item.id);
          move(
            item.id,
            item.position.x +
              (e.key === "ArrowLeft" ? -15 : e.key === "ArrowRight" ? 15 : 0),
            item.position.y +
              (e.key === "ArrowUp" ? -15 : e.key === "ArrowDown" ? 15 : 0),
          );
        }
        if (e.key === "[" || e.key === "]") {
          useCare
            .getState()
            .update((s) => ({
              ...s,
              objects: s.objects.map((o) =>
                o.id === item.id
                  ? {
                      ...o,
                      rotation: Math.max(
                        -180,
                        Math.min(180, o.rotation + (e.key === "]" ? 10 : -10)),
                      ),
                    }
                  : o,
              ),
            }));
        }
      }}
    >
      <motion.div
        className="object-lift"
        style={{ y: lift, width: item.metadata.w, height: item.metadata.h }}
      >
        <div className="object-paper-shadow" />
        {children}
      </motion.div>
    </motion.div>
  );
}
