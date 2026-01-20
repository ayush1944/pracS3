import Link from "next/link";

export default function Hero() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16">
      <div className="grid gap-10 md:grid-cols-2 md:items-center">
        
        {/* Left */}
        <div>
          <p className="inline-flex items-center rounded-full border border-zinc-800 bg-zinc-900 px-3 py-1 text-xs text-zinc-300">
            Product • Details • Upload
          </p>

          <h1 className="mt-5 text-4xl font-bold leading-tight tracking-tight md:text-5xl">
            Manage products.
          </h1>

          <p className="mt-4 text-zinc-400">
            Upload products with images and manage your store seamlessly.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/admin/products"
              className="rounded-xl bg-zinc-100 px-5 py-3 text-sm font-semibold text-zinc-950 hover:bg-zinc-200"
            >
              Upload Products
            </Link>

            <button className="cursor-not-allowed rounded-xl border border-zinc-800 px-5 py-3 text-sm text-zinc-200 hover:bg-zinc-900">
              View Store
            </button>
          </div>
        </div>

        {/* Right */}
        <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6 shadow-lg">
          <div className="space-y-4">
            <div className="h-10 w-3/4 rounded-xl bg-zinc-800" />
            <div className="h-10 w-full rounded-xl bg-zinc-800" />
            <div className="h-10 w-2/3 rounded-xl bg-zinc-800" />
            <div className="h-40 w-full rounded-2xl bg-zinc-800" />
          </div>
        </div>
      </div>
    </section>
  );
}
