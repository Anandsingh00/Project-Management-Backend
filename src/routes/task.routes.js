import { Router } from "express";

import {
  verifyJWT,
  validateProjectPermission,
} from "../middlewares/auth.middleware.js";

import { validate } from "../middlewares/validate.middleware.js";

import {
  getTask,
  createTask,
  getTaskById,
  updateTask,
  deleteTask,
  createSubTask,
  deleteSubTask,
  updateSubTask,
} from "../controllers/task.controllers.js";

import {
  createTaskValidator,
  updateTaskValidator,
  createSubTaskValidator,
  updateSubTaskValidator,
} from "../validators/index.js";

import { AvailableUserRole, UserRolesEnum } from "../utils/constants.js";

const router = Router();

router.use(verifyJWT);

// Create task & Get all tasks of a project
router
  .route("/:projectId")
  .get(validateProjectPermission(AvailableUserRole), getTask)
  .post(
    createTaskValidator(),
    validate,
    validateProjectPermission([
      UserRolesEnum.ADMIN,
      UserRolesEnum.PROJECT_ADMIN,
    ]),
    createTask,
  );

// Get task by id, Update task, Delete task
router
  .route("/:projectId/t/:taskId")
  .get(validateProjectPermission(AvailableUserRole), getTaskById)
  .put(
    updateTaskValidator(),
    validate,
    validateProjectPermission([
      UserRolesEnum.ADMIN,
      UserRolesEnum.PROJECT_ADMIN,
    ]),
    updateTask,
  )
  .delete(
    validateProjectPermission([
      UserRolesEnum.ADMIN,
      UserRolesEnum.PROJECT_ADMIN,
    ]),
    deleteTask,
  );

// Create subtask
router
  .route("/:projectId/t/:taskId/subtasks")
  .post(
    createSubTaskValidator(),
    validate,
    validateProjectPermission([
      UserRolesEnum.ADMIN,
      UserRolesEnum.PROJECT_ADMIN,
    ]),
    createSubTask,
  );

// Update & Delete subtask
router
  .route("/:projectId/st/:subTaskId")
  .put(
    updateSubTaskValidator(),
    validate,
    validateProjectPermission(AvailableUserRole),
    updateSubTask,
  )
  .delete(
    validateProjectPermission([
      UserRolesEnum.ADMIN,
      UserRolesEnum.PROJECT_ADMIN,
    ]),
    deleteSubTask,
  );

export default router;
