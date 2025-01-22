"use client";

import { PublicPageDataTypes } from "@/types/publicPage.types";
import { serviceType } from "@/types/service.types";

export default function PublicStatusComponent({
  incident_data,
  services_data,
  organization,
}: {
  incident_data: PublicPageDataTypes[];
  services_data: serviceType[];
  organization: string;
}) {
  return (
    <div className="h-screen flex flex-col px-4 sm:px-10 mt-4 w-full pb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-0">
        <h1 className="text-xl sm:text-2xl font-bold">{organization}</h1>
      </div>
      <div className="flex flex-col gap-4 mt-6 sm:mt-8">
        {incident_data.map((incident) => (
          <div key={incident.incident_id} className="w-full">
            <div className="flex flex-col gap-2">
              <h2 className="text-lg font-bold">{incident.incident_name}</h2>
              <p className="text-neutral-500">
                {incident.incident_description}
              </p>
              <div className="flex flex-col gap-2">
                {incident.activities.map((activity) => (
                  <div
                    key={activity.activity_id}
                    className="flex flex-col gap-2"
                  >
                    <p className="text-neutral-500">{activity.action}</p>
                    <p className="text-neutral-500">
                      {activity.activity_description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
