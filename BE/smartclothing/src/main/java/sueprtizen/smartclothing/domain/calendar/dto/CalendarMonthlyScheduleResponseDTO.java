package sueprtizen.smartclothing.domain.calendar.dto;

import java.util.List;

public record CalendarMonthlyScheduleResponseDTO(
        List<ScheduleDTO> scheduleList
) {
}
