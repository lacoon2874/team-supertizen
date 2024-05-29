export const ACTION_TYPES = {
  set: "set",
  updateClothingName: "updateClothingName",
  updateCategory: "updateCategory",
  updateTexture: "updateTexture",
  deleteTexture: "deleteTexture",
  toggleMonth: "toggleMonth",
  updateStyle: "updateStyle",
  deleteStyle: "deleteStyle",
  updateSharedUsers: "updateSharedUsers",
  deleteSharedUsers: "deleteSharedUsers",
};

export const initialState = {
  clothingId: 0,
  clothingName: "",
  category: "string",
  styles: ["string"],
  seasons: [0],
  clothingImgPath: "string",
  textures: [""],
  sharedUsers: [
    {
      userId: 0,
      userName: "string",
    },
  ],
  isMyClothing: true,
};

export const clothesreducer = (state, action) => {
  switch (action.type) {
    case ACTION_TYPES.set:
      return { ...action.payload };
    case ACTION_TYPES.updateClothingName:
      return { ...state, clothingName: action.payload };
    case ACTION_TYPES.updateCategory:
      return { ...state, category: action.payload };
    case ACTION_TYPES.updateTexture: {
      const isTextureExists = state.textures.includes(action.payload);
      const updatedTextures = isTextureExists
        ? [...state.textures]
        : [...state.textures, action.payload];
      return { ...state, textures: updatedTextures };
    }
    case ACTION_TYPES.deleteTexture: {
      const updatedTextures = state.textures.filter(
        (texture) => texture !== action.payload
      );
      return { ...state, textures: updatedTextures };
    }

    case ACTION_TYPES.toggleMonth: {
      const updatedSeasons = state.seasons.includes(action.payload)
        ? state.seasons.filter((season) => season !== action.payload)
        : [...state.seasons, action.payload];
      return { ...state, seasons: updatedSeasons };
    }

    case ACTION_TYPES.updateStyle: {
      const isStyleExists = state.styles.includes(action.payload);
      const updatedStyles = isStyleExists
        ? [...state.styles]
        : [...state.styles, action.payload];
      return { ...state, styles: updatedStyles };
    }
    case ACTION_TYPES.deleteStyle: {
      const updatedStyles = state.styles.filter(
        (style) => style !== action.payload
      );
      return { ...state, styles: updatedStyles };
    }
    ////////////////////////////////////////////////////////////
    case ACTION_TYPES.updateSharedUsers: {
      // 새로운 공유 사용자 정보가 action.payload로 전달됨
      // 이 예시에서는 action.payload가 { userId: number, userName: string } 형태로 전달된다고 가정
      const isUserExists = state.sharedUsers.some(
        (user) => user.userId === action.payload.userId
      );
      const updatedSharedUsers = isUserExists
        ? state.sharedUsers.map((user) =>
            user.userId === action.payload.userId ? action.payload : user
          )
        : [...state.sharedUsers, action.payload];
      return { ...state, sharedUsers: updatedSharedUsers };
    }
    case ACTION_TYPES.deleteSharedUsers: {
      // 삭제할 사용자의 ID가 action.payload로 전달됨
      const updatedSharedUsers = state.sharedUsers.filter(
        (user) => user.userId !== action.payload
      );
      return { ...state, sharedUsers: updatedSharedUsers };
    }

    default:
      return state;
  }
};
