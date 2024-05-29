import { create } from "zustand";

interface SelectedDateState {
  selectedDate: string | null;
  selectedKeyword: string | null;
  title: string | null;
  setSelectedDate: (item: string) => void;
  setSelectedKeyword: (item: string) => void;
  setTitle: (item: string) => void;
}

export const useSelectedDateStore = create<SelectedDateState>((set) => ({
  selectedDate: "",
  selectedKeyword: "",
  title: "",
  setSelectedDate: (input) =>
    set(() => {
      return {
        selectedDate: input,
      };
    }),
  setSelectedKeyword: (input) => {
    localStorage.setItem("schedule", input);
    return set(() => {
      return {
        selectedKeyword: input,
        
      };
    })},
  setTitle: (input) =>
    set(() => {
      return {
        title: input,
      };
    }),
}));
