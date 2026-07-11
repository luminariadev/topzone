-- Migration: Product Images Table
-- Fase 4.4: Image & Media Management
-- Supports: image upload, gallery, alt text, captions, drag-sort reordering, primary image

CREATE TABLE IF NOT EXISTS product_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  storage_path TEXT,
  alt_text TEXT DEFAULT '',
  caption TEXT DEFAULT '',
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_primary BOOLEAN NOT NULL DEFAULT false,
  width INTEGER,
  height INTEGER,
  file_size INTEGER,
  mime_type TEXT,
  created_by TEXT NOT NULL DEFAULT 'system',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_product_images_product ON product_images(product_id);
CREATE INDEX IF NOT EXISTS idx_product_images_sort ON product_images(product_id, sort_order);
CREATE INDEX IF NOT EXISTS idx_product_images_primary ON product_images(product_id, is_primary);

-- RLS Policies
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;

-- Public read for published products
CREATE POLICY "Public can view images of published products"
  ON product_images FOR SELECT
  TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1 FROM products
      WHERE products.id = product_images.product_id
        AND products.status = 'published'
        AND products.is_deleted = false
    )
  );

-- Admin can manage all images
CREATE POLICY "Admins can manage product images"
  ON product_images FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin' OR auth.jwt() ->> 'role' = 'super_admin' OR auth.jwt() ->> 'role' = 'staff')
  WITH CHECK (auth.jwt() ->> 'role' = 'admin' OR auth.jwt() ->> 'role' = 'super_admin' OR auth.jwt() ->> 'role' = 'staff');

-- Trigger to update updated_at
CREATE OR REPLACE FUNCTION update_product_images_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END $$;

DROP TRIGGER IF EXISTS trigger_product_images_updated_at ON product_images;
CREATE TRIGGER trigger_product_images_updated_at
  BEFORE UPDATE ON product_images
  FOR EACH ROW EXECUTE FUNCTION update_product_images_updated_at();

-- Ensure only one primary image per product
CREATE OR REPLACE FUNCTION enforce_single_primary_image()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.is_primary THEN
    UPDATE product_images
    SET is_primary = false
    WHERE product_id = NEW.product_id
      AND id != NEW.id;
  END IF;
  RETURN NEW;
END $$;

DROP TRIGGER IF EXISTS trigger_single_primary_image ON product_images;
CREATE TRIGGER trigger_single_primary_image
  BEFORE INSERT OR UPDATE ON product_images
  FOR EACH ROW EXECUTE FUNCTION enforce_single_primary_image();

-- Storage bucket policy for product images
-- Run this in Supabase Dashboard > Storage > Policies or via SQL:
-- INSERT INTO storage.buckets (id, name, public) VALUES ('product-images', 'product-images', true)
-- ON CONFLICT (id) DO UPDATE SET public = true