import { Router } from "express";
import feedbackController from "../controllers/feedbackController";

const router = Router();

const feedbackRoutes = router;


router.route("/create-feedback").post(feedbackController.createNewFeedback);

export default feedbackRoutes;