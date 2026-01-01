import { useSyncExternalStore } from 'react';

// Store state
let cartCount = 0;
const listeners = new Set<() => void>();

// Store object
export const cartStore = {
  get: () => cartCount,
  increment: () => {
    cartCount += 1;
    emitChange();
  },
  decrement: () => {
    if (cartCount > 0) {
      cartCount -= 1;
      emitChange();
    }
  },
  reset: () => {
    cartCount = 0;
    emitChange();
  },
  subscribe: (listener: () => void) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  }
};

// Helper function
function emitChange() {
  for (const listener of listeners) {
    listener();
  }
}

// Server snapshot
const getServerSnapshot = () => 0;

// Hook
export function useCartCount() {
  return useSyncExternalStore(cartStore.subscribe, cartStore.get, getServerSnapshot);
}
