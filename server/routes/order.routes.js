import Router from "express";
import { verifyJWT } from "../middleware/verifyJWT.js";
import { checkoutCart, buyNow } from "../controllers/order.controller.js";

const router = Router();

// Protect all order routes
router.use(verifyJWT);

router.post("/checkout", checkoutCart);
router.post("/buy-now", buyNow);

export default router;
