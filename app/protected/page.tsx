import { redirect } from "next/navigation";

export default function ProtectedCompatibilityPage() {
  redirect("/today");
}
