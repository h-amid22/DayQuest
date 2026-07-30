const features = ["Secure authentication", "Daily mission planning", "XP and streak foundations", "Production-ready architecture", "Accessible interactions"];

export default function HomePage() {
  return (
    <main className="shell">
      <section className="hero">
        <span className="eyebrow">DayQuest foundation</span>
        <h1>Plan your day like a quest.</h1>
        <p>DayQuest turns daily planning into an interactive journey built around missions, focus, progress and meaningful rewards.</p>
        <div className="actions"><a className="button" href="/login">Sign in</a><a className="textLink" href="/today">Open your quest →</a></div>
      </section>
      <section className="grid" aria-label="Included capabilities">
        {features.map((feature) => <article className="card" key={feature}><span aria-hidden="true">✓</span><h2>{feature}</h2></article>)}
      </section>
    </main>
  );
}
