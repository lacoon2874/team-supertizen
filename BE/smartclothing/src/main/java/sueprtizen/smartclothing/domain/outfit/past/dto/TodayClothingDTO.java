package sueprtizen.smartclothing.domain.outfit.past.dto;

import lombok.Builder;

@Builder
public record TodayClothingDTO(
        int clothingId,
        String clothingName,
        String clothingImagePath
) {

}
