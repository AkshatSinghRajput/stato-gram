import CreateServiceForm from "@/components/service/CreateService";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function NewServicePage() {
  const user = await auth();
  if (!user) {
    redirect("/sign-in");
  }
  if (!user.orgId) {
    redirect("/dashboard");
  }
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <CreateServiceForm />
    </div>
  );
}
