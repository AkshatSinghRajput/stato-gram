"use server";

import dbConnect from "@/server/utils/database";

export async function getOrganizationDetailsFromSlug({
  slug,
}: {
  slug: string;
}) {
  await dbConnect();
}
