"use client";

import { serviceType } from "@/types/service.types";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card } from "../ui/card";

import Link from "next/link";
import DeleteServiceModal from "./DeleteService";

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

export default function ServiceCard(service: serviceType) {
  return (
    <Card className="relative flex flex-col md:flex-row items-start md:items-center justify-between p-4 ">
      <div className="absolute -top-4 -right-0">
        <ServiceBadge status={service.service_status} />
      </div>
      <div className="flex flex-col gap-2 w-full pb-2">
        <Link href={`/dashboard/services/details/${service?.service_id}`}>
          <h2 className="text-lg font-bold">{service.service_name}</h2>
        </Link>
        <p className="text-sm text-zinc-400">{service.service_description}</p>
      </div>
      <div className="flex items-center gap-4">
        <Link href={`/dashboard/services/edit/${service?.service_id}`}>
          <Button
            className="w-full md:w-auto cursor-pointer border-zinc-700"
            variant="secondary"
          >
            Edit
          </Button>
        </Link>

        <DeleteServiceModal
          service_id={service?.service_id}
        ></DeleteServiceModal>
      </div>
    </Card>
  );
}
