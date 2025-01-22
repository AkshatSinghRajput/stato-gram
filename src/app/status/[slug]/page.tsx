import PublicStatusComponent from "@/components/public-page/PublicPage";
import {
  getOrganizationDetailsFromSlug,
  getPublicPageData,
} from "@/server/actions/public-page/publicPage.actions";
import { getServicesForOrganization } from "@/server/actions/service/service.actions";
import { redirect } from "next/navigation";

export default async function PublicStatusPage({
  params,
}: {
  params: {
    slug: string;
  };
}) {
  const { slug } = params;
  const organization = await getOrganizationDetailsFromSlug({ slug });
  if (!organization.success || !organization.organization) {
    redirect("/404");
  }

  const public_page_data = await getPublicPageData({
    organization_id: organization.organization.organization_id,
  });

  if (!public_page_data.success || !public_page_data.data) {
    redirect("/404");
  }

  const services_data = await getServicesForOrganization(
    organization.organization.organization_id
  );

  if (!services_data.success || !services_data.services) {
    redirect("/404");
  }

  console.log(organization);

  return (
    <PublicStatusComponent
      incident_data={public_page_data.data}
      services_data={services_data.services}
      organization={organization.organization.organization_name}
    />
  );
}
