import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CartItem, CartTotals, Product, ProductVariant, StoreId } from '../../types';
import { getStoreConfig } from '../../config/stores';

const getCartStorageKey = (storeId: StoreId) => `@ecommerce_cart_${storeId}`;

interface CartState {
  items: CartItem[];
  currentStoreId: StoreId;
  isLoading: boolean;

  // Actions
  addItem: (product: Product, variant: ProductVariant, quantity?: number) => Promise<boolean>;
  removeItem: (itemId: string) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  loadCart: (storeId: StoreId) => Promise<void>;

  // Calculated totals
  getTotals: () => CartTotals;
  getItemCount: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  currentStoreId: 'fitwear',
  isLoading: false,

  loadCart: async (storeId: StoreId) => {
    set({ isLoading: true, currentStoreId: storeId });
    try {
      const data = await AsyncStorage.getItem(getCartStorageKey(storeId));
      if (data) {
        const parsedItems: CartItem[] = JSON.parse(data);
        set({ items: parsedItems, isLoading: false });
      } else {
        set({ items: [], isLoading: false });
      }
    } catch (e) {
      console.error('Failed to load cart:', e);
      set({ items: [], isLoading: false });
    }
  },

  addItem: async (product: Product, variant: ProductVariant, quantity = 1) => {
    if (!variant.availableForSale || variant.inventoryQuantity <= 0) {
      return false;
    }

    const { items, currentStoreId } = get();
    const itemId = `${product.id}_${variant.id}`;
    const existingIndex = items.findIndex((i) => i.id === itemId);

    let updatedItems: CartItem[];

    if (existingIndex > -1) {
      const existing = items[existingIndex];
      const newQty = Math.min(existing.quantity + quantity, variant.inventoryQuantity);
      updatedItems = [...items];
      updatedItems[existingIndex] = {
        ...existing,
        quantity: newQty,
        price: variant.price,
      };
    } else {
      const newItem: CartItem = {
        id: itemId,
        productId: product.id,
        variantId: variant.id,
        productHandle: product.handle,
        title: product.title,
        variantTitle: variant.title,
        size: variant.size,
        color: variant.color,
        price: variant.price,
        compareAtPrice: variant.compareAtPrice,
        image: product.images[0] || '',
        quantity: Math.min(quantity, variant.inventoryQuantity),
        maxInventory: variant.inventoryQuantity,
      };
      updatedItems = [newItem, ...items];
    }

    set({ items: updatedItems });
    try {
      await AsyncStorage.setItem(getCartStorageKey(currentStoreId), JSON.stringify(updatedItems));
    } catch (e) {
      console.error('Failed to persist cart item:', e);
    }
    return true;
  },

  removeItem: async (itemId: string) => {
    const { items, currentStoreId } = get();
    const updated = items.filter((i) => i.id !== itemId);
    set({ items: updated });
    try {
      await AsyncStorage.setItem(getCartStorageKey(currentStoreId), JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to remove cart item:', e);
    }
  },

  updateQuantity: async (itemId: string, quantity: number) => {
    const { items, currentStoreId } = get();
    if (quantity <= 0) {
      await get().removeItem(itemId);
      return;
    }

    const updated = items.map((item) => {
      if (item.id === itemId) {
        return {
          ...item,
          quantity: Math.min(quantity, item.maxInventory),
        };
      }
      return item;
    });

    set({ items: updated });
    try {
      await AsyncStorage.setItem(getCartStorageKey(currentStoreId), JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to update cart quantity:', e);
    }
  },

  clearCart: async () => {
    const { currentStoreId } = get();
    set({ items: [] });
    try {
      await AsyncStorage.removeItem(getCartStorageKey(currentStoreId));
    } catch (e) {
      console.error('Failed to clear cart:', e);
    }
  },

  getTotals: () => {
    const { items, currentStoreId } = get();
    const config = getStoreConfig(currentStoreId);

    const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const compareSubtotal = items.reduce((acc, item) => {
      const original = item.compareAtPrice || item.price;
      return acc + original * item.quantity;
    }, 0);

    const discount = Math.max(0, compareSubtotal - subtotal);
    const shipping = items.length === 0 || subtotal >= config.shippingThreshold ? 0 : config.standardShippingFee;
    const total = subtotal + shipping;
    const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

    return {
      subtotal,
      discount,
      shipping,
      total,
      itemCount,
    };
  },

  getItemCount: () => {
    const { items } = get();
    return items.reduce((acc, item) => acc + item.quantity, 0);
  },
}));

