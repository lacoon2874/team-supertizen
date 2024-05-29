import { create } from "zustand";

interface tokenStoreState {
  token: string | null;
  setToken: (item: string) => void;
}

export const useTokenStore = create<tokenStoreState>((set) => ({
  token: "",
  setToken: (input) =>
    set(() => {
      return {
        token: input,
      };
    }),
}));
