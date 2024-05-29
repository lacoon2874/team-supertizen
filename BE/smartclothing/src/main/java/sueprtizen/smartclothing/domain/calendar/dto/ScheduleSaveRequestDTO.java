package sueprtizen.smartclothing.domain.calendar.dto;

import java.util.List;

public record ScheduleSaveRequestDTO(
        String date,
        String title,
        String category,
        int locationKey,
        List<OutfitRequestDTO> clothing
) {
}
