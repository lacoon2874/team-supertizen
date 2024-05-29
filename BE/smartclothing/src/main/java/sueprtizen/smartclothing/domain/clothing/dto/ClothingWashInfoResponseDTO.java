package sueprtizen.smartclothing.domain.clothing.dto;

public record ClothingWashInfoResponseDTO(
        int clothingId,
        int wornCount,
        String lastWashDate
) {
}
