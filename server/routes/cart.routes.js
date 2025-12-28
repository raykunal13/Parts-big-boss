import Router from "express";
import { verifyJWT } from "../middleware/verifyJWT.js";
import {
  getCart,
  addToCart,
  removeFromCart,
  updateCart,
} from "../controllers/cart.controller.js";

const router = Router();
router.use(verifyJWT);
router
  .route("/cart")
  .get(getCart)
  .post(addToCart)
  .put(updateCart)
  .delete(removeFromCart);

export default router;
