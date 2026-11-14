import { CartItem, CartTotals, ProductVariant, StoreConfig } from '../../types';

export class CartService {
  /**
   * Validates if a variant can be added to the cart given requested quantity and current cart state.
   */
  static validateVariantAddition(
    variant: ProductVariant,
    currentQuantityInCart: number,
    quantityToAdd: number
  ): { valid: boolean; message?: string } {
    if (!variant.availableForSale || variant.inventoryQuantity <= 0) {
      return { valid: false, message: 'This variant is currently out of stock.' };
    }

    if (currentQuantityInCart + quantityToAdd > variant.inventoryQuantity) {
      return {
        valid: false,
        message: `Only ${variant.inventoryQuantity} item(s) available in stock.`,
      };
    }

    return { valid: true };
  }

  /**
   * Computes totals including free shipping threshold and volume discount rules.
   */
  static calculateTotals(items: CartItem[], config: StoreConfig): CartTotals {
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const compareSubtotal = items.reduce((sum, item) => {
      const orig = item.compareAtPrice || item.price;
      return sum + orig * item.quantity;
    }, 0);

    const discount = Math.max(0, compareSubtotal - subtotal);
    const shipping = items.length === 0 || subtotal >= config.shippingThreshold ? 0 : config.standardShippingFee;
    const total = subtotal + shipping;
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

    return {
      subtotal,
      discount,
      shipping,
      total,
      itemCount,
    };
  }
}

