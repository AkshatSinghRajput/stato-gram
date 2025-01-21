"use client";

import {
  IncidentStatus,
  IncidentStatusEnum,
  IncidentType,
} from "@/types/incident.types";
import { Card } from "../ui/card";
import Link from "next/link";
import { Button } from "../ui/button";
import DeleteIncidentModal from "./DeleteIncident";
import { Badge } from "../ui/badge";
import { Clock10Icon } from "lucide-react";

function IncidentBadge({ status }: { status: IncidentStatus }) {
  return (
    <Badge
      className={`${
        status === IncidentStatusEnum.Resolved
          ? "bg-green-500 hover:bg-green-500 text-white"
          : "bg-yellow-500 hover:bg-yellow-500 text-black"
      }  `}
    >
      {status}
    </Badge>
  );
}

export default function IncidentCard({ incident }: { incident: IncidentType }) {
  return (
    <Card className="relative flex flex-col md:flex-row items-start md:items-center gap-3 justify-between p-4 ">
      <div className="absolute -top-4 -right-0">
        <IncidentBadge status={incident.incident_status} />
      </div>
      <div className="flex flex-col gap-2 w-full pb-2">
        <Link href={`/dashboard/incidents/details/${incident.incident_id}`}>
          <h2 className="text-lg font-bold">{incident?.incident_name}</h2>
        </Link>
        <p className="text-sm text-zinc-400">{incident.incident_description}</p>
        <div className="flex flex-col md:flex-row gap-1 items-start">
          <Badge
            className="text-xs font-medium flex items-center gap-1 p-2"
            variant="secondary"
          >
            <Clock10Icon className="h-3 w-3" />
            <span>
              <strong> Created at: </strong>
              {new Date(incident.created_at).toLocaleDateString("en-GB")}
            </span>
          </Badge>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Link href={`/dashboard/incidents/update/${incident?.incident_id}`}>
          <Button
            className="w-full md:w-auto cursor-pointer border-zinc-700"
            variant="secondary"
          >
            Edit
          </Button>
        </Link>
        <DeleteIncidentModal
          incident_id={incident.incident_id}
        ></DeleteIncidentModal>
      </div>
    </Card>
  );
}
