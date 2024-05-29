package sueprtizen.smartclothing.domain.weather.dto;

public record WeatherResponseDTO(
        int icon,
        double lowestTemperature,
        double highestTemperature,
        double lowestRealFeelingTemperature,
        double highestRealFeelingTemperature,
        double precipitation,
        double snowCover,
        double humidity,
        double windSpeed,
        double solarIrradiance,
        double UV,
        String UVMessage
) {
}