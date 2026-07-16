import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Upload, RotateCcw, ShoppingBag } from "lucide-react";
import { classifySkinTone, getSeasonPalette, averageColorFromImageData, bestMatchInPalette } from "../utils/colorAnalysis";
import { useAuth } from "../context/AuthContext";
import ProductCard from "../components/ProductCard";
import { products } from "../data/products";

const SAMPLE_RADIUS = 14; // px, radius of the patch sampled around each tap

export default function SkinToneAnalyzer() {
  const fileInputRef = useRef(null);
  const canvasRef = useRef(null);
  const imgRef = useRef(null);
  const { saveProfile, profile } = useAuth();

  const [imageSrc, setImageSrc] = useState(null);
  const [error, setError] = useState("");
  const [sampledRgb, setSampledRgb] = useState(null);
  const [result, setResult] = useState(profile || null);
  const [markerPos, setMarkerPos] = useState(null);

  function handleFile(e) {
    const file = e.target.files?.[0];
    setError("");
    setResult(null);
    setSampledRgb(null);
    setMarkerPos(null);
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file (JPG or PNG).");
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      setError("Image is too large. Please use a photo under 8MB.");
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => setError("Couldn't read that file. Please try another photo.");
    reader.onload = () => setImageSrc(reader.result);
    reader.readAsDataURL(file);
  }

  function handleImageLoad() {
    const img = imgRef.current;
    const canvas = canvasRef.current;
    if (!img || !canvas) return;
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);
  }

  function handleCanvasClick(e) {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = Math.round((e.clientX - rect.left) * scaleX);
    const y = Math.round((e.clientY - rect.top) * scaleY);

    const ctx = canvas.getContext("2d");
    const startX = Math.max(0, x - SAMPLE_RADIUS);
    const startY = Math.max(0, y - SAMPLE_RADIUS);
    const w = Math.min(canvas.width - startX, SAMPLE_RADIUS * 2);
    const h = Math.min(canvas.height - startY, SAMPLE_RADIUS * 2);

    try {
      const imageData = ctx.getImageData(startX, startY, w, h);
      const { r, g, b } = averageColorFromImageData(imageData);
      setSampledRgb({ r, g, b });
      setMarkerPos({ xPct: (x / canvas.width) * 100, yPct: (y / canvas.height) * 100 });

      const classification = classifySkinTone(r, g, b);
      const palette = getSeasonPalette(classification);
      const finalResult = { ...classification, rgb: { r, g, b }, palette };
      setResult(finalResult);
      saveProfile(finalResult);
    } catch {
      setError("Couldn't sample that spot — try tapping again, closer to the center of the photo.");
    }
  }

  function reset() {
    setImageSrc(null);
    setResult(null);
    setSampledRgb(null);
    setMarkerPos(null);
    setError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  const matchedProducts = result
    ? products
        .map((p) => ({ product: p, match: bestMatchInPalette(p.color, result.palette) }))
        .sort((a, b) => b.match.similarity - a.match.similarity)
        .slice(0, 8)
    : [];

  return (
    <div className="mx-auto max-w-5xl px-5 py-10 md:px-8">
      <div className="max-w-2xl">
        <h1 className="font-display text-3xl font-medium text-ink md:text-4xl">Find your color palette</h1>
        <p className="mt-3 text-sm text-ink-soft md:text-base">
          Upload a well-lit, makeup-free photo, then tap a plain patch of skin — your cheek or forehead
          works best. Everything runs in your browser; the photo is never uploaded anywhere.
        </p>
      </div>

      {!imageSrc && (
        <div className="mt-8">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFile}
            className="hidden"
            id="photo-upload"
          />
          <label
            htmlFor="photo-upload"
            className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-3xl border-2 border-dashed border-ink/20 bg-white/50 px-8 py-20 text-center hover:border-plum/50"
          >
            <Upload size={28} className="text-plum" />
            <span className="font-display text-lg text-ink">Tap to upload a photo</span>
            <span className="text-xs text-ink-soft">JPG or PNG, under 8MB</span>
          </label>
        </div>
      )}

      {error && (
        <p className="mt-4 rounded-lg bg-rust/10 px-4 py-3 text-sm text-rust">{error}</p>
      )}

      {imageSrc && (
        <div className="mt-8 grid gap-10 md:grid-cols-2">
          <div>
            <div className="relative overflow-hidden rounded-2xl border border-ink/10">
              {/* Hidden source image used to draw onto the canvas at natural resolution */}
              <img
                ref={imgRef}
                src={imageSrc}
                alt="Uploaded for color analysis"
                onLoad={handleImageLoad}
                className="hidden"
              />
              <canvas
                ref={canvasRef}
                onClick={handleCanvasClick}
                className="w-full cursor-crosshair"
              />
              {markerPos && (
                <span
                  className="pointer-events-none absolute h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-lg"
                  style={{
                    left: `${markerPos.xPct}%`,
                    top: `${markerPos.yPct}%`,
                    backgroundColor: sampledRgb ? `rgb(${sampledRgb.r},${sampledRgb.g},${sampledRgb.b})` : "transparent",
                  }}
                />
              )}
            </div>
            <div className="mt-4 flex items-center justify-between">
              <p className="text-xs text-ink-soft">
                {sampledRgb ? "Tap another spot to resample." : "Tap a plain skin patch on the photo."}
              </p>
              <button onClick={reset} className="flex items-center gap-1.5 text-xs font-semibold text-ink-soft hover:text-ink">
                <RotateCcw size={13} /> Start over
              </button>
            </div>
          </div>

          <div>
            {!result && (
              <div className="flex h-full items-center justify-center rounded-2xl border border-dashed border-ink/15 p-10 text-center">
                <p className="text-sm text-ink-soft">Your results will appear here once you tap a spot on your photo.</p>
              </div>
            )}

            {result && (
              <div>
                <div className="flex items-center gap-4">
                  <span
                    className="h-14 w-14 rounded-full border border-ink/15 shadow-sm"
                    style={{ backgroundColor: `rgb(${result.rgb.r},${result.rgb.g},${result.rgb.b})` }}
                  />
                  <div>
                    <p className="font-display text-xl font-medium text-ink">{result.undertone} undertone · {result.depth}</p>
                    <p className="text-xs text-ink-soft">Palette: {result.palette.label}</p>
                  </div>
                </div>

                <p className="mt-4 text-sm text-ink-soft">{result.palette.story}</p>

                <div className="mt-6">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-soft">Wear these</p>
                  <div className="flex flex-wrap gap-3">
                    {result.palette.recommended.map((c) => (
                      <div key={c.hex} className="flex flex-col items-center gap-1.5">
                        <span className="h-10 w-10 rounded-full border border-ink/10 shadow-sm" style={{ backgroundColor: c.hex }} />
                        <span className="text-[11px] text-ink-soft">{c.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-5">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-soft">Use sparingly</p>
                  <div className="flex flex-wrap gap-3">
                    {result.palette.avoid.map((c) => (
                      <div key={c.hex} className="flex flex-col items-center gap-1.5">
                        <span className="h-10 w-10 rounded-full border border-ink/10 shadow-sm" style={{ backgroundColor: c.hex }} />
                        <span className="text-[11px] text-ink-soft">{c.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <a
                  href="#matches"
                  className="mt-8 inline-flex items-center gap-2 rounded-full bg-plum px-6 py-3 text-sm font-semibold text-paper"
                >
                  <ShoppingBag size={16} /> Shop this palette
                </a>
              </div>
            )}
          </div>
        </div>
      )}

      {result && (
        <div id="matches" className="mt-20 scroll-mt-20">
          <div className="mb-6 flex items-end justify-between">
            <h2 className="font-display text-2xl font-medium text-ink">Best matches for you</h2>
            <Link to="/shop" className="text-sm font-semibold text-plum">View all products</Link>
          </div>
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
            {matchedProducts.map(({ product, match }) => (
              <ProductCard key={product.id} product={product} matchLabel={`${match.similarity}% match`} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
