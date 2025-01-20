"use server";

import activityModel from "@/server/models/activity.model";
import dbConnect from "@/server/utils/database";
import { createActivityType } from "@/types/activity.types";
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
    return {
      success: false,
      message: err.message,
    };
  }
}
