"use client";

import { ActivityType } from "@/types/activity.types";

import Link from "next/link";
import { Button } from "../ui/button";
import { MoveLeft } from "lucide-react";
import { Card } from "../ui/card";
import { IncidentType } from "@/types/incident.types";
import ActivityGroup from "../activity/ActivityGroup";
import { Badge } from "../ui/badge";

export default function IncidentDetails({
  activityData,
  incidentData,
}: {
  activityData: ActivityType[];
  incidentData: IncidentType;
}) {
  return (
    <div className="h-screen flex flex-col px-4 sm:px-10 mt-4 w-full pb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-0">
        <h1 className="text-xl sm:text-2xl font-bold">Incident Activity</h1>

        <Link href="/dashboard/incidents">
          <Button className="flex items-center justify-center gap-2 w-full sm:w-auto cursor-pointer bg-white text-neutral-950 font-strong">
            <MoveLeft className="h-4 w-4" />
            Back to Incidents
          </Button>
        </Link>
      </div>

      <div className="flex flex-col gap-2">
        <h2 className="text-lg sm:text-xl font-bold mt-6 sm:mt-8">
          {incidentData?.incident_name}
        </h2>
        <div className="flex items-center gap-2">
          <p className="text-sm font-bold text-zinc-400">Services Impacted:</p>
          <div className="flex flex-wrap gap-2 items-center">
            {incidentData?.service_impacted.map((service, index) => (
              <Badge
                className="text-xs font-medium"
                key={index}
                variant="secondary"
              >
                {service}
              </Badge>
            ))}
          </div>
        </div>
      </div>
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
