// src/types/product.ts
// Shared types for products and product images

/**
 * ProductImage represents a single image associated with a product.
 * Maps to the product_images table in Supabase.
 */
export interface ProductImage {
  id: string;
  product_id: string;
  image_url: string;
  alt_text: string;
  caption?: string;
  sort_order: number;
  is_primary: boolean;
  width?: number;
  height?: number;
  file_size?: number;
  mime_type?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}