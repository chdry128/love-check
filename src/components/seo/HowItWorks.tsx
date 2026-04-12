export function HowItWorks({ title, steps }: { title: string; steps: string[] }) {
  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-semibold">How {title} works</h2>
      <ol className="list-decimal space-y-2 pl-6 text-muted-foreground">
        {steps.map((step) => (
          <li key={step}>{step}</li>
        ))}
      </ol>
    </section>
  );
}
