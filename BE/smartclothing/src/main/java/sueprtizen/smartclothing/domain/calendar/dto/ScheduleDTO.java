package sueprtizen.smartclothing.domain.calendar.dto;

public record ScheduleDTO(
        int scheduleId,
        String scheduleName,
        String scheduleCategory,
        String date
) {
}
