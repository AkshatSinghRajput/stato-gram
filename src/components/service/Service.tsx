"use client";

import { Button } from "../ui/button";
import { PlusCircleIcon } from "lucide-react";
import ServiceCard from "./ServiceCard";

const services = [
  {
    id: "1",
    title: "Service 1",
    status: "Operational",
    description: "Service 1 description",
  },
  {
    id: "2",
    title: "Service 2",
    status: "Major Outage",
    description: "Service 2 description",
  },
  {
    id: "3",
    title: "Service 3",
    status: "Degraded Performance",
    description: "Service 3 description",
  },
];

export default function ServicesComponent() {
  return (
    <div className="h-screen flex flex-col px-4 sm:px-10 mt-4 w-full pb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-0">
        <h1 className="text-xl sm:text-2xl font-bold">Services</h1>
        <Button
          asChild={true}
          className="w-full sm:w-auto bg-indigo-500 hover:bg-indigo-600 text-white border-0 cursor-pointer"
        >
          <div className="flex items-center justify-center gap-2">
            <PlusCircleIcon className="h-4 w-4" />
            <span className="text-white">Add Service</span>
          </div>
        </Button>
      </div>
      <div className="flex flex-col gap-6 mt-6 sm:mt-8 p-3 sm:p-4 bg-zinc-900/50 border border-zinc-800 rounded-lg">
        {services.map((service) => (
          <ServiceCard key={service.id} {...service} />
        ))}
      </div>
    </div>
  );
}
