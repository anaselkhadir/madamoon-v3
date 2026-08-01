"use client";

import Image from "next/image";
import Link from "next/link";
import { useBoutique } from "@/store/useBoutique";

/* Barre supérieure discrète : logo, sélection (wishlist), version 2D, menu. */

export default function TopBar() {
  const menuOpen = useBoutique((s) => s.menuOpen);
  const setMenu = useBoutique((s) => s.setMenu);
  const wishlist = useBoutique((s) => s.wishlist);

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-[60] flex items-center justify-between px-5 py-4 md:px-8 md:py-5">
      <a href="/" aria-label="MADAMOON" className="pointer-events-auto">
        <Image
          src="/images/logo.png"
          alt="MADAMOON"
          width={860}
          height={172}
          priority
          className="h-6 w-auto invert md:h-7"
        />
      </a>

      <div className="pointer-events-auto flex items-center gap-5 md:gap-7">
        <span
          aria-live="polite"
          className="hidden text-[10px] font-light uppercase tracking-[0.25em] text-encre/60 md:block"
        >
          Ma sélection — {wishlist.length}
        </span>
        <Link
          href="/collections"
          className="border border-encre/25 bg-creme/70 px-4 py-2.5 text-[10px] font-medium uppercase tracking-[0.22em] text-encre backdrop-blur-sm transition-all duration-400 hover:border-encre md:px-5"
        >
          Version 2D
        </Link>
        <button
          type="button"
          onClick={() => setMenu(!menuOpen)}
          aria-expanded={menuOpen}
          aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
          className="flex h-11 w-11 flex-col items-center justify-center gap-[5px] border border-encre/25 bg-creme/70 backdrop-blur-sm transition-all duration-400 hover:border-encre"
        >
          <span
            className={`h-px w-5 bg-encre transition-all duration-500 [transition-timing-function:cubic-bezier(0.33,1,0.68,1)] ${
              menuOpen ? "translate-y-[3px] rotate-45" : ""
            }`}
          />
          <span
            className={`h-px w-5 bg-encre transition-all duration-500 [transition-timing-function:cubic-bezier(0.33,1,0.68,1)] ${
              menuOpen ? "-translate-y-[3px] -rotate-45" : ""
            }`}
          />
        </button>
      </div>
    </header>
  );
}
