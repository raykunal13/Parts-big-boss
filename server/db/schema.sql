-- ==========================================
-- 1. CATEGORIES (e.g., "Brakes", "Filters")
-- ==========================================
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    parent_id INTEGER REFERENCES categories(id) ON DELETE SET NULL
);

-- ==========================================
-- 2. VEHICLE HIERARCHY (The Tree)
-- ==========================================

-- Level 1: Makes (Honda, Toyota)
CREATE TABLE IF NOT EXISTS vehicle_makes (
    id SERIAL PRIMARY KEY,
    name TEXT UNIQUE NOT NULL
);

-- Level 2: Models (Civic, Camry)
CREATE TABLE IF NOT EXISTS vehicle_models (
    id SERIAL PRIMARY KEY,
    make_id INTEGER REFERENCES vehicle_makes(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    -- Ensure we don't have two "Civics" for "Honda"
    UNIQUE(make_id, name)
);

-- Level 3: Variants (2016-2021 Civic Sport)
CREATE TABLE IF NOT EXISTS vehicle_variants (
    id SERIAL PRIMARY KEY,
    model_id INTEGER REFERENCES vehicle_models(id) ON DELETE CASCADE,
    year_from INTEGER NOT NULL,
    year_to INTEGER NOT NULL,
    submodel TEXT, -- "Sport", "LX", "Type R"
    
    -- Constraint: End year cannot be smaller than Start year
    CHECK (year_to >= year_from)
);

-- ==========================================
-- 3. PRODUCTS (The Parts)
-- ==========================================
CREATE TABLE IF NOT EXISTS products (
    id BIGSERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    legacy_url_key TEXT UNIQUE,
    part_number TEXT,  -- New: "BOSCH-1234"
    price INTEGER NOT NULL,
    stock_count INTEGER DEFAULT 0,
    attributes JSONB,
    image_url TEXT,
    
    -- Link Product to Category
    category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- 4. THE BRIDGE (Fitment)
-- ==========================================
-- This is the magic table. It says "Product X fits Variant Y"
CREATE TABLE IF NOT EXISTS product_vehicle_fitment (
    id BIGSERIAL PRIMARY KEY,
    product_id BIGINT REFERENCES products(id) ON DELETE CASCADE,
    vehicle_variant_id INTEGER REFERENCES vehicle_variants(id) ON DELETE CASCADE,
    
    -- Prevent duplicate rows (Don't say "It fits" twice for the same car)
    UNIQUE(product_id, vehicle_variant_id)
);

-- ==========================================
-- 5. ORDERS & ORDER ITEMS
-- ==========================================
CREATE TABLE IF NOT EXISTS orders (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
    total_amount INTEGER NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'paid', 'shipped', 'cancelled'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS address_id BIGINT REFERENCES user_addresses(id);

CREATE TABLE IF NOT EXISTS order_items (
    id BIGSERIAL PRIMARY KEY,
    order_id BIGINT REFERENCES orders(id) ON DELETE CASCADE,
    product_id BIGINT REFERENCES products(id) ON DELETE SET NULL,
    quantity INTEGER NOT NULL,
    price_at_purchase INTEGER NOT NULL
);

-- ==========================================
-- 6. USERS & AUTHENTICATION
-- ==========================================

-- 1. The Base User Table (Common to Everyone)
CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    
    -- Common Fields
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    phone_number TEXT NOT NULL,
    
    -- Role Management (Simple String Check is enough for now)
    role TEXT NOT NULL DEFAULT 'customer', -- 'customer', 'dealer', 'admin'
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. The Dealer Profile (Extension Table)
-- Only exists if role = 'dealer'
CREATE TABLE IF NOT EXISTS dealers (
    user_id BIGINT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    
    -- Dealer Specific Fields
    company_name TEXT NOT NULL,
    vat_number TEXT UNIQUE,
    company_address TEXT,
    company_city TEXT,
    
    -- Approval Status (Dealers often need manual approval)
    is_verified BOOLEAN DEFAULT FALSE
);


-- ==========================================
-- 7. USER ADDRESSES
-- ==========================================
CREATE TABLE IF NOT EXISTS user_addresses (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    address_line1 TEXT NOT NULL,
    address_line2 TEXT,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    postal_code TEXT NOT NULL,
    country TEXT NOT NULL DEFAULT 'India',
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Update Orders table to link to an address
-- ==========================================
-- 6. INDEXES (Speed Optimization)
-- ==========================================
-- Search Indexes for the Dropdowns
CREATE INDEX IF NOT EXISTS idx_models_make ON vehicle_models(make_id);
CREATE INDEX IF NOT EXISTS idx_variants_model ON vehicle_variants(model_id);

-- Speed up the "Bridge Join" (Phase 2 of your plan)
CREATE INDEX IF NOT EXISTS idx_fitment_product ON product_vehicle_fitment(product_id);
CREATE INDEX IF NOT EXISTS idx_fitment_variant ON product_vehicle_fitment(vehicle_variant_id);

-- Product Search Indexes
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_cat ON products(category_id);

-- User search Index for fast lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);