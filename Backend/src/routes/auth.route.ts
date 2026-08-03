import express from "express";
import {loginController, registerController, logoutController, getMe} from "../controllers/auth.controller.js"
import { authUser } from "../middlewares/auth.middleware.js";
const authRouter = express.Router();

authRouter.post("/register", registerController);
authRouter.post("/login", loginController);
authRouter.post("/logout", logoutController);
authRouter.get("/get-me", authUser, getMe);

export default authRouter;