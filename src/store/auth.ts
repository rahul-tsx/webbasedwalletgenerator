import { create } from 'zustand';

interface AuthState {
	isAuthenticated: boolean;
	setAuthStatus: (status: boolean) => void;
	localPassword: string | null;
	setLocalPassword: (password: string) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
	isAuthenticated: false,
	setAuthStatus: (status) => set({ isAuthenticated: status }),
	localPassword: null,
	setLocalPassword: (password) => set({ localPassword: password }),
}));
