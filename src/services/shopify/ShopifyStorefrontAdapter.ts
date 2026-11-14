import axios, { AxiosInstance } from 'axios';
import { Product, ProductVariant } from '../../types';
import {
  GET_PRODUCTS_QUERY,
  GET_PRODUCT_BY_HANDLE_QUERY,
  CART_CREATE_MUTATION,
  CART_LINES_ADD_MUTATION,
  CART_LINES_UPDATE_MUTATION,
  CART_LINES_REMOVE_MUTATION,
} from './shopifyOperations';

export interface ShopifyConfig {
  storeDomain: string;
  storefrontAccessToken: string;
  apiVersion?: string;
}

export interface ShopifyGraphQLResponse<T> {
  data?: T;
  errors?: Array<{ message: string; locations?: any; path?: any }>;
}

export class ShopifyStorefrontAdapter {
  private client: AxiosInstance;
  private config: ShopifyConfig;

  constructor(config: ShopifyConfig) {
    this.config = config;
    const apiVersion = config.apiVersion || '2024-07';
    this.client = axios.create({
      baseURL: `https://${config.storeDomain}/api/${apiVersion}/graphql.json`,
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': config.storefrontAccessToken,
      },
      timeout: 10000,
    });
  }

  /**
   * Generic GraphQL execution wrapper
   */
  async executeGraphQL<T>(query: string, variables?: Record<string, any>): Promise<T> {
    try {
      const response = await this.client.post<ShopifyGraphQLResponse<T>>('', {
        query,
        variables,
      });

      if (response.data.errors && response.data.errors.length > 0) {
        throw new Error(response.data.errors.map((e) => e.message).join(', '));
      }

      if (!response.data.data) {
        throw new Error('No data returned from Shopify GraphQL operation');
      }

      return response.data.data;
    } catch (error: any) {
      console.warn('[ShopifyAdapter] GraphQL execution note:', error.message);
      throw error;
    }
  }

  /**
   * 1. Fetch Products & map from Shopify schema to internal Product model
   */
  async fetchProducts(first = 20, query?: string): Promise<Product[]> {
    const rawData = await this.executeGraphQL<any>(GET_PRODUCTS_QUERY, { first, query });
    return rawData.products.edges.map((edge: any) => this.mapShopifyProduct(edge.node));
  }

  /**
   * 2. Fetch Product by handle
   */
  async fetchProductByHandle(handle: string): Promise<Product | null> {
    const rawData = await this.executeGraphQL<any>(GET_PRODUCT_BY_HANDLE_QUERY, { handle });
    if (!rawData.product) return null;
    return this.mapShopifyProduct(rawData.product);
  }

  /**
   * 3. Create a cart
   */
  async createCart(lines: Array<{ merchandiseId: string; quantity: number }>): Promise<any> {
    return this.executeGraphQL<any>(CART_CREATE_MUTATION, {
      input: {
        lines: lines.map((l) => ({ merchandiseId: l.merchandiseId, quantity: l.quantity })),
      },
    });
  }

  /**
   * 4. Add lines to cart
   */
  async addCartLines(cartId: string, lines: Array<{ merchandiseId: string; quantity: number }>): Promise<any> {
    return this.executeGraphQL<any>(CART_LINES_ADD_MUTATION, {
      cartId,
      lines,
    });
  }

  /**
   * 5. Update cart lines
   */
  async updateCartLines(cartId: string, lines: Array<{ id: string; quantity: number }>): Promise<any> {
    return this.executeGraphQL<any>(CART_LINES_UPDATE_MUTATION, {
      cartId,
      lines,
    });
  }

  /**
   * 6. Remove cart lines
   */
  async removeCartLines(cartId: string, lineIds: string[]): Promise<any> {
    return this.executeGraphQL<any>(CART_LINES_REMOVE_MUTATION, {
      cartId,
      lineIds,
    });
  }

  /**
   * Maps a Shopify GraphQL Product node into our internal Product TypeScript type
   */
  private mapShopifyProduct(node: any): Product {
    const images: string[] = (node.images?.edges || []).map((e: any) => e.node.url);
    const minPrice = parseFloat(node.priceRange?.minVariantPrice?.amount || '0');
    const comparePrice = node.compareAtPriceRange?.minVariantPrice?.amount
      ? parseFloat(node.compareAtPriceRange.minVariantPrice.amount)
      : undefined;

    const variants: ProductVariant[] = (node.variants?.edges || []).map((edge: any) => {
      const v = edge.node;
      const sizeOpt = v.selectedOptions?.find((o: any) => o.name.toLowerCase() === 'size')?.value || 'Standard';
      const colorOpt = v.selectedOptions?.find((o: any) => o.name.toLowerCase() === 'color')?.value || 'Default';

      return {
        id: v.id,
        title: v.title,
        sku: v.sku || v.id,
        size: sizeOpt,
        color: colorOpt,
        price: parseFloat(v.price.amount),
        compareAtPrice: v.compareAtPrice ? parseFloat(v.compareAtPrice.amount) : undefined,
        availableForSale: v.availableForSale ?? true,
        inventoryQuantity: v.quantityAvailable ?? 10,
      };
    });

    return {
      id: node.id,
      title: node.title,
      description: node.description || '',
      handle: node.handle,
      category: node.productType || 'general',
      images: images.length > 0 ? images : ['https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80'],
      price: minPrice,
      compareAtPrice: comparePrice,
      currency: node.priceRange?.minVariantPrice?.currencyCode || 'INR',
      rating: 4.8,
      reviewCount: 45,
      tags: node.tags || [],
      variants,
      availableForSale: node.availableForSale ?? true,
    };
  }
}

