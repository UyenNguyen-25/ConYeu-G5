import { Router } from "express";
import orderController from "../controllers/orderController";
import verifyJWT from "../middleware/verifyJWT";

const router = Router();

const orderRoutes = router;

router.use(verifyJWT);
router.route("/auto-create-order-status").post(orderController.autoCreateStatus);
router.route("/create-new-order").post(orderController.createOrder);
router.route("/get-order-status").get(orderController.getOrderStatus);

export default orderRoutes;