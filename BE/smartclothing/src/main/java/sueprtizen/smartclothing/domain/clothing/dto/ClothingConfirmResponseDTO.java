package sueprtizen.smartclothing.domain.clothing.dto;

import sueprtizen.smartclothing.domain.clothing.entity.Clothing;
import sueprtizen.smartclothing.domain.clothing.entity.ClothingSeason;
import sueprtizen.smartclothing.domain.clothing.entity.UserClothing;

import java.util.List;

public record ClothingConfirmResponseDTO(
        int clothingId,
        String clothingName,
        String category,
        List<String> styles,
        List<Integer> seasons,
        String clothingImgPath,
        List<String> textures,
        List<SharedUserDTO> sharedUsers,

        boolean isMyClothing

) {
    public ClothingConfirmResponseDTO(Clothing clothing, UserClothing userClothing, List<SharedUserDTO> sharedUserDTOList, boolean isMyClothing) {
        this(clothing.getClothingId(),
                userClothing.getClothingName(),
                clothing.getCategory(),
                clothing.getClothingStyleList().stream().map(clothingStyle -> clothingStyle.getStyle().getStyleName()).toList(),
                userClothing.getClothingSeasonList().stream().map(ClothingSeason::getMonth).sorted().toList(),
                clothing.getClothingDetail().getClothingImgPath(),
                clothing.getClothingDetail().getClothingTextures().stream().map(clothingTexture -> clothingTexture.getTexture().getTextureName()).toList(),
                sharedUserDTOList,
                isMyClothing
        );
    }
}
