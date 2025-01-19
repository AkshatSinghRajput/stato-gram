"use client";

import { Button } from "../ui/button";
import { PlusCircleIcon } from "lucide-react";
import ServiceCard from "./ServiceCard";
import Link from "next/link";
import { Card } from "../ui/card";
import { serviceType } from "@/types/service.types";

// const services = [
//   {
//     id: "1",
//     title: "Service 1",
//     status: "Operational",
//     description: "Service 1 description",
//   },
//   {
//     id: "2",
//     title: "Service 2",
//     status: "Major Outage",
//     description: "Service 2 description",
//   },
//   {
//     id: "3",
//     title: "Service 3",
//     status: "Degraded Performance",
//     description: "Service 3 description",
//   },
// ];

export default function ServicesComponent({
  services,
}: {
  services: serviceType[];
}) {
  return (
    <div className="h-screen flex flex-col px-4 sm:px-10 mt-4 w-full pb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-0">
        <h1 className="text-xl sm:text-2xl font-bold">Services</h1>
        <Link href="/dashboard/services/new">
          <Button className="flex items-center justify-center gap-2 w-full sm:w-auto cursor-pointer bg-white text-neutral-950 font-strong">
            <PlusCircleIcon className="h-4 w-4" />
            Add Service
          </Button>
        </Link>
      </div>
      <Card className="flex flex-col gap-6 mt-6 sm:mt-8 p-3 sm:p-4 ">
        {services.map((service) => (
          <ServiceCard key={service.service_id} {...service} />
        ))}
      </Card>
    </div>
  );
}
