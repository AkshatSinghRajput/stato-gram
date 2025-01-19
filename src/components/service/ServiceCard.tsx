"use client";

import { Badge } from "../ui/badge";
import { Button } from "../ui/button";

type ServiceType = {
  id: string;
  title: string;
  status: string;
  description: string;
};

function ServiceBadge({ status }: { status: string }) {
  return (
    <Badge
      className={`${
        status === "Operational"
          ? "bg-green-500 hover:bg-green-500"
          : status === "Major Outage"
          ? "bg-red-500 hover:bg-red-500"
          : "bg-yellow-500 hover:bg-yellow-500"
      } text-white `}
    >
      {status}
    </Badge>
  );
}

export default function ServiceCard(service: ServiceType) {
  return (
    <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between p-4 bg-neutral-900 border border-zinc-700 rounded-lg">
      <div className="absolute -top-4 -right-0">
        <ServiceBadge status={service.status} />
      </div>
      <div className="flex flex-col gap-2 w-full pb-2">
        <h2 className="text-lg font-bold">{service.title}</h2>
        <p className="text-sm text-zinc-400">{service.description}</p>
      </div>
      <div className="flex items-center gap-4">
        <Button
          asChild
          className="w-full md:w-auto bg-indigo-500 hover:bg-indigo-600 text-white border-0 cursor-pointer"
        >
          <span className="flex items-center gap-2">Edit</span>
        </Button>
        <Button
          asChild
          className="w-full md:w-auto bg-red-500 hover:bg-red-600 text-white border-0 cursor-pointer"
        >
          <span className="flex items-center gap-2">Delete</span>
        </Button>
      </div>
    </div>
  );
}
