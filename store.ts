// store.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Category = 'Vegetables' | 'Fruits' | 'Dairy';

interface User {
  id: string;
  name: string;
  email: string;
  location: string;
  role: 'buyer' | 'farmer';
}

interface Product {
  id: string;
  name: string;
  category: Category;
  price: number;
  unit: string;
  quantity: number;
  description: string;
  image: string;
  farmerId: string;
  farmerName: string;
  location: string;
}

interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
  timestamp: string;
}

interface Order {
  id: string;
  buyerId: string;
  items: (Product & { cartQuantity: number })[];
  total: number;
  status: 'pending' | 'delivered';
  date: string;
}

interface CartItem extends Product {
  cartQuantity: number;
}

interface AppState {
  user: User | null;
  products: Product[];
  messages: Message[];
  orders: Order[];
  cart: CartItem[];
  offlineOrders: Order[];

  login: (role: 'buyer' | 'farmer', name: string) => void;
  logout: () => void;
  addProduct: (product: Omit<Product, 'id'>) => void;
  deleteProduct: (id: string) => void;
  updateProduct: (id: string, product: Product) => void;
  addToCart: (product: Product) => void;
  removeFromCart: (id: string) => void;
  placeOrder: () => void;
  syncOfflineOrders: () => void;
  sendMessage: (receiverId: string, text: string) => void;
  updateOrderStatus: (orderId: string, status: 'pending' | 'delivered') => void;
  reorderItems: (items: CartItem[]) => void;
  updateUser: (user: User) => void;
}

const initialProducts: Product[] = [
  {
    id: '1',
    name: 'Organic Carrots',
    category: 'Vegetables',
    price: 2.5,
    unit: 'kg',
    quantity: 100,
    description: 'Freshly harvested organic carrots.',
    image: 'https://picsum.photos/400/400?random=1',
    farmerId: 'farmer1',
    farmerName: 'Green Valley Farm',
    location: 'Local Farm',
  },
  {
    id: '2',
    name: 'Ripe Tomatoes',
    category: 'Vegetables',
    price: 3.0,
    unit: 'kg',
    quantity: 80,
    description: 'Sun-ripened tomatoes for your salads.',
    image: 'https://picsum.photos/400/400?random=2',
    farmerId: 'farmer1',
    farmerName: 'Green Valley Farm',
    location: 'Local Farm',
  },
  {
    id: '3',
    name: 'Fresh Milk',
    category: 'Dairy',
    price: 1.5,
    unit: 'liter',
    quantity: 50,
    description: 'Cold, fresh milk from our happy cows.',
    image: 'https://picsum.photos/400/400?random=3',
    farmerId: 'farmer2',
    farmerName: 'Hilltop Dairy',
    location: 'Local Farm',
  },
];

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: null,
      products: initialProducts,
      messages: [],
      orders: [],
      cart: [],
      offlineOrders: [],

      login: (role, name) => {
        const user: User = {
          id: Math.random().toString(36).substr(2, 9),
          name,
          email: `${name.toLowerCase().replace(/\s+/g, '.')}@farmconnect.com`,
          location: 'Local Area',
          role,
        };
        set({ user });
      },

      logout: () => set({ user: null, cart: [] }),

      addProduct: (product) => {
        const newProduct = {
          ...product,
          id: Math.random().toString(36).substr(2, 9),
        };
        set((state) => ({ products: [...state.products, newProduct] }));
      },

      deleteProduct: (id) =>
        set((state) => ({ products: state.products.filter((p) => p.id !== id) })),

      updateProduct: (id, product) =>
        set((state) => ({
          products: state.products.map((p) => (p.id === id ? { ...product, id } : p)),
        })),

      addToCart: (product) => {
        set((state) => {
          const existing = state.cart.find((item) => item.id === product.id);
          if (existing) {
            return {
              cart: state.cart.map((item) =>
                item.id === product.id
                  ? { ...item, cartQuantity: item.cartQuantity + 1 }
                  : item
              ),
            };
          } else {
            return {
              cart: [...state.cart, { ...product, cartQuantity: 1 }],
            };
          }
        });
      },

      removeFromCart: (id) => {
        set((state) => {
          const item = state.cart.find((i) => i.id === id);
          if (item && item.cartQuantity > 1) {
            return {
              cart: state.cart.map((i) =>
                i.id === id ? { ...i, cartQuantity: i.cartQuantity - 1 } : i
              ),
            };
          } else {
            return {
              cart: state.cart.filter((i) => i.id !== id),
            };
          }
        });
      },

      placeOrder: () => {
        const { user, cart } = get();
        if (!user || cart.length === 0) return;
        
        const total = cart.reduce((sum, item) => sum + item.price * item.cartQuantity, 0);
        const newOrder: Order = {
          id: Math.random().toString(36).substr(2, 9),
          buyerId: user.id,
          items: [...cart],
          total,
          status: 'pending',
          date: new Date().toISOString(),
        };
        
        // Mock network check (replace with NetInfo in production)
        const isOnline = true;
        
        if (isOnline) {
          set((state) => ({ orders: [...state.orders, newOrder], cart: [] }));
        } else {
          set((state) => ({ 
            offlineOrders: [...state.offlineOrders, newOrder], 
            cart: [] 
          }));
        }
      },

      syncOfflineOrders: () => {
        // In production: sync with backend when online
        set((state) => ({ offlineOrders: [] }));
      },

      sendMessage: (receiverId, text) => {
        const { user } = get();
        if (!user) return;
        const newMessage: Message = {
          id: Math.random().toString(36).substr(2, 9),
          senderId: user.id,
          receiverId,
          text,
          timestamp: new Date().toISOString(),
        };
        set((state) => ({ messages: [...state.messages, newMessage] }));
      },

      updateOrderStatus: (orderId, status) =>
        set((state) => ({
          orders: state.orders.map((order) =>
            order.id === orderId ? { ...order, status } : order
          ),
        })),

      reorderItems: (items) =>
        set((state) => {
          const newCart = [...state.cart];
          items.forEach((item) => {
            const existing = newCart.find((i) => i.id === item.id);
            if (existing) {
              existing.cartQuantity += item.cartQuantity;
            } else {
              newCart.push({ ...item });
            }
          });
          return { cart: newCart };
        }),

      updateUser: (user) =>
        set({ user }),
    }),
    {
      name: 'farmconnect-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ cart: state.cart }),
    }
  )
);