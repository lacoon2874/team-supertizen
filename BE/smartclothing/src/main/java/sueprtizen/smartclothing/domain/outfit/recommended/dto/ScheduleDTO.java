package sueprtizen.smartclothing.domain.outfit.recommended.dto;

import lombok.Builder;

@Builder
public record ScheduleDTO(
        int scheduleId,
        String date,
        String scheduleCategory,
        String outfitImagePath
) {
}
