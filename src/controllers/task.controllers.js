import { Project } from "../models/project.models";
import { Task } from "../models/task.models.js";
import { SubTask } from "../models/subtask.models.js";
import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-errors.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import mongoose from "mongoose";
import { AvailableTaskStatuses } from "../utils/constants.js";

const getTask = asyncHandler(async (req, res) => {
  const { projectId } = req.params;

  const project = await Project.findById(projectId);

  if (!project) {
    throw new ApiError(404, "Project Not Found");
  }

  const fetchedTask = await Task.find({
    project: new mongoose.Types.ObjectId(projectId),
  }).populate("assignedTo", "avatar username email");

  return res
    .status(200)
    .json(new ApiResponse(201, fetchedTask, "Task Fetched Successfully"));
});

const createTask = asyncHandler(async (req, res) => {
  const { title, description, assigneeId, status } = req.body;
  const { projectId } = req.params;

  const project = await Project.findById(projectId);
  if (!project) {
    throw new ApiError(404, "Project Not Found");
  }

  const files = req.files || [];
  const attachments = files.map((file) => {
    return {
      url: `${process.env.SERVER_URL}/images/${file.originalname}`,
      mimetype: file.mimetype,
      size: file.size,
    };
  });

  //create a task
  const task = await Task.create({
    title: title,
    description: description,
    project: projectId,
    assignedTo: assigneeId
      ? new mongoose.Types.ObjectId(assigneeId)
      : undefined,
    assignedBy: new mongoose.Types.ObjectId(req.user._id),
    attachments,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, task, "Task Created Successfully"));
});

const getTaskById = asyncHandler(async (req, res) => {
  const { taskId } = req.params;

  const task = await Task.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(taskId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "assignedTo",
        foreignField: "_id",
        as: "assignedTo",
        pipeline: [
          {
            $project: {
              _id: 1,
              username: 1,
              fullName: 1,
              avatar: 1,
            },
          },
        ],
      },
    },
    {
      $lookup: {
        from: "subtasks",
        localField: "_id",
        foreignField: "task",
        as: "subtasks",
        pipeline: [
          {
            $lookup: {
              from: "users",
              localField: "createdBy",
              foreignField: "_id",
              as: "createdBy",
              pipeline: [
                {
                  $project: {
                    _id: 1,
                    username: 1,
                    fullName: 1,
                    avatar: 1,
                  },
                },
              ],
            },
          },
          {
            $addFields: {
              createdBy: {
                $arrayElemAt: ["$createdBy", 0],
              },
            },
          },
        ],
      },
    },
    {
      $addFields: {
        assignedTo: {
          $arrayElemAt: ["$assignedTo", 0],
        },
      },
    },
  ]);

  if (!task || task.length === 0) {
    throw new ApiError(404, "Task not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(201, task[0], "task fetched successfully"));
});

const updateTask = asyncHandler(async (req, res) => {
  const { taskId } = req.params;
  const { title, description, status, assigneeId } = req.body;

  if (
    title === undefined &&
    description === undefined &&
    status === undefined &&
    assigneeId === undefined
  ) {
    throw new ApiError(400, "At least one field is required");
  }

  const task = await Task.findById(taskId);

  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  if (title !== undefined) task.title = title;
  if (description !== undefined) task.description = description;
  if (status !== undefined) task.status = status;

  //check if req.status is a valid status or not
  if (status !== undefined && !AvailableTaskStatuses.includes(status)) {
    throw new ApiError(400, "Status is invalid");
  }

  task.status = status;

  await task.save();

  return res
    .status(200)
    .json(new ApiResponse(200, task, "Task updated successfully"));
});

const deleteTask = asyncHandler(async (req, res) => {
  const { taskId } = req.params;
  const task = await Task.findByIdAndDelete(taskId);

  if (!task) {
    throw new ApiError(404, "Task Not Found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, task, "Task deleted successfully"));
});

const createSubTask = asyncHandler(async (req, res) => {
  const { taskId } = req.params;
  const { title, assigneeId } = req.body;

  const task = await Task.findById(taskId);
  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  const subTask = await SubTask.create({
    title,
    task: taskId,
    createdBy: req.user._id,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, subTask, "Sub-task created successfully"));
});
const deleteSubTask = asyncHandler(async (req, res) => {
  const { subTaskId } = req.params;

  const subtask = await SubTask.findByIdAndDelete(subTaskId);

  if (!subtask) {
    throw new ApiError(404, "Sub-task not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, subtask, "Subtask deleted successfully"));
});

const updateSubTask = asyncHandler(async (req, res) => {
  const { subTaskId } = req.params;
  const { title, isCompleted } = req.body;

  if (title === undefined && isCompleted === undefined) {
    throw new ApiError(400, "At least one field is required");
  }

  const subTask = await SubTask.findById(subTaskId);
  if (!subTask) {
    throw new ApiError(404, "Subtask not found");
  }

  // update fields
  subTask.title = title;
  subTask.isCompleted = isCompleted;

  await subTask.save();

  return res
    .status(200)
    .json(new ApiResponse(200, subTask, "Subtask updated successfully"));
});

export {
  getTask,
  createTask,
  getTaskById,
  updateTask,
  deleteTask,
  createSubTask,
  deleteSubTask,
  updateSubTask,
};
