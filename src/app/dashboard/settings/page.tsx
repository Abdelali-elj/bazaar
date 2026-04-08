import SettingsClient from "./SettingsClient";
import { getUser } from "@/lib/actions/auth";

export default async function SettingsPage() {
  const user = await getUser();
  return <SettingsClient user={user} />;
}
