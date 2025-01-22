import { ActivityType } from "./activity.types";

export type PublicPageDataTypes = {
  incident_id: string;
  organization_id: string;
  incident_name: string;
  incident_description: string;
  incident_type: string;
  activities: ActivityType[];
  created_at: Date;
};
