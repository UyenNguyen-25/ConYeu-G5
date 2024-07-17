import { Router } from "express";
import productStatusController from "../controllers/productController";
import productController from "../controllers/productController";
import verifyJWT from "../middleware/verifyJWT";

const router = Router();

router.route("/get-all-product").get(productController.get_all_product);
router
  .route("/get-product-by-id/:product_id")
  .get(productController.get_product_by_id);

router.route("/get-product-status").get(productController.getProductStatus);


router.use(verifyJWT);

router.route("/create-product").post(productController.createNewProduct);
router
  .route("/auto-create-product-status")
  .post(productStatusController.autoCreateStatus);
router
  .route("/check-product-duplicate")
  .post(productController.duplicate_product_name);
router
  .route("/update-product/:product_id")
  .put(productController.update_product);
router
  .route("/delete-product/:product_id")
  .delete(productController.delete_product);

router
  .route("/get-sold-product")
  .get(productController.getSoldProductsByType)

const productRoutes = router;

export default productRoutes;
