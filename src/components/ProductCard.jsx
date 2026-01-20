"use client";

import { useState } from "react";
import Image from "next/image";

import ArrowLeftSLineIcon from "remixicon-react/ArrowLeftSLineIcon";
import ArrowRightSLineIcon from "remixicon-react/ArrowRightSLineIcon";

export default function ProductCard({ product }) {
  const images = product?.filenames || [];
  const [activeIndex, setActiveIndex] = useState(0);

  const hasImages = images.length > 0;
  const currentImg = hasImages ? images[activeIndex] : null;

  const imgUrl = currentImg
    ? `${process.env.NEXT_PUBLIC_S3_CDN}/${currentImg}`
    : "/placeholder.png"; 

  function nextImage() {
    if (!hasImages) return;
    setActiveIndex((prev) => (prev + 1) % images.length);
  }

  function prevImage() {
    if (!hasImages) return;
    setActiveIndex((prev) => (prev - 1 + images.length) % images.length);
  }

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4 hover:border-zinc-700 transition">
      {/* Image Slider */}
      <div className="relative aspect-4/3 w-full overflow-hidden rounded-xl bg-zinc-800">
        <Image
          loading="eager"
          width={400}
          height={300}
          src={imgUrl}
          alt={product?.name || "Product"}
          className="h-full w-full object-cover"
        />

        {/* Prev Button */}
        {images.length > 1 && (
          <button
            onClick={prevImage}
            className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white hover:bg-black/70"
          >
            <ArrowLeftSLineIcon size={18} />
          </button>
        )}

        {/* Next Button */}
        {images.length > 1 && (
          <button
            onClick={nextImage}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white hover:bg-black/70"
          >
            <ArrowRightSLineIcon size={18} />
          </button>
        )}

        {/* Dots */}
        {images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1">
            {images.map((_, i) => (
              <div
                key={i}
                className={`h-2 w-2 rounded-full ${
                  i === activeIndex ? "bg-zinc-100" : "bg-zinc-500"
                }`}
              />
            ))}
          </div>
        )}

        {/* Image Count */}
        {images.length > 1 && (
          <div className="absolute top-3 right-3 rounded-lg bg-black/50 px-2 py-1 text-xs text-zinc-100">
            {activeIndex + 1}/{images.length}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="mt-4">
        <h3 className="text-lg font-semibold">{product.name}</h3>

        <p className="mt-1 text-sm text-zinc-400 line-clamp-2">
          {product.description}
        </p>

        <div className="mt-3 flex items-center justify-between">
          <p className="text-sm font-medium text-zinc-200">
            ₹{product.price}
          </p>

          <span className="rounded-lg border border-zinc-700 px-2 py-1 text-xs bg-green-700 text-zinc-100">
            Available
          </span>
        </div>
      </div>
    </div>
  );
}
