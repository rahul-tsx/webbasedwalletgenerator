import { create } from 'zustand';


interface AuthState {
	isAuthenticated: boolean;
	setAuthStatus: (status: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
	isAuthenticated: false,
	setAuthStatus: (status) => set({ isAuthenticated: status }),
}));
