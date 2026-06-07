import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  token: null,

  loginSuccess: (token) => set({ 
    token: token, 
  }),


  logout: () => set({ token: null })
}));