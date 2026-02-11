import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Version control for cart data - increment this when cart structure changes
const CART_VERSION = 2;

export interface CartItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  isVeg: boolean;
  isAvailable: boolean;
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  version: number;
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  getSubtotal: () => number;
  getDeliveryFee: () => number;
  getTax: () => number;
  getGrandTotal: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      version: CART_VERSION,

      addItem: (item) => {
        set((state) => {
          const existingItem = state.items.find((i) => i.id === item.id);

          if (existingItem) {
            return {
              items: state.items.map((i) =>
                i.id === item.id
                  ? { ...i, quantity: i.quantity + 1 }
                  : i
              ),
            };
          } else {
            return {
              items: [...state.items, { ...item, quantity: 1 }],
            };
          }
        });
      },

      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }));
      },

      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id);
          return;
        }

        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, quantity } : item
          ),
        }));
      },

      clearCart: () => {
        set({ items: [] });
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

      getGrandTotal: () => {
        const subtotal = get().getSubtotal();
        const deliveryFee = get().getDeliveryFee();
        const tax = get().getTax();
        return subtotal + deliveryFee + tax;
      },
    }),
    {
      name: 'tummy-tikki-cart',
      version: CART_VERSION,
      migrate: (persistedState: any, version: number) => {
        // If the persisted state is from an older version, clear the cart
        if (version !== CART_VERSION) {
          console.log(`Migrating cart from version ${version} to ${CART_VERSION} - clearing old data`);
          return {
            items: [],
            version: CART_VERSION,
          };
        }
        return persistedState;
      },
    }
  )
);
