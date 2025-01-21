import { Schema, models, model, InferSchemaType } from "mongoose";

const incidentModel = new Schema({
  incident_id: {
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
  incident_name: {
    type: String,
    required: true,
  },
  incident_description: {
    type: String,
    required: true,
  },
  incident_status: {
    type: String,
    default: "Operational",
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

export default models.incident || model("incident", incidentModel);
