"use client";

import { useEffect, useRef, useState } from "react";
import { AI_ENDPOINT, CATALOGUE_URL, RDV_URL, SUPABASE_ANON_KEY } from "@/lib/site";

/*
 * Élise — conseillère virtuelle MADAMOON.
 * Conversation libre propulsée par l'IA (Supabase Edge Function → Claude),
 * avec parcours guidé (diagnostic morphologie, FAQ, RDV) et repli scripté
 * si l'IA est indisponible : la cliente n'est jamais laissée sans réponse.
 */

type Option = { label: string; next?: string; href?: string };
type Message = { from: "bot" | "user"; text?: string; rich?: React.ReactNode };
type HistoryItem = { role: "user" | "assistant"; content: string };

const MORPHOS: Record<
  string,
  { name: string; desc: string; objectif: string; coupes: string[]; robes: string }
> = {
  O: {
    name: "Morphologie en O (ou ronde)",
    desc: "Courbes généreuses, poitrine et ventre souvent marqués.",
    objectif:
      "Allonger la silhouette et mettre en valeur vos atouts, sans marquer les zones sensibles.",
    coupes: [
      "Robe empire — tissu fluide et tombé léger pour camoufler le ventre",
      "Robe A-line (trapèze) — équilibre parfait entre structure et confort",
      "Décolleté en V ou cœur — met en valeur la poitrine",
    ],
    robes: "Robe Pendant (trapèze dentelle), Robe Hélène (fluide mousseline), Robe Mathilda (empire)",
  },
  A: {
    name: "Morphologie en A (ou pyramide)",
    desc: "Épaules plus étroites que les hanches, taille bien dessinée.",
    objectif: "Harmoniser la silhouette en attirant l'attention vers le haut du corps.",
    coupes: [
      "Robe princesse — bustier travaillé, jupe évasée qui équilibre les hanches",
      "Encolure bateau ou bustier droit — élargit visuellement les épaules",
      "À éviter : les robes moulantes type sirène, qui insistent sur les hanches",
    ],
    robes: "Robe Amandine (princesse dentelle), Robe Marie (A-line épurée), Robe Sienna",
  },
  V: {
    name: "Morphologie en V",
    desc: "Épaules larges, hanches plus étroites.",
    objectif: "Adoucir le haut du corps et apporter du volume au bas.",
    coupes: [
      "Robe fluide ou empire — structure légère et féminine",
      "Jupes volumineuses (forme A ou princesse)",
      "Décolletés en V, asymétriques ou croisés — cassent la largeur des épaules",
    ],
    robes: "Robe Adularia (fluide charmeuse), Robe Hélène (fluide mousseline), Robe Amandine (princesse)",
  },
  H: {
    name: "Morphologie en H",
    desc: "Silhouette droite, taille peu marquée.",
    objectif: "Créer de la féminité et de la courbe.",
    coupes: [
      "Robe empire ou fluide — idéale pour allonger la silhouette",
      "Modèles cintrés à la taille ou avec ceinture",
      "Robe sirène légère — pour dessiner les courbes",
    ],
    robes: "Robe Adularia (fluide), Robe Rowan (sirène en soie), Robe Dove (satin)",
  },
  "8": {
    name: "Morphologie en 8 (ou sablier)",
    desc: "Épaules et hanches équilibrées, taille marquée.",
    objectif: "Sublimer l'harmonie naturelle du corps.",
    coupes: [
      "Robe sirène ou fourreau — épouse parfaitement les courbes",
      "Bustier cœur ou encolure en V — féminine et élégante",
      "Robe cintrée à la taille — accentue l'équilibre naturel",
    ],
    robes: "Robe Shiloh (sirène dentelle), Robe Charlize (sirène corset), Robe Siddalee",
  },
  X: {
    name: "Morphologie en X",
    desc: "Silhouette équilibrée, courbes douces, taille fine.",
    objectif: "Valoriser la silhouette sans en faire trop.",
    coupes: [
      "Bonne nouvelle : presque toutes les coupes vous vont !",
      "Robe princesse, sirène, empire ou fluide — tout est permis",
      "Laissez le style de votre mariage guider votre choix",
    ],
    robes: "Robe Carrie, Robe Adularia, Robe Shiloh, Robe Amandine… selon vos envies",
  },
};

const FAQ: Record<string, { q: string; a: string }> = {
  prix: {
    q: "Quels sont vos prix ?",
    a: "Nos robes de mariée sur mesure sont proposées à partir de 1500 €, retouches incluses jusqu'au dernier essayage. Chaque robe est confectionnée selon vos mensurations.",
  },
  delais: {
    q: "Quand commencer les essayages ?",
    a: "L'idéal est de prendre rendez-vous 8 à 9 mois avant la date du mariage : trois rendez-vous rythment le parcours (sélection, essayage de votre robe, retouches finales). Si le temps manque, nous trouvons toujours une solution.",
  },
  horaires: {
    q: "Horaires & adresse",
    a: "Le showroom vous reçoit sur rendez-vous uniquement : lundi de 12h à 21h, du mardi au samedi de 10h à 19h — au 234, rue du Faubourg Saint-Martin, 75010 Paris (lieu classé monument historique).",
  },
  maisons: {
    q: "Quelles maisons de couture ?",
    a: "Nos robes sont choisies parmi les plus belles maisons : Watters Designs, Casablanca Bridal, Olya Mak, Angeola Biarritz, Monica Loretti… avec un service de confection sur mesure.",
  },
};

const HOME_OPTIONS: Option[] = [
  { label: "Trouver ma coupe idéale", next: "morpho" },
  { label: "Prendre rendez-vous", next: "rdv" },
  { label: "Questions pratiques", next: "faq" },
];

/* Repli hors-ligne : oriente par mots-clés vers la base de connaissances. */
function offlineAnswer(input: string): { texts: string[]; options: Option[] } {
  const q = input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
  const has = (...words: string[]) => words.some((w) => q.includes(w));

  if (has("rendez", "rdv", "reserv", "essayage", "venir", "visite"))
    return {
      texts: [
        "Avec plaisir ✨ Le showroom est privatisé pour vous pendant une heure, sur rendez-vous uniquement : lundi 12h–21h, mardi au samedi 10h–19h, au 234 rue du Faubourg Saint-Martin, Paris 10ᵉ.",
      ],
      options: [
        { label: "Réserver en ligne", href: RDV_URL },
        { label: "Appeler la boutique", href: "tel:+33641243847" },
      ],
    };
  if (has("prix", "tarif", "cout", "coute", "budget", "cher"))
    return { texts: [FAQ.prix.a], options: [{ label: "Prendre rendez-vous", next: "rdv" }] };
  if (has("horaire", "adresse", "ouvert", "ou etes", "situ", "metro"))
    return { texts: [FAQ.horaires.a], options: [{ label: "Prendre rendez-vous", next: "rdv" }] };
  if (has("delai", "quand", "mois", "date", "temps"))
    return { texts: [FAQ.delais.a], options: [{ label: "Prendre rendez-vous", next: "rdv" }] };
  if (has("marque", "createur", "maison", "watters", "casablanca"))
    return { texts: [FAQ.maisons.a], options: [{ label: "Voir le catalogue", href: CATALOGUE_URL }] };
  if (has("morpho", "silhouette", "coupe", "taille", "corps", "quelle robe", "robe pour moi"))
    return {
      texts: [
        "Chaque femme est unique : le plus simple est un petit diagnostic ensemble pour identifier la coupe qui vous sublimera. On commence ?",
      ],
      options: [{ label: "Lancer le diagnostic", next: "q1" }],
    };
  if (has("merci", "super", "parfait"))
    return {
      texts: ["Avec grand plaisir ✨ Je reste à votre écoute — et au plaisir de vous accueillir en boutique."],
      options: HOME_OPTIONS,
    };
  return {
    texts: [
      "Je préfère vous répondre précisément plutôt que de m'avancer : le mieux est d'en parler de vive voix avec la boutique, ou je peux vous guider ici sur votre morphologie, nos prix et la prise de rendez-vous.",
    ],
    options: [
      ...HOME_OPTIONS,
      { label: "Appeler la boutique", href: "tel:+33641243847" },
    ],
  };
}

export default function Conseillere() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [options, setOptions] = useState<Option[]>([]);
  const [typing, setTyping] = useState(false);
  const [started, setStarted] = useState(false);
  const [input, setInput] = useState("");
  const listRef = useRef<HTMLDivElement>(null);
  const timeouts = useRef<ReturnType<typeof setTimeout>[]>([]);
  const history = useRef<HistoryItem[]>([]);

  const later = (fn: () => void, ms: number) => {
    timeouts.current.push(setTimeout(fn, ms));
  };

  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, typing, options]);

  useEffect(() => () => timeouts.current.forEach(clearTimeout), []);

  const say = (texts: (string | { plain: string; rich: React.ReactNode })[], opts: Option[], delay = 650) => {
    setOptions([]);
    setTyping(true);
    texts.forEach((t, i) => {
      later(() => {
        const plain = typeof t === "string" ? t : t.plain;
        history.current.push({ role: "assistant", content: plain });
        setMessages((m) => [
          ...m,
          typeof t === "string" ? { from: "bot", text: t } : { from: "bot", rich: t.rich },
        ]);
        if (i === texts.length - 1) {
          setTyping(false);
          setOptions(opts);
        }
      }, delay * (i + 1));
    });
  };

  const go = (node: string) => {
    switch (node) {
      case "root":
        say(
          [
            "Bonjour, je suis Élise ✨ conseillère de la maison MADAMOON. Trouver la robe d'une vie, c'est mon métier — et ma plus grande joie.",
            "Parlez-moi de votre mariage, posez-moi toutes vos questions… ou laissez-vous guider :",
          ],
          HOME_OPTIONS
        );
        break;

      case "morpho":
        say(
          [
            "Chaque femme est unique : l'essentiel est de trouver la robe qui met en valeur votre silhouette tout en vous ressemblant.",
            "Connaissez-vous déjà votre morphologie ?",
          ],
          [
            { label: "Oui, je la connais", next: "pick" },
            { label: "Pas vraiment, guidez-moi", next: "q1" },
          ]
        );
        break;

      case "pick":
        say(
          ["Très bien ! Laquelle est la vôtre ?"],
          [
            { label: "En O (ronde)", next: "result:O" },
            { label: "En A (pyramide)", next: "result:A" },
            { label: "En V", next: "result:V" },
            { label: "En H", next: "result:H" },
            { label: "En 8 (sablier)", next: "result:8" },
            { label: "En X", next: "result:X" },
          ]
        );
        break;

      case "q1":
        say(
          ["Pas de panique, je vous guide pas à pas 🌿", "Comment décririez-vous vos épaules par rapport à vos hanches ?"],
          [
            { label: "Plus étroites que mes hanches", next: "result:A" },
            { label: "Plus larges que mes hanches", next: "result:V" },
            { label: "Alignées, équilibrées", next: "q2" },
            { label: "Des courbes généreuses", next: "result:O" },
          ]
        );
        break;

      case "q2":
        say(
          ["Et votre taille, est-elle marquée ?"],
          [
            { label: "Oui, bien marquée", next: "q3" },
            { label: "Peu marquée, silhouette droite", next: "result:H" },
          ]
        );
        break;

      case "q3":
        say(
          ["Dernière question : vos courbes sont plutôt…"],
          [
            { label: "Prononcées, harmonieuses", next: "result:8" },
            { label: "Douces, silhouette fine", next: "result:X" },
          ]
        );
        break;

      case "rdv":
        say(
          [
            "Avec plaisir ✨ Lors de votre rendez-vous, le showroom est entièrement privatisé pour vous pendant une heure — venez accompagnée de vos proches.",
            "Sur rendez-vous uniquement : lundi 12h–21h, mardi au samedi 10h–19h, au 234 rue du Faubourg Saint-Martin, Paris 10ᵉ.",
          ],
          [
            { label: "Réserver en ligne", href: RDV_URL },
            { label: "Appeler la boutique", href: "tel:+33641243847" },
            { label: "Écrire à la maison", href: "mailto:contact@madamoon.fr?subject=Demande%20de%20rendez-vous%20%E2%80%94%20essayage%20priv%C3%A9" },
          ]
        );
        break;

      case "faq":
        say(
          ["Bien sûr — que souhaitez-vous savoir ? Vous pouvez aussi me poser votre question librement."],
          Object.entries(FAQ).map(([k, v]) => ({ label: v.q, next: `faq:${k}` }))
        );
        break;

      default: {
        if (node.startsWith("result:")) {
          const m = MORPHOS[node.slice(7)];
          say(
            [
              {
                plain: `${m.name}. ${m.desc} Objectif : ${m.objectif} Coupes recommandées : ${m.coupes.join(" ; ")}. Dans notre collection : ${m.robes}.`,
                rich: (
                  <div>
                    <p className="font-display text-lg font-normal italic text-encre">{m.name}</p>
                    <p className="mt-1 text-[13px] text-taupe">{m.desc}</p>
                    <p className="mt-3 text-[13px]">
                      <span className="font-medium">L&rsquo;objectif :</span> {m.objectif}
                    </p>
                    <ul className="mt-3 space-y-1.5">
                      {m.coupes.map((c) => (
                        <li key={c} className="flex gap-2 text-[13px]">
                          <span className="text-taupe">✦</span>
                          <span>{c}</span>
                        </li>
                      ))}
                    </ul>
                    <p className="mt-3 border-t border-encre/15 pt-3 text-[13px]">
                      <span className="font-medium">Dans notre collection :</span> {m.robes}.
                    </p>
                  </div>
                ),
              },
              "Le plus beau reste l'essayage : je serai ravie de savoir que vous poussez la porte du showroom — mes collègues vous guideront selon votre morphologie, vos envies et votre personnalité ✨ Et si vous voulez affiner (style du mariage, tissus, encolures…), posez-moi vos questions ici !",
            ],
            [
              { label: "Prendre rendez-vous", next: "rdv" },
              { label: "Voir le catalogue", href: CATALOGUE_URL },
              { label: "Refaire le diagnostic", next: "q1" },
            ],
            750
          );
        } else if (node.startsWith("faq:")) {
          const f = FAQ[node.slice(4)];
          say(
            [f.a],
            [
              { label: "Prendre rendez-vous", next: "rdv" },
              { label: "Trouver ma coupe idéale", next: "morpho" },
            ]
          );
        }
      }
    }
  };

  /* Texte libre → IA ; en cas d'échec, moteur local par mots-clés. */
  const askAi = async (question: string) => {
    setOptions([]);
    setTyping(true);
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 20000);
      const res = await fetch(AI_ENDPOINT, {
        method: "POST",
        signal: controller.signal,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          apikey: SUPABASE_ANON_KEY,
        },
        body: JSON.stringify({ messages: history.current.slice(-16) }),
      });
      clearTimeout(timer);
      if (!res.ok) throw new Error(`http_${res.status}`);
      const data = await res.json();
      const reply = typeof data?.reply === "string" ? data.reply.trim() : "";
      if (!reply) throw new Error("empty_reply");
      history.current.push({ role: "assistant", content: reply });
      setTyping(false);
      setMessages((m) => [...m, { from: "bot", text: reply }]);
      setOptions([{ label: "Prendre rendez-vous", next: "rdv" }]);
    } catch {
      const fb = offlineAnswer(question);
      setTyping(false);
      fb.texts.forEach((t) => history.current.push({ role: "assistant", content: t }));
      setMessages((m) => [...m, ...fb.texts.map((t) => ({ from: "bot" as const, text: t }))]);
      setOptions(fb.options);
    }
  };

  const send = () => {
    const text = input.trim();
    if (!text || typing) return;
    setInput("");
    history.current.push({ role: "user", content: text });
    setMessages((m) => [...m, { from: "user", text }]);
    askAi(text);
  };

  const choose = (o: Option) => {
    if (o.href) {
      window.open(o.href, o.href.startsWith("http") ? "_blank" : "_self");
      return;
    }
    history.current.push({ role: "user", content: o.label });
    setMessages((m) => [...m, { from: "user", text: o.label }]);
    if (o.next) go(o.next);
  };

  const toggle = () => {
    setOpen((v) => !v);
    if (!started) {
      setStarted(true);
      go("root");
    }
  };

  return (
    <>
      {/* Bouton flottant */}
      <button
        type="button"
        onClick={toggle}
        aria-expanded={open}
        aria-label={open ? "Fermer la conseillère virtuelle" : "Ouvrir la conseillère virtuelle Élise"}
        className="fixed bottom-6 right-6 z-[70] flex h-16 w-16 items-center justify-center rounded-full bg-encre text-gilt shadow-[0_18px_45px_-12px_rgba(17,17,17,0.45)] transition-all duration-500 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] hover:scale-105 hover:bg-taupe hover:text-ivoire md:bottom-8 md:right-8"
      >
        {open ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden>
            <path d="M5 5l14 14M19 5L5 19" />
          </svg>
        ) : (
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.1" aria-hidden>
            <path d="M21 12c0 4.1-4 7.4-9 7.4-1 0-2-.13-2.9-.38L4 21l1.6-3.4C4 16.2 3 14.2 3 12c0-4.1 4-7.4 9-7.4s9 3.3 9 7.4Z" />
            <path d="M8.5 12h.01M12 12h.01M15.5 12h.01" strokeWidth="2" strokeLinecap="round" />
          </svg>
        )}
      </button>

      {/* Fenêtre de conversation */}
      <div
        role="dialog"
        aria-label="Élise, conseillère virtuelle MADAMOON"
        aria-hidden={!open}
        className={`fixed z-[70] flex flex-col overflow-hidden border border-encre/15 bg-ivoire shadow-[0_40px_90px_-30px_rgba(17,17,17,0.4)] transition-all duration-600 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] ${
          open
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-6 opacity-0"
        } inset-x-0 bottom-0 top-14 md:inset-auto md:bottom-28 md:right-8 md:h-[640px] md:max-h-[calc(100dvh-9rem)] md:w-[400px]`}
      >
        {/* En-tête */}
        <div className="flex items-center gap-4 border-b border-encre/15 bg-white px-6 py-4">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gilt bg-ivoire font-display text-base italic text-taupe" aria-hidden>
            É
          </span>
          <div>
            <p className="font-display text-lg leading-tight text-encre">Élise</p>
            <p className="mt-0.5 flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.2em] text-taupe">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-gilt" aria-hidden />
              Conseillère Madamoon
            </p>
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Fermer"
            className="ml-auto p-2 text-taupe transition-colors hover:text-encre md:hidden"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden>
              <path d="M5 5l14 14M19 5L5 19" />
            </svg>
          </button>
        </div>

        {/* Messages */}
        <div ref={listRef} data-lenis-prevent className="flex-1 space-y-4 overflow-y-auto px-5 py-6">
          {messages.map((m, i) =>
            m.from === "bot" ? (
              <div key={i} className="max-w-[88%] whitespace-pre-line border border-encre/15 bg-white px-4 py-3 text-[13.5px] font-light leading-relaxed text-encre">
                {m.rich ?? m.text}
              </div>
            ) : (
              <div key={i} className="ml-auto max-w-[88%] bg-encre px-4 py-3 text-[13.5px] font-light leading-relaxed text-ivoire">
                {m.text}
              </div>
            )
          )}
          {typing && (
            <div className="flex w-max items-center gap-1.5 border border-encre/15 bg-white px-4 py-3" aria-label="Élise écrit">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="h-1.5 w-1.5 animate-bounce rounded-full bg-taupe"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Choix rapides */}
        {options.length > 0 && (
          <div className="flex flex-wrap gap-2 border-t border-encre/15 bg-ivoire px-5 py-3">
            {options.map((o) => (
              <button
                key={o.label}
                type="button"
                onClick={() => choose(o)}
                className="border border-gilt px-3.5 py-2 text-[10.5px] font-medium uppercase tracking-[0.14em] text-encre transition-all duration-400 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] hover:scale-[1.02] hover:bg-gilt hover:text-encre"
              >
                {o.label}
              </button>
            ))}
          </div>
        )}

        {/* Saisie libre */}
        <form
          className="flex items-center gap-3 border-t border-encre/15 bg-white px-4 py-3"
          onSubmit={(e) => {
            e.preventDefault();
            send();
          }}
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Écrivez à Élise…"
            aria-label="Votre message pour Élise"
            enterKeyHint="send"
            className="min-w-0 flex-1 bg-transparent py-2 text-[14px] font-light text-encre outline-none placeholder:text-taupe/60"
          />
          <button
            type="submit"
            aria-label="Envoyer"
            disabled={!input.trim() || typing}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-encre text-gilt transition-all duration-400 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] enabled:hover:scale-105 enabled:hover:bg-taupe enabled:hover:text-ivoire disabled:opacity-30"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden>
              <path d="M4 12h15M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </form>
      </div>
    </>
  );
}
