import EditServiceForm from "@/components/service/EditService";
import { getServiceById } from "@/server/actions/service/service.actions";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
export default async function EditServicePage({
  params,
}: {
  params: {
    id: string;
  };
}) {
  const user = await auth();
  if (!user) {
    redirect("/sign-in");
  }
  if (!user.orgId) {
    redirect("/dashboard");
  }
  const serviceId = params.id;
  const serviceDetails = await getServiceById(serviceId, user.orgId);
  if (!serviceDetails.success || !serviceDetails.service) {
    redirect("/dashboard/services");
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <EditServiceForm service={serviceDetails?.service} />
    </div>
  );
}
