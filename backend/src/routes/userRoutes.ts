import { Router } from "express";
import userController from "../controllers/userController";
import verifyJWT from "../middleware/verifyJWT";

const router: Router = Router();

router.post("/", userController.createNewUser);
router.post("/check-phone-existed", userController.checkPhoneExisted);
router.put("/change-password", userController.changePassword);

router.use(verifyJWT)

router
.route("/")
.get(userController.getAllUsers)
.put(userController.updateUser)
.delete(userController.deleteUser);

router.get("/get-user", userController.getUserDetail)

router
  .route("/confirm-user-address")
  .put(userController.confirmUserAddress);

router
  .route("/get-user-address")
  .post(userController.getUserAddressByUserId)

const userRoutes = router;
export default userRoutes;
