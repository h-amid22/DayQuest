import { PageHeader } from "@/components/dashboard/page-header";
import { PlaceholderPanel } from "@/components/dashboard/placeholder";

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function WeekPage() {
  return <><PageHeader eyebrow="Weekly planning" title="Your Week" description="Balance the road ahead before the week begins."/><PlaceholderPanel title="Seven-day overview" description="Workload and scheduled missions will appear by day."><div className="weekGrid">{days.map((day, index) => <article key={day}><span>{day}</span><strong>{index === 0 ? "Today" : "Open"}</strong><div className="miniSkeleton"/><div className="miniSkeleton short"/></article>)}</div></PlaceholderPanel></>;
}
