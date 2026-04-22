"use client";

import Link from "next/link";
import { useState } from "react";
import { navItems } from "./site-data";

export default function Header({ current = "home", subpage = false }) {
  const [open, setOpen] = useState(false);

  return (
    <header className={`site-header ${subpage ? "site-header-subpage" : ""}`}>
      <Link className="brand" href="/" aria-label="Ink Dabba home">
        <img src="/Site%20Files/Asset%201-4x.png" alt="Ink Dabba logo" />
      </Link>

      <button
        className="menu-toggle"
        type="button"
        aria-expanded={open}
        aria-controls="site-menu"
        onClick={() => setOpen((value) => !value)}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      <nav
        id="site-menu"
        className={`main-nav ${subpage ? "main-nav-subpage" : ""} ${open ? "is-open" : ""}`}
        aria-label="Primary"
      >
        {navItems.map((item) => {
          const isCurrent =
            (current === "home" && item.href === "/") ||
            (current === "superpowers" && item.href === "/superpowers");

          return (
            <Link
              key={item.href}
              href={item.href}
              className={isCurrent ? "is-current" : ""}
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
