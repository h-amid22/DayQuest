"use client";

import { useEffect } from "react";
import { logger } from "@/lib/logger";

export default function DashboardError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { logger.error("Dashboard route failed", { digest: error.digest }); }, [error]);
  return <section className="errorState" role="alert"><span className="statusGlyph" aria-hidden="true">!</span><h1>Your quest hit a snag</h1><p>We could not load this section. Your data is safe; try the request again.</p><button className="button" type="button" onClick={reset}>Try again</button></section>;
}
