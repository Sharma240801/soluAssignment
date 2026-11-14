import { StoreConfig, StoreId } from '../../types';
import { FITWEAR_CONFIG } from './fitwear.config';
import { URBANFIT_CONFIG } from './urbanfit.config';

export const STORE_CONFIGS: Record<StoreId, StoreConfig> = {
  fitwear: FITWEAR_CONFIG,
  urbanfit: URBANFIT_CONFIG,
};

export const DEFAULT_STORE_ID: StoreId = 'fitwear';

export function getStoreConfig(storeId: StoreId): StoreConfig {
  return STORE_CONFIGS[storeId] || STORE_CONFIGS[DEFAULT_STORE_ID];
}

export * from './fitwear.config';
export * from './urbanfit.config';

