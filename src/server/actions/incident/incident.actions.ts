"use server";

import incidentModel from "@/server/models/incident.model";
import dbConnect from "@/server/utils/database";
import { createIncidentType, IncidentType } from "@/types/incident.types";
import { auth } from "@clerk/nextjs/server";
import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { createActivity } from "../activity/activity.actions";

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
    await dbConnect();
    const user = await auth();
    if (!user) {
      return { success: false, message: "User not authenticated" };
    }
    const newIncident = await incidentModel.create({
      incident_id: randomUUID({ disableEntropyCache: true }),
      organization_id: user?.orgId,
      incident_name: incidentData.title,
      incident_description: incidentData.description,
      incident_status: incidentData.status,
      service_impacted: incidentData.service_impacted,
    });

    if (!newIncident) {
      return { success: false, message: "Error creating incident" };
    }

    // Create Activity for the incident\
    const activity = await createActivity({
      activity: {
        action: incidentData.status,
        actor_id: newIncident.incident_id,
        actor_type: "incident",
        organization_id: user?.orgId,
        activity_description: `Incident created with status ${incidentData.status}`,
      },
    });
    if (!activity.success) {
      return { success: false, message: "Error creating activity" };
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
    await dbConnect();
    const incidents = await incidentModel.find(
      { organization_id },
      { _id: 0, __v: 0 }
    );
    if (!incidents) {
      return { success: false, message: "No incidents found" };
    }

    const incidentJson = JSON.parse(JSON.stringify(incidents));

    return {
      success: true,
      incidents: incidentJson,
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
    await dbConnect();
    const incident = await incidentModel.findOne(
      { incident_id, organization_id },
      { _id: 0, __v: 0 }
    );
    if (!incident) {
      return { success: false, message: "Incident not found" };
    }

    const incidentJson = JSON.parse(JSON.stringify(incident));

    return {
      success: true,
      incident: incidentJson,
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
    await dbConnect();
    const user = await auth();
    if (!user) {
      return { success: false, message: "User not authenticated" };
    }

    // Create Activity if status is changed
    const currentIncident: IncidentType | null = await incidentModel.findOne({
      incident_id,
      organization_id,
    });

    if (!currentIncident) {
      return { success: false, message: "Incident not found" };
    }

    if (currentIncident.incident_status !== incidentData.status) {
      const activity = await createActivity({
        activity: {
          action: incidentData.status,
          actor_id: currentIncident.incident_id,
          actor_type: "incident",
          organization_id: organization_id,
          activity_description: `Incident status changed to ${incidentData.status}`,
        },
      });
      if (!activity.success) {
        return { success: false, message: "Error creating activity" };
      }
    }

    const updatedIncident = await incidentModel.findOneAndUpdate(
      { incident_id, organization_id },
      {
        incident_name: incidentData.title,
        incident_description: incidentData.description,
        incident_status: incidentData.status,
        service_impacted: incidentData.service_impacted,
      }
    );
    if (!updatedIncident) {
      return { success: false, message: "Incident not found" };
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
    await dbConnect();
    const deletedIncident = await incidentModel.findOneAndDelete({
      incident_id,
      organization_id,
    });
    if (!deletedIncident) {
      return { success: false, message: "Incident not found" };
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
