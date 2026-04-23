import { registerUser } from "../controllers/auth.controllers.js";
import { Router } from "express";

const router = Router();

router.route("/register").post(registerUser);

export default router;
