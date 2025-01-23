"use client";

import { PublicPageDataTypes } from "@/types/publicPage.types";
import { Card } from "../ui/card";
import ActivityCard from "../activity/activityCard";
import { Badge } from "../ui/badge";
import { CollapsibleActivity } from "./CollapsibleActivity";

export default function RecentIncidents({
  incident_data,
}: {
  incident_data: PublicPageDataTypes;
}) {
  return (
    <Card className="flex flex-col gap-6 mt-6 sm:mt-8 p-3 sm:p-4">
      <div className="flex flex-col gap-3">
        <h1 className="text-xl sm:text-2xl font-bold">
          {incident_data.incident_name}
        </h1>
        {incident_data.service_impacted.length > 0 && (
          <div className="flex flex-col sm:flex-row gap-2">
            <p className="text-sm text-gray-500">Service impacted:</p>
            <div className="flex flex-wrap gap-2">
              {incident_data.service_impacted.map((service) => (
                <Badge key={service}>{service}</Badge>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-4">
        <CollapsibleActivity
          activity_data={incident_data.activities.sort(
            (a, b) =>
              new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
          )}
        />
      </div>
    </Card>
  );
}
