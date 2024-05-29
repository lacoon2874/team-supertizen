package sueprtizen.smartclothing.domain.outfit.recommended.dto;

import lombok.Builder;

@Builder
public record ClothingInPastOutfitResponseDTO(
        int clothingId,
        String clothingName,
        String clothingImagePath,
        int x,
        int y,
        int width,
        int height
) {

}
