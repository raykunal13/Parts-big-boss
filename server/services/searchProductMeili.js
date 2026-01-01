import { index } from "../utils/meiliClient.js";

export const searchWithMeili = async ({
  query,
  makeName,
  modelName,
  year,
  categorySlug,
  limit,
  offset,
}) => {
  const filters = [];

  if (makeName) {
    filters.push(`fits_makes = "${makeName}"`);
  }

  if (modelName) {
    filters.push(`fits_models = "${modelName}"`);
  }

  if (year) {
    filters.push(`year_start <= ${year} AND year_end >= ${year}`);
  }

  if (categorySlug) {
    filters.push(`category_slug = "${categorySlug}"`);
  }

  const searchResults = await index.search(query || "", {
    filter: filters.length ? filters.join(" AND ") : undefined,
    limit,
    offset,
  });

  return {
    rows: searchResults.hits,
    count: searchResults.estimatedTotalHits,
  };
};
