// have to dashboard for the incident. Shows all and active incidents.

"use client";

import { IncidentStatusEnum, IncidentType } from "@/types/incident.types";
import IncidentCard from "./IncidentCards";
import { Card } from "../ui/card";
import { PlusCircleIcon } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { useState } from "react";
import { Input } from "../ui/input";

function IncidentCardGroup({ incidents }: { incidents: IncidentType[] }) {
  return (
    <Card className="flex flex-col gap-6 mt-6 sm:mt-8 p-3 sm:p-4 ">
      {incidents.map((incident) => (
        <IncidentCard key={incident.incident_id} incident={incident} />
      ))}
      {incidents.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-4">
          <p className="text-lg font-semibold text-neutral-700">
            No Incidents Found for this filter
          </p>
          <p className="text-sm text-neutral-500">
            There are no incidents to display
          </p>
        </div>
      )}
    </Card>
  );
}

export default function IncidentDashboard({
  incidents,
}: {
  incidents: IncidentType[];
}) {
  const [search, setSearch] = useState("");

  return (
    <div className="h-screen flex flex-col px-4 sm:px-10 mt-4 w-full pb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-0">
        <h1 className="text-xl sm:text-2xl font-bold">Incidents</h1>
        <Link href="/dashboard/incidents/new">
          <Button className="flex items-center justify-center gap-2 w-full sm:w-auto cursor-pointer bg-white text-neutral-950 font-strong">
            <PlusCircleIcon className="h-4 w-4" />
            Add Incident
          </Button>
        </Link>
      </div>
      <Tabs defaultValue="open" className="w-full mt-6 sm:mt-8">
        <div className="sm:flex sm:items-center sm:justify-between flex flex-col gap-4 sm:flex-row">
          <TabsList>
            <TabsTrigger value="open">Open Incidents</TabsTrigger>
            <TabsTrigger value="all">All Incidents</TabsTrigger>
            <TabsTrigger value="resolved">Resolved Incidents</TabsTrigger>
          </TabsList>

          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search Incidents"
            className="w-full sm:w-1/3"
          />
        </div>
        <TabsContent value="open">
          <IncidentCardGroup
            incidents={incidents.filter(
              (incident) =>
                incident.incident_status !== IncidentStatusEnum.Resolved &&
                incident.incident_name
                  .toLowerCase()
                  .includes(search.toLowerCase())
            )}
          />
        </TabsContent>
        <TabsContent value="all">
          <IncidentCardGroup
            incidents={incidents.filter((incident) =>
              incident.incident_name
                .toLowerCase()
                .includes(search.toLowerCase())
            )}
          />
        </TabsContent>
        <TabsContent value="resolved">
          <IncidentCardGroup
            incidents={incidents.filter(
              (incident) =>
                incident.incident_status === IncidentStatusEnum.Resolved &&
                incident.incident_name
                  .toLowerCase()
                  .includes(search.toLowerCase())
            )}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
