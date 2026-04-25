import { registerUser } from "../controllers/auth.controllers.js";
import { Router } from "express";
import { validate } from "../middlewares/validate.middleware.js";
import { userRegistrationValidator } from "../validators/index.js";
import { loginUser } from "../controllers/auth.controllers.js";
const router = Router();

router
  .route("/register")
  .post(userRegistrationValidator(), validate, registerUser);

router.route("/login").post(loginUser);

export default router;
