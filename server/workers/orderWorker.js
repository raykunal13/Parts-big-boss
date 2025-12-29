import { Worker } from "bullmq";
import { processOrderTransaction } from "../services/orderService.js";
import { connection, ORDER_QUEUE_NAME } from "../utils/queue.js";

console.log("Order Worker Starting...");

const orderWorker = new Worker(
  ORDER_QUEUE_NAME,
  async (job) => {
    const { userId, items, addressId, isBuyNow } = job.data;

    console.log(`Processing Order Job ${job.id} for User ${userId}`);

    try {
      const result = await processOrderTransaction(
        userId, 
        items, 
        !isBuyNow, 
        addressId
      );
      
      console.log(` Order ${result.orderId} Created!`);
      return result;

    } catch (error) {
      console.error(` Job ${job.id} Failed:`, error.message);
      throw error; 
    }
  },
  { connection }
);

orderWorker.on("failed", (job, err) => {
  console.error(`Job ${job.id} failed with ${err.message}`);
});

export default orderWorker;