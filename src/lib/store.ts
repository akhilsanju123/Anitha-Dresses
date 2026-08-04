'use client';

import { useSyncExternalStore } from 'react';
import { Product, CartItem, SizeOption } from '../types';

const CART_STORAGE_KEY = 'anitha_cart_v1';
const WISHLIST_STORAGE_KEY = 'anitha_wishlist_v1';
const RECENTLY_VIEWED_KEY = 'anitha_recently_viewed_v1';

export interface ShopState {
  cart: CartItem[];
  wishlist: string[];
  recentlyViewed: Product[];
  isCartOpen: boolean;
  quickViewProduct: Product | null;
  searchQuery: string;
  isSearchOpen: boolean;
}

// Initial state
let state: ShopState = {
  cart: [],
  wishlist: [],
  recentlyViewed: [],
  isCartOpen: false,
  quickViewProduct: null,
  searchQuery: '',
  isSearchOpen: false,
};

let listeners = new Set<() => void>();

function emitChange() {
  for (const listener of listeners) {
    listener();
  }
}

// Helper to initialize from localStorage safely on client
if (typeof window !== 'undefined') {
  try {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);
    if (savedCart) state.cart = JSON.parse(savedCart);

    const savedWishlist = localStorage.getItem(WISHLIST_STORAGE_KEY);
    if (savedWishlist) state.wishlist = JSON.parse(savedWishlist);

    const savedRecent = localStorage.getItem(RECENTLY_VIEWED_KEY);
    if (savedRecent) state.recentlyViewed = JSON.parse(savedRecent);
  } catch (e) {
    console.error("Error loading localStorage", e);
  }
}

function updateState(partial: Partial<ShopState>) {
  state = { ...state, ...partial };
  emitChange();
}

function updateCart(newCart: CartItem[]) {
  state = { ...state, cart: newCart };
  if (typeof window !== 'undefined') {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(newCart));
  }
  emitChange();
}

export const shopStore = {
  getSnapshot: () => state,
  subscribe: (listener: () => void) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },

  setIsCartOpen: (isOpen: boolean) => updateState({ isCartOpen: isOpen }),
  setQuickViewProduct: (prod: Product | null) => updateState({ quickViewProduct: prod }),
  setSearchQuery: (query: string) => updateState({ searchQuery: query }),
  setIsSearchOpen: (isOpen: boolean) => updateState({ isSearchOpen: isOpen }),

  addToCart: (product: Product, size: SizeOption, color: string, qty = 1) => {
    const existingIndex = state.cart.findIndex(
      (item) => item.product.id === product.id && item.selectedSize === size && item.selectedColor === color
    );

    let updated: CartItem[];
    if (existingIndex > -1) {
      updated = state.cart.map((item, idx) =>
        idx === existingIndex ? { ...item, quantity: item.quantity + qty } : item
      );
    } else {
      updated = [...state.cart, { product, selectedSize: size, selectedColor: color, quantity: qty }];
    }
    updateCart(updated);
    updateState({ isCartOpen: true });
  },

  removeFromCart: (index: number) => {
    const updated = state.cart.filter((_, i) => i !== index);
    updateCart(updated);
  },

  updateQuantity: (index: number, quantity: number) => {
    if (quantity <= 0) {
      shopStore.removeFromCart(index);
      return;
    }
    const updated = state.cart.map((item, idx) =>
      idx === index ? { ...item, quantity } : item
    );
    updateCart(updated);
  },

  clearCart: () => {
    updateCart([]);
  },

  toggleWishlist: (productId: string) => {
    const isWished = state.wishlist.includes(productId);
    const updated = isWished
      ? state.wishlist.filter((id) => id !== productId)
      : [...state.wishlist, productId];

    state = { ...state, wishlist: updated };
    if (typeof window !== 'undefined') {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(updated));
    }
    emitChange();
  },

  addRecentlyViewed: (product: Product) => {
    const filtered = state.recentlyViewed.filter((p) => p.id !== product.id);
    const updated = [product, ...filtered].slice(0, 10);
    state = { ...state, recentlyViewed: updated };
    if (typeof window !== 'undefined') {
      localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(updated));
    }
    emitChange();
  },
};

export function useShopStore() {
  const store = useSyncExternalStore(
    shopStore.subscribe,
    shopStore.getSnapshot,
    shopStore.getSnapshot
  );

  const cartSubtotal = store.cart.reduce(
    (acc, item) => acc + (item.product.offerPrice || item.product.price) * item.quantity,
    0
  );

  return {
    ...store,
    cartSubtotal,
    setIsCartOpen: shopStore.setIsCartOpen,
    setQuickViewProduct: shopStore.setQuickViewProduct,
    setSearchQuery: shopStore.setSearchQuery,
    setIsSearchOpen: shopStore.setIsSearchOpen,
    addToCart: shopStore.addToCart,
    removeFromCart: shopStore.removeFromCart,
    updateQuantity: shopStore.updateQuantity,
    clearCart: shopStore.clearCart,
    toggleWishlist: shopStore.toggleWishlist,
    addRecentlyViewed: shopStore.addRecentlyViewed,
  };
}
