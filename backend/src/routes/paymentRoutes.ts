import { Router } from "express";
import verifyJWT from "../middleware/verifyJWT";
import paymentController from "../controllers/paymentController";

const router = Router();

const paymentRoutes = router;

router.use(verifyJWT);
router.route("/get-payment-by-order-id/:orderId").get(paymentController.getPaymentByOrderId);

export default paymentRoutes;