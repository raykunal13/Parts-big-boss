import { pool } from "../db/db.js";
import redisClient from "../db/redisClient.js";
import AppError from "../utils/appError.js";

/**
 * Core Order Processing Logic
 * @param {number} userId - The ID of the user
 * @param {Array} items - Array of { productId, quantity, price }
 * @param {boolean} clearCart - Whether to clear the user's Redis cart after success
 */
export const processOrderTransaction = async (
  userId,
  items,
  clearCart = false
) => {
  const client = await pool.connect();

  try {
    // 1. STOCK RESERVATION (Redis)
    const reservedItems = [];

    for (const item of items) {
      const stockKey = `product:${item.productId}:stock`;

      // Check if stock key exists in Redis
      const exists = await redisClient.exists(stockKey);

      if (!exists) {
        // Fallback: Fetch from DB
        const { rows } = await pool.query(
          "SELECT stock_count FROM products WHERE id = $1",
          [item.productId]
        );
        if (rows.length === 0)
          throw new AppError(`Product ID ${item.productId} not found`, 404);

        // Set Redis Stock (with expiry to keep it fresh-ish, e.g., 1 hour)
        await redisClient.set(stockKey, rows[0].stock_count, "EX", 3600);
      }

      const newStock = await redisClient.decrby(stockKey, item.quantity);

      if (newStock < 0) {
        // Rollback this item
        await redisClient.incrby(stockKey, item.quantity);
        // Rollback previous items
        for (const reserved of reservedItems) {
          await redisClient.incrby(
            `product:${reserved.productId}:stock`,
            reserved.quantity
          );
        }
        throw new AppError(`Product ID ${item.productId} is out of stock`, 400);
      }
      reservedItems.push(item);
    }

    // 2. DB TRANSACTION
    await client.query("BEGIN");

    const totalAmount = items.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );

    // Create Order
    const orderRes = await client.query(
      `INSERT INTO orders (user_id, total_amount, status) VALUES ($1, $2, 'pending') RETURNING id`,
      [userId, totalAmount]
    );
    const orderId = orderRes.rows[0].id;

    // Create Items
    for (const item of items) {
      await client.query(
        `INSERT INTO order_items (order_id, product_id, quantity, price_at_purchase)
         VALUES ($1, $2, $3, $4)`,
        [orderId, item.productId, item.quantity, item.price]
      );
    }

    await client.query("COMMIT");

    // 3. CLEANUP (Redis Cart)
    if (clearCart) {
      await redisClient.del(`cart:${userId}`);
    }

    return { orderId, status: "success" };
  } catch (error) {
    await client.query("ROLLBACK");

    // Compensation Logic: Restore Redis Stock if DB failed
    // (Only if it wasn't a stock error)
    if (items.length > 0 && !error.message.includes("out of stock")) {
      for (const item of items) {
        await redisClient.incrby(
          `product:${item.productId}:stock`,
          item.quantity
        );
      }
    }
    throw error;
  } finally {
    client.release();
  }
};
