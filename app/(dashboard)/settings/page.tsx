import { PageHeader } from "@/components/dashboard/page-header";

const settings = [{ title: "Profile", text: "Display name and avatar" }, { title: "Timezone", text: "UTC placeholder until profile settings connect" }, { title: "Appearance", text: "Theme-ready colour preferences" }, { title: "Motion", text: "Reduced-motion preferences" }, { title: "Sound", text: "Optional feedback, off by default" }, { title: "Notifications", text: "Planning and focus reminders" }];

export default function SettingsPage() {
  return <><PageHeader eyebrow="Preferences" title="Settings" description="Shape DayQuest around the way you plan and focus."/><div className="settingsList">{settings.map((setting) => <section key={setting.title}><div><h2>{setting.title}</h2><p>{setting.text}</p></div><button type="button" disabled aria-label={`${setting.title} settings coming next`}>Coming next</button></section>)}</div></>;
}
