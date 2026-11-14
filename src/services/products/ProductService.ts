import { Product, ProductFilterOptions, ProductSortOption, StoreId } from '../../types';
import { STORE_PRODUCTS_MAP } from '../../data/products';

export class ProductService {
  /**
   * Fetches all products for a store, with optional filtering and sorting.
   * Simulates an async network delay for realism with TanStack Query.
   */
  static async getProducts(
    storeId: StoreId,
    filters?: ProductFilterOptions,
    sortBy?: ProductSortOption
  ): Promise<Product[]> {
    await new Promise((resolve) => setTimeout(resolve, 250));

    let list = [...(STORE_PRODUCTS_MAP[storeId] || [])];

    if (filters) {
      if (filters.category && filters.category.toLowerCase() !== 'all') {
        const cat = filters.category.toLowerCase();
        list = list.filter(
          (p) =>
            p.category.toLowerCase() === cat ||
            p.tags.some((t) => t.toLowerCase() === cat)
        );
      }

      if (filters.minPrice !== undefined) {
        list = list.filter((p) => p.price >= filters.minPrice!);
      }

      if (filters.maxPrice !== undefined) {
        list = list.filter((p) => p.price <= filters.maxPrice!);
      }

      if (filters.size) {
        const s = filters.size.toUpperCase();
        list = list.filter((p) =>
          p.variants.some((v) => v.size.toUpperCase() === s && v.availableForSale)
        );
      }

      if (filters.inStockOnly) {
        list = list.filter((p) => p.availableForSale);
      }
    }

    if (sortBy) {
      switch (sortBy) {
        case 'price-asc':
          list.sort((a, b) => a.price - b.price);
          break;
        case 'price-desc':
          list.sort((a, b) => b.price - a.price);
          break;
        case 'newest':
          list.sort((a, b) => (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0));
          break;
        case 'best-selling':
          list.sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0));
          break;
        case 'featured':
        default:
          list.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
          break;
      }
    }

    return list;
  }

  static async getProductById(storeId: StoreId, id: string): Promise<Product | null> {
    await new Promise((resolve) => setTimeout(resolve, 150));
    const list = STORE_PRODUCTS_MAP[storeId] || [];
    return list.find((p) => p.id === id) || null;
  }

  static async getProductByHandle(storeId: StoreId, handle: string): Promise<Product | null> {
    await new Promise((resolve) => setTimeout(resolve, 150));
    const list = STORE_PRODUCTS_MAP[storeId] || [];
    return list.find((p) => p.handle === handle) || null;
  }

  static async getFeaturedProducts(storeId: StoreId): Promise<Product[]> {
    const list = await this.getProducts(storeId);
    return list.filter((p) => p.isFeatured).slice(0, 6);
  }

  static async getNewArrivals(storeId: StoreId): Promise<Product[]> {
    const list = await this.getProducts(storeId);
    return list.filter((p) => p.isNewArrival || p.isFeatured).slice(0, 6);
  }

  static async getBestSellers(storeId: StoreId): Promise<Product[]> {
    const list = await this.getProducts(storeId);
    return list.filter((p) => p.isBestSeller).slice(0, 6);
  }

  static async getRelatedProducts(
    storeId: StoreId,
    currentProductId: string,
    category: string
  ): Promise<Product[]> {
    const list = await this.getProducts(storeId);
    return list
      .filter((p) => p.id !== currentProductId && (p.category === category || p.tags.includes(category)))
      .slice(0, 4);
  }

  static async searchProducts(storeId: StoreId, query: string): Promise<Product[]> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const q = query.trim().toLowerCase();
    if (!q) return [];

    const list = STORE_PRODUCTS_MAP[storeId] || [];
    return list.filter((p) => {
      const titleMatch = p.title.toLowerCase().includes(q);
      const descMatch = p.description.toLowerCase().includes(q);
      const catMatch = p.category.toLowerCase().includes(q);
      const tagMatch = p.tags.some((t) => t.toLowerCase().includes(q));
      return titleMatch || descMatch || catMatch || tagMatch;
    });
  }
}

