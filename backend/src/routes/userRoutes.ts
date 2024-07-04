import { Router } from "express";
import userController from "../controllers/userController";
import verifyJWT from "../middleware/verifyJWT";

const router: Router = Router();

router.post("/", userController.createNewUser);
router.post("/check-phone-existed", userController.checkPhoneExisted);
router.put("/change-password", userController.changePassword);

router
  // .use(verifyJWT)
  .route("/")
  .get(userController.getAllUsers)
  .put(userController.updateUser)
  .delete(userController.deleteUser);

router
  .use(verifyJWT)
  .route("/confirm-user-address")
  .put(userController.confirmUserAddress);

const userRoutes = router;
export default userRoutes;
