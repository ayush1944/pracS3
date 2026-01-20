"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import UploadProductModal from "@/components/UploadProductModal";
import ProductCard from "@/components/ProductCard";

export default function AdminProductsPage() {
  const [open, setOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchProducts() {
    try {
      setLoading(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products`);
      const data = await res.json();
      setProducts(data.products || []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <Navbar />

      <section className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">
              Admin Products
            </h2>
            <p className="mt-1 text-sm text-zinc-400">
              Upload new products and manage your store items.
            </p>
          </div>

          <button
            onClick={() => setOpen(true)}
            className="rounded-xl bg-zinc-100 px-5 py-3 text-sm font-semibold text-zinc-950 hover:bg-zinc-200 cursor-pointer"
          >
            + Upload Product
          </button>
        </div>

        {/* Grid */}
        <div className="mt-8">
          {loading ? (
            <p className="text-zinc-400">Loading products...</p>
          ) : products.length === 0 ? (
            <p className="text-zinc-400">No products uploaded yet.</p>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          )}
        </div>
      </section>

      <UploadProductModal
        open={open}
        setOpen={setOpen}
        onSuccess={() => {
          setOpen(false);
          fetchProducts();
        }}
      />
    </main>
  );
}
