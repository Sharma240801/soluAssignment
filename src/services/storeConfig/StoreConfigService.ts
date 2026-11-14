import { StoreConfig, StoreId } from '../../types';
import { STORE_CONFIGS, DEFAULT_STORE_ID, getStoreConfig } from '../../config/stores';

export class StoreConfigService {
  static getStore(storeId: StoreId): StoreConfig {
    return getStoreConfig(storeId);
  }

  static getAllStores(): StoreConfig[] {
    return Object.values(STORE_CONFIGS);
  }

  static getDefaultStoreId(): StoreId {
    return DEFAULT_STORE_ID;
  }
}

