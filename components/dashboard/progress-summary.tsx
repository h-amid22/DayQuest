export function ProgressSummary({ compact = false }: { compact?: boolean }) {
  return <section className={compact ? "progressSummary compact" : "progressSummary"} aria-label="Daily progress preview"><div><span>Daily progress</span><strong>0 of 0 missions</strong></div><div className="progressTrack" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={0} aria-label="No daily progress yet"><span/></div><small>Progress tracking is coming next</small></section>;
}
