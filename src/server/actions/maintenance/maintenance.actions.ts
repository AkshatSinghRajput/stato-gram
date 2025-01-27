"use server";

import {
  createMaintenanceType,
  MaintenanceType,
} from "@/types/maintenance.types";
import { auth } from "@clerk/nextjs/server";
import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";

// const base_url = "http://localhost:8000/api/v1/maintenance";
const base_url = process.env.BACKEND_URL + "/maintenance";

// Get all maintenance for the organization
export async function getAllMaintenance({
  organization_id,
}: {
  organization_id: string;
}): Promise<{
  success: boolean;
  message: string;
  maintenance?: MaintenanceType[];
}> {
  try {
    const response = await fetch(
      `${base_url}/get-all-maintenances/${organization_id}`,
      {
        method: "GET",
        cache: "no-cache",
      }
    );

    const responseJson = await response.json();

    if (!responseJson.success) {
      return { success: false, message: "Error getting maintenance" }; // Return error if getting maintenance fails
    }

    return {
      success: true,
      message: "Maintenance found", // Return success message
      maintenance: responseJson.data as MaintenanceType[], // Return maintenance records
    };
  } catch (error) {
    console.error("Error getting maintenance: ", error); // Log the error
    return {
      success: false,
      message: "Error getting maintenance", // Return error message
    };
  }
}

// Get the maintenance by ID for the organization
export async function getMaintenanceById({
  maintenance_id,
  organization_id,
}: {
  maintenance_id: string;
  organization_id: string;
}): Promise<{
  success: boolean;
  message: string;
  maintenance?: MaintenanceType;
}> {
  try {
    const response = await fetch(
      `${base_url}/get-maintenance/${organization_id}/${maintenance_id}`,
      {
        method: "GET",
        cache: "no-cache",
      }
    );
    const maintenanceJson = await response.json();
    if (!maintenanceJson.success) {
      return { success: false, message: "Error getting maintenance" }; // Return error if getting maintenance fails
    }
    return {
      success: true,
      message: "Maintenance found", // Return success message
      maintenance: maintenanceJson.data as MaintenanceType, // Return maintenance record
    };
  } catch (error) {
    console.error("Error getting maintenance: ", error); // Log the error
    return {
      success: false,
      message: "Error getting maintenance", // Return error message
    };
  }
}

// Create a new maintenance
export async function createMaintenance({
  maintenanceData,
}: {
  maintenanceData: createMaintenanceType;
}): Promise<{
  success: boolean;
  message: string;
}> {
  try {
    const user = await auth(); // Authenticate the user
    if (!user) {
      return { success: false, message: "User not authenticated" }; // Return error if user is not authenticated
    }
    const response = await fetch(`${base_url}/create-maintenance`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        organizationId: user?.orgId,
        sessionId: user?.sessionId,
      },
      body: JSON.stringify({
        maintenance_id: randomUUID({ disableEntropyCache: true }),
        organization_id: user?.orgId,
        maintenance_name: maintenanceData.maintenance_name,
        maintenance_description: maintenanceData.maintenance_description,
        maintenance_status: maintenanceData.maintenance_status,
        service_impacted: maintenanceData.services_impacted,
        start_from: maintenanceData.start_from,
        end_at: maintenanceData.end_at,
      }),
    });
    const responseJson = await response.json();

    if (!responseJson.success) {
      return { success: false, message: "Error creating maintenance" }; // Return error if maintenance creation fails
    }

    revalidatePath("/dashboard/incidents/maintenance"); // Revalidate the cache for the maintenance path
    return { success: true, message: "Maintenance created successfully" }; // Return success message
  } catch (error) {
    console.error("Error creating maintenance: ", error); // Log the error
    return {
      success: false,
      message: "Error creating maintenance", // Return error message
    };
  }
}

// Update the maintenance
export async function updateMaintenance({
  maintenance_id,
  organization_id,
  maintenanceData,
}: {
  maintenance_id: string;
  organization_id: string;
  maintenanceData: createMaintenanceType;
}): Promise<{
  success: boolean;
  message: string;
}> {
  try {
    const user = await auth(); // Authenticate the user
    if (!user) {
      return {
        success: false,
        message: "User not authenticated.", // Return error if user is not authenticated
      };
    }

    const response = await fetch(`${base_url}/update-maintenance`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        organizationId: organization_id,
        sessionId: user?.sessionId,
      },
      body: JSON.stringify({
        maintenance_id: maintenance_id,
        organization_id: organization_id,
        maintenance_name: maintenanceData.maintenance_name,
        maintenance_description: maintenanceData.maintenance_description,
        maintenance_status: maintenanceData.maintenance_status,
        service_impacted: maintenanceData.services_impacted,
        start_from: maintenanceData.start_from,
        end_at: maintenanceData.end_at,
      }),
    });

    const responseJson = await response.json();

    if (!responseJson.success) {
      return {
        success: false,
        message: "Error updating maintenance", // Return error if update fails
      };
    }

    revalidatePath("/dashboard/maintenance"); // Revalidate the cache for the maintenance path
    return {
      success: true,
      message: "Successfully updated the Maintenance.", // Return success message
    };
  } catch (error) {
    console.error("Error in updating the Maintenance", error); // Log the error
    return {
      success: false,
      message: "Failed to update the Maintenance.", // Return error message
    };
  }
}

// Delete the maintenance by id for the organization
export async function deleteMaintenance({
  maintenance_id,
  organization_id,
}: {
  maintenance_id: string;
  organization_id: string;
}): Promise<{
  success: boolean;
  message: string;
}> {
  try {
    const user = await auth(); // Authenticate the user
    if (!user) {
      return {
        success: false,
        message: "User not authenticated.", // Return error if user is not authenticated
      };
    }

    const response = await fetch(
      `${base_url}/delete-maintenance/${maintenance_id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          organizationId: organization_id,
          sessionId: user?.sessionId,
        },
      }
    );

    const responseJson = await response.json();

    if (!responseJson.success) {
      return {
        success: false,
        message: "Error deleting maintenance", // Return error if delete fails
      };
    }
    revalidatePath("/dashboard/maintenance"); // Revalidate the cache for the maintenance path
    return {
      success: true,
      message: "Successfully deleted the Maintenance.", // Return success message
    };
  } catch (error) {
    console.error("Error in deleting the Maintenance", error); // Log the error
    return {
      success: false,
      message: "Failed to delete the Maintenance.", // Return error message
    };
  }
}
