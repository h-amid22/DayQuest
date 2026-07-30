import { PageHeader } from "@/components/dashboard/page-header";

const achievements = [{ name: "First Mission", reward: 25 }, { name: "Perfect Day", reward: 100 }, { name: "Seven-Day Streak", reward: 150 }, { name: "Focus Beginner", reward: 25 }];

export default function AchievementsPage() {
  return <><PageHeader eyebrow="Milestones" title="Achievements" description="Every consistent step brings a new milestone within reach."/><div className="achievementGrid">{achievements.map((achievement) => <article className="achievementCard" key={achievement.name}><span className="lockGlyph" aria-hidden="true">◇</span><div><h2>{achievement.name}</h2><p>Locked · Progress begins with your first mission.</p></div><strong>+{achievement.reward} XP</strong><div className="progressTrack"><span/></div></article>)}</div></>;
}
