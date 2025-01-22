"use server";

import { createIncidentType, IncidentType } from "@/types/incident.types";
import { auth } from "@clerk/nextjs/server";
import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";

const baseURL = `http://localhost:8000/api/v1/incident`;

// Create a new incident
export async function createIncident({
  incidentData,
}: {
  incidentData: createIncidentType;
}): Promise<{
  success: boolean;
  message: string;
}> {
  try {
    // await dbConnect();
    const user = await auth();
    if (!user) {
      return { success: false, message: "User not authenticated" };
    }

    const response = await fetch(`${baseURL}/create-incident`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        organizationId: user?.orgId,
        sessionId: user?.sessionId,
      },
      body: JSON.stringify({
        incident_id: randomUUID({ disableEntropyCache: true }),
        organization_id: user?.orgId,
        incident_name: incidentData.title,
        incident_description: incidentData.description,
        incident_status: incidentData.status,
        service_impacted: incidentData.service_impacted,
      }),
    });

    const responseJson = await response.json();

    if (!responseJson.success) {
      return { success: false, message: "Error creating incident" };
    }

    revalidatePath("/dashboard/incidents");
    return {
      success: true,
      message: "Incident created successfully",
    };
  } catch (error) {
    console.error("Error creating incident: ", error);
    return {
      success: false,
      message: "Error creating incident",
    };
  }
}

// Get all incidents for the organization
export async function getAllIncidents({
  organization_id,
}: {
  organization_id: string;
}): Promise<{
  success: boolean;
  message: string;
  incidents?: IncidentType[];
}> {
  try {
    const response = await fetch(
      `${baseURL}/get-all-incidents/${organization_id}`,
      {
        method: "GET",
      }
    );

    const responseJson = await response.json();

    if (!responseJson.success) {
      return { success: false, message: "Error getting incidents" };
    }

    return {
      success: true,
      incidents: responseJson.data as IncidentType[],
      message: "Successfully got all the incidents",
    };
  } catch (error) {
    console.error("Error getting incidents: ", error);
    return { success: false, message: "Error getting incidents" };
  }
}

// Get an incident by id and organization id
export async function getIncidentById({
  incident_id,
  organization_id,
}: {
  incident_id: string;
  organization_id: string;
}): Promise<{
  success: boolean;
  message: string;
  incident?: IncidentType;
}> {
  try {
    const response = await fetch(
      `${baseURL}/get-incident/${organization_id}/${incident_id}`,
      { method: "GET" }
    );

    const responseJson = await response.json();

    if (!responseJson.success) {
      return { success: false, message: "Error getting incident" };
    }

    return {
      success: true,
      incident: responseJson.data as IncidentType,
      message: "Successfully got the incident",
    };
  } catch (error) {
    console.error("Error getting incident: ", error);
    return { success: false, message: "Error getting incident" };
  }
}

// Update an incident by id and organization id
export async function updateIncident({
  incident_id,
  organization_id,
  incidentData,
}: {
  incident_id: string;
  organization_id: string;
  incidentData: createIncidentType;
}): Promise<{
  success: boolean;
  message: string;
}> {
  try {
    // await dbConnect();
    const user = await auth();
    if (!user) {
      return { success: false, message: "User not authenticated" };
    }

    const response = await fetch(`${baseURL}/update-incident`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        organizationId: user?.orgId,
        sessionId: user?.sessionId,
      },
      body: JSON.stringify({
        incident_id,
        organization_id,
        incident_name: incidentData.title,
        incident_description: incidentData.description,
        incident_status: incidentData.status,
        service_impacted: incidentData.service_impacted,
      }),
    });

    const responseJson = await response.json();

    if (!responseJson.success) {
      return { success: false, message: "Error updating incident" };
    }

    revalidatePath(`/dashboard/incidents`);
    return {
      success: true,
      message: "Incident updated successfully",
    };
  } catch (error) {
    console.error("Error updating incident: ", error);
    return { success: false, message: "Error updating incident" };
  }
}

// Delete an incident by id and organization id
export async function deleteIncident({
  incident_id,
  organization_id,
}: {
  incident_id: string;
  organization_id: string;
}): Promise<{
  success: boolean;
  message: string;
}> {
  try {
    const response = await fetch(`${baseURL}/delete-incident/${incident_id}`, {
      method: "DELETE",
      headers: {
        organizationId: organization_id,
      },
    });

    const responseJson = await response.json();

    if (!responseJson.success) {
      return { success: false, message: "Error deleting incident" };
    }

    revalidatePath(`/dashboard/incidents`);
    return {
      success: true,
      message: "Incident deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting incident: ", error);
    return { success: false, message: "Error deleting incident" };
  }
}
