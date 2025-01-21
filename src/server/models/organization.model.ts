import { Schema, models, model } from "mongoose";

const organizationModel = new Schema({
  organization_id: {
    type: String,
    required: true,
    unique: true,
  },
  organization_name: {
    type: String,
    required: true,
    unique: true,
  },
  organization_slug: {
    type: String,
    required: true,
    unique: true,
  },
  created_at: {
    type: Date,
    default: new Date(),
  },
});

export default models.organization || model("organization", organizationModel);
