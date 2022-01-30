import {ReactNode, useContext, createContext, useLayoutEffect} from "react";
import create from "zustand";
import {GameMode} from "./types";

const activeThemeContext = createContext<GameMode | null>(null);

type ReadHeaderStoreState = {mode: GameMode | null; headerElement: ReactNode};

export const useHeaderSlotStore = create<
  ReadHeaderStoreState & {set: (state: ReadHeaderStoreState) => void}
>((set) => ({
  mode: null,
  headerElement: null,
  set,
}));

export const ActiveThemeProvider = ({
  activeTheme,
  children,
}: {
  activeTheme: GameMode | null;
  children: ReactNode;
}) => <activeThemeContext.Provider value={activeTheme}>{children}</activeThemeContext.Provider>;

export const HeaderSlot = ({children}: {children: ReactNode}) => {
  const isActive = useContext(activeThemeContext);
  const set = useHeaderSlotStore().set;
  useLayoutEffect(() => {
    if (isActive) {
      set({mode: isActive, headerElement: children});
      return () => set({mode: null, headerElement: null});
    }
  }, [children, isActive]);
  return null;
};
