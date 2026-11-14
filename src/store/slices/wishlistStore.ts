import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Product, StoreId } from '../../types';

const getWishlistKey = (storeId: StoreId) => `@ecommerce_wishlist_${storeId}`;

interface WishlistState {
  items: Product[];
  currentStoreId: StoreId;
  isLoading: boolean;

  loadWishlist: (storeId: StoreId) => Promise<void>;
  toggleWishlist: (product: Product) => Promise<boolean>;
  removeFromWishlist: (productId: string) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => Promise<void>;
}

export const useWishlistStore = create<WishlistState>((set, get) => ({
  items: [],
  currentStoreId: 'fitwear',
  isLoading: false,

  loadWishlist: async (storeId: StoreId) => {
    set({ isLoading: true, currentStoreId: storeId });
    try {
      const data = await AsyncStorage.getItem(getWishlistKey(storeId));
      if (data) {
        set({ items: JSON.parse(data), isLoading: false });
      } else {
        set({ items: [], isLoading: false });
      }
    } catch (e) {
      console.error('Failed to load wishlist:', e);
      set({ items: [], isLoading: false });
    }
  },

  toggleWishlist: async (product: Product) => {
    const { items, currentStoreId } = get();
    const exists = items.some((p) => p.id === product.id);

    let updated: Product[];
    let added = false;

    if (exists) {
      updated = items.filter((p) => p.id !== product.id);
    } else {
      updated = [product, ...items];
      added = true;
    }

    set({ items: updated });
    try {
      await AsyncStorage.setItem(getWishlistKey(currentStoreId), JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save wishlist:', e);
    }
    return added;
  },

  removeFromWishlist: async (productId: string) => {
    const { items, currentStoreId } = get();
    const updated = items.filter((p) => p.id !== productId);
    set({ items: updated });
    try {
      await AsyncStorage.setItem(getWishlistKey(currentStoreId), JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to remove from wishlist:', e);
    }
  },

  isInWishlist: (productId: string) => {
    return get().items.some((p) => p.id === productId);
  },

  clearWishlist: async () => {
    const { currentStoreId } = get();
    set({ items: [] });
    try {
      await AsyncStorage.removeItem(getWishlistKey(currentStoreId));
    } catch (e) {
      console.error('Failed to clear wishlist:', e);
    }
  },
}));

