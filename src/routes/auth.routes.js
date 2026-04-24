import { registerUser } from "../controllers/auth.controllers.js";
import { Router } from "express";
import { validate } from "../middlewares/validate.middleware.js";
import { userRegistrationValidator } from "../validators/index.js";

const router = Router();

router
  .route("/register")
  .post(userRegistrationValidator(), validate, registerUser);

export default router;
