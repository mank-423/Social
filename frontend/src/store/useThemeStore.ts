import { create } from "zustand";
import type { ThemeStore } from "../types/store";

export const useThemeStore = create<ThemeStore>((set) => ({
    theme: localStorage.getItem('chat-theme') || 'forest',

    setTheme: (theme: string) => {
        localStorage.setItem('chat-theme', theme)
        set({theme: theme});
    }
}))