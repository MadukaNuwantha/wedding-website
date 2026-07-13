export type CardKey = "wedding" | "reception" | "homecoming";
export type CardFont = "serif" | "script";

export type CardConfig = {
  x: number; // 0..1 horizontal centre
  y: number; // 0..1 vertical centre
  size: number; // font size as a fraction of image width
  color: string;
  font: CardFont;
};

export type CardMeta = {
  key: CardKey;
  label: string;
  src: string;
  width: number;
  height: number;
  fileSuffix: string;
  default: CardConfig;
};

// Defaults place the name on each card's dotted placeholder line.
export const CARDS: CardMeta[] = [
  {
    key: "wedding",
    label: "Wedding",
    src: "/wedding-invitation.png",
    width: 1031,
    height: 1526,
    fileSuffix: "wedding-invitation",
    default: { x: 0.5, y: 0.318, size: 0.05, color: "#22365d", font: "serif" },
  },
  {
    key: "reception",
    label: "Reception",
    src: "/reception-invitation.png",
    width: 1024,
    height: 1536,
    fileSuffix: "reception-invitation",
    default: { x: 0.5, y: 0.368, size: 0.05, color: "#22365d", font: "serif" },
  },
  {
    key: "homecoming",
    label: "Homecoming",
    src: "/homecoming-invitation.png",
    width: 1054,
    height: 1492,
    fileSuffix: "homecoming-invitation",
    // Dark red card — the name is gold, on the dotted line.
    default: { x: 0.5, y: 0.362, size: 0.05, color: "#e9c874", font: "serif" },
  },
];

export function cardMeta(key: CardKey): CardMeta {
  return CARDS.find((c) => c.key === key)!;
}
