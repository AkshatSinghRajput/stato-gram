"use server";

import { PublicPageDataTypes } from "@/types/publicPage.types";

const base_url = `http://localhost:8000/api/v1`;

export async function getOrganizationDetailsFromSlug({
  slug,
}: {
  slug: string;
}): Promise<{
  success: boolean;
  message?: string;
  organization?: {
    organization_id: string;
    organization_name: string;
  };
}> {
  try {
    const response = await fetch(`${base_url}/get-organization-id/${slug}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    if (!data.success) {
      return {
        success: false,
        message: data.message,
      };
    }
    return {
      success: true,
      organization: {
        organization_id: data.data,
        organization_name: data.data.organization_name || "",
      },
    };
  } catch (error) {
    console.error("getOrganizationDetailsFromSlug", error);
    return {
      success: false,
      message: "Failed to get organization details",
    };
  }
}

export async function getPublicPageData({
  organization_id,
}: {
  organization_id: string;
}): Promise<{
  success: boolean;
  message?: string;
  data?: PublicPageDataTypes[];
}> {
  try {
    const response = await fetch(
      `${base_url}/public-page/get-public-page-data/${organization_id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();
    if (!data.success) {
      return {
        success: false,
        message: data.message,
      };
    }
    return {
      success: true,
      data: data.data,
    };
  } catch (error) {
    console.error("getPublicPageData", error);
    return {
      success: false,
      message: "Failed to get public page data",
    };
  }
}
