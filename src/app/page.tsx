import Experience from "@/components/Experience";
import Conseillere from "@/components/Conseillere";
import DressDrawer from "@/components/ui/DressDrawer";
import LoadingScreen from "@/components/ui/LoadingScreen";
import Menu from "@/components/ui/Menu";
import TopBar from "@/components/ui/TopBar";
import { DRESSES } from "@/data/dresses";

export default function Home() {
  return (
    <>
      {/* Contenu SEO accessible hors canvas */}
      <section className="sr-only">
        <h1>MADAMOON — L&rsquo;Art de créer votre robe de mariée à Paris</h1>
        <p>
          Plongez dans l&rsquo;univers raffiné de notre boutique MADAMOON et
          découvrez nos collections d&rsquo;exception de robes de mariée, voiles
          et accessoires. Notre showroom, écrin d&rsquo;élégance classé monument
          historique au cœur du 10ᵉ arrondissement de Paris, vous ouvre ses
          portes pour une expérience unique et privée. Confection sur mesure à
          partir de 1500 €, retouches incluses. Sur rendez-vous uniquement :
          lundi 12h-21h, mardi à samedi 10h-19h — 234 rue du Faubourg
          Saint-Martin, 75010 Paris.
        </p>
        <h2>Nos robes de mariée</h2>
        <ul>
          {DRESSES.map((d) => (
            <li key={d.id}>
              {d.name} — {d.detail}. {d.description}
            </li>
          ))}
        </ul>
        <a href="/collections">Voir la version 2D des collections</a>
      </section>

      <main aria-label="Boutique immersive MADAMOON">
        <Experience />
      </main>

      <TopBar />
      <Menu />
      <DressDrawer />
      <LoadingScreen />
      <Conseillere />
    </>
  );
}
