// Code to create a store with Zustand
import { create } from 'zustand';

interface StoreState {
    activeComponent: String;
    setActiveComponent: (component: String) => void;
    user: {
        id: 0,
        name: "",
        email: "",
        phone: "",
        balances: {
            Bitcoin: 0,
            Ethereum: 0,
            Usdt: 0,
            Usdc: 0,
        }
    }
    setUser: (user: User) => void
    activeAdminComponent: String
    setActiveAdminComponent: (component: String) => void
    adminUser: {
        id: 0,
        name: "",
        email: "",
    }
    setAdminUser: (user: User) => void

}

interface CoinBalance {
    Bitcoin: number,
    Ethereum: number,
    Usdt: number,
    Usdc: number,
}

interface User {
    id: number,
    name: string,
    email: string,
    phone: string,
    balances: CoinBalance
}

interface AdminUser {
    id: number,
    name: string,
    email: string,
}

// Create a store with an activeComponent state and a setActiveComponent function to update it
export const useStore = create<StoreState>((set) => ({
    activeComponent: "Overview",
    setActiveComponent: (component: String) => set({ activeComponent: component }),
    user: {} as User,
    setUser: (user: User) => set({user}),
    activeAdminComponent: "Dashboard",
    setActiveAdminComponent: (component: String) => set({activeAdminComponent: component}),
    adminUser: {} as AdminUser,
    setAdminUser: (user: AdminUser) => set({adminUser: user})
}));

