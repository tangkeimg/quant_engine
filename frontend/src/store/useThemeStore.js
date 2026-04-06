import { create } from 'zustand';

const useThemeStore = create((set) => ({
  theme: 'dark',
  toggleTheme: () => set((state) => {
    const nextTheme = state.theme === 'dark' ? 'light' : 'dark';
    document.body.setAttribute('theme-mode', nextTheme);
    return {
      theme: nextTheme
    }
  }),
}));
export default useThemeStore;