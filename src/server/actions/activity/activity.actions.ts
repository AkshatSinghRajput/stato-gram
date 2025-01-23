"use server"; // Marks this file as a Server Component in Next.js

import { ActivityType, createActivityType } from "@/types/activity.types";
import { auth } from "@clerk/nextjs/server";
import { randomUUID } from "crypto";

// Base URL for the activity API endpoints Ex: http://localhost:8000/api/v1
const base_url = process.env.BACKEND_URL + "/activity";

// Function to create a new activity
export async function createActivity({
  activity,
}: {
  activity: createActivityType;
}): Promise<{
  success: boolean;
  message: string;
}> {
  try {
    // Get authenticated user information
    const user = await auth();
    if (!user) {
      return {
        success: false,
        message: "User not found",
      };
    }

    // Make POST request to create activity
    const response = await fetch(`${base_url}/create-activity`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        organizationId: user.orgId,
        sessionId: user.sessionId,
      },
      body: JSON.stringify({
        ...activity,
        activity_id: randomUUID({ disableEntropyCache: true }), // Generate unique ID for activity
      }),
    });
    const activityCreated = await response.json();

    // Check if activity creation was successful
    if (!activityCreated?.success) {
      return {
        success: false,
        message: "Activity not created",
      };
    }
    return {
      success: true,
      message: "Activity created successfully",
    };
  } catch (err) {
    console.error("Error in createActivity", err);
    return {
      success: false,
      message: err,
    };
  }
}

// Function to fetch activities by actor ID and organization ID
export async function getActivityByActorID({
  actor_id,
  organization_id,
}: {
  actor_id: string;
  organization_id: string;
}): Promise<{
  success: boolean;
  message: string;
  data: any;
}> {
  try {
    // Verify user authentication
    const user = await auth();
    if (!user) {
      return {
        success: false,
        message: "User not found",
        data: null,
      };
    }

    // Make GET request to fetch activities
    const response = await fetch(
      `${base_url}/get-activity/${organization_id}/${actor_id}`,
      {
        method: "GET",
      }
    );
    const activity = await response.json();

    // Check if activities were found
    if (!activity.success || !activity.data) {
      return {
        success: false,
        message: "Activity not found",
        data: null,
      };
    }

    return {
      success: true,
      message: "Activity found",
      data: activity.data as ActivityType[], // Cast the data to ActivityType array
    };
  } catch (err) {
    console.error("Error in getActivitybyActorID", err);
    return {
      success: false,
      message: err,
      data: null,
    };
  }
}
