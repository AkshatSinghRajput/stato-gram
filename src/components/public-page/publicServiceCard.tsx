"use client";

import { BadgeAlert, BadgeCheckIcon, BadgeXIcon } from "lucide-react";
import { Badge } from "../ui/badge";
import { Card } from "../ui/card";
import { serviceType } from "@/types/service.types";

function ServiceStatusBadge({ status }: { status: string }) {
  if (status === "Operational") {
    return (
      <Badge className="flex items-center px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-bold w-32">
        <BadgeCheckIcon className="mr-1 h-6 w-6" />
        Operational
      </Badge>
    );
  } else if (status === "Major Outage") {
    return (
      <Badge className="flex items-center px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-bold  w-32">
        <BadgeXIcon className="mr-1 h-6 w-6" />
        Major Outage
      </Badge>
    );
  } else {
    return (
      <Badge className="flex items-center px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-bold  w-32">
        <BadgeAlert className="mr-1 h-6 w-6" />
        {status}
      </Badge>
    );
  }
}

export default function PublicServiceCard(service: serviceType) {
  return (
    <Card className="relative flex flex-col md:flex-row items-start md:items-center justify-between p-4 ">
      <div className="flex flex-col gap-2 w-full pb-2">
        <h2 className="text-lg font-bold">{service.service_name}</h2>
        <p className="text-sm text-zinc-400">{service.service_description}</p>
      </div>
      <div className="flex items-center w-full md:w-auto">
        <ServiceStatusBadge status={service.service_status} />
      </div>
    </Card>
  );
}
