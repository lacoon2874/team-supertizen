import {create} from 'zustand';

interface Clothes {
  clothingId: number,
  clothingImagePath: string,
  clothingName: string,
}


interface CurrentClothesState {
  CurrentClothesList: Clothes[];
  ChangeCurrentClothesList: (newList:Clothes[]) => void;
  DeleteCurrentClothes: (deleteClotehs:Clothes) => void;
  AddClothesList: Clothes[]
  ChangeAddClothesList: (newList:Clothes[]) => void;
  AddCurrentClothes: (addClothes:Clothes) => void;
  DeleteAddCurrentClothes: (addDeleteClotehs:Clothes) => void;
}

export const useCurrentClothesStore = create<CurrentClothesState>((set) => ({
    CurrentClothesList: [],
    ChangeCurrentClothesList: (newList:Clothes[]) => set({CurrentClothesList:newList}),
    DeleteCurrentClothes: (deleteClothes: Clothes) =>
      set((state) => ({
          CurrentClothesList: state.CurrentClothesList.filter(
              (clothes) => clothes.clothingId !== deleteClothes.clothingId
          ),
      })),
    AddClothesList: [],
    ChangeAddClothesList: (newList:Clothes[]) => set({AddClothesList:newList}),
    AddCurrentClothes: (addClothes: Clothes) => set((state) => ({
      AddClothesList: [...state.AddClothesList, addClothes],
    })),
    DeleteAddCurrentClothes: (addDeleteClothes:Clothes) => set((state) => ({
      AddClothesList: state.AddClothesList.filter(
          (clothes) => clothes.clothingId !== addDeleteClothes.clothingId
      ),
  })),
}));
