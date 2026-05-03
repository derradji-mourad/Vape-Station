-- Add category field to products table
CREATE TYPE product_category AS ENUM ('vape', 'puff', 'flavor', 'accessory');

ALTER TABLE products
ADD COLUMN category product_category NOT NULL DEFAULT 'vape';