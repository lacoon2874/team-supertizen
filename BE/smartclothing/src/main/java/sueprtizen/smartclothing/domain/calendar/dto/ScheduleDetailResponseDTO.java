package sueprtizen.smartclothing.domain.calendar.dto;

import java.util.List;

public record ScheduleDetailResponseDTO(
        ScheduleDTO schedule,
        List<OutfitResponseDTO> clothingList
) {
}
