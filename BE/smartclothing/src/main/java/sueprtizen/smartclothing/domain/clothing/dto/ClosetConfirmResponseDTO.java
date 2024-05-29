package sueprtizen.smartclothing.domain.clothing.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import sueprtizen.smartclothing.domain.clothing.entity.Clothing;
import sueprtizen.smartclothing.domain.clothing.entity.UserClothing;

public record ClosetConfirmResponseDTO(
        @Schema(description = "옷 아이디", example = "1")
        int clothingId,

        @Schema(description = "옷 이름", example = "티셔츠")
        String clothingName,
        @Schema(description = "옷 이미지 주소", example = "aaaa/bbb.png")
        String clothingImagePath
) {
        public static ClosetConfirmResponseDTO createFromUserClothing(UserClothing userClothing) {
                Clothing clothing = userClothing.getClothing();
                return new ClosetConfirmResponseDTO(
                        clothing.getClothingId(),
                        userClothing.getClothingName(),
                        clothing.getClothingDetail().getClothingImgPath()
                );
        }
}