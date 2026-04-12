export function ResultMeaning({ title, points }: { title: string; points: string[] }) {
  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-semibold">What your result means</h2>
      <p className="text-muted-foreground">
        Your {title} score highlights current patterns, not your permanent future. Use it as guidance for better decisions.
      </p>
      <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
        {points.map((point) => (
          <li key={point}>{point}</li>
        ))}
      </ul>
    </section>
  );
}
