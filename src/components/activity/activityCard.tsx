"use client";

import { ActivityType } from "@/types/activity.types";
import { Card } from "../ui/card";
import { formatTimestampInDateAndTime } from "@/helper/time.helpers";
import { Clock10Icon } from "lucide-react";
import { Badge } from "../ui/badge";

export default function ActivityCard({
  activityData,
}: {
  activityData: ActivityType;
}) {
  return (
    <Card className="relative flex flex-col md:flex-row items-start md:items-center gap-3 justify-between p-4 ">
      <div className="flex flex-col gap-3 w-full pb-2 items-start">
        <Badge className="text-md font-bold" variant="outline">
          {activityData?.action}
        </Badge>
        <p className="text-sm text-zinc-400">
          {activityData?.activity_description}
        </p>
        <div className="flex flex-col md:flex-row gap-1">
          <Badge
            className="text-xs font-medium flex items-center gap-1 p-1"
            variant="secondary"
          >
            <Clock10Icon className="h-3 w-3" />

            {formatTimestampInDateAndTime(activityData.timestamp) + " UTC"}
          </Badge>
        </div>
      </div>
    </Card>
  );
}
