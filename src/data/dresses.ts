/*
 * Robes réelles du catalogue MADAMOON.
 * `silhouette` pilote la forme 3D stylisée ; `photo` = vraie photo boutique.
 * Positions : rail principal (mur droit) et rail secondaire (fond droit),
 * fidèles à la photo de référence du showroom.
 */

export type Silhouette = "princesse" | "sirene" | "fluide" | "trapeze" | "minimaliste";

export type Dress = {
  id: string;
  name: string;
  detail: string;
  description: string;
  silhouette: Silhouette;
  photo: string;
  price: string;
  position: [number, number, number];
  facing: number;
};

export const DRESSES: Dress[] = [
  {
    id: "adularia",
    name: "Robe Adularia",
    detail: "Fluide charmeuse",
    description:
      "Satin charmeuse au tombé liquide, décolleté délicat et manches amples boutonnées. Une silhouette fluide, moderne, d'une élégance intemporelle.",
    silhouette: "fluide",
    photo: "/images/dress-adularia.jpg",
    price: "À partir de 1500 € — retouches incluses",
    position: [2.1, 0, -2.6],
    facing: 0,
  },
  {
    id: "pendant",
    name: "Robe Pendant",
    detail: "Trapèze A-line, dentelle",
    description:
      "Dentelle florale sur coupe trapèze A-line, épaules dégagées. L'équilibre parfait entre structure et légèreté, pensé pour toutes les silhouettes.",
    silhouette: "trapeze",
    photo: "/images/dress-pendant.jpg",
    price: "À partir de 1500 € — retouches incluses",
    position: [1.0, 0, -2.6],
    facing: 0,
  },
  {
    id: "sienna",
    name: "Robe Sienna",
    detail: "Taffetas structuré",
    description:
      "Taffetas sculptural, bustier cœur et jupe ample fendue. Une allure de couture, spectaculaire et raffinée, pour un mariage inoubliable.",
    silhouette: "princesse",
    photo: "/images/dress-sienna.jpg",
    price: "À partir de 1500 € — retouches incluses",
    position: [3.2, 0, -2.6],
    facing: 0,
  },
  {
    id: "carrie",
    name: "Robe Carrie",
    detail: "Dentelle, dos ouvert",
    description:
      "Dentelle délicate, dos ouvert et traîne légère. Un charme romantique, précis dans chaque finition, signé des plus belles maisons de couture.",
    silhouette: "minimaliste",
    photo: "/images/dress-carrie.jpg",
    price: "À partir de 1500 € — retouches incluses",
    position: [4.45, 0, -1.15],
    facing: -Math.PI / 2,
  },
  {
    id: "shiloh",
    name: "Robe Shiloh",
    detail: "Sirène en dentelle",
    description:
      "Coupe sirène en dentelle qui épouse les courbes avant de s'évaser en corolle. Pour sublimer l'harmonie naturelle de la silhouette.",
    silhouette: "sirene",
    photo: "/images/dress-shiloh.jpg",
    price: "À partir de 1500 € — retouches incluses",
    position: [4.45, 0, 0.15],
    facing: -Math.PI / 2,
  },
];

export const SIZES = ["34", "36", "38", "40", "42", "44", "Sur mesure"];
