import { create } from "zustand";
import type { ThemeStore } from "../types/store";

export const useThemeStore = create<ThemeStore>((set) => ({
    theme: localStorage.getItem('char-theme') || 'light',

    setTheme: (theme: string) => {
        localStorage.setItem('chat-theme', theme)
        set({theme: theme});
    }
}))