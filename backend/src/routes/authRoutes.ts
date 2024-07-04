import { Router } from "express";
import authController from "../controllers/authController";

const router = Router();

router.route("/").post(authController.login);

router.route("/refresh").get(authController.refresh);

router.route("/signup").post(authController.signup);

router.route("/forgot-password").put(authController.forgotPassword);

router.route("/logout").post(authController.logout);

const authRoutes = router;

export default authRoutes;
