# Duplicated HTML Reproduction

This app reproduces a Vercel-only duplicated HTML response issue with Next.js Cache Components.

The response for generated dynamic App Router routes can contain two full HTML documents:

```text
<!DOCTYPE html><html>...
... progressiveChunkSize / resumableState ...
<!DOCTYPE html><html>...
```

## Issue details

This repro keeps the minimal conditions that reproduced the issue:

- `cacheComponents: true`
- A dynamic route with `generateStaticParams()`
- At least one generated path calls `notFound()` during prerendering (`/faq` in this repro)
- The same route tree includes a `<Suspense>` boundary around a dynamic function (`connection()` here)

That build output looks like:

```text
ƒ /[slug]
└   /[slug]
  ├ ◐ /homepage
  ├ ◐ /deals
  └ ◐ [+more paths]
```

Duplicated HTML appears when a generated dynamic route has a prerender-time `notFound()` path and the route tree also contains postponed dynamic work. The original app hit this with `cookies()` inside a Suspense boundary; this minimized repro uses `connection()`.

The local build also prints this vague Server Components render error while generating static pages:

```text
[Error: An error occurred in the Server Components render. The specific message is omitted in production builds to avoid leaking sensitive details.] {
  digest: 'DYNAMIC_SERVER_USAGE'
}
```

That log is quite vague and looks more like an internal in Next.js rather than an user error, but disappears if the generated `/faq` route no longer calls `notFound()` during prerendering, and the deployed site stops returning duplicated HTML.