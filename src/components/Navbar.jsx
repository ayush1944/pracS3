import Link from "next/link";

export default function Navbar() {
  return (
    <header className="w-full border-b border-zinc-800 bg-zinc-950/70 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-xl bg-zinc-800" />
          <span className="text-lg font-semibold tracking-tight">
            NightCart
          </span>
        </Link>

        <nav className="flex items-center gap-3">
          <Link
            href="/admin/products"
            className="rounded-xl border border-zinc-800 px-4 py-2 text-sm text-zinc-200 hover:bg-zinc-900"
          >
            Admin
          </Link>

          <button className="cursor-not-allowed rounded-xl bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-950 hover:bg-zinc-200">
            Get Started
          </button>
        </nav>
      </div>
    </header>
  );
}
