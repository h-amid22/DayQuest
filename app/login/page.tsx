import { login } from "./actions";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  return <main className="shell"><h1>Sign in</h1><p className="notice">This example uses Supabase password authentication.</p><form className="form" action={login}><label>Email<input name="email" type="email" autoComplete="email" required /></label><label>Password<input name="password" type="password" autoComplete="current-password" minLength={8} required /></label>{error && <p role="alert">{error}</p>}<button className="button" type="submit">Sign in</button></form></main>;
}
