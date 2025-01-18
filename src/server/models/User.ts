import { Schema, models, model, InferSchemaType } from "mongoose";

const userSchema = new Schema({
  user_id: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  organizations: {
    type: [String],
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  is_active: {
    type: Boolean,
    default: true,
  },
});

export type UserType = InferSchemaType<typeof userSchema>;
export default models.user || model("user", userSchema);
