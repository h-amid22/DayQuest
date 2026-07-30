import { ComingNextButton, PlaceholderPanel } from "@/components/dashboard/placeholder";
import { PageHeader } from "@/components/dashboard/page-header";
import { ProgressSummary } from "@/components/dashboard/progress-summary";

export default function TodayPage() {
  const date = new Intl.DateTimeFormat("en", { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date());
  return <><PageHeader eyebrow={date} title="Today’s Quest" description="A clear day starts with one meaningful mission." actions={<ComingNextButton>Add your first mission</ComingNextButton>}/><div className="contentGrid todayGrid"><PlaceholderPanel title="Your timeline" description="Scheduled missions will take shape here."><div className="emptyTimeline"><span aria-hidden="true">✦</span><h3>Your path is clear</h3><p>Mission planning arrives in the next build. For now, your quest board is ready.</p></div></PlaceholderPanel><ProgressSummary/></div></>;
}
