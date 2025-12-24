// server/db/seed_vehicles.js
import { pool } from "./db.js";

async function seedVehicles() {
  try {
    console.log("🌱 Starting Vehicle Seed...");

    /* -------------------------------------------------
     * 1. CATEGORIES
     * ------------------------------------------------- */
    const categories = [
      { name: "Brake Systems", slug: "brake-systems" },
      { name: "Engine Components", slug: "engine-components" },
      { name: "Filters", slug: "filters" },
      { name: "Suspension", slug: "suspension" },
      { name: "Electrical", slug: "electrical" },
      { name: "Cooling System", slug: "cooling-system" }
    ];

    for (const c of categories) {
      await pool.query(
        `INSERT INTO categories (name, slug)
         VALUES ($1, $2)
         ON CONFLICT (name) DO NOTHING`,
        [c.name, c.slug]
      );
    }

    const catRows = await pool.query("SELECT id, name FROM categories");
    const catMap = {};
    catRows.rows.forEach(r => (catMap[r.name] = r.id));

    /* -------------------------------------------------
     * 2. MAKES
     * ------------------------------------------------- */
    const makes = ["Honda", "Toyota", "Ford", "BMW", "Nissan"];

    const makeMap = {};
    for (const make of makes) {
      await pool.query(
        `INSERT INTO vehicle_makes (name)
         VALUES ($1)
         ON CONFLICT (name) DO NOTHING`,
        [make]
      );

      const { rows } = await pool.query(
        "SELECT id FROM vehicle_makes WHERE name = $1",
        [make]
      );
      makeMap[make] = rows[0].id;
    }

    /* -------------------------------------------------
     * 3. MODELS
     * ------------------------------------------------- */
    const models = {
      Honda: ["Civic", "Accord"],
      Toyota: ["Camry", "Corolla"],
      Ford: ["Focus", "F-150"],
      BMW: ["3 Series"],
      Nissan: ["Altima"]
    };

    const modelMap = {};

    for (const [make, modelList] of Object.entries(models)) {
      for (const model of modelList) {
        await pool.query(
          `INSERT INTO vehicle_models (make_id, name)
           VALUES ($1, $2)
           ON CONFLICT (make_id, name) DO NOTHING`,
          [makeMap[make], model]
        );

        const { rows } = await pool.query(
          `SELECT id FROM vehicle_models
           WHERE make_id = $1 AND name = $2`,
          [makeMap[make], model]
        );
        modelMap[`${make}-${model}`] = rows[0].id;
      }
    }

    /* -------------------------------------------------
     * 4. VARIANTS
     * ------------------------------------------------- */
    const variants = [
      { key: "Honda-Civic", from: 2016, to: 2021, sub: "10th Gen" },
      { key: "Honda-Accord", from: 2018, to: 2022, sub: "10th Gen" },
      { key: "Toyota-Camry", from: 2017, to: 2023, sub: "XV70" },
      { key: "Toyota-Corolla", from: 2019, to: 2024, sub: "E210" },
      { key: "Ford-F-150", from: 2015, to: 2020, sub: "13th Gen" },
      { key: "BMW-3 Series", from: 2016, to: 2019, sub: "F30" }
    ];

    const variantIds = [];

    for (const v of variants) {
      const { rows } = await pool.query(
        `INSERT INTO vehicle_variants (model_id, year_from, year_to, submodel)
         VALUES ($1, $2, $3, $4)
         RETURNING id`,
        [modelMap[v.key], v.from, v.to, v.sub]
      );
      variantIds.push(rows[0].id);
    }

    /* -------------------------------------------------
     * 5. PRODUCTS (100)
     * ------------------------------------------------- */
    console.log("... Inserting 100 Products");

    const products = [];
    for (let i = 1; i <= 100; i++) {
      products.push({
        title: `Premium Auto Part #${i}`,
        slug: `premium-auto-part-${i}`,
        part: `PART-${1000 + i}`,
        price: 2000 + i * 25,
        stock: 50 + i,
        categoryId: Object.values(catMap)[i % Object.values(catMap).length],
        attributes: {
          brand: i % 2 === 0 ? "Bosch" : "Denso",
          warranty: "12 months"
        }
      });
    }

    const productIds = [];

    for (const p of products) {
      const { rows } = await pool.query(
        `INSERT INTO products
         (title, slug, price, stock_count, category_id, part_number, attributes)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         ON CONFLICT (slug) DO NOTHING
         RETURNING id`,
        [
          p.title,
          p.slug,
          p.price,
          p.stock,
          p.categoryId,
          p.part,
          JSON.stringify(p.attributes)
        ]
      );

      if (rows.length > 0) {
        productIds.push(rows[0].id);
      } else {
        const existing = await pool.query(
          "SELECT id FROM products WHERE slug = $1",
          [p.slug]
        );
        productIds.push(existing.rows[0].id);
      }
    }

    /* -------------------------------------------------
     * 6. PRODUCT VEHICLE FITMENT (PVF)
     * ------------------------------------------------- */
    console.log("... Linking Products to Vehicles");

    for (const productId of productIds) {
      // Each product fits 2 random variants
      const fits = variantIds
        .sort(() => 0.5 - Math.random())
        .slice(0, 2);

      for (const variantId of fits) {
        await pool.query(
          `INSERT INTO product_vehicle_fitment (product_id, vehicle_variant_id)
           VALUES ($1, $2)
           ON CONFLICT (product_id, vehicle_variant_id) DO NOTHING`,
          [productId, variantId]
        );
      }
    }

    console.log("🎉 FULL VEHICLE + PRODUCT SEED COMPLETE");
  } catch (err) {
    console.error("❌ Seed failed:", err);
  } finally {
    await pool.end();
  }
}

seedVehicles();
