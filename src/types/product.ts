export interface ProductVariant {
  id: string;
  title: string;
  sku: string;
  size: string;
  color: string;
  price: number;
  compareAtPrice?: number;
  availableForSale: boolean;
  inventoryQuantity: number;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  handle: string;
  category: string;
  images: string[];
  price: number;
  compareAtPrice?: number;
  currency: string;
  rating: number;
  reviewCount: number;
  tags: string[];
  variants: ProductVariant[];
  availableForSale: boolean;
  isFeatured?: boolean;
  isNewArrival?: boolean;
  isBestSeller?: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  itemCount?: number;
}

export type ProductSortOption =
  | 'featured'
  | 'price-asc'
  | 'price-desc'
  | 'newest'
  | 'best-selling';

export interface ProductFilterOptions {
  category?: string;
  size?: string;
  color?: string;
  minPrice?: number;
  maxPrice?: number;
  inStockOnly?: boolean;
}

