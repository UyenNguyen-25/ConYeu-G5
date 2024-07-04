import { Router } from "express";
import onlineCheckoutController from "../controllers/onlineCheckoutController";
import verifyJWT from "../middleware/verifyJWT";

const router = Router();

const onlineCheckoutRoutes = router;

// router.use(verifyJWT);

router.route("/payment").get(onlineCheckoutController.createPayment);
router.route("/paymentZalo").get(onlineCheckoutController.createPaymentZaloPay);
router.route("/callback").post(onlineCheckoutController.callback);

export default onlineCheckoutRoutes;