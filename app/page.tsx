const features = ["Next.js App Router", "Prisma 7 + PostgreSQL", "Supabase authentication", "Strict TypeScript", "Vitest + CI"];

export default function HomePage() {
  return (
    <main className="shell">
      <section className="hero">
        <span className="eyebrow">Starter operational</span>
        <h1>Build the product, not the plumbing.</h1>
        <p>A focused foundation for secure, typed Next.js applications with PostgreSQL and optional Supabase authentication.</p>
        <div className="actions"><a className="button" href="/login">Sign in example</a><a className="textLink" href="/protected">Protected example →</a></div>
      </section>
      <section className="grid" aria-label="Included capabilities">
        {features.map((feature) => <article className="card" key={feature}><span aria-hidden="true">✓</span><h2>{feature}</h2></article>)}
      </section>
    </main>
  );
}
