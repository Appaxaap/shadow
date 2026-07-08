export type Shadow = {
  id: string;
  x: number;
  y: number;
  blur: number;
  spread: number;
  opacity: number;
  color: string;
  inset: boolean;
  visible: boolean;
};

export type PreviewShape = "box" | "circle" | "button" | "card";
export type PreviewBackground =
  | { type: "solid"; color: string }
  | { type: "gradient"; value: string }
  | { type: "custom"; color: string };

export const PRESET_BACKGROUNDS: {
  id: string;
  label: string;
  bg: PreviewBackground;
  css: string;
}[] = [
  {
    id: "light",
    label: "Light",
    bg: { type: "solid", color: "#F0F3F2" },
    css: "#F0F3F2",
  },
  {
    id: "white",
    label: "White",
    bg: { type: "solid", color: "#ffffff" },
    css: "#ffffff",
  },
  {
    id: "dark",
    label: "Dark",
    bg: { type: "solid", color: "#0e1a1a" },
    css: "#0e1a1a",
  },
  {
    id: "black",
    label: "Black",
    bg: { type: "solid", color: "#000000" },
    css: "#000000",
  },
  {
    id: "warm-gray",
    label: "Warm",
    bg: { type: "solid", color: "#F5F0EB" },
    css: "#F5F0EB",
  },
  {
    id: "cool-gray",
    label: "Cool",
    bg: { type: "solid", color: "#E8EDF2" },
    css: "#E8EDF2",
  },
  {
    id: "gradient-sunset",
    label: "Sunset",
    bg: {
      type: "gradient",
      value: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    },
    css: "linear-gradient(135deg, #f093fb, #f5576c)",
  },
  {
    id: "gradient-ocean",
    label: "Ocean",
    bg: {
      type: "gradient",
      value: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    },
    css: "linear-gradient(135deg, #4facfe, #00f2fe)",
  },
  {
    id: "gradient-forest",
    label: "Forest",
    bg: {
      type: "gradient",
      value: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)",
    },
    css: "linear-gradient(135deg, #11998e, #38ef7d)",
  },
];
