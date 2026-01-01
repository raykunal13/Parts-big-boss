-- =========================================================
-- EXTENSIONS (Optional but common)
-- =========================================================
-- Enables better indexing and text search later if needed
-- CREATE EXTENSION IF NOT EXISTS pg_trgm;


-- =========================================================
-- 1. CATEGORIES (Hierarchical Product Categories)
-- =========================================================
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    parent_id INTEGER REFERENCES categories(id) ON DELETE SET NULL
);


-- =========================================================
-- 2. VEHICLE HIERARCHY
-- =========================================================

-- -----------------------------------------
-- Level 1: Vehicle Makes (Honda, Toyota)
-- -----------------------------------------
CREATE TABLE IF NOT EXISTS vehicle_makes (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE
);

-- -----------------------------------------
-- Level 2: Vehicle Models (Civic, Camry)
-- -----------------------------------------
CREATE TABLE IF NOT EXISTS vehicle_models (
    id SERIAL PRIMARY KEY,
    make_id INTEGER NOT NULL REFERENCES vehicle_makes(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    UNIQUE (make_id, name)
);

-- -----------------------------------------
-- Level 3: Vehicle Variants (Year + Submodel)
-- -----------------------------------------
CREATE TABLE IF NOT EXISTS vehicle_variants (
    id SERIAL PRIMARY KEY,
    model_id INTEGER NOT NULL REFERENCES vehicle_models(id) ON DELETE CASCADE,
    year_from INTEGER NOT NULL,
    year_to INTEGER NOT NULL,
    submodel TEXT, -- LX, Sport, Type R, etc.

    CHECK (year_to >= year_from),

    -- Prevent duplicate variants
    UNIQUE (model_id, year_from, year_to, submodel)
);


-- =========================================================
-- 3. PRODUCTS (Automotive Parts)
-- =========================================================
CREATE TABLE IF NOT EXISTS products (
    id BIGSERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    legacy_url_key TEXT UNIQUE,

    part_number TEXT, -- Manufacturer or internal SKU

    -- Stored in smallest currency unit (e.g., paise)
    price INTEGER NOT NULL CHECK (price >= 0),

    stock_count INTEGER NOT NULL DEFAULT 0 CHECK (stock_count >= 0),

    attributes JSONB,
    image_url TEXT,

    category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);


-- =========================================================
-- 4. PRODUCT ↔ VEHICLE FITMENT (Many-to-Many)
-- =========================================================
CREATE TABLE IF NOT EXISTS product_vehicle_fitment (
    id BIGSERIAL PRIMARY KEY,
    product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    vehicle_variant_id INTEGER NOT NULL REFERENCES vehicle_variants(id) ON DELETE CASCADE,

    UNIQUE (product_id, vehicle_variant_id)
);


-- =========================================================
-- 5. USERS & AUTHENTICATION
-- =========================================================
CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,

    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    phone_number TEXT NOT NULL,

    role TEXT NOT NULL DEFAULT 'customer'
        CHECK (role IN ('customer', 'dealer', 'admin')),

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);


-- =========================================================
-- 6. DEALERS (Extension Table for Dealer Users)
-- =========================================================
CREATE TABLE IF NOT EXISTS dealers (
    user_id BIGINT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,

    company_name TEXT NOT NULL,
    vat_number TEXT UNIQUE,
    company_address TEXT,
    company_city TEXT,

    is_verified BOOLEAN NOT NULL DEFAULT FALSE
);


-- =========================================================
-- 7. USER ADDRESSES
-- =========================================================
CREATE TABLE IF NOT EXISTS user_addresses (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    address_line1 TEXT NOT NULL,
    address_line2 TEXT,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    postal_code TEXT NOT NULL,
    country TEXT NOT NULL DEFAULT 'India',

    is_default BOOLEAN NOT NULL DEFAULT FALSE,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Ensure only one default address per user
CREATE UNIQUE INDEX IF NOT EXISTS idx_one_default_address
ON user_addresses(user_id)
WHERE is_default = TRUE;


-- =========================================================
-- 8. ORDERS
-- =========================================================
CREATE TABLE IF NOT EXISTS orders (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
    address_id BIGINT REFERENCES user_addresses(id),

    total_amount INTEGER NOT NULL CHECK (total_amount >= 0),

    status TEXT NOT NULL DEFAULT 'pending'
        CHECK (status IN ('pending', 'paid', 'shipped', 'cancelled')),

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);


-- =========================================================
-- 9. ORDER ITEMS
-- =========================================================
CREATE TABLE IF NOT EXISTS order_items (
    id BIGSERIAL PRIMARY KEY,
    order_id BIGINT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id BIGINT REFERENCES products(id) ON DELETE SET NULL,

    quantity INTEGER NOT NULL CHECK (quantity > 0),
    price_at_purchase INTEGER NOT NULL CHECK (price_at_purchase >= 0)
);


-- =========================================================
-- 10. UPDATED_AT AUTO-UPDATE TRIGGER
-- =========================================================
-- CREATE OR REPLACE FUNCTION update_timestamp()
-- RETURNS TRIGGER AS $$
-- BEGIN
--     NEW.updated_at = CURRENT_TIMESTAMP;
--     RETURN NEW;
-- END;
-- $$ LANGUAGE plpgsql;

-- CREATE TRIGGER trg_products_updated
-- BEFORE UPDATE ON products
-- FOR EACH ROW EXECUTE FUNCTION update_timestamp();

-- CREATE TRIGGER trg_users_updated
-- BEFORE UPDATE ON users
-- FOR EACH ROW EXECUTE FUNCTION update_timestamp();

-- CREATE TRIGGER trg_orders_updated
-- BEFORE UPDATE ON orders
-- FOR EACH ROW EXECUTE FUNCTION update_timestamp();

-- =========================================================
-- 10. USER VEHICLES (The "Garage")
-- =========================================================
CREATE TABLE IF NOT EXISTS user_vehicles (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    vehicle_variant_id INTEGER NOT NULL REFERENCES vehicle_variants(id) ON DELETE CASCADE,
    
    nickname TEXT, -- e.g., "Dad's Truck"
    is_active BOOLEAN NOT NULL DEFAULT FALSE,
    
    -- Future proofing: Helps calculating "Profile Completeness"
    fitment_completeness INTEGER DEFAULT 100 CHECK (fitment_completeness BETWEEN 0 AND 100),
    
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
-- =========================================================
-- 11. INDEXES (Performance Optimization)
-- =========================================================

-- Vehicle hierarchy lookups
CREATE INDEX IF NOT EXISTS idx_models_make ON vehicle_models(make_id);
CREATE INDEX IF NOT EXISTS idx_variants_model ON vehicle_variants(model_id);
CREATE INDEX IF NOT EXISTS idx_variants_year_range ON vehicle_variants(year_from, year_to);

-- Fitment joins
CREATE INDEX IF NOT EXISTS idx_fitment_product ON product_vehicle_fitment(product_id);
CREATE INDEX IF NOT EXISTS idx_fitment_variant ON product_vehicle_fitment(vehicle_variant_id);

-- Product search
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_part_number ON products(part_number);

-- User & order queries
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);


-- Indexes for Dashboard Speed
CREATE INDEX IF NOT EXISTS idx_user_vehicles_user ON user_vehicles(user_id);
-- Fast lookup for "Current Active Vehicle"
CREATE INDEX IF NOT EXISTS idx_user_vehicles_active ON user_vehicles(user_id) WHERE is_active = TRUE;