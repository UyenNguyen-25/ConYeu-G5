import { Router } from "express";
import orderController from "../controllers/orderController";
import verifyJWT from "../middleware/verifyJWT";

const router = Router();

const orderRoutes = router;

router.use(verifyJWT);
router.route("/get-all-order").get(orderController.getOrderByUserPhone);
router
  .route("/auto-create-order-status")
  .post(orderController.autoCreateStatus);
router
  .route("/update-order-status/:orderId")
  .put(orderController.updateOrderStatus);
router.route("/create-new-order").post(orderController.createOrder);
router.route("/get-order-status").post(orderController.getOrderStatus);
router.route("/get-order-detail/:orderId").get(orderController.getOrderDetail);
router
  .route("/get-order-by-status-userId")
  .post(orderController.getOrderByStatusAndUserId);
router.route("/get-order-by-month").get(orderController.getOrderByMonth);

export default orderRoutes;
