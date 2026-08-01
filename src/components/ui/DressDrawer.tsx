"use client";

import Image from "next/image";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { DRESSES, SIZES } from "@/data/dresses";
import { RDV_URL } from "@/lib/site";
import { useBoutique } from "@/store/useBoutique";

/* Fiche robe — panneau latéral ouvert au clic sur un hotspot. */

export default function DressDrawer() {
  const selectedId = useBoutique((s) => s.selectedId);
  const select = useBoutique((s) => s.select);
  const wishlist = useBoutique((s) => s.wishlist);
  const toggleWish = useBoutique((s) => s.toggleWish);
  const [size, setSize] = useState<string | null>(null);

  const dress = DRESSES.find((d) => d.id === selectedId);
  const wished = dress ? wishlist.includes(dress.id) : false;

  return (
    <AnimatePresence>
      {dress && (
        <motion.aside
          key={dress.id}
          initial={{ x: "105%" }}
          animate={{ x: 0 }}
          exit={{ x: "105%" }}
          transition={{ duration: 0.7, ease: [0.33, 1, 0.68, 1] }}
          role="dialog"
          aria-label={`Fiche ${dress.name}`}
          className="fixed bottom-0 right-0 top-0 z-[65] flex w-full flex-col overflow-y-auto border-l border-encre/10 bg-creme shadow-[0_0_80px_-20px_rgba(42,33,26,0.35)] md:w-[420px]"
        >
          {/* Photo réelle */}
          <div className="relative aspect-[3/4] w-full shrink-0 overflow-hidden">
            <Image
              src={dress.photo}
              alt={`${dress.name} — ${dress.detail}`}
              fill
              sizes="(min-width: 768px) 420px, 100vw"
              className="object-cover"
            />
            <button
              type="button"
              onClick={() => select(null)}
              aria-label="Fermer la fiche"
              className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center bg-creme/85 text-encre backdrop-blur-sm transition-transform duration-400 hover:scale-105"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden>
                <path d="M5 5l14 14M19 5L5 19" />
              </svg>
            </button>
            <p className="absolute bottom-4 left-4 bg-encre/80 px-3 py-1.5 text-[10px] uppercase tracking-[0.22em] text-ivoire backdrop-blur-sm">
              {dress.detail}
            </p>
          </div>

          <div className="flex flex-1 flex-col gap-6 px-7 py-7">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="font-serif text-3xl font-light text-encre">{dress.name}</h2>
                <p className="mt-2 text-[12px] font-light uppercase tracking-[0.2em] text-gilt">
                  {dress.price}
                </p>
              </div>
              <button
                type="button"
                onClick={() => toggleWish(dress.id)}
                aria-pressed={wished}
                aria-label={wished ? "Retirer de ma sélection" : "Ajouter à ma sélection"}
                className={`flex h-11 w-11 shrink-0 items-center justify-center border transition-all duration-400 ${
                  wished ? "border-gilt bg-gilt text-encre" : "border-encre/25 text-encre hover:border-gilt"
                }`}
              >
                <svg width="17" height="17" viewBox="0 0 24 24" fill={wished ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.4" aria-hidden>
                  <path d="M12 21s-7.5-4.9-9.6-9.2C.9 8.6 2.7 5 6.2 5c2.1 0 3.4 1.1 4.3 2.4h3c.9-1.3 2.2-2.4 4.3-2.4 3.5 0 5.3 3.6 3.8 6.8C19.5 16.1 12 21 12 21Z" />
                </svg>
              </button>
            </div>

            <p className="text-[14px] font-light leading-[1.85] text-encre/75">{dress.description}</p>

            <div>
              <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.22em] text-encre/60">
                Votre taille
              </p>
              <div className="flex flex-wrap gap-2">
                {SIZES.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSize(s)}
                    aria-pressed={size === s}
                    className={`border px-4 py-2.5 text-[12px] font-light transition-all duration-300 ${
                      size === s
                        ? "border-encre bg-encre text-ivoire"
                        : "border-encre/20 text-encre hover:border-encre"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-auto space-y-3 border-t border-encre/10 pt-6">
              <p className="text-[12px] font-light leading-relaxed text-encre/55">
                Chaque robe se découvre en essayage privé : le showroom est
                privatisé pour vous pendant une heure, retouches incluses.
              </p>
              <a
                href={RDV_URL}
                className="block bg-encre px-8 py-5 text-center text-[11px] font-medium uppercase tracking-[0.28em] text-ivoire transition-all duration-500 hover:bg-gilt hover:text-encre"
              >
                Prendre rendez-vous en boutique
              </a>
              <a
                href="https://madamoon.fr/catalogue-des-robes/"
                target="_blank"
                rel="noopener noreferrer"
                className="block border border-encre/20 px-8 py-4 text-center text-[11px] font-light uppercase tracking-[0.25em] text-encre transition-all duration-400 hover:border-encre"
              >
                Voir le catalogue complet
              </a>
            </div>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
