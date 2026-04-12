import Link from "next/link";

export default function ToolNotFound() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6">
      <h1 className="text-3xl font-bold">Tool not found</h1>
      <p className="mt-3 text-muted-foreground">
        This tool page does not exist or has moved to a new SEO URL.
      </p>
      <Link href="/tools" className="mt-6 inline-block rounded-lg border px-4 py-2 text-sm hover:bg-muted">
        Browse all tools
      </Link>
    </main>
  );
}
