import { PageHeader } from "@/components/dashboard/page-header";
import { PlaceholderPanel } from "@/components/dashboard/placeholder";

const metrics = [["Completion rate", "—"], ["Productive hours", "—"], ["Weekly XP", "0"], ["Current streak", "0 days"]];

export default function AnalyticsPage() {
  return <><PageHeader eyebrow="Quest insights" title="Analytics" description="Understand your pace without losing sight of what matters."/><div className="metricGrid">{metrics.map(([label, value]) => <article className="metricCard" key={label}><span>{label}</span><strong>{value}</strong><small>Waiting for mission data</small></article>)}</div><PlaceholderPanel title="Weekly momentum" description="A visual completion trend will appear here—without requiring a chart library."><div className="chartPlaceholder" aria-label="Empty weekly momentum chart">{[32, 48, 42, 65, 54, 76, 60].map((height, index) => <span style={{ height: `${height}%` }} key={index}/>)}</div></PlaceholderPanel></>;
}
