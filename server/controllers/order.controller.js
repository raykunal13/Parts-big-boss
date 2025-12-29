import { orderQueue } from "../utils/queue.js"; // Import the Queue
import redisClient from "../db/redisClient.js";
import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/appError.js";
import { pool } from "../db/db.js";

// 1. Checkout from Cart
export const checkoutCart = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { addressId } = req.body; // User must select an address now!

  if (!addressId) throw new AppError("Address is required", 400);

  // Validate Cart
  const cartJson = await redisClient.get(`cart:${userId}`);
  const items = cartJson ? JSON.parse(cartJson) : [];
  if (items.length === 0) throw new AppError("Cart is empty", 400);

  // 🚀 DISPATCH TO QUEUE
  await orderQueue.add("process-cart-order", {
    userId,
    items,
    addressId,
    isBuyNow: false
  });

  res.status(202).json({
    status: "success",
    message: "Order processing started. You will be notified shortly.",
  });
});

// 2. Buy Now
export const buyNow = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { productId, quantity, addressId } = req.body;
  const qty = Number(quantity) || 1;

  if (!addressId) throw new AppError("Address is required", 400);

  // Fetch Product (Fast Lookup)
  const productRes = await pool.query("SELECT id, price FROM products WHERE id = $1", [productId]);
  if (productRes.rows.length === 0) throw new AppError("Product not found", 404);
  const product = productRes.rows[0];

  const items = [{
    productId: product.id,
    quantity: qty,
    price: product.price
  }];

  // 🚀 DISPATCH TO QUEUE
  await orderQueue.add("process-buynow-order", {
    userId,
    items,
    addressId,
    isBuyNow: true
  });

  res.status(202).json({
    status: "success",
    message: "Order processing started.",
  });
});