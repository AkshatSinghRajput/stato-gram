export type IncidentStatus =
  | "Investigating"
  | "Identified"
  | "Monitoring"
  | "Resolved";

export enum IncidentStatusEnum {
  Investigating = "Investigating",
  Identified = "Identified",
  Monitoring = "Monitoring",
  Resolved = "Resolved",
}

export type createIncidentType = {
  title: string;
  description: string;
  status: IncidentStatus;
  service_impacted: string[];
};

export type IncidentType = {
  incident_id: string;
  service_impacted: string[];
  organization_id: string;
  incident_name: string;
  incident_description: string;
  incident_status: IncidentStatus;
  created_at: Date;
};
