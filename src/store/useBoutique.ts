"use client";

import { create } from "zustand";

/* État global de la boutique immersive. */

type BoutiqueState = {
  entered: boolean;
  menuOpen: boolean;
  selectedId: string | null;
  wishlist: string[];
  enter: () => void;
  setMenu: (open: boolean) => void;
  select: (id: string | null) => void;
  toggleWish: (id: string) => void;
};

export const useBoutique = create<BoutiqueState>((set) => ({
  entered: false,
  menuOpen: false,
  selectedId: null,
  wishlist: [],
  enter: () => set({ entered: true }),
  setMenu: (menuOpen) => set({ menuOpen }),
  select: (selectedId) => set({ selectedId, menuOpen: false }),
  toggleWish: (id) =>
    set((s) => ({
      wishlist: s.wishlist.includes(id)
        ? s.wishlist.filter((w) => w !== id)
        : [...s.wishlist, id],
    })),
}));
