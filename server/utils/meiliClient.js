import { MeiliSearch } from "meilisearch";
import dotenv from "dotenv";
dotenv.config();

// Ensure these match your docker-compose environment variables
const meiliClient = new MeiliSearch({
  host: process.env.MEILI_HOST || "http://localhost:7700",
  apiKey: process.env.MEILI_MASTER_KEY || "masterKey123",
});

const index = meiliClient.index("products");

const configureMeili = async () => {
  await index.updateSearchableAttributes([
    "title",
    "fits_makes",
    "fits_models",
    "category_slug",
    "attributes.brand",
    "title_compressed",
  ]);

  await index.updateFilterableAttributes([
    "fits_makes",
    "fits_models",
    "category_slug",
    "year_start",
    "year_end",
    "price",
  ]);

  await index.updateSortableAttributes(["price", "created_at"]);

  await index.update({ primaryKey: "id" });

  console.log("✅ Meilisearch Configured");
};

export { meiliClient, index, configureMeili };
