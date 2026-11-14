import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StoreConfig, StoreId } from '../../types';
import { STORE_CONFIGS, DEFAULT_STORE_ID, getStoreConfig } from '../../config/stores';

const STORE_STORAGE_KEY = '@ecommerce_active_store_id';

interface StoreConfigState {
  activeStoreId: StoreId;
  config: StoreConfig;
  isInitialized: boolean;
  switchStore: (storeId: StoreId) => Promise<void>;
  initializeStore: () => Promise<void>;
}

export const useStoreConfigStore = create<StoreConfigState>((set, get) => ({
  activeStoreId: DEFAULT_STORE_ID,
  config: STORE_CONFIGS[DEFAULT_STORE_ID],
  isInitialized: false,

  switchStore: async (storeId: StoreId) => {
    try {
      const config = getStoreConfig(storeId);
      await AsyncStorage.setItem(STORE_STORAGE_KEY, storeId);
      set({ activeStoreId: storeId, config });
    } catch (error) {
      console.error('Error saving active store:', error);
      const config = getStoreConfig(storeId);
      set({ activeStoreId: storeId, config });
    }
  },

  initializeStore: async () => {
    try {
      const savedStoreId = (await AsyncStorage.getItem(STORE_STORAGE_KEY)) as StoreId | null;
      if (savedStoreId && STORE_CONFIGS[savedStoreId]) {
        set({
          activeStoreId: savedStoreId,
          config: STORE_CONFIGS[savedStoreId],
          isInitialized: true,
        });
      } else {
        set({ isInitialized: true });
      }
    } catch (error) {
      console.error('Error loading active store:', error);
      set({ isInitialized: true });
    }
  },
}));

