"use client";

import { AnimatePresence, motion } from "framer-motion";
import { RDV_URL } from "@/lib/site";
import { useBoutique } from "@/store/useBoutique";

/* Menu plein écran — Collections, Atelier, RDV, Sur-mesure, Contact. */

const LINKS = [
  { label: "Collections", href: "/collections" },
  { label: "L'Atelier & son histoire", href: "/collections#atelier" },
  { label: "Prendre rendez-vous", href: RDV_URL },
  { label: "Sur-mesure", href: "/collections#sur-mesure" },
  { label: "Contact", href: "/collections#contact" },
];

const SOCIALS = [
  { label: "Instagram", href: "https://www.instagram.com/madamoon.paris/" },
  { label: "TikTok", href: "https://www.tiktok.com/@madamoon.paris" },
  { label: "Facebook", href: "https://www.facebook.com/profile.php?id=100094615813297" },
];

export default function Menu() {
  const menuOpen = useBoutique((s) => s.menuOpen);
  const setMenu = useBoutique((s) => s.setMenu);

  return (
    <AnimatePresence>
      {menuOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.33, 1, 0.68, 1] }}
          className="fixed inset-0 z-[55] flex flex-col justify-between bg-ivoire/95 px-6 pb-10 pt-28 backdrop-blur-xl md:px-12"
        >
          <nav aria-label="Menu principal" className="flex flex-col gap-2">
            {LINKS.map((l, i) => (
              <motion.a
                key={l.label}
                href={l.href}
                onClick={() => setMenu(false)}
                initial={{ opacity: 0, y: 26 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.12 + i * 0.07, duration: 0.7, ease: [0.33, 1, 0.68, 1] }}
                className="group flex items-baseline gap-6 font-serif text-4xl font-light text-encre transition-colors duration-400 hover:text-gilt md:text-6xl"
              >
                <span className="text-xs font-normal italic text-gilt">0{i + 1}</span>
                {l.label}
              </motion.a>
            ))}
          </nav>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.7 }}
            className="flex flex-col gap-5 border-t border-encre/15 pt-7 text-[11px] font-light uppercase tracking-[0.25em] text-encre/60 md:flex-row md:items-center md:justify-between"
          >
            <p>234 rue du Faubourg Saint-Martin, 75010 Paris — +33 6 41 24 38 47</p>
            <div className="flex gap-6">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors duration-300 hover:text-gilt"
                >
                  {s.label}
                </a>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
