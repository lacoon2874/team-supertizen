import { create } from "zustand";
import { SimpleClothesResponseDataType } from "@/types/ClothesTypes";

interface SelectedItem {
  id: string;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  url: string;
}

interface SelectedItemsState {
  selectedItems: SelectedItem[];
  toggleItem: (item: SimpleClothesResponseDataType) => void;
  clearItems: () => void;
  confirmOutfit: string;
  setConfirmOutfit: (item: string) => void;
}

export const useSelectedItemsStore = create<SelectedItemsState>((set) => ({
  selectedItems: [],
  toggleItem: (item) =>
    set((state) => {
      const isSelected = state.selectedItems.some(
        (selectedItem) => Number(selectedItem.id) === item.clothingId
      );

      if (isSelected) {
        return {
          selectedItems: state.selectedItems.filter(
            (selectedItem) => Number(selectedItem.id) !== item.clothingId
          ),
        };
      } else {
        const newItem = {
          id: item.clothingId.toString(),
          name: item.clothingId.toString(),
          width: 160,
          height: 160,
          url: item.clothingImagePath,
          x: Math.floor(Math.random() * (250 - 10 + 1)) + 10,
          y: Math.floor(Math.random() * (250 - 10 + 1)) + 10,
        };
        return {
          selectedItems: [...state.selectedItems, newItem],
        };
      }
    }),
  clearItems: () =>
    set(() => {
      return {
        selectedItems: [],
      };
    }),
  confirmOutfit: "",
  setConfirmOutfit: (input) =>
    set(() => {
      return {
        confirmOutfit: input,
      };
    }),
}));
