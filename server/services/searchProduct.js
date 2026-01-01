import { pool } from "../db/db.js";

export const searchProductsService = async ({
  makeId,
  modelId,
  year,
  categorySlug,
  limit,
  offset,
}) => {
  const params = [];
  let paramIndex = 1;

  // ---- Base FROM + JOINs ----
  let baseQuery = `
    FROM products p
    INNER JOIN product_vehicle_fitment pvf ON p.id = pvf.product_id
    INNER JOIN vehicle_variants v ON pvf.vehicle_variant_id = v.id
    INNER JOIN vehicle_models m ON v.model_id = m.id
  `;

  // Category join becomes INNER JOIN only if filtering by category
  if (categorySlug) {
    baseQuery += `
      INNER JOIN categories c ON p.category_id = c.id
    `;
  } else {
    baseQuery += `
      LEFT JOIN categories c ON p.category_id = c.id
    `;
  }

  let whereClause = ` WHERE 1=1 `;

  // ---- Dynamic filters ----
  if (makeId) {
    whereClause += ` AND m.make_id = $${paramIndex}`;
    params.push(makeId);
    paramIndex++;
  }

  if (modelId) {
    whereClause += ` AND m.id = $${paramIndex}`;
    params.push(modelId);
    paramIndex++;
  }

  if (year) {
    whereClause += ` AND $${paramIndex} BETWEEN v.year_from AND v.year_to`;
    params.push(year);
    paramIndex++;
  }

  if (categorySlug) {
    whereClause += ` AND c.slug = $${paramIndex}`;
    params.push(categorySlug);
    paramIndex++;
  }

  // ---- Count query (for pagination metadata) ----
  const countQuery = `
    SELECT COUNT(DISTINCT p.id) AS count
    ${baseQuery}
    ${whereClause}
  `;

  const countResult = await pool.query(countQuery, params);
  const count = Number(countResult.rows[0].count);

  // ---- Data query ----
  const dataQuery = `
    SELECT DISTINCT
      p.id,
      p.title,
      p.price,
      p.slug,
      p.image_url,
      p.part_number,
      c.name AS category
    ${baseQuery}
    ${whereClause}
    ORDER BY p.title ASC, p.id ASC
    LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
  `;
  const dataParams = [...params, limit, offset];
  const dataResult = await pool.query(dataQuery, dataParams);

  return {
    count,
    rows: dataResult.rows,
  };
};
