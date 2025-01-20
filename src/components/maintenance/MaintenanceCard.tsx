"use client";

import {
  MaintenanceStatusEnum,
  MaintenanceType,
} from "@/types/maintenance.types";
import { Card } from "../ui/card";
import Link from "next/link";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import {
  calculateTimeDifference,
  formatTimeDifference,
} from "@/helper/time.helpers";
import { Clock10Icon } from "lucide-react";
import DeleteMaintenanceModal from "./DeleteMaintenance";

function MaintenanceBadge({ status }: { status: string }) {
  const badgeClass =
    status === MaintenanceStatusEnum.Completed
      ? "bg-green-500 hover:bg-green-500 text-white"
      : "bg-yellow-500 hover:bg-yellow-500 text-black";

  return <Badge className={badgeClass}>{status}</Badge>;
}

export default function MaintenanceCard({
  maintenance,
}: {
  maintenance: MaintenanceType;
}) {
  const now = new Date();
  const startDate = new Date(maintenance.start_from);
  const endDate = new Date(maintenance.end_at);

  const { diffDays: startDiffDays, diffHours: startDiffHours } =
    calculateTimeDifference(now, startDate);
  const { diffDays: durationDiffDays, diffHours: durationDiffHours } =
    calculateTimeDifference(startDate, endDate);

  return (
    <Card className="relative flex flex-col md:flex-row items-start md:items-center gap-3 justify-between p-4 ">
      <div className="absolute -top-4 -right-0">
        <MaintenanceBadge status={maintenance.maintenance_status} />
      </div>
      <div className="flex flex-col gap-2 w-full pb-2">
        <h2 className="text-lg font-bold">{maintenance?.maintenance_name}</h2>
        <p className="text-sm text-zinc-400">
          {maintenance?.maintenance_description}
        </p>
        <div className="flex flex-col md:flex-row gap-1">
          <Badge
            className="text-xs font-medium flex items-center gap-1 p-2"
            variant="secondary"
          >
            <Clock10Icon className="h-3 w-3" />
            <span>
              <strong> Starts in: </strong>
              {formatTimeDifference(startDiffDays, startDiffHours)}
            </span>
          </Badge>
          <Badge
            className="text-xs font-medium flex items-center gap-1 p-2"
            variant="secondary"
          >
            <Clock10Icon className="h-3 w-3" />
            <span>
              <strong>Duration: </strong>
              {formatTimeDifference(durationDiffDays, durationDiffHours)}
            </span>
          </Badge>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <Link
          href={`/dashboard/maintenance/update/${maintenance?.maintenance_id}`}
        >
          <Button
            className="w-full md:w-auto cursor-pointer border-zinc-700"
            variant="secondary"
          >
            Edit
          </Button>
        </Link>
        <DeleteMaintenanceModal
          maintenance_id={maintenance.maintenance_id}
        ></DeleteMaintenanceModal>
        {/* <DeleteIncidentModal
          incident_id={incident.incident_id}
        ></DeleteIncidentModal> */}
      </div>
    </Card>
  );
}
