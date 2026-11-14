import { Product } from '../../types';
import { FITWEAR_PRODUCTS } from './fitwearProducts';
import { URBANFIT_PRODUCTS } from './urbanfitProducts';

export * from './fitwearProducts';
export * from './urbanfitProducts';

export const STORE_PRODUCTS_MAP: Record<string, Product[]> = {
  fitwear: FITWEAR_PRODUCTS,
  urbanfit: URBANFIT_PRODUCTS,
};

