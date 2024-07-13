import { Router } from "express";
import feedbackController from "../controllers/feedbackController";
import verifyJWT from "../middleware/verifyJWT";

const router = Router();

const feedbackRoutes = router;

router.use(verifyJWT);
router.route("/create-feedback").post(feedbackController.createNewFeedback);

export default feedbackRoutes;