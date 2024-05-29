package sueprtizen.smartclothing.domain.calendar.dto;

public record OutfitResponseDTO(
        int clothingId,
        String clothingImage,
        int x,
        int y,
        int width,
        int height
) {
}
