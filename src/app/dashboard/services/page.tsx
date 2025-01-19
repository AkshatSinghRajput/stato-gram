import ServicesComponent from "@/components/service/Service";
import { getServicesForOrganization } from "@/server/actions/service/service.actions";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function ServicePage() {
  const user = await auth();
  if (!user) {
    redirect("/sign-in");
  }
  if (!user.orgId) {
    redirect("/dashboard");
  }
  const services = await getServicesForOrganization(user.orgId);
  if (!services.success || !services.services) {
    redirect("/dashboard");
  }

  return <ServicesComponent services={services.services}></ServicesComponent>;
}
