"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

/* Monte la scène 3D côté client uniquement, avec repli si WebGL absent. */

const Showroom = dynamic(() => import("@/components/scene/Showroom"), { ssr: false });

function webglSupported(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return !!(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

export default function Experience() {
  const [supported, setSupported] = useState<boolean | null>(null);

  useEffect(() => {
    setSupported(webglSupported());
  }, []);

  if (supported === false) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center gap-8 bg-ivoire px-6 text-center">
        <div className="relative aspect-[4/3] w-full max-w-xl overflow-hidden border border-encre/15">
          <Image
            src="/images/showroom.jpg"
            alt="Le showroom MADAMOON à Paris"
            fill
            sizes="(min-width: 768px) 576px, 100vw"
            className="object-cover"
          />
        </div>
        <p className="max-w-md font-serif text-2xl font-light italic text-encre/80">
          Votre navigateur ne prend pas en charge la visite 3D — découvrez la
          collection en images.
        </p>
        <Link
          href="/collections"
          className="border border-encre bg-encre px-10 py-5 text-[11px] font-medium uppercase tracking-[0.28em] text-ivoire transition-all duration-500 hover:bg-gilt hover:text-encre"
        >
          Découvrir les collections
        </Link>
      </div>
    );
  }

  if (supported === null) return null;

  return <Showroom />;
}
