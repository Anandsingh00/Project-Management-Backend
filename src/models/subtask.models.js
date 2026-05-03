import mongoose, { Schema } from "mongoose";

const subTaskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
    },
    task: {
      type: mongoose.Types.ObjectId,
      ref: "Task",
      required: true,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

export const subTask = mongoose.model("SubTask", subTaskSchema);
