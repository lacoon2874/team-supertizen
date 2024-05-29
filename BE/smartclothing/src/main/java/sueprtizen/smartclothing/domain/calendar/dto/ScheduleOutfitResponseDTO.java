package sueprtizen.smartclothing.domain.calendar.dto;

import java.util.List;

public record ScheduleOutfitResponseDTO(
        int scheduleId,
        String scheduleCategory,
        String scheduleName,
        String outfitImagePath,

        List<ClothingInfoDTO> clothing
) {
}
