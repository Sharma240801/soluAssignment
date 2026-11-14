export interface CartItem {
  id: string; // unique item id in cart (usually `${productId}_${variantId}`)
  productId: string;
  variantId: string;
  productHandle: string;
  title: string;
  variantTitle: string;
  size: string;
  color: string;
  price: number;
  compareAtPrice?: number;
  image: string;
  quantity: number;
  maxInventory: number;
}

export interface CartTotals {
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  itemCount: number;
}

