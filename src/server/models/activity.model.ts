import { Schema, models, model } from "mongoose";

const activityModel = new Schema({
  activity_id: {
    type: String,
    required: true,
    unique: true,
  },
  organization_id: {
    type: String,
    required: true,
  },
  action: {
    type: String,
    required: true,
  },
  activity_description: {
    type: String,
    required: true,
  },
  actor_id: {
    type: String,
    required: true,
  },
  actor_type: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

export default models.activity || model("activity", activityModel);
