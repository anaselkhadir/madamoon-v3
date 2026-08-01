import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { DRESSES } from "@/data/dresses";
import { RDV_URL } from "@/lib/site";

/* Version 2D — les mêmes robes en présentation classique + l'atelier,
 * le sur-mesure et le contact. Repli mobile / non-WebGL, et page SEO. */

export const metadata: Metadata = {
  title: "Collections — MADAMOON | Robes de mariée sur mesure à Paris",
  description:
    "Les robes de mariée MADAMOON en images : Adularia, Pendant, Sienna, Carrie, Shiloh… Confection sur mesure à partir de 1500 €, retouches incluses. Essayage privé à Paris 10ᵉ.",
};

const SOCIALS = [
  { label: "Instagram", href: "https://www.instagram.com/madamoon.paris/" },
  { label: "TikTok", href: "https://www.tiktok.com/@madamoon.paris" },
  { label: "Facebook", href: "https://www.facebook.com/profile.php?id=100094615813297" },
];

export default function Collections() {
  return (
    <div className="bg-ivoire text-encre">
      {/* En-tête */}
      <header className="flex items-center justify-between border-b border-encre/10 px-6 py-5 md:px-10">
        <Link href="/" aria-label="MADAMOON — retour à la boutique 3D">
          <Image
            src="/images/logo.png"
            alt="MADAMOON"
            width={860}
            height={172}
            priority
            className="h-6 w-auto invert md:h-7"
          />
        </Link>
        <Link
          href="/"
          className="border border-encre/25 px-5 py-2.5 text-[10px] font-medium uppercase tracking-[0.22em] transition-all duration-400 hover:border-encre"
        >
          ← Boutique 3D
        </Link>
      </header>

      {/* Collections */}
      <section className="px-6 py-20 md:px-10 md:py-28">
        <p className="mb-6 text-[11px] font-light uppercase tracking-[0.3em] text-gilt">
          Nos collections sur mesure
        </p>
        <h1 className="max-w-3xl font-serif text-5xl font-light leading-[1.05] md:text-6xl">
          Des robes de mariée modernes à{" "}
          <em className="italic text-gilt">l&rsquo;élégance intemporelle.</em>
        </h1>
        <p className="mt-8 max-w-xl text-[15px] font-light leading-[1.9] text-encre/70">
          Des créations alliant avec finesse modernité et intemporalité, conçues
          pour sublimer chaque silhouette et révéler votre singularité. Matières
          nobles, détails délicats et finitions d&rsquo;exception — choisies
          parmi les plus belles maisons de couture : Watters Designs, Casablanca
          Bridal, Olya Mak, Angeola Biarritz, Monica Loretti.
        </p>

        <div className="mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {DRESSES.map((d) => (
            <article key={d.id} className="group">
              <div className="relative aspect-[3/4] overflow-hidden border border-encre/10 bg-creme">
                <Image
                  src={d.photo}
                  alt={`${d.name} — ${d.detail}`}
                  fill
                  sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
                  className="object-cover transition-transform duration-[1600ms] [transition-timing-function:cubic-bezier(0.33,1,0.68,1)] group-hover:scale-105"
                />
              </div>
              <div className="flex items-baseline justify-between pt-4">
                <h2 className="font-serif text-2xl font-light">{d.name}</h2>
                <p className="text-[10px] font-light uppercase tracking-[0.2em] text-encre/50">
                  {d.detail}
                </p>
              </div>
              <p className="mt-2 text-[13px] font-light leading-[1.8] text-encre/65">{d.description}</p>
              <p className="mt-3 text-[11px] uppercase tracking-[0.18em] text-gilt">{d.price}</p>
            </article>
          ))}
        </div>

        <div className="mt-14 text-center">
          <a
            href="https://madamoon.fr/catalogue-des-robes/"
            className="inline-block border border-encre px-9 py-4 text-[11px] font-medium uppercase tracking-[0.25em] transition-all duration-500 hover:bg-encre hover:text-ivoire"
          >
            Explorer le catalogue complet
          </a>
        </div>
      </section>

      {/* L'Atelier */}
      <section id="atelier" className="border-t border-encre/10 bg-creme px-6 py-20 md:px-10 md:py-28">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div className="relative aspect-[4/3] overflow-hidden border border-encre/10">
            <Image
              src="/images/showroom.jpg"
              alt="Le showroom MADAMOON — escalier d'époque de la maison Claverie"
              fill
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="object-cover"
            />
          </div>
          <div>
            <p className="mb-6 text-[11px] font-light uppercase tracking-[0.3em] text-gilt">
              L&rsquo;Atelier & son histoire
            </p>
            <h2 className="font-serif text-4xl font-light leading-tight md:text-5xl">
              Un écrin <em className="italic text-gilt">hors du temps.</em>
            </h2>
            <div className="mt-7 space-y-5 text-[15px] font-light leading-[1.9] text-encre/70">
              <p>
                La boutique MADAMOON s&rsquo;inscrit dans l&rsquo;héritage
                d&rsquo;un lieu emblématique de la corseterie parisienne,
                autrefois occupé par la maison Claverie, référence incontournable
                du XIXᵉ siècle. Ce lieu chargé d&rsquo;histoire, classé monument
                historique, offre aux futures mariées une expérience unique, où
                tradition et modernité se rencontrent.
              </p>
              <p className="font-serif text-xl italic text-encre">
                « Une ambiance intimiste qui vous fait vous sentir littéralement
                hors du temps. »
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Sur-mesure */}
      <section id="sur-mesure" className="border-t border-encre/10 px-6 py-20 md:px-10 md:py-28">
        <p className="mb-6 text-[11px] font-light uppercase tracking-[0.3em] text-gilt">Sur-mesure</p>
        <h2 className="font-serif text-4xl font-light md:text-5xl">
          Le déroulement, <em className="italic text-gilt">de A à Z.</em>
        </h2>
        <div className="mt-12 grid gap-10 md:grid-cols-3">
          {[
            {
              t: "Essayage privé",
              d: "Un premier rendez-vous dédié à la découverte de la collection : le showroom est privatisé pour vous pendant une heure, accompagnantes bienvenues.",
            },
            {
              t: "Confection à vos mesures",
              d: "Vos mensurations sont prises le jour même pour lancer la confection sur mesure — matières nobles et finitions d'exception, à partir de 1500 €.",
            },
            {
              t: "Retouches incluses",
              d: "Deux essayages suivent : votre robe, puis les dernières retouches, incluses, pour un ajustement parfait le jour J.",
            },
          ].map((s, i) => (
            <div key={s.t} className="border-t border-encre/15 pt-6">
              <p className="font-serif text-sm italic text-gilt">0{i + 1}</p>
              <h3 className="mt-3 font-serif text-2xl font-light">{s.t}</h3>
              <p className="mt-3 text-[14px] font-light leading-[1.85] text-encre/70">{s.d}</p>
            </div>
          ))}
        </div>
        <div className="mt-14">
          <a
            href={RDV_URL}
            className="inline-block bg-encre px-10 py-5 text-[11px] font-medium uppercase tracking-[0.28em] text-ivoire transition-all duration-500 hover:bg-gilt hover:text-encre"
          >
            Prendre rendez-vous
          </a>
        </div>
      </section>

      {/* Contact */}
      <footer id="contact" className="border-t border-encre/10 bg-encre px-6 py-16 text-ivoire md:px-10">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <p className="mb-5 text-[11px] uppercase tracking-[0.25em] text-gilt">Contact</p>
            <ul className="space-y-2 text-sm font-light text-ivoire/75">
              <li>234 rue du Faubourg Saint-Martin, 75010 Paris</li>
              <li><a href="tel:+33641243847" className="hover:text-gilt">+33 6 41 24 38 47</a></li>
              <li><a href="mailto:contact@madamoon.fr" className="hover:text-gilt">contact@madamoon.fr</a></li>
            </ul>
          </div>
          <div>
            <p className="mb-5 text-[11px] uppercase tracking-[0.25em] text-gilt">
              Horaires — sur rendez-vous
            </p>
            <ul className="space-y-2 text-sm font-light text-ivoire/75">
              <li>Lundi : 12h — 21h</li>
              <li>Mardi à samedi : 10h — 19h</li>
            </ul>
          </div>
          <div>
            <p className="mb-5 text-[11px] uppercase tracking-[0.25em] text-gilt">Nous suivre</p>
            <ul className="space-y-2 text-sm font-light text-ivoire/75">
              {SOCIALS.map((s) => (
                <li key={s.label}>
                  <a href={s.href} target="_blank" rel="noopener noreferrer" className="hover:text-gilt">
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <p className="mt-12 border-t border-ivoire/15 pt-6 text-[10px] font-light uppercase tracking-[0.2em] text-ivoire/40">
          © {new Date().getFullYear()} MADAMOON Paris — L&rsquo;Art de créer votre robe de mariée.
        </p>
      </footer>
    </div>
  );
}
