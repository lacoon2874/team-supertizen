import {create} from 'zustand';


interface LocateState {
  Sido: string;
  Sigungu: string;
  LocateInfo: number;
  ChangeLocateInfo: (newSido:string, newSigungu:string, newLocateInfo:number ) => void;
}

export const useLocateStore = create<LocateState>((set) => ({
    Sido: '',
    Sigungu: '',
    LocateInfo: 0,
    ChangeLocateInfo: ( newSido:string, newSigungu:string, newLocateInfo:number ) => {
      localStorage.setItem("locate", newLocateInfo.toString());
      return set({ Sido: newSido, Sigungu: newSigungu, LocateInfo: newLocateInfo})
    },
}));
