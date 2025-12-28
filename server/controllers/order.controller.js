import { pool } from "../db/db.js";
import redisClient from "../db/redisClient.js";
import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/appError.js";
import { processOrderTransaction } from "../services/orderService.js";

// 1. Checkout from Cart
export const checkoutCart = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  
  // Get Items from Redis
  const cartJson = await redisClient.get(`cart:${userId}`);
  const items = cartJson ? JSON.parse(cartJson) : [];

  if (items.length === 0) throw new AppError("Cart is empty", 400);

  // Call Service (clearCart = true)
  const result = await processOrderTransaction(userId, items, true);

  res.status(201).json({
    message: "Cart checkout successful",
    orderId: result.orderId
  });
});

// 2. Buy Now (Single Item)
export const buyNow = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { productId, quantity } = req.body;
  const qty = Number(quantity) || 1;

  // Fetch latest price from DB (Security)
  const productRes = await pool.query("SELECT id, price FROM products WHERE id = $1", [productId]);
  if (productRes.rows.length === 0) throw new AppError("Product not found", 404);
  
  const product = productRes.rows[0];
  
  const items = [{
    productId: product.id,
    quantity: qty,
    price: product.price
  }];

  // Call Service (clearCart = false)
  const result = await processOrderTransaction(userId, items, false);

  res.status(201).json({
    message: "Direct order placed",
    orderId: result.orderId
  });
});