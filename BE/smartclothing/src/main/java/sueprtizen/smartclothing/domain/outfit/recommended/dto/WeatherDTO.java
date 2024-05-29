package sueprtizen.smartclothing.domain.outfit.recommended.dto;

import lombok.Builder;

@Builder
public record WeatherDTO(
        int icon,
        double lowestTemperature,
        double highestTemperature
) {
}
