export type createServiceType = {
  name: string;
  description: string;
};

export type updateServiceType = {
  name: string;
  description: string;
  status: string;
};

export type serviceType = {
  service_id: string;
  organization_id: string;
  service_name: string;
  service_description: string;
  service_status: string;
  start_date: Date;
};

export type serviceStatusType =
  | "Operational"
  | "Degraded Performance"
  | "Partial Outage"
  | "Major Outage"
  | "Under Maintenance";

export enum ServiceStatusEnum {
  Operational = "Operational",
  DegradedPerformance = "Degraded Performance",
  PartialOutage = "Partial Outage",
  MajorOutage = "Major Outage",
  UnderMaintenance = "Under Maintenance",
}
