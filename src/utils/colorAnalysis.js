// Seasonal color analysis engine.
// Takes an average sampled skin RGB color and derives:
//  1. Depth (how light/dark)
//  2. Undertone (warm / cool / neutral)
//  3. A matching "season" palette of clothing colors, plus colors to avoid.
//
// This uses the classic 4-season color theory model (Spring / Summer /
// Autumn / Winter), which is a well-documented, explainable heuristic —
// not a medical or biometric diagnosis.

export function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      default: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return { h: h * 360, s: s * 100, l: l * 100 };
}

function luminance(r, g, b) {
  return 0.299 * r + 0.587 * g + 0.114 * b;
}

// Warmth score: positive = warm (yellow/golden/peachy undertone),
// negative = cool (pink/rosy/blue undertone).
function warmthScore(r, g, b) {
  return (r - b) / 255 - (b - g) / 510;
}

export function classifySkinTone(r, g, b) {
  const L = luminance(r, g, b);
  const warmth = warmthScore(r, g, b);

  let depth;
  if (L > 195) depth = "Fair";
  else if (L > 160) depth = "Light";
  else if (L > 125) depth = "Medium";
  else if (L > 90) depth = "Tan";
  else depth = "Deep";

  let undertone;
  if (warmth > 0.14) undertone = "Warm";
  else if (warmth < 0.045) undertone = "Cool";
  else undertone = "Neutral";

  return { depth, undertone, luminance: Math.round(L), warmth: Number(warmth.toFixed(3)) };
}

// Palette library keyed by season archetype.
const PALETTES = {
  Spring: {
    label: "Spring — Warm & Light",
    story:
      "Your undertone is warm and your coloring is light, so clear, golden-based brights bring out the same warmth in your skin instead of fighting it.",
    recommended: [
      { name: "Coral", hex: "#F2724F" },
      { name: "Peach", hex: "#F4B183" },
      { name: "Warm Yellow", hex: "#F2C14E" },
      { name: "Turquoise", hex: "#3AB4A0" },
      { name: "Grass Green", hex: "#7FB241" },
      { name: "Ivory", hex: "#F7F0DE" },
    ],
    avoid: [
      { name: "Icy Grey", hex: "#A9AFB5" },
      { name: "Black", hex: "#161414" },
    ],
  },
  Autumn: {
    label: "Autumn — Warm & Deep",
    story:
      "Your undertone is warm and rich, so earthy, muted colors with a golden base read as harmonious rather than washed out or heavy.",
    recommended: [
      { name: "Rust", hex: "#B4472C" },
      { name: "Olive", hex: "#6E7A3F" },
      { name: "Mustard", hex: "#D6A431" },
      { name: "Chocolate", hex: "#5A3A29" },
      { name: "Burnt Orange", hex: "#C1622B" },
      { name: "Camel", hex: "#C29A6B" },
    ],
    avoid: [
      { name: "Icy Pink", hex: "#F4C6D7" },
      { name: "Pure White", hex: "#FFFFFF" },
    ],
  },
  Summer: {
    label: "Summer — Cool & Light",
    story:
      "Your undertone is cool and your coloring is light, so soft, muted colors with a blue base flatter you far more than anything overly warm or saturated.",
    recommended: [
      { name: "Powder Blue", hex: "#A9C6D8" },
      { name: "Lavender", hex: "#B7A6D9" },
      { name: "Rose Pink", hex: "#D98CA0" },
      { name: "Soft Grey", hex: "#9CA3AE" },
      { name: "Mint", hex: "#9FD6C4" },
      { name: "Dusty Blue", hex: "#5E7C93" },
    ],
    avoid: [
      { name: "Mustard", hex: "#D6A431" },
      { name: "Burnt Orange", hex: "#C1622B" },
    ],
  },
  Winter: {
    label: "Winter — Cool & Deep",
    story:
      "Your undertone is cool and your coloring has strong contrast, so bold, clear jewel tones and true black-and-white hold their own against your natural depth.",
    recommended: [
      { name: "Emerald", hex: "#1E7A5B" },
      { name: "Sapphire", hex: "#20509E" },
      { name: "Magenta", hex: "#B0246E" },
      { name: "True Red", hex: "#C21E32" },
      { name: "Charcoal", hex: "#26282B" },
      { name: "Pure White", hex: "#FFFFFF" },
    ],
    avoid: [
      { name: "Mustard", hex: "#D6A431" },
      { name: "Peach", hex: "#F4B183" },
    ],
  },
  Neutral: {
    label: "Neutral — Balanced",
    story:
      "Your undertone sits between warm and cool, so balanced, low-contrast colors work with your skin rather than a strict warm or cool palette.",
    recommended: [
      { name: "Navy", hex: "#243A5E" },
      { name: "Charcoal", hex: "#3A3A3A" },
      { name: "Dusty Rose", hex: "#C98A93" },
      { name: "Sage Green", hex: "#8A9A7B" },
      { name: "Camel", hex: "#C29A6B" },
      { name: "Soft White", hex: "#F3F1EA" },
    ],
    avoid: [
      { name: "Neon Green", hex: "#39FF14" },
    ],
  },
};

export function getSeasonPalette({ depth, undertone }) {
  if (undertone === "Neutral") return PALETTES.Neutral;
  const light = depth === "Fair" || depth === "Light";
  if (undertone === "Warm") return light ? PALETTES.Spring : PALETTES.Autumn;
  return light ? PALETTES.Summer : PALETTES.Winter;
}

// Distance between two hex colors in RGB space (0-441 range), used to
// rank products against the recommended palette.
export function hexToRgb(hex) {
  const clean = hex.replace("#", "");
  const bigint = parseInt(clean, 16);
  return { r: (bigint >> 16) & 255, g: (bigint >> 8) & 255, b: bigint & 255 };
}

export function colorDistance(hexA, hexB) {
  const a = hexToRgb(hexA);
  const b = hexToRgb(hexB);
  return Math.sqrt((a.r - b.r) ** 2 + (a.g - b.g) ** 2 + (a.b - b.b) ** 2);
}

// Given a product's hex color and a season palette, return the closest
// matching palette color name + a similarity score (0-100).
export function bestMatchInPalette(productHex, palette) {
  let best = null;
  for (const swatch of palette.recommended) {
    const dist = colorDistance(productHex, swatch.hex);
    if (!best || dist < best.dist) best = { ...swatch, dist };
  }
  const similarity = Math.max(0, Math.round(100 - (best.dist / 441) * 100));
  return { ...best, similarity };
}

// Sample average RGB from an ImageData region (used after the user taps
// a spot on their uploaded photo, e.g. a cheek or forehead patch).
export function averageColorFromImageData(imageData) {
  const { data } = imageData;
  let r = 0, g = 0, b = 0, count = 0;
  for (let i = 0; i < data.length; i += 4) {
    // Skip near-transparent / pure black or white sampling artifacts
    const alpha = data[i + 3];
    if (alpha < 200) continue;
    r += data[i];
    g += data[i + 1];
    b += data[i + 2];
    count++;
  }
  if (count === 0) return { r: 0, g: 0, b: 0 };
  return { r: Math.round(r / count), g: Math.round(g / count), b: Math.round(b / count) };
}
