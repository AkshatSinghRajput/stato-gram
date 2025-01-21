"use client";

import { ActivityType } from "@/types/activity.types";
import ActivityCard from "./activityCard";
import { formatTimestampInDate } from "@/helper/time.helpers";
import { Separator } from "../ui/separator";

export default function ActivityGroup({
  activityData,
}: {
  activityData: ActivityType[];
}) {
  const groupedActivities = activityData.reduce((groups, incident) => {
    const date = new Date(incident.timestamp).toDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(incident);
    return groups;
  }, {} as Record<string, typeof activityData>);
  return (
    <div className=" mt-4 w-full overflow-y-auto">
      {Object.entries(groupedActivities).map(([date, activities]) => (
        <div key={date} className="mt-4 flex flex-col gap-2  w-full">
          <h1 className="text-lg font-bold">{formatTimestampInDate(date)}</h1>
          <Separator className="my-4" />
          {activities.map((activity) => (
            <ActivityCard key={activity.activity_id} activityData={activity} />
          ))}
        </div>
      ))}
    </div>
  );
}
