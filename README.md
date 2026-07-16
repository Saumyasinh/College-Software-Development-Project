# TONE. — Color-Matched Fashion E-commerce (Final Year Project)

A fully responsive e-commerce web app with a unique feature: upload a photo,
tap a patch of skin, and the app tells you your color palette (undertone +
depth) using seasonal color theory — then shows you clothes from the catalog
that match it, ranked by similarity.

Everything runs client-side. No backend/database is required to demo it —
cart, wishlist, login, and your color profile persist in the browser via
`localStorage`, so the demo is stable and has no external moving parts.

## Features

- Responsive storefront: home, shop with filters (category, color, search, sort), product detail, cart, checkout, order confirmation
- Mock authentication (sign up / sign in), persisted locally
- Cart and wishlist, persisted locally
- **Color Match**: upload a photo, tap your cheek/forehead, get:
  - Undertone (Warm / Cool / Neutral) and depth (Fair to Deep)
  - A named season palette (Spring / Summer / Autumn / Winter / Neutral) with an explanation
  - Recommended colors to wear and colors to use sparingly
  - Products from the catalog ranked by color-match percentage
- All product "photos" are rendered as colored SVG silhouettes, so there are no broken image links or network dependencies

## How the color matching works

1. You tap a spot on your uploaded photo.
2. The app reads a small pixel patch around that point from an HTML canvas (nothing is uploaded to a server).
3. It averages the RGB values, computes luminance (depth) and a warm/cool score based on the red-vs-blue balance (undertone).
4. That combination maps to one of five palettes, each with real hex-coded clothing colors, based on classic seasonal color analysis.
5. Every product in the catalog has a tagged hex color, so the whole catalog can be ranked by color distance to the recommended palette to surface the closest matches first.

This is a transparent, explainable heuristic, good for a viva since every step is justifiable, and it needs no ML model, API key, or internet access to run.

## Tech stack

- React 19 + Vite
- React Router
- Tailwind CSS v4
- lucide-react (icons)
- No backend, `localStorage` stands in for a database for this demo

## Getting started

```bash
npm install
npm run dev
```

Then open the printed local URL (usually `http://localhost:5173`).

To build a production version:

```bash
npm run build
npm run preview
```

## Project structure

```
src/
  components/    Navbar, Footer, ProductCard, ClothingIcon
  context/       CartContext (cart + wishlist), AuthContext (mock login + saved color profile)
  data/          products.js - mock catalog with hex color tags
  pages/         Home, Shop, ProductDetail, Cart, Checkout, OrderSuccess, Login, Signup, Wishlist, SkinToneAnalyzer
  utils/         colorAnalysis.js - the color-matching engine
```

## Notes for your presentation

- Checkout is fully simulated: any input is accepted, no real payment gateway is called, and it generates a mock order ID.
- Because there's no backend, data resets if you clear your browser's local storage. This is a deliberate scope choice for a demo; swapping in a real database (e.g. MongoDB + an Express API) would be the natural next step for production.
