"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Menu, X } from "lucide-react";
import MiniCharacter from "./MiniCharacter";
import FlyingArmoredBuddy from "./MiniCharacter";

type NavLink = { name: string; href: string };

const navLinks: NavLink[] = [
  { name: "Home", href: "#home" },
  { name: "About", href: "#about" },
  { name: "Projects", href: "#projects" },
  { name: "Contact", href: "#contact" },
];

export default function Nav() {
  const scopeRef = useRef<HTMLDivElement | null>(null);
  const scrimRef = useRef<HTMLDivElement | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<HTMLDivElement[]>([]);

  console.log(itemRefs);
  const tl = useRef<GSAPTimeline | null>(null);

  const [isOpen, setIsOpen] = useState(false);

  const links = useMemo(() => navLinks, []);

  const openMenu = () => setIsOpen(true);
  const closeMenu = () => setIsOpen(false);

  const setItemRef = (el: HTMLDivElement | null, index: number) => {
    if (!el) return;
    itemRefs.current[index] = el;
  };

  useGSAP(
    () => {
      if (!overlayRef.current) return;

      // closed state
      gsap.set(scrimRef.current, {
        opacity: 0,
        pointerEvents: "none",
      });

      gsap.set(overlayRef.current, {
        clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
        pointerEvents: "none",
      });

      gsap.set(itemRefs.current, { y: 50, opacity: 0 });

      tl.current = gsap
        .timeline({
          paused: true,
          defaults: { ease: "power4.out" },
          onReverseComplete: () => {
            gsap.set(overlayRef.current!, { pointerEvents: "none" });
          },
        })
        // scrim fade in
        .to(scrimRef.current, {
          opacity: 1,
          duration: 0.35,
          pointerEvents: "auto",
          ease: "power2.out",
        })
        // overlay open
        .to(
          overlayRef.current,
          {
            duration: 0.55,
            clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
            pointerEvents: "auto",
          },
          "-=0.1",
        )
        // links fade in
        .to(
          itemRefs.current,
          {
            y: 0,
            opacity: 1,
            duration: 0.75,
            stagger: 0.08,
            ease: "power4.inOut",
          },
          "-=0.25",
        );
    },
    { scope: scopeRef, dependencies: [] },
  );

  useEffect(() => {
    if (!tl.current) return;
    isOpen ? tl.current.play() : tl.current.reverse();
  }, [isOpen]);

  // ESC close
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => e.key === "Escape" && closeMenu();
    if (isOpen) window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen]);

  // scroll lock
  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  return (
    <div ref={scopeRef}>
      {/* Top Bar */}
      <header className="fixed top-0 left-0 z-40 w-full px-6 py-6 flex items-center justify-between">
        <Link
          href="/"
          className="text-lg heading uppercase tracking-widest font-semibold"
        >
          Harish
        </Link>

        <button
          type="button"
          onClick={openMenu}
          className="text-sm uppercase tracking-wider"
          aria-label="Open menu"
        >
          <Menu />
        </button>
      </header>

      <div
        ref={scrimRef}
        onClick={closeMenu}
        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-md"
        aria-hidden={!isOpen}
      >
        <div className="absolute top-0 w-full z-40">
          <FlyingArmoredBuddy />
        </div>
        {/* Overlay */}
        <div
          ref={overlayRef}
          className="fixed inset-0 z-50"
          aria-hidden={!isOpen}
        >
          {/* Overlay layout */}
          <div className="h-full w-full px-6 py-6 flex flex-col">
            {/* Overlay Header */}
            <div className="flex items-center justify-between">
              <Link
                href="/"
                onClick={closeMenu}
                className="text-lg heading uppercase tracking-widest font-semibold"
              >
                Harish
              </Link>

              <button
                type="button"
                onClick={closeMenu}
                className="text-sm uppercase tracking-wider"
                aria-label="Close menu"
              >
                <X />
              </button>
            </div>

            {/* Links (center area) */}
            <nav className="flex-1 flex items-center">
              <div className="space-y-6">
                {links.map((link, index) => (
                  <div key={link.href} ref={(el) => setItemRef(el, index)}>
                    <Link
                      href={link.href}
                      onClick={closeMenu}
                      className="text-4xl md:text-6xl font-semibold leading-none hover:opacity-80 transition"
                    >
                      {link.name}
                    </Link>
                  </div>
                ))}
              </div>
            </nav>

            {/* Footer / extra info */}
            <footer className="flex items-end justify-between text-sm opacity-80">
              <p>© {new Date().getFullYear()} Harish</p>
              <p className="hidden md:block">Scroll ↓</p>
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
}
