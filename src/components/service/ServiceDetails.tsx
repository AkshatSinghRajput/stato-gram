"use client";

import Link from "next/link";
import { Button } from "../ui/button";
import { MoveLeft } from "lucide-react";
import { Card } from "../ui/card";
import { ActivityType } from "@/types/activity.types";
import { serviceType } from "@/types/service.types";
import ActivityGroup from "../activity/ActivityGroup";

export default function ServiceDetails({
  activityData,
  serviceData,
}: {
  activityData: ActivityType[];
  serviceData: serviceType;
}) {
  return (
    <div className="h-screen flex flex-col px-4 sm:px-10 mt-4 w-full pb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-0">
        <h1 className="text-xl sm:text-2xl font-bold">Service Activity</h1>

        <Link href="/dashboard/services">
          <Button className="flex items-center justify-center gap-2 w-full sm:w-auto cursor-pointer bg-white text-neutral-950 font-strong">
            <MoveLeft className="h-4 w-4" />
            Back to Services
          </Button>
        </Link>
      </div>

      <h2 className="text-lg sm:text-xl font-bold mt-6 sm:mt-8">
        {serviceData.service_name}
      </h2>
      <Card className="mt-6 sm:mt-8 p-3 sm:p-4 flex flex-col gap-6">
        <ActivityGroup
          activityData={activityData.sort(
            (a, b) =>
              new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
          )}
        />
      </Card>
    </div>
  );
}
