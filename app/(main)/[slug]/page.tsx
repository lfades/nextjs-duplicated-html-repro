import { notFound } from "next/navigation";

const PAGE_CONFIG = {
  homepage: {
    eyebrow: "Homepage",
    title: "Cached Homepage",
    body: "Minimal generated marketing page used to isolate the partial prerender reproduction.",
    sections: 8,
  },
  deals: {
    eyebrow: "Deals",
    title: "Cached Deals",
    body: "Second generated page for comparison.",
    sections: 4,
  },
  designer: {
    eyebrow: "Designer",
    title: "Cached Designer",
    body: "Additional generated marketing page.",
    sections: 8,
  },
  coupons: {
    eyebrow: "Coupons",
    title: "Cached Coupons",
    body: "Small generated page for comparison.",
    sections: 2,
  },
  gifts: {
    eyebrow: "Gifts",
    title: "Cached Gifts",
    body: "Additional generated marketing page.",
    sections: 4,
  },
  "mothers-day-gifts": {
    eyebrow: "Mother's Day",
    title: "Cached Mother's Day Gifts",
    body: "Additional generated marketing page.",
    sections: 10,
  },
  faq: {
    eyebrow: "FAQ",
    title: "Internal FAQ",
    body: "Internal page that should resolve to not found during prerendering.",
    internal: true,
    sections: 0,
  },
} as const;

type MarketingPageName = keyof typeof PAGE_CONFIG;

type PageProps = {
  params: { slug: string };
};

export function generateStaticParams() {
  return Object.keys(PAGE_CONFIG).map((page) => ({
    slug: page,
  }));
}

async function getMarketingPage(pageName: MarketingPageName) {
  "use cache";

  await Promise.resolve();

  return PAGE_CONFIG[pageName];
}

export default async function MarketingPage({ params }: PageProps) {
  "use cache";

  const { slug } = await params;

  if (!(slug in PAGE_CONFIG)) {
    notFound();
  }

  const page = await getMarketingPage(slug as MarketingPageName);

  if ("internal" in page && page.internal) {
    notFound();
  }

  const sections = Array.from({ length: page.sections }, (_, index) => ({
    id: `${slug}-section-${index}`,
    heading: `${page.eyebrow} section ${index + 1}`,
  }));

  return (
    <article className="w-full rounded-xl border border-black/10 bg-white p-8 shadow-sm">
      <p className="text-sm font-medium uppercase tracking-wide text-zinc-500">{page.eyebrow}</p>
      <h1 className="mt-3 text-4xl font-semibold">{page.title}</h1>
      <p className="mt-4 max-w-3xl text-base text-zinc-700">{page.body}</p>

      <section className="mt-10 space-y-6">
        {sections.map((section) => (
          <div key={section.id} className="rounded-lg border border-black/10 p-5">
            <h2 className="text-xl font-semibold">{section.heading}</h2>
            <p className="mt-3 text-sm leading-6 text-zinc-700">
              Stable server-rendered content inside a page-level cache boundary. The route-group layout also includes a
              Suspense-wrapped dynamic function.
            </p>
          </div>
        ))}
      </section>
    </article>
  );
}
