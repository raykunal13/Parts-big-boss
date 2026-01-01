import { useSyncExternalStore } from 'react';
import { UserVehicle } from '../types/vehicle'; // Import the new type

// Types
interface User {
  id: string;
  name?: string;
  email: string;
  type: 'customer' | 'merchant';
  token?: string;
  phone?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  activeAuthTab: 'customer' | 'merchant';
  
  // NEW: Vehicle State
  userGarage: UserVehicle[];
  activeVehicle: UserVehicle | null;
}

// Initial State
let authState: AuthState = {
  user: null,
  isAuthenticated: false,
  activeAuthTab: 'customer',
  userGarage: [],
  activeVehicle: null,
};

// Hydrate: Now accepts vehicles too
export const hydrate = (user: User | null, garage: UserVehicle[] = []) => {
  const activeCar = garage.find(v => v.is_active) || null;

  authState = {
    ...authState,
    user,
    isAuthenticated: !!user,
    userGarage: garage,
    activeVehicle: activeCar,
  };
  emitChange();
};

const listeners = new Set<() => void>();

// Store Implementation
export const authStore = {
  get: () => authState,
  
  setAuthTab: (tab: 'customer' | 'merchant') => {
    authState = { ...authState, activeAuthTab: tab };
    emitChange();
  },

  login: (user: User) => {
    authState = {
      ...authState,
      user,
      isAuthenticated: true,
      // On fresh login, garage is empty until fetched
      userGarage: [],
      activeVehicle: null,
    };
    emitChange();
  },

  logout: () => {
    authState = {
      ...authState,
      user: null,
      isAuthenticated: false,
      userGarage: [],
      activeVehicle: null,
    };
    emitChange();
  },

  // NEW: Vehicle Actions
  setGarage: (garage: UserVehicle[]) => {
    const activeCar = garage.find(v => v.is_active) || null;
    authState = {
      ...authState,
      userGarage: garage,
      activeVehicle: activeCar
    };
    emitChange();
  },

  switchActiveVehicle: (vehicleId: number) => {
    // 1. Update the list locally to reflect the switch
    const updatedGarage = authState.userGarage.map(v => ({
        ...v,
        is_active: v.id === vehicleId
    }));
    
    // 2. Set the active object
    const newActive = updatedGarage.find(v => v.id === vehicleId) || null;

    authState = {
        ...authState,
        userGarage: updatedGarage,
        activeVehicle: newActive
    };
    emitChange();
  },

  subscribe: (listener: () => void) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  }
};

// Helper
function emitChange() {
  for (const listener of listeners) {
    listener();
  }
}

// Server Snapshot
const serverSnapshot: AuthState = {
  user: null,
  isAuthenticated: false,
  activeAuthTab: 'customer',
  userGarage: [],
  activeVehicle: null,
};

const getServerSnapshot = (): AuthState => serverSnapshot;

// Hook
export function useAuthStore() {
  return useSyncExternalStore(authStore.subscribe, authStore.get, getServerSnapshot);
}