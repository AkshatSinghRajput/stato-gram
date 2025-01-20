"use server";

import maintenanceModel from "@/server/models/maintenance.model";
import dbConnect from "@/server/utils/database";
import {
  createMaintenanceType,
  MaintenanceType,
} from "@/types/maintenance.types";
import { auth } from "@clerk/nextjs/server";
import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { createActivity } from "../activity/activity.actions";

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
    await dbConnect(); // Connect to the database

    const user = await auth(); // Authenticate the user
    if (!user) {
      return { success: false, message: "User not authenticated" }; // Return error if user is not authenticated
    }

    const newMaintenance = await maintenanceModel.create({
      maintenance_id: randomUUID({ disableEntropyCache: true }), // Generate a unique ID for the maintenance
      organization_id: user?.orgId, // Set the organization ID from the authenticated user
      maintenance_name: maintenanceData.maintenance_name, // Set the maintenance name
      maintenance_description: maintenanceData.maintenance_description, // Set the maintenance description
      maintenance_status: maintenanceData.maintenance_status, // Set the maintenance status
      service_impacted: maintenanceData.services_impacted, // Set the services impacted
      start_from: maintenanceData.start_from, // Set the start time
      end_at: maintenanceData.end_at, // Set the end time
    });
    if (!newMaintenance) {
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
    await dbConnect(); // Connect to the database
    const maintenance = await maintenanceModel
      .find({ organization_id }, { _id: 0, __v: 0 }) // Find all maintenance records for the organization
      .lean()
      .exec();
    if (!maintenance) {
      return { success: false, message: "No maintenance found" }; // Return error if no maintenance found
    }
    const maintenanceJson = JSON.parse(JSON.stringify(maintenance)); // Convert maintenance records to JSON
    return {
      success: true,
      message: "Maintenance found", // Return success message
      maintenance: maintenanceJson, // Return maintenance records
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
    await dbConnect(); // Connect to the database
    const maintenance = await maintenanceModel
      .findOne({ maintenance_id, organization_id }, { _id: 0, __v: 0 }) // Find the maintenance record by ID and organization ID
      .lean()
      .exec();
    if (!maintenance) {
      return { success: false, message: "No maintenance found" }; // Return error if no maintenance found
    }
    const maintenanceJson = JSON.parse(JSON.stringify(maintenance)); // Convert maintenance record to JSON
    return {
      success: true,
      message: "Maintenance found", // Return success message
      maintenance: maintenanceJson, // Return maintenance record
    };
  } catch (error) {
    console.error("Error getting maintenance: ", error); // Log the error
    return {
      success: false,
      message: "Error getting maintenance", // Return error message
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
    await dbConnect(); // Connect to the database
    const user = await auth(); // Authenticate the user
    if (!user) {
      return {
        success: false,
        message: "User not authenticated.", // Return error if user is not authenticated
      };
    }

    // Update the Activity Feed for the organization if the maintenance status has changed
    const existingMaintenance: MaintenanceType = await maintenanceModel.findOne(
      {
        maintenance_id: maintenance_id,
        organization_id: organization_id,
      }
    );
    if (!existingMaintenance) {
      return {
        success: false,
        message: "Maintenance not found.", // Return error if maintenance not found
      };
    }

    if (
      existingMaintenance.maintenance_status !==
      maintenanceData.maintenance_status
    ) {
      // Update the Activity Feed for the organization
      const activity = await createActivity({
        activity: {
          action: maintenanceData.maintenance_status, // Set the action to the maintenance status
          organization_id: organization_id, // Set the organization ID
          actor_id: existingMaintenance.maintenance_id,
          actor_type: "maintenance",
          activity_description: `Maintenance status for ${existingMaintenance.maintenance_name} was updated to ${maintenanceData.maintenance_status}`, // Set the activity description
        },
      });
      if (!activity.success) {
        return {
          success: false,
          message: "Error updating activity feed.", // Return error if activity update fails
        };
      }
    }

    const update = await maintenanceModel.findOneAndUpdate(
      {
        maintenance_id: maintenance_id,
        organization_id: organization_id,
      },
      {
        maintenance_name: maintenanceData.maintenance_name, // Update the maintenance name
        maintenance_description: maintenanceData.maintenance_description, // Update the maintenance description
        maintenance_status: maintenanceData.maintenance_status, // Update the maintenance status
        service_impacted: maintenanceData.services_impacted, // Update the services impacted
        start_from: maintenanceData.start_from, // Update the start time
        end_at: maintenanceData.end_at, // Update the end time
      }
    );
    if (!update) {
      return {
        success: false,
        message: "Update failed.", // Return error if update fails
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
    await dbConnect(); // Connect to the database
    const user = await auth(); // Authenticate the user
    if (!user) {
      return {
        success: false,
        message: "User not authenticated.", // Return error if user is not authenticated
      };
    }

    const deleteMaintenance = await maintenanceModel.findOneAndDelete({
      maintenance_id: maintenance_id,
      organization_id: organization_id,
    });
    if (!deleteMaintenance) {
      return {
        success: false,
        message: "Failed to delete the Maintenance.", // Return error if delete fails
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
