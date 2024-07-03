import { Router, Request, Response } from "express";
import path from "path";
import userRoutes from "./userRoutes";
import authRoutes from "./authRoutes";
import productRoutes from "./productRoutes";
import brandRoutes from "./brandRoute";
import orderRoutes from "./orderRoutes";
import onlineCheckoutRoutes from "./onlineCheckoutRoutes";

const router: Router = Router();
router.get("^/$|/app(.html)?", (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "..", "views", "index.html"));
});

router.use("/auth", authRoutes);

router.use("/api/user", userRoutes);

router.use("/api/product", productRoutes);

router.use("/api/brand", brandRoutes);

router.use("/api/order", orderRoutes);

router.use("/api/momo", onlineCheckoutRoutes);

export default router;
