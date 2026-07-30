import { PageHeader } from "@/components/dashboard/page-header";
import { PlaceholderPanel } from "@/components/dashboard/placeholder";

const groups = [{ title: "Planned", note: "Ready for the journey" }, { title: "In progress", note: "Your active missions" }, { title: "Completed", note: "Victories collect here" }];

export default function MissionsPage() {
  return <><PageHeader eyebrow="Mission log" title="Missions" description="Review every commitment from first plan to final check."/><div className="filterPlaceholder" aria-label="Mission filters coming soon"><span>Search missions</span><span>All priorities</span><span>All categories</span></div><div className="threeColumnGrid">{groups.map((group) => <PlaceholderPanel title={group.title} description={group.note} key={group.title}><div className="emptyCompact">No missions yet</div></PlaceholderPanel>)}</div></>;
}
