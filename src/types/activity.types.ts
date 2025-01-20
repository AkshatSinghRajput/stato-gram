export type createActivityType = {
  action: string;
  activity_description: string;
  actor_id: string;
  actor_type: string;
  organization_id: string;
};

export type ActivityType = {
  activity_id: string;
  organization_id: string;
  action: string;
  activity_description: string;
  actor_id: string;
  actor_type: string;
  timestamp: Date;
};
