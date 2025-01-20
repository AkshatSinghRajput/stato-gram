export type maintenanceStatus =
  | "Scheduled"
  | "In Progress"
  | "Verifying"
  | "Completed";

export enum MaintenanceStatusEnum {
  Scheduled = "Scheduled",
  InProgress = "In Progress",
  Verifying = "Verifying",
  Completed = "Completed",
}

export type createMaintenanceType = {
  maintenance_name: string;
  maintenance_description: string;
  maintenance_status: maintenanceStatus;
  services_impacted: string[];
  start_from: string;
  end_at: string;
};

export type MaintenanceType = {
  maintenance_id: string;
  organization_id: string;
  maintenance_name: string;
  maintenance_description: string;
  maintenance_status: maintenanceStatus;
  service_impacted: string[];
  start_from: string;
  end_at: string;
};
