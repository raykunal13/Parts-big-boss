import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import { dbconnect } from "./db/db.js";
import errorHandler from "./middleware/errorHandler.js";
const PORT = process.env.PORT || 3000;

const app = express();

app.use(cors());
app.use(express.json());

dbconnect();


//routes
import vehicleRoutes from "./routes/vehicle.routes.js";
import productRoutes from "./routes/product.routes.js";

app.use('/api/vehicles', vehicleRoutes);
app.use('/api/products', productRoutes);

// Error handling middleware
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
