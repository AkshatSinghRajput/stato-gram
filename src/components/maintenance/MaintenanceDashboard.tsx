// have to dashboard for the incident. Shows all and active incidents.

"use client";

import { Card } from "../ui/card";
import { PlusCircleIcon } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { useState } from "react";
import { Input } from "../ui/input";
import {
  MaintenanceStatusEnum,
  MaintenanceType,
} from "@/types/maintenance.types";
import MaintenanceCard from "./MaintenanceCard";

function MaintenanceCardGroup({
  maintenances,
}: {
  maintenances: MaintenanceType[];
}) {
  return (
    <Card className="flex flex-col gap-6 mt-6 sm:mt-8 p-3 sm:p-4 ">
      {maintenances.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-2 h-32 w-full">
          <p className="text-lg text-neutral-500">
            No maintenance found with the filter
          </p>
        </div>
      )}
      {maintenances.map((maintenance) => (
        <MaintenanceCard
          key={maintenance.maintenance_id}
          maintenance={maintenance}
        />
      ))}
    </Card>
  );
}

export default function MaintenanceDashboard({
  maintenances,
}: {
  maintenances: MaintenanceType[];
}) {
  const [search, setSearch] = useState("");

  return (
    <div className="h-screen flex flex-col px-4 sm:px-10 mt-4 w-full pb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-0">
        <h1 className="text-xl sm:text-2xl font-bold">Maintenances</h1>
        <Link href="/dashboard/maintenance/new">
          <Button className="flex items-center justify-center gap-2 w-full sm:w-auto cursor-pointer bg-white text-neutral-950 font-strong">
            <PlusCircleIcon className="h-4 w-4" />
            Schedule Maintenance
          </Button>
        </Link>
      </div>
      <Tabs defaultValue="open" className="w-full mt-6 sm:mt-8">
        <div className="sm:flex sm:items-center sm:justify-between flex flex-col gap-4 sm:flex-row">
          <TabsList>
            <TabsTrigger value="open">Scheduled </TabsTrigger>
            <TabsTrigger value="all">All </TabsTrigger>
            <TabsTrigger value="completed">Completed </TabsTrigger>
          </TabsList>

          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search Maintenance"
            className="w-full sm:w-1/3"
          />
        </div>
        <TabsContent value="open">
          <MaintenanceCardGroup
            maintenances={maintenances.filter(
              (maintenance) =>
                maintenance.maintenance_status !==
                  MaintenanceStatusEnum.Completed &&
                maintenance.maintenance_name
                  .toLowerCase()
                  .includes(search.toLowerCase())
            )}
          />
        </TabsContent>
        <TabsContent value="all">
          <MaintenanceCardGroup
            maintenances={maintenances.filter((maintenance) =>
              maintenance.maintenance_name
                .toLowerCase()
                .includes(search.toLowerCase())
            )}
          />
        </TabsContent>
        <TabsContent value="completed">
          <MaintenanceCardGroup
            maintenances={maintenances.filter(
              (maintenance) =>
                maintenance.maintenance_status ===
                  MaintenanceStatusEnum.Completed &&
                maintenance.maintenance_name
                  .toLowerCase()
                  .includes(search.toLowerCase())
            )}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
