import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Coupon } from '@/lib/coupons';

// Version control for cart data - increment this when cart structure changes
const CART_VERSION = 4;

export interface Customization {
  id: string;
  name: string;
  price: number;
  type: 'extra' | 'removal' | 'choice';
}

export interface CartItem {
  cartItemId: string; // Unique identifier for item + customizations combo
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  isVeg: boolean;
  isAvailable: boolean;
  quantity: number;
  customizations?: Customization[];
}

interface CartStore {
  items: CartItem[];
  version: number;
  appliedCoupon: Coupon | null;
  discountAmount: number;

  addItem: (item: Omit<CartItem, 'quantity' | 'cartItemId'>, customizations?: Customization[]) => void;
  removeItem: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;

  setAppliedCoupon: (coupon: Coupon | null, discount: number) => void;

  getTotalItems: () => number;
  getTotalPrice: () => number;
  getSubtotal: () => number;
  getDeliveryFee: () => number;
  getTax: () => number;
  getDiscount: () => number;
  getGrandTotal: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      version: CART_VERSION,
      appliedCoupon: null,
      discountAmount: 0,

      addItem: (item, customizations = []) => {
        set((state) => {
          // Generate a unique ID for this combo based on item ID and sorted customization IDs
          const customIds = [...customizations].sort((a, b) => a.id.localeCompare(b.id)).map(c => c.id).join(',');
          const cartItemId = `${item.id}-${customIds}`;

          const existingItem = state.items.find((i) => i.cartItemId === cartItemId);

          let newItems;
          if (existingItem) {
            newItems = state.items.map((i) =>
              i.cartItemId === cartItemId
                ? { ...i, quantity: i.quantity + 1 }
                : i
            );
          } else {
            // Calculate item price with customizations
            const customizationPrice = customizations.reduce((acc, c) => acc + c.price, 0);
            newItems = [...state.items, { ...item, cartItemId, customizations, price: item.price + customizationPrice, quantity: 1 }];
          }

          // Invalidate coupon if new items make it ineligible (though adding usually helps)
          return { items: newItems };
        });
      },

      removeItem: (cartItemId) => {
        set((state) => {
          const newItems = state.items.filter((item) => item.cartItemId !== cartItemId);
          // If cart is empty, clear coupon
          if (newItems.length === 0) {
            return { items: newItems, appliedCoupon: null, discountAmount: 0 };
          }
          return { items: newItems };
        });
      },

      updateQuantity: (cartItemId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(cartItemId);
          return;
        }

        set((state) => ({
          items: state.items.map((item) =>
            item.cartItemId === cartItemId ? { ...item, quantity } : item
          ),
        }));
      },

      clearCart: () => {
        set({ items: [], appliedCoupon: null, discountAmount: 0 });
      },

      setAppliedCoupon: (coupon, discount) => {
        set({ appliedCoupon: coupon, discountAmount: discount });
      },

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getTotalPrice: () => {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
      },

      getSubtotal: () => {
        return get().getTotalPrice();
      },

      getDeliveryFee: () => {
        const subtotal = get().getSubtotal();
        return subtotal >= 200 ? 0 : 30; // Free delivery above Rs 200
      },

      getTax: () => {
        const subtotal = get().getSubtotal();
        return Math.round(subtotal * 0.05 * 100) / 100; // 5% tax
      },

      getDiscount: () => {
        return get().discountAmount;
      },

      getGrandTotal: () => {
        const subtotal = get().getSubtotal();
        const deliveryFee = get().getDeliveryFee();
        const tax = get().getTax();
        const discount = get().getDiscount();
        return Math.max(0, subtotal + deliveryFee + tax - discount);
      },
    }),
    {
      name: 'tummy-tikki-cart',
      version: CART_VERSION,
      migrate: (persistedState: any, version: number) => {
        if (version !== CART_VERSION) {
          return {
            items: [],
            appliedCoupon: null,
            discountAmount: 0,
            version: CART_VERSION,
          };
        }
        return persistedState;
      },
    }
  )
);
