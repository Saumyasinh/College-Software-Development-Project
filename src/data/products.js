// Professional ecommerce product catalog with local artwork
import { createProductArtwork } from "../utils/productArtwork";

export const CATEGORIES = ["Shirts", "Dresses", "Outerwear", "Knitwear", "Bottoms", "Accessories"];

const buildProduct = (product) => ({ ...product, image: createProductArtwork(product) });

export const products = [
  // SHIRTS - 6 items
  buildProduct({ id: "p01", name: "Coral Linen Shirt", category: "Shirts", price: 1899, color: "#F2724F", colorName: "Coral", fit: "Relaxed", icon: "👕" }),
  buildProduct({ id: "p02", name: "Powder Blue Blouse", category: "Shirts", price: 1699, color: "#A9C6D8", colorName: "Powder Blue", fit: "Fitted", icon: "👕" }),
  buildProduct({ id: "p03", name: "Soft Grey Overshirt", category: "Shirts", price: 1999, color: "#9CA3AE", colorName: "Soft Grey", fit: "Boxy", icon: "👕" }),
  buildProduct({ id: "p04", name: "Emerald Satin Shirt", category: "Shirts", price: 2399, color: "#1E7A5B", colorName: "Emerald", fit: "Fitted", icon: "👕" }),
  buildProduct({ id: "p05", name: "Pure White Shirt", category: "Shirts", price: 1599, color: "#FFFFFF", colorName: "Pure White", fit: "Classic", icon: "👕" }),
  buildProduct({ id: "p06", name: "Grass Green Polo", category: "Shirts", price: 1499, color: "#7FB241", colorName: "Grass Green", fit: "Regular", icon: "👕" }),

  // DRESSES - 6 items
  buildProduct({ id: "p07", name: "Peach Wrap Dress", category: "Dresses", price: 2999, color: "#F4B183", colorName: "Peach", fit: "Fitted", icon: "👗" }),
  buildProduct({ id: "p08", name: "Lavender Midi Dress", category: "Dresses", price: 3199, color: "#B7A6D9", colorName: "Lavender", fit: "Flowy", icon: "👗" }),
  buildProduct({ id: "p09", name: "Magenta Slip Dress", category: "Dresses", price: 2799, color: "#B0246E", colorName: "Magenta", fit: "Fitted", icon: "👗" }),
  buildProduct({ id: "p10", name: "Ivory Linen Set", category: "Dresses", price: 2999, color: "#F7F0DE", colorName: "Ivory", fit: "Relaxed", icon: "👗" }),
  buildProduct({ id: "p11", name: "Dusty Blue Shirt Dress", category: "Dresses", price: 2699, color: "#5E7C93", colorName: "Dusty Blue", fit: "Belted", icon: "👗" }),
  buildProduct({ id: "p12", name: "Sage Green Maxi Dress", category: "Dresses", price: 3299, color: "#8A9A7B", colorName: "Sage Green", fit: "Flowy", icon: "👗" }),

  // OUTERWEAR - 8 items
  buildProduct({ id: "p13", name: "Turquoise Bomber", category: "Outerwear", price: 3499, color: "#3AB4A0", colorName: "Turquoise", fit: "Regular", icon: "🧥" }),
  buildProduct({ id: "p14", name: "Rust Corduroy Jacket", category: "Outerwear", price: 3799, color: "#B4472C", colorName: "Rust", fit: "Regular", icon: "🧥" }),
  buildProduct({ id: "p15", name: "Chocolate Trench Coat", category: "Outerwear", price: 4999, color: "#5A3A29", colorName: "Chocolate", fit: "Oversized", icon: "🧥" }),
  buildProduct({ id: "p16", name: "True Red Blazer", category: "Outerwear", price: 3999, color: "#C21E32", colorName: "True Red", fit: "Tailored", icon: "🧥" }),
  buildProduct({ id: "p17", name: "Sapphire Wool Coat", category: "Outerwear", price: 5499, color: "#20509E", colorName: "Sapphire", fit: "Tailored", icon: "🧥" }),
  buildProduct({ id: "p18", name: "Camel Wool Coat", category: "Outerwear", price: 5299, color: "#C29A6B", colorName: "Camel", fit: "Oversized", icon: "🧥" }),
  buildProduct({ id: "p19", name: "Black Leather Jacket", category: "Outerwear", price: 6499, color: "#000000", colorName: "Black", fit: "Fitted", icon: "🧥" }),
  buildProduct({ id: "p20", name: "Navy Denim Jacket", category: "Outerwear", price: 2999, color: "#243A5E", colorName: "Navy", fit: "Regular", icon: "🧥" }),

  // KNITWEAR - 6 items
  buildProduct({ id: "p21", name: "Mustard Turtleneck", category: "Knitwear", price: 1799, color: "#D6A431", colorName: "Mustard", fit: "Slim", icon: "🧶" }),
  buildProduct({ id: "p22", name: "Rose Pink Cardigan", category: "Knitwear", price: 2099, color: "#D98CA0", colorName: "Rose Pink", fit: "Regular", icon: "🧶" }),
  buildProduct({ id: "p23", name: "Charcoal Turtleneck", category: "Knitwear", price: 1899, color: "#26282B", colorName: "Charcoal", fit: "Slim", icon: "🧶" }),
  buildProduct({ id: "p24", name: "Sage Green Knit Vest", category: "Knitwear", price: 1699, color: "#8A9A7B", colorName: "Sage Green", fit: "Cropped", icon: "🧶" }),
  buildProduct({ id: "p25", name: "Burnt Orange Sweater", category: "Knitwear", price: 2099, color: "#C1622B", colorName: "Burnt Orange", fit: "Chunky", icon: "🧶" }),
  buildProduct({ id: "p26", name: "Cream Cable Knit Sweater", category: "Knitwear", price: 2299, color: "#F5F1E8", colorName: "Cream", fit: "Oversized", icon: "🧶" }),

  // BOTTOMS - 6 items
  buildProduct({ id: "p27", name: "Olive Utility Trousers", category: "Bottoms", price: 2199, color: "#6E7A3F", colorName: "Olive", fit: "Straight", icon: "👖" }),
  buildProduct({ id: "p28", name: "Mint Culottes", category: "Bottoms", price: 1899, color: "#9FD6C4", colorName: "Mint", fit: "Wide", icon: "👖" }),
  buildProduct({ id: "p29", name: "Navy Wide-Leg Trousers", category: "Bottoms", price: 2499, color: "#243A5E", colorName: "Navy", fit: "Wide", icon: "👖" }),
  buildProduct({ id: "p30", name: "Black Tailored Trousers", category: "Bottoms", price: 2399, color: "#161414", colorName: "Black", fit: "Tailored", icon: "👖" }),
  buildProduct({ id: "p31", name: "Khaki Linen Shorts", category: "Bottoms", price: 1599, color: "#C4A77D", colorName: "Khaki", fit: "Relaxed", icon: "👖" }),
  buildProduct({ id: "p32", name: "Burgundy Corduroy Pants", category: "Bottoms", price: 2299, color: "#800020", colorName: "Burgundy", fit: "Slim", icon: "👖" }),

  // ACCESSORIES - 8 items
  buildProduct({ id: "p33", name: "Dusty Rose Scarf", category: "Accessories", price: 899, color: "#C98A93", colorName: "Dusty Rose", fit: "One Size", icon: "🧣" }),
  buildProduct({ id: "p34", name: "Golden Yellow Beanie", category: "Accessories", price: 599, color: "#F2C14E", colorName: "Warm Yellow", fit: "One Size", icon: "🧢" }),
  buildProduct({ id: "p35", name: "Black Leather Gloves", category: "Accessories", price: 1199, color: "#161414", colorName: "Black", fit: "One Size", icon: "🧤" }),
  buildProduct({ id: "p36", name: "Premium Crossbody Bag", category: "Accessories", price: 1499, color: "#8B4513", colorName: "Cognac", fit: "Standard", icon: "👜" }),
  buildProduct({ id: "p37", name: "Canvas Tote Bag", category: "Accessories", price: 1899, color: "#9CA3AE", colorName: "Grey", fit: "One Size", icon: "👜" }),
  buildProduct({ id: "p38", name: "Wide Brim Hat", category: "Accessories", price: 1299, color: "#5A3A29", colorName: "Brown", fit: "One Size", icon: "🎩" }),
  buildProduct({ id: "p39", name: "Gold Chain Necklace", category: "Accessories", price: 999, color: "#FFD700", colorName: "Gold", fit: "One Size", icon: "⛓️" }),
  buildProduct({ id: "p40", name: "Pearl Drop Earrings", category: "Accessories", price: 1399, color: "#FFFACD", colorName: "Pearl White", fit: "One Size", icon: "💎" }),
];

export function findProduct(id) {
  return products.find((p) => p.id === id);
}
