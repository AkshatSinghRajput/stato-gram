"use client";

import { PublicPageDataTypes } from "@/types/publicPage.types";
import { serviceType } from "@/types/service.types";
import { Card } from "../ui/card";
import PublicServiceCard from "./publicServiceCard";
import { Separator } from "../ui/separator";
import RecentIncidents from "./recentIncidents";
import { useEffect, useState } from "react";

export default function PublicStatusComponent({
  incident_data,
  services_data,
  organization_name,
  organization_id,
}: {
  incident_data: PublicPageDataTypes[];
  services_data: serviceType[];
  organization_name: string;
  organization_id: string;
}) {
  const groupedActivities = incident_data.reduce((groups, incident) => {
    const date = new Date(incident.created_at).toDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(incident);
    return groups;
  }, {} as Record<string, typeof incident_data>);

  const [updateSocket, setUpdateSocket] = useState<WebSocket | null>(null);

  function handleSocket() {
    if (!updateSocket || updateSocket.readyState === WebSocket.CLOSED) {
      const socket = new WebSocket(
        "wss://plivo-backend-production.up.railway.app/api/v1/public-page/update?organization_id=" +
          organization_id
      );
      socket.onopen = () => {
        console.log("socket connected");
        socket.send(JSON.stringify({ organization_id }));
      };
      socket.onmessage = (event) => {
        const data = event.data;
        if (data === "update" && typeof window !== "undefined") {
          window.location.reload();
        }
      };
      socket.onerror = () => {
        socket.close();
        setUpdateSocket(null);
      };
      setUpdateSocket(socket);
    }
  }

  useEffect(() => {
    handleSocket();
    const interval = setInterval(handleSocket, 5000);
    return () => {
      clearInterval(interval);
      if (updateSocket) {
        updateSocket.close();
        setUpdateSocket(null);
      }
    };
  }, [updateSocket, organization_id]);

  return (
    <div className="h-screen flex flex-col px-4 sm:px-10 mt-4 w-full pb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-0">
        <h1 className="text-xl sm:text-4xl font-bold capitalize">
          {organization_name} Status Page
        </h1>
      </div>

      <div className="flex flex-col gap-4">
        <Card className="flex flex-col gap-6 mt-6 sm:mt-8 p-3 sm:p-4 ">
          <div className="flex flex-row justify-between">
            <h1 className="text-2xl font-bold">Services</h1>
            {
              // if the status of all services is operational then show all services operational
              // else show few services impacted
              services_data.every(
                (service) => service.service_status === "Operational"
              ) ? (
                <p className="text-green-500">All services are operational</p>
              ) : (
                <p className="text-yellow-500">Few services are impacted</p>
              )
            }
          </div>
          {services_data.map((service) => (
            <PublicServiceCard key={service.service_id} {...service} />
          ))}
        </Card>
      </div>
      <div className="">
        <Card className="flex flex-col gap-6 mt-6 sm:mt-8 p-3 sm:p-4 ">
          <h1 className="text-2xl font-bold">Past Incidents</h1>
          {incident_data.length > 0 &&
            Object.entries(groupedActivities).map(([date, activities]) => (
              <div key={date} className="mt-4 flex flex-col gap-2  w-full">
                <h1 className="text-lg font-bold">{date}</h1>
                <Separator className="my-4" />
                {activities.map((activity) => (
                  <RecentIncidents
                    key={activity.incident_id}
                    incident_data={activity}
                  />
                ))}
              </div>
            ))}
        </Card>
      </div>
    </div>
  );
}
