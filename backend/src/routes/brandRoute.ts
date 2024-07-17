import { Router } from "express";
import brandController from "../controllers/brandController";
import verifyJWT from "../middleware/verifyJWT";

const router = Router();


router.use(verifyJWT);

router.route("/get-all-brand").get(brandController.getAllBrand);
router.route("/create-brand").post(brandController.createBrand);
router.route("/:brandId").put(brandController.updateBrand);
router.route("/:brandId").delete(brandController.deleteBrand);
router.route("/count-product-by-brand/:brandId").get(brandController.countProductsByBrand);

const brandRoutes = router;

export default brandRoutes;
