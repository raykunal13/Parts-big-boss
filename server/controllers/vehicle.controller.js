import { pool } from "../db/db.js";
import AppError from "../utils/appError.js";
import redisClient from "../db/redisClient.js";
import asyncHandler from "../utils/asyncHandler.js";

//Controller to get companies
const getCompanies = asyncHandler(async (req, res) => {
  const cachedCompanies = await redisClient.get("companies");
  if (cachedCompanies) {
    return res.json(JSON.parse(cachedCompanies));
  }
  const result = await pool.query(
    "SELECT id,name FROM vehicle_makes ORDER BY name ASC"
  );
  await redisClient.set("companies", JSON.stringify(result.rows),"EX",86400);
  return res.json(result.rows);
});

//Controller to get models
const getModels = asyncHandler(async (req, res) => {
  const { make_id } = req.params;
  if (!make_id) {
    throw new AppError("Make ID is required", 400);
  }
  const cachedModels = await redisClient.get(`models:${make_id}`);
  if (cachedModels) {
    return res.json(JSON.parse(cachedModels));
  }
  const result = await pool.query(
    "SELECT * FROM vehicle_models WHERE make_id = $1 ORDER BY name ASC",
    [make_id]
  );
  await redisClient.set(`models:${make_id}`, JSON.stringify(result.rows),"EX",86400);
  return res.json(result.rows);
});

//Controller to get years
const getYears = asyncHandler(async (req, res) => {
  const { model_id } = req.params;
  if (!model_id) throw new AppError("Model ID is required", 400);

  const cachedData = await redisClient.get(`years:${model_id}`);
  if (cachedData) {
    return res.json(JSON.parse(cachedData));
  }

  const query = `
    SELECT v.id as variant_id, s.year, v.submodel
    FROM vehicle_variants v,
    generate_series(v.year_from, v.year_to) as s(year)
    WHERE v.model_id = $1
    ORDER BY s.year DESC
  `;

  const result = await pool.query(query, [model_id]);

  await redisClient.set(`years:${model_id}`, JSON.stringify(result.rows), "EX", 86400);
  res.json(result.rows);
});

export { getCompanies, getModels, getYears };
