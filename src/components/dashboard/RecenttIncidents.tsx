"use client";

import { Clock10Icon } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import IncidentCard from "./IncidentCard";
import Link from "next/link";

const recentIncidents = [
  {
    id: 1,
    createdAt: "2021-10-01T12:00:00Z",
    title: "Network Outage",
    description: "The network is down in the main building.",
    status: "open",
  },

  {
    id: 2,
    createdAt: "2021-10-02T12:00:00Z",
    title: "Server Maintenance",
    description: "The server is under maintenance.",
    status: "closed",
  },
  {
    id: 3,
    createdAt: "2021-10-02T12:00:00Z",
    title: "Low latency in server",
    description: "The latency got destroyed.",
    status: "open",
  },
];

export default function RecentIncidents() {
  // Group incidents by date
  const groupedIncidents = recentIncidents.reduce((groups, incident) => {
    const date = new Date(incident.createdAt).toLocaleDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(incident);
    return groups;
  }, {} as Record<string, typeof recentIncidents>);

  return (
    <div className="flex flex-col items-center mt-4 h-[50dvh]] w-full overflow-y-auto">
      <Card className="w-full border bg-gradient-to-b from-zinc-900 to-black text-white border-zinc-700">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Recent Incidents
            </h1>
            <Link href="/dashboard/incidents">View all Incidents</Link>
          </CardTitle>
          <CardDescription className="text-zinc-400">
            View the recent incidents of your organization
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          {Object.entries(groupedIncidents).map(([date, incidents]) => (
            <div key={date} className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <Clock10Icon className="h-4 w-4 "></Clock10Icon>
                <h3 className="text-sm text-zinc-400">{date}</h3>
              </div>
              {incidents.map((incident) => (
                <IncidentCard {...incident} key={incident.id} />
              ))}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
