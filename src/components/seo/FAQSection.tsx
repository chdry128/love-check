type FAQ = { question: string; answer: string };

export function FAQSection({ items }: { items: FAQ[] }) {
  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-semibold">FAQs</h2>
      <div className="space-y-3">
        {items.map((item) => (
          <article key={item.question} className="rounded-xl border bg-card p-4">
            <h3 className="font-medium">{item.question}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{item.answer}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
