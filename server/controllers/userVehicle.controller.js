import { pool } from "../db/db.js";
import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/appError.js";


export const addVehicle = asyncHandler(async (req, res) => {
  const { variantId, nickname } = req.body;
  const userId = req.user.id;

  if (!variantId) throw new AppError("Vehicle Variant ID is required", 400);

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const countRes = await client.query(
      "SELECT count(*) FROM user_vehicles WHERE user_id = $1",
      [userId]
    );
    const isFirstCar = parseInt(countRes.rows[0].count) === 0;

    const insertQuery = `
      INSERT INTO user_vehicles (user_id, vehicle_variant_id, nickname, is_active)
      VALUES ($1, $2, $3, $4)
      RETURNING id, nickname, is_active
    `;
    const result = await client.query(insertQuery, [
      userId, 
      variantId, 
      nickname || "My Vehicle", 
      isFirstCar // true if first, false otherwise
    ]);

    await client.query("COMMIT");

    res.status(201).json({
      status: "success",
      vehicle: result.rows[0],
      message: isFirstCar ? "Vehicle added and activated!" : "Vehicle added to garage."
    });

  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
});

export const getUserVehicles = asyncHandler(async (req, res) => {
  const query = `
    SELECT 
      uv.id, 
      uv.nickname, 
      uv.is_active, 
      uv.vehicle_variant_id,
      vmk.name as make,
      vm.name as model,
      vv.year_from, 
      vv.year_to, 
      vv.submodel
    FROM user_vehicles uv
    JOIN vehicle_variants vv ON uv.vehicle_variant_id = vv.id
    JOIN vehicle_models vm ON vv.model_id = vm.id
    JOIN vehicle_makes vmk ON vm.make_id = vmk.id
    WHERE uv.user_id = $1
    ORDER BY uv.is_active DESC, uv.created_at DESC
  `;

  const { rows } = await pool.query(query, [req.user.id]);
  res.status(200).json(rows);
});

export const activateVehicle = asyncHandler(async (req, res) => {
  const vehicleId = req.params.id;
  const userId = req.user.id;

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // 1. Deactivate ALL vehicles for this user
    await client.query(
      "UPDATE user_vehicles SET is_active = FALSE WHERE user_id = $1",
      [userId]
    );

    // 2. Activate the TARGET vehicle
    const result = await client.query(
      "UPDATE user_vehicles SET is_active = TRUE WHERE id = $1 AND user_id = $2 RETURNING *",
      [vehicleId, userId]
    );

    if (result.rows.length === 0) {
      throw new AppError("Vehicle not found", 404);
    }

    await client.query("COMMIT");

    res.status(200).json({
      status: "success",
      activeVehicleId: result.rows[0].id
    });

  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
});

/**
 * @desc    Get "Buy Again" Suggestions
 * @route   GET /api/user/reorder-suggestions
 */
export const getReorderSuggestions = asyncHandler(async (req, res) => {
  // Logic: Find items bought > 1 time OR items in "Consumable" categories (Filters, Oil, etc.)
  // Note: We use the 'categories' table slug to identify consumables.
  
  const query = `
    SELECT DISTINCT ON (p.id)
      p.id, p.title, p.price, p.image_url, p.part_number,
      c.name as category_name
    FROM order_items oi
    JOIN orders o ON oi.order_id = o.id
    JOIN products p ON oi.product_id = p.id
    LEFT JOIN categories c ON p.category_id = c.id
    WHERE o.user_id = $1 
      AND o.status IN ('paid', 'shipped', 'delivered')
      AND (
        -- Condition A: Bought more than once (Complex Group By required, simplifying for MVP)
        -- Condition B: Is a Consumable Category
        c.slug IN ('filters', 'engine-oils', 'brake-pads', 'wipers', 'fluids')
      )
    ORDER BY p.id, o.created_at DESC
    LIMIT 10
  `;

  // Note: For MVP, simply returning *recent purchases* is often enough for a "Buy Again" shelf.
  // The query above filters for specific categories if your seed data has them. 
  // If not, remove the `AND (c.slug ...)` block to just show purchase history.

  const { rows } = await pool.query(query, [req.user.id]);
  res.status(200).json(rows);
});