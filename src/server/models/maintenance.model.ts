import { Schema, models, model } from "mongoose";

const maintenanceSchema = new Schema({
  maintenance_id: {
    type: String,
    required: true,
    unique: true,
  },
  service_impacted: {
    type: [String],
    required: true,
  },
  organization_id: {
    type: String,
    required: true,
  },
  maintenance_name: {
    type: String,
    required: true,
  },
  maintenance_description: {
    type: String,
    required: true,
  },
  maintenance_status: {
    type: String,
    default: "Scheduled",
  },
  start_from: {
    type: Date,
    required: true,
  },
  end_at: {
    type: Date,
    required: true,
  },
});

export default models.maintenance || model("maintenance", maintenanceSchema);
