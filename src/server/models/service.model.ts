import { Schema, models, model, InferSchemaType } from "mongoose";

const serviceSchema = new Schema({
  service_id: {
    type: String,
    required: true,
    unique: true,
  },
  organization_id: {
    type: String,
    required: true,
  },
  service_name: {
    type: String,
    required: true,
  },
  service_description: {
    type: String,
    required: true,
  },
  service_status: {
    type: String,
    default: "Operational",
  },
  start_date: {
    type: Date,
    default: Date.now,
  },
});

export default models.service || model("service", serviceSchema);
