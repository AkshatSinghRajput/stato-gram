import { CreateOrganization } from "@clerk/nextjs";

export default function CreateOrganizationPage() {
  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)]">
      <CreateOrganization />
    </div>
  );
}
