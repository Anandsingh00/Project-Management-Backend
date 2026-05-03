import mongoose, { Schema } from "mongoose";
import { UserRolesEnum, AvailableUserRole } from "../utils/constants.js";

const projectMemberSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    project: {
      type: mongoose.Types.ObjectId,
      ref: "Project",
    },
    role: {
      type: String,
      enum: AvailableUserRole,
      default: UserRolesEnum.MEMBER,
    },
  },
  {
    timestamps: true,
  },
);

export const ProjectMember = mongoose.model(
  "ProjectMember",
  projectMemberSchema,
);
