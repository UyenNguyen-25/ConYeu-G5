import { Router } from "express";
import onlineCheckoutController from "../controllers/onlineCheckoutController";

const router = Router();

const onlineCheckoutRoutes = router;


router.route("/payment").get(onlineCheckoutController.createPayment);
router.route("/paymentZalo").get(onlineCheckoutController.createPaymentZaloPay);
router.route("/callback").post(onlineCheckoutController.callback);

export default onlineCheckoutRoutes;