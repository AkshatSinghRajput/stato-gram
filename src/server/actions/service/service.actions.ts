"use server"; // Marks this file as a server-side module

import {
  createServiceType,
  serviceType,
  updateServiceType,
} from "@/types/service.types";
import { auth } from "@clerk/nextjs/server";
import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { createActivity } from "../activity/activity.actions";

// Define the base URL for the backend API Ex: http://localhost:8000/api/v1
const baseURL = process.env.BACKEND_URL;

// Function to create a new service in the database
export async function createServiceAction(
  serviceData: createServiceType
): Promise<{ success: boolean; message: string }> {
  try {
    // Verify user authentication
    const user = await auth();
    if (!user) {
      return { success: false, message: "User not authenticated" };
    }

    const response = await fetch(`${baseURL}/service/create-service`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        organizationId: user.orgId,
        sessionId: user.sessionId,
      },
      body: JSON.stringify({
        service_id: randomUUID({ disableEntropyCache: true }),
        organization_id: user.orgId,
        service_name: serviceData.name,
        service_description: serviceData.description,
        start_date: Date.now(),
      }),
    });

    const service = await response.json();

    if (!service?.success) {
      return { success: false, message: "Error creating service" };
    }

    revalidatePath("/dashboard/services"); // Refresh the services page cache
    return { success: true, message: "Service created successfully" };
  } catch (err) {
    console.error("Error creating service: ", err);
    return { success: false, message: "Error creating service" };
  }
}

// Function to retrieve all services for a specific organization
export async function getServicesForOrganization(
  organization_id: string
): Promise<{
  success: boolean;
  message: string;
  services?: any;
}> {
  try {
    const response = await fetch(
      `${baseURL}/service/get-all-services/${organization_id}`,
      {
        method: "GET",
        cache: "no-cache",
      }
    );

    const services = await response.json();

    if (!services?.success || !services?.data) {
      return { success: false, message: "Error getting services" };
    }

    return {
      success: true,
      message: "Services retrieved successfully",
      services: JSON.parse(JSON.stringify(services.data)),
    };
  } catch (err) {
    console.error("Error getting services: ", err);
    return { success: false, message: "Error getting services" };
  }
}

// Function to retrieve a specific service by ID and organization
export async function getServiceById({
  service_id,
  organization_id,
}: {
  service_id: string;
  organization_id: string;
}): Promise<{ success: boolean; message: string; service?: serviceType }> {
  try {
    const response = await fetch(
      `${baseURL}/service/get-service/${organization_id}/${service_id}`,
      {
        method: "GET",
      }
    );

    const service = await response.json();

    if (!service?.success || !service?.data) {
      return { success: false, message: "Error getting service" };
    }

    return {
      success: true,
      message: "Service retrieved successfully",
      service: service.data as serviceType,
    };
  } catch (err) {
    console.error("Error getting service: ", err);
    return { success: false, message: "Error getting service" };
  }
}

// Function to update service details in the database
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
    // Verify user authentication
    const user = await auth();
    if (!user) {
      return { success: false, message: "User not authenticated" };
    }

    const response = await fetch(`${baseURL}/service/update-service`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        organizationId: user.orgId,
        sessionId: user.sessionId,
      },
      body: JSON.stringify({
        service_id: service_id,
        organization_id: organization_id,
        service_name: serviceData.name,
        service_description: serviceData.description,
        service_status: serviceData.status,
      }),
    });

    const service = await response.json();

    if (!service?.success) {
      console.error("Error updating service: ");
      return { success: false, message: "Error updating service" };
    }

    revalidatePath("/dashboard/services"); // Refresh the services page cache
    return { success: true, message: "Service updated successfully" };
  } catch (err) {
    console.error("Error updating service: ", err);
    return { success: false, message: "Error updating service" };
  }
}

// Function to delete a service
export async function deleteServiceAction(
  service_id: string
): Promise<{ success: boolean; message: string }> {
  try {
    // Verify user authentication
    const user = await auth();
    if (!user) {
      return { success: false, message: "User not authenticated" };
    }

    const response = await fetch(
      `${baseURL}/service/delete-service/${service_id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          organizationId: user.orgId,
          sessionId: user.sessionId,
        },
      }
    );

    const service = await response.json();

    if (!service.success) {
      return { success: false, message: "Error deleting service" };
    }
    revalidatePath("/dashboard/services"); // Refresh the services page cache
    return { success: true, message: "Service deleted successfully" };
  } catch (err) {
    console.error("Error deleting service: ", err);
    return { success: false, message: "Error deleting service" };
  }
}
