import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function IncidentPage() {
  const user = await auth();
  if (!user) {
    redirect("/sign-in");
  }
  if (!user.orgId) {
    redirect("/dashboard");
  }
  return (
    <div>
      <h1>Incidents</h1>
      <p>Incidents are listed here.</p>
    </div>
  );
}
