export const defaultMessagesByEntity = {
  incident: {
    Identified: "We have identified an incident and are working to resolve it.",
    Investigating: "Our team is currently investigating the incident.",
    Resolved: "The incident has been resolved. Thank you for your patience.",
    Monitoring: "We are monitoring the situation to ensure stability.",
  },
  maintenance: {
    Scheduled: "Maintenance has been scheduled. We will keep you updated.",
    InProgress:
      "Maintenance is currently in progress. Services may be temporarily affected.",
    Verifying:
      "We are verifying the maintenance work to ensure everything is functioning correctly.",
    Completed:
      "Maintenance has been completed successfully. Thank you for your understanding.",
  },
  service: {
    Operational: "All services are operational.",
    Degraded:
      "Service is currently degraded. We are working to restore full functionality.",
    PartialOutage:
      "We are experiencing a partial service outage. Our team is on it.",
    MajorOutage:
      "We are experiencing a major service outage. We are working to resolve it as quickly as possible.",
  },
};
