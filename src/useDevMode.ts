import create from "zustand";

const useDevModeStore = create<{devMode: boolean; setDevMode: (val: boolean) => void}>((set) => ({
  devMode: (process as any).env.NODE_ENV === "development",
  setDevMode: (val) => set({devMode: val}),
}));

export const useDevMode = () => useDevModeStore().devMode;

export const useSetDevMode = () => useDevModeStore().setDevMode;
