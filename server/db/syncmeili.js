// server/db/syncmeili.js
import { index } from "../utils/meiliClient.js";
import { pool } from "./db.js";

async function syncMeili() {
  const { rows } = await pool.query(`
   SELECT
    p.*,
    MIN(vv.year_from) AS year_start,
    MAX(vv.year_to)   AS year_end,
    ARRAY_AGG(DISTINCT vmk.name) AS fits_makes,
    ARRAY_AGG(DISTINCT vm.name)  AS fits_models
    FROM products p
    LEFT JOIN product_vehicle_fitment pvf ON pvf.product_id = p.id
    LEFT JOIN vehicle_variants vv ON pvf.vehicle_variant_id = vv.id
    LEFT JOIN vehicle_models vm ON vv.model_id = vm.id
    LEFT JOIN vehicle_makes vmk ON vm.make_id = vmk.id
    GROUP BY p.id;
  `);

  if (rows.length > 0) {
    // --- ADD THIS BLOCK ---
    // Create a new field 'title_compressed' by removing spaces
    const documents = rows.map((row) => ({
      ...row,
      title_compressed: row.title.replace(/\s+/g, ""), // "Premium Auto Part" -> "PremiumAutoPart"
    }));
    // ----------------------

    console.log(`Sending ${documents.length} documents to Meilisearch...`);
    await index.addDocuments(documents); // Send 'documents' instead of 'rows'
  } else {
    console.warn("⚠️  No products found to sync!");
  }

  console.log("✅ Meilisearch Sync Complete");
}

export default syncMeili;