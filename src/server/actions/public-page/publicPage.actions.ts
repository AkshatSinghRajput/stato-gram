"use server";

import { PublicPageDataTypes } from "@/types/publicPage.types";
import axios from "axios";

// Define the base URL for the backend API Ex: http://localhost:8000/api/v1
const base_url = process.env.BACKEND_URL;

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
    const response = await axios.get(
      `${base_url}/public-route/get-organization-id/${slug}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = response.data;
    if (!data.success) {
      return {
        success: false,
        message: data.message,
      };
    }
    return {
      success: true,
      organization: {
        organization_id: data.data.organization_id || "",
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
    const response = await axios.get(
      `${base_url}/public-page/get-public-page-data/${organization_id}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = response.data;
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
