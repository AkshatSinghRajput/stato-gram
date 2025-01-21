"use server"; // Marks this file as a server-side module

import serviceModel from "@/server/models/service.model";
import dbConnect from "@/server/utils/database";
import {
  createServiceType,
  serviceType,
  updateServiceType,
} from "@/types/service.types";
import { auth } from "@clerk/nextjs/server";
import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { createActivity } from "../activity/activity.actions";

// Create a new service in the database
export async function createServiceAction(
  serviceData: createServiceType
): Promise<{ success: boolean; message: string }> {
  try {
    // Verify user authentication
    const user = await auth();
    if (!user) {
      return { success: false, message: "User not authenticated" };
    }

    // Connect to the database
    await dbConnect();

    // Create new service document with generated UUID
    const service = await serviceModel.create({
      service_id: randomUUID({ disableEntropyCache: true }),
      organization_id: user?.orgId,
      service_name: serviceData.name,
      service_description: serviceData.description,
    });

    if (!service) {
      return { success: false, message: "Error creating service" };
    }
    revalidatePath("/dashboard/services"); // Refresh the services page cache
    return { success: true, message: "Service created successfully" };
  } catch (err) {
    console.error("Error creating service: ", err);
    return { success: false, message: "Error creating service" };
  }
}

// Retrieve all services for a specific organization
export async function getServicesForOrganization(
  organization_id: string
): Promise<{
  success: boolean;
  message: string;
  services?: any;
}> {
  try {
    await dbConnect();
    // Query services excluding MongoDB specific fields (_id and __v)
    const services = await serviceModel
      .find(
        {
          organization_id: organization_id,
        },
        { _id: 0, __v: 0 }
      )
      .lean() // Convert to POJO (Plain Old JavaScript Object)
      .exec();
    if (!services) {
      return { success: false, message: "Error getting services" };
    }
    const servicesJson = JSON.parse(JSON.stringify(services)); // Ensure serializable data

    return {
      success: true,
      message: "Services retrieved successfully",
      services: servicesJson,
    };
  } catch (err) {
    console.error("Error getting services: ", err);
    return { success: false, message: "Error getting services" };
  }
}

// Retrieve a specific service by ID and organization
export async function getServiceById({
  service_id,
  organization_id,
}: {
  service_id: string;
  organization_id: string;
}): Promise<{ success: boolean; message: string; service?: serviceType }> {
  try {
    await dbConnect();
    // Find single service matching both service_id and organization_id
    const service = await serviceModel
      .findOne(
        {
          service_id: service_id,
          organization_id: organization_id,
        },
        { _id: 0, __v: 0 }
      )
      .lean()
      .exec();
    if (!service) {
      return { success: false, message: "Error getting service" };
    }
    const serviceJson: serviceType = JSON.parse(JSON.stringify(service)); // Ensure serializable data

    return {
      success: true,
      message: "Service retrieved successfully",
      service: serviceJson,
    };
  } catch (err) {
    console.error("Error getting service: ", err);
    return { success: false, message: "Error getting service" };
  }
}

// Update service details in the database
export async function updateServiceAction({
  service_id,
  organization_id,
  serviceData,
}: {
  service_id: string;
  organization_id: string;
  serviceData: updateServiceType;
}): Promise<{ success: boolean; message: string }> {
  try {
    await dbConnect();
    // Verify user authentication
    const user = await auth();
    if (!user) {
      return { success: false, message: "User not authenticated" };
    }

    // Update the activity feed for the organization if the service status has changed
    const existingService = await serviceModel
      .findOne({
        service_id: service_id,
        organization_id: organization_id,
      })
      .lean()
      .exec();

    if (!existingService) {
      return { success: false, message: "Service not found" };
    }

    const existingServiceJson: serviceType = JSON.parse(
      JSON.stringify(existingService)
    );

    if (
      existingService &&
      existingServiceJson.service_status !== serviceData.status
    ) {
      const activity = await createActivity({
        activity: {
          organization_id: organization_id,
          action: serviceData.status,
          activity_description: `Service status for ${existingServiceJson.service_name} was updated to ${serviceData.status}`,
          actor_type: "service",
          actor_id: service_id,
        },
      });
      if (!activity.success) {
        return { success: false, message: "Error updating activity feed" };
      }
    }

    // Update service document with new data
    const service = await serviceModel.findOneAndUpdate(
      {
        service_id: service_id,
        organization_id: organization_id,
      },
      {
        service_name: serviceData.name,
        service_description: serviceData.description,
        service_status: serviceData.status,
      }
    );
    if (!service) {
      return { success: false, message: "Error updating service" };
    }

    revalidatePath("/dashboard/services"); // Refresh the services page cache
    return { success: true, message: "Service updated successfully" };
  } catch (err) {
    console.error("Error updating service: ", err);
    return { success: false, message: "Error updating service" };
  }
}

// Update the status of multiple services at once
export async function updateServiceStatusAction({
  services,
}: {
  services: { service_id: string; status: string }[];
}): Promise<{ success: boolean; message: string }> {
  try {
    await dbConnect();
    // Verify user authentication
    const user = await auth();
    if (!user) {
      return { success: false, message: "User not authenticated" };
    }

    // Create bulk operations array
    const bulkOperations = services.map((service) => ({
      updateOne: {
        filter: {
          service_id: service.service_id,
          organization_id: user?.orgId,
        },
        update: {
          service_status: service.status,
        },
      },
    }));

    // Execute bulk update
    const result = await serviceModel.bulkWrite(bulkOperations);

    if (result.modifiedCount === 0) {
      return { success: false, message: "No services were updated" };
    }

    revalidatePath("/dashboard/services");
    return { success: true, message: "Services updated successfully" };
  } catch (err) {
    console.error("Error updating services: ", err);
    return { success: false, message: "Error updating services" };
  }
}

// Delete a service
export async function deleteServiceAction(
  service_id: string
): Promise<{ success: boolean; message: string }> {
  try {
    await dbConnect();
    // Verify user authentication
    const user = await auth();
    if (!user) {
      return { success: false, message: "User not authenticated" };
    }
    // Remove service document from database
    const service = await serviceModel.findOneAndDelete({
      service_id: service_id,
      organization_id: user?.orgId,
    });
    if (!service) {
      return { success: false, message: "Error deleting service" };
    }
    revalidatePath("/dashboard/services"); // Refresh the services page cache
    return { success: true, message: "Service deleted successfully" };
  } catch (err) {
    console.error("Error deleting service: ", err);
    return { success: false, message: "Error deleting service" };
  }
}
