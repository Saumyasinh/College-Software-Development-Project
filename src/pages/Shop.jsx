import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { products, CATEGORIES } from "../data/products";

const uniqueColors = Array.from(new Map(products.map((p) => [p.color, p.colorName])).entries());

export default function Shop() {
  const [params, setParams] = useSearchParams();
  const activeColor = params.get("color") || "";
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("featured");

  const filtered = useMemo(() => {
    let list = products.filter((p) => {
      const matchesCategory = category === "All" || p.category === category;
      const matchesColor = !activeColor || p.color === activeColor;
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
      return matchesCategory && matchesColor && matchesSearch;
    });
    if (sort === "price-low") list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "price-high") list = [...list].sort((a, b) => b.price - a.price);
    return list;
  }, [category, activeColor, search, sort]);

  return (
    <div className="mx-auto max-w-7xl px-5 py-10 md:px-8">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-medium text-ink md:text-4xl">Shop all</h1>
        <p className="mt-2 text-sm text-ink-soft">{filtered.length} pieces</p>
      </div>

      <div className="flex flex-col gap-8 md:flex-row">
        {/* Filters sidebar */}
        <aside className="shrink-0 md:w-56">
          <div className="mb-6">
            <label htmlFor="search" className="mb-2 block text-xs font-semibold uppercase tracking-wide text-ink-soft">
              Search
            </label>
            <input
              id="search"
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products"
              className="w-full rounded-lg border border-ink/15 bg-white px-3 py-2 text-sm outline-none focus:border-plum"
            />
          </div>

          <div className="mb-6">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-soft">Category</p>
            <div className="flex flex-col gap-1.5">
              {["All", ...CATEGORIES].map((c) => (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  className={`rounded-lg px-3 py-1.5 text-left text-sm transition-colors ${
                    category === c ? "bg-plum text-paper" : "text-ink-soft hover:bg-ink/5"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-soft">Color</p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setParams({})}
                className={`h-8 rounded-full border px-3 text-xs ${!activeColor ? "border-plum text-plum" : "border-ink/15 text-ink-soft"}`}
              >
                All
              </button>
              {uniqueColors.map(([hex, name]) => (
                <button
                  key={hex}
                  onClick={() => setParams({ color: hex })}
                  title={name}
                  aria-label={name}
                  className={`h-8 w-8 rounded-full border-2 ${activeColor === hex ? "border-plum" : "border-transparent"}`}
                  style={{ backgroundColor: hex }}
                />
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="sort" className="mb-2 block text-xs font-semibold uppercase tracking-wide text-ink-soft">
              Sort by
            </label>
            <select
              id="sort"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="w-full rounded-lg border border-ink/15 bg-white px-3 py-2 text-sm outline-none focus:border-plum"
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </aside>

        {/* Grid */}
        <div className="flex-1">
          {filtered.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-ink/15 p-12 text-center">
              <p className="font-display text-lg text-ink">Nothing matches those filters.</p>
              <p className="mt-1 text-sm text-ink-soft">Try clearing the color or category filter.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 xl:grid-cols-4">
              {filtered.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
