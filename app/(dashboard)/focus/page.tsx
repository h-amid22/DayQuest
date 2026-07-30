import { ComingNextButton, PlaceholderPanel } from "@/components/dashboard/placeholder";
import { PageHeader } from "@/components/dashboard/page-header";

export default function FocusPage() {
  return <><PageHeader eyebrow="Deep work" title="Focus" description="Give one mission your full attention."/><PlaceholderPanel title="Focus session" description="Timer controls will connect to your mission log in the next phase." className="focusPanel"><div className="timerVisual"><span>25:00</span><small>Focus block</small></div><label className="selectPlaceholder">Mission<select disabled aria-label="Select a mission"><option>Select a mission</option></select></label><ComingNextButton>Start focus session</ComingNextButton></PlaceholderPanel></>;
}
