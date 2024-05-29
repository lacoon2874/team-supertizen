package sueprtizen.smartclothing.domain.weather.exception;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum WeatherErrorCode {
    WEATHER_NOT_FOUND(HttpStatus.NOT_FOUND, "해당 날씨를 찾을 수 없습니다.");

    private final HttpStatus httpStatus;
    private final String errorMessage;
}
