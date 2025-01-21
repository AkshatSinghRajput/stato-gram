"use server";

import activityModel from "@/server/models/activity.model";
import dbConnect from "@/server/utils/database";
import { ActivityType, createActivityType } from "@/types/activity.types";
import { auth } from "@clerk/nextjs/server";
import { randomUUID } from "crypto";

export async function createActivity({
  activity,
}: {
  activity: createActivityType;
}): Promise<{
  success: boolean;
  message: string;
}> {
  try {
    await dbConnect();
    const user = await auth();
    if (!user) {
      return {
        success: false,
        message: "User not found",
      };
    }
    const activityCreated = await activityModel.create({
      activity_id: randomUUID({ disableEntropyCache: true }),
      ...activity,
    });
    if (!activityCreated) {
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
    await dbConnect();
    const user = await auth();
    if (!user) {
      return {
        success: false,
        message: "User not found",
        data: null,
      };
    }
    const activity = await activityModel
      .find(
        { actor_id, organization_id },
        {
          _id: 0,
          __v: 0,
        }
      )
      .lean()
      .exec();
    if (!activity) {
      return {
        success: false,
        message: "Activity not found",
        data: null,
      };
    }

    const activityJSON: ActivityType[] = JSON.parse(JSON.stringify(activity));

    return {
      success: true,
      message: "Activity found",
      data: activityJSON,
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
