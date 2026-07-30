type Level = "debug" | "info" | "warn" | "error";
type Context = Record<string, unknown>;
const ranks: Record<Level, number> = { debug: 10, info: 20, warn: 30, error: 40 };

function sanitize(context: Context): Context {
  return Object.fromEntries(Object.entries(context).filter(([key]) => !/password|secret|token|authorization|cookie/i.test(key)));
}
function write(level: Level, message: string, context: Context = {}) {
  const configured = (process.env.LOG_LEVEL as Level | undefined) ?? "info";
  if (ranks[level] < ranks[configured]) return;
  const record = JSON.stringify({ timestamp: new Date().toISOString(), level, message, ...sanitize(context) });
  if (level === "error") console.error(record); else if (level === "warn") console.warn(record); else console.log(record);
}
export const logger = { debug: (m: string, c?: Context) => write("debug", m, c), info: (m: string, c?: Context) => write("info", m, c), warn: (m: string, c?: Context) => write("warn", m, c), error: (m: string, c?: Context) => write("error", m, c) };
