"use client";

import { useOrganization } from "@clerk/nextjs";
import { Button } from "../ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import Link from "next/link";
import { BadgeAlertIcon, CogIcon, ExternalLinkIcon } from "lucide-react";

export default function DashboardComponent() {
  const { organization } = useOrganization();
  return (
    <div className="flex flex-col items-center mt-4 h-[calc(100vh-4rem)] px-4">
      <Card className="w-full max-w-full border  text-white border-zinc-700">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-white">
            Welcome to your {organization?.name} dashboard
          </CardTitle>
          <CardDescription className="text-zinc-400">
            Access the issues and services of your organization and see the
            public page. You can manage your organization's incidents and
            services from here and see the public page of your organization.
          </CardDescription>
        </CardHeader>

        <CardFooter className="flex flex-col sm:flex-row gap-4">
          <Button
            asChild
            className="w-full flex items-center sm:w-auto bg-indigo-900 hover:bg-indigo-600 text-white border-0"
          >
            <Link href="/dashboard/incidents" className="items-center flex">
              <BadgeAlertIcon className="w-6 h-6 " />
              Incidents
            </Link>
          </Button>
          <Button
            asChild
            className="w-full sm:w-auto bg-purple-900 hover:bg-purple-600 text-white border-0"
          >
            <Link href="/dashboard/services" className="items-center flex">
              <CogIcon className="w-6 h-6 " />
              Services
            </Link>
          </Button>
          <Button
            asChild
            className="w-full sm:w-auto bg-indigo-500 hover:bg-indigo-600 text-white border-0"
          >
            <Link
              href={`/status/${organization?.slug}`}
              target="blank"
              className="items-center flex"
            >
              <ExternalLinkIcon className="w-6 h-6 " />
              Public Page
            </Link>
          </Button>
        </CardFooter>
      </Card>
      {/* <RecentIncidents></RecentIncidents> */}
    </div>
  );
}
