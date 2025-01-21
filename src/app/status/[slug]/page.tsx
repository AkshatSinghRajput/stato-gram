import PublicStatusComponent from "@/components/public-page/PublicPage";

export default async function PublicStatusPage({
  params,
}: {
  params: {
    slug: string;
  };
}) {
  const { slug } = params;
  return <PublicStatusComponent />;
}
