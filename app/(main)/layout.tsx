import { Suspense } from "react";

import Link from "next/link";
import { connection } from "next/server";

const GENERATED_PAGE_LINKS = [
  { href: "/homepage", label: "Homepage" },
  { href: "/deals", label: "Deals" },
  { href: "/designer", label: "Designer" },
  { href: "/coupons", label: "Coupons" },
  { href: "/gifts", label: "Gifts" },
  { href: "/mothers-day-gifts", label: "Mother's Day Gifts" },
  { href: "/faq", label: "FAQ" },
];

async function getCachedShellData() {
  "use cache";

  await Promise.resolve();

  return {
    title: "Duplicated HTML Repro",
    subtitle: "Cached route-group shell with generated marketing pages.",
  };
}

async function RuntimeShellMarker() {
  await connection();

  return <div hidden data-testid="runtime-shell-marker" />;
}

export default async function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const shell = await getCachedShellData();

  return (
    <>
      <header className="border-b border-black/10 bg-white">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-1 px-6 py-5">
          <strong>{shell.title}</strong>
          <span className="text-sm text-zinc-600">{shell.subtitle}</span>
          <nav className="mt-4 flex flex-wrap gap-3 text-sm" aria-label="Generated pages">
            {GENERATED_PAGE_LINKS.map((link) => (
              <Link key={link.href} className="rounded border border-black/10 px-3 py-1 text-blue-700" href={link.href}>
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <Suspense fallback={null}>
        <RuntimeShellMarker />
      </Suspense>
      <main id="page-content" className="flex-1">
        <div className="mx-auto w-full max-w-6xl px-6 py-10">{children}</div>
      </main>
      <footer className="border-t border-black/10 bg-white">
        <div className="mx-auto w-full max-w-6xl px-6 py-5 text-sm text-zinc-600">Cached footer shell</div>
      </footer>
    </>
  );
}
