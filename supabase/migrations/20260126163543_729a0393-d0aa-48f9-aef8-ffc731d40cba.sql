-- Create sub-category enum with options for each main category
CREATE TYPE product_subcategory AS ENUM (
  -- Vape sub-categories
  'box_mod',
  'pod_system',
  'starter_kit',
  'advanced_mod',
  
  -- Puff sub-categories  
  'low_puff',      -- 1000-3000 puffs
  'mid_puff',      -- 4000-8000 puffs
  'high_puff',     -- 9000+ puffs
  
  -- Flavor sub-categories
  'ice_mint',
  'fruity',
  'exotic',
  'tobacco',
  'dessert',
  
  -- Accessory sub-categories
  'battery',
  'charger',
  'case',
  'coil',
  'tank',
  'drip_tip',
  'replacement_glass',
  'clothing'
);

-- Add sub_category column to products table
ALTER TABLE products
ADD COLUMN sub_category product_subcategory;