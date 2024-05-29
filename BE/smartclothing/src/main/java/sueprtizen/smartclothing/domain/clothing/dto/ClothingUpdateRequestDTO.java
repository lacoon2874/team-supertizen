package sueprtizen.smartclothing.domain.clothing.dto;

import java.util.List;

public record ClothingUpdateRequestDTO(
        int clothingId,
        String clothingName,
        String category,
        List<String> textures,
        List<String> styles,
        List<Integer> seasons,
        List<Integer> sharedUserIds
) {
}
