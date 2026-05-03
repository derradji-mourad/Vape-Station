-- Change image_url to image_urls array to support multiple images
ALTER TABLE public.products 
DROP COLUMN IF EXISTS image_url;

ALTER TABLE public.products 
ADD COLUMN image_urls text[] DEFAULT '{}';

-- Update the column to be not null with a default empty array
ALTER TABLE public.products 
ALTER COLUMN image_urls SET NOT NULL;