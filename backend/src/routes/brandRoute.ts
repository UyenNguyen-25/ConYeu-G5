import { Router } from "express";
import brandController from "../controllers/brandController";
import verifyJWT from "../middleware/verifyJWT";

const router = Router();

router.route("/get-all-brand").get(brandController.getAllBrand);

router.use(verifyJWT);

router.route("/create-brand").post(brandController.createBrand);

const brandRoutes = router;

export default brandRoutes;
