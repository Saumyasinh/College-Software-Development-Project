const CATEGORY_ICON = {
  Shirts: "👕",
  Dresses: "👗",
  Outerwear: "🧥",
  Knitwear: "🧶",
  Bottoms: "👖",
  Accessories: "👜",
};

function escapeXml(value = "") {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function createProductArtwork(product) {
  const name = escapeXml(product.name || "Style");
  const category = escapeXml(product.category || "Fashion");
  const colorName = escapeXml(product.colorName || "Signature");
  const color = product.color || "#C9A27A";
  const icon = CATEGORY_ICON[product.category] || "✨";

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="800" height="1000" viewBox="0 0 800 1000">
      <rect width="800" height="1000" rx="42" fill="#f7efe8"/>
      <rect x="70" y="70" width="660" height="860" rx="36" fill="url(#bg)"/>
      <circle cx="620" cy="220" r="150" fill="#ffffff" fill-opacity="0.24"/>
      <rect x="170" y="210" width="460" height="530" rx="40" fill="#fff" fill-opacity="0.9"/>
      <rect x="220" y="260" width="360" height="360" rx="32" fill="${color}" fill-opacity="0.95"/>
      <path d="M253 540c44-70 123-98 190-98s145 29 194 98" fill="none" stroke="#ffffff" stroke-width="28" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M305 242c0-64 44-110 100-110s100 46 100 110" fill="none" stroke="#ffffff" stroke-width="28" stroke-linecap="round"/>
      <rect x="215" y="720" width="370" height="90" rx="24" fill="#ffffff" fill-opacity="0.8"/>
      <text x="400" y="777" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="42" font-weight="700" fill="#2f2a24">${name}</text>
      <text x="400" y="835" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="28" fill="#6d5b4b">${category} · ${colorName}</text>
      <text x="400" y="900" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="76" fill="#ffffff" fill-opacity="0.95">${icon}</text>
      <defs>
        <linearGradient id="bg" x1="40%" y1="10%" x2="80%" y2="95%">
          <stop offset="0%" stop-color="#fefcf8"/>
          <stop offset="100%" stop-color="#efe0d1"/>
        </linearGradient>
      </defs>
    </svg>
  `;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}
