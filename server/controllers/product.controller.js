// import asyncHandler from "../utils/asyncHandler.js";
// import AppError from "../utils/appError.js";
// import { searchProductsService } from "../services/searchProduct.js";

// export const searchProducts = asyncHandler(async (req, res, next) => {
//   const {
//     make_id,
//     model_id,
//     year,
//     category_slug,
//     limit = 20,
//     offset = 0,
//   } = req.query;

//   // ---- Validation & coercion ----
//   const makeId = make_id ? Number(make_id) : null;
//   const modelId = model_id ? Number(model_id) : null;
//   const yearInt = year ? Number(year) : null;
//   const limitInt = Number(limit);
//   const offsetInt = Number(offset);

//   if (make_id && Number.isNaN(makeId)) {
//     return next(new AppError("Invalid make_id", 400));
//   }

//   if (model_id && Number.isNaN(modelId)) {
//     return next(new AppError("Invalid model_id", 400));
//   }

//   if (year && Number.isNaN(yearInt)) {
//     return next(new AppError("Invalid year", 400));
//   }

//   if (Number.isNaN(limitInt) || limitInt <= 0 || limitInt > 100) {
//     return next(new AppError("Invalid limit (1–100)", 400));
//   }

//   if (Number.isNaN(offsetInt) || offsetInt < 0) {
//     return next(new AppError("Invalid offset", 400));
//   }

//   console.log({
//     makeId,
//     modelId,
//     year: yearInt,
//     categorySlug: category_slug,
//     limit: limitInt,
//     offset: offsetInt,
//   });
  
//   const result = await searchProductsService({
//     makeId,
//     modelId,
//     year: yearInt,
//     categorySlug: category_slug,
//     limit: limitInt,
//     offset: offsetInt,
//   });

//   res.json({
//     count: result.count,
//     limit: limitInt,
//     offset: offsetInt,
//     results: result.rows,
//     filters: {
//       make_id: makeId,
//       model_id: modelId,
//       year: yearInt,
//       category_slug,
//     },
//   });
// });


import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/appError.js";
import { searchWithMeili } from "../services/searchProductMeili.js";
import { pool } from "../db/db.js";
import redisClient from "../db/redisClient.js";


export const getFeaturedProducts = asyncHandler(async (req, res) => {
  const cacheKey = "products:featured";

  // 1. Try Redis Cache first
  const cachedData = await redisClient.get(cacheKey);
  if (cachedData) {
    return res.json(JSON.parse(cachedData));
  }

  // 2. Database Query (Aggregated Sales)
  // We calculate "Best Sellers" by summing quantity from VALID orders only.
  const query = `
    SELECT p.id, p.title, p.price, p.image_url, p.slug, p.part_number, 
           SUM(oi.quantity) as total_sold
    FROM products p
    JOIN order_items oi ON p.id = oi.product_id
    JOIN orders o ON oi.order_id = o.id
    WHERE o.status IN ('paid', 'shipped') 
    GROUP BY p.id
    ORDER BY total_sold DESC
    LIMIT 10
  `;

  let { rows } = await pool.query(query);

  if (rows.length === 0) {
    const fallbackQuery = `
      SELECT id, title, price, image_url, slug, part_number
      FROM products
      ORDER BY created_at DESC
      LIMIT 10
    `;
    const fallbackResult = await pool.query(fallbackQuery);
    rows = fallbackResult.rows;
  }

  if (rows.length > 0) {
    await redisClient.set(cacheKey, JSON.stringify(rows), "EX", 21600);
  }

  res.json(rows);
});


export const searchProducts = asyncHandler(async (req, res, next) => {
  const {
    q = "",
    make_id,
    model_id,
    year,
    category_slug,
    limit = 20,
    offset = 0,
  } = req.query;

  const limitInt = Number(limit);
  const offsetInt = Number(offset);
  const yearInt = year ? Number(year) : null;

  if (Number.isNaN(limitInt) || limitInt < 1 || limitInt > 100) {
    return next(new AppError("Invalid limit (1–100)", 400));
  }

  if (Number.isNaN(offsetInt) || offsetInt < 0) {
    return next(new AppError("Invalid offset", 400));
  }

  if (year && Number.isNaN(yearInt)) {
    return next(new AppError("Invalid year", 400));
  }

  // ---- Resolve IDs → names (cheap lookups) ----
  let makeName = null;
  let modelName = null;

  if (make_id) {
    const { rows } = await pool.query(
      "SELECT name FROM vehicle_makes WHERE id = $1",
      [make_id]
    );
    if (!rows.length) {
      return next(new AppError("Invalid make_id", 400));
    }
    makeName = rows[0].name;
  }

  if (model_id) {
    const { rows } = await pool.query(
      "SELECT name FROM vehicle_models WHERE id = $1",
      [model_id]
    );
    if (!rows.length) {
      return next(new AppError("Invalid model_id", 400));
    }
    modelName = rows[0].name;
  }

  // ---- Call Meilisearch ----
  const result = await searchWithMeili({
    query: q,
    makeName,
    modelName,
    year: yearInt,
    categorySlug: category_slug,
    limit: limitInt,
    offset: offsetInt,
  });

  res.json({
    count: result.count,
    limit: limitInt,
    offset: offsetInt,
    results: result.rows,
    filters: {
      q,
      make_id,
      model_id,
      year: yearInt,
      category_slug,
    },
  });
});
