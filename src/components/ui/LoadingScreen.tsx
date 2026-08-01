"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useProgress } from "@react-three/drei";
import { AnimatePresence, motion } from "framer-motion";
import { useBoutique } from "@/store/useBoutique";

/* Seuil d'entrée — chargement soigné avant de pousser la porte. */

export default function LoadingScreen() {
  const { progress, active } = useProgress();
  const entered = useBoutique((s) => s.entered);
  const enter = useBoutique((s) => s.enter);
  // La scène actuelle n'a pas d'assets externes : on considère la boutique
  // prête dès qu'aucun chargement n'est actif, après une courte respiration.
  const [warmedUp, setWarmedUp] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setWarmedUp(true), 1200);
    return () => clearTimeout(t);
  }, []);
  const ready = warmedUp && (!active || progress >= 100);
  const shown = ready ? 100 : Math.max(progress, warmedUp ? 90 : 30);

  return (
    <AnimatePresence>
      {!entered && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 1.1, ease: [0.33, 1, 0.68, 1] } }}
          className="fixed inset-0 z-[80] flex flex-col items-center justify-center gap-10 bg-ivoire px-6 text-center"
        >
          <Image
            src="/images/logo.png"
            alt="MADAMOON"
            width={860}
            height={172}
            priority
            className="h-9 w-auto invert md:h-11"
          />
          <div>
            <p className="font-serif text-2xl font-light italic text-encre/80 md:text-3xl">
              L&rsquo;Art de créer votre robe de mariée.
            </p>
            <p className="mt-3 text-[11px] font-light uppercase tracking-[0.3em] text-encre/50">
              Showroom classé monument historique — Paris 10ᵉ
            </p>
          </div>

          {ready ? (
            <motion.button
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.33, 1, 0.68, 1] }}
              type="button"
              onClick={enter}
              className="border border-encre bg-encre px-12 py-5 text-[11px] font-medium uppercase tracking-[0.3em] text-ivoire transition-all duration-500 hover:scale-[1.03] hover:bg-gilt hover:text-encre"
            >
              Entrer dans la boutique
            </motion.button>
          ) : (
            <div className="flex flex-col items-center gap-4">
              <div className="h-px w-52 overflow-hidden bg-encre/15">
                <div
                  className="h-full bg-gilt transition-all duration-300"
                  style={{ width: `${shown}%` }}
                />
              </div>
              <p className="text-[11px] uppercase tracking-[0.3em] text-encre/50">
                {Math.round(shown)} %
              </p>
            </div>
          )}

          <p className="absolute bottom-8 text-[10px] font-light uppercase tracking-[0.25em] text-encre/40">
            Glissez pour explorer — cliquez les pastilles pour découvrir les robes
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
