"use client";

import * as React from "react";
import { ChevronsUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ActivityType } from "@/types/activity.types";
import ActivityCard from "../activity/activityCard";

export function CollapsibleActivity({
  activity_data,
}: {
  activity_data: ActivityType[];
}) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="w-full space-y-2"
    >
      {activity_data.length > 0 && activity_data.length < 2
        ? activity_data.map((activity, index) => (
            <ActivityCard key={index} activityData={activity} />
          ))
        : // If there are more than 2 activities, show the first 3 and collapse the rest
          activity_data
            .slice(0, 2)
            .map((activity, index) => (
              <ActivityCard key={index} activityData={activity} />
            ))}
      <CollapsibleContent className="space-y-2">
        {activity_data.length > 3 &&
          activity_data
            .slice(2)
            .map((activity, index) => (
              <ActivityCard key={index} activityData={activity} />
            ))}
      </CollapsibleContent>
      {activity_data.length > 2 && (
        <div className="flex items-center justify-between space-x-4 px-4">
          <CollapsibleTrigger asChild>
            <Button variant="secondary" className="flex items-center w-full">
              <ChevronsUpDown className="h-4 w-4" />
              <span>{isOpen ? "Show less" : "Show more"}</span>
            </Button>
          </CollapsibleTrigger>
        </div>
      )}
    </Collapsible>
  );
}
