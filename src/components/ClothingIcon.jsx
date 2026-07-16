// Simple flat apparel silhouettes rendered in the product's own color.
// Keeps the catalog fully self-contained (no external image hosting,
// so nothing can ever 404).

const PATHS = {
  shirt: "M32 8 L20 4 L4 16 L10 26 L16 22 L16 60 L48 60 L48 22 L54 26 L60 16 L44 4 Z",
  dress: "M32 6 L22 2 L8 14 L14 24 L20 20 L16 62 L48 62 L44 20 L50 24 L56 14 L42 2 Z",
  jacket: "M32 6 L18 2 L2 14 L8 26 L14 21 L14 60 L50 60 L50 21 L56 26 L62 14 L46 2 L32 10 Z",
  coat: "M32 4 L16 0 L0 14 L6 26 L14 20 L10 62 L54 62 L50 20 L58 26 L64 14 L48 0 L32 8 Z",
  pants: "M14 4 H50 V20 L44 62 H34 L32 26 L30 62 H20 L14 20 Z",
  sweater: "M32 8 L18 4 L4 16 L10 27 L17 22 L17 60 L47 60 L47 22 L54 27 L60 16 L46 4 Z",
  scarf: "M6 20 C6 12 14 8 22 12 C30 16 34 10 42 14 C50 18 56 14 58 22 C48 22 44 30 34 26 C24 22 20 30 10 28 C6 26 6 22 6 20 Z",
  beanie: "M32 4 C16 4 8 18 8 32 H56 C56 18 48 4 32 4 Z M8 32 H56 V40 H8 Z",
};

export default function ClothingIcon({ icon = "shirt", color = "#4B2E45", className = "" }) {
  const path = PATHS[icon] || PATHS.shirt;
  return (
    <svg
      viewBox="0 0 64 64"
      className={className}
      role="img"
      aria-label={`${icon} illustration`}
    >
      <rect width="64" height="64" fill="none" />
      <path d={path} fill={color} stroke="rgba(0,0,0,0.18)" strokeWidth="1.2" strokeLinejoin="round" />
    </svg>
  );
}
