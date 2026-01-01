import { pool } from "./db.js";
import redisClient from "./redisClient.js";

export const syncInventoryToRedis = async () => {
  console.log("🔄 Syncing Inventory from Postgres to Redis...");
  
  const client = await pool.connect();
  try {
    const { rows } = await client.query("SELECT id, stock_count FROM products");

    const pipeline = redisClient.pipeline(); // Batch commands for speed

    rows.forEach((product) => {
      // Key Pattern: product:{id}:stock
      pipeline.set(`product:${product.id}:stock`, product.stock_count);
    });

    await pipeline.exec();
    console.log(`✅ Synced ${rows.length} products to Redis Inventory.`);
    
  } catch (error) {
    console.error("❌ Sync failed:", error);
  } finally {
    client.release();
  }
};